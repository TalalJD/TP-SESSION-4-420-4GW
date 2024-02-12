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
    res.render("Pages/index", {
      siteTitle: "Simple Application",
      pageTitle: "Event List",
      items: [] // Assuming 'items' is used in your EJS file, pass an empty array or appropriate default value
    });
  });