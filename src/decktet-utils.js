var Decktet = (function() {

	var Suits = [ "Moons", "Suns", "Knots", "Wyrms", "Leaves", "Waves" ];
	var Ranks = [ "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "Crown" ];

	var Cards = [
		{ rank: "Ace", suits: [ "Moons" ] },
		{ rank: "Ace", suits: [ "Suns" ] },
		{ rank: "Ace", suits: [ "Knots" ] },
		{ rank: "Ace", suits: [ "Wyrms" ] },
		{ rank: "Ace", suits: [ "Leaves" ] },
		{ rank: "Ace", suits: [ "Waves" ] },
		
		{ rank: "2", suits: [ "Moons", "Knots" ] },
		{ rank: "2", suits: [ "Suns", "Wyrms" ] },
		{ rank: "2", suits: [ "Waves", "Leaves" ] },
		
		{ rank: "3", suits: [ "Moons", "Waves" ] },
		{ rank: "3", suits: [ "Suns", "Knots" ] },
		{ rank: "3", suits: [ "Leaves", "Wyrms" ] },
		
		{ rank: "4", suits: [ "Moons", "Suns" ] },
		{ rank: "4", suits: [ "Wyrms", "Knots" ] },
		{ rank: "4", suits: [ "Waves", "Leaves" ] },
		
		{ rank: "5", suits: [ "Moons", "Leaves" ] },
		{ rank: "5", suits: [ "Suns", "Waves" ] },
		{ rank: "5", suits: [ "Wyrms", "Knots" ] },
		
		{ rank: "6", suits: [ "Moons", "Waves" ] },
		{ rank: "6", suits: [ "Suns", "Wyrms" ] },
		{ rank: "6", suits: [ "Leaves", "Knots" ] },
		
		{ rank: "7", suits: [ "Moons", "Leaves" ] },
		{ rank: "7", suits: [ "Suns", "Knots" ] },
		{ rank: "7", suits: [ "Waves", "Wyrms" ] },
		
		{ rank: "8", suits: [ "Moons", "Suns" ] },
		{ rank: "8", suits: [ "Wyrms", "Knots" ] },
		{ rank: "8", suits: [ "Waves", "Leaves" ] },
		
		{ rank: "9", suits: [ "Moons", "Suns" ] },
		{ rank: "9", suits: [ "Leaves", "Knots" ] },
		{ rank: "9", suits: [ "Waves", "Wyrms" ] },
		
		{ rank: "Crown", suits: [ "Moons" ] },
		{ rank: "Crown", suits: [ "Suns" ] },
		{ rank: "Crown", suits: [ "Knots" ] },
		{ rank: "Crown", suits: [ "Wyrms" ] },
		{ rank: "Crown", suits: [ "Leaves" ] },
		{ rank: "Crown", suits: [ "Waves" ] }
	];

	LangUtils.deepFreeze(Suits);
	LangUtils.deepFreeze(Ranks);
	LangUtils.deepFreeze(Cards);
		
	return {
		Suits: Suits,
		Ranks: Ranks,
		Cards: Cards
	}
}(LangUtils));
	

var DecktetUtils = (function(Decktet, LangUtils) {

	utils = {}
	
	utils.countBySuit = function(cards) {
		var counts = {};
		cards.forEach(function(card) {
			card.suits.forEach(function(suit) {
				counts[suit] = ( counts[suit] || 0 ) + 1;
			});
		});
		return counts;
	}
	
	utils.countByRank = function(cards) {
		var counts = {};
		cards.forEach(function(card) {
			counts[card.rank] = ( counts[card.rank] || 0 ) + 1;
		});
		return counts;
	}
	
	utils.shareOneSuit = function(cards) {
		// se algum suit estiver presente na mesma quantidade de cartas que 
		// a selecao, entao todas possuem aquele suit
		counts = utils.countBySuit(cards);
		for ( suit in counts )
			if ( counts[suit] == cards.length )
				return suit;
		return null;
	}
	
	utils.shareOneRank = function(cards) {
		counts = utils.countByRank(cards);
		for ( rank in counts )
			if ( counts[rank] == cards.length )
				return rank;
		return null;
	}
	
	utils.hasOneOfEachSuit = function(cards) {
		var counts = utils.countBySuit(cards);
		// counts deve ser um objeto com 1 em cada um dos seis suits
		return allSuits.every(function(suit) {
			return counts[suit] == 1;
		});
	}
	
	utils.areConsecutiveRanks = function(cards, comparator) {
		// Cria um novo array e ordena pelo "rank traduzido"
		var clone = cards.filter(function(e) { return true; });
		clone.sort(utils.rankComparator(Decktet.Ranks));
		
		// Verifica se toda carta vem depois da sua antecessora
		if ( comparator == null )
			var comparator = utils.rankComparator(Decktet.Ranks);
			
		for ( var i = 1; i < clone.length; i++ ) {
			var difference = comparator(clone[i-1], clone[i] )
			if ( difference != -1 )
				return false; // uma carta nao eh sucessora da outra
		}
		return true;
	}
	
	utils.findCard = function(fullName) {
	
		var pieces = fullName.split("of");
		var rank = LangUtils.camelCase(pieces[0]);
		
		pieces = pieces[1].replace(",", " and ").split("and");
		var suits = pieces.map(function(el) { return LangUtils.camelCase(el) });
		
		matches = Decktet.Cards.filter(function(card) { return card.rank == rank && LangUtils.containsExactly(card.suits, suits) });
		return matches.length ? matches[0] : null;
	}
	
	utils.makeDeck = function(fullNames) {
		return fullNames.map(utils.findCard);
	}
	
	// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
	utils.shuffle = function(cards) {
    for(var j, x, i = cards.length; i; j = Math.floor(Math.random() * i), x = cards[--i], cards[i] = cards[j], cards[j] = x);
    return cards;
	}
	
	utils.rankComparator = function(arr) {
		return function(cardA, cardB) {
			if ( LangUtils.isString(cardA) ) cardA = utils.findCard(cardA);
			if ( LangUtils.isString(cardB) ) cardB = utils.findCard(cardB);
			return arr.indexOf(cardA.rank) - arr.indexOf(cardB.rank);
		}
	}
	
	utils.cardName = function(card) {
		return card.rank + ' of ' + card.suits.join( ' and ' );
	}
	
	return utils;

}(Decktet, LangUtils));