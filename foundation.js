function FoundationModel(controller) {
	this.baseClass.call(this, controller);
	this.properties = ["children"];
} 

FoundationModel.extends(Model);

function FoundationView(controller) {
	this.baseClass.call(this, controller);
	var element = this.element = document.createElement("ul");
	this.element.className = "foundation";

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

FoundationView.extends(View);

function Foundation() {
	this.baseClass.call(this, FoundationModel, FoundationView);
	this.model.values.children = [];
}

Foundation.extends(Controller);

Foundation.prototype.shuffle = function () {
	for (var i = this.children.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var a = this.children[i];
		this.children[i] = this.children[j];
		this.children[j] = a;
	}
	this.view.update("children");
}

Foundation.prototype.pop = function () {
	var card = this.children.pop();
	this.view.update("children");
	return card;
}

Foundation.prototype.push = function (card) {
	this.children.push(card);
	this.view.update("children");
}

Foundation.prototype.flip = function () {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].flip();
	}
	this.view.update("children");
}