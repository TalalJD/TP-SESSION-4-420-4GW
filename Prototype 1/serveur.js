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
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import paypal from '@paypal/checkout-server-sdk';


import crypto from 'crypto';
import nodemailer from 'nodemailer';



function environment() {
  const clientId = "AS7gcs2OsninDvsU_PdPz9KM3eEe8scNrkpCj6CMja27alTMQtFpN7dlNWxFodo1SFzr2wjRJFIh3g5X";
  const clientSecret = "EBNe3MbmLTgNb3xAzkTh0JhgMpeYyGuZRFYzIMlcSOV9xBPdeeWBcV_qYPPU6fm1Gnn7GJUxoyhdfVtJ";
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}




config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uri = process.env.DB_URI;
app.use(session({
  secret: 'EBNe3MbmLTgNb3xAzkTh0JhgMpeYyGuZRFYzIMlcSOV9xBPdeeWBcV_qYPPU6fm1Gnn7GJUxoyhdfVtJ', 
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } 
}));
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

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
      console.log("Connecté à MongoDB!");``
      //console.log("User id : " + new ObjectId(req.session.user._id));
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
import { debug } from "console";

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

app.get("/executeWorkout",async function (req,res){
  let user = null;
  let workouts;
  if (req.session.isLoggedIn){
    user = req.session.user;
    workouts = await GetWorkouts(true,user);
  }
  res.render("Pages/executionWorkout", {

    siteTitle: "Simple Application",

    pageTitle: "Event List",

    items: [], 
    user:user,
    workout:workouts[0],
  });
});

app.post("/executeWorkout",async function (req,res){
  let user = null;
  let workouts;
  console.log("Trying to parse");
  if (req.session.isLoggedIn){
    user = req.session.user;
    //workouts = await GetWorkouts(true,user);
  }
  res.render("Pages/executionWorkout", {

    siteTitle: "Simple Application",

    pageTitle: "Event List",

    items: [], 
    user:user,
    workout:JSON.parse(req.body.workout),
  });
});

app.get("/App", async function (req, res) {
  let user = null;
  let abonnement;
  if (req.session.isLoggedIn) {
    user = req.session.user;
    let workouts = await GetWorkouts(true,user);
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
      workouts:workouts,
      abonnement:abonnement[0]
    });
  } else {
    res.redirect('/connexion');
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

    const saltRounds = 10;
    const mdp_hashee = await bcrypt.hash(mdp_client, saltRounds);

    const clientDocument = {
      nom : nom_client,
      prenom : prenom_client,
      courriel : courriel_client,
      mdp : mdp_hashee,
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

    const isMatch = await bcrypt.compare(mdp_client, emailCheck[0].mdp);
    if (isMatch){
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

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

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
    res.redirect('/connexion');
  }
});

app.post('/createEmptyWorkout', async(req,res)=>{
  let user = req.session.user;
  console.log("Gens remaining before creation: ",user.gens)
  try {
    const workoutId = await createWorkout(user._id, true);
    user.gens--;
    req.session.user=user;
    console.log("Gens remaining: ",user.gens)
    console.log("Workout created and ID passed as : ",workoutId);
    req.session.currentWorkoutTemplateCreation = workoutId;
    res.send('Workout created successfully');
  } catch (error) {
    console.error("Failed to create workout: ", error);
    res.status(500).send('Error creating workout');
  }
});
app.post('/createNewWorkout', async (req, res) => {
  let user = req.session.user;
  let { listeSerie } = req.body;
  let workoutId;

  try {
    workoutId = await createWorkout(user._id, false);
  } catch (error) {
    console.error("Failed to create workout: ", error);
    return res.status(500).send('Error creating workout');
  }

  try {
    await RemplirWorkoutExoExecs(workoutId,listeSerie);
    await RemplirWorkoutSeries(workoutId, listeSerie);
    console.log('All series inserted successfully');
    res.status(200).send('Workout created and series inserted successfully');
  } catch (error) {
    console.error('Error inserting series', error);
    res.status(500).send('Error inserting series');
  }
});
async function RemplirWorkoutExoExecs(workoutId, listeSerie) {
  for (let serie of listeSerie) {
    try {
      let serieExoId = await GetExoIdByExoExecId(serie.exo_exec_id_exo_exec);
      let idExoExec = await insertExoExec(workoutId, serieExoId);
      serie.exo_exec_id_exo_exec = idExoExec;
    } catch (error) {
      console.error('Error processing series:', error);
    }
  }
}

function GetExoIdByExoExecId(exoExecId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT exo_id_exo
      FROM exo_exec
      WHERE id_exo_exec = ?
    `;

    con.query(query, [exoExecId], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length === 0) {
        return reject(new Error('No exo_id_exo found for the given exo_exec_id'));
      }
      resolve(results[0].exo_id_exo);
    });
  });
}
function insertExoExec(workoutId, exoIdExo) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO exo_exec (workout_id_workout, exo_id_exo)
      VALUES (?, ?)
    `;

    const values = [workoutId, exoIdExo];

    con.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId); 
    });
  });
}
function RemplirWorkoutSeries(workoutId, listeSerie){
  const querySerie = `
        INSERT INTO serie (reps, rpe, exo_exec_id_exo_exec, poids)
        VALUES (?, ?, ?, ?)
      `;
  return new Promise((resolve,reject)=>{
    let promises = [];
    
    for(let serie of listeSerie){
      let values = [serie.reps, serie.rpe, serie.exo_exec_id_exo_exec, serie.poids];
      let promise = new Promise((resolve, reject) => {
        con.query(querySerie, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      promises.push(promise);
    }

    Promise.all(promises)
      .then(results => resolve(results))
      .catch(error => reject(error));
  });
}
app.post('/confirmWorkoutTemplate',async (req,res)=>{
  const workoutID = req.session.currentWorkoutTemplateCreation;
  const {title} = req.body;
  const {description} = req.body;
  try {
    let results = await updateWorkout(workoutID, title,description);
    req.session.currentWorkoutTemplateCreation = null;
    res.send('Workout confirmed successfully');
  } catch (error){
    console.error("Failed to confirm workout: ", error);
  }
});
function updateWorkout(id, newName, newDesc){
  const query = `UPDATE workout SET nom_workout = ?, desc_workout = ? WHERE id_workout = ?`;
  return new Promise((resolve,reject)=>{
    con.query(query, [newName,newDesc,id], (error,results,fields) => {
      if (error){
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

app.post('/deleteEmptyWorkout', async(req,res)=>{
  if (req.session.currentWorkoutTemplateCreation==-1){
    console.log("No current active workout creation open");
  } else {
    try {
      const resultDeleteExo = await deleteAllAssociatedExercises(req.session.currentWorkoutTemplateCreation,true);
      if (resultDeleteExo==1){
        try {
          const result = await deleteWorkoutTemplate(req.session.currentWorkoutTemplateCreation,true);
          if (result==1){
            req.session.user.gens++;
            console.log("Workout ",req.session.currentWorkoutTemplateCreation," deleted successfully. Generations refunded. Remaining: ",req.session.user.gens);
            res.send("Workout deleted successfully");
          } else {
            res.send("Workout deleted successfully");
          }
          req.session.currentWorkoutTemplateCreation=-1;
        } catch (error){
          console.error("Failed to delete workout: ",error);
          res.status(500).send('Error deleting workout');
        }
      }
    } catch (error){
      console.error("Failed to delete workout associated exercises: ",error);
      res.status(500).send('Error deleting workout');
    }
  }
});

app.post('/choisirExercise', async (req, res) => {
  const exercise = req.body;
  const inputToHashIdString = `${exercise.name}-${exercise.type}-${exercise.equipment}`;
  const hashedID = await hashSHA1(inputToHashIdString);

  console.log("Pre-hash: " + inputToHashIdString);
  console.log("Post hash: " + hashedID);

  selectExoByID(hashedID)
    .then(results => {
      if (results.length > 0) {
        console.log('Exercise exists in the DB: ' + results[0].nom_exo);
        res.status(200).json(results[0]);
        return hashedID; // Continue to the next step with the hashedID
      } else {
        return insertIntoExo(exercise, hashedID)
          .then(insertResults => {
            if (insertResults) {
              res.status(201).send({ id_exo: hashedID, message: "Exercise inserted" });
            }
            return hashedID; // Continue to the next step with the hashedID
          });
      }
    })
    .then(hashedID => {
      if (hashedID) {
        AddExerciceToWorkout(req.session.currentWorkoutTemplateCreation, hashedID);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      if (!res.headersSent) {
        res.status(500).send("An error occurred");
      }
    });
});

app.post('/getExoExecs', async (req, res) => {
  const workoutId = req.session.currentWorkoutTemplateCreation;

  if (workoutId === -1 || !workoutId) {
    return res.status(400).send({ message: "Workout ID is required" });
  }

  try {
    await getExoExecs(workoutId, res);
  } catch (error) {
    console.error("Failed to process request: ", error);
    if (!res.headersSent) {
      res.status(500).send({ message: "An error occurred while processing your request" });
    }
  }
});

function getExoExecs(idWorkout, res) {
  const query = `
    SELECT exo_exec.id_exo_exec, exo_exec.workout_id_workout, exo_exec.exo_id_exo, exo.nom_exo, exo.desc_exo
    FROM exo_exec
    JOIN exo ON exo_exec.exo_id_exo = exo.id_exo
    WHERE exo_exec.workout_id_workout = ?
  `;

  return new Promise((resolve, reject) => {
    con.query(query, [idWorkout], (error, results) => {
      if (error) {
        console.error("Failed to retrieve exo_exec records: ", error);
        if (res) {
          res.status(500).send({ message: "An error occurred while fetching exo_exec records" });
        }
        reject(error);
      } else {
        if (res) {
          res.status(200).json(results);
        }
        resolve(results);
      }
    });
  });
}

// Usage within an async function
async function handleRequest(req, res) {
  try {
    const idWorkout = req.params.id;
    await getExoExecs(idWorkout, res);
  } catch (error) {
    console.error("Error handling request: ", error);
    if (!res.headersSent) {
      res.status(500).send({ message: "Server error" });
    }
  }
}


async function AddExerciceToWorkout(idWorkout, idExercise){
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO exo_exec (workout_id_workout, exo_id_exo) VALUES (?, ?)`;
    
    con.query(query, [idWorkout, idExercise], (error, results) => {
        if (error) {
            console.error("Failed to insert new exo_exec: ", error);
            reject(error);
        } else {
            console.log("exo_exec created with ID: ", results.insertId);
            resolve(results.insertId);
        }
    });
});
}

async function deleteWorkoutTemplate(idWorkout, isReturn) {
  return new Promise((resolve, reject) => {
    // SQL statement to delete a workout by ID
    const query = 'DELETE FROM workout WHERE id_workout = ?';
    
    con.query(query, [idWorkout], (error, results) => {
      if (error) {
        console.error("Failed to delete workout: ", error);
        reject(error);  // Reject the Promise if there's an error
      } else if (results.affectedRows === 0) {
        console.log("No workout found with the given ID.");
        reject(new Error("No workout found with the given ID."));  // Reject if no rows affected
      } else {
        console.log("Workout deleted successfully.");
        if (isReturn){
          resolve(1);
        } else {
          resolve(2);
        }
      }
    });
  });
}
async function deleteAllAssociatedExercises(idWorkout, isReturn){
  return new Promise((resolve, reject)=>{
      const query = `
      DELETE FROM exo_exec
      WHERE workout_id_workout = ?
    `;
    con.query(query, [idWorkout], (error, results) => {
        if (error) {
          console.error("Failed to delete exo_exec records: ", error);
          reject(error);
        } else {
          console.log("Workout exercises supprimées. Nombre d'éléments supprimés: "+results.affectedRows);
          if (isReturn){
            resolve(1);
          } else {
            resolve(2);
          }
        }
    });
  });
}

async function hashSHA1(inputString) {
  return crypto.createHash('sha1')
               .update(inputString)
               .digest('hex');
}

function insertIntoExo(exercise, sha1ID){
  return new Promise((resolve,reject) => {
    const query = 'INSERT INTO exo (id_exo, nom_exo, desc_exo, image_exo) VALUES (?, ?, ?, ?)';
    con.query(query, [sha1ID, exercise.name, exercise.instructions, null], (error,results,fields) =>{
      if (error){
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function selectExoByID(sha1Id){
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM exo WHERE id_exo = ?';
    con.query(query, [sha1Id], (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function createWorkout(clientIdMongoDB, isTemplate) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO workout (client_id_mongodb, IsTemplate_workout, nom_workout, desc_workout, dureeSeconde_workout, date_workout) VALUES (?, ?,'Nouveau Workout','', 0, NOW())`;
    con.query(query, [clientIdMongoDB, isTemplate], (error, results) => {
      if (error) {
        console.error("Failed to insert new workout: ", error);
        reject(error);
      } else {
        console.log("Workout created with ID: ", results.insertId);
        resolve(results.insertId);
      }
    });
  });
}
function getWorkoutById(workoutId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM workout WHERE id_workout = ?';
    con.query(query, [workoutId], (error, results) => {
      if (error) {
        console.error("Failed to retrieve workout: ", error);
        reject(error);
      } else if (results.length > 0) {
        console.log("Workout retrieved: ", results[0]);
        resolve(results[0]);
      } else {
        reject(new Error("Workout not found"));
      }
    });
  });
}

function getAllWorkoutsByUserId(userId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM workout WHERE client_id_mongodb = ?';
    con.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Failed to retrieve workouts: ", error);
        reject(error);
      } else {
        console.log("Workouts retrieved: ", results);
        resolve(results);
      }
    });
  });
}

// Assuming you're using Express.js
// Modify your Express.js route to handle fetching workouts for a user by their ID
app.get('/fetchWorkouts', (req, res) => {
  const userId = req.session.user._id;
  // Call the function to fetch workouts by user ID
  getAllWorkoutsByUserId(userId)
    .then(workouts => {
      // Send the fetched workouts back as a response
      res.json({ workouts: workouts });
      console.log("Fetched workouts for user:", userId);
    })
    .catch(error => {
      // Handle errors
      console.error('Failed to fetch workouts:', error);
      res.status(500).json({ error: 'Failed to fetch workouts' });
    });
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

function GetWorkouts(isTemplate, user){
  return new Promise((resolve, reject)=>{
    let requeteExo;
    if(isTemplate){
      requeteExo = 'SELECT e.nom_exo, e.desc_exo, ee.id_exo_exec FROM exo_exec ee JOIN exo e ON ee.exo_id_exo = e.id_exo WHERE ee.id_exo_exec=?';
    } else {
      requeteExo = 'SELECT e.nom_exo, e.desc_exo, s.reps, s.rpe, ee.id_exo_exec, ee.exo_id_exo FROM exo_exec ee JOIN ' +
      'serie s ON ee.id_exo_exec = s.exo_exec_id_exo_exec JOIN ' +
      'exo e ON ee.exo_id_exo = e.id_exo WHERE ee.id_exo_exec=?;';
    }

    console.log(user._id);

    con.query(
      'SELECT id_workout, nom_workout, desc_workout, client_id_mongodb, ' +
      'SEC_TO_TIME(dureeSeconde_workout) AS dureeSeconde_workout, IsTemplate_workout,' +
      'DATE_FORMAT(date_workout, \'%Y-%m-%d\') AS date_workout FROM workout WHERE client_id_mongodb = ? ' +
      ' AND IsTemplate_workout=?',
      [user._id, isTemplate],
      (error, workouts) => {
          if (error) {
              reject(error);
          }

          let completedWorkouts = 0;

          if (workouts.length === 0) {
              resolve([]);
          } else {
              workouts.forEach((workout, index) => {
                  con.query(
                      'SELECT * FROM exo_exec WHERE workout_id_workout = ?',
                      [workout.id_workout],
                      (error, exercises) => {
                          if (error) {
                              reject(error);
                          }

                          workouts[index].exercises = exercises;

                          let completedExercises = 0;

                          if (exercises.length === 0) {
                              completedWorkouts++;
                              if (completedWorkouts === workouts.length) {
                                resolve(workouts);
                              }
                          } else {
                              exercises.forEach((exercise, exIndex) => {
                                  con.query(
                                      requeteExo,
                                      [exercise.id_exo_exec],
                                      (error, series) => {
                                          if (error) {
                                            reject(error);
                                          }

                                          workouts[index].exercises[exIndex].series = series;
                                          completedExercises++;

                                          if (completedExercises === exercises.length) {
                                              completedWorkouts++;
                                              if (completedWorkouts === workouts.length) {
                                                resolve(workouts);
                                              }
                                          }
                                      }
                                  );
                              });
                          }
                      }
                  );
              });
          }
      }
  );
  });
}

// Route for fetching workout dates
app.get('/workout-dates', async function(req, res) {
  let user = null;
  let userId = null;
  if (req.session.isLoggedIn) {
      user = req.session.user;
      userId = user._id;
  }

  con.query('SELECT DATE_FORMAT(date_workout, \'%Y-%m-%d\') AS date_workout FROM workout WHERE client_id_mongodb = ? AND IsTemplate_workout = 0', [userId], (error, workouts) => {
      if (error) {
          console.error('Error fetching workout dates:', error);
          return res.status(500).json({ error: 'Server Error' });
      }

      // Extract the workout dates from the query result
      const workoutDates = workouts.map(workout => workout.date_workout);

      // Send the workout dates as JSON response
      res.json({ workoutDates });
  });
});

// Route for rendering the historique page
app.get('/historique', function(req, res) {
  let user = req.session.user;
  res.render("Pages/historique", {
    items: [], 
    user: user
  });
});





app.get('/affichage_workout', async function(req, res){
 
  let user = null;
 
  if (req.session.isLoggedIn) {
    user = req.session.user;
   
  }
 
  //const isTemplate = req.query.type === 'template';
  const isTemplate = true;

  let requeteExo;
  if(isTemplate){
    requeteExo = 'SELECT e.nom_exo, e.desc_exo FROM exo_exec ee JOIN exo e ON ee.exo_id_exo = e.id_exo WHERE ee.id_exo_exec=?'
  }else{
    requeteExo = 'SELECT e.nom_exo, e.desc_exo, s.reps, s.rpe FROM exo_exec ee JOIN ' +
    'serie s ON ee.id_exo_exec = s.exo_exec_id_exo_exec JOIN ' +
    'exo e ON ee.exo_id_exo = e.id_exo WHERE ee.id_exo_exec=?;';
  }
 
 
    console.log(user._id);
 
    con.query(
      'SELECT id_workout, nom_workout, desc_workout, client_id_mongodb, ' +
      'SEC_TO_TIME(dureeSeconde_workout) AS dureeSeconde_workout, IsTemplate_workout,' +
      'DATE_FORMAT(date_workout, \'%Y-%m-%d\') AS date_workout FROM workout WHERE client_id_mongodb = ? ' +
      ' AND IsTemplate_workout=?',
      [user._id, isTemplate],
      (error, workouts) => {
          if (error) {
              console.error('Error fetching workouts:', error);
              return res.status(500).send('Server Error');
          }
 
          let completedWorkouts = 0;
 
          if (workouts.length === 0) {
              res.render("Pages/affichage_workout", {
                  siteTitle: "Simple Application",
                  pageTitle: "Liste des Workouts",
                  workouts: [],
                  user: user
              });
          } else {
              workouts.forEach((workout, index) => {
                  con.query(
                      'SELECT * FROM exo_exec WHERE workout_id_workout = ?',
                      [workout.id_workout],
                      (error, exercises) => {
                          if (error) {
                              console.error('Error fetching exercises:', error);
                              return res.status(500).send('Server Error');
                          }
 
                          workouts[index].exercises = exercises;
 
                          let completedExercises = 0;
 
                          if (exercises.length === 0) {
                              completedWorkouts++;
                              if (completedWorkouts === workouts.length) {
                                  res.render("Pages/affichage_workout", {
                                      siteTitle: "Simple Application",
                                      pageTitle: "Liste des Workouts",
                                      workouts: workouts,
                                      user: user
                                  });
                              }
                          } else {
                              exercises.forEach((exercise, exIndex) => {
                                  con.query(
                                      requeteExo,
                                      [exercise.id_exo_exec],
                                      (error, series) => {
                                          if (error) {
                                              console.error('Error fetching series:', error);
                                              return res.status(500).send('Server Error');
                                          }
 
                                          workouts[index].exercises[exIndex].series = series;
                                          completedExercises++;
 
                                          if (completedExercises === exercises.length) {
                                              completedWorkouts++;
                                              if (completedWorkouts === workouts.length) {
                                                  res.render("Pages/affichage_workout", {
                                                      siteTitle: "Simple Application",
                                                      pageTitle: "Liste des Workouts",
                                                      workouts: workouts,
                                                      user: user
                                                  });
                                              }
                                          }
                                      }
                                  );
                              });
                          }
                      }
                  );
              });
          }
      }
  );


});
app.post('/abonnement/choisir-gratuit', async (req, res) => {
  const userId = req.session.user._id;
  let mongoClient;
  try {
      mongoClient = await connectToMongo();
      const db = mongoClient.db("EnergymizeBD");
      const collection = db.collection("clients");
      
      await UpdateClientById(collection, userId, {
          idAbonnement: 1, 
          gens: 3, 
      });

      req.session.user.idAbonnement = 1;
      req.session.user.gens = 3;
      
      res.json({ success: true, message: "Abonnement gratuit activé." });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
      if (mongoClient) await mongoClient.close();
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

async function createOrder(amount) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
          amount: {
              currency_code: 'USD',
              value: amount
          }
      }]
  });
  try {
      const response = await client().execute(request);
      return response.result.id; // Renvoie l'ID de l'ordre pour le capturer plus tard
  } catch (err) {
      console.error(err);
      return null;
  }
}

// Fonction pour capturer un ordre
async function captureOrder(orderId) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  try {
      const capture = await client().execute(request);
      const captureId = capture.result.purchase_units[0].payments.captures[0].id;
      console.log('Capture ID:', captureId);
      return captureId; // ID de la capture, indique que le paiement a été réussi
  } catch (err) {
      console.error(err);
      return null;
  }
}

function determineGenerationsRestantes(planId) {
  switch (parseInt(planId)) {
      case 1:
          return 3;  
      case 2:
          return 10; 
      case 3:
          return -1; 
      default:
          return 0;  
  }
}

app.post('/paypal-transaction-complete', async (req, res) => {
  const { orderID, planId } = req.body;
  const paypalClient = client();

  try {
      const orderDetails = new paypal.orders.OrdersGetRequest(orderID);
      const orderResponse = await paypalClient.execute(orderDetails);
      console.log('Transaction status:', orderResponse.result.status);

      if (orderResponse.result.status === 'COMPLETED') {
          let mongoClient = await MongoClient.connect(process.env.DB_URI);
          let db = mongoClient.db("EnergymizeBD");
          let clientsCollection = db.collection("clients");

          let generationsRestantes = determineGenerationsRestantes(planId);

          await clientsCollection.updateOne(
              { _id: new ObjectId(req.session.user._id) },
              {
                  $set: {
                      idAbonnement: parseInt(planId),
                      gens: generationsRestantes
                  }
              }
          );

          req.session.user.idAbonnement = parseInt(planId);
          req.session.user.gens = generationsRestantes;
          res.redirect('/success-page');
      } else {
          console.error('PayPal transaction not completed: ', orderResponse.result);
          res.redirect('/failure-page');
      }
  } catch (error) {
      console.error('Error during PayPal transaction verification:', error);
      res.status(500).json({ success: false, message: "Internal server error during transaction verification." });
  }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




app.get('/Reset', function(req, res) {
  res.render('Pages/resetMdp', { 
    siteTitle: 'Payment Success',
    pageTitle: 'Reinitialisation',
    user: req.session.user 
  });
});


const transporter = nodemailer.createTransport({
  service: 'gmail', // Exemple avec Gmail, modifiez selon votre fournisseur
  auth: {
    user: 'energymize@gmail.com',  // Remplacez par votre email
    pass: 'admin123)'        // Remplacez par votre mot de passe
  }
});

app.post('/submit-reset', async (req, res) => {
  const { email } = req.body;
  let client;

  try {
    client = await connectToMongo();
    const db = client.db("EnergymizeBD");
    const users = db.collection("clients");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).send("Aucun utilisateur trouvé avec cet e-mail.");
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpires = Date.now() + 3600000; // Le token expire après 1 heure

    await users.updateOne({ email }, {
      $set: {
        resetPasswordToken: resetToken,
        resetPasswordExpires
      }
    });

    const resetUrl = `http://127.0.0.1/reset/${resetToken}`;

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Réinitialisation du mot de passe',
      text: `Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant ou copiez-le dans votre navigateur pour procéder à la réinitialisation :\n\n${resetUrl}`
    };

    await transporter.sendMail(mailOptions);
    res.send('Un email de réinitialisation a été envoyé à ' + email + '.');
  } catch (error) {
    console.error('Erreur lors de l\'opération:', error);
    res.status(500).send('Erreur lors de l\'envoi de l\'email ou de la connexion à la base de données.');
  } finally {
    if (client) {
      await client.close();
    }
  }
});





async function sendSubscriptionEmail(userEmail, subscriptionName, price) {
  const mailOptions = {
    from: 'energymize@gmail.com',
    to: userEmail,
    subject: 'Confirmation d\'abonnement',
    text: `Merci pour votre abonnement. \n\nNom de l'abonnement: ${subscriptionName}\nPrix payé: ${price}\n\nMerci pour votre abonnement !`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}



