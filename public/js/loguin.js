document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
  
    // Cadastro de usuário
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const userData = {
          name: document.getElementById('name').value,
          cpfCnpj: document.getElementById('cpfCnpj').value,
          address: document.getElementById('address').value,
          phone: document.getElementById('phone').value,
          rg: document.getElementById('rg').value,
          password: document.getElementById('password').value,
        };
  
        // Salva o usuário no localStorage
        localStorage.setItem(userData.cpfCnpj, JSON.stringify(userData));
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'index.html';
      });
    }
  
    // Login do usuário
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const cpfCnpj = document.getElementById('cpfCnpj').value;
        const password = document.getElementById('password').value;
  
        const storedUser = JSON.parse(localStorage.getItem(cpfCnpj));
  
        if (storedUser && storedUser.password === password) {
          alert(`Bem-vindo, ${storedUser.name}!`);
          sessionStorage.setItem('currentUser', JSON.stringify(storedUser));
          window.location.href = 'dashboard.html'; // Redireciona para o painel
        } else {
          alert('CPF/CNPJ ou senha inválidos!');
        }
      });
    }
  });
  