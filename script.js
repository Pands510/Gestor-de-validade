let calendar;

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        events: JSON.parse(localStorage.getItem('vencimentos')) || []
    });
    
    calendar.render();
    atualizarLista();
});

function salvarProduto() {
    const nome = document.getElementById('produto').value;
    const data = document.getElementById('validade').value;

    if (!nome || !data) return alert("Preencha todos os campos!");

    const novoEvento = { 
        title: nome,
        start: data, 
        color: '#e74c3c' 
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
        item.style.marginBottom = "5px";
        
        item.innerHTML = `
            <label>
                <input type="checkbox" class="produto-check" data-index="${index}">
                <strong>${evento.title}</strong> - Vence em: ${evento.start}
            </label>
        `;
        lista.appendChild(item);
    });
}

function removerSelecionados() {
    let eventos = JSON.parse(localStorage.getItem('vencimentos')) || [];
    const checkboxes = document.querySelectorAll('.produto-check');
    
    let novosEventos = eventos.filter((_, index) => {
        const checkbox = document.querySelector(`.produto-check[data-index="${index}"]`);
        return !checkbox.checked;
    });

    localStorage.setItem('vencimentos', JSON.stringify(novosEventos));

    calendar.removeAllEvents();
    novosEventos.forEach(e => calendar.addEvent(e));

    atualizarLista();
}

function selecionarTodos(status) {
    const checkboxes = document.querySelectorAll('.produto-check');
    checkboxes.forEach(cb => cb.checked = status);
}