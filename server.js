import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const mongoUri = process.env.MONGO_URI;

app.use(cors({
    origin: 'https://oxigou.github.io',
    credentials: true
}));
app.options('*', cors());


app.use(bodyParser.json());

mongoose.connect(mongoUri)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

const UsuarioSchema = new mongoose.Schema({
    nome: String,
    senha: String
}, { collection: 'senhas e logins' });

const Usuario = mongoose.model('Usuario', UsuarioSchema);

const VendasTotaisSchema = new mongoose.Schema({
    data: String,
    nome: String,
    requisicao: String,
    valor: String,
    vendedor: String
}, { collection: 'vendas totais' });

const VendasTotais = mongoose.model('vendas totais', VendasTotaisSchema);

function verificarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ erro: 'Token inválido' });
        req.usuario = decoded;
        next();
    });
}

app.post('/login', async (req, res) => {
    const { nome, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ nome: { $regex: new RegExp(`^${nome}$`, 'i') } });
        if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
        if (usuario.senha !== senha) return res.status(401).json({ erro: "Senha incorreta" });

        const token = jwt.sign({ nome: usuario.nome }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

app.post('/registrar-venda', verificarToken, async (req, res) => {
    const { data, nome, requisicao, valor, vendedor } = req.body;

    if (!data || !nome || !requisicao || !valor || !vendedor) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    try {
        const novaVenda = new VendasTotais({ data, nome, requisicao, valor, vendedor });
        await novaVenda.save();
        res.json({ sucesso: true, mensagem: "Venda registrada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao registrar venda" });
    }
});

app.get('/buscar-vendas', verificarToken, async (req, res) => {
    const vendedor = req.usuario.nome;

    try {
        const vendas = await VendasTotais.find({ vendedor }).sort({ data: -1 });
        res.json(vendas);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar vendas" });
    }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
