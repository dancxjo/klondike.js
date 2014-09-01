function StackModel(controller) {
	this.baseClass.call(this, controller);
	this.properties = ["children"];
} 

StackModel.extends(Model);

function StackView(controller) {
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

StackView.extends(View);

function Stack(className) {
	this.baseClass.call(this, StackModel, StackView);
	if (className) {
		this.element.className = className;
	}
	this.model.values.children = [];
}

Stack.extends(Controller);

Stack.prototype.shuffle = function () {
	for (var i = this.children.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var a = this.children[i];
		this.children[i] = this.children[j];
		this.children[j] = a;
	}
	this.update("children");
}

Stack.prototype.generateDeck = function () {
	for (var suit = 1; suit <= 4; suit++) {
		for (var rank = 1; rank < 14; rank++) {
			var card = new Card(suit, rank, false, false);
			this.push(card);
		}
	}
}

Stack.prototype.pop = function () {
	var card = this.children.pop();
	card.stack = null;
	this.update("children");
	return card;
}

Stack.prototype.push = function (card) {
	this.children.push(card);
	card.stack = this;
	this.update("children");
}

Stack.prototype.flip = function () {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].flip();
	}
	this.update("children");
}