document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("profileIcon").addEventListener("click", function() {
        var profilePage = document.querySelector(".profile-page");
        profilePage.classList.toggle("hidden");
        profilePage.classList.toggle("show");
        document.body.style.overflow = profilePage.classList.contains("show") ? "hidden" : "auto";

    });
});
