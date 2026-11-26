// Express 
import express from 'express';
import { db, typeBase } from './base.ts';

const jetonTmdb = process.env.TMDB_TOKEN?.trim() ? 'présent' : 'absent';
const app = express();
app.use(express.json());

// Vérification serveur et token TMDB
app.get('/api/sante', (_req, res) => {
  res.status(200).json({
    serveur: 'ok',
    jetonTmdb,
    base: typeBase,
  });
});

// Récupérer toutes les soirées
app.get('/api/soirees', async (_req, res) => {
    const resultat = await db.execute(
        'SELECT id, nom, date FROM soirees ORDER BY date DESC;');
    res.json(resultat.rows.map((row) => ({
        id: row.id,
        nom: row.nom,
        date: row.date,
    })));
});

//Créer une soirée
app.post('/api/soirees', async (req, res) => {
    const tx = await db.transaction('write');
    try {
        const { lastInsertRowid } = await tx.execute({
            sql: 'INSERT INTO soirees (nom, date) VALUES (?, ?);',
            args: [req.body.nom, req.body.date]
        });
        for (const prenom of req.body.membres)
            await tx.execute({
                sql: 'INSERT INTO membres (prenom, soiree_id) VALUES (?, ?);',
                args: [prenom, lastInsertRowid]
            });

        await tx.commit();
        res.status(201).json({ id: lastInsertRowid });
    } catch (error) {
        await tx.rollback();
        res.status(500).json({ error: 'Erreur lors de la création de la soirée.' });
    }

});

// Chercher un film sur TMDB

export default app;

if (!process.env.VERCEL) {
  app.listen(3000, () => console.log('http://localhost:3000'));
}



