let calendar;

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        events: JSON.parse(localStorage.getItem('vencimentos')) || []
    });
    calendar.render();
});

function salvarProduto() {
    const nome = document.getElementById('produto').value;
    const data = document.getElementById('validade').value;

    if (!nome || !data) return alert("Preencha todos os campos!");

    const novoEvento = { title: `Vence: ${nome}`, start: data, color: '#e74c3c' };

let eventos = JSON.parse(localStorage.getItem('vencimentos')) || [];
    eventos.push(novoEvento);
    localStorage.setItem('vencimentos', JSON.stringify(eventos));

calendar.addEvent(novoEvento);
        
    document.getElementById('produto').value = '';
    document.getElementById('validade').value = '';
}