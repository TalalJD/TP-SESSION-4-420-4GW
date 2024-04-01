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

  function loginCallback(response) {
    const decodedToken = jwt_decode(response.credential);
    console.log(decodedToken);
  
    // Envoyer les informations de l'utilisateur au serveur
    fetch('/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courriel_client: decodedToken.email,
        prenom_client: decodedToken.given_name,
        nom_client: decodedToken.family_name,
        mdp_client: decodedToken.given_name
        // Vous pouvez également envoyer le mot de passe si nécessaire, mais généralement, avec l'authentification Google, vous n'en aurez pas besoin
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Si la connexion/inscription est réussie, redirigez l'utilisateur
        window.location.href = '/';
      } else {
        // Gérez l'erreur si nécessaire
        console.error('Erreur lors de la connexion/inscription:', data.message);
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
  }
  
