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
itemsThatThisPokemonUses,abilitiesThatThisPokemonUses,naturesThatThisPokemonUses,pokemonThatKOThisPokemon,movesThatKOThisPokemon;
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
            totalNumberOfThisPokemon = 0;
            listOfPercentages = []
            listOfDenominators = []

			statsHere.innerHTML = 'Detailed information about '+ thisPokemonName +'\n' + 'Overall ranking = #' + thisPokemonRanking + '\n';
			statsHere.innerHTML += getJSONData(movesThatThisPokemonUses);
			statsHere.innerHTML += getJSONData(pokemonOnTheSameTeamWithThisPokemon);
	    }
	  }
	xmlhttp.open("GET", "Data/" + name+ "/usage.txt", true);
	xmlhttp.send()
}
var getJSONData = function(element)
{
	stringVersion = ''
	console.log(element.length);
	console.log(element[0]);
	for(var i = 0; i < element.length; ++i)
	{
		 stringVersion += '<td>' + '<tr>' + element[i]['ranking']+'</tr>'+ '<tr>' + element[i]['name']+'</tr>'+ '<tr>' + element[i]['usageRate']+"%"+'</tr>'+ '<tr>' + totalNumberOfThisPokemon*element[i]['usageRate']/100 + '</tr>'+'</td>';
	}
	return stringVersion;
}
var search = function(){
	correctFormat = searchInput.value.charAt(0).toUpperCase() + searchInput.value.slice(1).toLowerCase();
	display(correctFormat);
}