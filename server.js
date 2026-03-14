require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Conectando no MongoDB usando a senha que está escondida no .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Banco de Dados conectado! O Cofre está aberto! 🦋'))
    .catch((err) => console.log('❌ Erro ao conectar no Banco:', err));

// Criando a regra de como um Produto deve ser salvo
const Produto = mongoose.model('Produto', new mongoose.Schema({
    nome: String,
    preco: String,
    imagem: String
}));

// ==========================================
// ROTAS DA API
// ==========================================

// Rota para MOSTRAR os produtos (Lê do banco e manda pro site)
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find(); // Puxa tudo do banco
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
});

// Rota para ADICIONAR um novo produto (Vem do painel e salva no banco)
app.post('/api/produtos', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body); // Pega os dados que vieram do formulário
        await novoProduto.save(); // Salva no Cofre (MongoDB)
        res.status(201).json({ mensagem: "Produto salvo com sucesso! 🦋", produto: novoProduto });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao salvar o produto" });
    }
});

// Rota para EXCLUIR um produto (Deleta do banco de dados)
app.delete('/api/produtos/:id', async (req, res) => {
    try {
        const idDoProduto = req.params.id;
        await Produto.findByIdAndDelete(idDoProduto); // Procura pelo ID e apaga
        res.json({ mensagem: "Produto excluído com sucesso! 🗑️" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao excluir o produto" });
    }
});

// ==========================================
// LIGANDO O MOTOR
// ==========================================
const PORTA = 3000; // O Render pode mudar isso automaticamente depois
app.listen(PORTA, () => {
    console.log(`🚀 Foguete não tem ré! Servidor rodando na porta ${PORTA}`);
});