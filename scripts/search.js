var statsHere = document.getElementById("statshere");
var searchInput = document.getElementById("searchInput");
var xmlhttp;
var results = "";

var load = function(){
	//loading results via XMLHttp
	
	  if (window.XMLHttpRequest) {
	  	// code for modern browsers
	    xmlhttp = new XMLHttpRequest();
	  } else {
	    // code for older browsers
	    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	  }

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {      
			results = xmlhttp.responseText;
			displayTable();
	    }
	  }
	xmlhttp.open("GET", "Data/results.txt", true);
	xmlhttp.send()
}

var displayTable = function(){

	var arrayOfResults = results.split("\n");

	table = document.getElementById("left-column");
	table.border = "1";
	table.cellpadding = "5";
	table.cellspacing = "5";
	for(var i = 0; i < arrayOfResults.length - 1; ++i){

		indexOfDash = arrayOfResults[i].indexOf('-');
		rating = arrayOfResults[i].slice(0, indexOfDash).trim();
		name = arrayOfResults[i].slice(indexOfDash+1, arrayOfResults[i].length).trim();
		newRow = document.createElement('p');
		newRow.id=name;
		newRow.className = "listing";
		newRow.innerHTML = '#' + rating + " - " + name;
		table.appendChild(newRow);
		newRow.setAttribute("onclick", "display(\"" + name + "\");")
	}
}

var thisPokemonName,thisPokemonRanking,movesThatThisPokemonKOsWith,pokemonThatThisPokemonKOs,pokemonOnTheSameTeamWithThisPokemon,movesThatThisPokemonUses,
itemsThatThisPokemonUses,abilitiesThatThisPokemonUses,naturesThatThisPokemonUses,pokemonThatKOThisPokemon,movesThatKOThisPokemon, totalNumberOfThisPokemon;

var display = function(id){
	var usageData = '';
	var element = document.getElementById(id);
	var indexOfDash = element.innerHTML.indexOf('-');
	name = element.innerHTML.slice(indexOfDash+2, element.innerHTML.length);

	if (window.XMLHttpRequest) {
	  	// code for modern browsers
	    xmlhttp = new XMLHttpRequest();
	  } else {
	    // code for older browsers
	    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	  }

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			usageData = xmlhttp.responseText;
			var pokemonData = JSON.parse(usageData);

        	thisPokemonName = pokemonData['rankingPokemonInfo']['name']
            thisPokemonRanking = pokemonData['rankingPokemonInfo']['ranking']
            movesThatThisPokemonKOsWith = pokemonData['rankingPokemonSuffererWaza']
            pokemonThatThisPokemonKOs = pokemonData['rankingPokemonSufferer']
            pokemonOnTheSameTeamWithThisPokemon = pokemonData['rankingPokemonIn']
            movesThatThisPokemonUses = pokemonData['rankingPokemonTrend']['wazaInfo']
            itemsThatThisPokemonUses = pokemonData['rankingPokemonTrend']['itemInfo']
            abilitiesThatThisPokemonUses = pokemonData['rankingPokemonTrend']['tokuseiInfo']
            naturesThatThisPokemonUses = pokemonData['rankingPokemonTrend']['seikakuInfo']
            pokemonThatKOThisPokemon = pokemonData['rankingPokemonDown']
            movesThatKOThisPokemon = pokemonData['rankingPokemonDownWaza']
            totalNumberOfThisPokemon = pokemonData['rankingPokemonInfo']['totalNumberOfThisPokemon'];
			displayDetail(0);
	    }
	  }
	xmlhttp.open("GET", "Data/" + name+ "/usage.txt", true);
	xmlhttp.send()
}
var displayDetail = function(id){
	var whatToDisplay = [movesThatThisPokemonUses, itemsThatThisPokemonUses, abilitiesThatThisPokemonUses, naturesThatThisPokemonUses, 
	pokemonOnTheSameTeamWithThisPokemon, movesThatThisPokemonKOsWith, movesThatKOThisPokemon, pokemonThatThisPokemonKOs, pokemonThatKOThisPokemon];
	var dataType = [0,0,0,0,1,2,2,1,1];
	statsHere.innerHTML = 'Detailed information about '+ thisPokemonName +'\n' + 'Overall ranking = #' + thisPokemonRanking + '\n';

	statsHere.appendChild(JSONtoHTML(whatToDisplay[id], dataType[id]));
}
var JSONtoHTML = function(element, dataType)
{
	stringVersion = document.createElement('table');
	stringVersion.className = "statsTable";
	if(dataType==0)
		stringVersion.innerHTML = '<tr><td>Ranking</td><td>Name</td><td>Usage Rate</td><td>Total Amount of Uses</td>'
	else if(dataType==1)
		stringVersion.innerHTML = '<tr><td>Ranking</td><td>Name</td>'
	for(var i = 0; i < element.length; ++i)
	{
		if(dataType==0)
			stringVersion.innerHTML += '<tr>' + '<td>' + element[i]['ranking']+'</td>'+ '<td>' + element[i]['name']+'</td>'+ '<td>' + element[i]['usageRate']+"%"+'</td>'+ '<td>' + Math.round(totalNumberOfThisPokemon*element[i]['usageRate']/100) + '</td>'+'</tr>\n';
		else if(dataType==1)
			stringVersion.innerHTML += '<tr>' + '<td>' + element[i]['ranking']+'</td>'+ '<td>' + element[i]['name']+'</td></tr>\n';
		else if(dataType==2)
			stringVersion.innerHTML += '<tr>' + '<td>' + element[i]['ranking']+'</td>'+ '<td>' + element[i]['wazaName']+'</td>'+ '<td>' + element[i]['usageRate']+"%"+'</td>'+ '<td>' + Math.round(totalNumberOfThisPokemon*element[i]['usageRate']/100) + '</td>'+'</tr>\n';


	}
	return stringVersion;
}
var search = function(){
	correctFormat = searchInput.value.charAt(0).toUpperCase() + searchInput.value.slice(1).toLowerCase();
	display(correctFormat);
}