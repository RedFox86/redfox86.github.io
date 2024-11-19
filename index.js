var statPeter = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statMathew = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statTyler = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statWilliam = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statJames = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statLuke = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statNicky = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};

var peter = {rank: "???", name: "Peter Langendorf", elo: 1000, url: "peter", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statPeter};
var mathew = {rank: "???", name: "Mathew Ala", elo: 1000, url: "mathew", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statMathew};
var tyler = {rank: "???", name: "Tyler Cummins", elo: 1000, url: "tyler", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statTyler};
var william = {rank: "???", name: "William Mondello", elo: 1000, url: "william", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statWilliam};
var james = {rank: "???", name: "James Aloi", elo: 1000, url: "james", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statJames};
var luke = {rank: "???", name: "Luke Pilaud", elo: 1000, url: "luke", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statLuke};
var nicky = {rank: "???", name: "Nicky", elo: 1000, url: "Nicky", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statNicky};

var people = [peter, mathew, tyler, william, james, luke, nicky];

const colors = ["#047824", "#44ce1b", "#bbdb44", "#f7e379", "#f2a134", "#e51f1f", "#8b0000"];

var recentGames = [];

function negpos(num) {
	if (num > 0) {
		return 1;
	} else if (num < 0) {
		return -1;
	}
	return 0;
}
function getTeamAverage(elo1, elo2) {
	return (elo1+elo2) / 2;
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
function calculate(P1, P2, T1, T2, P1S, P2S, gameName) {
	var change1 = calcChangeA(P1.elo, P2.elo, T1, T2, P1.elo);
	var change2 = calcChangeB(P1.elo, P2.elo, T1, T2, P2.elo);
	if (change1 > 200) {
		change1 = 200;
	}
	if (change2 > 200 ) {
		change2 = 200;
	}
	if (change1 < -200) {
		change1 = -200;
	}
	if (change2 < -200) {
		change2 = -200;
	}
	P1.elo += change1;
	P2.elo += change2;

	if (P1.elo > P1.peak_elo) {
		P1.peak_elo = P1.elo;
	}
	if (P2.elo > P2.peak_elo) {
		P2.peak_elo = P2.elo;
	}
	people.sort((a, b) => b.elo - a.elo);
	people.forEach((person, index) => {
		person.rank = index + 1;
	});
	if (P1.highest_rank === "???") {
		P1.highest_rank = P1.rank;
	}
	if (P2.highest_rank === "???") {
		P2.highest_rank = P2.rank;
	}
	if (P1.rank < P1.highest_rank) {
		P1.highest_rank = P1.rank;
	}
	if (P2.rank < P2.highest_rank) {
		P2.highest_rank = P2.rank;
	}
	if (T1 > T2) { //P1 wins!
		P1.wins++;
		P2.losses++;

		updateRecent(P1.stat.wins, 1);
		updateRecent(P2.stat.wins, 0);
		updateRecent(P1.stat.victory, [T1, T2]);
		if (T1/T2 > P1.victory[0] / P1.victory[1]) {
			P1.victory = [T1, T2];
		}
		P1.stat.victories.push([T1, T2]);
	} else { //P2 wins!
		P1.losses++;
		P2.wins++;

		updateRecent(P1.stat.wins, 0);
		updateRecent(P2.stat.wins, 1);
		updateRecent(P2.stat.victory, [T2, T1]);
		if (T2/T1 > P2.victory[0] / P2.victory[1]) {
			P2.victory = [T2, T1];
		}
		P2.stat.victories.push([T2, T1]);
	}
	updateRecent(P1.stat.peak_elo, P1.elo);
	updateRecent(P2.stat.peak_elo, P2.elo);
	updateRecent(P1.stat.highest_rank, P1.rank);
	updateRecent(P2.stat.highest_rank, P2.rank);

	P1.stat.elo.push(P1.elo);
	P2.stat.elo.push(P2.elo);
	P1.stat.rank.push(P1.rank);
	P2.stat.rank.push(P2.rank);

	P1.faults += P1S[0];
    P2.faults += P2S[0];
    P1.spw += P1S[1];
    P2.spw += P2S[1];
	P1.aces += P1S[2];
	P2.aces += P2S[2];


	updateRecent(P1.stat.faults, P1S[0]);
	updateRecent(P2.stat.faults, P2S[0]);
	updateRecent(P1.stat.spw, P1S[1]);
	updateRecent(P2.stat.spw, P2S[1]);
	updateRecent(P1.stat.aces, P1S[2]);
	updateRecent(P2.stat.aces, P2S[2]);

	updateRecent(recentGames, [P1, P2, T1, T2, P1S, P2S, gameName]);
}

function updateRecent(array, value) {
	if (array.length === 7) {
		array.shift();
	}
	array.push(value);
}

function arraySum(array) {
	var sum = 0;

	for (let i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return sum;
}

function arrayMax(array) {
	var max = 0;

	for (let i = 0; i < array.length; i++) {
		if (array[i] > max) {
			max = array[i];
		}
	}
	return max;
}

function arrayMin(array) {
	var min = 1000000;

	for (let i = 0; i < array.length; i++) {
		if (array[i] < min) {
			min = array[i];
		}
	}
	return min;
}

function arrayDiff(array) {
	var index = -1;

	for (let i = 0; i < array.length; i++) {
		if (array[i][0] / array[i][1] > index) {
			index = i;
		}
	}
	return array[index];
}

function arrayAvg(array) {
	var a1 = 0;
	var a2 = 0;
	for (let i = 0; i < array.length; i++) {
		a1 += array[i][0];
		a2 += array[i][1];
	}
	return [(a1/array.length).toFixed(2), (a2/array.length).toFixed(2)];
}

/*
william:
points won off serve: 2
serve points won: 4
points: 8
aces: 0
faults: 0
sus points: 1


Peter: wins toss
points won off serve: 4
serve points won: 6
points: 11
aces: 0
faults: 1

11/6/24
*/

calculate(peter, william, 11, 8, [1, 6, 0], [0, 4, 0], "lang.mond.11.6.24");

/*
james:
points won off serve: 0
serve points won: 4
points: 7
aces: 0
faults: 1
sus points: 0


Peter: wins toss
points won off serve: 2
serve points won: 7
points: 11
aces: 0
faults: 0

11/6/24
*/

calculate(peter, james, 11, 7, [0, 7, 0], [1, 4, 0], "lang.aloi.11.6.24");

/*
William: wins toss
points won off serve: 2
serve points won: 2
points: 3
aces: 0
faults: 0
sus points: 1


Peter:
points won off serve: 3
serve points won: 8
points: 11
aces: 0
faults: 0

11/6/24
*/

calculate(peter, william, 11, 3, [0, 8, 0], [0, 2, 0], "lang.mond.11.7.24");

/*
James: wins toss
points won off serve: 0
serve points won: 1
points: 3
aces: 0
faults: 0
sus points: 0


Peter:
points won off serve: 2
serve points won: 7
points: 11
aces: 0
faults: 0

11/6/24
*/

calculate(peter, james, 11, 3, [0, 7, 0], [0, 1, 0], "lang.aloi.11.7.24");

/*
Nicky: 
points won off serve: 0
serve points won: 1
points: 2
aces: 0
faults: 0
sus points: 0


Peter: wins toss
points won off serve: 0
serve points won: 9
points: 11
aces: 0
faults: 0

11/6/24
*/

calculate(peter, nicky, 11, 2, [0, 9, 0], [0, 1, 0], "lang.nicky.11.7.24");

/*
Luke: 
points won off serve: 0
serve points won: 0
points: 0
aces: 0
faults: 0
ussr points: 0


Peter: wins toss
points won off serve: 2
serve points won: 10
points: 11
aces: 0
faults: 0

11/6/24
*/

calculate(peter, luke, 11, 0, [0, 10, 0], [0, 0, 0], "lang.luke.11.7.24");

/*
Mathew: 
points won off serve: 5
serve points won: 11
points: 21
aces: 0
faults: 1
ussr points: 0


Peter: wins toss
points won off serve: 4
serve points won: 6
points: 14
aces: 0
faults: 2
ussr points: 2
*/

calculate(mathew, peter, 21, 14, [1, 11, 0], [2, 6, 0], "lang.alla.11.18.24");

var page = document.currentScript.getAttribute("page");
var player = null;
var avg = [];
var index = null;

if (page === "index") {
	people.forEach(person => {
		document.getElementById("name" + person.rank).innerText = person.name;
		document.getElementById("name" + person.rank).href = "people/" +person.url+".html";
		document.getElementById("elo" + person.rank).innerText = person.elo;
	});

	document.getElementById("gamearchive1").innerText = recentGames[0][6];
} else {
	people.forEach(person => {
		if (page == person.url) {
			player = person;
		}
	});

	document.getElementById("recentWins").innerText = arraySum(player.stat.wins);
	document.getElementById("allTimeWins").innerText = player.wins
	document.getElementById("averageWins").innerText = (player.wins / player.losses).toFixed(2);

	document.getElementById("recentLosses").innerText = player.stat.wins.length - arraySum(player.stat.wins);
	document.getElementById("allTimeLosses").innerText = player.losses
	document.getElementById("averageLosses").innerText = (player.losses / player.wins).toFixed(2);

	document.getElementById("recentPeakElo").innerText = arrayMax(player.stat.peak_elo).toFixed(2);
	document.getElementById("allTimePeakElo").innerText = player.peak_elo.toFixed(2)
	document.getElementById("averagePeakElo").innerText = (arraySum(player.stat.elo) / player.stat.elo.length).toFixed(2);

	document.getElementById("recentHighestRank").innerText = arrayMin(player.stat.highest_rank);
	document.getElementById("allTimeHighestRank").innerText = player.highest_rank;
	document.getElementById("averageHighestRank").innerText = (arraySum(player.stat.rank) / player.stat.rank.length).toFixed(2);

	document.getElementById("recentFaults").innerText = arraySum(player.stat.faults);
	document.getElementById("allTimeFaults").innerText = player.faults;
	document.getElementById("averageFaults").innerText = (player.faults / (player.wins+player.losses)).toFixed(2);

	document.getElementById("recentServePointsWon").innerText = arraySum(player.stat.spw);
	document.getElementById("allTimeServePointsWon").innerText = player.spw;
	document.getElementById("averageServePointsWon").innerText = (player.spw / (player.wins+player.losses)).toFixed(2);

	document.getElementById("recentAces").innerText = arraySum(player.stat.aces);
	document.getElementById("allTimeAces").innerText = player.aces;
	document.getElementById("averageAces").innerText = player.aces / (player.wins+player.losses).toFixed(2);

	document.getElementById("recentVictory").innerText = arrayDiff(player.stat.victory);
	document.getElementById("allTimeVictory").innerText = player.victory;
	document.getElementById("averageVictory").innerText = arrayAvg(player.stat.victories);

	people.forEach(person => {
		avg.push(arraySum(person.stat.wins));
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(arraySum(player.stat.wins));
	document.getElementById("recentWins").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.wins);
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(player.wins);
	document.getElementById("allTimeWins").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push((person.wins / person.losses));
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf((player.wins / player.losses));
	document.getElementById("averageWins").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.stat.wins.length - arraySum(person.stat.wins));
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf(player.stat.wins.length - arraySum(player.stat.wins));
	document.getElementById("recentLosses").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.losses);
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf(player.losses);
	document.getElementById("allTimeLosses").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push((person.wins / person.losses));
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf((player.wins / player.losses));
	document.getElementById("averageLosses").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(arrayMax(person.stat.peak_elo));
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(arrayMax(player.stat.peak_elo));
	document.getElementById("recentPeakElo").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.peak_elo);
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(player.peak_elo);
	document.getElementById("allTimePeakElo").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push((arraySum(person.stat.elo) / person.stat.elo.length));
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf((arraySum(player.stat.elo) / player.stat.elo.length));
	document.getElementById("averagePeakElo").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(arrayMin(person.stat.highest_rank));
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf(arrayMin(player.stat.highest_rank));
	document.getElementById("recentHighestRank").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.highest_rank);
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf(player.highest_rank);
	document.getElementById("allTimeHighestRank").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push((arraySum(person.stat.rank) / person.stat.rank.length));
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf((arraySum(player.stat.rank) / player.stat.rank.length));
	document.getElementById("averageHighestRank").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(arraySum(person.stat.faults));
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf(arraySum(player.stat.faults));
	document.getElementById("recentFaults").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.faults);
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf(player.faults);
	document.getElementById("allTimeFaults").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.faults / (person.wins+player.losses));
	});
	avg.sort((a, b) => a - b);
	index = avg.indexOf(player.faults / (player.wins+player.losses));
	document.getElementById("averageFaults").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(arraySum(person.stat.spw));
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(arraySum(player.stat.spw));
	document.getElementById("recentServePointsWon").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.spw);
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(player.spw);
	document.getElementById("allTimeServePointsWon").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.spw / (player.wins+player.losses));
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(player.spw / (player.wins+player.losses));
	document.getElementById("averageServePointsWon").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(arraySum(person.stat.aces));
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(arraySum(player.stat.aces));
	document.getElementById("recentAces").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.aces);
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(player.aces);
	document.getElementById("allTimeAces").style.backgroundColor = colors[index];

	avg = [];
	people.forEach(person => {
		avg.push(person.aces / (player.wins+player.losses));
	});
	avg.sort((a, b) => b - a);
	index = avg.indexOf(player.aces / (player.wins+player.losses));
	document.getElementById("averageAces").style.backgroundColor = colors[index];
}