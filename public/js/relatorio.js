// Seleção de elementos
const reportForm = document.getElementById('reportForm');
const reportList = document.getElementById('reportList');

// Carregar relatórios salvos
function loadReports() {
  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  renderReports(reports);
}

// Renderizar relatórios
function renderReports(reports) {
  reportList.innerHTML = '';
  reports.forEach((report, index) => {
    const reportItem = document.createElement('div');
    reportItem.classList.add('report-item');

    reportItem.innerHTML = `
      <h3>${report.title}</h3>
      <p>${report.description}</p>
      <p><strong>Data:</strong> ${report.date}</p>
      <div class="actions">
        <button class="edit-btn" onclick="editReport(${index})">Editar</button>
        <button class="delete-btn" onclick="deleteReport(${index})">Excluir</button>
      </div>
    `;

    reportList.appendChild(reportItem);
  });
}

// Adicionar novo relatório
function addReport(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;

  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  reports.push({ title, description, date });
  localStorage.setItem('reports', JSON.stringify(reports));

  reportForm.reset();
  loadReports();
}

// Editar relatório
function editReport(index) {
  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  const report = reports[index];

  document.getElementById('title').value = report.title;
  document.getElementById('description').value = report.description;
  document.getElementById('date').value = report.date;

  deleteReport(index);
}

// Excluir relatório
function deleteReport(index) {
  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  reports.splice(index, 1);
  localStorage.setItem('reports', JSON.stringify(reports));
  loadReports();
}

// Evento de submissão do formulário
reportForm.addEventListener('submit', addReport);

// Inicializar página
loadReports();
