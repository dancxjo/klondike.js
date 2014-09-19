const RANKS = ["joker", "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
const SUITS = ["diamonds", "spades", "hearts", "clubs"];
const RANK_SYMBOLS = {hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠"};

function Card(rank, suit, up) {
    this.rank = rank;
    this.suit = suit;
    this.up = !!up;
}

Card.prototype = {
    flip: function () {
        this.up = !this.up;
    },
    
    get symbol() {
        return RANK_SYMBOLS[suitName];        
    }
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

angular.module('tdrCards', ['ngDragDrop'])
    .filter('last', function () {
        return function (lengthy) {
            return lengthy.length - 1;
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
                },
                templateUrl: 'card.html',
                replace: true
            };
    }])
    .directive('ngStack', ['$compile',
        function ($compile) {
            return {
                restrict: 'A',
                scope: {
                    stack: '@ngStack'
                }
            };
    }])
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

        $scope.pop = function () {
            var card = cards.pop();
            return card;
        }
    })
    .controller('HandCtrl', function ($scope, $element) {
        console.log($scope);
        $scope.cards = [];
    });