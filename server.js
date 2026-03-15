require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit'); 
const jwt = require('jsonwebtoken'); 

const app = express();

app.use(helmet());

const corsOptions = {
    origin: ['https://portfoliobttrfly.vercel.app', 'http://127.0.0.1:5500'], 
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Muitas tentativas vindas deste IP. Tente novamente em 15 minutos."
});
app.use('/api/', limiter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Banco conectado e Blindado!'))
    .catch((err) => console.log('❌ Erro no Banco:', err));

const Sessao = mongoose.model('Sessao', new mongoose.Schema({ nome: String }));
const Produto = mongoose.model('Produto', new mongoose.Schema({ nome: String, preco: String, imagem: String, sessao: String }));
const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({ titulo: String, imagem: String }));

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

app.post('/api/login', (req, res) => {
    const { senha } = req.body;
    if (senha === process.env.SENHA_ADMIN) {
        const token = jwt.sign({ admin: true }, process.env.SENHA_ADMIN, { expiresIn: '2h' });
        res.json({ token });
    } else {
        res.status(401).json({ erro: "Senha incorreta!" });
    }
});

// ROTAS PÚBLICAS
app.get('/api/sessoes', async (req, res) => { res.json(await Sessao.find()); });
app.get('/api/produtos', async (req, res) => { res.json(await Produto.find()); });
app.get('/api/portfolio', async (req, res) => { res.json(await Portfolio.find()); });

// ROTAS PROTEGIDAS (SESSÕES)
app.post('/api/sessoes', verificarToken, async (req, res) => {
    const novaSessao = new Sessao(req.body);
    await novaSessao.save();
    res.status(201).json({ mensagem: "Sessão criada!" });
});

app.delete('/api/sessoes/:id', verificarToken, async (req, res) => {
    const sessao = await Sessao.findById(req.params.id);
    if(sessao) {
        await Produto.deleteMany({ sessao: sessao.nome });
        await Sessao.findByIdAndDelete(req.params.id);
    }
    res.json({ mensagem: "Sessão e produtos excluídos!" });
});

// ROTAS PROTEGIDAS (PRODUTOS)
app.post('/api/produtos', verificarToken, async (req, res) => {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json({ mensagem: "Salvo!" });
});

// ROTA ATUALIZADA: AGORA EDITA TUDO (NOME, PREÇO E SESSÃO)
app.put('/api/produtos/:id', verificarToken, async (req, res) => {
    const { nome, preco, sessao } = req.body;
    await Produto.findByIdAndUpdate(req.params.id, { nome, preco, sessao });
    res.json({ mensagem: "Produto atualizado com sucesso!" });
});

app.delete('/api/produtos/:id', verificarToken, async (req, res) => {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Excluído!" });
});

// ROTAS PROTEGIDAS (PORTFÓLIO)
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

// Pega o input onde ela digita a senha
const inputSenha = document.getElementById("senha-admin"); 

inputSenha.addEventListener("keypress", function(evento) {
    // Verifica se a tecla apertada foi o Enter
    if (evento.key === "Enter") {
        evento.preventDefault(); // Evita que a página recarregue do nada
        document.getElementById("btn-entrar").click(); // "Clica" no botão de login automaticamente
    }
});