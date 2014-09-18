const RANKS = ["joker", "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
const SUITS = ["diamonds", "spades", "hearts", "clubs"];

function Card(rank, suit, up) {
    this.rank = rank;
    this.suit = suit;
    this.up = !!up;
}

Card.prototype.flip = function () {
    this.up = !this.up;
}

function Stack() {
    this.cards = [];
}

Stack.prototype = {
    get top() {
        return this.cards.length == 0 ? undefined : this.cards[this.cards.length - 1];
    },

    push: function (card) {
        this.cards.push(card);
    },
    
    pop: function () {
        return this.cards.pop();
    },
    
    shuffle: function () {
        for (var i = this.cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var a = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = a;
        }
    }
}

function Deck() {
    this.cards = [];
    for (var s in SUITS) {
        for (var r in RANKS) {
            if (r > 0) {
                this.cards.push(new Card(RANKS[r], SUITS[s]));
            }
        }
    }
}

Deck.prototype = new Stack();

angular.module('app', ['ngDragDrop'])
    .filter('last', function () {
        return function (lengthy) {
            return lengthy.length - 1;
        }
    })
    .filter('firstUp', function () {
        return function (cards) {
            for (var i in cards) {
                if (cards[i].up) {
                    return cards[i];
                }
            }
            return undefined;
        }
    })
    .filter('suitSymbol', function () {
        return function (suitName) {
            return {
                hearts: "♥",
                diamonds: "♦",
                clubs: "♣",
                spades: "♠"
            }[suitName];
        }
    })
    .filter('rankLetter', function () {
        return function (rank) {
            switch (rank.toLowerCase()) {
            case "0":
            case "joker":
                return "JOKER";
            case "1":
            case "ace":
                return "A";
            case "11":
            case "jack":
                return "J";
            case "12":
            case "queen":
                return "Q";
            case "13":
            case "king":
                return "K";
            default:
                return rank;
            }
        }
    })
    .filter('isFace', function () {
        return function (rank) {
            switch (rank.toLowerCase()) {
            case "11":
            case "jack":
            case "12":
            case "queen":
            case "13":
            case "king":
                return true;
            default:
                return false;
            }
        }
    })
    .filter('dots', function () {
        return function (rank) {
            return {
                joker: ["ace"],
                ace: ["ace"],
                2: ["spotB1", "spotB5"],
                3: ["spotB1", "spotB3", "spotB5"],
                4: ["spotA1", "spotA5",
                     "spotC1", "spotC5"],
                5: ["spotA1", "spotA5",
                        "spotB3",
                     "spotC1", "spotC5"],
                6: ["spotA1", "spotA3", "spotA5",
                     "spotC1", "spotC3", "spotC5"],
                7: ["spotA1", "spotA3", "spotA5",
                        "spotB2",
                     "spotC1", "spotC3", "spotC5"],
                8: ["spotA1", "spotA3", "spotA5",
                        "spotB2", "spotB4",
                     "spotC1", "spotC3", "spotC5"],
                9: ["spotA1", "spotA5",
                            "spotA2", "spotA4",
                                "spotB3",
                            "spotC2", "spotC4",
                     "spotC1", "spotC5"],
                10: ["spotA1", "spotA5",
                     "spotA2", "spotA4",
                     "spotB2", "spotB4",
                     "spotC2", "spotC4",
                     "spotC1", "spotC5"],
                jack: ["spotA1", "spotC5"],
                queen: ["spotA1", "spotC5"],
                king: ["spotA1", "spotC5"]
            }[rank];
        }
    })
    .directive('card', ['$compile',
        function ($compile) {
            return {
                restrict: 'E',

                transclude: true,

                scope: {
                    rank: '@',
                    suit: '@',
                    up: '@',
                },

                controller: function ($scope, $element) {
                    $scope.flip = function () {
                        $scope.up = !$scope.up;
                        $scope.$apply();
                    }

                    $element.bind('ondragstart', function (ev) {
                        ev.dataTransfer.setData("text/html", "a card!");
                    })
                },
                templateUrl: 'card.html',
                replace: true
            };
    }])
    .controller('GameCtrl', function ($scope, $timeout) {
        $scope.deck = new Deck();
        $scope.deck.shuffle();

        $scope.table = new Stack();

        $scope.currentFoundation = 0;
        $scope.nextFoundation = function () {
            $scope.currentFoundation++;
        }
        $scope.foundations = [];
        for (var i = 0; i < 4; i++) {
            $scope.foundations[i] = new Stack();
        }

        $scope.currentPile = 0;
        $scope.nextPile = function () {
            $scope.currentPile++;
        }

        $scope.piles = [];
        for (var i = 0; i < 7; i++) {
            $scope.piles[i] = new Stack();
        }

        for (var a = 0; a < 7; a++) {
            for (var b = a; b < 7; b++) {
                var card = $scope.deck.pop();
                if (a == b) card.flip();
                $scope.piles[b].push(card);
            }
        }

        $scope.draw = function () {
            if ($scope.deck.cards.length > 0) {
                var card = $scope.deck.pop();
                card.flip();
                $scope.table.push(card);
            } else {
                while ($scope.table.cards.length > 0) {
                    var card = $scope.table.pop();
                    card.flip();
                    $scope.deck.push(card);
                }
            }
        }

    })
    .controller('DeckCtrl', function ($scope, $element) {
        if ($scope.deck) {
            $scope.stack = $scope.deck;
        } else {
            $scope.stack = new Deck();
        }

        var cards = $scope.stack.cards;
        $scope.cards = cards;
    })
    .controller('TableCtrl', function ($scope, $element) {
        if ($scope.table) {
            $scope.stack = $scope.table;
        } else {
            $scope.stack = new Stack();
        }

        var cards = $scope.stack.cards;
        $scope.cards = cards;
    })
    .controller('FoundationCtrl', function ($scope) {
        if ($scope.foundations) {
            $scope.stack = $scope.foundations[$scope.currentFoundation];
            $scope.nextFoundation();
        } else {
            $scope.stack = new Stack();
        }

        var cards = $scope.stack.cards;
        $scope.cards = cards;

        $scope.pop = function () {
            var card = cards.pop();
            return card;
        }


        $scope.onDrop = function ($event, $data) {
            cards.push($data);

        }

        $scope.dropValidate = function ($data) {
            var ranks = ["joker", "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

            if (cards.length > 0) {
                if ($data.suit == cards[cards.length - 1].suit) {
                    var i = ranks.indexOf(cards[cards.length - 1].rank);
                    var j = ranks.indexOf($data.rank);

                    return i + 1 == j;
                }
            } else {
                return $data.rank == "ace";
            }

            return false;
        }
    })
    .controller('PileCtrl', function ($scope) {
        if ($scope.piles) {
            $scope.stack = $scope.piles[$scope.currentPile];
            $scope.nextPile();
        } else {
            $scope.stack = new Stack();
        }

        var cards = $scope.stack.cards;
        $scope.cards = cards;

        $scope.onDrop = function ($event, $data) {
            cards.push($data);
        }

        $scope.pop = function () {
            var card = cards.pop();
            return card;
        }
        
        $scope.popFrom = function ($index) {
            cards.splice($index, cards.length - $index);
        }

        $scope.dropValidate = function ($data) {
            var ranks = ["joker", "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
            var colors = {
                hearts: "red",
                diamonds: "red",
                clubs: "black",
                spades: "black"
            };

            if (cards.length > 0) {
                if (colors[$data.suit] != colors[cards[cards.length - 1].suit]) {
                    var i = ranks.indexOf(cards[cards.length - 1].rank);
                    var j = ranks.indexOf($data.rank);

                    return i - 1 == j;
                }
            } else {
                return $data.rank == "king";
            }

            return false;
        }
    });