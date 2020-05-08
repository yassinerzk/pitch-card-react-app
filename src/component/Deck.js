import React, { Component } from "react";
import Card from "./Card";
import axios from "axios";

import "./Deck.css";

export default class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      pitchLeft: "",
      cards: [],
    };
    this.loadNewCard = this.loadNewCard.bind(this);
    this.display = this.display.bind(this);
  }
  async componentWillMount() {
    console.log("COMPONENT WILL MOUNTH");
    let url = "https://deckofcardsapi.com/api/deck/new/shuffle/";

    await axios.get(url).then((resp) => {
      this.setState({ id: resp.data.deck_id, pitchLeft: resp.data.remaining });
    });
  }

  async loadNewCard() {
    try {
      if (this.state.pitchLeft > 0) {
        console.log("LOADING NEW CARD");
        let id = this.state.id;
        let url = `https://deckofcardsapi.com/api/deck/${id}/draw/`;
        await axios.get(url).then((resp) => {
          this.setState({ cards: [...this.state.cards, resp.data.cards[0]] });
          this.setState({ pitchLeft: this.state.pitchLeft - 1 });
          return resp.data;
        });

        console.log("after");
      } else {
        alert("No more pitch left");
      }
    } catch (error) {
      alert(error);
    }
  }
  display() {
    return (
      <div>
        {this.state.cards.map((card) => (
          <Card
            name={`${card.value} OF ${card.suit}`}
            key={card.code}
            url={card.image}
          />
        ))}
      </div>
    );
  }
  render() {
    return (
      <div className="Deck">
        <h1 className="Deck-title">♦♦♦ Card Dealer ♦♦♦</h1>
        <h2 className="Deck-title">
          ♦ remaining: <strong>{this.state.pitchLeft} ♦</strong>
        </h2>

        <button className="Deck-btn" onClick={this.loadNewCard}>
          Load Card
        </button>
        <div className="Deck-cardarea">{this.display()}</div>
      </div>
    );
  }
}
