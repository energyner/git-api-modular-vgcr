// nav-consumption.mjs
// Mejoras en la lógica de conexión al servidor y detección de entorno.

document.getElementById('consumo-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const potencia = document.getElementById('potencia').value;
    const horas = document.getElementById('horas').value;

    // --- Configuración de URLs de API ---
    // URL de tu API desplegada en Google Cloud Run
    // ¡Asegúrate de que esta URL sea la correcta para tu servicio Cloud Run!
    const CLOUD_RUN_API_URL = 'https://consumo-service-858389184339.us-east1.run.app/api/consumo-energetico'; 

    // URL de tu API cuando se ejecuta localmente en tu PC (para desarrollo en laptop)
    const LOCAL_API_URL_LAPTOP = 'http://localhost:3006/api/consumo-energetico';

    // URL de tu API cuando se ejecuta localmente en tu PC (para pruebas desde móvil en la misma LAN)
    // ¡Asegúrate que esta IP sea la IP REAL de tu laptop en tu red Wi-Fi local!
    const LOCAL_API_URL_LAN = 'http://192.168.0.252:3006/api/consumo-energetico'; 
    // --- Fin de Configuración de URLs de API ---

    let API_CONSUMO_FINAL_URL;

    // Lógica para seleccionar la URL de la API basada en el entorno del navegador
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Entorno de desarrollo local en la misma laptop
        API_CONSUMO_FINAL_URL = LOCAL_API_URL_LAPTOP;
        console.log('Entorno detectado: Desarrollo local (laptop). URL API:', API_CONSUMO_FINAL_URL);
    } else if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
        // Entorno de desarrollo local, accedido por IP en la red de área local (LAN)
        // Esto cubre casos donde el HTML es servido desde la IP local y la API también está en la LAN.
        API_CONSUMO_FINAL_URL = LOCAL_API_URL_LAN;
        console.log('Entorno detectado: Desarrollo local (LAN). URL API:', API_CONSUMO_FINAL_URL);
    } else {
        // Cualquier otro hostname (ej. *.run.app, o un dominio personalizado) se considera producción
        API_CONSUMO_FINAL_URL = CLOUD_RUN_API_URL;
        console.log('Entorno detectado: Producción (Cloud Run). URL API:', API_CONSUMO_FINAL_URL);
    }

    // 4. Ejecutar solicitud
    fetch(API_CONSUMO_FINAL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ potencia, horas })
    })
    .then(response => {
        if (!response.ok) {
            // Intenta leer el mensaje de error del cuerpo de la respuesta si no fue exitosa
            return response.text().then(errorMessage => {
                throw new Error(`Error en la solicitud: ${response.status} - ${errorMessage}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Consumo energético:', data);
        const resultadoConsumo = document.getElementById('resultadoConsumo');
        // Asegúrate de que 'resultado' o 'consumo_energetico' existen en la respuesta
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



/*Gemini*/

// // nav-consumption.mjs
// // Mejoras en la lógica de conexión al servidor y detección de entorno.

// document.getElementById('consumo-form').addEventListener('submit', (event) => {
//     event.preventDefault();

//     const potencia = document.getElementById('potencia').value;
//     const horas = document.getElementById('horas').value;

//     // --- Configuración de URLs de API ---
//     // URL de tu API desplegada en Google Cloud Run
  
//     const CLOUD_RUN_API_URL = 'https://consumo-service-858389184339.us-east1.run.app/api/consumo-energetico'; 

//     // URL de tu API cuando se ejecuta localmente en tu PC (para desarrollo en laptop)
//     const LOCAL_API_URL_LAPTOP = 'http://localhost:3006/api/consumo-energetico';

//     // URL de tu API cuando se ejecuta localmente en tu PC (para pruebas desde móvil en la misma LAN)
//     // ¡Asegúrate que esta IP sea la IP REAL de tu laptop en tu red Wi-Fi local!
//     const LOCAL_API_URL_LAN = 'http://192.168.0.252:3006/api/consumo-energetico'; 
//     // --- Fin de Configuración de URLs de API ---

//     let API_CONSUMO_FINAL_URL;

//     // Lógica para seleccionar la URL de la API basada en el entorno del navegador
//     const hostname = window.location.hostname;

//     if (hostname === 'localhost' || hostname === '127.0.0.1') {
//         // Entorno de desarrollo local en la misma laptop
//         API_CONSUMO_FINAL_URL = LOCAL_API_URL_LAPTOP;
//         console.log('Entorno detectado: Desarrollo local (laptop). URL API:', API_CONSUMO_FINAL_URL);
//     } else if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
//         // Entorno de desarrollo local, accedido por IP en la red de área local (LAN)
//         // Esto cubre casos donde el HTML es servido desde la IP local y la API también está en la LAN.
//         API_CONSUMO_FINAL_URL = LOCAL_API_URL_LAN;
//         console.log('Entorno detectado: Desarrollo local (LAN). URL API:', API_CONSUMO_FINAL_URL);
//     } else {
//         // Cualquier otro hostname (ej. *.run.app, o un dominio personalizado) se considera producción
//         API_CONSUMO_FINAL_URL = CLOUD_RUN_API_URL;
//         console.log('Entorno detectado: Producción (Cloud Run). URL API:', API_CONSUMO_FINAL_URL);
//     }

//     // 4. Ejecutar solicitud
//     fetch(API_CONSUMO_FINAL_URL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ potencia, horas })
//     })
//     .then(response => {
//         if (!response.ok) {
//             // Intenta leer el mensaje de error del cuerpo de la respuesta si no fue exitosa
//             return response.text().then(errorMessage => {
//                 throw new Error(`Error en la solicitud: ${response.status} - ${errorMessage}`);
//             });
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Consumo energético:', data);
//         const resultadoConsumo = document.getElementById('resultadoConsumo');
//         // Asegúrate de que 'resultado' o 'consumo_energetico' existen en la respuesta
//         resultadoConsumo.textContent = `Consumo energético calculado: ${data.consumo_energetico || data.resultado} kWh`;
//         resultadoConsumo.style.color = "green";
//     })
//     .catch(error => {
//         console.error('Error al calcular el consumo:', error);
//         const resultadoConsumo = document.getElementById('resultadoConsumo');
//         resultadoConsumo.textContent = `Error: ${error.message}`;
//         resultadoConsumo.style.color = "red";
//         alert("Error al calcular consumo energético: " + error.message);
//     });
// });