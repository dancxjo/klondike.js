function DeckModel(controller) {
	this.baseClass.call(this, controller);
	this.properties = ["children"];
} 

DeckModel.extends(Model);

function DeckView(controller) {
	this.baseClass.call(this, controller);
	var element = this.element = document.createElement("ul");
	this.element.className = "deck";

	this.updaters.children = function (view) {
		view.element.innerHTML = "";
		for (var i = 0; i < view.controller.children.length; i++) {
			var li = view.element.appendChild(document.createElement("li"));
			if (!view.controller.children[i].up) {
				li.classList.add("down");
			}
			li.appendChild(view.controller.children[i].element);
		}
	}
}

DeckView.extends(View);

function Deck() {
	this.baseClass.call(this, DeckModel, DeckView);
	this.model.values.children = [];
	for (var suit = 1; suit <= 4; suit++) {
		for (var rank = 1; rank < 14; rank++) {
			var card = new Card(suit, rank, false, false);
			this.push(card);
		}
	}

}

Deck.extends(Controller);

Deck.prototype.shuffle = function () {
	for (var i = this.children.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var a = this.children[i];
		this.children[i] = this.children[j];
		this.children[j] = a;
	}
	this.view.update("children");
}

Deck.prototype.pop = function () {
	var card = this.children.pop();
	this.view.update("children");
	return card;
}

Deck.prototype.push = function (card) {
	this.children.push(card);
	this.view.update("children");
}

Deck.prototype.flip = function () {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].flip();
	}
	this.view.update("children");
}