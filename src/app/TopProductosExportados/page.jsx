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

const TopProductosExportados = () => {
    const data = require('../../../sources/Principales_productos_exportados_segun_FOB.json');

    const [view, setView] = useState('top10');
    const [unidad, setUnidad] = useState('valor_dolares');

    // Utilitarios
    const formatNumber = (value) => {
        if (value >= 10000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000000) return (value / 1000).toFixed(0) + 'K';
        return value.toString();
    };

    const getColorPosicion = (pos) => {
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#84cc16', '#dc2626'];
        return colors[(pos - 1) % colors.length] || '#6b7280';
    };

    const getIconProducto = (desc) => {
        const icons = {
            'petróleo': '⛽', 'café': '☕', 'oro': '💰', 'hullas': '⬆️', 'flores': '🌹',
            'bananas': '🍌', 'fueloils': '⛽', 'coques': '⬆️', 'queroseno': '✈️', 'palma': '🌴'
        };
        return Object.keys(icons).some(k => desc.toLowerCase().includes(k)) ? icons[Object.keys(icons).find(k => desc.toLowerCase().includes(k))] : '📦';
    };

    // Gráficos TOP 10
    const top10Data = {
        labels: data.productos.slice(0, 10).map(p => `${getIconProducto(p.descripcion)} ${p.descripcion.split(' ')[0]}`),
        datasets: [
            { label: '2024', data: data.productos.slice(0, 10).map(p => p[unidad]['2024']), backgroundColor: '#6b7280' },
            { label: '2025', data: data.productos.slice(0, 10).map(p => p[unidad]['2025']), backgroundColor: '#3b82f6' }
        ]
    };

    const participacionData = {
        labels: data.productos.slice(0, 10).map(p => `${getIconProducto(p.descripcion)} ${p.descripcion.split(' ')[0]}`),
        datasets: [{
            data: data.productos.slice(0, 10).map(p => p[unidad].participacion_porcentaje),
            backgroundColor: data.productos.slice(0, 10).map((p, i) => getColorPosicion(i + 1))
        }]
    };

    const options = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { callback: formatNumber } } }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md m-6">
            {/* HEADER ÉPICO */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 {data.metadata.titulo}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                    <span className="bg-yellow-200 px-2 py-1 rounded-full">📅 {data.metadata.periodo}</span>
                    <span className="bg-indigo-200 px-2 py-1 rounded-full">🏢 {data.metadata.region}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">+0.5%</span>
                    <span className="bg-slate-200 px-2 py-1 rounded-full">📊 {data.metadata.fuente}</span>
                </div>
            </div>

            {/* CONTROLES */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <select value={view} onChange={e => setView(e.target.value)} className="p-2 border rounded">
                        <option value="top10">🥇 TOP 10 Productos</option>
                        <option value="participacion">🥧 Participación</option>
                        <option value="toneladas">⚖️ Toneladas</option>
                        <option value="completo">📋 TOP 35 Completo</option>
                    </select>
                    <select value={unidad} onChange={e => setUnidad(e.target.value)} className="p-2 border rounded">
                        <option value="valor_dolares">💰 Valor FOB (Miles $)</option>
                        <option value="toneladas_metricas">⚖️ Toneladas</option>
                    </select>
                </div>
            </div>

            {/* PODIO HÉROES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-r from-black to-gray-800 rounded-lg p-8 text-center text-white">
                    <div className="text-6xl mb-2">🥇</div>
                    <h3 className="text-xl font-bold mb-2">⛽ PETRÓLEO</h3>
                    <p className="text-3xl font-bold">6.7M</p>
                    <p className="text-sm opacity-90">20.6% TOTAL</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-center text-white">
                    <div className="text-6xl mb-2">🥈</div>
                    <h3 className="text-xl font-bold mb-2">☕ CAFÉ</h3>
                    <p className="text-3xl font-bold">+1.6M</p>
                    <p className="text-sm opacity-90">+79% EXPLOSIÓN</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-8 text-center text-white">
                    <div className="text-6xl mb-2">🥉</div>
                    <h3 className="text-xl font-bold mb-2">💰 ORO</h3>
                    <p className="text-3xl font-bold">2.7M</p>
                    <p className="text-sm opacity-90">+18% ESTABLE</p>
                </div>
            </div>

            {/* GRÁFICOS TOP */}
            {view === 'top10' && (
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">🥇 TOP 10 {unidad === 'valor_dolares' ? '$ FOB' : 'Toneladas'}</h2>
                        <Bar data={top10Data} options={options} />
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">🥧 Participación TOP 10</h2>
                        <Doughnut data={participacionData} />
                    </div>
                </div>
            )}

            {view === 'toneladas' && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">⚖️ TOP 10 Toneladas</h2>
                    <Bar
                        data={{
                            labels: data.productos.slice(0, 10).map(p => `${getIconProducto(p.descripcion)} ${p.descripcion.split(' ')[0]}`),
                            datasets: [
                                { label: '2024', data: data.productos.slice(0, 10).map(p => p.toneladas_metricas['2024']), backgroundColor: '#6b7280' },
                                { label: '2025', data: data.productos.slice(0, 10).map(p => p.toneladas_metricas['2025']), backgroundColor: '#3b82f6' }
                            ]
                        }}
                        options={options}
                    />
                </div>
            )}

            {/* TABLA PODEROSA */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold bg-gray-50 px-6 py-4 border-b">
                    📋 {view === 'top10' ? 'TOP 10 Productos' : view === 'completo' ? 'TOP 35 COMPLETO' : 'Análisis'}
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">🏆</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2025</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2024</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(view === 'completo' ? data.productos : data.productos.slice(0, 10)).map((prod, i) => {
                                const pos = typeof prod.posicion === 'number' ? prod.posicion : 99;
                                const variacion = ((prod[unidad]['2025'] - prod[unidad]['2024']) / prod[unidad]['2024'] * 100).toFixed(1);
                                return (
                                    <tr key={prod.partida_arancelaria} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-sm`}
                                                style={{ backgroundColor: getColorPosicion(pos) }}>
                                                {pos <= 3 ? ['🥇', '🥈', '🥉'][pos - 1] : pos}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="text-lg mr-3">{getIconProducto(prod.descripcion)}</span>
                                                <div>
                                                    <div className="font-medium">{prod.descripcion.split(',')[0]}</div>
                                                    <div className="text-xs text-gray-500">{prod.partida_arancelaria}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold">{formatNumber(prod[unidad]['2025'])}</td>
                                        <td className="px-6 py-4 text-sm text-right">{formatNumber(prod[unidad]['2024'])}</td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold">
                                            {prod[unidad].participacion_porcentaje}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RANKING HÉROES Y VILLANOS */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-green-900 mb-4">🚀 HÉROES (+%)</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span>☕ Café</span><span className="font-bold text-green-700">+79.7%</span></div>
                        <div className="flex justify-between"><span>🌴 Aceite palma</span><span className="font-bold text-green-700">+90.0%</span></div>
                        <div className="flex justify-between"><span>🍌 Banano</span><span className="font-bold text-green-700">+14.9%</span></div>
                        <div className="flex justify-between"><span>🥑 Aguacate</span><span className="font-bold text-green-700">+25.8%</span></div>
                    </div>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-red-900 mb-4">💥 VILLANOS (-%)</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span>⬆️ Hulla térmica</span><span className="font-bold text-red-700">-38.2%</span></div>
                        <div className="flex justify-between"><span>⛽ Gasoil</span><span className="font-bold text-red-700">-32.5%</span></div>
                        <div className="flex justify-between"><span>🪙 Ferroníquel</span><span className="font-bold text-red-700">-14.2%</span></div>
                        <div className="flex justify-between"><span>⚡ Energía</span><span className="font-bold text-red-700">-10.5%</span></div>
                    </div>
                </div>
            </div>

            {/* TOTALES */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900">💰 TOTAL FOB 2025</h3>
                    <p className="text-4xl font-bold text-blue-700">32.7M</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900">⚖️ TOTAL TONELADAS 2025</h3>
                    <p className="text-4xl font-bold text-gray-700">57.8M</p>
                </div>
            </div>
        </div>
    );
};

export default TopProductosExportados;