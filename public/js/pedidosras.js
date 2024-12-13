
  const pedidos = []; // Array para armazenar pedidos temporariamente

  // Função para enviar pedido para o backend
  document.getElementById('solicitar-entrega').addEventListener('click', () => {
    const solicitante = document.getElementById('solicitante').value;
    const cpfCnpj = document.getElementById('cpf-cnpj').value;
    const distancia = document.getElementById('distancia').value;
    const valor = document.getElementById('valor').value;

    if (!solicitante || !cpfCnpj || !distancia || !valor) {
      alert("Preencha todos os campos!");
      return;
    }

    fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solicitante, cpfCnpj, distancia, valor })
    }).then(() => {
      alert("Pedido solicitado com sucesso!");
    }).catch(() => {
      alert("Erro ao solicitar o pedido.");
    });
  });

  // Função para buscar pedidos em tempo real
  async function fetchPedidos() {
    try {
      const response = await fetch('/api/pedidos');
      const pedidos = await response.json();
      console.log("Pedidos em tempo real:", pedidos);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    }
    setTimeout(fetchPedidos, 5000); // Long Polling
  }

  fetchPedidos();

  // Função para rastrear pedidos em tempo real
  async function rastrearPedido() {
    const response = await fetch('/api/rastreio');
    const pedido = await response.json();

    // Atualize o mapa com as informações do pedido
    if (pedido) {
      const { solicitante, distancia, valor, enderecoColeta, enderecoDestino } = pedido;
      alert(`Pedido: ${solicitante}, Distância: ${distancia}, Valor: ${valor}, Coleta: ${enderecoColeta}, Destino: ${enderecoDestino}`);
    }
  }

  setInterval(rastrearPedido, 5000); // Long Polling de rastreio

