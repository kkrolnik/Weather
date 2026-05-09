export function detectAnomalies(hourlyData, dailyData) {
    const anomalies = [];
    scanForAnomalies(hourlyData, anomalies);
    scanForAnomalies(dailyData, anomalies);
    return anomalies;
}

function scanForAnomalies(data, anomalies) {
    const lastTime = data.time?.[data.time.length - 1];
    for (const [key, values] of Object.entries(data)) {
        if (key === 'time' || !Array.isArray(values)) continue;
        const filtered = values.filter(v => v !== null);
        if (filtered.length < 2) continue;
        const avg = mean(filtered);
        const sd = stdev(filtered, avg);
        if (sd === 0) continue;
        const z = zScore(values[values.length - 1], avg, sd);
        if (Math.abs(z) > 2) {
            anomalies.push({ variable: key, zscore: z, time: lastTime });
        }
    }
}

function mean(data) {
    return data.reduce((sum, v) => sum + v, 0) / data.length;
}

function stdev(data, avg) {
    return Math.sqrt(data.reduce((sum, v) => sum + (v - avg) ** 2, 0) / data.length);
}

function zScore(value, mean, stdev) {
    return (value - mean) / stdev;
}
