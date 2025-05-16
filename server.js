const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const PORT = 3000;

// Middleware essencial
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rota de login modificada
app.post('/login', async (req, res) => {
    try {
        const { cpf, senha, tipoAcesso } = req.body;
        const data = await fs.readFile(path.join(__dirname, 'db', 'db.json'));
        const db = JSON.parse(data);

        const usuario = db.usuarios.find(user => 
            user.cpf === cpf && user.senha === senha && user.tipo === tipoAcesso
        );

        if (!usuario) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciais inválidas' 
            });
        }

        res.json({ 
            success: true,
            redirect: `/${usuario.tipo}.html`,
            nome: usuario.nome
        });

    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno no servidor' 
        });
    }
});

// Rotas para páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/gestor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gestor.html'));
});

app.get('/funcionario.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'funcionario.html'));
});

// Inicia servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
