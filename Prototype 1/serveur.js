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

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
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
export async function FindStudentsByEmail(collection, findParam) {
  return collection.find({ courriel: findParam }).toArray();
}

export async function FindAbonnement(collection, findParam){
  return collection.find({id_Abonnement : findParam}).toArray();
}
import { ObjectId } from 'mongodb';

export async function UpdateClientById(collection, clientId, updatedFields){
  await collection.updateMany({_id: new ObjectId(clientId)}, {$set: updatedFields});
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

app.get("/App", async function (req, res) {
  let user = null;
  let abonnement;
  if (req.session.isLoggedIn) {
    user = req.session.user;
    let mongoClient;
    try {
      mongoClient = await connectToMongo();
      const db = mongoClient.db("EnergymizeBD");
      const collection = db.collection("abonnement");
      abonnement = await FindAbonnement(collection,String(user.idAbonnement));
      console.log("Id abonnement: "+user.idAbonnement);
      console.log("Nom abonnement found: "+abonnement[0])
    } finally {
      mongoClient.close();
    }
    res.render("Pages/app", {

      siteTitle: "Simple Application",
  
      pageTitle: "Event List",
  
      items: [], 
      user:user,
      abonnement:abonnement[0]
    });
  } else {
    res.redirect('/login');
  }
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

app.get("/CreateTemplate", async function (req,res){
  let user = null;
  if (req.session.isLoggedIn) {
    user = req.session.user;
  }

  res.render("Pages/CreationTemplates", {

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
    console.log("courriel client: "+courriel_client);
    let emailCheck = await FindStudentsByEmail(collection, courriel_client);
    if (emailCheck.length>0){
      console.log("Matching email: "+emailCheck[0].courriel);
      return 0;
    }
    const clientDocument = {
      nom : nom_client,
      prenom : prenom_client,
      courriel : courriel_client,
      mdp : mdp_client,
      gens : 3,
      idAbonnement : 1
    };
    await collection.insertOne(clientDocument);
    return 1;
  } finally {
    await mongoClient.close();
  }
}
export async function ConnectionUtilisateur(courriel_client, mdp_client){
  let mongoClient;
  try {
    mongoClient = await connectToMongo();
    const db = mongoClient.db("EnergymizeBD");
    const collection = db.collection("clients");
    let emailCheck = await FindStudentsByEmail(collection, courriel_client);
    if (emailCheck.length<1){
      console.log("No users matching email: "+courriel_client);
      return 0;
    }
    if (emailCheck[0].mdp==mdp_client){
      return emailCheck[0];
    } else {
      console.log("Password written: "+mdp_client+" does not match actual password: "+emailCheck[0].mdp);
      return 1;
    }
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
    console.log("Refused; email not unique");
    return res.status(400).json({ error: "Ce courriel est déjà inscrit. Veuillez réessayer" });
  } else if (verifier==1){
    console.log("Added");
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



// La route POST pour la soumission du formulaire de connexion
app.post('/connexion/submit', async (req, res) => {
  // Extraire l'adresse mail et le mdp du body
  const user_email_address = req.body.adresse_mail;
  const mdp = req.body.mdp;
  // Verifier si ces derniers ne sont pas vides
  if (user_email_address && mdp) {
    let FoundUser = await ConnectionUtilisateur(user_email_address, mdp);
    if (FoundUser===0){
      res.json({ success: false, message: 'Adresse e-mail incorrecte' });
    } else if (FoundUser===1){
      res.json({ success: false, message: 'Mot de passe incorrect' });
    } else {
      req.session.isLoggedIn=true;
      req.session.user = FoundUser;
      res.json({ success: true, message: 'Connexion réussie' });  
    }
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

app.post('/index/choisir', async function(req,res){
  const idSport = req.body.id_sport;
  const userId = req.session.user.id_client;
  console.log(idSport);
});

app.post('/abonnement/choisir', async function(req, res) {
  console.log("Entered Abonnement");
  const idAbonnementBody = parseInt(req.body.id_abonnement); 
  const userId = req.session.user._id; 
  let generationsRestantes = 0;
  switch (idAbonnementBody) {
    case 1: 
      generationsRestantes = 3;
      break;
    case 2: 
      generationsRestantes = 10;
      break;
    case 3: 
      generationsRestantes = -1; 
      break;
    default:
      generationsRestantes = 0;
  }
  let mongoClient;
  try {
    console.log("Attempting mongo update abonnement");
    mongoClient = await connectToMongo();
    const db = mongoClient.db("EnergymizeBD");
    const collection = db.collection("clients");
    console.log("User ID:", userId);
    await UpdateClientById(collection, userId,{
      idAbonnement: idAbonnementBody,
      gens : generationsRestantes,
    });

    req.session.user.idAbonnement = idAbonnementBody;
    req.session.user.gens = generationsRestantes;
    
    res.redirect('/');
  } finally {
    await mongoClient.close();
  }
});


app.get('/profile', async function(req, res) {
  let user = null;
  let abonnement;
  if (req.session.isLoggedIn) {
    user = req.session.user;
    let mongoClient;
    try {
      mongoClient = await connectToMongo();
      const db = mongoClient.db("EnergymizeBD");
      const collection = db.collection("abonnement");
      abonnement = await FindAbonnement(collection,String(user.idAbonnement));
      console.log("Id abonnement: "+user.idAbonnement);
      console.log("Nom abonnement found: "+abonnement[0])
    } finally {
      mongoClient.close();
    }
    res.render("Pages/profile", {
      siteTitle: "Simple Application",
      pageTitle: "Event List",
      items: [], 
      user: user,
      abonnement: abonnement[0]
    });
  } else {
    res.redirect('/login');
  }
});



app.post('/auth/google', async (req, res) => {
  const { courriel_client, prenom_client, nom_client, mdp_client } = req.body;

  let FoundUser = await ConnectionUtilisateur(courriel_client, mdp_client);
    if (FoundUser===0){
      let verifier = await InscrireUtilisateur(nom_client,prenom_client,courriel_client,mdp_client);
      let user = await ConnectionUtilisateur(courriel_client,mdp_client);
      req.session.isLoggedIn=true;
      req.session.user=user;
      res.json({ success: true, message: 'Utilisateur connecté' });
    } else {
      req.session.isLoggedIn = true;
      req.session.user = FoundUser;
      res.json({ success: true, message: 'Utilisateur connecté' });
    }
});

app.post('/process_payment', async (req, res) => {
  const { cardNumber, expirationDate, cvv, planId } = req.body;
  let mongoClient;

  try {
    mongoClient = await connectToMongo();
    const db = mongoClient.db("EnergymizeBD");
    const clientsCollection = db.collection("clients");
    const carteClientCollection = db.collection("carte_client");
    const paymentSuccessful = true; 
    
    if (paymentSuccessful) {
      await clientsCollection.updateOne(
        { _id: new ObjectId(req.session.user._id) },
        { $set: { idAbonnement: parseInt(planId) } }
      );
      await carteClientCollection.insertOne({
        userId: new ObjectId(req.session.user._id),
        num_carte: cardNumber, 
        date_carte: expirationDate, 
        cvv_carte: cvv 
      });
      res.redirect('/success-page');
    } else {
      res.redirect('/failure-page');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ success: false, message: "Erreur interne du serveur." });
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
});





app.get('/success-page', function(req, res) {
  res.render('Pages/success', { 
    siteTitle: 'Payment Success',
    pageTitle: 'Transaction Completed',
    user: req.session.user 
  });
});

app.get('/failure-page', (req, res) => {
  res.render('Pages/failure', { 
    siteTitle: 'Payment Failure',
    pageTitle: 'Transaction Failed',
    message: 'We were unable to process your transaction. Please try again.',
    user: req.session.user 
  });
});

