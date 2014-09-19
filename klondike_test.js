'use strict';

describe('cards module', function() {
  beforeEach(module('tdrCards'));
    
  describe('card constructor', function () {
     it('should return the queen of spades', function () {
         var card = new Card("queen", "spades");
         expect(card.rank).toEqual("queen");
         expect(card.suit).toEqual("spades");
     }); 
  });

  describe('suitSymbol filter', function() {
    it('should return hearts symbol', inject(function(suitSymbolFilter) {
      expect(suitSymbolFilter('hearts')).toEqual('♥');
    }));
    
    it('should return diamonds symbol', inject(function(suitSymbolFilter) {
      expect(suitSymbolFilter('diamonds')).toEqual('♦');
    }));
    
    it('should return clubs symbol', inject(function(suitSymbolFilter) {
      expect(suitSymbolFilter('clubs')).toEqual('♣');
    }));
    
    it('should return spades symbol', inject(function(suitSymbolFilter) {
      expect(suitSymbolFilter('spades')).toEqual('♠');
    }));
  });
});
