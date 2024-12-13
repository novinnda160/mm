// Funções de LocalStorage
const fetchData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Atualiza dropdowns com clientes e motoboys
const updateDropdowns = () => {
  const clientes = fetchData('clientes');
  const motoboys = fetchData('motoboys');

  const clienteDropdown = document.getElementById('corrida-cliente');
  const motoboyDropdown = document.getElementById('corrida-motoboy');

  clienteDropdown.innerHTML = '';
  motoboyDropdown.innerHTML = '';

  clientes.forEach(cliente => {
    const option = document.createElement('option');
    option.value = cliente.id;
    option.textContent = cliente.nome;
    clienteDropdown.appendChild(option);
  });

  motoboys.forEach(motoboy => {
    const option = document.createElement('option');
    option.value = motoboy.id;
    option.textContent = motoboy.nome;
    motoboyDropdown.appendChild(option);
  });
};

// Atualiza listas de itens
const updateLists = () => {
  const clientes = fetchData('clientes');
  const motoboys = fetchData('motoboys');
  const corridas = fetchData('corridas');

  const clientesLista = document.getElementById('clientes-lista');
  const motoboysLista = document.getElementById('motoboys-lista');
  const corridasLista = document.getElementById('corridas-lista');

  clientesLista.innerHTML = clientes.map(cliente => `<li>${cliente.nome}</li>`).join('');
  motoboysLista.innerHTML = motoboys.map(motoboy => `<li>${motoboy.nome}</li>`).join('');
  corridasLista.innerHTML = corridas.map(corrida => `<li>Cliente: ${corrida.clienteId}, Motoboy: ${corrida.motoboyId}</li>`).join('');

  updateDropdowns();
};

// Função para atualizar o dashboard
const updateDashboard = () => {
  const clientes = fetchData('clientes').length;
  const motoboys = fetchData('motoboys').length;
  const corridas = fetchData('corridas').length;

  document.querySelector('#clientes-ativos p').innerText = clientes;
  document.querySelector('#motoristas-ativos p').innerText = motoboys;
  document.querySelector('#corridas-realizadas p').innerText = corridas;
};

// CRUD para Clientes
document.getElementById('cliente-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('cliente-nome').value;
  const cpf = document.getElementById('cliente-cpf').value;

  const clientes = fetchData('clientes');
  clientes.push({ id: Date.now(), nome, cpf });
  saveData('clientes', clientes);

  updateLists();
  updateDashboard();
});

// CRUD para Motoboys
document.getElementById('motoboy-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('motoboy-nome').value;
  const telefone = document.getElementById('motoboy-telefone').value;

  const motoboys = fetchData('motoboys');
  motoboys.push({ id: Date.now(), nome, telefone });
  saveData('motoboys', motoboys);

  updateLists();
  updateDashboard();
});

// CRUD para Corridas
document.getElementById('corrida-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const clienteId = document.getElementById('corrida-cliente').value;
  const motoboyId = document.getElementById('corrida-motoboy').value;

  const corridas = fetchData('corridas');
  corridas.push({ id: Date.now(), clienteId, motoboyId });
  saveData('corridas', corridas);

  updateLists();
  updateDashboard();
});

// Inicializa o sistema
updateLists();
updateDashboard();
