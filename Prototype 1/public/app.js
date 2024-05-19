const apiKey = '9k+sevfwAe2cmbuSjd9P6Q==YiRRhw4XpFLzq6TU';
var profileIcon = document.getElementById("profileIcon");
var plusIcon = document.getElementById("plusIcon");
var calendarIcon = document.getElementById("calendarIcon");
var profilePage = document.querySelector(".profile-page");
var exerciceCard = document.querySelector(".exercice-card");
var nouvelEntrainement = document.getElementById("NouvelEntrainement");
var choisirEntrainement = document.querySelector(".Choisir-Entrainement");
var returnButton = document.getElementById('returnButton');
var confirmWorkoutButton = document.getElementById('confirmWorkoutCreationButton');
var AfficherSelectExo = document.getElementById('AfficherSelectExo');
var ChercherExercice = document.querySelector(".Chercher-Exercice");
var searchButtonMuscle = document.getElementById('searchButtonMuscle'); // Add ID to your button
var searchButtonName = document.getElementById('searchButtonName');
var allCurrentExercises = document.getElementById("allExercicesInTemplate");
var affichage = document.querySelector('.affichage');
var historique = document.querySelector('.Historique-Calendrier');


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
        affichage.classList.remove("show");
        affichage.classList.add("hidden");
        historique.classList.remove("show");
        historique.classList.add("hidden");
    } else if (element === plusIcon) {
        exerciceCard.classList.add("show");
        exerciceCard.classList.remove("hidden");
        profilePage.classList.remove("show");
        profilePage.classList.add("hidden");
        choisirEntrainement.classList.remove("show");
        choisirEntrainement.classList.add("hidden");
        ChercherExercice.classList.remove("show");
        ChercherExercice.classList.add("hidden");
        affichage.classList.remove("show");
        affichage.classList.add("hidden");
        historique.classList.remove("show");
        historique.classList.add("hidden");
    } else if (element === calendarIcon) {
        historique.classList.add("show");
        historique.classList.remove("hidden");
        profilePage.classList.remove("show");
        profilePage.classList.add("hidden");
        exerciceCard.classList.remove("show");
        exerciceCard.classList.add("hidden");
        choisirEntrainement.classList.remove("show");
        choisirEntrainement.classList.add("hidden");
        ChercherExercice.classList.remove("show");
        ChercherExercice.classList.add("hidden");
        affichage.classList.remove("show");
        affichage.classList.add("hidden");
    }
    document.body.style.overflow = "hidden";
}


document.addEventListener("DOMContentLoaded", function() {
    calendarIcon.addEventListener("click", function() {
        if (!historique.classList.contains("show")) {
            hideAllExcept(calendarIcon);
            //historique.style.left = "-10px";
        } else {
            historique.classList.remove("show");
            historique.classList.add("hidden");
            document.body.style.overflow = "auto";
            //historique.style.left = "-100%";
        }
    });
});


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
            affichage.classList.remove("hidden");
            affichage.classList.add("show");
            console.log("Opened PlusIcon1");
        } else {
            exerciceCard.classList.remove("show");
            exerciceCard.classList.add("hidden");
            affichage.classList.remove("show");
            affichage.classList.add("hidden");
            document.body.style.overflow = "auto";
            console.log("closed PlusIcon2");
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
        affichage.classList.remove("hidden");
        affichage.classList.add("show");
        exerciceCard.classList.add("show");
    });

    confirmWorkoutButton.addEventListener("click", function(){
        confirmWorkoutCreation();
        choisirEntrainement.classList.remove('show');
        choisirEntrainement.classList.add('hidden');
        affichage.classList.remove("hidden");
        affichage.classList.add("show");
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
function confirmWorkoutCreation(){
    const workoutTitle = document.getElementById("titleWorkout").value;
    const workoutDescription = document.getElementById("descWorkout").value;
    const requestBody = {
        title: workoutTitle,
        description: workoutDescription
    };
    fetch('confirmWorkoutTemplate',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(requestBody)
    }).then(response => response.json())
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

document.addEventListener('DOMContentLoaded', function() {
    var exercises = document.querySelectorAll('.exercise');
    exercises.forEach(function(exercise) {
        var descriptionPanel = exercise.querySelector('.description-panel');
        descriptionPanel.style.display = 'none'; // Hide description panel initially
        exercise.addEventListener('click', function() {
            if (descriptionPanel.style.display === 'none') {
                descriptionPanel.style.display = 'block';
            } else {
                descriptionPanel.style.display = 'none';
            }
        });
    });
});






function Afficher_Dates_WorkoutsCompleted() {
    // Fait une requête pour obtenir les dates d'entraînement
    function fetchWorkoutDates() {     
        return fetch('/workout-dates')
            .then(response => response.json())
            .then(data => data.workoutDates)
            .catch(error => {
                console.error('Error fetching workout dates:', error);
                return [];
            });
    }

    // Fonction pour générer le contenue du calendrier en fonction de la date
    function generateCalendar(year, month, workoutDates) {
        const calendarBody = document.querySelector('#calendar tbody');
        calendarBody.innerHTML = '';

        // Noms des mois en français
        const moisEnFrancais = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < firstDay) {
                    cell.textContent = '';
                } else if (date > daysInMonth) {
                    break;
                } else {
                    cell.textContent = date;
                    const currentDate = new Date(year, month, date).toISOString().split('T')[0];
                    if (workoutDates.includes(currentDate)) {
                        cell.classList.add('workout-day');
                    }
                    if (currentDate === new Date().toISOString().split('T')[0]) {
                        cell.classList.add('current-day');
                    }
                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }

        //Force le nom du mois en francais
        document.getElementById('currentMonth').textContent = moisEnFrancais[month] + ' ' + year;

    }

    // Initialise le calendrier avec les données actuelles
    function initCalendar() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        fetchWorkoutDates().then(workoutDates => {
            generateCalendar(year, month, workoutDates);
        });

        // Add event listeners to navigation buttons
        document.querySelector('.prevMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            const newYear = currentDate.getFullYear();
            const newMonth = currentDate.getMonth();
            fetchWorkoutDates().then(workoutDates => {
                generateCalendar(newYear, newMonth, workoutDates);
            });
        });

        document.querySelector('.nextMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            const newYear = currentDate.getFullYear();
            const newMonth = currentDate.getMonth();
            fetchWorkoutDates().then(workoutDates => {
                generateCalendar(newYear, newMonth, workoutDates);
            });
        });
        
    }

    initCalendar();
}


document.addEventListener('DOMContentLoaded', Afficher_Dates_WorkoutsCompleted);




