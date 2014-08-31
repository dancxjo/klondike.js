var originStack = null;
var dragIndex = null;

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

Controller.prototype.generate = function (model, view, handlers) {
	this.model = model;
	this.handlers = handlers;
	this.view = view;
	this.model.controller = this;
	this.view.controller = this;
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

Controller.prototype.addHandler = function (name, handler) {
	if (this.handlers[name]) {
		this.removeHandler(name);
	}
	this.handlers[name] = handler;
	this.view.element.addEventListener(name, this, false);
}

Controller.prototype.removeHandler = function (name) {
	this.view.element.removeEventListener(name, this.handlers[name]);
	delete this.handlers[name];
}

// View
function View() {
}

View.prototype.update = function (property) {
	this.updaters[property](this);
}


View.prototype.generate = function (model, element, updaters) {
	this.model = model;
	this.element = element;
	this.updaters = updaters;
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
	var element = document.createElement("div");
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
	
	var updaters = {};
	
	updaters.suit = function (view) {
		for (var i in SUIT_NAMES) {
			if (i > 0) {
				view.front.classList.remove(SUIT_NAMES[i]);
			}
		}
		
		view.front.classList.add(SUIT_NAMES[view.model.suit]);

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
	
	updaters.rank = function (view) {			
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
	
	updaters.up = function (view) {
		if (view.model.up) {
			view.element.classList.add("up");
			view.element.appendChild(view.front);
		} else {
			view.element.classList.remove("up");
			view.element.removeChild(view.front);
		}
	}
	
	updaters.draggable = function (view) {
		view.element.setAttribute("draggable", view.model.draggable);
	}

	this.generate(model, element, updaters);
}

CardView.prototype = new View();

function Card(rank, suit, up, draggable) {
	var model = new CardModel(rank, suit, up, draggable);
	var view = new CardView(model);
	var handlers = {};
	/*
	handlers.click = function (ev, controller) {
		controller.flip();
	}
	*/
	this.generate(model, view, handlers);
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

StackModel.prototype.generate = function () {
	for (var suit = 1; suit <= 4; suit++) {
		for (var rank = 1; rank < 14; rank++) {
			var card = new Card(rank, suit, false, false);
			this.children.push(card);
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
	var updaters = {};
	updaters.children = function (view) {
		view.element.innerHTML = "";
		for (var i = 0; i < view.model.children.length; i++) {
			var li = view.element.appendChild(document.createElement("li"));
			if (!view.model.children[i].model.up) {
				li.classList.add("down");
			}
			li.appendChild(view.model.children[i].view.element);
		}
	}

	this.generate(model, element, updaters);
}

StackView.prototype = new View();

function PileView(model) {
	var element = document.createElement("ul");
	element.className = model.className;	
	var updaters = {};
	updaters.children = function (view) {
		view.element.innerHTML = "";
		// Add all the down cards
		for (var i = 0; i < view.model.children.length; i++) {
			if (!view.model.children[i].model.up) {
				var li = view.element.appendChild(document.createElement("li"));
				li.classList.add("down");
				li.appendChild(view.model.children[i].view.element);
			}
		}
		
		var metapile = view.element.appendChild(document.createElement("li"));
		// Add all the up cards
		for (var i = 0; i < view.model.children.length; i++) {
			if (view.model.children[i].model.up) {
				metapile.classList.add("up");
				metapile.setAttribute("draggable", true);
				metapile.appendChild(view.model.children[i].view.element);
				metapile.ondragstart = (function (index, stack) { return function (ev) {
					originStack = stack;
					dragIndex = index;
					//ev.preventDefault();
					ev.stopPropagation();
					//return false;
				}})(i, view.controller);
				
				if (i < view.model.children.length - 1) {
					var subpile = view.element.appendChild(document.createElement("ul"));
					metapile.appendChild(subpile);
					metapile = subpile.appendChild(document.createElement("li"));
				}
			}
		}
		
	}

	this.generate(model, element, updaters);
}

PileView.prototype = new View();

function Stack(className) {
	var model = new StackModel(className);
	var view = new StackView(model);
	var handlers = {
		drop: function (ev, stack) {
			ev.preventDefault();
			var dragStack = [];
			for (var i = originStack.model.children.length - 1; i >= dragIndex; i--) {
				dragStack.push(originStack.pop());
			}
			console.log(dragStack);
			while (dragStack.length > 0) {
				stack.push(dragStack.shift());
			}
			stack.view.update("children");
			originStack.view.update("children");
			originStack = null;
			dragIndex = null;
		}
	};
	this.generate(model, view, handlers);
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