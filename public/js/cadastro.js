const registerForm = document.getElementById('registerForm');

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

    // Obtém os usuários salvos no localStorage (ou cria um array vazio)
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verifica se o CPF/CNPJ já existe
    if (users.some((user) => user.cpfCnpj === userData.cpfCnpj)) {
      alert('CPF/CNPJ já cadastrado.');
      return;
    }

    // Salva o novo usuário
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Usuário cadastrado com sucesso!');
    registerForm.reset();
  });
}
