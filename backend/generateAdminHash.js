import bcrypt from "bcrypt";
import readline from "readline/promises";
import { stdin, stdout } from "process";
const terminal = readline.createInterface({ input: stdin, output: stdout });
try {
  const password = await terminal.question("Enter a strong admin password (input will be visible): ");
  if (password.length < 12) throw new Error("Use at least 12 characters.");
  console.log("\nAdd this value to backend/.env as ADMIN_PASSWORD_HASH:\n" + await bcrypt.hash(password, 12));
} finally { terminal.close(); }
