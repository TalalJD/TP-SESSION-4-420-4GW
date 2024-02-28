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
    items: [] // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
  });

});
app.get("/Inscription", function (req, res) {
  // No database query, just render the page
  res.render("Pages/inscription", {
    siteTitle: "Simple Application",
    pageTitle: "Event List",
    items: [] // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
  });
});


app.get("/Connexion", function (req, res) {

  // No database query, just render the page

  res.render("Pages/connexion", {

    siteTitle: "Simple Application",

    pageTitle: "Event List",

    items: [] // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value

  });

});



app.get("/Abonnement", function (req, res) {

  // No database query, just render the page

  res.render("Pages/abonnement", {

    siteTitle: "Simple Application",

    pageTitle: "Event List",

    items: [] // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value

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
      res.redirect("/");
    });
  });
});

app.get("/indexSport", function(req,res){
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
      name: name
    });
  });
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 








app.post('/connexion/submit', (req, res) => {
  var user_email_address = request.body.adresse_mail;
  var mdp = request.body.mdp;
  if (adresse_mail && mdp) {
    query = `
        SELECT * FROM client 
        WHERE courriel_client = "${user_email_address}"
        `;
    database.query(query, function (error, data) {
      if (data.length > 0) {
        for (var count = 0; count < data.length; count++) {
          if (data[count].mdp_client == mdp) {
            response.redirect("/");
          }
          else {
            response.send('Incorrect Password');
          }
        }
      }
      else {
        response.send('Incorrect Email Address');
      }
      response.end();
    });
  }

  else {
    response.send('Please Enter Email Address and Password Details');
    response.end();
  }
});



app.get('/logout', function (request, response, next) {



  request.session.destroy();



  response.redirect("/");





});






