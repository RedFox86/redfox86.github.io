var statPeter = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statMathew = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statTyler = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statWilliam = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statJames = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statLuke = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};
var statDavid = {wins: [], peak_elo: [], highest_rank: [], faults: [], spw: [], aces: [], victory: [], elo: [], rank: [], victories: []};

var peter = {rank: "???", name: "Peter Langendorf", elo: 1000, url: "peter", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statPeter};
var mathew = {rank: "???", name: "Mathew Ala", elo: 1000, url: "mathew", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statMathew};
var tyler = {rank: "???", name: "Tyler Cummins", elo: 1000, url: "tyler", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statTyler};
var william = {rank: "???", name: "William Mondello", elo: 1000, url: "william", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statWilliam};
var james = {rank: "???", name: "James Aloi", elo: 1000, url: "james", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statJames};
var luke = {rank: "???", name: "Luke Pilaud", elo: 1000, url: "luke", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statLuke};
var david = {rank: "???", name: "David Tawfik", elo: 1000, url: "david", highest_rank: "???", wins: 0, losses: 0, peak_elo: 1000, faults : 0, spw : 0, aces : 0, victory : [0, 1], stat : statDavid};

var people = [peter, mathew, tyler, william, james, luke, david];

function negpos(num) {
	if (num > 0) {
		return 1;
	} else if (num < 0) {
		return -1;
	} else {
		return 0;
	}
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
function calculate(P1, P2, T1, T2) {
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

calculate(peter, james, 21, 2);
calculate(peter, james, 21, 4);
calculate(peter, william, 21, 11);
calculate(mathew, tyler, 33, 18);
calculate(tyler, peter, 11, 9);
calculate(peter, tyler, 11, 5);
calculate(peter, david, 21, 5);
calculate(peter, david, 11, 2);
calculate(david, peter, 11, 8);
calculate(mathew, peter, 11, 8);
calculate(tyler, david, 9, 4);
calculate(william, david, 11, 2);
calculate(james, mathew, 13, 11);
calculate(peter, william, 11, 8);
calculate(tyler, william, 11, 9);
calculate(tyler, peter, 11, 8);
calculate(peter, william, 11, 2);
calculate(peter, william, 11, 8);
calculate(peter, james, 11, 4);
calculate(peter, william, 11, 7);
calculate(peter, james, 4, 11);
calculate(peter, james, 4, 11);
calculate(peter, james, 4, 11);
calculate(peter, james, 4, 11);
calculate(peter, james, 11, 4);
calculate(peter, james, 11, 4);
calculate(peter, james, 11, 4);
calculate(peter, james, 11, 4);
calculate(peter, james, 11, 4);
calculate(peter, james, 11, 4);

var page = document.currentScript.getAttribute("page")
var player = null;

if (page === "index") {
	people.forEach(person => {
		document.getElementById("name" + person.rank).innerText = person.name;
		document.getElementById("name" + person.rank).href = "people/" +person.url+".html";
		document.getElementById("elo" + person.rank).innerText = person.elo;
	});
} else {
	people.forEach(person => {
		if (page == person.url) {
			player = person;
		}
	});

	document.getElementById("recentWins").innerText = arraySum(player.stat.wins);
	document.getElementById("allTimeWins").innerText = player.wins
	document.getElementById("averageWins").innerText = (player.wins / player.losses).toFixed(2);

	document.getElementById("recentLosses").innerText = 7 - arraySum(player.stat.wins);
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
	document.getElementById("averageFaults").innerText = player.faults / (player.wins+player.losses).toFixed(2);

	document.getElementById("recentServePointsWon").innerText = arraySum(player.stat.spw);
	document.getElementById("allTimeServePointsWon").innerText = player.spw;
	document.getElementById("averageServePointsWon").innerText = player.spw / (player.wins+player.losses).toFixed(2);

	document.getElementById("recentAces").innerText = arraySum(player.stat.aces);
	document.getElementById("allTimeAces").innerText = player.aces;
	document.getElementById("averageAces").innerText = player.aces / (player.wins+player.losses).toFixed(2);

	document.getElementById("recentVictory").innerText = arrayDiff(player.stat.victory);
	document.getElementById("allTimeVictory").innerText = player.victory;
	document.getElementById("averageVictory").innerText = arrayAvg(player.stat.victories);
}