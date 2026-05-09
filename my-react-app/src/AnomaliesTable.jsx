import { useState } from 'react';

function AnomaliesTable({ anomalies }) {
    const [expanded, setExpanded] = useState({});

    const grouped = anomalies.reduce((acc, anomaly) => {
        if (!acc[anomaly.variable]) {
            acc[anomaly.variable] = [];
        }
        acc[anomaly.variable].push(anomaly);
        return acc;
    }, {});

    const toggleGroup = (variable) => {
        setExpanded(prev => ({
            ...prev,
            [variable]: !prev[variable]
        }));
    };

    return (
        <div className="anomalies-table">
            {Object.entries(grouped).map(([variable, items]) => (
                <div key={variable} className="anomaly-group">
                    <button
                        className="group-header"
                        onClick={() => toggleGroup(variable)}
                    >
                        {expanded[variable] ? '▼' : '▶'} {variable} ({items.length})
                    </button>
                    {expanded[variable] && (
                        <div className="group-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Z-Score</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.zscore.toFixed(2)}</td>
                                            <td>{new Date(item.time).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default AnomaliesTable;
