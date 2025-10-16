"use client";
import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS2,
    ArcElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registrar componentes
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);
ChartJS2.register(ArcElement);

const ExportacionesPaisesCapituloColombia = () => {
    const data = require('../../../sources/exportaciones_historicas.json');

    const [view, setView] = useState('resumen'); // 'resumen', 'pais', 'capitulo', 'tendencia'
    const [paisSeleccionado, setPaisSeleccionado] = useState('Estados Unidos');

    // Utilitarios
    const formatNumber = (value) => {
        if (value >= 10000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000000) return (value / 1000).toFixed(0) + 'K';
        return value.toString();
    };

    const formatVariacion = (variacion) => `${variacion >= 0 ? '+' : ''}${variacion.toFixed(1)}%`;

    const getColorVariacion = (variacion) =>
        variacion >= 0 ? '#10b981' : '#ef4444';

    const getRegionColor = (region) => {
        const colors = {
            'América del Norte': '#3b82f6',
            'Asia': '#8b5cf6',
            'Centroamérica': '#10b981',
            'Europa': '#f59e0b',
            'América del Sur': '#ef4444'
        };
        return colors[region] || '#6b7280';
    };

    // Gráficos
    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

    // 1. Ranking 2025
    const rankingData = {
        labels: data.resumen_tendencias.principales_destinos_2025.map(item => item.pais),
        datasets: [{
            data: data.resumen_tendencias.principales_destinos_2025.map(item => item.valor),
            backgroundColor: data.resumen_tendencias.principales_destinos_2025.map(item =>
                getRegionColor(data.paises.find(p => p.nombre === item.pais)?.region)
            )
        }]
    };

    // 2. Tendencia Línea
    const tendenciaData = {
        labels: years,
        datasets: data.paises.slice(0, 5).map((pais, i) => ({
            label: pais.nombre,
            data: years.map(year => pais.totales_historicos[year]),
            borderColor: getRegionColor(pais.region),
            backgroundColor: getRegionColor(pais.region) + '20',
            tension: 0.4
        }))
    };

    // 3. Barras Variación
    const variacionData = {
        labels: data.resumen_tendencias.mayores_caidas_2025_vs_2024.map(item => item.pais),
        datasets: [{
            label: 'Caída %',
            data: data.resumen_tendencias.mayores_caidas_2025_vs_2024.map(item => item.caida_porcentual),
            backgroundColor: '#ef4444'
        }]
    };

    // 4. Capítulos por país seleccionado
    const paisData = data.paises.find(p => p.nombre === paisSeleccionado);
    const capitulosData = paisData?.principales_capitulos || [];

    const capitulosChart = {
        labels: [...capitulosData.map(c => c.nombre), 'Otros'],
        datasets: [{
            data: [...capitulosData.map(c => c.valores['2025']), paisData?.otros['2025']],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280']
        }]
    };

    const options = { responsive: true, plugins: { legend: { position: 'top' } } };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md m-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    🌍 {data.metadata.titulo}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="bg-gray-200 px-2 py-1 rounded font-bold rounded-full">📅 {data.metadata.periodo}</span>
                    <span className="bg-gray-200 px-2 py-1 rounded font-bold rounded-full">💰 {data.metadata.unidad}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold rounded-full">⚠️ {data.metadata.nota}</span>
                    <span className="bg-gray-200 px-2 py-1 rounded font-bold rounded-full">📊 {data.metadata.fuente}</span>
                </div>
            </div>

            {/* Controles */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <select value={view} onChange={e => setView(e.target.value)} className="p-2 border rounded">
                        <option value="resumen">📊 Resumen Ejecutivo</option>
                        <option value="pais">🌎 Por País</option>
                        <option value="capitulo">📦 Por Capítulo</option>
                        <option value="tendencia">📈 Tendencia 6 Años</option>
                    </select>
                    {view === 'pais' && (
                        <select
                            value={paisSeleccionado}
                            onChange={e => setPaisSeleccionado(e.target.value)}
                            className="p-2 border rounded"
                        >
                            {data.paises.map(p => (
                                <option key={p.codigo} value={p.nombre}>{p.nombre}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Gráficos Dinámicos */}
            {view === 'resumen' && (
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">🥇 Ranking 2025</h2>
                        <Doughnut data={rankingData} options={options} />
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">📉 Mayores Caídas 2025</h2>
                        <Bar data={variacionData} options={{ ...options, indexAxis: 'y' }} />
                    </div>
                </div>
            )}

            {view === 'tendencia' && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">📈 Evolución 2020-2025 (Top 5)</h2>
                    <Line data={tendenciaData} options={options} />
                </div>
            )}

            {view === 'pais' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">{paisSeleccionado} - Totales</h2>
                        <Bar
                            data={{
                                labels: years,
                                datasets: [{
                                    label: 'Exportaciones',
                                    data: years.map(y => paisData.totales_historicos[y]),
                                    backgroundColor: getRegionColor(paisData.region)
                                }]
                            }}
                            options={options}
                        />
                        <p className={`text-center mt-4 font-bold ${getColorVariacion(paisData.variacion_2025_2024)}`}>
                            {formatVariacion(paisData.variacion_2025_2024)} vs 2024
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">{paisSeleccionado} - Capítulos 2025</h2>
                        <Doughnut data={capitulosChart} options={options} />
                    </div>
                </div>
            )}

            {/* Tabla Completa */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <h2 className="text-xl font-semibold bg-gray-50 px-6 py-4 border-b">
                    📋 {view === 'pais' ? `${paisSeleccionado}` : 'Todos los Países'} - 2025 vs 2024
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Región</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2025</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2024</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variación</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capítulo</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.paises.map((pais, index) => (
                                <tr key={pais.codigo} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center mr-3 ${index < 3 ? 'bg-yellow-500' : 'bg-gray-400'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <span className="font-medium text-gray-900">{pais.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100"
                                            style={{ backgroundColor: getRegionColor(pais.region) + '20' }}>
                                            {pais.region}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-semibold">
                                        {formatNumber(pais.totales_historicos['2025'])}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        {formatNumber(pais.totales_historicos['2024'])}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getColorVariacion(pais.variacion_2025_2024)
                                            }`}>
                                            {formatVariacion(pais.variacion_2025_2024)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        {pais.principales_capitulos[0]?.nombre || 'Otros'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alertas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800">🚨 CRISIS CHINA</h3>
                    <p className="text-red-600 font-bold">-56.3% Combustibles</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800">⚠️ ALERTA PANAMÁ</h3>
                    <p className="text-yellow-600 font-bold">-47.8% 89% Combustibles</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800">✅ ESTABLE</h3>
                    <p className="text-green-600">🇺🇸 EE.UU. 30.3% mercado</p>
                </div>
            </div>
        </div>
    );
};

export default ExportacionesPaisesCapituloColombia;