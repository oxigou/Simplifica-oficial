const baseUrl = 'https://simplifica-oficial-5.onrender.com';

const formLogin = document.getElementById('formLogin');
const formVenda = document.getElementById('formVenda');
const loginArea = document.getElementById('login-area');
const appArea = document.getElementById('app-area');
const btnLogout = document.getElementById('btnLogout');

(async () => {
    const token = localStorage.getItem('token');
    if (token) {
        loginArea.style.display = 'none';
        appArea.style.display = 'block';
        const usuario = localStorage.getItem('usuarioLogado');
        document.getElementById('df').value = usuario;
    }
})();

formLogin.addEventListener('submit', async e => {
    e.preventDefault();

    const nome = document.getElementById('loginNome').value;
    const senha = document.getElementById('loginSenha').value;

    try {
        const res = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, senha })
        });

        const data = await res.json();

        if (res.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuarioLogado', nome);
            loginArea.style.display = 'none';
            appArea.style.display = 'block';
            document.getElementById('df').value = nome;
        } else {
            alert(data.erro || 'Usuário ou senha incorretos');
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor');
    }
});

formVenda.addEventListener('submit', async e => {
    e.preventDefault();

    const form = e.target;
    const data = form.data.value;
    const nome = form.nome.value;
    const produto = form.produto.value;
    const valor = form.valor.value;
    const vendedor = localStorage.getItem('usuarioLogado');
    form.vendedor.value = vendedor;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${baseUrl}/registrar-venda`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ data, nome, produto, valor, vendedor })
        });

        const json = await res.json();
        if (res.ok) {
            alert("Venda registrada com sucesso!");
        } else {
            alert(json.erro || "Erro ao registrar a venda");
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor");
    }
});

btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    loginArea.style.display = 'block';
    appArea.style.display = 'none';
});
