// Função para carregar e exibir os clientes cadastrados
function renderClients() {
  const clientsList = document.getElementById('clientsList');
  clientsList.innerHTML = ''; // Limpa a lista antes de renderizar

  const clients = JSON.parse(localStorage.getItem('clientes')) || []; // Obtém os clientes do localStorage

  clients.forEach((client, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.cpf}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>
        <button onclick="viewClient(${index})">Ver</button>
        <button onclick="deleteClient(${index})">Excluir</button>
      </td>
    `;

    clientsList.appendChild(row);
  });
}

// Função para cadastrar um novo cliente
document.getElementById('clientForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio do formulário

  const name = document.getElementById('name').value;
  const cpf = document.getElementById('cpf').value;
  const address = document.getElementById('address').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  const newClient = { name, cpf, address, email, phone };

  const clients = JSON.parse(localStorage.getItem('clientes')) || [];
  clients.push(newClient); // Adiciona o novo cliente ao array
  localStorage.setItem('clientes', JSON.stringify(clients)); // Atualiza o localStorage

  renderClients(); // Re-renderiza a lista de clientes
  document.getElementById('clientForm').reset(); // Limpa o formulário após o cadastro
});

// Função para visualizar os dados de um cliente
function viewClient(index) {
  const clients = JSON.parse(localStorage.getItem('clientes')) || [];
  const client = clients[index];

  alert(`
    Nome: ${client.name}
    CPF: ${client.cpf}
    Endereço: ${client.address}
    Email: ${client.email}
    Telefone: ${client.phone}
  `);
}

// Função para excluir um cliente
function deleteClient(index) {
  const clients = JSON.parse(localStorage.getItem('clientes')) || [];
  clients.splice(index, 1); // Remove o cliente do array

  localStorage.setItem('clientes', JSON.stringify(clients)); // Atualiza o localStorage
  renderClients(); // Re-renderiza a lista de clientes
}

// Carrega a lista de clientes ao carregar a página
document.addEventListener('DOMContentLoaded', renderClients);
