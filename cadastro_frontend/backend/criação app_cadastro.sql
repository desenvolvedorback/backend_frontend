CREATE DATABASE IF NOT EXISTS app_cadastro;
USE app_cadastro;

CREATE TABLE IF NOT EXISTS pessoas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dados iniciais para demonstração
INSERT INTO pessoas (nome, email, telefone, ativo) VALUES 
('Ana Souza', 'ana.souza@email.com', '(14) 99888-1111', TRUE),
('Carlos Lima', 'carlos.lima@email.com', '(14) 99777-2222', TRUE),
('Mariana Rios', 'mariana.rios@email.com', '(14) 99666-3333', FALSE);