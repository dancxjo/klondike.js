function Model(controller) {
	this.controller = controller;
	this.properties = [];
	this.values = {};
}

function View(controller) {
	this.controller = controller;
	this.updaters = {};
}

View.prototype.update = function (property) {
	this.updaters[property](this);
}

function Controller(modelConstructor, viewConstructor) {
	if (modelConstructor) this.model = new modelConstructor(this);
	if (viewConstructor) {
		this.view = new viewConstructor(this);
		this.element = this.view.element;
	}
	if (this.model) for (var i = 0; i < this.model.properties.length; i++) {
		var property = this.model.properties[i];
		if (!(property in this)) {
			Object.defineProperty(this.__proto__, property, {
				get: function (prop) { return function () { return this.model.values[prop]; }}(property),
				set: function (prop) { return function (value) {
					this.model.values[prop] = value; 
					this.update(prop); 
				}}(property)
			});
		}
	}
	this.handlers = {};
	this.updaters = {};
}

Controller.prototype.update = function (property) {
	this.view.update(property); 
	if (this.updaters[property]) this.updaters[property](this);
}


Controller.prototype.handleEvent = function (ev) {
	return this.handlers[ev.type](ev, this);
}

Controller.prototype.addHandler = function (eventType, handler) {
	this.removeHandler(eventType);
	this.handlers[eventType] = handler;
	this.element.addEventListener(eventType, this, false);
}

Controller.prototype.removeHandler = function (eventType) {
	this.element.removeEventListener(eventType, this.handlers[eventType]);
	delete this.handlers[eventType];
}

Object.prototype.extends = function (base) {
	this.prototype = new base();
	this.prototype.baseClass = base;
	this.prototype.constructor = this;
}