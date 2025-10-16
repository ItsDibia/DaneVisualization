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
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Registrar
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ExportacionesTradicionalesNoTradicionales = () => {
    const data = require("../../../sources/Exportaciones_tradicionales_no_tradicionales.json");

    const [view, setView] = useState('resumen');
    const [periodo, setPeriodo] = useState('agosto');
    const [unidad, setUnidad] = useState('valor_dolares');

    // Utilitarios
    const formatNumber = (value) => {
        if (value >= 10000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000000) return (value / 1000).toFixed(0) + 'K';
        return value.toString();
    };

    const formatVariacion = (pct) => `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;

    const getColorTipo = (tipo) => tipo === 'tradicionales' ? '#f59e0b' : '#10b981';

    // Gráficos
    const vsData = {
        labels: ['Tradicionales', 'No Tradicionales'],
        datasets: [
            { label: '2024', data: data.categorias.map(c => c[periodo][unidad]['2024']), backgroundColor: '#6b7280' },
            { label: '2025', data: data.categorias.map(c => c[periodo][unidad]['2025']), backgroundColor: '#3b82f6' }
        ]
    };

    const productosData = {
        labels: data.categorias[0].productos.map(p => p.nombre),
        datasets: [
            { label: '2024', data: data.categorias[0].productos.map(p => p[periodo][unidad]['2024']), backgroundColor: '#6b7280' },
            { label: '2025', data: data.categorias[0].productos.map(p => p[periodo][unidad]['2025']), backgroundColor: '#3b82f6' }
        ]
    };

    const participacionData = {
        labels: ['Tradicionales', 'No Tradicionales'],
        datasets: [{
            data: data.categorias.map(c => c[periodo][unidad].participacion_total),
            backgroundColor: data.categorias.map(c => getColorTipo(c.tipo))
        }]
    };

    const options = { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, ticks: { callback: formatNumber } } } };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md m-6">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">⚔️ {data.metadata.titulo}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                    <span className="bg-slate-700 text-slate-100 px-2 py-1 rounded-full">📅 {data.metadata.periodo}</span>
                    <span className="bg-blue-700 text-blue-100 px-2 py-1 rounded-full">
                        {periodo === 'agosto' ? '-0.1%' : '+0.5%'}
                    </span>
                    <span className="bg-slate-700 text-slate-100 px-2 py-1 rounded-full">📊 {data.metadata.fuente}</span>
                </div>
                <div className="mt-4 text-xs text-gray-500 space-y-1 pl-6">
                    {data.metadata.notas.map((nota, i) => (
                        <p key={i}>{nota}</p>
                    ))}
                </div>
            </div>

            {/* CONTROLES */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <select value={view} onChange={e => setView(e.target.value)} className="p-2 border rounded">
                        <option value="resumen">⚔️ Batalla Trad vs No Trad</option>
                        <option value="productos">☕ Productos Tradicionales</option>
                        <option value="participacion">🥧 Participación</option>
                        <option value="toneladas">⚖️ Toneladas</option>
                    </select>
                    <select value={periodo} onChange={e => setPeriodo(e.target.value)} className="p-2 border rounded">
                        <option value="agosto">🗓️ Agosto</option>
                        <option value="enero_agosto">📅 Ene-Ago</option>
                    </select>
                    <select value={unidad} onChange={e => setUnidad(e.target.value)} className="p-2 border rounded">
                        <option value="valor_dolares">💰 Valor (Miles $)</option>
                        <option value="toneladas_metricas">⚖️ Toneladas</option>
                    </select>
                </div>
            </div>

            {/* TABLA PRINCIPAL */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold bg-gray-50 px-6 py-4 border-b">
                    📋 {view === 'resumen' ? 'Resumen Trad vs No Trad' : view === 'productos' ? 'Productos Tradicionales' : 'Análisis Completo'}
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    {periodo === 'agosto' ? 'Agosto' : 'Ene-Ago'} 2025
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    {periodo === 'agosto' ? 'Agosto' : 'Ene-Ago'} 2024
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Var%</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {view === 'productos' ?
                                data.categorias[0].productos.map((prod, i) => (
                                    <tr key={prod.codigo} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold mr-3 flex items-center justify-center">
                                                    {i + 1}
                                                </span>
                                                <span className="font-medium">{prod.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold">{formatNumber(prod[periodo][unidad]['2025'])}</td>
                                        <td className="px-6 py-4 text-sm text-right">{formatNumber(prod[periodo][unidad]['2024'])}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${prod[periodo][unidad].variacion_porcentual >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {formatVariacion(prod[periodo][unidad].variacion_porcentual)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">-</td>
                                    </tr>
                                )) :
                                data.categorias.map((cat, i) => (
                                    <tr key={cat.tipo} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className={`w-6 h-6 rounded-full text-white text-xs font-bold mr-3 flex items-center justify-center`}
                                                    style={{ backgroundColor: getColorTipo(cat.tipo) }}>
                                                    {i + 1}
                                                </span>
                                                <span className={`font-medium ${cat.tipo === 'tradicionales' ? 'text-orange-700' : 'text-green-700'}`}>
                                                    {cat.nombre}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold">{formatNumber(cat[periodo][unidad]['2025'])}</td>
                                        <td className="px-6 py-4 text-sm text-right">{formatNumber(cat[periodo][unidad]['2024'])}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${cat[periodo][unidad].variacion_porcentual >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {formatVariacion(cat[periodo][unidad].variacion_porcentual)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold">
                                            {cat[periodo][unidad].participacion_total}%
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* GRÁFICOS DINÁMICOS */}
            {view === 'resumen' && (
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">⚔️ {periodo === 'agosto' ? 'Agosto' : 'Ene-Ago'}</h2>
                        <Bar data={vsData} options={options} />
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 md:w-1/2 lg:w-1/3">
                        <h2 className="text-xl font-semibold mb-4">🥧 Participación 2025</h2>
                        <Doughnut data={participacionData} />
                    </div>
                </div>
            )}

            {view === 'productos' && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">☕ Productos Tradicionales - {periodo === 'agosto' ? 'Agosto' : 'Ene-Ago'}</h2>
                    <Bar data={productosData} options={options} />
                </div>
            )}

            {view === 'toneladas' && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">⚖️ Toneladas - {periodo === 'agosto' ? 'Agosto' : 'Ene-Ago'}</h2>
                    <Bar
                        data={{
                            labels: ['Tradicionales', 'No Tradicionales'],
                            datasets: [
                                { label: '2024', data: data.categorias.map(c => c[periodo].toneladas_metricas['2024']), backgroundColor: '#6b7280' },
                                { label: '2025', data: data.categorias.map(c => c[periodo].toneladas_metricas['2025']), backgroundColor: '#3b82f6' }
                            ]
                        }}
                        options={options}
                    />
                </div>
            )}

        </div>
    );
};

export default ExportacionesTradicionalesNoTradicionales;