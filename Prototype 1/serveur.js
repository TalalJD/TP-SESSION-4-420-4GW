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
  // No database query, just render the page
  res.render("Pages/index", {
    siteTitle: "Simple Application",
    pageTitle: "Event List",
    items: [], // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
  });
});
app.get("/Inscription", function (req, res) {
  // No database query, just render the page
  res.render("Pages/inscription", {
    siteTitle: "Simple Application",
    pageTitle: "Event List",
    items: [], // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
  });
});

app.get("/Connexion", function (req, res) {
  // No database query, just render the page
  res.render("Pages/connexion", {
    siteTitle: "Simple Application",
    pageTitle: "Event List",
    items: [], // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
  });
});

app.get("/Abonnement", function (req, res) {
  // No database query, just render the page
  res.render("Pages/abonnement", {
    siteTitle: "Simple Application",
    pageTitle: "Event List",
    items: [], // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
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
  const requete =
    "INSERT INTO client (nom_client, prenom_client, courriel_client, mdp_client, gen_restants) VALUES (?, ?, ?, ?, ?)";
  const parametres = [
    req.body.nom_client,
    req.body.prenom_client,
    req.body.courriel_client,
    req.body.mdp_client,
    3,
  ];
  con.query(requete, parametres, function (err, result) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 





  app.post('/event/cnx', (req, res) => {
         const username = req.body.username;
         const password = req.body.password;     
         connection.query('SELECT * FROM client WHERE courriel_client = ? AND mdp_client = ?', [username, password], (error, results, fields) => {
          if (error) {             
            res.status(500).send('Internal Server Error');             
            return;         
          }         
          if (results.length > 0) {
              res.send('Login successful');
                     
          } else {
            res.status(401).send('Invalid username or password');         
          }     
        }); });

