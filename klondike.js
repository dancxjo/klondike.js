function KlondikeModel() {
	this.start = Date.now();
	this.score = 0;
	
	this.deck = new Stack();
	this.deck.model.generate();
	this.deck.shuffle();
	
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
}

function KlondikeView(model) {
	var element = document.createElement("div");
	element.appendChild(model.deck.view.element);
	for (var i in model.foundations) {
		element.appendChild(model.foundations[i].view.element);
	}
	for (var i in model.piles) {
		element.appendChild(model.piles[i].view.element);
	}

	this.generate(model, element);
}

KlondikeView.prototype = new View();

function KlondikeGame() {
	var model = new KlondikeModel();
	var view = new KlondikeView(model);
	this.generate(model, view);	
}

KlondikeGame.prototype = new Controller();