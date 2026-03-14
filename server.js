require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
// Permite receber fotos convertidas em texto de até 10MB
app.use(express.json({ limit: '10mb' }));

// Conectando no MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Banco de Dados conectado! O Cofre está aberto! 🦋'))
    .catch((err) => console.log('❌ Erro ao conectar no Banco:', err));

// ==========================================
// 1. MODELOS (As gavetas do cofre)
// ==========================================

// Gaveta da Lojinha
const Produto = mongoose.model('Produto', new mongoose.Schema({
    nome: String,
    preco: String,
    imagem: String
}));

// Gaveta do Portfólio (Só precisa do título da arte e da imagem)
const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({
    titulo: String,
    imagem: String
}));

// ==========================================
// 2. ROTAS DA LOJINHA (PRODUTOS)
// ==========================================
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (error) { res.status(500).json({ erro: "Erro ao buscar produtos" }); }
});

app.post('/api/produtos', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        res.status(201).json({ mensagem: "Produto salvo com sucesso! 🦋", produto: novoProduto });
    } catch (error) { res.status(500).json({ erro: "Erro ao salvar o produto" }); }
});

app.delete('/api/produtos/:id', async (req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id);
        res.json({ mensagem: "Produto excluído com sucesso! 🗑️" });
    } catch (error) { res.status(500).json({ erro: "Erro ao excluir o produto" }); }
});

// ==========================================
// 3. ROTAS DO PORTFÓLIO (NOVO!)
// ==========================================
app.get('/api/portfolio', async (req, res) => {
    try {
        const artes = await Portfolio.find();
        res.json(artes);
    } catch (error) { res.status(500).json({ erro: "Erro ao buscar portfólio" }); }
});

app.post('/api/portfolio', async (req, res) => {
    try {
        const novaArte = new Portfolio(req.body);
        await novaArte.save();
        res.status(201).json({ mensagem: "Arte salva no portfólio! 🎨", arte: novaArte });
    } catch (error) { res.status(500).json({ erro: "Erro ao salvar a arte" }); }
});

app.delete('/api/portfolio/:id', async (req, res) => {
    try {
        await Portfolio.findByIdAndDelete(req.params.id);
        res.json({ mensagem: "Arte excluída do portfólio! 🗑️" });
    } catch (error) { res.status(500).json({ erro: "Erro ao excluir a arte" }); }
});

// ==========================================
// LIGANDO O MOTOR
// ==========================================
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Foguete não tem ré! Servidor rodando na porta ${PORTA}`);
});