/*
Importation des modules requis
*/

<<<<<<< Updated upstream

import express from "express";
=======
import express, { response } from "express";
>>>>>>> Stashed changes
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";
import { body, validationResult } from "express-validator";
import dateFormat from "dateformat";
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
const server = app.listen(4000, function() {
console.log("serveur fonctionne sur 4000... ! ");
});
app.use(express.static('public'));


app.get("/", function (req, res) {
    // No database query, just render the page
    res.render("Pages/connexion", {
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
<<<<<<< Updated upstream
  });
=======
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


  app.post('/connexion/submit', (req, res) => {

    var user_email_address = request.body.adresse_mail;

    var mdp = request.body.mdp;

    if(adresse_mail && mdp)
    {
        query = `
        SELECT * FROM client 
        WHERE courriel_client = "${user_email_address}"
        `;

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].mdp_client == mdp)
                    {
                        
                        response.redirect("/");
                    }
                    else
                    {
                        response.send('Incorrect Password');
                    }
                }
            }
            else
            {
                response.send('Incorrect Email Address');
            }
            response.end();
        });
    }
    else
    {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }

});

app.get('/logout', function(request, response, next){

    request.session.destroy();

    response.redirect("/");

         
  });
        
>>>>>>> Stashed changes
