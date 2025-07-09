const baseUrl = 'https://simplifica-oficial-2.onrender.com';

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
            body: JSON.stringify({ data, nome, requisicao, valor, vendedor })
        });

        const json = await res.json();
        if (res.ok) {
            alert("Registrado no servidor com sucesso!");
            form.submit();
        } else {
            alert(json.erro || "Erro ao registrar no servidor");
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

formVenda.addEventListener('submit', async e => {
    e.preventDefault();

    const form = e.target;
    const vendedor = localStorage.getItem('usuarioLogado');
    form.vendedor.value = vendedor;
});

function MenuPedidos() {
    let man = document.getElementById("caixadepedidos");
    man.style.marginTop = "125%";
}
function sair() {
    let ss = document.getElementById("caixadepedidos");
    ss.style.marginTop = "-150%";
}
const btnBuscar = document.getElementById('btnBuscar');
const inputBusca = document.getElementById('busca');
const resultados = document.getElementById('resultados');

btnBuscar.addEventListener('click', async () => {
    const termo = inputBusca.value.toLowerCase();
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`${baseUrl}/buscar-vendas`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const vendas = await res.json();

        if (Array.isArray(vendas)) {
            const filtradas = vendas.filter(v =>
                v.nome.toLowerCase().includes(termo) ||
                v.produto.toLowerCase().includes(termo)
            );

            if (filtradas.length === 0) {
                resultados.innerHTML = "<p>Nenhum resultado encontrado.</p>";
                return;
            }

            resultados.innerHTML = filtradas.map(v => `
                <div style="border:1px solid #ccc; padding:10px; margin:5px; background:white;">
                    <strong>Data:</strong> ${v.data}<br>
                    <strong>Nome:</strong> ${v.nome}<br>
                    <strong>Produto:</strong> ${v.produto}<br>
                    <strong>Valor:</strong> ${v.valor}
                </div>
            `).join("");
        } else {
            resultados.innerHTML = "<p>Erro ao buscar vendas.</p>";
        }
    } catch {
        resultados.innerHTML = "<p>Erro de conexão.</p>";
    }
});
