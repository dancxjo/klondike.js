function KlondikeModel() {
	this.start = Date.now();
	this.score = 0;
	
	this.deck = new Stack();
	this.deck.model.generate();
	this.deck.shuffle();
		
	this.table = new Stack("table");
	
	this.foundations = [
		new Stack("foundation"),
		new Stack("foundation"),
		new Stack("foundation"),
		new Stack("foundation")
	];
	
	this.piles = [
		new Stack("pile"),
		new Stack("pile"),
		new Stack("pile"),
		new Stack("pile"),
		new Stack("pile"),
		new Stack("pile"),
		new Stack("pile")
	];
	
	for (var a = 0; a < 7; a++) {
		this.piles[a].view = new PileView(this.piles[a].model);
		this.piles[a].view.controller = this.piles[a].model.controller;
		this.piles[a].addHandler("click", function (ev, pile) {
			if (pile.model.children.length > 0) {
				if (!pile.model.children[pile.model.children.length - 1].model.up) {
					pile.model.children[pile.model.children.length - 1].flip();
					pile.view.update("children");
				}
			}
		});


		this.piles[a].addHandler("dragover", function (ev, pile) {
			if (pile.model.children.length > 0) {
				if (originStack.model.children[dragIndex].model.color != pile.model.children[pile.model.children.length - 1].model.color) {
					if (originStack.model.children[dragIndex].model.rank == pile.model.children[pile.model.children.length - 1].model.rank - 1) {
						ev.preventDefault();
						return false;
					}
				}
			} else {
				if (originStack.model.children[dragIndex].model.rank == 13) {
					ev.preventDefault();
					return false;
				}
			}
		});
		
		this.piles[a].addHandler("drop", function (ev, stack) {
			ev.preventDefault();
			var dragStack = [];
			for (var i = originStack.model.children.length - 1; i >= dragIndex; i--) {
				dragStack.push(originStack.pop());
			}
			console.log(dragStack);
			while (dragStack.length > 0) {
				stack.push(dragStack.pop());
			}
			stack.view.update("children");
			originStack.view.update("children");
			originStack = null;
			dragIndex = null;
			
		});
		
		for (var b = a; b < 7; b++) {
			var card = this.deck.pop();
			if (a == b) {
				card.flip();
			}
			this.piles[b].push(card);
		}
	}
	
	for (var i = 0; i < this.foundations.length; i++) {
		this.foundations[i].addHandler("click", function (ev, controller) {
			alert("Clicked");
		});
		
	}
}

function KlondikeView(model) {
	var element = document.createElement("div");
	element.appendChild(model.deck.view.element);
	element.appendChild(model.table.view.element);
	for (var i in model.foundations) {
		element.appendChild(model.foundations[i].view.element);
	}
	var piles = element.appendChild(document.createElement("div"));
	piles.setAttribute("id", "piles");
	
	for (var i in model.piles) {
		piles.appendChild(model.piles[i].view.element);
	}
	var updaters = {};

	this.generate(model, element, updaters);
}

KlondikeView.prototype = new View();

function KlondikeGame() {
	var model = new KlondikeModel();
	var view = new KlondikeView(model);
	var handlers = {};
	this.generate(model, view, handlers);	
	this.setupDraw(this);
	for (var i = 0; i < this.model.foundations.length; i++) {
		this.setupFoundation(game, this.model.foundations[i]);
	}
}

KlondikeGame.prototype = new Controller();

KlondikeGame.prototype.setupDraw = function (game) {
	game.model.deck.addHandler("click", function (game) { return function (ev, card) {
		if (game.model.deck.model.children.length > 0) {
			game.draw(game);
		} else {
			while (game.model.table.model.children.length > 0) {
				var card = game.model.table.pop();
				card.flip();
				game.model.deck.push(card);
			}
			game.model.deck.view.update("children");
			game.model.table.view.update("children");
		}
	}}(game));
}

KlondikeGame.prototype.draw = function (game) {
	var card = game.model.deck.pop();
	card.flip();
	game.model.table.push(card);
	card.addHandler("dragstart", function (game) { return function (ev, card) {
		originStack = game.model.table;
		dragIndex = game.model.table.model.children.length - 1;
	}}(game));
	card.update("draggable", true);

	game.model.deck.view.update("children");
	game.model.table.view.update("children");
}

KlondikeGame.prototype.setupFoundation = function (game, foundation) {
	foundation.addHandler("dragover", function (game) { return function (ev, foundation) {
		if (originStack.model.children.length - 1 == dragIndex) {	// Only accept single cards
			console.log("Can I add this card?");
			if (foundation.model.children.length == 0) {
				if (originStack.model.children[dragIndex].model.rank == 1) {
					ev.preventDefault();
					return false;
				}
			} else {
				if (originStack.model.children[dragIndex].model.suit == foundation.model.children[foundation.model.children.length - 1].model.suit) {
					if (originStack.model.children[dragIndex].model.rank == foundation.model.children[foundation.model.children.length - 1].model.rank + 1) {
						ev.preventDefault();
						return false;
					}
				}
			}
		}
	}}(game));
}


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
				} else {
					/*metapile.ondragover = (function (stack) { return function (ev) {
						
					}})(view.controller);

					metapile.ondrop = (function (stack) { return function (ev) {
					}})(view.controller);
					*/
				}
			}
		}
		
	}

	this.generate(model, element, updaters);
}

PileView.prototype = new View();
