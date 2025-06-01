// nav-footprint.mjs

document.getElementById("calcular").addEventListener("click", async function (event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const state = document.getElementById("state").value;
    const elect = parseFloat(document.getElementById("elect").value) || 0;
    const gas = parseFloat(document.getElementById("gas").value) || 0;
    const water = parseFloat(document.getElementById("water").value) || 0;
    const lpg = parseFloat(document.getElementById("lpg").value) || 0;
    const gn = parseFloat(document.getElementById("gn").value) || 0;
    const fly = parseFloat(document.getElementById("fly").value) || 0;
    const cogs = parseFloat(document.getElementById("cogs").value) || 0;
    const person = parseInt(document.getElementById("person").value) || 1;

    const data = { state, elect, gas, water, lpg, gn, fly, cogs, person };

// 1. Detectar tipo de entorno y dispositivo
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLocalDesktop = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // 2. IP real de tu PC en red Wi-Fi local (ajústala si cambia)
    const SERVER_PC_IP = 'http://192.168.0.252:3008'; // ← cámbiala por tu IP real

    // 3. Construir URL final
    const API_FOOTPRINT = isLocalDesktop
        ? 'http://localhost:3008/api/huella-carbono'
        : isMobile
            ? `${SERVER_PC_IP}/api/huella-carbono`
            : '/api/footprint'; // producción
            
    try {
        const response = await fetch(API_FOOTPRINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        document.getElementById("resultado").value = result.total || 0;
        document.getElementById("estado").value = result.estado || "N/A";
        document.getElementById("percapita").value = result.per_capita || 0;
        document.getElementById("per_capita_estado").value = result.per_capita_estado || 0;
        document.getElementById("promedioUSA").value = result.promedioUSA || 0;
        document.getElementById("promedioMundial").value = result.promedioMundial || 0;
        document.getElementById("porcentajeEstado").value = (result.porcentajeEstado || 0) + "%";
        document.getElementById("porcentajeUSA").value = (result.porcentajeUSA || 0) + "%";
        document.getElementById("porcentajeMundial").value = (result.porcentajeMundial || 0) + "%";

        console.log("Detalles:", result.detalles);
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        alert("Error al calcular huella de carbono: " + error.message);
    }
});
