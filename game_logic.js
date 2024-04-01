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
var playing_table = [[deck[25], [deck[26]], [], [], [], [], []], [null, deck[46], deck[47], deck[48], deck[49], deck[50], deck[51]]];
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
        playing_table[1][i % 7].revealed = true;
        newDiv.innerText = playing_table[1][i % 7].name
    } else if(i < 7) {
        second_class = "face_down";
        newDiv.innerText = i
    } else {
        second_class = "empty";
    }
    newDiv.id = `playing_table_${i}`;
    newDiv.addEventListener("click", () => {
        card_selection(i)
    });
    newDiv.classList.add("card", second_class);
    playing_table_E.appendChild(newDiv);
}

var selected_card = null;
var selected_id = null;
var selected_loc = null;

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

function card_selection(i) {
    var loc = [Math.floor(i / 7), i % 7];
    var card = playing_table[loc[0]][loc[1]];
    if(card != null && card.name != undefined) { //TODO: account for moving Ks to emtpy columns
        console.log(card.name);
        if(selected_card != null) {
            if(validate_move(selected_card, card)) {
                move(selected_card, selected_id, selected_loc, i, loc);
                remove_class(selected_id, "selected");
                selected_card = selected_id = selected_loc = null;
            } else {
                remove_class(selected_id, "selected");  
            }
        }
        selected_card = card;
        selected_id = i;
        selected_loc = loc;
        add_class(i, "selected");
    }
}

function validate_move(card, target) {
    if(card != target && card.value + 1 == target.value && card.color != target.color) {
        return true;
    }
    return false;
}

function move(card, card_id, card_loc, target_id, target_loc) {
    var card_e = document.getElementById(`playing_table_${card_id}`);
    var below_target_e = document.getElementById(`playing_table_${target_id + 7}`);
    
    below_target_e.innerText = card.name;
    below_target_e.classList.replace("empty", "face_up");
    playing_table[target_loc[0] + 1][target_loc[1]] = card;

    if(card_loc[0] == 1) {
        var above = playing_table[0][card_loc[1]]
        if(above != null &&  above.name == undefined) {
            var above_e = document.getElementById(`playing_table_${card_id - 7}`);
            var new_card = above.pop();
            if(above.length == 0) {
                above_e.innerText = new_card.name;
                playing_table[0][card_loc[1]] = new_card;
                above_e.classList.replace("face_down", "face_up");
                card_e.classList.replace("face_up", "empty");
                card_e.innerText = "";
            } else {
                card_e.innerText = new_card.name;
                playing_table[card_loc[0]][card_loc[1]] = new_card;
                above_e.innerText--;
            }
        }
    } else {
        card_e.classList.replace("face_up", "empty");
        card_e.innerText = "";
        playing_table[card_loc[0]][card_loc[1]] = null;
    }
}

function remove_class(n, class_name) {
    document.getElementById(`playing_table_${n}`).classList.remove(class_name);
}

function add_class(n, class_name) {
    document.getElementById(`playing_table_${n}`).classList.add(class_name);
}