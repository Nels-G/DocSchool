
-- TABLE filiere

CREATE TABLE filiere (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,   -- Ex: IRT
    nom VARCHAR(150) NOT NULL,          -- Ex: Informatique Réseaux Télécommunication
    description TEXT,
    couleur VARCHAR(20),                -- Ex: #3B82F6
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE niveau

CREATE TABLE niveau (
    id SERIAL PRIMARY KEY,
    filiere_id INT NOT NULL,
    code VARCHAR(10) NOT NULL,          -- Ex: L1, M1
    nom VARCHAR(100) NOT NULL,          -- Ex: Licence 1
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filiere_id) REFERENCES filiere(id) ON DELETE CASCADE
);

-- TABLE specialite

CREATE TABLE specialite (
    id SERIAL PRIMARY KEY,
    niveau_id INT NOT NULL,
    code VARCHAR(10) NOT NULL,          -- Ex: SRS
    nom VARCHAR(150) NOT NULL,          -- Ex: Systèmes Réseaux Sécurité
    description TEXT,
    couleur VARCHAR(20),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (niveau_id) REFERENCES niveau(id) ON DELETE CASCADE
);

-- TABLE users

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    matricule VARCHAR(20) UNIQUE NOT NULL,
    filiere_id INT,
    niveau_id INT,
    specialite_id INT,
    annee_debut INT,
    annee_fin INT,
    statut VARCHAR(20) DEFAULT 'En cours',   -- 'En cours' ou 'Terminé'
    role VARCHAR(20) DEFAULT 'etudiant',     -- 'etudiant' ou 'admin'
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filiere_id) REFERENCES filiere(id) ON DELETE SET NULL,
    FOREIGN KEY (niveau_id) REFERENCES niveau(id) ON DELETE SET NULL,
    FOREIGN KEY (specialite_id) REFERENCES specialite(id) ON DELETE SET NULL
);
