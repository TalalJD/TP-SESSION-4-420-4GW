// le script pour faire la connexion d'un compte energymize
// Ce code est inspiré d'un code de Chatgpt
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Récupérer l'adresse email saisie 
    let adresse_mail = document.getElementById('adresse_mail').value;
    // Récupérer le mot de passe saisi
    let mdp = document.getElementById('mdp').value;
  
    // Utilise l'API Fetch pour envoyer une requête POST au serveur avec l'adresse e-mail et le mot de passe de l'utilisateur.
    fetch('/connexion/submit', {
      method: 'POST',
      headers: {
        // Indique au serveur que les données envoyées sont au format JSON
        'Content-Type': 'application/json', 
      },
      // Convertit les données du formulaire en chaîne JSON.
      body: JSON.stringify({ adresse_mail: adresse_mail, mdp: mdp }) 
    })
    // Traite la réponse et la convertit en JSON.
    .then(response => response.json()) 
    .then(data => {
      if (data.success) {
        // Si la connexion est réussie, redirige l'utilisateur vers la page d'accueil.
        window.location.href = '/'; 
      } else {
        let alerteErreur = document.getElementById('alerteErreur');
        alerteErreur.style.display = 'block';
        // Affiche le message d'erreur envoyé par le serveur.
        alerteErreur.textContent = data.message; 
      }
    })
    .catch((error) => {
        // Affiche l'erreur dans la console si la requête échoue.
      console.error('Error:', error); 
    });
  });


  function togglePasswordVisibility() {
    var passwordInput = document.getElementById("mdp");
    var eyeIcon = document.getElementById("eye-icon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("bi-eye-slash");
        eyeIcon.classList.add("bi-eye");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("bi-eye");
        eyeIcon.classList.add("bi-eye-slash");
    }
}

function loginCallback(response){
  console.log(response.credential); // Vérifiez que c'est bien un JWT
}