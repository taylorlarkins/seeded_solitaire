class Card {
    constructor(name, value, suit, color) {
        this.name = name;
        this.value = value;
        this.suit = suit;
        this.color = color;
        this.revealed = false;
        this.card_below = false;
    }

    toString() {
        return this.name;
    }
}

//Constants
SUIT_SYMBOLS = ["♥", "♦", "♣", "♠"];
VALUE_SYMBOLS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

//Create the deck
var deck = [];
for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 13; j++) {
        deck.push(new Card(`${SUIT_SYMBOLS[i]}${VALUE_SYMBOLS[j]}`, j + 1, SUIT_SYMBOLS[i], `${(i < 2) ? "Red" : "Black"}`));
    }
}

//Layout the cards
deck = shuffle(deck);
var draw_pile = deck.slice(0, 24);
var playing_table = [[deck[25], deck[26], [], [], [], [], []], [null, deck[46], deck[47], deck[48], deck[49], deck[50], deck[51]]];
var deck_pos = 27;
var cap = 2;
for(let i = 2; i < 7; i++) {
    for(let j = 0; j < cap; j++) {
        playing_table[0][i].push(deck[deck_pos]);
        deck_pos++;
    }
    cap++
}
for(let i = 0; i < 12; i++) {
    playing_table.push([null, null, null, null, null, null, null])
}
var flipped_pile = [];
var hearts_pile = [];
var diamonds_pile = [];
var clovers_pile = [];
var spades_pile = [];

const playing_table_E = document.getElementById("playing_table")
for(let i = 0; i < 98; i++) {
    var newDiv = document.createElement("div");
    let second_class = null
    if(i == 0) {
        second_class = "face_up";
        playing_table[0][0].revealed = true;
        newDiv.innerText = playing_table[0][0].name
    } else if(7 < i && i < 14) {
        second_class = "face_up";
        playing_table[1][i-7].revealed = true;
        newDiv.innerText = playing_table[1][i % 7].name
    } else if(i < 7) {
        second_class = "face_down";
        newDiv.innerText = i
    } else {
        second_class = "empty";
    }
    newDiv.id = `playing_table_${i}`;
    newDiv.classList.add("card", second_class);
    playing_table_E.appendChild(newDiv);
}

//Functions
function shuffle(deck) {
    var shuffled_deck = []
    var selection = null;
    for(let i = deck.length; i > 1; i--) {
        selection =  Math.floor(Math.random() * i)
        shuffled_deck.push(deck[selection])
        deck.splice(selection, 1)
    }
    shuffled_deck.push(deck[0])
    return shuffled_deck
}