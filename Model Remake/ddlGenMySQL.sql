CREATE TABLE client (
    id_client              INT NOT NULL AUTO_INCREMENT,
    nom_client             VARCHAR(100) NOT NULL,
    prenom_client          VARCHAR(150) NOT NULL,
    courriel_client        VARCHAR(250) NOT NULL,
    mdp_client             VARCHAR(50) NOT NULL,
    gen_restants           INT NOT NULL,
    sport_id_sport         INT,
    sport_nom_sport        VARCHAR(50),
    coach_id_coach         INT,
    poste_id_poste         INT,
    programme_id_programme INT,
    diete_id_diet          INT,
    PRIMARY KEY (id_client)
);

CREATE UNIQUE INDEX client__idx ON client (programme_id_programme ASC);

CREATE TABLE coach (
    id_coach  INT NOT NULL AUTO_INCREMENT,
    nom       VARCHAR(50) NOT NULL,
    typecoach INT NOT NULL,
    PRIMARY KEY (id_coach)
);

CREATE TABLE diete (
    id_diet   INT NOT NULL AUTO_INCREMENT,
    calories  INT NOT NULL,
    proteines INT,
    glucides  INT,
    lipides   TEXT,
    PRIMARY KEY (id_diet)
);

CREATE TABLE exo (
    id_exo    INT NOT NULL AUTO_INCREMENT,
    nom_exo   VARCHAR(200) NOT NULL,
    desc_exo  TEXT,
    image_exo TEXT,
    PRIMARY KEY (id_exo)
);

CREATE TABLE exo_exec (
    id_exo_exec        INT NOT NULL AUTO_INCREMENT,
    workout_id_workout INT NOT NULL,
    PRIMARY KEY (id_exo_exec)
);

CREATE TABLE poste (
    id_poste  INT NOT NULL AUTO_INCREMENT,
    nom_poste VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_poste)
);

CREATE TABLE prefaits_progs (
    id            INT NOT NULL AUTO_INCREMENT,
    titre_prefait VARCHAR(100) NOT NULL,
    desc_prefait  TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE program_exos (
    id_prog_exo            INT NOT NULL AUTO_INCREMENT,
    exo_id_exo             INT NOT NULL,
    programme_id_programme INT NOT NULL,
    prefaits_progs_id      INT NOT NULL,
    PRIMARY KEY (id_prog_exo)
);

CREATE TABLE programme (
    id_programme      INT NOT NULL AUTO_INCREMENT,
    nom_programme     VARCHAR(250) NOT NULL,
    client_id_client  INT,
    prefaits_progs_id INT,
    PRIMARY KEY (id_programme)
);

CREATE UNIQUE INDEX programme__idx ON programme (client_id_client ASC);

CREATE TABLE serie (
    id_serie               INT NOT NULL AUTO_INCREMENT,
    reps                 INT NOT NULL,
    rpe                  INT,
    exo_exec_id_exo_exec INT NOT NULL,
    exo_id_exo           INT NOT NULL,
    PRIMARY KEY (id_serie)
);

CREATE TABLE sport (
    id_sport  INT NOT NULL AUTO_INCREMENT,
    nom_sport VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_sport)
);

CREATE TABLE workout (
    id_workout       INT NOT NULL AUTO_INCREMENT,
    nom_workout      VARCHAR(200) NOT NULL,
    desc_workout     TEXT,
    client_id_client INT NOT NULL,
    PRIMARY KEY (id_workout)
);

-- Add foreign keys after creating all tables to ensure that referenced tables exist.
ALTER TABLE client ADD CONSTRAINT client_coach_fk FOREIGN KEY (coach_id_coach) REFERENCES coach (id_coach);
ALTER TABLE client ADD CONSTRAINT client_diete_fk FOREIGN KEY (diete_id_diet) REFERENCES diete (id_diet);
ALTER TABLE client ADD CONSTRAINT client_poste_fk FOREIGN KEY (poste_id_poste) REFERENCES poste (id_poste);
ALTER TABLE client ADD CONSTRAINT client_programme_fk FOREIGN KEY (programme_id_programme) REFERENCES programme (id_programme);
ALTER TABLE client ADD CONSTRAINT client_sport_fk FOREIGN KEY (sport_id_sport) REFERENCES sport (id_sport);
ALTER TABLE exo_exec ADD CONSTRAINT exo_exec_workout_fk FOREIGN KEY (workout_id_workout) REFERENCES workout (id_workout);
ALTER TABLE program_exos ADD CONSTRAINT program_exos_exo_fk FOREIGN KEY (exo_id_exo) REFERENCES exo (id_exo);
ALTER TABLE program_exos ADD CONSTRAINT program_exos_prefaits_progs_fk FOREIGN KEY (prefaits_progs_id) REFERENCES prefaits_progs (id);
ALTER TABLE program_exos ADD CONSTRAINT program_exos_programme_fk FOREIGN KEY (programme_id_programme) REFERENCES programme (id_programme);
ALTER TABLE programme ADD CONSTRAINT programme_client_fk FOREIGN KEY (client_id_client) REFERENCES client (id_client);
ALTER TABLE programme ADD CONSTRAINT programme_prefaits_progs_fk FOREIGN KEY (prefaits_progs_id) REFERENCES prefaits_progs (id);
ALTER TABLE serie ADD CONSTRAINT serie_exo_exec_fk FOREIGN KEY (exo_exec_id_exo_exec) REFERENCES exo_exec (id_exo_exec);
ALTER TABLE serie ADD CONSTRAINT serie_exo_fk FOREIGN KEY (exo_id_exo) REFERENCES exo (id_exo);
ALTER TABLE workout ADD CONSTRAINT workout_client_fk FOREIGN KEY (client_id_client) REFERENCES client (id_client);
ALTER USER 'scott'@'%' IDENTIFIED WITH mysql_native_password BY 'oracle';
ALTER TABLE poste
ADD COLUMN sport_id_sport INT;
ALTER TABLE poste
ADD CONSTRAINT poste_sport_fk FOREIGN KEY (sport_id_sport) REFERENCES sport (id_sport);
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON energymizeBd.* TO 'scott'@'%';
FLUSH PRIVILEGES;
-- Ajout table abonnement
CREATE TABLE abonnement (
    id_abonnement     INT NOT NULL AUTO_INCREMENT,
    nom_abonnement    VARCHAR(100) NOT NULL,
    nb_generations    INT NOT NULL,
    PRIMARY KEY (id_abonnement)
);
ALTER TABLE client
ADD COLUMN abonnement_id_abonnement INT;
ALTER TABLE client
ADD CONSTRAINT client_abonnement_fk FOREIGN KEY (abonnement_id_abonnement) REFERENCES abonnement (id_abonnement);
-- Fin ajout table abonnement
INSERT INTO abonnement (nom_abonnement, nb_generations) VALUES 
('GRATUIT', 3),
('BASIC', 10),
('PREMIUM', -1);
-- Ajout tables workout
    ALTER TABLE workout
    ADD COLUMN dureeSeconde_workout INT,
    ADD COLUMN IsTemplate_workout BOOLEAN DEFAULT FALSE;
    ALTER TABLE workout
    ADD COLUMN date_workout DATETIME;
    -- Suppression de la contrainte de clé étrangère
    ALTER TABLE workout DROP FOREIGN KEY workout_client_fk;
    -- Suppression de la colonne client_id_client
    ALTER TABLE workout DROP COLUMN client_id_client;
    -- Ajout d'une nouvelle colonne pour stocker l'identifiant MongoDB du client
    ALTER TABLE workout ADD COLUMN client_id_mongodb VARCHAR(24);