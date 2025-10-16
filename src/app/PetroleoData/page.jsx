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

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

ChartJS2.register(ArcElement);

const PetroleumExportData = () => {
  // Datos del JSON
  const data = require('../../../sources/Exportacion_petroleo_crudo_segun_destino.json');

  const [periodo, setPeriodo] = useState('EneroAgosto');
  const [medida, setMedida] = useState('MilesDolaresFOB');

  // Función para formatear variación
  const formatVariacion = (variacion) => {
    if (variacion === null) return 'N/A';
    return `${variacion >= 0 ? '+' : ''}${variacion.toFixed(1)}%`;
  };

  // Función para obtener color de variación
  const getVariacionColor = (variacion) => {
    if (variacion === null) return '#6b7280';
    return variacion >= 0 ? '#10b981' : '#ef4444';
  };

  // Preparar datos para gráficos
  const chartData = {
    labels: Object.keys(data).filter(key => key !== 'Total'),
    datasets: [
      {
        label: '2024',
        data: Object.keys(data).filter(key => key !== 'Total').map(key => 
          data[key][periodo][medida]['2024p']
        ),
        backgroundColor: '#3b82f6',
      },
      {
        label: '2025',
        data: Object.keys(data).filter(key => key !== 'Total').map(key => 
          data[key][periodo][medida]['2025p']
        ),
        backgroundColor: '#8b5cf6',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${periodo} - ${medida === 'MilesDolaresFOB' ? 'Miles de Dólares FOB' : 'Millones de Barriles'}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return medida === 'MilesDolaresFOB' ? 
              (value / 1000).toFixed(0) + 'K' : 
              value.toFixed(1);
          }
        }
      }
    }
  };

  // Datos para Doughnut (Participación 2025)
  const doughnutData = {
    labels: Object.keys(data).filter(key => key !== 'Total'),
    datasets: [{
      data: Object.keys(data).filter(key => key !== 'Total').map(key => 
        data[key][periodo][medida]['2025p']
      ),
      backgroundColor: [
        '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
        '#ef4444', '#06b6d4', '#8b5cf6'
      ]
    }]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md m-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        📊 Exportaciones de Petróleo - Ecuador
      </h1>

      {/* Controles */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select 
              value={periodo} 
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="EneroAgosto">Enero - Agosto</option>
              <option value="Agosto">Agosto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medida
            </label>
            <select 
              value={medida} 
              onChange={(e) => setMedida(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="MilesDolaresFOB">Miles de Dólares FOB</option>
              <option value="MillonesBarriles">Millones de Barriles</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Gráfico de Barras */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Comparativo 2024 vs 2025</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Gráfico Doughnut */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Participación 2025</h2>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* Tabla Detallada */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold bg-gray-50 px-6 py-4 border-b">
          📋 Detalle por Destino - {periodo}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2024
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2025
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(data).map(([pais, info]) => (
                <tr key={pais} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pais}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {medida === 'MilesDolaresFOB' ? 
                      (info[periodo][medida]['2024p']/1000).toFixed(0) + 'K' : 
                      info[periodo][medida]['2024p'].toFixed(1)
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {medida === 'MilesDolaresFOB' ? 
                      (info[periodo][medida]['2025p']/1000).toFixed(0) + 'K' : 
                      info[periodo][medida]['2025p'].toFixed(1)
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span 
                      className={`font-medium ${
                        getVariacionColor(info[periodo][medida].Variacion)
                      }`}
                    >
                      {formatVariacion(info[periodo][medida].Variacion)}
                    </span>
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

export default PetroleumExportData;