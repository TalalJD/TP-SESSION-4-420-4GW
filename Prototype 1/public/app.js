document.addEventListener("DOMContentLoaded", function() {
    var profileIcon = document.getElementById("profileIcon");
    var plusIcon = document.getElementById("plusIcon");
    var profilePage = document.querySelector(".profile-page");
    var exerciceCard = document.querySelector(".exercice-card");
    var nouvelEntrainement = document.getElementById("NouvelEntrainement");
    var choisirEntrainement = document.querySelector(".Choisir-Entrainement");
    var returnButton = document.querySelector('.return-button');

    function hideAllExcept(element) {
        if (element === profileIcon) {
            profilePage.classList.add("show");
            profilePage.classList.remove("hidden");
            exerciceCard.classList.remove("show");
            exerciceCard.classList.add("hidden");
            choisirEntrainement.classList.remove("show");
            choisirEntrainement.classList.add("hidden");
        } else if (element === plusIcon) {
            exerciceCard.classList.add("show");
            exerciceCard.classList.remove("hidden");
            profilePage.classList.remove("show");
            profilePage.classList.add("hidden");
            choisirEntrainement.classList.remove("show");
            choisirEntrainement.classList.add("hidden");
        } else if (element === nouvelEntrainement) {
            choisirEntrainement.classList.add("show");
            choisirEntrainement.classList.remove("hidden");
            exerciceCard.classList.remove("show");
            exerciceCard.classList.add("hidden");
            profilePage.classList.remove("show");
            profilePage.classList.add("hidden");
        }
        document.body.style.overflow = "hidden";
    }

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
