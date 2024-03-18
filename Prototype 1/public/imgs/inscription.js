document.getElementById('SignInForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Récupérer l'adresse email saisie 
    let adresse_mail = document.getElementById('inputFormCourriel').value;
    // Récupérer le mot de passe saisi
    let mdp = document.getElementById('inputFormMdp').value;
    let nom = document.getElementById('inputFormNom').value;
    let prenom = document.getElementById('inputFormPrenom').value;

    // Utilise l'API Fetch pour envoyer une requête POST au serveur avec l'adresse e-mail et le mot de passe de l'utilisateur.
    fetch('/inscription/submit', {
      method: 'POST',
      headers: {
        // Indique au serveur que les données envoyées sont au format JSON
        'Content-Type': 'application/json', 
      },
      // Convertit les données du formulaire en chaîne JSON.
      body: JSON.stringify({nom: nom, prenom: prenom, adresse_mail: adresse_mail, mdp: mdp }) 
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