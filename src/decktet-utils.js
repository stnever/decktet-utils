var _ = require('lodash')

const Suits = [ "Moons", "Suns", "Knots", "Wyrms", "Leaves", "Waves" ],
      Ranks = [ "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "Crown" ],
      Cards = [
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
    	]

function countBySuit(cards) {
	var counts = {}
	cards.forEach(function(card) {
		card.suits.forEach(function(suit) {
			counts[suit] = ( counts[suit] || 0 ) + 1
		})
	})
	return counts
}

function countByRank(cards) {
	var counts = {};
	cards.forEach(function(card) {
		counts[card.rank] = ( counts[card.rank] || 0 ) + 1;
	});
	return counts;
}

function shareOneSuit(cards) {
	// se algum suit estiver presente na mesma quantidade de cartas que
	// a selecao, entao todas possuem aquele suit
	counts = countBySuit(cards);
	for ( suit in counts )
		if ( counts[suit] == cards.length )
			return suit;
	return null;
}

function shareOneRank(cards) {
	counts = countByRank(cards);
	for ( rank in counts )
		if ( counts[rank] == cards.length )
			return rank;
	return null;
}

function hasOneOfEachSuit(cards) {
	var counts = countBySuit(cards);
	// counts deve ser um objeto com 1 em cada um dos seis suits
	return allSuits.every(function(suit) {
		return counts[suit] == 1;
	});
}

function areConsecutiveRanks(cards, comparator) {
	// Cria um novo array e ordena pelo "rank traduzido"
	var clone = cards.filter(function(e) { return true; });
	clone.sort(rankComparator(Ranks));

	// Verifica se toda carta vem depois da sua antecessora
	if ( comparator == null )
		var comparator = rankComparator(Ranks);

	for ( var i = 1; i < clone.length; i++ ) {
		var difference = comparator(clone[i-1], clone[i] )
		if ( difference != -1 )
			return false; // uma carta nao eh sucessora da outra
	}
	return true;
}

function findCard(fullName) {

	var pieces = fullName.split("of");
	var rank = _.camelCase(pieces[0]);

	pieces = pieces[1].replace(",", " and ").split("and");
	var suits = pieces.map(function(el) { return _.camelCase(el) });

	matches = Cards.filter(function(card) { return card.rank == rank && _.intersection(card.suits, suits).length == suits.length });
	return matches.length ? matches[0] : null;
}

function makeDeck(fullNames) {
	return fullNames.map(findCard);
}

// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(cards) {
  for(var j, x, i = cards.length; i; j = Math.floor(Math.random() * i), x = cards[--i], cards[i] = cards[j], cards[j] = x);
  return cards;
}

function rankComparator(arr) {
	return function(cardA, cardB) {
		if ( _.isString(cardA) ) cardA = findCard(cardA);
		if ( _.isString(cardB) ) cardB = findCard(cardB);
		return arr.indexOf(cardA.rank) - arr.indexOf(cardB.rank);
	}
}

function cardName(card) {
	return card.rank + ' of ' + card.suits.join( ' and ' );
}

module.exports = {
  Ranks, Suits, Cards,
  countBySuit, countByRank,
  shareOneSuit, shareOneRank,
  rankComparator, cardName, shuffle,
  makeDeck, findCard, areConsecutiveRanks,
  hasOneOfEachSuit
}
