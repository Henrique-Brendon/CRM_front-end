document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  const dados = {
    nome: usuario,
    senha: senha
  };

    fetch('https://usuario-login.onrender.com/usuario/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    })

    .then(response => {
      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }
      return response.text();
    })
    .then(data => {
      console.log('Login realizado:', data);
      alert(data);

      window.location.href = 'pagina-principal.html';
    })
    .catch(error => {
      console.error('Erro ao fazer login:', error);
      alert('Erro: ' + error.message);
    });
});
