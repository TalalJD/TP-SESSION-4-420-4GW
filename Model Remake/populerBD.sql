-- Sports

INSERT INTO sport (nom_sport) VALUES 
('Hockey'), 
('Musculation'),
('Football'), 
('Basketball'), 
('Football Américain');

-- Postes
INSERT INTO poste (nom_poste, sport_id_sport) VALUES
('Defenseur', 1), -- Hockey
('Attaquant', 1), -- Hockey
('Gardien de but', 1), -- Hockey

('Quarterback', 5), -- Football Américain
('Receveur', 5), -- Football Américain
('Ligne offensive', 5), -- Football Américain
('Ligne défensive', 5), -- Football Américain

('Gardien de but', 3), -- Football
('Defenseur', 3), -- Football
('Milieu de terrain', 3), -- Football
('Attaquant', 3), -- Football

('Meneur de jeu', 4), -- Basketball
('Arrière', 4), -- Basketball
('Ailier', 4), -- Basketball
('Ailier fort', 4), -- Basketball
('Pivot', 4), -- Basketball

('Hypertrophie', 2), -- Musculation
('Force', 2); -- Musculation

-- Abonnements
INSERT INTO abonnement (nom_abonnement, nb_generations) VALUES ('Gratuit', 3);
INSERT INTO abonnement (nom_abonnement, nb_generations) VALUES ('Basic', 10);
INSERT INTO abonnement (nom_abonnement, nb_generations) VALUES ('Premium', 99999);
