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
    host: 'localhost',
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

app.get('/', (req, res) => {
    res.status(200).send('Servidor E.R.I.K.A. API está online e funcionando!');
});

app.get('/api/pilotos', async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id_usuario, u.nome, u.email, p.data_nascimento, p.peso, p.altura
            FROM Usuario u
            JOIN Pilotos p ON u.id_usuario = p.id_usuario
            WHERE u.tipo_usuario = 'Piloto'
            ORDER BY u.nome ASC;
        `;
        const resultado = await pool.query(query);
        res.status(200).json(resultado.rows); 
    } catch (err) {
        console.error('Erro ao buscar pilotos:', err);
        res.status(500).json({ error: 'Falha ao buscar pilotos.' });
    }
});

app.post('/api/pilotos', async (req, res) => {
    const { nome, email, senha, data_nascimento, peso, altura } = req.body; 
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const usuarioQuery = `
            INSERT INTO Usuario (tipo_usuario, nome, email, senha) 
            VALUES ('Piloto', $1, $2, $3) RETURNING id_usuario;
        `;
        const usuarioValores = [nome, email, senha];
        const usuarioResultado = await client.query(usuarioQuery, usuarioValores);
        const id_usuario = usuarioResultado.rows[0].id_usuario;

        const pilotoQuery = `
            INSERT INTO Pilotos (id_usuario, data_nascimento, peso, altura) 
            VALUES ($1, $2, $3, $4) RETURNING id_piloto;
        `;
        const pilotoValores = [id_usuario, data_nascimento, peso, altura];
        await client.query(pilotoQuery, pilotoValores);

        await client.query('COMMIT');
        
        res.status(201).json({ 
            message: 'Piloto cadastrado com sucesso!', 
            id_usuario: id_usuario,
            nome: nome
        }); 

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro ao cadastrar piloto:', err);
        res.status(500).json({ error: 'Não foi possível cadastrar o piloto (verifique se o e-mail já está em uso).' });
    } finally {
        client.release();
    }
});

app.post('/api/reservas', async (req, res) => {
    const { id_piloto, id_kart, id_pista, id_financeiro, agendar_sessoes, valor, eventos } = req.body; 
    
    if (!id_piloto || !id_kart || !id_pista || !agendar_sessoes || !valor) {
        return res.status(400).json({ error: 'Dados obrigatórios para a reserva estão faltando.' });
    }

    const status_reserva = 'Agendada'; 

    try {
        const query = `
            INSERT INTO Reservas (id_piloto, id_kart, id_pista, id_financeiro, agendar_sessoes, status_reserva, valor, eventos) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_reserva, agendar_sessoes, valor;
        `;
        const valores = [id_piloto, id_kart, id_pista, id_financeiro || null, agendar_sessoes, status_reserva, valor, eventos || null];
        const resultado = await pool.query(query, valores);
        
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error('Erro ao agendar reserva:', err);
        res.status(500).json({ error: 'Não foi possível agendar a reserva.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
