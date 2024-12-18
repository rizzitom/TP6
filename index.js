const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware pour parser le body des requêtes en JSON
app.use(bodyParser.json());

// Configuration de la connexion à MySQL
const db = mysql.createConnection({
  host: 'renardserveur.freeboxos.fr', 
  user: 'tom',         
  password: 'I^&b#vLg*5aLsGz#*91j',    
  database: 'DBCoursTom'           
});

// Connexion à MySQL
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Endpoint pour récupérer toutes les nations
app.get('/nation', (req, res) => {
  const sql = 'SELECT * FROM nation';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Endpoint pour ajouter une nouvelle nation
app.post('/nation', (req, res) => {
  const { nom, continent } = req.body;
  const sql = 'INSERT INTO nation (nom, continent) VALUES (?, ?)';
  db.query(sql, [nom, continent], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id: result.insertId, nom, continent });
  });
});

app.get('/nation/:nom', (req, res) => {
    // Capture le paramètre 'nom' de l'URL
    const nom = '%'+req.params.nom+'%';
    // Crée la requête SQL avec un paramètre pour le nom
    const sql = 'SELECT * FROM nation WHERE nom LIKE ?';
    db.query(sql, [nom], (err, results) => {
    if (err) {
    return res.status(500).send(err);
    }
    if (results.length === 0) {
    // Si aucune nation n'est trouvée, renvoyer une erreur 404
    return res.status(404).json({ message: 'Nation not found' });
    }
    // Si des résultats sont trouvés, renvoyer les données
    res.json(results);
    });
    });

    // Endpoint pour récupérer toutes les athlete
app.get('/athlete', (req, res) => {
    const sql = 'SELECT * FROM athlete';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  
  // Endpoint pour ajouter une nouvelle athlete
  app.post('/athlete', (req, res) => {
    const { nom, prenom } = req.body;
    const sql = 'INSERT INTO athlete (nom, prenom) VALUES (?, ?)';
    db.query(sql, [nom, prenom], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ id: result.insertId, nom, prenom });
    });
  });
    
    app.get('/athlete/:query', (req, res) => {
        const query = req.params.query;
        const sql = `SELECT a.nom, a.prenom, n.nom AS nation FROM athletes a
                     JOIN nations n ON a.idNation = n.id
                     WHERE a.nom LIKE ? OR a.prenom LIKE ?`;
      
        db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
          if (err) throw err;
          res.json(results);
        });
      });
      
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });

      app.get('/athlete/:prenom', (req, res) => {
        // Capture le paramètre 'nom' de l'URL
        const prenom = '%'+req.params.prenom+'%';
        // Crée la requête SQL avec un paramètre pour le nom
        const sql = `SELECT a.nom, a.prenom, n.nom AS nation FROM athletes a
        JOIN nations n ON a.idNation = n.id WHERE a.nom LIKE ? OR a.prenom LIKE ?`;
        db.query(sql, [nom], (err, results) => {
        if (err) {
        return res.status(500).send(err);
        }
        if (results.length === 0) {
        // Si aucune nation n'est trouvée, renvoyer une erreur 404
        return res.status(404).json({ message: 'Athlete not found' });
        }
        // Si des résultats sont trouvés, renvoyer les données
        res.json(results);
        });
        });

// SPORT 

// Endpoint pour récupérer toutes les sports
app.get('/sport', (req, res) => {
    const sql = 'SELECT * FROM sport';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  
  // Endpoint pour ajouter un nouveau sport
  app.post('/sport', (req, res) => {
    const { nom } = req.body;
    const sql = 'INSERT INTO sport (nom) VALUES (?, ?)';
    db.query(sql, [nom], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ id: result.insertId, nom });
    });
  });

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur API en écoute sur http://localhost:${port}`);
});