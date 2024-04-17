const apiKey = '9k+sevfwAe2cmbuSjd9P6Q==YiRRhw4XpFLzq6TU'
document.addEventListener("DOMContentLoaded", function() {
    var searchButtonMuscle = document.getElementById('searchButtonMuscle'); // Add ID to your button
    var searchButtonName = document.getElementById('searchButtonName');
    searchButtonMuscle.addEventListener('click', function() {
        console.log("Search called");
        var muscle = document.getElementById('muscleInput').value;
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle,
            headers: { 'X-Api-Key': '9k+sevfwAe2cmbuSjd9P6Q==YiRRhw4XpFLzq6TU' },
            contentType: 'application/json',
            success: function (result) {
                displayResults(result);
            },
            error: function (jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });
    searchButtonName.addEventListener('click', function(){
        var name = document.getElementById('nameInput').value;
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/exercises?name=' + name,
            headers: { 'X-Api-Key': apiKey},
            contentType: 'application/json',
            success: function (result) {
                displayResults(result);
            },
            error: function (jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });
});
function displayResults(exercises) {
    console.log("Displaying results");
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results
    if (exercises.length > 0) {
        exercises.forEach(function(exercise) {
            var p = document.createElement('p');
            p.textContent = exercise.name + " - " + exercise.difficulty;
            resultDiv.appendChild(p);
        });
    } else {
        resultDiv.textContent = "Aucun exercice n'a été trouvé pour ce groupe musculaire.";
    }
}