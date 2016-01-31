var searchInput = document.getElementById("searchInput");
var xmlhttp;
var results = "";

var load = function(){
	//loading results via XMLHttp
	
	  if (window.XMLHttpRequest) {
	  	// code for older browsers
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

	table = document.getElementById("listing");
	table.border = "1";
	table.cellpadding = "5";
	table.cellspacing = "5";
	for(var i = 0; i < arrayOfResults.length - 1; ++i){

		indexOfDash = arrayOfResults[i].indexOf('-');
		rating = arrayOfResults[i].slice(0, indexOfDash);
		name = arrayOfResults[i].slice(indexOfDash+1, arrayOfResults[i].length);
		newRow = document.createElement('tr');
		ratingCol = document.createElement('td');
		ratingCol.innerHTML = rating;
		newRow.appendChild(ratingCol);
		nameCol = document.createElement('td');
		nameCol.innerHTML = name;
		newRow.appendChild(nameCol);
		table.appendChild(newRow);
	}
}
var search = function(){
	correctFormat = searchInput.value.charAt(0).toUpperCase() + searchInput.value.slice(1).toLowerCase();	
}