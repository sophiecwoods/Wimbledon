# Coursework for Internet and Web Technologies module (2021/22)

The purpose of this coursework is to help you learn about using Javascript, the DOM and jQuery to process JSON data. The coursework will be assessed and counts 10% of the final mark for this module.

## The task
The JSON data you will be working with represents results of tennis matches played at Wimbledon some years ago. Specifically, you will use results for the men's and women's tournaments, which are stored in wimbledon-men.json and wimbledon-women.json, respectively. For each match (represented by elements of the "match" array), the file contains information about the round ("round" key) in which the match took place (possible values are 1 to 7), and the two players involved ("player" array). Each player has their name recorded ("name"), the outcome ("outcome") of the match for them (with values "won" or "lost"), and the number of sets won ("sets-won"), with possible values being 0 to 3 for men and 0 to 2 for women. This is followed by the number of games they won in each of the sets played, represented by the "set" array (which will contain up to 5 elements for men and up to 3 for women).

The product of the coursework should be a HTML page which a user can use to query information about the results of matches. In other words, the HTML page should allow the user to select which results they are interested in (i.e., to choose one of the two files mentioned above), and then provide an interface through which the user can query the data. The results should be displayed on the same page. You should use JavaScript, jQuery and HTML forms to implement your solution, which should work with both Firefox and Chrome.
 
You should download each of the above JSON files and store them in the same directory (folder) as your HTML file. You should use the same names for them as above, and should reference them in your script using only those names (i.e., not using a full URI path). This will mean that your solution can be tested without needing to be modified.

The components of the task are as follows:

1. Create a web page consisting of an HTML form with various form fields for user input, as well as an area for outputting results. The results should appear in a table on the same page. The table should have columns for round, player, and the results for up to five sets. Each pair of rows in the table represents the result of one match, with the name of the winner appearing in bold. So for the first two results in the men's tournament, the table might look as follows:


| Round | Player       | Set 1     | Set 2     | Set 3     |   Set 4   | Set 5     | 
| :-----| :---------   | :---------| :---------| :---------| :---------| :---------|
| 1     | B.Becker     | 4         | 3         | 2         |           |           |
| 1     | **A.Murray** | 6         | 6         | 6         |           |           |
| 1     | J.Ward       | 7         | 4         | 6         | 6         |           |
| 1     | **Y-H.Lu**   | 6         | 6         | 7         | 7         |           |


2. The first result above shows that A.Murray beat B.Becker in round 1 by three sets to love, 6-4, 6-3 and 6-2. There should be a button on the page which when clicked results in the table being filled with appropriate rows. When reloading the HTML page, the form fields should be cleared (reset).

3. By means of a drop-down list, the user should be able to select which set of results (i.e., which file) they wish to query. If the querying button is clicked with no further restrictions being entered into the form by the user, then all the match results from the selected tournament should be returned in the table.

4. The user should be able to enter the name of a player, as well as one of the conditions 'equals', 'contains' or 'none'. If 'equals' is selected, only the results of matches in which the player with exactly the given name participated should be returned. For 'contains', the value entered needs only to match a substring of the player's name. For example, the user may not remember that Murray's first initial is 'A', so can search using the string "Murray". The match should be case-sensitive in each case (so avoiding the need to transform the strings). For 'none', no restriction is placed on the player name.

5. The user should be able to enter a value for the number of sets (e.g. 4) as well as one of the conditions 'equals', 'greater than' or 'less than'. So if the user enters 4 for the number of sets and 'greater than' for the condition, only the results of 5-set matches are returned.

6. The user should be able to enter a value for the round (e.g. 6) as well as one of the conditions 'equals', 'greater than' or 'less than'. So if the user enters 6 for the round and 'equals' for the condition, only the results of the two semi-final (i.e., round 6) matches are returned.

For each of (3), (4) and (5), you might use a combination of a drop-down list for the user to select the condition and a text box for them to enter a value.

The user should be able to make selections from any combination of items (2) to (5) above, so, for example, to ask for all matches played by A.Murray lasting more than 3 sets in the men's tournament.
