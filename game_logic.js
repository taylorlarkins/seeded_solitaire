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
var playing_table = [[deck[25], [deck[26]], [deck[27], deck[28]], [deck[29], deck[30], deck[31]], [deck[32], deck[33], deck[34], deck[35]], [deck[36], deck[37], deck[38], deck[39], deck[40]], [deck[41], deck[42], deck[43], deck[44], deck[45], deck[46]]], [null, deck[24], deck[47], deck[48], deck[49], deck[50], deck[51]]];
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
    if(card != null && card.name != undefined) {
        console.log(card.name);
        if(selected_card != null) {
            if(validate_move(selected_card, selected_id,  card, i)) {
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
    } else if(card == null && selected_card != null && i <= 6 && selected_card.value == 13) { //Moving a K to an empty column
        var king_e = document.getElementById(`playing_table_${selected_id}`);
        var target_e = document.getElementById(`playing_table_${i}`);
        target_e.innerText = selected_card.name;
        target_e.classList.replace("empty", "face_up");
        playing_table[loc[0]][loc[1]] = selected_card;
        king_e.innerText = "";
        king_e.classList.replace("face_up", "empty");
        playing_table[selected_loc[0]][selected_loc[1]] = null;
        if(playing_table[selected_loc[0] + 1][selected_loc[1]] != null) {
            move(playing_table[selected_loc[0] + 1][selected_loc[1]], selected_id + 7, [selected_loc[0] + 1, selected_loc[1]], i, [loc[0], loc[1]]);
        }
    }
}

function validate_move(card, card_id, target, target_id) {
    if(card != target && card.value + 1 == target.value && card.color != target.color && card_id != target_id + 7) {
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
    
    //Checks if a new card needs to be revealed.
    if(card_loc[0] == 1 && playing_table[0][card_loc[1]] != null && playing_table[0][card_loc[1]] != undefined) {
        var above = playing_table[0][card_loc[1]]
        var above_e = document.getElementById(`playing_table_${card_id - 7}`);
        var new_card = above.pop();
        if(above.length == 0) {
            above_e.innerText = new_card.name;
            card_e.innerText = "";
            playing_table[0][card_loc[1]] = new_card;
            playing_table[1][card_loc[1]] = null;
            above_e.classList.replace("face_down", "face_up");
            card_e.classList.replace("face_up", "empty");
        } else {
            card_e.innerText = new_card.name;
            playing_table[card_loc[0]][card_loc[1]] = new_card;
            above_e.innerText--;
        }
    } else {
        card_e.classList.replace("face_up", "empty");
        card_e.innerText = "";
        playing_table[card_loc[0]][card_loc[1]] = null;
    }

    //See if there is a card below that needs to be moved
    if(playing_table[card_loc[0] + 1][card_loc[1]] != null) {
        move(playing_table[card_loc[0] + 1][card_loc[1]], card_id + 7, [card_loc[0] + 1, card_loc[1]], target_id + 7, [target_loc[0] + 1, target_loc[1]])
    }
}

function remove_class(n, class_name) {
    document.getElementById(`playing_table_${n}`).classList.remove(class_name);
}

function add_class(n, class_name) {
    document.getElementById(`playing_table_${n}`).classList.add(class_name);
}