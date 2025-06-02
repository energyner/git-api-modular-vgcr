// footprint-server.mjs
import express from 'express';
import cors from 'cors';
// función de cálculo para la huella de carbono
import { calcularHuellaCarbono } from './calculation/carbon-footprint.mjs'; // nombre del archivo y la función
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // __dirname ahora es /usr/src/app dentro del contenedor

const app = express();
// Cloud Run inyectará la variable de entorno PORT. Se recomienda usar 8080.
const PORT = process.env.PORT || 8080; // Puerto local para desarrollo

// Middlewares
app.use(cors(  
{
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}
));

app.use(express.json());

// --- NUEVAS MEJORAS: Servir archivos estáticos del frontend ---
// Configura Express para servir archivos estáticos desde la subcarpeta 'public'.
// dentro del contenedor Docker.
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir el archivo HTML de la interfaz de usuario
// Cuando alguien acceda a la URL base de tu servicio Cloud Run (ej. https://tu-servicio.run.app/)
// se servirá tu archivo footprint.html.
app.get('/', (req, res) => {
    // Servimos el archivo footprint.html que está dentro de la carpeta 'public'
    res.sendFile(path.join(__dirname, 'public', 'footprint.html'));
});
// --- FIN de NUEVAS MEJORAS ---


// Endpoint GET informativo para la API
app.get('/api/huella-carbono', (req, res) => {
    console.log("GET en /api/huella-carbono");
    res.send('Usa POST para calcular la huella de carbono.');
});

// Health check para monitoreo
app.get('/health', (req, res) => {
    let isServerUp = true;
    let isCalculationFilePresent = false;
    let isCalculationFunctionWorking = false;

    const filePath = path.join(__dirname, 'calculation', 'carbon-footprint.mjs'); // nombre del archivo de calculo
    try {
        if (fs.existsSync(filePath)) {
            isCalculationFilePresent = true;
        }
    } catch (error) {
        console.error('Error al verificar el archivo:', error);
    }

    if (typeof calcularHuellaCarbono === 'function') { // nombre de la función
        try {
            const testData = { /* datos de prueba para huella de carbono */ };
            const testResult = calcularHuellaCarbono(testData); // Ajusta la función
            if (typeof testResult === 'number' || typeof testResult === 'object') { // Puede devolver objeto
                isCalculationFunctionWorking = true;
            }
        } catch (error) {
            console.error('Error al ejecutar calcularHuellaCarbono:', error);
        }
    }

    if (isServerUp && isCalculationFilePresent && isCalculationFunctionWorking) {
        res.status(200).send('OK - Health check correcto');
    } else {
        let message = 'ERROR en health check:';
        if (!isCalculationFilePresent) message += ' Archivo de cálculo no encontrado.';
        if (!isCalculationFunctionWorking) message += ' La función no se ejecuta correctamente.';
        res.status(500).send(message);
    }
});

// POST para cálculos de huella de carbono
app.post('/api/huella-carbono', calcularHuellaCarbono); // nombre de la función

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Huella de Carbono API corriendo en puerto ${PORT}`);
});
