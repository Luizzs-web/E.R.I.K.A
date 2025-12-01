require('dotenv').config(); 
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors());         

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados', err.stack);
    }
    console.log('Conexão bem-sucedida ao PostgreSQL!');
    release();
});
app.get('/api/pilotos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id_piloto, nome, cpf, desempenho FROM pilotos ORDER BY nome');
        res.status(200).json(resultado.rows); 
    } catch (err) {
        console.error('Erro ao buscar pilotos:', err);
        res.status(500).json({ error: 'Falha ao buscar pilotos.' });
    }
});

app.post('/api/pilotos', async (req, res) => {
    const { nome, cpf } = req.body; 
    const desempenho = 0; 
    
   if (!nome || !cpf) {
        return res.status(400).json({ error: 'Nome e CPF são obrigatórios.' });
    }

    try {
        const query = 'INSERT INTO pilotos (nome, cpf, desempenho) VALUES ($1, $2, $3) RETURNING id_piloto, nome, cpf';
        const valores = [nome, cpf, desempenho];
        const resultado = await pool.query(query, valores);
        
        res.status(201).json(resultado.rows[0]); 
    } catch (err) {
        console.error('Erro ao cadastrar piloto:', err);
        res.status(500).json({ error: 'Não foi possível cadastrar o piloto.' });
    }
});

app.post('/api/reservas', async (req, res) => {
   const { id_kart, id_pista, agendarSessoes, eventos } = req.body; 
    
    if (!id_kart || !id_pista || !agendarSessoes) {
        return res.status(400).json({ error: 'Dados essenciais para a reserva estão faltando.' });
    }

    try {
        const query = 'INSERT INTO reservas (id_kart, id_financeiro, id_pista, agendarSessoes, eventos, gestaoVagas) VALUES ($1, 1, $2, $3, $4, \'Vaga reservada\') RETURNING id_reserva, agendarSessoes';
        const valores = [id_kart, id_pista, agendarSessoes, eventos || null];
        const resultado = await pool.query(query, valores);
        
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error('Erro ao agendar reserva:', err);
        res.status(500).json({ error: 'Não foi possível agendar a reserva.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:(leoleoInserirAporta`);
});
