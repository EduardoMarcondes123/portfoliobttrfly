require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet'); // 🪖 Capacete contra ataques de cabeçalho
const rateLimit = require('express-rate-limit'); // 🛡️ Barreira contra robôs que chutam senha
const jwt = require('jsonwebtoken'); // 🪪 O Crachá Eletrônico

const app = express();

// 1. HELMET: Esconde informações do servidor e previne ataques comuns
app.use(helmet());

// 2. CORS RESTRITO: Só aceita ordens vindas do SEU site (Ajuste a URL abaixo!)
const corsOptions = {
    origin: ['https://portfoliobttrfly.vercel.app', 'http://127.0.0.1:5500'], // Adicione sua URL da Vercel aqui
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// 3. RATE LIMIT: Máximo de 100 requisições a cada 15 min por pessoa
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Muitas tentativas vindas deste IP. Tente novamente em 15 minutos."
});
app.use('/api/', limiter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Banco conectado e Blindado!'))
    .catch((err) => console.log('❌ Erro no Banco:', err));

const Produto = mongoose.model('Produto', new mongoose.Schema({ nome: String, preco: String, imagem: String }));
const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({ titulo: String, imagem: String }));

// 4. MIDDLEWARE DE VERIFICAÇÃO DE TOKEN (O segurança que checa o crachá)
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ erro: "Acesso negado: Sem crachá!" });

    try {
        const verificado = jwt.verify(token.replace('Bearer ', ''), process.env.SENHA_ADMIN);
        req.user = verificado;
        next();
    } catch (err) {
        res.status(401).json({ erro: "Crachá inválido ou expirado!" });
    }
};

// ==========================================
// ROTA DE LOGIN (Gera o Crachá JWT)
// ==========================================
app.post('/api/login', (req, res) => {
    const { senha } = req.body;
    if (senha === process.env.SENHA_ADMIN) {
        // Gera um token que dura 2 horas
        const token = jwt.sign({ admin: true }, process.env.SENHA_ADMIN, { expiresIn: '2h' });
        res.json({ token });
    } else {
        res.status(401).json({ erro: "Senha incorreta!" });
    }
});

// ROTAS PÚBLICAS
app.get('/api/produtos', async (req, res) => { res.json(await Produto.find()); });
app.get('/api/portfolio', async (req, res) => { res.json(await Portfolio.find()); });

// ROTAS PROTEGIDAS PELO TOKEN
app.post('/api/produtos', verificarToken, async (req, res) => {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json({ mensagem: "Salvo!" });
});

app.delete('/api/produtos/:id', verificarToken, async (req, res) => {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Excluído!" });
});

// ... Repita o mesmo padrão (adicionando 'verificarToken') para as rotas de Portfolio ...
app.post('/api/portfolio', verificarToken, async (req, res) => {
    const novaArte = new Portfolio(req.body);
    await novaArte.save();
    res.status(201).json({ mensagem: "Salvo!" });
});

app.delete('/api/portfolio/:id', verificarToken, async (req, res) => {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Excluído!" });
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`🚀 Sistema Full-Blindado rodando!`));