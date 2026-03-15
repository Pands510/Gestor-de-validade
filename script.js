let calendar;

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        events: JSON.parse(localStorage.getItem('vencimentos')) || []
    });
    
    calendar.render();
    atualizarLista();
});

function salvarProduto() {
    const nome = document.getElementById('produto').value;
    const data = document.getElementById('validade').value;
    const cor = document.getElementById('cor-produto').value;

    if (!nome || !data) return alert("Preencha todos os campos!");

    const novoEvento = { 
        title: nome,
        start: data, 
        color: cor 
    };

    let eventos = JSON.parse(localStorage.getItem('vencimentos')) || [];
    eventos.push(novoEvento);
    localStorage.setItem('vencimentos', JSON.stringify(eventos));

    calendar.addEvent(novoEvento);
    atualizarLista(); 

    document.getElementById('produto').value = '';
    document.getElementById('validade').value = '';
}

function atualizarLista() {
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '';
    let eventos = JSON.parse(localStorage.getItem('vencimentos')) || [];

    eventos.forEach((evento, index) => {
        const item = document.createElement('div');
        item.className = 'produto-item';
        item.innerHTML = `
            <input type="checkbox" class="produto-check" data-index="${index}">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${evento.color}"></span>
            <small><strong>${evento.title}</strong> - ${evento.start}</small>
        `;
        lista.appendChild(item);
    });
}

function removerSelecionados() {
    let eventos = JSON.parse(localStorage.getItem('vencimentos')) || [];
    const checkboxes = document.querySelectorAll('.produto-check');
    
    let novosEventos = eventos.filter((_, index) => {
        const cb = document.querySelector(`.produto-check[data-index="${index}"]`);
        return !cb.checked;
    });

    localStorage.setItem('vencimentos', JSON.stringify(novosEventos));
    
    calendar.removeAllEvents();
    novosEventos.forEach(e => calendar.addEvent(e));
    
    atualizarLista();
}

function selecionarTodos(status) {
    document.querySelectorAll('.produto-check').forEach(cb => cb.checked = status);
}

function toggleLista() {
    const lista = document.getElementById('lista-produtos');
    const btn = document.getElementById('btn-toggle');
    const isHidden = lista.style.display === "none";
    
    lista.style.display = isHidden ? "block" : "none";
    btn.innerText = isHidden ? "Ocultar" : "Ver";
}