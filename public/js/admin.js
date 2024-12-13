// Funções de manipulação do LocalStorage
const fetchData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Atualiza estatísticas no dashboard
const updateStats = () => {
  const clientes = fetchData('clientes');
  const entregas = fetchData('entregas');
  const lucro = entregas.reduce((acc, entrega) => acc + entrega.valor, 0);

  // Atualiza elementos do DOM
  document.querySelector('#clientes-ativos p').innerText = clientes.length;
  document.querySelector('#lucro-mensal p').innerText = `R$ ${lucro.toFixed(2)}`;
  document.querySelector('#entregas-realizadas p').innerText = entregas.length;
};

// Função de long polling para atualizações em tempo real
const longPolling = async () => {
  try {
    const response = await fetch('/api/updates'); // URL do servidor para polling
    if (!response.ok) throw new Error('Erro ao buscar atualizações.');

    const updates = await response.json();
    if (updates) {
      saveData('clientes', updates.clientes);
      saveData('entregas', updates.entregas);
      updateStats();
    }
  } catch (err) {
    console.error('Erro no long polling:', err);
  } finally {
    setTimeout(longPolling, 5000); // Repetição a cada 5 segundos
  }
};

// Inicializa o dashboard
const initDashboard = () => {
  updateStats();
  longPolling();
};

// Chama a função inicial
initDashboard();
