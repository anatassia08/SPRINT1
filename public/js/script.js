document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const mensagemErro = document.getElementById('mensagemErro');

    // Configura dropdown
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('tipoAcessoSelecionado').value = e.target.dataset.value;
            document.getElementById('dropdownMenuButton').textContent = e.target.textContent;
            mensagemErro.classList.add('d-none');
        });
    });

    // Submissão do formulário
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        const senha = document.getElementById('senha').value;
        const tipoAcesso = document.getElementById('tipoAcessoSelecionado').value;

        // Validação básica
        if (!cpf || !senha || !tipoAcesso) {
            mostrarErro('Preencha todos os campos!');
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, senha, tipoAcesso })
            });

            const data = await response.json();
            
            if (data.success) {
                sessionStorage.setItem('usuarioNome', data.nome);
                window.location.href = data.redirect;
            } else {
                mostrarErro(data.message || 'Credenciais inválidas');
            }
        } catch (error) {
            mostrarErro('Erro ao conectar com o servidor');
        }
    });

    function mostrarErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.classList.remove('d-none');
    }
});