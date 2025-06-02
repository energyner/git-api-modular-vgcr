// footprint-server.mjs
import express from 'express';
import cors from 'cors';
// Asumo que tienes una función de cálculo para la huella de carbono
import { calcularHuellaCarbono } from './calculation/carbon-footprint.mjs'; // Nombre del archivo y la función
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // __dirname ahora es /usr/src/app dentro del contenedor

const app = express();
// Cloud Run inyectará la variable de entorno PORT. Se recomienda usar 8080.
const PORT = process.env.PORT || 8080; 

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
// Comprobar  que  Dockerfile copie tu HTML, JS, CSS, etc. a esta carpeta
// dentro del contenedor Docker.
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir el archivo HTML de tu interfaz de usuario
// Cuando alguien acceda a la URL base de tu servicio Cloud Run (ej. https://tu-servicio.run.app/)
// se servirá el archivo del frontend footprint.html.
app.get('/', (req, res) => {
    // Serviendo el archivo footprint.html que está dentro de la carpeta 'public'
    res.sendFile(path.join(__dirname, 'public', 'footprint.html'));
});

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

    const filePath = path.join(__dirname, 'calculation', 'carbon-footprint.mjs'); // Nombre del archivo
    try {
        if (fs.existsSync(filePath)) {
            isCalculationFilePresent = true;
        }
    } catch (error) {
        console.error('Error al verificar el archivo:', error);
    }

    if (typeof calcularHuellaCarbono === 'function') { // Nombre del archivo
        try {
            const testData = { state: "CA", elect: 100, gas: 10, water: 5, lpg: 1, gn: 1, fly: 0, cogs: 0, person: 1 }; // Datos de prueba válidos
            const testResult = calcularHuellaCarbono(testData); // Llama a la función de cálculo
            if (typeof testResult === 'object' && !testResult.error) { // Verifica que no haya error en el resultado
                isCalculationFunctionWorking = true;
            }
        } catch (error) {
            console.error('Error al ejecutar calcularHuellaCarbono en health check:', error);
        }
    }

    if (isServerUp && isCalculationFilePresent && isCalculationFunctionWorking) {
        res.status(200).send('OK - Health check correcto');
    } else {
        let message = 'ERROR en health check:';
        if (!isCalculationFilePresent) message += ' Archivo de cálculo no encontrado.';
        if (!isCalculationFunctionWorking) message += ' La función no se ejecuta correctamente o devuelve un error.';
        res.status(500).send(message);
    }
});

// POST para cálculos de huella de carbono

app.post('/api/huella-carbono', (req, res) => {
    console.log('POST request received for /api/huella-carbono');
    const { state, elect, gas, water, lpg, gn, fly, cogs, person } = req.body;
    console.log('Data from request body:', req.body);

    // Validar los datos de entrada aquí si es necesario, o directamente en la función de cálculo
    
    // Llamar a la función de cálculo
    const result = calcularHuellaCarbono({ state, elect, gas, water, lpg, gn, fly, cogs, person });

    // Enviar la respuesta al cliente
    if (result.error) {
        console.error('Error in calculation:', result.error);
        res.status(400).json({ error: result.error }); // Errores de validación o lógica
    } else {
        console.log('Calculation successful. Sending result:', result);
        res.status(200).json(result); // Enviar el resultado exitoso
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Huella de Carbono API corriendo en puerto ${PORT}`);
});
