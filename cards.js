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
	this.handlers = {};
}

Controller.prototype.generate = function (model, view) {
	this.model = model;
	this.view = view;
	for (var i in this.handlers) {
		this.view.element.addEventListener(i, this, false);
	}
}

Controller.prototype.get = function (property) {
	return this.model[property];
}

Controller.prototype.update = function (property, value) {
	this.model[property] = value;
	this.view.update(property);
}

Controller.prototype.handleEvent = function (ev) {
	return this.handlers[ev.type](ev, this);
}

// View
function View() {
	this.updaters = {};
}

View.prototype.update = function (property) {
	this.updaters[property](this);
}


View.prototype.generate = function (model, element) {
	this.model = model;
	this.element = element;
	for (var i in this.updaters) {
		this.update(i);
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

	this.generate(model, element);
}

CardView.prototype = new View();

function Card(rank, suit, up, draggable) {
	var model = new CardModel(rank, suit, up, draggable);
	var view = new CardView(model);
	/*
	this.__proto__.handlers.click = function (ev, controller) {
		controller.flip();
	}
	*/
	this.generate(model, view);
}

Card.prototype = new Controller();
	
Card.prototype.flip = function () {
	this.model.flip();
	this.view.update("up");
}

// Stack
function StackModel(className) {
	this.children = [];
	this.className = className ? className : "deck";
}

StackModel.prototype.addStandard = function () {
	for (var suit = 1; suit <= 4; suit++) {
		for (var rank = 1; rank < 14; rank++) {
			this.children.push(new Card(rank, suit, true, true));
		}
	}
}

StackModel.prototype.shuffle = function () {
	for (var i = this.children.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var a = this.children[i];
		this.children[i] = this.children[j];
		this.children[j] = a;
	}
}

function StackView(model) {
	var element = document.createElement("ul");
	element.className = model.className;	
	
	this.__proto__.updaters.children = function (view) {
		view.element.innerHTML = "";
		for (var i = 0; i < view.model.children.length; i++) {
			view.element.appendChild(view.model.children[i].view.element);
		}
	}

	this.generate(model, element);
}

StackView.prototype = new View();


function Stack(className) {
	var model = new StackModel(className);
	var view = new StackView(model);
	this.generate(model, view);
}

Stack.prototype = new Controller();

Stack.prototype.push = function (card) {
	this.model.children.push(card);
	this.view.update("children");
}

Stack.prototype.pop = function () {
	var card = this.model.children.pop();
	this.view.update("children");
	return card;
}

Stack.prototype.shuffle = function () {
	this.model.shuffle();
	this.view.update("children");
}