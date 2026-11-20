import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const deliveryCharge = 50;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const buildOrder = async (items) => {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) throw new Error("Your cart is empty or contains too many items");
  const normalized = [];
  let restaurantId = null;
  for (const entry of items) {
    const id = String(entry?._id || entry?.id || "");
    const quantity = Number(entry?.quantity);
    if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new Error("Invalid cart item or quantity");
    const food = await foodModel.findById(id).lean();
    if (!food) throw new Error("One of the selected dishes is no longer available");
    if (food.restaurantId) { if (restaurantId && String(restaurantId) !== String(food.restaurantId)) throw new Error("Please order from one restaurant at a time"); restaurantId = food.restaurantId; }
    if (food.isAvailable === false) throw new Error(`${food.name} is currently unavailable`);
    normalized.push({ _id: food._id, name: food.name, price: food.price, quantity, image: food.image, category: food.category });
  }
  const subtotal = normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items: normalized, subtotal, restaurantId, amount: subtotal + deliveryCharge };
};

const validateAddress = (address) => {
  const required = ["firstName", "lastName", "email", "street", "city", "state", "zipcode", "country", "phone"];
  if (!address || required.some((key) => !String(address[key] || "").trim())) throw new Error("Please provide complete delivery information");
  if (String(address.phone).replace(/\D/g, "").length < 8) throw new Error("Please enter a valid phone number");
  return Object.fromEntries(required.map((key) => [key, String(address[key]).trim().slice(0, 150)]));
};

const placeOrderCod = async (req, res) => {
  try {
    const { items, amount, subtotal, restaurantId } = await buildOrder(req.body.items);
    const address = validateAddress(req.body.address);
    const order = await orderModel.create({ userId: req.auth.id, items, subtotal, amount, restaurantId, address, payment: false, paymentStatus: "pending", paymentMethod: "COD", status: "pending", statusHistory: [{ status: "pending", at: new Date(), by: req.auth.id }] });
    await userModel.findByIdAndUpdate(req.auth.id, { cartData: {} });
    return res.status(201).json({ success: true, message: "Order placed successfully", data: { orderId: order._id, amount } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to place order" });
  }
};

const placeOrder = async (req, res) => {
  if (!stripe) return res.status(503).json({ success: false, message: "Online payment is not configured. Please choose cash on delivery." });
  let order;
  try {
    const { items, amount, subtotal, restaurantId } = await buildOrder(req.body.items);
    const address = validateAddress(req.body.address);
    order = await orderModel.create({ userId: req.auth.id, items, subtotal, amount, restaurantId, address, payment: false, paymentStatus: "pending", paymentMethod: "Stripe", status: "pending", statusHistory: [{ status: "pending", at: new Date(), by: req.auth.id }] });
    const lineItems = items.map((item) => ({ price_data: { currency: "inr", product_data: { name: item.name }, unit_amount: Math.round(item.price * 100) }, quantity: item.quantity }));
    lineItems.push({ price_data: { currency: "inr", product_data: { name: "Delivery Charge" }, unit_amount: deliveryCharge * 100 }, quantity: 1 });
    const session = await stripe.checkout.sessions.create({
      mode: "payment", line_items: lineItems, client_reference_id: String(order._id),
      metadata: { orderId: String(order._id), userId: String(req.auth.id) },
      success_url: `${frontendUrl}/verify?orderId=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/verify?orderId=${order._id}&cancelled=true`
    });
    order.stripeSessionId = session.id;
    await order.save();
    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    if (order) await orderModel.findByIdAndDelete(order._id).catch(() => {});
    return res.status(400).json({ success: false, message: error.message || "Unable to start payment" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 }).limit(500).lean();
    return res.json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to load orders" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.auth.id }).sort({ date: -1 }).lean();
    return res.json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to load your orders" });
  }
};

const updateStatus = async (req, res) => {
  const allowed = ["pending", "confirmed", "preparing", "ready_for_pickup", "assigned", "picked_up", "out_for_delivery", "delivered", "cancelled", "rejected", "Food Processing", "Out for delivery", "Delivered", "Cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid order status" });
  try {
    const order = await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Unable to update order status" });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const order = await orderModel.findOne({ _id: req.body.orderId, userId: req.auth.id, paymentMethod: "Stripe" });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.payment) return res.json({ success: true, message: "Payment already verified" });
    if (req.body.cancelled === "true") return res.json({ success: false, message: "Payment was cancelled" });
    if (!stripe || !req.body.sessionId) return res.status(400).json({ success: false, message: "Missing payment session" });
    const session = await stripe.checkout.sessions.retrieve(req.body.sessionId);
    if (session.id !== order.stripeSessionId || session.metadata?.userId !== req.auth.id || session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment could not be verified" });
    }
    order.payment = true;
    order.paymentStatus = "paid";
    await order.save();
    await userModel.findByIdAndUpdate(req.auth.id, { cartData: {} });
    return res.json({ success: true, message: "Payment verified" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };
