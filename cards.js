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

function CardModel(controller) {
	this.baseClass.call(this, controller);
	this.properties = ["rank", "suit", "up", "draggable"];
} 

CardModel.extends(Model);

function CardView(controller) {
	this.baseClass.call(this, controller);
	var element = this.element = document.createElement("div");
	this.element.className = "card";

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
		
	this.updaters.suit = function (view) {
		for (var i in SUIT_NAMES) {
			if (i > 0) {
				view.front.classList.remove(SUIT_NAMES[i]);
			}
		}
		
		view.front.classList.add(SUIT_NAMES[view.controller.suit]);

		for (var i in view.dots) {
			var dot = view.dots[i];
			dot.innerHTML = "";
			if (RANK_DOTS[view.controller.rank].indexOf(dot.className) > -1) {
				dot.innerHTML = SUIT_SYMBOLS[view.controller.suit];
			}
		}
		
		view.index1.suitDiv.innerHTML = SUIT_SYMBOLS[view.controller.suit];
		view.index2.suitDiv.innerHTML = SUIT_SYMBOLS[view.controller.suit];
	}
	
	this.updaters.rank = function (view) {			
		if (view.controller.rank >= 0 && view.controller.rank < 11) {
			view.face.style.visibility = "hidden";
			view.face.setAttribute("src", "");
		} else {
			view.face.style.visibility = "inherit";
			view.face.setAttribute("src", "http://www.brainjar.com/css/cards/graphics/" + RANK_NAMES[view.controller.rank] + ".gif");
		}
		
		for (var i in view.dots) {
			var dot = view.dots[i];
			dot.innerHTML = "";
			if (RANK_DOTS[view.controller.rank].indexOf(dot.className) > -1) {
				dot.innerHTML = SUIT_SYMBOLS[view.controller.suit];
			}
		}
		view.index1.rankDiv.innerHTML = view.controller.rank > 10 ? RANK_NAMES[view.controller.rank].charAt(0).toUpperCase() : view.controller.rank == 1 ? "A" : RANK_NAMES[view.controller.rank];
		view.index2.rankDiv.innerHTML = view.controller.rank > 10 ? RANK_NAMES[view.controller.rank].charAt(0).toUpperCase() : view.controller.rank == 1 ? "A" : RANK_NAMES[view.controller.rank];
		
		view.index1.suitDiv.innerHTML = SUIT_SYMBOLS[view.controller.suit];
		view.index2.suitDiv.innerHTML = SUIT_SYMBOLS[view.controller.suit];
	}
	
	this.updaters.up = function (view) {
		if (view.controller.up) {
			view.element.classList.add("up");
			view.element.appendChild(view.front);
		} else {
			view.element.classList.remove("up");
			view.element.removeChild(view.front);
		}
	}
		
	this.updaters.draggable = function (view) {
		view.element.setAttribute("draggable", view.controller.draggable);
	}


	
}

CardView.extends(View);

function Card(suit, rank, up) {
	this.baseClass.call(this, CardModel, CardView);
	// Define initial stub values
	this.model.values.rank = rank;
	this.model.values.suit = suit;
	this.model.values.up = up;
	this.model.values.draggable = false;
	this.suit = suit;
	this.rank = rank;
	this.up = up;
	this.draggable = false;
}

Card.extends(Controller);

Card.prototype.flip = function () {
	this.up = !this.up;
}