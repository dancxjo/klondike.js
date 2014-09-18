angular.module('app', ['ngDragDrop'])
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
        $scope.foobar = "The angry fox";
        $scope.foundations = [];
        for (var i = 0; i < 4; i++) {
            $scope.foundations[i] = {};
        }
        $scope.piles = [];
        for (var i = 0; i < 7; i++) {
            $scope.piles[i] = {cards:[]};
        }

        $scope.definedPiles = 0;

        $scope.$on("draw", function (ev, args) {
            $scope.$broadcast("discard", args);
        });

        $scope.$on("noCardsInDeck", function (ev) {
            $scope.$broadcast("pickUpTable");
        });

        $scope.$on("dropTable", function (ev, tempCards) {
            $scope.$broadcast("gatherCards", tempCards);
        });

        $scope.$on("registerPile", function (ev, args) {
            console.log(args[0]);
            $scope.piles[args[0]].scope = ev.targetScope;
            console.log($scope.piles);

            if (++$scope.definedPiles == 7) {
                for (var i in $scope.piles) {
                    var cards = $scope.piles[i].cards;
                    while (cards.length > 0) {
                        var card = cards.pop();
                        //card.up = true;
                        $scope.piles[i].scope.cards.push(card);
                    }
                }
            }

            console.log($scope.definedPiles);
        });

        $scope.$on("dealCard", function (ev, args) {
            // Hold the dealt cards until all the piles are registered
            if (!$scope.piles[args[0]].cards) $scope.piles[args[0]].cards = [];
            $scope.piles[args[0]].cards.push(args[1]);
            //console.log($scope);
        });
    })
    .controller('DeckCtrl', function ($scope, $element) {
        if (!$scope.cards) {
            $scope.cards = [];
        }

        var cards = $scope.cards;

        var suits = ["hearts", "diamonds", "clubs", "spades"];
        var ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
        for (var s in suits) {
            for (var r in ranks) {
                var card = {
                    rank: ranks[r],
                    suit: suits[s],
                    up: false
                };
                $scope.cards.push(card);
            }
        }

        $scope.draw = function () {
            if ($scope.cards.length > 0) {
                var card = $scope.cards.pop();
                $scope.$emit("draw", [card]);
            } else {
                $scope.$emit("noCardsInDeck");
            }
            $scope.$apply();
        }

        $scope.deal = function () {
            for (var a = 0; a < 7; a++) {
                for (var b = a; b < 7; b++) {
                    var card = $scope.cards.pop();
                    if (a === b) card.up = true;
                    $scope.$emit("dealCard", [b, card]);
                }
            }
        }

        $scope.deal();

        $element.bind("click", function (ev) {
            $scope.draw();
        });

        $scope.$on('gatherCards', function (ev, tempCards) {
            while (tempCards.length > 0) {
                var card = tempCards.shift();
                card.up = false;
                cards.push(card);
            }
            $scope.$apply();
        });
    })
    .controller('TableCtrl', function ($scope, $element) {
        if (!$scope.cards) {
            $scope.cards = [];
        }

        var cards = $scope.cards;

        $scope.pop = function () {
            var card = $scope.cards.pop();
            //$scope.$apply();
            return card;
        }

        $scope.$on("discard", function (ev, args) {
            var card = args[0];
            card.up = true;
            cards.push(card);
            $scope.$apply();
        });

        $scope.$on("pickUpTable", function (ev) {
            var tempCards = [];
            while (cards.length > 0) {
                var card = cards.pop();
                card.up = false;
                tempCards.push(card);
            }
            $scope.$apply();
            $scope.$emit("dropTable", tempCards);
        });
    })
    .controller('FoundationCtrl', function ($scope, $element) {
        if (!$scope.cards) {
            $scope.cards = [];
        }

        var cards = $scope.cards;

        $scope.pop = function () {
            var card = $scope.cards.pop();
            //$scope.$apply();
            return card;
        }


        $scope.onDrop = function ($event, $data) {
            this.cards.push($data);

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
    .controller('PileCtrl', function ($scope, $element, $timeout) {
        console.log($scope.foobar);
        if (!$scope.cards) {
            $scope.cards = [];
        }

        var cards = $scope.cards;

        $scope.$emit('registerPile', [$element[0].ngId]);

        $scope.onDrop = function ($event, $data) {
            this.cards.push($data);
        }

        $scope.pop = function () {
            var card = $scope.cards.pop();
            //$scope.$apply();
            return card;
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