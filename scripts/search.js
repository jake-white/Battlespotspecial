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

		var indexOfSlash = arrayOfResults[i].indexOf('/');
		var indexOfDot = arrayOfResults[i].indexOf('.');
		rating = arrayOfResults[i].slice(indexOfDot+1, indexOfSlash).trim();
		name = arrayOfResults[i].slice(indexOfSlash+1, arrayOfResults[i].length).trim();
		name = name.toLowerCase();
		newRow = document.createElement('p');
		newRow.id=name;
		thisID = arrayOfResults[i].slice(0, indexOfDot);
		newRow.className = "listing";
		if(name.indexOf('-') != -1)
		{
			indexOfFormeDash = name.indexOf('-')
			name = name.slice(0, indexOfFormeDash+1) + name[indexOfFormeDash+1].toUpperCase() + name.slice(indexOfFormeDash+2, name.length);
		}
		newRow.innerHTML = "<img src='gen6icons/"+thisID+".png'>" + '#' + rating + " - " + name[0].toUpperCase() + name.slice(1, name.length);
		table.appendChild(newRow);
		newRow.setAttribute("onclick", "display(\"" + newRow.id + "\");")
	}
}

var thisPokemonName,thisPokemonRanking,movesThatThisPokemonKOsWith,pokemonThatThisPokemonKOs,pokemonOnTheSameTeamWithThisPokemon,movesThatThisPokemonUses,
itemsThatThisPokemonUses,abilitiesThatThisPokemonUses,naturesThatThisPokemonUses,pokemonThatKOThisPokemon,movesThatKOThisPokemon, totalNumberOfThisPokemon, thisPokemonID;

var display = function(id){
	var usageData = '';
	var element = document.getElementById(id);
	console.log(id);
	var indexOfFirstDash = element.innerHTML.indexOf('-')
	var indexOfSecondDash = element.innerHTML.indexOf('-', indexOfFirstDash + 1);
	var indexOfIMG = element.innerHTML.indexOf('<');
	if(indexOfSecondDash != -1)
		name = element.innerHTML.slice(indexOfSecondDash+2, element.innerHTML.length);
	else		
		name = element.innerHTML.slice(indexOfFirstDash+2, element.innerHTML.length);

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

        	thisPokemonName = pokemonData['rankingPokemonInfo']['name'];
        	if(pokemonData['rankingPokemonInfo']['pokemonId'][pokemonData['rankingPokemonInfo']['pokemonId'].indexOf('-')+1] == 0)
        		thisPokemonID = pokemonData['rankingPokemonInfo']['pokemonId'].slice(0, pokemonData['rankingPokemonInfo']['pokemonId'].indexOf('-'));
        	else
        		thisPokemonID = pokemonData['rankingPokemonInfo']['pokemonId'];
            thisPokemonRanking = pokemonData['rankingPokemonInfo']['ranking'];
            movesThatThisPokemonKOsWith = pokemonData['rankingPokemonSuffererWaza'];
            pokemonThatThisPokemonKOs = pokemonData['rankingPokemonSufferer'];
            pokemonOnTheSameTeamWithThisPokemon = pokemonData['rankingPokemonIn'];
            movesThatThisPokemonUses = pokemonData['rankingPokemonTrend']['wazaInfo'];
            itemsThatThisPokemonUses = pokemonData['rankingPokemonTrend']['itemInfo'];
            abilitiesThatThisPokemonUses = pokemonData['rankingPokemonTrend']['tokuseiInfo'];
            naturesThatThisPokemonUses = pokemonData['rankingPokemonTrend']['seikakuInfo'];
            pokemonThatKOThisPokemon = pokemonData['rankingPokemonDown'];
            movesThatKOThisPokemon = pokemonData['rankingPokemonDownWaza'];
            totalNumberOfThisPokemon = pokemonData['rankingPokemonInfo']['totalNumberOfThisPokemon'];
			displayDetail(0);
			console.log(pokemonData);
	    }
	  }
	xmlhttp.open("GET", "Data/" + name + "/usage.txt", true);
	console.log(name);
	xmlhttp.send()
}
var displayDetail = function(id){
	var whatToDisplay = [movesThatThisPokemonUses, itemsThatThisPokemonUses, abilitiesThatThisPokemonUses, naturesThatThisPokemonUses, 
	pokemonOnTheSameTeamWithThisPokemon, movesThatThisPokemonKOsWith, movesThatKOThisPokemon, pokemonThatThisPokemonKOs, pokemonThatKOThisPokemon];
	var dataType = [0,0,0,0,1,2,2,1,1];
	statsHere.innerHTML = 'Detailed information about '+ thisPokemonName +'\n' + '<img src="xy-animated/' + pad(thisPokemonID, 3)+ '.gif">' + '\n' + 'Overall ranking = #' + thisPokemonRanking
		 + '\n';
	console.log(pad(thisPokemonID, 3));
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
	correctFormat = searchInput.value.toLowerCase();
	display(correctFormat);
}

var pad = function(n, width) {
  z = '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}