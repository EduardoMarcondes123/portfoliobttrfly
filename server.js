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

// Rota para mostrar os produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find(); // Puxa tudo do banco
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
});

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Foguete não tem ré! Servidor rodando na porta ${PORTA}`);
});