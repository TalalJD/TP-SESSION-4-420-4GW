/*
Importation des modules requis
*/


import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";
import { body, validationResult } from "express-validator";
import dateFormat from "dateformat";
import bodyParser from "body-parser";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
  secret: 'your_secret_key', // This secret key will be used to sign the session ID cookie.resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 86400000 } // For HTTPS use secure: true, maxAge sets the cookie to expire after 1 day
}));
/*
Connexion au serveur
*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));



const server = app.listen(4000, function () {
  console.log("serveur fonctionne sur 4000... ! ");
});
app.use(express.static("public"));


app.get("/", function (req, res) {
  // Check if the user is logged in
  let user = null; // Default to null if not logged in
  if (req.session.isLoggedIn) {
    user = req.session.user; // Set to the logged-in user's session data if they are logged in
  }
 
  // Render the page with the necessary data
  res.render("Pages/index", {
    siteTitle: "Simple Application",
    pageTitle: "Event List",
    items: [], // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
    user: user // Pass the user object for conditional display in the template
  });
});
app.get("/Inscription", function (req, res) {
  let user = null;
  if (req.session.isLoggedIn) {
    user = req.session.user;
  }
  // No database query, just render the page
  res.render("Pages/inscription", {
    siteTitle: "Simple Application",
    pageTitle: "Event List",
    items: [], 
    user: user
  });
});


app.get("/Connexion", function (req, res) {
  let user = null;
  if (req.session.isLoggedIn) {
    user = req.session.user;
  }
  // No database query, just render the page

  res.render("Pages/connexion", {

    siteTitle: "Simple Application",

    pageTitle: "Event List",

    items: [], // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
    user:user
  });

});



app.get("/Abonnement", function (req, res) {

  // No database query, just render the page
  let user = null;
  if (req.session.isLoggedIn) {
    user = req.session.user;
  }

  res.render("Pages/abonnement", {

    siteTitle: "Simple Application",

    pageTitle: "Event List",

    items: [], // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
    user:user
  });

});



const con = mysql.createConnection({

  host: "localhost",

  user: "scott",

  password: "oracle",

  database: "energymizeBD",

  port: 3307

});

con.connect(function (err) {

  if (err) throw err;

  console.log("connected!");

});

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/inscription/submit", function (req, res) {
  // verifie si toutes les cases sont remplies avant de continuer
  if (!req.body.nom_client || !req.body.prenom_client || !req.body.courriel_client || !req.body.mdp_client) {
    return res.status(400).send("Veuillez remplire toutes les cases");
  }

  // Verifie si l'email existe deja dans la BD
  const emailCheckQuery = "SELECT * FROM client WHERE courriel_client = ?";
  con.query(emailCheckQuery, [req.body.courriel_client], function (emailCheckErr, emailCheckResult) {
    if (emailCheckErr) throw emailCheckErr;

    if (emailCheckResult.length > 0) {
      // l'email existe deja dans la bd
      return res.status(400).send("Ce courriel est deja inscrit veuillez ressayer");
    }

  
    const insertionQuery = "INSERT INTO client (nom_client, prenom_client, courriel_client, mdp_client, gen_restants) VALUES (?, ?, ?, ?, ?)";
    const parameters = [req.body.nom_client, req.body.prenom_client, req.body.courriel_client, req.body.mdp_client, 3];

    con.query(insertionQuery, parameters, function (err, result) {
      if (err) throw err;
      res.redirect("/Connexion");
    });
  });
});

app.get("/indexSport", function(req,res){
  let user = null;
  if (req.session.isLoggedIn) {
    user = req.session.user;
  }
  const id_sport=req.query.id_sport;
  const image=req.query.image;
  const name=req.query.name;
  const request =
    "SELECT * FROM poste WHERE sport_id_sport=?";
  con.query(request,[id_sport], function(err, result){
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error"); 
      return;
    }
    res.render("Pages/indexSport.ejs", {
      siteTitle: "Simple Application",
      pageTitle: "Event List",
      items: result,
      image: image,
      name: name,
      user:user
    });
  });
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.post('/connexion/submit', (req, res) => {
  const user_email_address = req.body.adresse_mail;
  const mdp = req.body.mdp;
  if (user_email_address && mdp) {
    const requete = "SELECT * FROM client WHERE courriel_client = ?";
    con.query(requete, [user_email_address], function (error, data) {
      if (data.length > 0) {
        if (data[0].mdp_client == mdp) { // Assuming email is unique and only one record should match  
                  req.session.isLoggedIn = true; // Set a flag in the session to indicate logged in status        
                    req.session.user = data[0]; // Save user info in session        
                    res.redirect("/");
        } else {
          res.send('Incorrect Password');
        }
      } else {
        res.send('Incorrect Email Address');
      }
    });
  } else {
    res.send('Please Enter Email Address and Password Details');
  }
});




app.get('/some-protected-route', function (req, res) {
  if (req.session.isLoggedIn) {
    // Proceed with the protected route logic  
  } else {
    // Redirect to login page or send an error message    
    res.redirect('/login');
  }
});

app.get('/logout', function (req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      res.send("Error logging out");
    } else {
      res.redirect('/connexion'); // Assuming you have a login page at this route
    }
  });
});

app.post('/abonnement/choisir', function(req, res) {
  const idAbonnement = req.body.id_abonnement; 
  const userId = req.session.user.id_client; 
  let generationsRestantes = 0;
  switch (idAbonnement) {
    case '1': 
      generationsRestantes = 3;
      break;
    case '2': 
      generationsRestantes = 10;
      break;
    case '3': 
      generationsRestantes = -1; 
      break;
    default:
      generationsRestantes = 0;
  }
  const updateQuery = 'UPDATE client SET abonnement_id_abonnement = ?, gen_restants = ? WHERE id_client = ?';
  con.query(updateQuery, [idAbonnement, generationsRestantes, userId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la mise à jour de l\'abonnement');
    } else {
      // Effectuer une nouvelle requête pour récupérer les données mises à jour de l'utilisateur
      const userQuery = 'SELECT * FROM client WHERE id_client = ?';
      con.query(userQuery, [userId], function(userErr, userResult) {
        if (userErr) {
          console.error(userErr);
          res.status(500).send('Erreur lors de la récupération des données de l\'utilisateur');
        } else {
          // Mettre à jour les données de session de l'utilisateur
          req.session.user = userResult[0];
          // Rediriger vers la page d'accueil ou la page d'abonnement mise à jour
          res.redirect('/');
        }
      });
    }
  });
});
