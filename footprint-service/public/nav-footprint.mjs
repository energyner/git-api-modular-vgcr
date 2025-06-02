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

    // --- Configuración de URLs de API para FOOTPRINT SERVICE ---
    // URL de tu API 'footprint-service' desplegada en Google Cloud Run
    // ¡IMPORTANTE: Asegúrate de que esta URL sea la correcta para tu servicio Cloud Run!
    // El YOUR_PROJECT_ID ha sido reemplazado por 858389184339.
    // Y ajusta el endpoint '/api/footprint-energetico' si es diferente.
    //const CLOUD_RUN_API_URL = 'https://footprint-service-858389184339.us-east1.run.app/api/footprint-energetico'; 

    // URL de tu API 'footprint-service' cuando se ejecuta localmente en tu PC (para desarrollo en laptop)
    // Se asume el puerto LOCAL 3008.
    const LOCAL_API_URL_LAPTOP = 'http://localhost:3008/api/footprint-energetico';

    // URL de tu API 'footprint-service' cuando se ejecuta localmente en tu PC (para pruebas desde móvil en la misma LAN)
    // ¡Asegúrate que esta IP sea la IP REAL de tu laptop en tu red Wi-Fi local!
    // Se asume el mismo puerto LOCAL 3008.
    const LOCAL_API_URL_LAN = 'http://192.168.0.252:3008/api/footprint-energetico'; 
    // --- Fin de Configuración de URLs de API ---

    let API_FOOTPRINT_FINAL_URL;

    // Lógica para seleccionar la URL de la API basada en el entorno del navegador
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Entorno de desarrollo local en la misma laptop
        API_FOOTPRINT_FINAL_URL = LOCAL_API_URL_LAPTOP;
        console.log('Entorno detectado: Desarrollo local (laptop). URL API Footprint:', API_FOOTPRINT_FINAL_URL);
    } else if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
        // Entorno de desarrollo local, accedido por IP en la red de área local (LAN)
        API_FOOTPRINT_FINAL_URL = LOCAL_API_URL_LAN;
        console.log('Entorno detectado: Desarrollo local (LAN). URL API Footprint:', API_FOOTPRINT_FINAL_URL);
    } else {
        // Cualquier otro hostname (ej. *.run.app, o un dominio personalizado) se considera producción
        API_FOOTPRINT_FINAL_URL = CLOUD_RUN_API_URL;
        console.log('Entorno detectado: Producción (Cloud Run). URL API Footprint:', API_FOOTPRINT_FINAL_URL);
    }
            
    try {
        const response = await fetch(API_FOOTPRINT_FINAL_URL, { // Usa la URL final construida
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

