angular.module('crazy8', ['ngDragDrop', 'tdrCards'])
    .controller('Crazy8GameCtrl', function ($scope, $timeout) {
        // Make the stacks
        $scope.deck = new Deck();
        $scope.table = new Stack();
        $scope.computerHand = new Stack();
        $scope.humanHand = new Stack();

        // Deal a game
        $scope.deck.shuffle();
        
        for (var a = 0; a < 7; a++) {
            var card = $scope.deck.pop();
            card.flip();
            $scope.humanHand.push(card);
            
            card = $scope.deck.pop();
            $scope.computerHand.push(card);
        }
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
            if (Array.isArray($data)) {
                var newCards = $data[0].cards.slice($data[1]);
                for (var i in newCards) {
                    var card = newCards[i];
                    cards.push(card);
                }
            } else {
                cards.push($data);
            }
        }

        $scope.pop = function () {
            var card = cards.pop();
            return card;
        }
        
        $scope.popFrom = function ($index) {
            cards.splice($index, cards.length - $index);
        }

        $scope.dropValidate = function ($data) {
            var card;
            
            if (Array.isArray($data)) {
                card = $data[0].cards[$data[1]];
            } else {
                card = $data;
            }
            
            var ranks = ["joker", "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
            var colors = {
                hearts: "red",
                diamonds: "red",
                clubs: "black",
                spades: "black"
            };

            if (cards.length > 0) {
                if (colors[card.suit] != colors[cards[cards.length - 1].suit]) {
                    var i = ranks.indexOf(cards[cards.length - 1].rank);
                    var j = ranks.indexOf(card.rank);

                    return i - 1 == j;
                }
            } else {
                return card.rank == "king";
            }

            return false;
        }
    });