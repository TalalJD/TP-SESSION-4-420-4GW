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
    // Requete AJAX prise de : https://www.api-ninjas.com/api/exercises
});
function displayResults(exercises) {
    console.log("Displaying results");
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results
    if (exercises.length > 0) {
        exercises.forEach(function(exercise) {
            var exerciceDiv = document.createElement('div');
            exerciceDiv.style= "display: flex; flex-direction: row; margin-left: 10px;"
            var p = document.createElement('p');
            p.textContent = exercise.name + " - " + exercise.difficulty;
            p.style = "width: 300px";
            exerciceDiv.append(p);

            var selectExerciseButton = document.createElement('button');
            selectExerciseButton.innerText = "Selectionner";
            selectExerciseButton.onclick = function() {
                appendExerciseToDOM(exercise);
            };            
            exerciceDiv.append(selectExerciseButton);
            resultDiv.appendChild(exerciceDiv);
        });
    } else {
        resultDiv.textContent = "Aucun exercice n'a été trouvé pour cette requete.";
    }
}

function ChooseExercise(exercice){

}

async function appendExerciseToDOM(exercise){
    const body = document.body;
    const searchBody = document.createElement('div');
    searchBody.className = 'searchBody';
    searchBody.style.marginTop = '30px';

    const searchFactors = document.createElement('div');
    searchFactors.className = 'searchFactors';

    // Name section
    const nameFactor = document.createElement('div');
    nameFactor.className = 'searchFactor';
    const nameTitle = document.createElement('p');
    nameTitle.textContent = 'Name: ';
    const nameValue = document.createElement('p');
    nameValue.textContent = exercise.name;
    nameFactor.appendChild(nameTitle);
    nameFactor.appendChild(nameValue);

    // Muscle section
    const muscleFactor = document.createElement('div');
    muscleFactor.className = 'searchFactor';
    const muscleTitle = document.createElement('p');
    muscleTitle.textContent = 'Muscle: ';
    const muscleValue = document.createElement('p');
    muscleValue.textContent = exercise.muscle;
    muscleFactor.appendChild(muscleTitle);
    muscleFactor.appendChild(muscleValue);

    // Equipment section
    const equipFactor = document.createElement('div');
    equipFactor.className = 'searchFactor';
    const equipTitle = document.createElement('p');
    const equipValue = document.createElement('p');
    equipTitle.textContent = "Équipement : "
    equipValue.textContent = exercise.equipment;
    equipFactor.appendChild(equipTitle);
    equipFactor.appendChild(equipValue);

    // Append to main container
    searchFactors.appendChild(nameFactor);
    searchFactors.appendChild(muscleFactor);
    searchFactors.appendChild(equipFactor);
    searchBody.appendChild(searchFactors);
    body.appendChild(searchBody);
    var preHash = exercise.name+'-'+exercise.type+'-'+exercise.equipment;
    var hashed = await hashSHA1(preHash);
    console.log("Pre-hash: "+preHash);
    console.log("Hashed : "+hashed);
    sendDataToServer(exercise);
}

function sendDataToServer(exercise){
    fetch('choisirExercise', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercise)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

async function hashSHA1(inputString){
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    const hashBuffer = await crypto.subtle.digest('SHA-1', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex; // This will be a 40-character hexadecimal string
}