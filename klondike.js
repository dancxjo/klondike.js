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
	game.model.deck.view.update("children");
	game.model.table.view.update("children");
}