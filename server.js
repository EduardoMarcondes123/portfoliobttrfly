require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Banco conectado! O Cofre está aberto!'))
    .catch((err) => console.log('❌ Erro no Banco:', err));

// Modelos
const Produto = mongoose.model('Produto', new mongoose.Schema({ nome: String, preco: String, imagem: String }));
const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({ titulo: String, imagem: String }));

// ==========================================
// A PORTARIA: Função que checa a senha
// ==========================================
const verificarSenha = (req, res, next) => {
    const senhaRecebida = req.headers['x-senha-admin'];
    const senhaCorreta = process.env.SENHA_ADMIN; // Puxa a senha lá do Render

    if (senhaRecebida === senhaCorreta) {
        next(); // Senha certa! Pode entrar.
    } else {
        res.status(401).json({ erro: "❌ Acesso Negado: Senha incorreta!" });
    }
};

// ==========================================
// ROTAS PÚBLICAS (Qualquer um pode ver as fotos)
// ==========================================
app.get('/api/produtos', async (req, res) => {
    try { res.json(await Produto.find()); } 
    catch (error) { res.status(500).json({ erro: "Erro" }); }
});

app.get('/api/portfolio', async (req, res) => {
    try { res.json(await Portfolio.find()); } 
    catch (error) { res.status(500).json({ erro: "Erro" }); }
});

// ==========================================
// ROTAS PROTEGIDAS (Só entra com a senha!)
// Note que adicionamos o 'verificarSenha' no meio delas
// ==========================================
app.post('/api/produtos', verificarSenha, async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        res.status(201).json({ mensagem: "Salvo!" });
    } catch (error) { res.status(500).json({ erro: "Erro" }); }
});

app.delete('/api/produtos/:id', verificarSenha, async (req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id);
        res.json({ mensagem: "Excluído!" });
    } catch (error) { res.status(500).json({ erro: "Erro" }); }
});

app.post('/api/portfolio', verificarSenha, async (req, res) => {
    try {
        const novaArte = new Portfolio(req.body);
        await novaArte.save();
        res.status(201).json({ mensagem: "Salvo!" });
    } catch (error) { res.status(500).json({ erro: "Erro" }); }
});

app.delete('/api/portfolio/:id', verificarSenha, async (req, res) => {
    try {
        await Portfolio.findByIdAndDelete(req.params.id);
        res.json({ mensagem: "Excluído!" });
    } catch (error) { res.status(500).json({ erro: "Erro" }); }
});

const PORTA = 3000;
app.listen(PORTA, () => console.log(`🚀 Servidor rodando na porta ${PORTA} com Segurança Ativada!`));