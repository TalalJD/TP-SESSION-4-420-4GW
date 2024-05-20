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
var searchButtonMuscle = document.getElementById('searchButtonMuscle'); 
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
    } else if (element === nouvelEntrainement){
        choisirEntrainement.classList.add("show");
        choisirEntrainement.classList.remove("hidden");
        ChercherExercice.classList.remove("show");
        ChercherExercice.classList.add("hidden");
        exerciceCard.classList.remove("show");
        exerciceCard.classList.add("hidden");
        affichage.classList.remove("show");
        affichage.classList.add("hidden");
        historique.classList.remove("show");
        historique.classList.add("hidden");
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
    var cards = document.querySelectorAll('.carde');
    cards.forEach(function (card){
        var workout = JSON.parse(card.getAttribute('data-workout'));
        var workoutForm = document.getElementById('workoutForm');
        var workoutInput = document.getElementById('workoutInput');
        card.addEventListener('click',function(){
            workoutInput.value = JSON.stringify(workout);
            console.log("Nom workout: ",workout.nom_workout);
            console.log("Nom workout, non input: ",workoutInput);
            console.log("Parsed workout name from input: ", JSON.parse(workoutInput.value).nom_workout); 
            workoutForm.submit();
        });
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




//AFFICHER LE CALENDRIER QUI CONTIEN L'HISTORIQUE DES WORKOUTS

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

//LANCER LA FUNCTION
document.addEventListener('DOMContentLoaded', Afficher_Dates_WorkoutsCompleted);


var workoutData = document.getElementById('workoutData').textContent;
  var workout = JSON.parse(workoutData);
  let listeSerie = [];
  let selectedExoExec;
  var elapsedTime;
  class Serie {
    constructor(reps, rpe, exo_exec_id_exo_exec, poids){
      this.reps = reps;
      this.rpe = rpe;
      this.exo_exec_id_exo_exec = exo_exec_id_exo_exec;
      this.poids = poids;
    }
    describe() {
    return `Exo Exec ID: ${this.exo_exec_id_exo_exec}; REPS: ${this.reps}; RPE: ${this.rpe}; Poids: ${this.poids}`;
  }
  }
    document.addEventListener('DOMContentLoaded', function() {
    var exercises = document.querySelectorAll('.exercise');
    exercises.forEach(function(exercise) {
      exercise.addEventListener('click', function() {
        var titre = document.getElementById('titreExoSelectionne');
        var titreInput = exercise.querySelector('.nom_exo');
        titre.innerHTML=titreInput.innerHTML;
        selectedExoExec = exercise;
        MarkExerciseAsSelected(exercise);
        boutonAjoutSerie.classList.remove('unclickable');
        boutonAjoutSerie.innerHTML='Nouvelle serie';
        var exoExecInput = exercise.querySelector('input[name="exo_exec_id"]');
            if (exoExecInput) {
                selectedExoExec = exoExecInput.value;
                console.log(selectedExoExec);
            }
        MettreAJourListeSerie();
      });
    });
    var boutonAjoutSerie = document.getElementById('ajouterSerieBouton');
    boutonAjoutSerie.classList.add('unclickable');
    boutonAjoutSerie.addEventListener('click',function(){
      MontrerCreationSerie();
    });
    var boutonConfirmerSerie = document.getElementById('confirmerSerie');
    boutonConfirmerSerie.addEventListener('click',function(){
      CreerSerie();
    });
    var boutonTerminer = document.getElementById('terminerEntrainementButton');
    boutonTerminer.onclick=FinaliserWorkout;
  });
  function MarkExerciseAsSelected(selectedExercise){
    var exercises = document.querySelectorAll('.exercise');
    exercises.forEach(function(exercise){
      exercise.style.borderLeft = '5px solid #D5C069';
      if (exercise==selectedExercise){
        exercise.style.borderLeft = '5px solid #f1492b';
      }
    });
  }
 
  function MontrerCreationSerie(){
    var creationSerieDiv = document.getElementById('creationSerie');
    if (creationSerieDiv.style.display=='flex'){
      creationSerieDiv.style.display='none';
    } else {
      creationSerieDiv.style.display='flex';
    }
  }

  function CreerSerie(){
    var repetitions = document.getElementById('repetitionsInput');
    var rpe = document.getElementById('RPEInput');
    var poids = document.getElementById('PoidInput');
    serie = new Serie(repetitions.value,rpe.value,selectedExoExec, poids.value);
    rpe.value=5;
    repetitions.value=5;
    poids.value=2.5;
    listeSerie.push(serie);
    console.log(serie.describe());
    MontrerCreationSerie();
    MettreAJourListeSerie();
  }
  function MettreAJourListeSerie(){
    let serieAffichageDiv = document.getElementById('serieGroupe');
    serieAffichageDiv.innerHTML='';
    serieNombre=0;
    for (let serie of listeSerie){
      if (serie.exo_exec_id_exo_exec==selectedExoExec){
        serieNombre++;
        AddSerieToDiv(serie,serieAffichageDiv,serieNombre);
      }
    }
  }
  function AddSerieToDiv(serie,div, nombreSerie){
    let serieDiv = document.createElement('div');
    serieDiv.classList.add('seriesAffichage');
    let deleteButton = document.createElement('button');
    let titleDiv = document.createElement('h4');
    let repsDiv = document.createElement('h5');
    let rpeDiv = document.createElement('h5');
    let poidsDiv = document.createElement('h5');
    titleDiv.innerHTML = 'Serie '+nombreSerie+':    ';
    poidsDiv.innerHTML = serie.poids + 'lbs';
    repsDiv.innerHTML = serie.reps + ' Reps';
    rpeDiv.innerHTML = serie.rpe + ' RPE';
    serieDiv.appendChild(titleDiv);
    serieDiv.appendChild(poidsDiv);
    serieDiv.appendChild(repsDiv);
    serieDiv.appendChild(rpeDiv);
    deleteButton.textContent='X';
    deleteButton.style.backgroundColor='red';
    deleteButton.onclick = function() {
      DeleteSerie(serie);
    };
    serieDiv.append(deleteButton);
    div.appendChild(serieDiv);
  }
  function DeleteSerie(serie){
    const indexSerie = listeSerie.indexOf(serie);
    listeSerie.splice(indexSerie,1);
    MettreAJourListeSerie();
  }
  function FinaliserWorkout(){
    return fetch('createNewWorkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listeSerie })
    })
    .then(response => {
        if (response.redirected) {
            console.log('Redirected to:', response.url);
            window.location.href = response.url;
        } else if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error;
    });
}

  document.addEventListener('DOMContentLoaded', function() {
    var startTime = Date.now();
    var timerElement = document.querySelector('.timer');

    function updateTimer() {
        elapsedTime = Date.now() - startTime;
        var seconds = Math.floor((elapsedTime / 1000) % 60);
        var minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        var hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

        timerElement.textContent = 
            (hours < 10 ? "0" + hours : hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds);
    }

    setInterval(updateTimer, 1000); // Update the timer every second
});

