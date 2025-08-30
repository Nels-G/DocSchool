CREATE DATABASE docschool;

-- Table filieres

CREATE TABLE filieres (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,       -- ex: #0001
    abbreviation VARCHAR(20) NOT NULL,     -- ex: IRT1
    nom VARCHAR(255) NOT NULL,             -- ex: Informatique Réseau Télécommunication
    niveau VARCHAR(100) NOT NULL,          -- ex: Première année
    description TEXT,
    specialite VARCHAR(255),               -- ex: Architecture Logiciel (facultatif)
    couleur VARCHAR(20),                   -- ex: #3B82F6
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tble users

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    matricule VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    filiere_id INT REFERENCES filieres(id),
    niveau VARCHAR(50),
    specialite VARCHAR(100),
    annee_debut INT,
    annee_fin INT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



