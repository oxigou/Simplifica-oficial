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
        // Envia para seu backend primeiro
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
            alert("Registrado no servidor com sucesso!");

            // Agora envia para o Google Sheets (submit do formulário normal)
            form.submit();
        } else {
            alert(json.erro || "Erro ao registrar no servidor");
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor");
    }
});
