import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3000;

// Chave secreta para o JWT (armazene isso de forma segura, fora do código)
const JWT_SECRET = 'secreta_chave_para_token';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obter o caminho atual (__filename e __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Dados simulados
let clientes = [];
let entregas = [];
let lucroMensal = 0;

// Middleware de autenticação JWT
const autenticarJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    req.user = decoded; // Armazena as informações do usuário no request
    next();
  });
};

// Rotas de páginas HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/loguin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'loguin.html')));
app.get('/home', autenticarJWT, (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/admin', autenticarJWT, (req, res) => res.sendFile(path.join(__dirname, 'public', 'adm.html')));

// Rotas de API para clientes
app.get('/api/clientes', autenticarJWT, (req, res) => {
  const ativos = clientes.filter(cliente => cliente.ativo);
  res.json(ativos);
});

app.post('/api/clientes', autenticarJWT, (req, res) => {
  const cliente = req.body;
  cliente.id = clientes.length + 1;
  cliente.ativo = true;
  clientes.push(cliente);
  res.status(201).json(cliente);
});
//-------------------------------------------------------------

// Endpoint para pegar todos os clientes
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// Endpoint para adicionar um novo cliente
app.post('/api/clients', (req, res) => {
  const { name, cpf, address, email, phone } = req.body;
  const newClient = {
    id: clients.length + 1,
    name,
    cpf,
    address,
    email,
    phone
  };
  clients.push(newClient);
  res.status(201).json(newClient);
});

// Endpoint para excluir um cliente
app.delete('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  clients = clients.filter(client => client.id !== parseInt(id));
  res.status(204).send();
});
//--------------------------------------------------------------------------
// Rotas de API para entregas
app.get('/api/entregas', autenticarJWT, (req, res) => res.json(entregas));

app.post('/api/entregas', autenticarJWT, (req, res) => {
  const entrega = req.body;
  entrega.id = entregas.length + 1;
  entregas.push(entrega);
  lucroMensal += entrega.valor || 0;
  res.status(201).json(entrega);
});

// Rota para obter o lucro mensal
app.get('/api/lucro', autenticarJWT, (req, res) => res.json({ lucroMensal }));

// Simulação de um banco de dados de pedidos (armazena na memória)

const lerPedidosDoArquivo = () => pedidos;
const gravarPedidosNoArquivo = (pedidosAtualizados) => {
  pedidos = pedidosAtualizados;
};

// Endpoint para obter todos os pedidos
app.get('/api/pedidos', autenticarJWT, (req, res) => {
  const pedidos = lerPedidosDoArquivo();
  res.status(200).json(pedidos);
});

// Endpoint para criar um novo pedido
app.post('/api/pedidos', autenticarJWT, (req, res) => {
  const { nome, endereco, destino, data, userId, lat, lng } = req.body;

  const novoPedido = {
    id: Date.now(),
    nome,
    endereco,
    destino,
    data,
    status: 'Pedido Aceito',
    userId,
    lat,
    lng,
  };

  const pedidos = lerPedidosDoArquivo();
  pedidos.push(novoPedido);
  gravarPedidosNoArquivo(pedidos);

  res.status(201).json({ message: 'Pedido criado com sucesso!', pedido: novoPedido });
});

// Endpoint para atualizar o status de um pedido
app.put('/api/pedidos/:id', autenticarJWT, (req, res) => {
  const { id } = req.params;
  const { status, lat, lng } = req.body;

  const pedidos = lerPedidosDoArquivo();
  const pedidoIndex = pedidos.findIndex((pedido) => pedido.id === parseInt(id));

  if (pedidoIndex === -1) {
    return res.status(404).json({ message: 'Pedido não encontrado.' });
  }

  pedidos[pedidoIndex].status = status;
  if (lat && lng) {
    pedidos[pedidoIndex].lat = lat;
    pedidos[pedidoIndex].lng = lng;
  }

  gravarPedidosNoArquivo(pedidos);

  res.status(200).json({ message: 'Status e localização do pedido atualizados.', pedido: pedidos[pedidoIndex] });
});

// Endpoint para rastrear a localização de um pedido (por ID)
app.get('/api/pedidos/:id/rastrear', autenticarJWT, (req, res) => {
  const { id } = req.params;

  const pedidos = lerPedidosDoArquivo();
  const pedido = pedidos.find((pedido) => pedido.id === parseInt(id));

  if (!pedido) {
    return res.status(404).json({ message: 'Pedido não encontrado.' });
  }

  res.status(200).json({
    id: pedido.id,
    status: pedido.status,
    lat: pedido.lat,
    lng: pedido.lng,
  });
});

// Long Polling para rastreamento em tempo real
app.get('/api/pedidos/longpoll/:id', autenticarJWT, (req, res) => {
  const { id } = req.params;

  const intervalo = setInterval(() => {
    const pedidos = lerPedidosDoArquivo();
    const pedido = pedidos.find((pedido) => pedido.id === parseInt(id));

    if (pedido) {
      res.status(200).json({
        id: pedido.id,
        status: pedido.status,
        lat: pedido.lat,
        lng: pedido.lng,
      });
      clearInterval(intervalo);
    }
  }, 5000);

  req.on('close', () => clearInterval(intervalo));
});

// Simulação de um banco de dados de pedidos
let pedidosSimulados = [];

// Endpoint para receber um novo pedido
app.post('/pedido', (req, res) => {
  const { solicitante, cpfCnpj, distancia, valor } = req.body;
  const novoPedido = { solicitante, cpfCnpj, distancia, valor, status: 'Em andamento' };
  pedidosSimulados.push(novoPedido);
  res.status(201).json({ message: 'Pedido recebido com sucesso' });
});

// Endpoint para buscar pedidos em tempo real
app.get('/pedidos', (req, res) => {
  res.json(pedidosSimulados);
});

// Rotas de usuário (login e cadastro)
const users = [];

app.post('/register', (req, res) => {
  const { name, cpfCnpj, address, phone, rg, password } = req.body;

  const userExists = users.find((user) => user.cpfCnpj === cpfCnpj);

  if (userExists) {
    return res.status(400).json({ error: 'CPF/CNPJ já cadastrado.' });
  }

  const newUser = { name, cpfCnpj, address, phone, rg, password };
  users.push(newUser);

  return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

app.post('/login', (req, res) => {
  const { cpfCnpj, password } = req.body;

  const user = users.find(
    (u) => u.cpfCnpj === cpfCnpj && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'CPF/CNPJ ou senha inválidos.' });
  }

  return res.status(200).json({
    message: 'Login realizado com sucesso!',
    user: {
      name: user.name,
      cpfCnpj: user.cpfCnpj,
      address: user.address,
      phone: user.phone,
      rg: user.rg,
    },
  });
});

app.get('/user/:cpfCnpj', (req, res) => {
  const { cpfCnpj } = req.params;

  const user = users.find((u) => u.cpfCnpj === cpfCnpj);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  return res.status(200).json({ user });
});
//----------------------------------------------------------------------------------------------------

let pedidos = [];

app.post('/pedidos', (req, res) => {
  const { clientName, cpfCnpj, pickupAddress, deliveryAddress, deliveryCost } = req.body;
  const id = new Date().getTime();
  const novoPedido = { id, clientName, cpfCnpj, pickupAddress, deliveryAddress, deliveryCost, status: 'Pendente' };
  pedidos.push(novoPedido);
  res.status(201).json(novoPedido);
});

app.get('/pedidos', (req, res) => {
  res.json(pedidos);
});

app.put('/pedidos/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const pedido = pedidos.find(p => p.id == id);
  if (pedido) {
    pedido.status = status;
    res.json(pedido);
  } else {
    res.status(404).send('Pedido não encontrado');
  }
});

app.delete('/pedidos/:id', (req, res) => {
  const { id } = req.params;
  pedidos = pedidos.filter(p => p.id != id);
  res.status(204).send();
});



//-----------------------------------------------------------------------------------------------
// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
