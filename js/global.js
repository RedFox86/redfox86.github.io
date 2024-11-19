const MAX_LOSS_GAIN = 200;
const colors = ["#047824", "#44ce1b", "#bbdb44", "#f7e379", "#f2a134", "#e51f1f", "#8b0000"];
const page = document.currentScript.getAttribute("page");

var james = {
	rank: "???", 
	name: "James Aloi", 
	elo: 1000, 
	url: "james",
	games: []
};

var luke = {
	rank: "???", 
	name: "Luke Pilaud", 
	elo: 1000, 
	url: "luke",
	games: []
};

var mathew = {
	rank: "???", 
	name: "Mathew Ala", 
	elo: 1000, 
	url: "mathew",
	games: []
};

var nicky = {
	rank: "???", 
	name: "Nicky", 
	elo: 1000, 
	url: "nicky",
	games: []
};

var peter = {
	rank: "???", 
	name: "Peter Langendorf", 
	elo: 1000, 
	url: "peter",
	games: []
};

var tyler = {
	rank: "???", 
	name: "Tyler Cummins", 
	elo: 1000, 
	url: "tyler",
	games: []
};

var william = {
	rank: "???", 
	name: "William Mondello", 
	elo: 1000, 
	url: "william",
	games: []
};

var people = [peter, mathew, tyler, william, james, luke, nicky];

//------------------------------------------------------------------------\\

const game1 = {
	player1: peter, 
	player2: william, 
	tossWinner: peter,
	player1Score: 11, 
	player2Score: 8, 
	player1Faults: 1, 
	player2Faults: 0, 
	player1ServePointsWon: 6, 
	player2ServePointsWon:4, 
	player1Aces: 0, 
	player2Aces: 0, 
	player1PointsWonOffServe: 4,
	player2PointsWonOffServe: 2,
	player1USSRPoints: 0,
	player2USSRPoints: 1,
	date: "11/6/24",
	id: "lang.mond.11.6.24"
};

peter.games.push(game1);
william.games.push(game1);


const allGames = [game1];

//------------------------------------------------------------------------\\

function negpos(num) {
	if (num > 0) {
		return 1;
	} else if (num < 0) {
		return -1;
	}
	return 0;
}

function calcChangeA(P1, P2, T1, T2, X) {
	return negpos(
		(X/P1) * (P1 / P2) * (P2 * T1 - P1 * T2)
	) * Math.sqrt(Math.abs(
		(P1/P2) * (P2 * T1 - P1 * T2)
	))
}

function calcChangeB(P1, P2, T1, T2, X) {
	return negpos(
		(X/P2) * (P2 / P1) * (P1 * T2 - P2 * T1)
	) * Math.sqrt(Math.abs(
		(P2/P1) * (P1 * T2 - P2 * T1)
	))
}

function cap(value) {
	if (value > MAX_LOSS_GAIN) {
		return MAX_LOSS_GAIN;
	} else if (value < MAX_LOSS_GAIN*-1) {
		return MAX_LOSS_GAIN*-1;
	}
	return value;
}

function rankPlayers() {
	people.sort((a, b) => b.elo - a.elo);
	people.forEach((person, index) => {
		person.rank = index + 1;
	});
}

function calculateElo(game) {
	return [
		cap(calcChangeA(game.player1.elo, game.player2.elo, game.player1Score, game.player2Score, game.player1.elo)), 
		cap(calcChangeB(game.player1.elo, game.player2.elo, game.player1Score, game.player2Score, game.player2.elo))
	];
}

//------------------------------------------------------------------------\\

if (page === "index") {
	allGames.forEach(game => {
		var changes = calculateElo(game);
		game.player1.elo += changes[0];
		game.player2.elo += changes[1];
	});

	rankPlayers();

	people.forEach(person => {
		document.getElementById("name" + person.rank).innerText = person.name;
		document.getElementById("name" + person.rank).href = "people/" +person.url+".html";
		document.getElementById("elo" + person.rank).innerText = person.elo;
	});
} else if (page === "statistics") {
	
}