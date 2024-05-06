const apiKey = '9k+sevfwAe2cmbuSjd9P6Q==YiRRhw4XpFLzq6TU';
var profileIcon = document.getElementById("profileIcon");
var plusIcon = document.getElementById("plusIcon");
var profilePage = document.querySelector(".profile-page");
var exerciceCard = document.querySelector(".exercice-card");
var nouvelEntrainement = document.getElementById("NouvelEntrainement");
var choisirEntrainement = document.querySelector(".Choisir-Entrainement");
var returnButton = document.querySelector('.return-button');
var AfficherSelectExo = document.getElementById('AfficherSelectExo');
var ChercherExercice = document.querySelector(".Chercher-Exercice");
var searchButtonMuscle = document.getElementById('searchButtonMuscle'); // Add ID to your button
var searchButtonName = document.getElementById('searchButtonName');
var allCurrentExercises = document.getElementById("allExercicesInTemplate");
function hideAllExcept(element) {
    if (element === profileIcon) {
        profilePage.classList.add("show");
        profilePage.classList.remove("hidden");
        exerciceCard.classList.remove("show");
        exerciceCard.classList.add("hidden");
        choisirEntrainement.classList.remove("show");
        choisirEntrainement.classList.add("hidden");
        ChercherExercice.classList.remove("show");
        ChercherExercice.classList.add("hidden");
    } else if (element === plusIcon) {
        exerciceCard.classList.add("show");
        exerciceCard.classList.remove("hidden");
        profilePage.classList.remove("show");
        profilePage.classList.add("hidden");
        choisirEntrainement.classList.remove("show");
        choisirEntrainement.classList.add("hidden");
        ChercherExercice.classList.remove("show");
        ChercherExercice.classList.add("hidden");
    } else if (element === nouvelEntrainement) {
        choisirEntrainement.classList.add("show");
        choisirEntrainement.classList.remove("hidden");
        exerciceCard.classList.remove("show");
        exerciceCard.classList.add("hidden");
        profilePage.classList.remove("show");
        profilePage.classList.add("hidden");
        ChercherExercice.classList.remove("show");
        ChercherExercice.classList.add("hidden");
    }
    document.body.style.overflow = "hidden";
}
document.addEventListener("DOMContentLoaded", function() {
    profileIcon.addEventListener("click", function() {
        if (!profilePage.classList.contains("show")) {
            hideAllExcept(profileIcon);
        } else {
            profilePage.classList.remove("show");
            profilePage.classList.add("hidden");
            document.body.style.overflow = "auto";
        }
    });

    plusIcon.addEventListener("click", function() {
        if (!exerciceCard.classList.contains("show")) {
            hideAllExcept(plusIcon);
            console.log("Opened PlusIcon1");
        } else {
            exerciceCard.classList.remove("show");
            exerciceCard.classList.add("hidden");
            document.body.style.overflow = "auto";
            console.log("Opened PlusIcon2");
        }
    });

    exerciceCard.addEventListener("click", function() {
        if (!choisirEntrainement.classList.contains("show")) {
            createWorkoutInServer(null);
            hideAllExcept(nouvelEntrainement);
            console.log("ExerciceCard1");
        } else {
            choisirEntrainement.classList.remove("show");
            choisirEntrainement.classList.add("hidden");
            document.body.style.overflow = "auto";
            console.log("ExerciceCard2");
        }
    });
    
    returnButton.addEventListener("click", function(){
        returnFromWorkoutCreation(null);
        choisirEntrainement.classList.remove('show');
        choisirEntrainement.classList.add('hidden');
        exerciceCard.classList.add("show");
    });

    AfficherSelectExo.addEventListener("click", function(){
        choisirEntrainement.classList.remove('show');
        choisirEntrainement.classList.add('hidden');
        ChercherExercice.classList.remove("hidden");
        ChercherExercice.classList.add("show");
    });
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



function createWorkoutInServer(workoutData){
    clearExercises();
    const body = JSON.stringify(workoutData || {});
    fetch('createEmptyWorkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}
function returnFromWorkoutCreation(workoutData){
    const body = JSON.stringify(workoutData || {});
    fetch('deleteEmptyWorkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => console.error('Error:', error));
}


// PAGE RECHERCHE

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

function ChooseExercise(exercise){
    fetch('addExerciceNewWorkout', {
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

async function appendExerciseToDOM(exercise){
    await sendDataToServer(exercise);
    fetch('getExoExecs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercise)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success, found number of exercices: :', data);
        updateExerciseList(data);
        hideAllExcept(nouvelEntrainement);
    })
    .catch((error) => console.error('Error:', error));
}

function updateExerciseList(exercises){
    clearExercises();

    exercises.forEach(exercise => {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-entry';
        exerciseDiv.textContent = `Exercice: ${exercise.nom_exo || 'Unknown'}, Description: ${exercise.desc_exo || 'Unknown'}`;
        exerciseDiv.style="color:white;";
        allCurrentExercises.appendChild(exerciseDiv);
    });
}
function clearExercises(){
    console.log("Clearing exercise div...");
    allCurrentExercises.innerHTML = '';
}

async function sendDataToServer(exercise){
    return fetch('choisirExercise', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercise)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        return data; 
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}

async function hashSHA1(inputString){
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    const hashBuffer = await crypto.subtle.digest('SHA-1', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex; // This will be a 40-character hexadecimal string
}