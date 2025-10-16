"use client";
import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS2,
    ArcElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registrar
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS2.register(ArcElement);

const ExportacionesGruposEconomicos = () => {
    const data = require('../../../sources/exportaciones_limpias_ene_ago_2024_2025.json');
    const [view, setView] = useState('grupos'); // 'grupos', 'detalle', 'contribucion'

    // Procesar datos por grupo
    const gruposData = data.reduce((acc, item) => {
        if (!acc[item.grupo]) {
            acc[item.grupo] = { '2024': 0, '2025': 0, variacion: 0, contribucion: 0 };
        }
        acc[item.grupo][item.año] += item.valor_fob;
        if (item.año === 2025) {
            acc[item.grupo].variacion = item.variacion_pct;
            acc[item.grupo].contribucion = item.contribucion_pp;
        }
        return acc;
    }, {});

    const gruposArray = Object.entries(gruposData).map(([grupo, valores]) => ({
        grupo,
        '2024': valores['2024'],
        '2025': valores['2025'],
        variacion: valores.variacion,
        contribucion: valores.contribucion
    }));

    // Utilitarios
    const formatNumber = (value) => {
        if (value >= 10000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000000) return (value / 1000).toFixed(0) + 'K';
        return value.toString();
    };

    const getColorGrupo = (grupo) => {
        const colors = {
            'Agropecuario alimentos y bebidas': '#10b981',
            'Combustibles': '#f59e0b',
            'Manufacturas': '#3b82f6',
            'Otros': '#8b5cf6'
        };
        return colors[grupo] || '#6b7280';
    };

    const getColorVariacion = (pct) =>
        pct >= 0 ? '#10b981' : '#ef4444';

    // Gráficos
    const barData = {
        labels: gruposArray.map(g => g.grupo),
        datasets: [
            { label: '2024', data: gruposArray.map(g => g['2024']), backgroundColor: '#6b7280' },
            { label: '2025', data: gruposArray.map(g => g['2025']), backgroundColor: '#3b82f6' }
        ]
    };

    const doughnutData = {
        labels: gruposArray.map(g => g.grupo),
        datasets: [{
            data: gruposArray.map(g => g['2025']),
            backgroundColor: gruposArray.map(g => getColorGrupo(g.grupo))
        }]
    };

    const options = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { callback: formatNumber } } }
    };

    // Totales
    const total2025 = gruposArray.reduce((sum, g) => sum + g['2025'], 0);

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md m-6">
            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                📊 Exportaciones por Grupos Económicos
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">2024-2025</span>
            </h1>

            {/* Controles */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <select value={view} onChange={e => setView(e.target.value)}
                    className="p-2 border rounded-md w-full max-w-xs">
                    <option value="grupos">📈 Por Grupos</option>
                    <option value="detalle">🔍 Detalle Productos</option>
                    <option value="contribucion">📊 Contribución al Cambio</option>
                </select>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-green-900">☕ CAFE +75.3%</h3>
                    <p className="text-2xl font-bold text-green-700">4.4M</p>
                </div>
                <div className={`bg-red-50 rounded-lg p-6 text-center`}>
                    <h3 className="text-lg font-semibold text-red-900">⛽ PETRÓLEO -16.7%</h3>
                    <p className="text-2xl font-bold text-red-700">{formatNumber(8557869)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-purple-900">💰 TOTAL 2025</h3>
                    <p className="text-2xl font-bold text-purple-700">{formatNumber(total2025)}</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                {view === 'grupos' && (
                    <>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">📊 Comparativo 2024 vs 2025</h2>
                            <Bar data={barData} options={options} />
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1 md:w-1/2">
                            <h2 className="text-xl font-semibold mb-4">🥧 Participación 2025</h2>
                            <Doughnut data={doughnutData} />
                        </div>
                    </>
                )}

                {view === 'contribucion' && (
                    <div className="bg-white rounded-lg shadow-md p-6 col-span-full">
                        <h2 className="text-xl font-semibold mb-4">📊 Impacto en Variación Total</h2>
                        <Bar
                            data={{
                                labels: gruposArray.map(g => g.grupo),
                                datasets: [{
                                    label: 'Contribución p.p.',
                                    data: gruposArray.map(g => g.contribucion),
                                    backgroundColor: gruposArray.map(g => getColorVariacion(g.variacion))
                                }]
                            }}
                            options={{ ...options, indexAxis: 'y' }}
                        />
                    </div>
                )}
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold bg-gray-50 px-6 py-4 border-b">
                    📋 {view === 'detalle' ? 'Detalle Productos' : 'Resumen por Grupos'}
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {view === 'detalle' ? 'Producto' : 'Grupo'}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2024</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2025</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variación</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Contribución</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {view === 'grupos' ?
                                gruposArray.map((grupo, i) => (
                                    <tr key={grupo.grupo} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className={`w-6 h-6 rounded-full text-white text-xs font-bold mr-3 flex items-center justify-center`}
                                                    style={{ backgroundColor: getColorGrupo(grupo.grupo) }}>
                                                    {i + 1}
                                                </span>
                                                <span className="font-medium">{grupo.grupo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">{formatNumber(grupo['2024'])}</td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold">{formatNumber(grupo['2025'])}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getColorVariacion(grupo.variacion)}`}>
                                                {grupo.variacion.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">{grupo.contribucion.toFixed(1)}pp</td>
                                    </tr>
                                )) :
                                data.filter(item => item.año === 2025).map((item, i) => (
                                    <tr key={item.descripcion} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium">{item.descripcion}</td>
                                        <td className="px-6 py-4 text-sm text-right">{formatNumber(data.find(d => d.descripcion === item.descripcion && d.año === 2024)?.valor_fob || 0)}</td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold">{formatNumber(item.valor_fob)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getColorVariacion(item.variacion_pct)}`}>
                                                {item.variacion_pct.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">{item.contribucion_pp.toFixed(1)}pp</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alertas */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800">🚀 ESTRELLA ☕</h3>
                    <p className="text-green-600 font-bold">Café +75.3% = 4.4M</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800">⚠️ ALERTA ⛽</h3>
                    <p className="text-orange-600 font-bold">Petróleo pesa -5.3pp total</p>
                </div>
            </div>
        </div>
    );
};

export default ExportacionesGruposEconomicos;