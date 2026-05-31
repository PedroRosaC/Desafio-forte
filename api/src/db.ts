import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'admin',
  port: Number(process.env.DB_PORT) || 5432,
});

export const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS books (
                id UUID PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                publication_year VARCHAR(4) NOT NULL
            );
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS loans (
                id UUID PRIMARY KEY,
                book_id UUID REFERENCES books(id) ON DELETE CASCADE,
                user_name VARCHAR(255) NOT NULL,
                loan_date DATE NOT NULL,
                expected_return_date DATE NOT NULL,
                return_date DATE,
                status VARCHAR(50) NOT NULL
            );
        `);

        // Seed data
        const res = await pool.query('SELECT COUNT(*) FROM books');
        if (parseInt(res.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO books (id, title, author, publication_year) VALUES 
                ('8f6a9e14-41d8-4f93-b6dc-d87b5a8286a1', 'Código Limpo (Clean Code)', 'Robert Cecil Martin', '2012'),
                ('2d421d01-6c2e-4b2e-a579-ee9ec7b23cf4', 'O Programador Pragmático', 'Robert C. Martin', '2014'),
                ('5a8947f6-ea4e-4f51-b8f9-c6e885d53a99', 'Arquitetura Limpa', 'Robert C. Martin', '2019')
            `);
        }
        console.log("Banco de dados sincronizado.");
    } catch (e) {
        console.error("Erro ao inicializar DB:", e);
    }
};