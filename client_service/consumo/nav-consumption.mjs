// nav-consumption.mjs

document.getElementById('consumo-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const potencia = document.getElementById('potencia').value;
    const horas = document.getElementById('horas').value;

    // 1. Detectar tipo de entorno y dispositivo
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLocalDesktop = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // 2. IP real de tu PC en red Wi-Fi local (ajústala si cambia)
    const SERVER_PC_IP = 'http://192.168.0.252:3006'; // ← cámbiala por tu IP real

    // 3. Construir URL final
    const API_CONSUMO = isLocalDesktop
        ? 'http://localhost:3006/api/consumo-energetico'
        : isMobile
            ? `${SERVER_PC_IP}/api/consumo-energetico`
            : '/api/consumo'; // producción

    // 4. Ejecutar solicitud
    fetch(API_CONSUMO, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ potencia, horas })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(`Error en la solicitud: ${response.status} - ${errorMessage}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Consumo energético:', data);
        const resultadoConsumo = document.getElementById('resultadoConsumo');
        resultadoConsumo.textContent = `Consumo energético calculado: ${data.consumo_energetico || data.resultado} kWh`;
        resultadoConsumo.style.color = "green";
    })
    .catch(error => {
        console.error('Error al calcular el consumo:', error);
        const resultadoConsumo = document.getElementById('resultadoConsumo');
        resultadoConsumo.textContent = `Error: ${error.message}`;
        resultadoConsumo.style.color = "red";
        alert("Error al calcular consumo energético: " + error.message);
    });
});
