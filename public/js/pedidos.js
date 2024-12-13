document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([-23.5505, -46.6333], 13); // São Paulo
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  
    document.getElementById("calcular").addEventListener("click", () => {
      const enderecoColeta = document.getElementById("endereco-coleta").value;
      const enderecoDestino = document.getElementById("endereco-destino").value;
  
      if (enderecoColeta && enderecoDestino) {
        // Simula distância e cálculo de entrega
        const distancia = Math.random() * 15 + 1; // 1-15 km
        const valor = (distancia * 1.5).toFixed(2); // R$1,50/km
  
        document.getElementById("distancia").value = distancia.toFixed(2) + " km";
        document.getElementById("valor").value = "R$ " + valor;
      } else {
        alert("Preencha os endereços para calcular.");
      }
    });
  
    document.getElementById("solicitar").addEventListener("click", () => {
      const pedido = {
        nome: document.getElementById("nome").value,
        cpfCnpj: document.getElementById("cpf-cnpj").value,
        enderecoColeta: document.getElementById("endereco-coleta").value,
        enderecoDestino: document.getElementById("endereco-destino").value,
        distancia: document.getElementById("distancia").value,
        valor: document.getElementById("valor").value,
      };
  
      if (pedido.nome && pedido.cpfCnpj && pedido.enderecoColeta && pedido.enderecoDestino) {
        // Armazena pedido no LocalStorage
        const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
        pedidos.push(pedido);
        localStorage.setItem("pedidos", JSON.stringify(pedidos));
  
        alert("Pedido enviado com sucesso!");
      } else {
        alert("Preencha todos os campos obrigatórios!");
      }
    });
  });
  