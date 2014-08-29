const Hearts = 0;
const Spades = 1;
const Diamonds = 2;
const Clubs = 3;
const Joker = 4;

const Suits = ["hearts", "spades", "diams", "clubs", "joker"];
const Symbols = ["&hearts;", "&spades;", "&diams;", "&clubs;", "Joker"];

const Ace = 1;
const Jack = 11;
const Queen = 12;
const King = 13;

function Card(rank, suit, el) {
	if (suit === undefined) {
		suit = Joker;
		rank = "+"
	} else {	
		if (isNaN(rank) || rank < Ace || rank > King) {
			throw new RangeError("A card must have a value of Ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen or King");
		}
		
		if (isNaN(suit) || suit < Hearts || suit > Clubs) {
			throw new RangeError("A card must have a suit of Hearts, Spades, Diamonds or Clubs");
		}
	}
	
	this.rank = rank;
	this.suit = suit;
	this.up = false;
	
	if (!el) {
		el = document.createElement("div");
		//el.setAttribute("href", "#");
	}
	
	this.attach(el);	
}

Card.prototype.refresh = function () {
	this.attach(this.el);
}

Card.prototype.flip = function() {
	this.up = !this.up;
	this.refresh();
}

Card.prototype.getRankLetter = function() {
	switch (this.rank) {		
		case Ace: return "A";
		case Jack: return "J";
		case Queen: return "Q";
		case King: return "K";
		default: return this.rank + "";		
	}
}

Card.prototype.getRankClass = function() {
	if (this.rank == "+") {
		return "big";
	} else {
		return "rank-" + this.getRankLetter().toLowerCase();
	}
}

Card.prototype.getSuitClass = function() {
	return Suits[this.suit];	
}

const dotPatterns = [
undefined,
["ace"],
["spotB1", "spotB5"],
["spotB1", "spotB3", "spotB5"],
["spotA1", "spotA5", "spotC1", "spotC5"],
["spotA1", "spotA5", "spotC1", "spotC5", "spotB3"],
["spotA1", "spotA5", "spotC1", "spotC5", "spotA3", "spotC3"],
["spotA1", "spotA5", "spotC1", "spotC5", "spotA3", "spotC3", "spotB2"],
["spotA1", "spotA5", "spotC1", "spotC5", "spotA3", "spotC3", "spotB2", "spotB4"],
["spotA1", "spotA2", "spotA4", "spotA5", "spotC1", "spotC2", "spotC4", "spotC5", "spotB3"],
["spotA1", "spotA2", "spotA4", "spotA5", "spotC1", "spotC2", "spotC4", "spotC5", "spotB2", "spotB4"]
];

Card.prototype.attach = function(el) {
	this.el = el;	
	this.el.setAttribute("class", "card");
	this.el.innerHTML = "";
	if (this.up) {
		var front = this.el.appendChild(document.createElement("div"));
		front.setAttribute("class", "front " + Suits[this.suit]);
		
		var index = front.appendChild(document.createElement("div"));
		index.setAttribute("class", "index");
		index.innerHTML = this.getRankLetter() + "<br/>" + Symbols[this.suit];
		
		index = front.appendChild(document.createElement("div"));
		index.setAttribute("class", "flipindex");
		index.innerHTML = this.getRankLetter() + "<br/>" + Symbols[this.suit];
				
		if (this.rank < 11) {
			for (var d = 0; d < this.rank; d++) {
				var dot = front.appendChild(document.createElement("div"));		
				dot.innerHTML = Symbols[this.suit];		
				dot.setAttribute("class", dotPatterns[this.rank][d]);				
			}
		} else {
			var img = front.appendChild(document.createElement("img"));
			img.setAttribute("class", "face");
			img.setAttribute("src", "http://www.brainjar.com/css/cards/graphics/" + (this.rank == Jack ? "jack" : this.rank == Queen ? "queen" : "king") + ".gif");			
			img.setAttribute("draggable", "false");
			
			var dot = front.appendChild(document.createElement("div"));		
			dot.innerHTML = Symbols[this.suit];		
			dot.setAttribute("class", "spotA1");	
			dot = front.appendChild(document.createElement("div"));		
			dot.innerHTML = Symbols[this.suit];					
			dot.setAttribute("class", "spotC5");				
		}
	}	else {
		this.el.setAttribute("class", "card down");
	}

	this.el.card = this;
}

function Stack() {	
}

Stack.prototype.attach = function(el) {
	this.el = el;
	this.el.setAttribute("class", this.constructor.name.toLowerCase());	
}

function pushItem(list, item) {	
	var li = list.appendChild(document.createElement("li"));
	li.appendChild(item);
	if (!item.card.up) {
		li.setAttribute("class", "down");
	}
}

function popItem(list) {
	if (list.children.length == 0) return undefined;
	var li = list.children[list.children.length - 1];	
	var item = li.children[0];	
	li.removeChild(item);
	list.removeChild(li);	
	return item.card;
	
}

Stack.prototype.push = function (card) {
	pushItem(this.el, card.el);
}

Stack.prototype.pop = function () {
	return popItem(this.el);
}

Stack.prototype.getLength= function () {
	return this.el.children.length;
}

Stack.prototype.top = function () {
	if (this.el.children.length == 0) return undefined;
	var li = this.el.children[this.el.children.length - 1];	
	var item = li.children[0];		
	return item.card;
}

function Deck(el) {
	this.attach(el);
	el.setAttribute("class", "deck");
	for (var s = Hearts; s <= Clubs; s++) {
		for (var r = Ace; r <= King; r++) {
			var card = new Card(r, s); 
			this.push(card);
			//card.flip();
		}
	}
}

Deck.prototype = new Stack();

function Pile(el) {
	this.el = el;
	el.setAttribute("class", "pile");
}

Pile.prototype = new Stack();

function Foundation(el) {
	this.el = el;
	el.setAttribute("class", "foundation");
}

Foundation.prototype = new Stack();

function PlayingArea(el) {
	this.el = el;
	el.setAttribute("class", "table");
}

PlayingArea.prototype = new Stack();
