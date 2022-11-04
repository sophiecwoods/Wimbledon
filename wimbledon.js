/** 
 *  Gets user input from form fields 
 *  Calls function to clear any existing results or messages and 
 *  Call function to check user input
 */
function getUserInput() {

    clearResultsArea()

    // get mens or womens tournament value selected from the dropdown
    let selectedTournament = $('#tournament').find(":selected").val();
 
    // get filter applied to player name and the text entered
    let nameFilter = $('#filterName').find(":selected").val();
    let enteredName = $('#enterName').val();
  
    // get filter applied to sets and the number entered
    let setsFilter = $('#filterSets').find(":selected").val();
    let enteredSets = $('#enterSets').val();
 
    // get filter applied to round and the number entered
    let roundFilter = $('#filterRound').find(":selected").val();
    let enteredRound = $('#enterRound').val();

    checkUserInput(selectedTournament, nameFilter, enteredName, setsFilter, enteredSets, roundFilter, enteredRound);
}

/** 
 *  Clears any existing results table and error messages
 */
function clearResultsArea() {

    // clear table body and table headers
    $("#resultsTable tbody").remove(); 
    $("#resultsTable th").remove(); 
    
    // clear error message and create a new empty error message 
    $('#errorMessage').remove();
    $('#resultsArea').append("<p id='errorMessage' class='redText'>" + "</p>");
}

/**
 * Check tournament and optional filters have been applied correctly by calling functions  
 * Once filters are applied correctly calls function to generate all match results or filtered match results
 * @param {JQuery} selectedTournament The dropdown value of the tournament element
 * @param {JQuery} nameFilter The dropdown value of the filterName element
 * @param {JQuery} enteredName The text input to enterName form field
 * @param {JQuery} setsFilter The dropdown value of the filterSets element
 * @param {JQuery} enteredSets The text input to enterSets form field
 * @param {JQuery} roundFilter The dropdown value of the filterRound element
 * @param {JQuery} enteredRound The text input to enterRound form field
 */
function checkUserInput(selectedTournament, nameFilter, enteredName, setsFilter, enteredSets, roundFilter, enteredRound) {

    // used to identify which text field has been passed to the checkOptionalFilters function
    let nameID = $('#enterName').attr('id');
    let setsID = $('#enterSets').attr('id');
    let roundID = $('#enterRound').attr('id');
    
    let tournamentOk = checkTournamentFilter(selectedTournament, errorMessage);
    let nameOk = checkOptionalFilters(nameFilter, enteredName, nameID);
    let setsOk = checkOptionalFilters(setsFilter, enteredSets, setsID);
    let roundOk = checkOptionalFilters(roundFilter, enteredRound, roundID);

    // tournament selected and no other filters applied 
    if (tournamentOk && ((nameFilter === "na" && enteredName.length === 0) || nameFilter === "none")
     && setsFilter === "na"  && enteredSets.length === 0 && roundFilter === "na" && enteredRound.length === 0) { 
        getAllMatches(selectedTournament);
    }

    // tournament selected and all fitlers applied correctly
    else if (tournamentOk && nameOk && setsOk && roundOk) {
        getFilteredMatches(selectedTournament, nameFilter, enteredName, setsFilter, enteredSets, roundFilter, enteredRound);
    } 
}

/**
 * Checks a tournament has been selected and if not returns an error message
 * @param {JQuery} selectedTournament The dropdown value of the tournament element
 * @returns {Boolean} true if tournament selected, false otherwise
 */
function checkTournamentFilter(selectedTournament) {

    let tournamentOk = true;
    // provide error message if tournament has not been seleted
    if (selectedTournament === "na") {
            $('#errorMessage').append("Select a tournament" + "<br/>");
        tournamentOk = false;
    }
    return tournamentOk;
}

/**
 * Checks optional filters have been applied correctly with numerical input type for sets and round
 * If filters have not been applied correctly or input type is incorrect returns an error message
 * @param {JQuery} selectedFilter The dropdown value of the filterName/filterSets/filterRound element
 * @param {JQuery} enteredText The text input to enterName/enterSets/enterRound form field
 * @param {JQuery} ID The attribute ID of enterName/enterSets/enterRound
 * @returns {Boolean} true if optional filters applied correctly, false otherwise
 */
function checkOptionalFilters(selectedFilter, enteredText, ID) {

    let filtersOk = true;
    const filterErrors = ["Select a filter for player name", "Select a filter for number of sets", "Select a filter for round number"];
    const textErrors = ["Enter a player name", "Enter number of sets", "Enter a round number"];
    const numErrors = ["", "Enter a number for number of sets", "Enter a number for round"];
    const filters = ["name", "sets", "round"];
    const textIDs = [$('#enterName').attr('id'), $('#enterSets').attr('id'), $('#enterRound').attr('id')];
  
    // check whhich of the name/sets/round values are passed in as selectedFilter and enteredText
    // assign a number (0, 1, 2) to thisFilter and thisText which correspondence to name/sets/round 
    let thisFilter = null;
    let thisText = null;
    for (i=0; i<filters.length; i++ ) {
        // checks selectedFilter based on string value
        if (selectedFilter.includes(filters[i])) thisFilter = i;
        // checks enteredText using attribute ID
        if (ID === textIDs[i]) thisText = i;
        
    }
    // provide error message if player name/sets/round filter has been selected but text has not been entered
    if (selectedFilter != "na" && enteredText.length === 0) {
        // checks that selectedFilter is not 'none' for playerName
            if (thisFilter != null) {
                $('#errorMessage').append(textErrors[thisFilter] + "<br/>");
                filtersOk = false;   
            }
    }     
    // provide error message if player name/sets/round number field has text entered but filter has not been selected
    else if (selectedFilter === "na" && enteredText.length > 0) {
        $("#errorMessage").append(filterErrors[thisText] + "<br/>");
        filtersOk = false;
    }     
    // provide error message if text entered in sets/round field is not an integer
    // for enteredRound this provides a more helpful message to the user, as it will be handled as a String to match the JSON data
    else if (selectedFilter != "na" && enteredText.length > 0) {
        if (ID === textIDs[1] || ID === textIDs[2]) {
            if (isNaN(parseInt(enteredText))) {
                 $('#errorMessage').append(numErrors[thisText] + "<br/>");
                filtersOk = false;
            } 
        }
    }      
    return filtersOk;
}

/**
 * Populates table with all mens or all womens matches 
 * @param {Jquery} selectedTournament The dropdown value of the tournament element
 */
function getAllMatches(selectedTournament) {
    
    let json = getJSONfile(selectedTournament);
    $.getJSON(json, function(data){
        // call function to generate and append table header
        populateTableHeader(selectedTournament);
        // create tableBody String to hold the rows for each match
        let tableBody = "";
        // loop through each match 
        $.each(data.match, function(i, matchValue) {
            // call function to populate tableBody with the match values
            tableBody = populateTableBody(matchValue)
            $('#resultsTable').append("<tbody>" + tableBody + "<tbody>") 
        });
    });
}

/**
 * Populates table with mens or womens matches based on fitlers applied by user 
 * @param {JQuery} selectedTournament The dropdown value of the tournament element
 * @param {JQuery} nameFilter The dropdown value of the filterName element
 * @param {JQuery} enteredName The text input to enterName form field
 * @param {JQuery} setsFilter The dropdown value of the filterSets element
 * @param {JQuery} enteredSets The text input to enterSets form field
 * @param {JQuery} roundFilter The dropdown value of the filterRound element
 * @param {JQuery} enteredRound The text input to enterRound form field
 */
function getFilteredMatches(selectedTournament, nameFilter, enteredName, setsFilter, enteredSets, roundFilter, enteredRound) {

    let json = getJSONfile(selectedTournament);
    $.getJSON(json, function(data){
        let headerCreated = false;
        let tableBody = "";
        // stores whether player name/number of sets/round number entered by user matches name/sets/round for each match
        // originally set to true in case user has not filtered on that field
        let nameMatches = true; 
        let setMatches = true; 
        let roundMatches = true;
        // loop through each match to get round and player data
        $.each(data.match, function(i, matchValue) {
            // check name filter has been applied and if so, if entry matches data
            if ((nameFilter === "nameContains") || (nameFilter === "nameEquals") && enteredName.length > 0) {
                nameMatches = checkNameMatches(matchValue, nameFilter, enteredName);  
            }
            // check sets filter has been applied and if so, if entry matches data
            if (setsFilter != "na" && enteredSets) {
                setMatches = checkSetsMatches(matchValue, setsFilter, enteredSets)
            }
           // check round filter has been applied and if so, if entry matches data
            if (roundFilter != "na" && enteredRound.length > 0)   {
                roundMatches = checkRoundMatches(matchValue, roundFilter, enteredRound)
            }
            if (nameMatches && setMatches && roundMatches) {
                if (! headerCreated) {
                    // call function to generate and append table header
                    populateTableHeader(selectedTournament);
                    headerCreated = true; 
                }
                tableBody = populateTableBody(matchValue)
                $('#resultsTable').append("<tbody>" + tableBody + "<tbody>") 
            }     
        });
        // if no results found provide a message
        if (!headerCreated) {
            $('#errorMessage').append("No results found");
        }
    });  
}

/**
 * Returns name of mens or womens json file based on tournament selected 
 * @param {*} selectedTournament The dropdown value of the tournament element
 * @returns {String} The name of the JSON file
 */
function getJSONfile(selectedTournament) {

    const jsonFiles = ["wimbledon-men.json", "wimbledon-women.json"];
    let json = "";
    if (selectedTournament === "men") {
        json = jsonFiles[0];
    }
    else if (selectedTournament === "women") {
        json = jsonFiles[1];
    }
    return json;
}

/**
 * Adds mens or womens header to table based on tournament selected
 * @param {*} selectedTournament The dropdown value of the tournament element
 */
function populateTableHeader(selectedTournament) {
    
    const mensHeaders = ["Round", "Player", "Set 1", "Set 2", "Set 3", "Set 4", "Set 5"];
    const womensHeaders = ["Round", "Player", "Set 1", "Set 2", "Set 3"];
    let headers;
    if (selectedTournament == "men") {
        headers = mensHeaders;
    } 
    else {
        headers = womensHeaders;
    }
    for(i=0; i < headers.length; i++){
        $('#resultsTH').append("<th>" + headers[i] + "</th>")
    }
}

/**
 * Creates a table body element for each match 
 * @param {JSON array} matchValue The match array from the JSON file
 * @returns {String} The HTML content for the tbody element
 */
function populateTableBody(matchValue) {
    
    let tableBody = "";
    // loop through each player within each match to get the player names and set scores
    $.each(matchValue.player, function(i, playerValue) {      
        // if player won format name to be bold text
        let nameFormatted = formatName(playerValue);
        // get number of sets played
        let numOfSets = Object.keys(playerValue.set).length;
        // add first 2 set results to tableBody as default
        tableBody += "<tr><td>" + matchValue.round + "</td><td>" + nameFormatted + "</td><td>" + playerValue.set[0] 
        + "</td><td>" + playerValue.set[1]
        // add further results depending on number of sets played (2, 3, 4 or 5)
        if (numOfSets === 2) {
            tableBody += "</td></tr>"
        }
        else if (numOfSets === 3) {
            tableBody += "</td><td>" + playerValue.set[2] + "</td></tr>"
        }
        else if (numOfSets == 4) {
            tableBody += "</td><td>" + playerValue.set[2] + "</td><td>" + playerValue.set[3] + "</td></tr>"
         }
        else {
            tableBody += "</td><td>" + playerValue.set[2] + "</td><td>" + playerValue.set[3] + "</td><td>" 
            + playerValue.set[4]+ "</td></tr>"   
        }   
    }); 
    return tableBody;
}

/**
 * Formats winning player's name as bold text 
 * @param {JSON array} playerValue The player array from the JSON file
 * @returns {String} player name
 */
function formatName(playerValue) {
    
    let nameFormatted = "";
    if (playerValue.outcome === "won") {
        nameFormatted = playerValue.name.bold();
    }
    else {
        nameFormatted = playerValue.name;
    }
    return nameFormatted;
}

/**
 * Checks whether either player in match matches user query
 * @param {JSON array} matchValue The match array from the JSON file
 * @param {JQuery} nameFilter The dropdown value of the filterName element
 * @param {JQuery} enteredName The text input to enterName form field
 * @returns {Boolean} true if query matches JSON data, false otherwise
 */
function checkNameMatches(matchValue, nameFilter, enteredName) {
   
    let result = false;
    if (nameFilter === "nameEquals") {
        if (matchValue.player[0].name === enteredName || matchValue.player[1].name === enteredName) {
            result = true;
        }
    }
    else if (nameFilter === "nameContains") {
        if (matchValue.player[0].name.includes(enteredName) || matchValue.player[1].name.includes(enteredName)) {
            result = true;
        }
    }
    return result;
}   

/**
 * Checks whether number of sets matches user query
 * @param {JSON array} matchValue The match array from the JSON file
 * @param {JQuery} setsFilter The dropdown value of the filterSets element
 * @param {JQuery} enteredSets The text input to enterSets form field
 * @returns {Boolean} true if query matches JSON data, false otherwise
 */
function checkSetsMatches(matchValue, setsFilter, enteredSets) {
    
    let result = false;
    // get the number of sets played
    const actualSets = Object.keys(matchValue.player[0].set).length;
    const parsedSets = parseInt(enteredSets);

    if (setsFilter === "setsEquals" && actualSets === parsedSets) {
        result = true;
    }
    else if (setsFilter === "setsGreater" && actualSets > parsedSets) {
        result = true;
    }
    else if (setsFilter === "setsLess" && actualSets < parsedSets) {
    result = true;
    }
    return result;
}

/**
 * Checks whether number of sets matches user query
 * @param {JSON array} matchValue The match array from the JSON file
 * @param {JQuery} roundFilter The dropdown value of the filterRound element
 * @param {JQuery} enteredRound The text input to enterRound form field
 * @returns {Boolean} true if query matches JSON data, false otherwise
 */
function checkRoundMatches(matchValue, roundFilter, enteredRound) {
   
    let result = false;
    if (roundFilter === "roundEquals" && matchValue.round === enteredRound ) {
        result = true;
    }
    else if (roundFilter === "roundGreater" && matchValue.round > enteredRound) {
        result = true;
    }
    else if (roundFilter === "roundLess" && matchValue.round < enteredRound) {
        result = true;
    }
    return result;
}

window.onload = function() {
    document.getElementById('results').onclick = getUserInput;
}
