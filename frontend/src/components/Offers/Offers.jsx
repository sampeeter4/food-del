import React from 'react';
import './Offers.css';

const offers = [
  { tag: 'FAN FAVORITE', title: 'Make it a meal', description: 'Pair a main dish with a side and build a meal that feels just right.' },
  { tag: 'YOUR PICKS', title: 'A little something extra', description: 'Explore the menu for new flavors and familiar favorites.' },
];

const Offers = () => (
  <section className="offers-section" id="offers">
    <div className="section-eyebrow">More to enjoy</div>
    <h2>Find your next favorite</h2>
    <div className="offers-grid">
      {offers.map((offer) => (
        <article className="offer-card" key={offer.title}>
          <span>{offer.tag}</span>
          <h3>{offer.title}</h3>
          <p>{offer.description}</p>
          <a href="#explore-menu">Explore menu <span aria-hidden="true">→</span></a>
        </article>
      ))}
    </div>
  </section>
);

export default Offers;