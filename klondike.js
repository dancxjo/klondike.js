function KlondikeModel() {
	this.start = Date.now();
	this.score = 0;
	
	this.deck = new Stack();
	this.deck.model.generate();
	this.deck.shuffle();
	
	this.table = new Stack("table");
	
	this.deck.handlers.click = function (ev, controller) {
		alert("Clicked");
		var card = controller.pop();
		card.flip();
		controller.table.push(card);
	}
	
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
}

KlondikeGame.prototype = new Controller();