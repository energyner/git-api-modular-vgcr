
export function calcularConsumoEnergetico(req, res) {
    console.log("1.1 - Calculando consumo-energetico");

    const { potencia, horas } = req.body;

    if (isNaN(potencia) || isNaN(horas)) {
        console.log("1.1.1 - Error: Parámetros inválidos");
        return res.status(400).json({
            error: "Parámetros inválidos: potencia y horas deben ser números"
        });
    }

    try {
        const resultado = parseFloat(potencia) * parseFloat(horas);
        console.log("1.2 - Cálculo resuelto:", resultado);
        res.json({ consumo_energetico: resultado });
    } catch (error) {
        console.error("Error al calcular el consumo energético:", error);
        res.status(500).json({ error: "Error interno al calcular el consumo energético." });
    }
}
