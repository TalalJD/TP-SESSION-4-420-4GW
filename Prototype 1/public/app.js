document.addEventListener("DOMContentLoaded", function() {
    var profileIcon = document.getElementById("profileIcon");
    var plusIcon = document.getElementById("plusIcon");
    var profilePage = document.querySelector(".profile-page");
    var exerciceCard = document.querySelector(".exercice-card");

    function hideAllExcept(element) {
        if (element === profileIcon) {
            profilePage.classList.add("show");
            profilePage.classList.remove("hidden");
            exerciceCard.classList.remove("show");
            exerciceCard.classList.add("hidden");
        } else if (element === plusIcon) {
            exerciceCard.classList.add("show");
            exerciceCard.classList.remove("hidden");
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
});
