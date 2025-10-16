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
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS2,
    ArcElement,
} from 'chart.js';

// Registrar
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS2.register(ArcElement);

const ExportacionesGruposPaisesColombia = () => {
    const data = require("../../../sources/Exportaciones_por_grupos_y_destinos.json");
    const [view, setView] = useState('resumen'); // 'resumen', 'grupos', 'paises', 'detalle'
    const [selected, setSelected] = useState(null); // grupo o país seleccionado

    // Utilitarios
    const formatNumber = (value) => {
        if (value >= 10000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000000) return (value / 1000).toFixed(0) + 'K';
        return value.toString();
    };

    const formatVariacion = (pct) => {
        if (pct === null) return 'N/A';
        return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    };

    const getColor = (type) => {
        const colors = {
            'UE': '#3b82f6', 'ALADI': '#ef4444', 'CAN': '#10b981',
            'RESTO_ALADI': '#f59e0b', 'MERCOSUR': '#8b5cf6', 'NAFTA': '#06b6d4'
        };
        return colors[type] || '#6b7280';
    };

    const getCategoriaColor = (categoria) => {
        const colors = {
            'Café, té y especias': '#8b5cf6', 'Combustibles': '#f59e0b',
            'Vegetales': '#10b981', 'Alimentos, bebidas y tabaco': '#3b82f6'
        };
        return colors[categoria] || '#6b7280';
    };

    // Datos para gráficos
    const gruposData = {
        labels: data.por_grupos_paises.grupos.map(g => g.nombre),
        datasets: [
            { label: '2024', data: data.por_grupos_paises.grupos.map(g => g.total['2024']), backgroundColor: '#6b7280' },
            { label: '2025', data: data.por_grupos_paises.grupos.map(g => g.total['2025']), backgroundColor: '#3b82f6' }
        ]
    };

    const paisesData = {
        labels: data.por_paises.paises.map(p => p.nombre),
        datasets: [{
            data: data.por_paises.paises.map(p => p.total['2025']),
            backgroundColor: data.por_paises.paises.map(p => getColor(p.region))
        }]
    };

    const options = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { callback: formatNumber } } }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md m-6">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">🌍 {data.metadata.titulo}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 items-center mt-4">
                    <span className="bg-slate-700 text-slate-100 px-2 py-1 rounded-full">📅 {data.metadata.periodo}</span>
                    <span className="bg-indigo-700 text-indigo-100 px-2 py-1 rounded-full">💰 {data.metadata.unidad}</span>
                    <span className="bg-green-700 text-green-100 px-2 py-1 rounded-full">+0.5%</span>
                    <span className="bg-slate-700 text-slate-100 px-2 py-1 rounded-full">📊 {data.metadata.fuente}</span>
                </div>
            </div>

            {/* CONTROLES */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <select value={view} onChange={e => setView(e.target.value)} className="p-2 border rounded">
                        <option value="resumen">📊 Resumen Ejecutivo</option>
                        <option value="grupos">🌎 Por Grupos Regionales</option>
                        <option value="paises">🇨🇴 Por Países</option>
                        <option value="detalle">🔍 Detalle Seleccionado</option>
                    </select>
                    {(view === 'grupos' || view === 'paises') && (
                        <select value={selected?.codigo || ''} onChange={e => setSelected(data.por_grupos_paises.grupos.find(g => g.codigo === e.target.value) || data.por_paises.paises.find(p => p.codigo === e.target.value))} className="p-2 border rounded">
                            <option value="">Seleccionar...</option>
                            {view === 'grupos' ? data.por_grupos_paises.grupos.map(g => <option key={g.codigo} value={g.codigo}>{g.nombre}</option>) : data.por_paises.paises.map(p => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}
                        </select>
                    )}
                </div>
            </div>

            {/* GRÁFICOS DINÁMICOS */}
            {view === 'resumen' && (
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">🌎 Por Grupos Regionales</h2>
                        <Bar data={gruposData} options={options} />
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1 md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">🇨🇴 Top Países 2025</h2>
                        <Doughnut data={paisesData} />
                    </div>
                </div>
            )}

            {view === 'grupos' && !selected && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <Bar data={gruposData} options={options} />
                </div>
            )}

            {view === 'paises' && !selected && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">🥧 Participación Países 2025</h2>
                    <Doughnut data={paisesData} />
                </div>
            )}

            {/* DETALLE SELECCIONADO */}
            {(view === 'detalle' || selected) && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {selected?.nombre || 'Seleccionar grupo/país'}
                    </h2>
                    {selected && (
                        <Bar
                            data={{
                                labels: selected.categorias.map(c => c.nombre),
                                datasets: [
                                    { label: '2024', data: selected.categorias.map(c => c['2024']), backgroundColor: '#6b7280' },
                                    { label: '2025', data: selected.categorias.map(c => c['2025']), backgroundColor: '#3b82f6' }
                                ]
                            }}
                            options={options}
                        />
                    )}
                </div>
            )}

            {/* TABLA PRINCIPAL */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold bg-gray-50 px-6 py-4 border-b">
                    📋 {view === 'resumen' ? 'Resumen' : view === 'grupos' ? 'Grupos Regionales' : 'Países'}
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Región/País</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2025</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2024</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variación</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Mercado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(view === 'grupos' ? data.por_grupos_paises.grupos : data.por_paises.paises).map((item, i) => (
                                <tr key={item.codigo} className="hover:bg-gray-50" onClick={() => setSelected(item)}>
                                    <td className="px-6 py-4 cursor-pointer">
                                        <div className="flex items-center">
                                            <span className={`w-6 h-6 rounded-full text-white text-xs font-bold mr-3 flex items-center justify-center`}
                                                style={{ backgroundColor: getColor(view === 'grupos' ? item.codigo : item.region) }}>
                                                {i + 1}
                                            </span>
                                            <span className="font-medium">{item.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-semibold">
                                        {formatNumber(item.total['2025'])}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        {formatNumber(item.total['2024'])}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.total.variacion_porcentual >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {formatVariacion(item.total.variacion_porcentual)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        {item.total.participacion_2025 ? `${item.total.participacion_2025}%` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExportacionesGruposPaisesColombia;