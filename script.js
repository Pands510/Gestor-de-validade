let calendar; // Variável global para armazenar a instância do calendário

// Inicializa o calendário assim que o documento terminar de carregar
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br', // Configura o calendário para português
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        // Busca eventos salvos no LocalStorage ou inicia vazio se não houver
        events: JSON.parse(localStorage.getItem('vencimentos')) || []
    });
    
    calendar.render(); // Desenha o calendário na tela
    atualizarLista(); // Atualiza a barra lateral com os itens salvos
});

function definirCor(dataValidade) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas os dias
    const validade = new Date(dataValidade);
    validade.setHours(0, 0, 0, 0);

    const diferencaDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

    if (diferencaDias < 0) {
        return "#e74c3c"; // Vermelho: Vencido
    } else if (diferencaDias <= 7) {
        return "#f1c40f"; // Amarelo: Vence em até 7 dias
    } else {
        return "#2ecc71"; // Verde: Seguro (mais de 7 dias)
    }
}

// Função para salvar um novo produto
function salvarProduto() {
    const nome = document.getElementById('produto').value;
    const data = document.getElementById('validade').value;

    // Validação simples para evitar campos vazios
    if (!nome || !data) return alert("Preencha todos os campos!");

    //Cor gerada automaticamente com base na data selecionada
    const corAutomatica = definirCor(data);

    const novoEvento = { 
        title: nome,
        start: data, 
        color: corAutomatica 
    };

    // Recupera a lista atual, adiciona o novo e salva de volta no LocalStorage
    let eventos = JSON.parse(localStorage.getItem('vencimentos')) || [];
    eventos.push(novoEvento);
    localStorage.setItem('vencimentos', JSON.stringify(eventos));

    calendar.addEvent(novoEvento); // Adiciona ao calendário sem recarregar a página
    atualizarLista(); // Atualiza a listagem lateral

    // Limpa os campos após salvar
    document.getElementById('produto').value = '';
    document.getElementById('validade').value = '';
}

// Gera o HTML da lista de produtos na barra lateral
function atualizarLista() {
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = ''; // Limpa a lista atual para reconstruí-la
    let eventos = JSON.parse(localStorage.getItem('vencimentos')) || [];

    eventos.forEach((evento, index) => {
        // Recalcula a cor caso o usuário abra o app em dias diferentes
        const corAtualizada = definirCor(evento.start);

        const item = document.createElement('div');
        item.className = 'produto-item';
        // O data-index é usado para identificar qual item será removido depois
        item.innerHTML = `
            <input type="checkbox" class="produto-check" data-index="${index}">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${evento.color}"></span>
            <small><strong>${evento.title}</strong> - ${evento.start}</small>
        `;
        lista.appendChild(item);
    });
}

// Remove os itens que estiverem com o checkbox marcado
function removerSelecionados() {
    let eventos = JSON.parse(localStorage.getItem('vencimentos')) || [];
    const checkboxes = document.querySelectorAll('.produto-check');
    
    // Filtra a lista mantendo apenas os itens que NÃO estão marcados
    let novosEventos = eventos.filter((_, index) => {
        const cb = document.querySelector(`.produto-check[data-index="${index}"]`);
        return !cb.checked;
    });

    // Atualiza o armazenamento local e reinicia o calendário com a nova lista
    localStorage.setItem('vencimentos', JSON.stringify(novosEventos));
    
    calendar.removeAllEvents();
    novosEventos.forEach(e => calendar.addEvent(e));
    
    atualizarLista();
}

// Selecionar todos os checkboxes de uma vez
function selecionarTodos(status) {
    document.querySelectorAll('.produto-check').forEach(cb => cb.checked = status);
}

// Função para recolher ou expandir a lista lateral
function toggleLista() {
    const lista = document.getElementById('lista-produtos');
    const btn = document.getElementById('btn-toggle');
    const isHidden = lista.style.display === "none";
    
    lista.style.display = isHidden ? "block" : "none";
    btn.innerText = isHidden ? "Ocultar" : "Ver";
}