const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cpfCnpj = document.getElementById('cpfCnpj').value;
    const password = document.getElementById('password').value;

    // Obtém os usuários salvos no localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Procura o usuário correspondente
    const user = users.find(
      (u) => u.cpfCnpj === cpfCnpj && u.password === password
    );

    if (user) {
      // Salva o usuário logado no localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));

      alert('Login realizado com sucesso!');
      window.location.href = 'home.html'; // Redireciona para a home
    } else {
      alert('CPF/CNPJ ou senha incorretos.');
    }
  });
}
