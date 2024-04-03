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
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uri = process.env.DB_URI;
app.use(session({
  secret: 'your_secret_key', 
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 86400000 } 
}));
/*
Connexion au serveur
*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

// MongoDB Trials

export async function connectToMongo() {
  let mongoClient;
  console.log("URI :D : "+uri);
  try {
      mongoClient = new MongoClient(uri);
      console.log("Connection à MongoDB...");
      await mongoClient.connect();
      console.log("Connecté à MongoDB!");
      return mongoClient;
  } catch (error) {
      console.error("Erreur de connexion à MongoDB!", error);4869
      process.exit();
  }
}

// Find function
export async function findStudentsByName(collection, findParam) {
  return collection.find({ findParam }).toArray();
}

// End of MongoDB Trials

const server = app.listen(4000, function () {
  console.log("serveur fonctionne sur 4000... ! ");
});
app.use(express.static("public"));


app.get("/", function (req, res) {
  
  let user = null; 
  if (req.session.isLoggedIn) {
    user = req.session.user; 
  }
 
  res.render("Pages/index", {
    siteTitle: "Simple Application",
    pageTitle: "Event List",
    items: [], 
    user: user 
  });
});
app.get("/Inscription", function (req, res) {
  let user = null;
  if (req.session.isLoggedIn) {
    user = req.session.user;
  }
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

  res.render("Pages/connexion", {

    siteTitle: "Simple Application",

    pageTitle: "Event List",

    items: [], 
    user:user
  });

});



app.get("/Abonnement", function (req, res) {

  let user = null;
  if (req.session.isLoggedIn) {
    user = req.session.user;
  }

  res.render("Pages/abonnement", {

    siteTitle: "Simple Application",

    pageTitle: "Event List",

    items: [], 
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


// inscription mongoDB

export async function InscrireUtilisateur(nom_client, prenom_client, courriel_client, mdp_client){
  let mongoClient;
  try {
    mongoClient = await connectToMongo();
    const db = mongoClient.db("EnergymizeBD");
    const collection = db.collection("clients");
    let emailCheck = await findStudentsByName(collection, courriel_client);
    if (emailCheck.length > 0){
      return 0;
    }
    const clientDocument = {
      nom : nom_client,
      prenom : prenom_client,
      courriel : courriel_client,
      mdp : mdp_client
    };
    await collection.insertOne(clientDocument);
    return 1;
  } finally {
    await mongoClient.close();
  }
}

app.post("/inscription/submit", async function (req, res) {
  if (!req.body.nom_client || !req.body.prenom_client || !req.body.courriel_client || !req.body.mdp_client) {
    return res.status(400).json({ error: "Veuillez remplir toutes les cases" });
  }
  let verifier = await InscrireUtilisateur(req.body.nom_client, req.body.prenom_client, req.body.courriel_client, req.body.mdp_client);
  if (verifier==0){
    return res.status(400).json({ error: "Ce courriel est déjà inscrit. Veuillez réessayer" });
  } else if (verifier==1){
    res.json({ success: true });
  }
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

// La route POST pour la soumission du formulaire de connexion
app.post('/connexion/submit', (req, res) => {
  // Extraire l'adresse mail et le mdp du body
  const user_email_address = req.body.adresse_mail;
  const mdp = req.body.mdp;
  // Verifier si ces derniers ne sont pas vides
  if (user_email_address && mdp) {
    // La requête sql pour vérifier si l'adresse mail existe dans la base de données
    const requete = "SELECT * FROM client WHERE courriel_client = ?";
    // Exécuter la requête
    con.query(requete, [user_email_address], function (error, data) {
      // Vérifier s'il existe un client avec cette adresse mail
      if (data.length > 0) {
        // Verifier si le mot de passe est correct
        if (data[0].mdp_client == mdp) { 
                  // si le mdp existe, on ouvre une session pour l'utilisateur
                  req.session.isLoggedIn = true;        
                    req.session.user = data[0];    
                    // Indiquer la connexion comme réussie
                    res.json({ success: true, message: 'Connexion réussie' });  
                    //res.end();
        } else {
          // Si le mdp est invalide on affiche un message d'erreur
          res.json({ success: false, message: 'Mot de passe incorrect' });
        }
      } else {
        // Si l'adresse mail est incorrecte on affiche un message d'erreur
        res.json({ success: false, message: 'Adresse e-mail incorrecte' });
      }
    });
  } else {
    // S'il entre rien on indique un message d'erreur
    res.json({ success: false, message: 'Veuillez entrer une adresse e-mail et un mot de passe' });
  }
});



app.get('/some-protected-route', function (req, res) {
  if (req.session.isLoggedIn) {
   
    res.redirect('/');  
  } else {
     
    res.redirect('/login');
  }
});

app.get('/logout', function (req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      res.send("Error logging out");
    } else {
      res.redirect('/connexion');
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
app.get('/profile', function(req, res) {
  let user = null;
  if (req.session.isLoggedIn) {
    user = req.session.user;
  
    const abonnQuery = "SELECT * FROM abonnement WHERE id_abonnement = ?";

    
    con.query(abonnQuery, [user.abonnement_id_abonnement], function(err, abonnementDetails) {
      if (err) {
       
        console.error('Database query error:', err);
        return res.status(500).send("Internal Server Error");
      }

      
      let abonnement = abonnementDetails[0];

      res.render("Pages/profile", {
        siteTitle: "Simple Application",
        pageTitle: "Event List",
        items: [], 
        user: user,
        abonnement: abonnement 
      });
    });
  } else {
    
    res.redirect('/login');
  }
});


app.post('/auth/google', (req, res) => {
  const { courriel_client, prenom_client, nom_client, mdp_client } = req.body;

  // Vérifiez si l'utilisateur existe dans la base de données
  const query = 'SELECT * FROM client WHERE courriel_client = ?';
  con.query(query, [courriel_client], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // L'utilisateur existe, connectez-le
      req.session.isLoggedIn = true;
      req.session.user = result[0];
      res.json({ success: true, message: 'Utilisateur connecté' });
    } else {
      // L'utilisateur n'existe pas, créez un nouvel utilisateur
      const insertQuery = 'INSERT INTO client (courriel_client, prenom_client, nom_client, mdp_client, gen_restants) VALUES (?, ?, ?, ?, ?)';
      con.query(insertQuery, [courriel_client, prenom_client, nom_client, mdp_client, 3], (err, result) => {
        if (err) throw err;

        // Connectez le nouvel utilisateur
        req.session.isLoggedIn = true;
        // Récupérez l'utilisateur nouvellement créé pour définir la session
        const newUserQuery = 'SELECT * FROM client WHERE courriel_client = ?';
        con.query(newUserQuery, [courriel_client], (err, newUserResult) => {
          if (err) throw err;
          req.session.user = newUserResult[0];
          res.json({ success: true, message: 'Nouvel utilisateur créé et connecté' });
        });
      });
    }
  });
});
