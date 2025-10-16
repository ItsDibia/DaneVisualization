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

// Registrar componentes
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS2.register(ArcElement);

const ExportacionesAduanaColombia = () => {
  const data = require("../../../sources/exportaciones_enero_agosto_2025.json");
  const [view, setView] = useState('top10'); // 'top10', 'all', 'variacion'

  // Funciones utilitarias
  const formatNumber = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
    return value.toString();
  };

  const formatVariacion = (variacion) => {
    if (variacion === null) return 'N/A';
    return `${variacion >= 0 ? '+' : ''}${variacion.toFixed(1)}%`;
  };

  const getVariacionColor = (variacion) => {
    if (variacion === null) return '#6b7280';
    if (variacion >= 50) return '#10b981'; // Verde fuerte
    if (variacion >= 0) return '#059669';
    if (variacion <= -50) return '#dc2626'; // Rojo fuerte
    return '#ef4444';
  };

  // Filtrar datos según vista
  const getFilteredData = () => {
    let filtered = [...data.exportaciones];
    
    if (view === 'top10') {
      filtered = filtered
        .sort((a, b) => b.FOB_2025 - a.FOB_2025)
        .slice(0, 10);
    } else if (view === 'variacion') {
      filtered = filtered
        .sort((a, b) => Math.abs(b['Variacion_%'] || 0) - Math.abs(a['Variacion_%'] || 0))
        .filter(item => item['Variacion_%'] !== null);
    }
    
    return filtered;
  };

  const filteredData = getFilteredData();

  // Datos para gráficos
  const chartData = {
    labels: filteredData.map(item => item.Aduana),
    datasets: [
      {
        label: '2024',
        data: filteredData.map(item => item.FOB_2024),
        backgroundColor: '#3b82f6',
      },
      {
        label: '2025',
        data: filteredData.map(item => item.FOB_2025),
        backgroundColor: '#8b5cf6',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `${view === 'top10' ? 'Top 10 Aduanas' : view === 'variacion' ? 'Mayor Variación' : 'Todas las Aduanas'} - ${data.unidad.valor}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: formatNumber }
      },
      x: { ticks: { maxRotation: 45 } }
    }
  };

  // Doughnut para Top 5
  const top5Data = data.exportaciones
    .sort((a, b) => b.FOB_2025 - a.FOB_2025)
    .slice(0, 5);

  const doughnutData = {
    labels: top5Data.map(item => item.Aduana),
    datasets: [{
      data: top5Data.map(item => item.FOB_2025),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
    }]
  };

  // Totales
  const total2024 = data.exportaciones.reduce((sum, item) => sum + item.FOB_2024, 0);
  const total2025 = data.exportaciones.reduce((sum, item) => sum + item.FOB_2025, 0);
  const variacionTotal = ((total2025 - total2024) / total2024 * 100);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md m-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        📦 Exportaciones por Aduana - Colombia
        <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {data.periodo}
        </span>
      </h1>

      {/* Controles */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select 
            value={view} 
            onChange={(e) => setView(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="top10">Top 10 Aduanas</option>
            <option value="variacion">Mayor Variación</option>
            <option value="all">Todas las Aduanas</option>
          </select>
          <div className="text-center md:col-span-2 bg-indigo-100 rounded-lg p-2">
            <span className="text-sm font-medium text-gray-700">
              {data.unidad.valor}
            </span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-green-900">Total 2024</h3>
          <p className="text-2xl font-bold text-green-700">{formatNumber(total2024)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-purple-900">Total 2025</h3>
          <p className="text-2xl font-bold text-purple-700">{formatNumber(total2025)}</p>
        </div>
        <div className={`bg-yellow-50 rounded-lg p-6 text-center ${getVariacionColor(variacionTotal)}`}>
          <h3 className="text-lg font-semibold  ">Variación Total</h3>
          <p className="text-2xl font-bold text-yellow-500">{formatVariacion(variacionTotal)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 ">
        {/* Gráfico de Barras */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Doughnut Top 5 */}
        <div className="bg-white rounded-lg shadow-md p-6 md:w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-center">🥧 Top 5 Aduanas 2025</h2>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold bg-gray-50 px-6 py-4 border-b">
          📋 Detalle {view === 'top10' ? 'Top 10' : view === 'variacion' ? 'por Variación' : ''} Aduanas
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aduana</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2024</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">2025</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variación</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={item.Aduana} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-block w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center mr-3 ${
                        index < 3 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{item.Aduana}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatNumber(item.FOB_2024)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                    {formatNumber(item.FOB_2025)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={`font-bold px-2 py-1 rounded-full text-xs ${
                      getVariacionColor(item['Variacion_%'])
                    }`}>
                      {formatVariacion(item['Variacion_%'])}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800">🚨 Mayor Caída</h3>
          <p className="text-red-600">
            {data.exportaciones.find(item => item['Variacion_%'] === Math.min(...data.exportaciones.map(i => i['Variacion_%'] || 0)))?.Aduana}: 
            <span className="font-bold">{formatVariacion(-100.0)}</span>
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800">🚀 Mayor Crecimiento</h3>
          <p className="text-green-600">
            {data.exportaciones.find(item => item['Variacion_%'] === Math.max(...data.exportaciones.map(i => i['Variacion_%'] || 0)))?.Aduana}: 
            <span className="font-bold">{formatVariacion(409.1)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportacionesAduanaColombia;