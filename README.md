klondike.js
===========

An HTML5 implementation of Klondike Solitaire using a custom MVC framework

## MVC API
A `Controller` provides an interface between a `Model` and a `View`. Properties are stored in the `Model` and then exported (via getters and setters) to the `Controller`. When a property of the model is updated through the `Controller`, the `View`'s `.update(property)` method is called to update the view based on the property that was just updated. The `Controller` has updaters as well. In the future, `Model` will implement `.validate(property, value)`. `Controller` implements `.addHandler(eventType, handler)` for hooking up to the events that happen to the `View`.
