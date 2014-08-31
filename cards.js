var dragStack = [];

const RANK_NAMES = ["joker", "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
const SUIT_NAMES = ["joker", "spades", "hearts", "diamonds", "clubs"];
const SUIT_SYMBOLS = ["*", "&spades;", "&hearts;", "&diams;", "&clubs;"];
const RANK_DOTS = [
	["ace"],
	["ace"],
	["spotB1",           "spotB5"],
	["spotB1", "spotB3", "spotB5"],
	["spotA1",           "spotA5",
	 "spotC1",           "spotC5"],
	["spotA1",           "spotA5",
	           "spotB3",
	 "spotC1",           "spotC5"],
	["spotA1", "spotA3", "spotA5",
	 "spotC1", "spotC3", "spotC5"],
	["spotA1", "spotA3", "spotA5",
	     "spotB2",
	 "spotC1", "spotC3", "spotC5"],
	["spotA1", "spotA3", "spotA5",
	     "spotB2",    "spotB4",
	 "spotC1", "spotC3", "spotC5"],
	["spotA1",           "spotA5",
	     "spotA2",    "spotA4",	
	            "spotB3",
		 "spotC2",    "spotC4",	
	 "spotC1",           "spotC5"],
	["spotA1",           "spotA5",
	     "spotA2",    "spotA4",	
	     "spotB2",    "spotB4",
		 "spotC2",    "spotC4",	
	 "spotC1",           "spotC5"],
	["spotA1", "spotC5"],
	["spotA1", "spotC5"],
	["spotA1", "spotC5"]
];


// Controller
function Controller() {
}

Controller.prototype.generate = function (model, view) {
	this.model = model;
	this.view = view;
}

Controller.prototype.get = function (property) {
	return this.model[property];
}

Controller.prototype.update = function (property, value) {
	this.model[property] = value;
	this.view.update(property);
}

// View
function View() {
	this.updaters = {};
	this.update = function (property) {
		this.updaters[property](this);
	}
}

View.prototype.generate = function (model, element, properties) {
	this.model = model;
	this.element = element;
	for (var i in properties) {
		this.update(properties[i]);
	}
}

// Card
function CardModel(rank, suit, up, draggable) {
	this.rank = rank;
	this.suit = suit;
	this.up = up;
	this.draggable = draggable;
}

CardModel.prototype.flip = function () {
	this.up = !this.up;
}

// Getters an setters for CardModel
Object.defineProperty(CardModel.prototype, 'rank', {
	get: function () { if (this._suit == 0) { return 0; } return this._rank; },
    set: function(value) {
		if (value < 0 || value > 13) throw new RangeError("Rank must be between 0 (joker) and 13 (king)");
		this._rank = value;
	}
});

Object.defineProperty(CardModel.prototype, 'suit', {
	get: function () { if (this._rank == 0) { return 0; } return this._suit; },
    set: function(value) {
		if (value < 0 || value > 4) throw new RangeError("Suit must be between 0 and 4");
		this._suit = value;
	}
});

function CardView(model) {
	var element = document.createElement("li");
	element.className = "card";
	
	this.front = element.appendChild(document.createElement("div"));
	this.front.className = "front";
	this.face = this.front.appendChild(document.createElement("img"));
	this.face.className = "face";
	
	this.index1 = {element: this.front.appendChild(document.createElement("div"))};
	this.index1.element.className = "index";
	this.index1.rankDiv = this.index1.element.appendChild(document.createElement("div"));
	this.index1.rankDiv.className = "rank";
	this.index1.suitDiv = this.index1.element.appendChild(document.createElement("div"));
	this.index1.suitDiv.className = "suit";
	
	this.index2 = {element: this.front.appendChild(document.createElement("div"))};
	this.index2.element.classList.add("index");
	this.index2.element.classList.add("reverse");
	this.index2.rankDiv = this.index2.element.appendChild(document.createElement("div"));
	this.index2.rankDiv.className = "rank";
	this.index2.suitDiv = this.index2.element.appendChild(document.createElement("div"));
	this.index2.suitDiv.className = "suit";
	
	this.dots = [];
	var dot = this.front.appendChild(document.createElement("div"));
	dot.className = "ace";
	this.dots.push(dot);
	for (var c in "ABC") {
		var cn = "ABC"[c];
		for (var r = 1; r <= 5; r++) {
			var dot = this.front.appendChild(document.createElement("div"));
			dot.className = "spot" + cn + r;
			this.dots.push(dot);
		}
	}
	
	this.__proto__.updaters.suit = function (view) {
		console.log(view);
		for (var i in SUIT_NAMES) {
			if (i > 0) {
				view.element.classList.remove(SUIT_NAMES[i]);
			}
		}
		
		view.element.classList.add(SUIT_NAMES[view.model.suit]);

		for (var i in view.dots) {
			var dot = view.dots[i];
			dot.innerHTML = "";
			if (RANK_DOTS[view.model.rank].indexOf(dot.className) > -1) {
				dot.innerHTML = SUIT_SYMBOLS[view.model.suit];
			}
		}
		
		view.index1.suitDiv.innerHTML = SUIT_SYMBOLS[view.model.suit];
		view.index2.suitDiv.innerHTML = SUIT_SYMBOLS[view.model.suit];
	}
	
	this.__proto__.updaters.rank = function (view) {			
		if (view.model.rank >= 0 && view.model.rank < 11) {
			view.face.style.visibility = "hidden";
			view.face.setAttribute("src", "");
		} else {
			view.face.style.visibility = "inherit";
			view.face.setAttribute("src", "http://www.brainjar.com/css/cards/graphics/" + RANK_NAMES[view.model.rank] + ".gif");
		}
		
		for (var i in view.dots) {
			var dot = view.dots[i];
			dot.innerHTML = "";
			if (RANK_DOTS[view.model.rank].indexOf(dot.className) > -1) {
				dot.innerHTML = SUIT_SYMBOLS[view.model.suit];
			}
		}
		view.index1.rankDiv.innerHTML = view.model.rank > 10 ? RANK_NAMES[view.model.rank].charAt(0).toUpperCase() : view.model.rank == 1 ? "A" : RANK_NAMES[view.model.rank];
		view.index2.rankDiv.innerHTML = view.model.rank > 10 ? RANK_NAMES[view.model.rank].charAt(0).toUpperCase() : view.model.rank == 1 ? "A" : RANK_NAMES[view.model.rank];
		
		view.index1.suitDiv.innerHTML = SUIT_SYMBOLS[view.model.suit];
		view.index2.suitDiv.innerHTML = SUIT_SYMBOLS[view.model.suit];
	}
	
	this.__proto__.updaters.up = function (view) {
		if (view.model.up) {
			view.element.classList.add("up");
			view.element.appendChild(view.front);
		} else {
			view.element.classList.remove("up");
			view.element.removeChild(view.front);
		}
	}
	
	this.__proto__.updaters.draggable = function (view) {
		view.element.setAttribute("draggable", view.model.draggable);
	}

	this.generate(model, element, ["suit", "rank", "up", "draggable"]);

}

CardView.prototype = new View();

function Card(rank, suit, up, draggable) {
	var model = new CardModel(rank, suit, up, draggable);
	var view = new CardView(model);
	this.generate(model, view);
}

Card.prototype = new Controller();
	
Card.prototype.flip = function () {
	this.model.flip();
	this.view.update("up");
}

// Deck

function DeckView(model) {
}

function Deck() {
	var model = [];
	var view = new DeckView(model);
	this.generate(model, view);

	for (var suit = 1; suit <= 4; suit++) {
		for (var rank = 1; rank < 14; rank++) {
			this.push(new Card(rank, suit, true, true));
		}
	}

}

Deck.prototype = new Controller();

Deck.prototype.push = function (card) {
	this.model.push(card);
	this.view.update();
}







/*

function Front(rank, suit) {
	this.element = document.createElement("div");
	this.element.className = "front";
	this.face = this.element.appendChild(document.createElement("img"));
	this.face.className = "face";
	
	this.index1 = {element: this.element.appendChild(document.createElement("div"))};
	this.index1.element.className = "index";
	this.index1.rankDiv = this.index1.element.appendChild(document.createElement("div"));
	this.index1.rankDiv.className = "rank";
	this.index1.suitDiv = this.index1.element.appendChild(document.createElement("div"));
	this.index1.suitDiv.className = "suit";
	
	this.index2 = {element: this.element.appendChild(document.createElement("div"))};
	this.index2.element.classList.add("index");
	this.index2.element.classList.add("reverse");
	this.index2.rankDiv = this.index2.element.appendChild(document.createElement("div"));
	this.index2.rankDiv.className = "rank";
	this.index2.suitDiv = this.index2.element.appendChild(document.createElement("div"));
	this.index2.suitDiv.className = "suit";
	
	this.dots = [];
	var dot = this.element.appendChild(document.createElement("div"));
	dot.className = "ace";
	this.dots.push(dot);
	for (var c in "ABC") {
		var cn = "ABC"[c];
		for (var r = 1; r <= 5; r++) {
			var dot = this.element.appendChild(document.createElement("div"));
			dot.className = "spot" + cn + r;
			this.dots.push(dot);
		}
	}
	
	this.rank = rank;
	this.suit = suit;
}

Object.defineProperty(Front.prototype, 'rank', {
	get: function () { return this._rank; },
    set: function(value) {
		this._rank = value;
		if (this.rank > 0 && this.rank < 11) {
			this.face.style.visibility = "hidden";
		} else {
			this.face.style.visibility = "visible";
			this.face.setAttribute("src", "http://www.brainjar.com/css/cards/graphics/" + RANK_NAMES[this.rank] + ".gif");
		}
		for (var i in this.dots) {
			var dot = this.dots[i];
			dot.innerHTML = "";
			if (RANK_DOTS[this.rank].indexOf(dot.className) > -1) {
				dot.innerHTML = SUIT_SYMBOLS[this.suit];
			}
		}
		this.index1.rankDiv.innerHTML = isNaN(RANK_NAMES[this.rank]) ? RANK_NAMES[this.rank].charAt(0).toUpperCase() : RANK_NAMES[this.rank];
		this.index2.rankDiv.innerHTML = isNaN(RANK_NAMES[this.rank]) ? RANK_NAMES[this.rank].charAt(0).toUpperCase() : RANK_NAMES[this.rank];
	}
});

Object.defineProperty(Front.prototype, 'suit', {
	get: function () { return this._suit; },
    set: function(value) {
		this._suit = value;
		for (var i in SUIT_NAMES) {
			if (i > 0) {
				this.element.classList.remove(SUIT_NAMES[i]);
			}
		}
		
		this.element.classList.add(SUIT_NAMES[this.suit]);
		
		for (var i in this.dots) {
			var dot = this.dots[i];
			dot.innerHTML = "";
			if (RANK_DOTS[this.rank].indexOf(dot.className) > -1) {
				dot.innerHTML = SUIT_SYMBOLS[this.suit];
			}
		}
		this.index1.suitDiv.innerHTML = SUIT_SYMBOLS[this.suit];
		this.index2.suitDiv.innerHTML = SUIT_SYMBOLS[this.suit];
    }
});


function Card(rank, suit, up) {
	this.element = document.createElement("li");
	this.element.className = "card";
	this.front = new Front(rank, suit);
	this.element.appendChild(this.front.element);
	this.rank = rank;
	this.suit = suit;
	this.up = up;
	this.draggable = false;
	this.element.addEventListener("click", this, false);
	this.element.addEventListener("dragstart", this, false);
	this.element.addEventListener("dragover", this, false);
	this.element.addEventListener("dragleave", this, false);
	this.element.addEventListener("dragend", this, false);
	this.element.addEventListener("drop", this, false);
}

Card.prototype.flip = function () {
	this.up = !this.up;
}

Card.prototype.handleEvent = function(e) {
    switch (e.type) {
        case "click": this.onclick(e); break;
        case "dragstart": this.ondragstart(e); break;
		case "dragover": this.ondragover(e); break;
		case "dragleave": this.ondragleave(e); break;
		case "dragend": this.ondragend(e); break;
		case "drop": this.ondrop(e); break;
    }
}

Card.prototype.onclick = function(ev) {
}

Card.prototype.ondragstart = function(ev) {
	console.log(this.up, this.draggable);
	if (this.up && this.draggable) {
		var parent = this.element.parentElement;
		var atCard = false;
		for (var i = 0; i < parent.children.length; i++) {
			if (parent.children[i] == this.element) {
				atCard = true;
			}
			if (atCard) {
				dragStack.push(parent.children[i]);
			}
		}
	}
}

Card.prototype.ondragover = function(ev) {
}

Card.prototype.ondragleave = function(ev) {
}

Card.prototype.ondragend = function(ev) {
}

Card.prototype.ondrop = function(ev) {
}

Object.defineProperty(Card.prototype, 'rank', {
	get: function () { return this._rank; },
    set: function(value) {
		if (value < 0 || value > 13) throw new RangeError("Rank must be between 0 (joker) and 13 (king)");
		this._rank = value;
		this.front.rank = this.rank;
	}
});

Object.defineProperty(Card.prototype, 'suit', {
	get: function () { return this._suit; },
    set: function(value) {
		if (value < 0 || value > 4) throw new RangeError("Suit must be between 0 (joker) and 4 (clubs)");
		this._suit = value;
		this.front.suit = this.suit;
	}
});

Object.defineProperty(Card.prototype, 'up', {
	get: function () { return this._up; },
    set: function(value) {
		this._up = value ? true : false;
		if (this.up) {
			this.element.classList.add("up");
		} else {
			this.element.classList.remove("up");
		}
	}
});

Object.defineProperty(Card.prototype, 'draggable', {
	get: function () { return this._draggable; },
    set: function(value) {
		this._draggable = value;
		this.element.setAttribute("draggable", value);
	}
});

function Deck() {
	this.element = document.createElement("ul");
	this.element.className = "deck";
	for (var suit = 1; suit <= 4; suit++) {
		for (var rank = 1; rank < 14; rank++) {
			var card = new Card(rank, suit, true);
			card.draggable = true;
			this.element.appendChild(card.element);
		}
	}
}

Deck.prototype.shuffle = function () {
	for (var i = this.element.children.length - 1; i > 1; i++) {
		var j = Math.floor(Math.random() * i - 1);
		var a = this.element.children[i];
		var b = this.element.children[j];
		this.element.insertBefore(b, a);
		this.element.insertBefore(a, this.element.children[j]);
	}
}

/*
var Front = new Proxy(HTMLDivElement, {
	construct: function () {
	},
});
*/
/*
function makeFront(rank, suit) {
	var view = document.createElement("div");
	view.classList.add("face");
	
	for (var c in "ABC") {
		for (var r = 1; r <= 5; r++) {
			var dot = view.appendChild(document.createElement("div"));
			dot.className = "spot" + c + r;
		}
	}
	
	var handler = {
		get: function (target, name, receiver) {
			switch (prop) {
				case "rank":
					var rank = target.querySelector(".index>.rank").innerHTML;
					switch (rank) {
						case "A": return 1;
						case "J": return 11;
						case "Q": return 12;
						case "K": return 13;
						default:
							return Number(rank);
					}
				case "suit":
					var suit = target.querySelector(".index>.suit").innerHTML;
					switch (rank) {
						case "A": return 1;
						case "J": return 11;
						case "Q": return 12;
						case "K": return 13;
						default:
							return Number(rank);
					}

			}
			return target[name];
		},
		set: function (obj, prop, value) {
			obj[prop] = value;
			switch (prop) {
				case "rank":
					obj.index1.rankDiv.innerHTML = RANK_NAMES[obj.rank].charAt(0).toUpperCase();
					obj.index2.rankDiv.innerHTML = RANK_NAMES[obj.rank].charAt(0).toUpperCase();
					break;
				case "suit":
					obj.index1.rankDiv.innerHTML = SUIT_SYMBOLS[obj.suit];
					obj.index2.rankDiv.innerHTML = SUIT_SYMBOLS[obj.suit];
					for (var i = 0; i < obj.dots.length; i++) {
						dots[i].innerHTML = SUIT_SYMBOLS[obj.suit];
					}
					break;
			}
		}
	};
	return new Proxy(view, handler);	
}

function makeCard(suit, rank, up) {
	var card = document.createElement("li");
	card.classList.add("card");
	
	var front = card.appendChild(document.createElement("div"));
	front.classList.add("front");
	if (up) {
		front.classList.add("up");
	}
	
	var index1 = front.appendChild(document.createElement("div"));
	index1.classList.add("index");
	
	var index2 = front.appendChild(document.createElement("div"));
	index2.classList.add("index");
	index2.classList.add("reverse");
	
	index1.innerHTML = index2.innerHTML = RANK_NAMES[rank].charAt(0).toUpperCase() + "<br/>" + SUIT_SYMBOLS[suit];
	
	// TODO: Add dots
	
	return card;
}

function makeStack(className) {
	var stack = document.createElement("ul");
	stack.classList.add(className);
	return stack;
}

function makeDeck() {
	var deck = makeStack("deck");
	for (var suit = 1; suit <= 4; suit++) {
		for (var rank = 1; rank < 14; rank++) {
			var card = makeCard(suit, rank, true);
			deck.appendChild(card);
		}
	}	
	return deck;
}
*/