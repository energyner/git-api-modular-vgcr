// footprint-server.mjs
import express from 'express';
import cors from 'cors';
import { calcularHuellaCarbono } from './calculation/carbon-footprint.mjs';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint informativo (GET)
app.get('/api/huella-carbono', (req, res) => {
  res.send('Usa POST para calcular la huella de carbono.');
});

// Health check
app.get('/health', (req, res) => {
  let isCalculationFilePresent = false;
  let isCalculationFunctionWorking = false;

  const filePath = path.join(__dirname, 'calculation', 'carbon-footprint.mjs');
  if (fs.existsSync(filePath)) {
    isCalculationFilePresent = true;
  }

  if (typeof calcularHuellaCarbono === 'function') {
    try {
      const testData = {
        state: "TX", elect: 100, gas: 50, water: 30, lpg: 10,
        gn: 5, fly: 0, cogs: 0, person: 2
      };
      const result = calcularHuellaCarbono(testData);
      if (typeof result === 'object' && !result.error) {
        isCalculationFunctionWorking = true;
      }
    } catch (e) {
      console.error('Error en cálculo:', e);
    }
  }

  if (isCalculationFilePresent && isCalculationFunctionWorking) {
    res.status(200).send('OK - Huella de carbono activa');
  } else {
    res.status(500).send('ERROR - Archivo o función de cálculo fallida. Archivo presente: ${isCalculationFilePresent},Función válida: ${isCalculationFunctionWorking}');
  }
});

// POST principal (adaptado para función pura)
app.post('/api/huella-carbono', (req, res) => {
  const data = req.body;
  const resultado = calcularHuellaCarbono(data);

  if (resultado?.error) {
    return res.status(400).json({ error: resultado.error });
  }

  return res.status(200).json(resultado);
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Huella de Carbono API activa');
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Huella de Carbono escuchando en puerto ${PORT}`);
});
