// consumo-server.mjs
import express from 'express';
import cors from 'cors';
import { calcularConsumoEnergetico } from './calculation/energy-consumption.mjs';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3006;

// Middlewares
app.use(cors(  
{
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}
));

app.use(express.json());

// Endpoint GET informativo
app.get('/api/consumo-energetico', (req, res) => {
    console.log("GET en /api/consumo-energetico");
    res.send('Usa POST para calcular el consumo energético.');
});

// Health check
app.get('/health', (req, res) => {
    let isServerUp = true;
    let isCalculationFilePresent = false;
    let isCalculationFunctionWorking = false;

    const filePath = path.join(__dirname, 'calculation', 'energy-consumption.mjs');
    try {
        if (fs.existsSync(filePath)) {
            isCalculationFilePresent = true;
        }
    } catch (error) {
        console.error('Error al verificar el archivo:', error);
    }

    if (typeof calcularConsumoEnergetico === 'function') {
        try {
            const testData = { power: 100, hours: 1 };
            const testResult = calcularConsumoEnergetico(testData);
            if (typeof testResult === 'number') {
                isCalculationFunctionWorking = true;
            }
        } catch (error) {
            console.error('Error al ejecutar calcularConsumoEnergetico:', error);
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

// POST para cálculos
app.post('/api/consumo-energetico', calcularConsumoEnergetico);

// Raíz
app.get('/', (req, res) => {
    res.send('Consumo API activa');
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Consumo API corriendo en puerto ${PORT}`);
});
