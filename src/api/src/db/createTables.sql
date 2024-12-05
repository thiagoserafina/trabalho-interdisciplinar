CREATE TABLE IF NOT EXISTS alunos (
    id_aluno SERIAL PRIMARY KEY,
    nome_aluno VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    contato_responsavel VARCHAR(100),
    diagnostico TEXT
);

-- Tabela para funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
    id_funcionario SERIAL PRIMARY KEY,
    nome_funcionario VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    id_especialidade INTEGER NOT NULL,
    disponibilidade JSONB
);

-- Tabela para agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id_agendamento SERIAL PRIMARY KEY,
    id_funcionario INTEGER NOT NULL,
    id_aluno INTEGER NOT NULL,
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    tipo_atendimento VARCHAR(50),
    cancelado BOOLEAN DEFAULT FALSE,
    sala VARCHAR(50),
    FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id_funcionario),
    FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno)
);

-- Tabela para frequências
CREATE TABLE IF NOT EXISTS frequencias (
    id_frequencia SERIAL PRIMARY KEY,
    id_agendamento INTEGER NOT NULL,
    id_aluno INTEGER NOT NULL,
    data_sessao DATE NOT NULL,
    compareceu BOOLEAN NOT NULL,
    observacao TEXT,
    FOREIGN KEY (id_agendamento) REFERENCES agendamentos(id_agendamento) ON DELETE CASCADE,
    FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE
);

-- Tabela para login
CREATE TABLE IF NOT EXISTS login (
    id_login SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Tabela para especialidades
CREATE TABLE IF NOT EXISTS especialidades (
    id_especialidade SERIAL PRIMARY KEY,
    nome_especialidade VARCHAR(100) NOT NULL
);

-- Tabela para feriados
CREATE TABLE IF NOT EXISTS feriados (
    id_feriado SERIAL PRIMARY KEY,
    data_feriado DATE NOT NULL,
    descricao TEXT
);

-- Inserts
INSERT INTO alunos (nome_aluno, cpf, data_nascimento, contato_responsavel, diagnostico)
VALUES
('Carlos Oliveira', '12345678900', '2010-05-14', '11999999999', 'Paralisia Cerebral'),
('Julia Santos', '23456789001', '2008-11-22', '11988888888', 'Transtorno do Espectro Autista'),
('Mariana Lima', '34567890102', '2009-03-08', '11977777777', 'Deficiência Intelectual'),
('Lucas Almeida', '45678901203', '2011-07-20', '11966666666', 'Hiperatividade'),
('Beatriz Rocha', '56789012304', '2010-10-02', '11955555555', 'Dislexia'),
('Fernanda Silva', '67890123405', '2012-01-15', '11944444444', 'Paralisia Cerebral'),
('Joice Pereira', '78901234506', '2009-08-30', '11933333333', 'Transtorno do Espectro Autista');


INSERT INTO funcionarios (nome_funcionario, cpf, email, telefone, disponibilidade, id_especialidade)
VALUES
('Ana Silva', '12345678900', 'ana.silva@hospital.com', '11922222222', 
'{
    "segunda": ["07:00-12:00", "14:00-18:00"],
    "terça": ["07:00-12:00", "14:00-18:00"],
    "quarta": ["07:00-12:00", "14:00-18:00"],
    "quinta": ["07:00-12:00", "14:00-18:00"],
    "sexta": ["07:00-12:00", "14:00-18:00"]
}'::jsonb, 1),

('Maria Souza', '23456789001', 'maria.souza@hospital.com', '11911111111', 
'{
    "segunda": ["08:00-12:00", "13:00-17:00"],
    "terça": ["08:00-12:00", "13:00-17:00"],
    "quarta": ["08:00-12:00", "13:00-17:00"],
    "quinta": ["08:00-12:00", "13:00-17:00"],
    "sexta": ["08:00-12:00", "13:00-17:00"]
}'::jsonb, 2),

('Carla Mendes', '34567890102', 'carla.mendes@hospital.com', '11900000000', 
'{
    "segunda": ["09:00-12:00", "14:00-18:00"],
    "terça": ["09:00-12:00", "14:00-18:00"],
    "quarta": ["09:00-12:00", "14:00-18:00"],
    "quinta": ["09:00-12:00", "14:00-18:00"],
    "sexta": ["09:00-12:00", "14:00-18:00"]
}'::jsonb, 3),

('Renata Borges', '45678901203', 'renata.borges@hospital.com', '11912345678', 
'{
    "segunda": ["07:00-12:00", "13:00-16:00"],
    "terça": ["07:00-12:00", "13:00-16:00"],
    "quarta": ["07:00-12:00", "13:00-16:00"],
    "quinta": ["07:00-12:00", "13:00-16:00"],
    "sexta": ["07:00-12:00", "13:00-16:00"]
}'::jsonb, 4);

-- Eventos para 01/12/2024
INSERT INTO agendamentos (id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala)
VALUES 
(1, 1, '2024-12-01', '08:00', '09:00', 'Fisioterapia', false, 'Sala 01'),
(2, 2, '2024-12-01', '09:30', '10:30', 'Fonoaudiologia', false, 'Sala 02'),
(3, 3, '2024-12-01', '11:00', '12:00', 'Psicologia', false, 'Sala 03');

-- Eventos para 02/12/2024
INSERT INTO agendamentos (id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala)
VALUES 
(4, 1, '2024-12-02', '07:30', '08:30', 'Fisioterapia', false, 'Sala 01'),
(5, 2, '2024-12-02', '09:00', '09:45', 'Nutrição', false, 'Sala 04'),
(6, 3, '2024-12-02', '10:00', '11:00', 'Psicologia', false, 'Sala 03'),
(7, 4, '2024-12-02', '14:00', '15:30', 'Terapia Ocupacional', false, 'Sala 05');

-- Eventos para 03/12/2024
INSERT INTO agendamentos (id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala)
VALUES 
(1, 2, '2024-12-03', '08:00', '08:30', 'Nutrição', false, 'Sala 04'),
(3, 3, '2024-12-03', '09:00', '10:00', 'Psicologia', true, 'Sala 03'),
(5, 1, '2024-12-03', '10:30', '11:30', 'Fisioterapia', false, 'Sala 01');

-- Eventos para 04/12/2024
INSERT INTO agendamentos (id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala)
VALUES 
(2, 1, '2024-12-04', '08:00', '09:00', 'Fisioterapia', false, 'Sala 01'),
(4, 2, '2024-12-04', '09:30', '10:30', 'Fonoaudiologia', false, 'Sala 02'),
(6, 3, '2024-12-04', '11:00', '12:00', 'Psicologia', false, 'Sala 03');

-- Eventos para 05/12/2024
INSERT INTO agendamentos (id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala)
VALUES 
(7, 1, '2024-12-05', '07:30', '08:30', 'Fisioterapia', false, 'Sala 01'),
(5, 2, '2024-12-05', '09:00', '10:00', 'Nutrição', false, 'Sala 04'),
(1, 3, '2024-12-05', '10:30', '11:30', 'Psicologia', true, 'Sala 03');

-- Eventos para 06/12/2024
INSERT INTO agendamentos (id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala)
VALUES 
(4, 2, '2024-12-06', '08:00', '09:30', 'Fonoaudiologia', false, 'Sala 02'),
(2, 1, '2024-12-06', '10:00', '11:00', 'Fisioterapia', false, 'Sala 01');

-- Eventos para 07/12/2024
INSERT INTO agendamentos (id_aluno, id_funcionario, data_agendamento, hora_inicio, hora_fim, tipo_atendimento, cancelado, sala)
VALUES 
(3, 3, '2024-12-07', '08:00', '09:00', 'Psicologia', false, 'Sala 03'),
(5, 2, '2024-12-07', '09:30', '10:30', 'Nutrição', false, 'Sala 04'),
(7, 1, '2024-12-07', '11:00', '12:30', 'Fisioterapia', false, 'Sala 01');

INSERT INTO login (nome, usuario, senha)
VALUES
('Administrador', 'admin', 'admin123'),
('João Silva', 'joaos', 'senha123'),
('Maria Oliveira', 'mariao', 'senha123');

INSERT INTO especialidades (nome_especialidade)
VALUES
('Psicologia Infantil'),
('Terapia Ocupacional'),
('Fonoaudiologia'),
('Nutrição'),
('Fisioterapia');