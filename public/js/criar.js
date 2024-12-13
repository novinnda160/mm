// Função para carregar clientes do LocalStorage
function loadClients() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        alert("Nenhum usuário logado. Faça login primeiro.");
        return;
    }

    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    const clientsTableBody = document.querySelector("#clientsTable tbody");

    // Limpa a tabela antes de adicionar os clientes
    clientsTableBody.innerHTML = "";

    // Filtra os clientes associados ao usuário logado
    const userClients = clients.filter(client => client.usuario === usuarioLogado);

    // Adiciona os clientes do usuário logado à tabela
    userClients.forEach((client, index) => {
        const row = document.createElement("tr");

        const custoEntrega = parseFloat(client.custo_entrega) || 0;

        row.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.cpf}</td>
            <td>${client.endereco_entrega}</td>
            <td>${client.endereco_coleta}</td>
            <td>R$ ${custoEntrega.toFixed(2)}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-button" data-index="${index}">Editar</button>
                <button class="btn btn-danger btn-sm delete-button" data-index="${index}">Excluir</button>
            </td>
        `;

        clientsTableBody.appendChild(row);
    });
}

// Função para salvar cliente no LocalStorage
function saveClient(client) {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        alert("Nenhum usuário logado. Faça login primeiro.");
        return;
    }

    // Adiciona o identificador do usuário ao cliente
    client.usuario = usuarioLogado;

    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    clients.push(client);
    localStorage.setItem("clients", JSON.stringify(clients));
    loadClients();
}

// Função para editar cliente no LocalStorage
function editClient(index, updatedClient) {
    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    clients[index] = updatedClient;
    localStorage.setItem("clients", JSON.stringify(clients));
    loadClients();
}

// Função para excluir cliente do LocalStorage
function deleteClient(index) {
    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    clients.splice(index, 1);
    localStorage.setItem("clients", JSON.stringify(clients));
    loadClients();
}

// Adiciona evento ao botão de registrar cliente
document.getElementById("registerButton").addEventListener("click", () => {
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const enderecoEntrega = document.getElementById("enderecoEntrega").value.trim();
    const enderecoColeta = document.getElementById("enderecoColeta").value.trim();
    const custoEntrega = parseFloat(document.getElementById("custoEntrega").value);

    if (!nome || !cpf || !enderecoEntrega || !enderecoColeta || isNaN(custoEntrega)) {
        alert("Por favor, preencha todos os campos corretamente!");
        return;
    }

    const newClient = { nome, cpf, endereco_entrega: enderecoEntrega, endereco_coleta: enderecoColeta, custo_entrega: custoEntrega };

    saveClient(newClient);

    document.getElementById("registerForm").reset();
    alert("Cliente registrado com sucesso!");
});

// Adiciona eventos de editar e excluir
document.querySelector("#clientsTable").addEventListener("click", (e) => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        alert("Nenhum usuário logado. Faça login primeiro.");
        return;
    }

    if (e.target.classList.contains("edit-button")) {
        const index = e.target.dataset.index;
        const clients = JSON.parse(localStorage.getItem("clients")) || [];
        const client = clients[index];

        if (client && client.usuario === usuarioLogado) {
            document.getElementById("nome").value = client.nome;
            document.getElementById("cpf").value = client.cpf;
            document.getElementById("enderecoEntrega").value = client.endereco_entrega;
            document.getElementById("enderecoColeta").value = client.endereco_coleta;
            document.getElementById("custoEntrega").value = client.custo_entrega;

            document.getElementById("registerButton").textContent = "Salvar Alterações";

            document.getElementById("registerButton").onclick = () => {
                const updatedClient = {
                    usuario: usuarioLogado,
                    nome: document.getElementById("nome").value.trim(),
                    cpf: document.getElementById("cpf").value.trim(),
                    endereco_entrega: document.getElementById("enderecoEntrega").value.trim(),
                    endereco_coleta: document.getElementById("enderecoColeta").value.trim(),
                    custo_entrega: parseFloat(document.getElementById("custoEntrega").value),
                };

                editClient(index, updatedClient);

                document.getElementById("registerButton").textContent = "Registrar Cliente";
                document.getElementById("registerForm").reset();
                document.getElementById("registerButton").addEventListener("click", saveClient);
                alert("Cliente atualizado com sucesso!");
            };
        }
    } else if (e.target.classList.contains("delete-button")) {
        deleteClient(e.target.dataset.index);
        alert("Cliente excluído com sucesso!");
    }
});

// Carrega os clientes ao iniciar a página
document.addEventListener("DOMContentLoaded", loadClients);
