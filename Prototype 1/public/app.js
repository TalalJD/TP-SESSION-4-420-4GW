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
        } else {
            exerciceCard.classList.remove("show");
            exerciceCard.classList.add("hidden");
            document.body.style.overflow = "auto";
        }
    });

    exerciceCard.addEventListener("click", function() {
        if (!choisirEntrainement.classList.contains("show")) {
            createWorkoutInServer(null);
            hideAllExcept(nouvelEntrainement);
        } else {
            choisirEntrainement.classList.remove("show");
            choisirEntrainement.classList.add("hidden");
            document.body.style.overflow = "auto";
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
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}


// PAGE RECHERCHE

