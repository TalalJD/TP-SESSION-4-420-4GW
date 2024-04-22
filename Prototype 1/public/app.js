document.addEventListener("DOMContentLoaded", function() {
    var profileIcon = document.getElementById("profileIcon");
    var plusIcon = document.getElementById("plusIcon");
    var nouvelleCard = document.getElementById("nouvelleCard");
    var profilePage = document.querySelector(".profile-page");
    var exerciceCard = document.querySelector(".exercice-card");
    var exercicetemplates = document.querySelector(".exercice-templates");

    profileIcon.addEventListener("click", function() {
        toggleVisibility(profilePage);
    });

    plusIcon.addEventListener("click", function() {
        toggleVisibility(exerciceCard);
    });

    nouvelleCard.addEventListener("click", function() {
        toggleVisibility(exerciceCard);
        toggleVisibility(exercicetemplates);
    });

    function toggleVisibility(element) {
        var isHidden = element.classList.contains("hidden");

        if (isHidden) {
            element.classList.remove("hidden");
            element.classList.add("show");
            document.body.style.overflow = "hidden";
        } else {
            element.classList.remove("show");
            element.classList.add("hidden");
            document.body.style.overflow = "auto";
        }
    }
});
