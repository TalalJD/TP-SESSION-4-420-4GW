document.addEventListener('DOMContentLoaded', function() {
    const plusIcon = document.querySelector('[name="plusIcon"]');
    const cardContainer = document.querySelector('.card-container');

    plusIcon.addEventListener('click', function() {
        cardContainer.style.display = 'block'; // Affiche les cartes
        cardContainer.style.transform = 'translateY(0)'; // Animation pour afficher les cartes
    });
});
