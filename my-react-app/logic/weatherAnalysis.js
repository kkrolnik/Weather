export function detectAnomalies(hourlyData, dailyData) {
    const anomalies = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scanForAnomalies(hourlyData, anomalies, today);
    scanForAnomalies(dailyData, anomalies, today);
    return anomalies;
}

function scanForAnomalies(data, anomalies, cutoffDate) {
    const times = data.time;
    for (const [key, values] of Object.entries(data)) {
        if (key === 'time' || !Array.isArray(values)) continue;
        const filtered = values.filter(v => v !== null);
        if (filtered.length < 2) continue;
        const avg = mean(filtered);
        const sd = stdev(filtered, avg);
        if (sd === 0) continue;
        for (let i = 0; i < values.length; i++) {
            if (values[i] === null) continue;
            const timeStr = times[i];
            const date = new Date(timeStr);
            if (date > cutoffDate) continue;
            const z = zScore(values[i], avg, sd);
            if (Math.abs(z) > 2) {
                anomalies.push({ variable: key, zscore: z, time: timeStr });
            }
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
