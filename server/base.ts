import { createClient } from '@libsql/client';

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
export const typeBase = tursoUrl ? 'Turso' : 'fichier local';

export const db = createClient({
    url: tursoUrl || 'file:server/cinematch.db',
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS soirees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        date DATE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS membres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prenom TEXT NOT NULL,
        soiree_id INTEGER NOT NULL,
        FOREIGN KEY (soiree_id) REFERENCES soirees(id) ON DELETE CASCADE
    );
`);


