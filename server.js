import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);
const db = new PouchDB('http://localhost:5984/mydatabase'); // Conectando ao CouchDB

const app = express();
const PORT = 3000;
const JWT_SECRET = 'secreta_chave_para_token';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

const autenticarJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token não fornecido.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });
    req.user = decoded;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { name, cpfCnpj, address, phone, rg, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    await db.put({ _id: `user:${cpfCnpj}`, name, cpfCnpj, address, phone, rg, password: hashedPassword });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

app.post('/login', async (req, res) => {
  const { cpfCnpj, password } = req.body;

  try {
    const userDoc = await db.get(`user:${cpfCnpj}`);
    if (!bcrypt.compareSync(password, userDoc.password)) return res.status(401).json({ error: 'Senha inválida' });

    const accessToken = jwt.sign({ userId: cpfCnpj }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login realizado com sucesso!', accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Usuário não encontrado' });
  }
});

app.post('/api/pedidos', autenticarJWT, async (req, res) => {
  const pedido = { ...req.body, status: 'Pedido Aceito', createdAt: new Date() };

  try {
    const response = await db.post(pedido);
    res.status(201).json({ message: 'Pedido criado com sucesso!', id: response.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

app.get('/api/pedidos', autenticarJWT, async (req, res) => {
  try {
    const result = await db.find({ selector: { status: { $exists: true } } });
    res.status(200).json(result.docs);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

app.put('/api/pedidos/:id', autenticarJWT, async (req, res) => {
  const { id } = req.params;
  const { status, lat, lng } = req.body;

  try {
    const pedido = await db.get(id);
    pedido.status = status;
    if (lat && lng) {
      pedido.lat = lat;
      pedido.lng = lng;
    }
    await db.put(pedido);
    res.status(200).json({ message: 'Pedido atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

app.get('/api/pedidos/:id', autenticarJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await db.get(id);
    res.status(200).json(pedido);
  } catch (error) {
    res.status(404).json({ message: 'Pedido não encontrado' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
