const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Rota GET: Listar todos os agendamentos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM agendamentos');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
});

// Rota POST: Adicionar agendamento
router.post('/', async (req, res) => {
    const { id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala } = req.body;

    try {
        const query = `
            INSERT INTO agendamentos (id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;
        const values = [id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao adicionar agendamento:', error);
        res.status(500).json({ error: 'Erro ao adicionar agendamento' });
    }
});

// Rota PUT: Atualizar agendamento por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala } = req.body;

    try {
        const query = `
            UPDATE agendamentos 
            SET id_aluno = $1, id_funcionario = $2, data_agendamento = $3, 
                hora_inicio = $4, hora_fim = $5, tipo_atendimento = $6, cancelado = $7, sala = $8
            WHERE id_agendamento = $9 RETURNING *;
        `;
        const values = [id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }
        res.status(200).json({ message: 'Agendamento atualizado com sucesso', agendamento: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
});

// Rota DELETE: Deletar agendamento por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM agendamentos WHERE id_agendamento = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.status(200).json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        res.status(500).json({ error: 'Erro ao deletar agendamento' });
    }
});

// Função para cancelar agendamentos em feriados
router.post('/cancelar-agendamentos', async (req, res) => {
    const { data_feriado } = req.body;

    try {
        const query = `
            SELECT cancelar_agendamentos_em_feriado($1::DATE);
        `;
        await pool.query(query, [data_feriado]);

        res.status(200).json({ message: 'Agendamentos cancelados para o feriado.' });
    } catch (error) {
        console.error('Erro ao cancelar agendamentos em feriado:', error);
        res.status(500).json({ error: 'Erro ao cancelar agendamentos.' });
    }
});


module.exports = router;