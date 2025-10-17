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

const ExportacionesGruposCapítulosCUCI = () => {
    const data = require("../../../sources/Exportaciones_según_grupos_de_productos_y_capítulos.json");

  const [view, setView] = useState('resumen');
  const [periodo, setPeriodo] = useState('enero_agosto');
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [unidad, setUnidad] = useState('valor_dolares');

  // Utilitarios
  const formatNumber = (value) => {
    if (value >= 10000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000000) return (value / 1000).toFixed(0) + 'K';
    return value.toString();
  };

  const formatVariacion = (pct) => {
    if (pct === null || pct === undefined) return 'N/A';
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
  };

  const formatContribucion = (contrib) => {
    if (contrib === null || contrib === undefined) return 'N/A';
    return `${contrib.toFixed(1)}pp`;
  };

  const getColorCategoria = (id) => {
    const colors = {
      'agropecuario': '#10b981', 'combustibles': '#f59e0b',
      'manufacturas': '#3b82f6', 'otros': '#8b5cf6'
    };
    return colors[id] || '#6b7280';
  };

  const getColorContribucion = (contrib) => 
    contrib >= 5 ? '#10b981' : contrib >= 0 ? '#059669' : '#dc2626';

  // Datos para gráficos
  const categoriasData = {
    labels: data.categorias.map(c => c.nombre),
    datasets: [
      { 
        label: periodo === 'enero_agosto' ? 'Ene-Ago 2024' : 'Ago 2024', 
        data: data.categorias.map(c => c.totales[unidad][periodo + '_2024']), 
        backgroundColor: '#6b7280' 
      },
      { 
        label: periodo === 'enero_agosto' ? 'Ene-Ago 2025' : 'Ago 2025', 
        data: data.categorias.map(c => c.totales[unidad][periodo + '_2025']), 
        backgroundColor: '#3b82f6' 
      }
    ]
  };

  const contribucionData = {
    labels: data.categorias.map(c => c.nombre),
    datasets: [{
      data: data.categorias.map(c => c.totales[unidad][periodo + '_contribucion']),
      backgroundColor: data.categorias.map(c => getColorContribucion(c.totales[unidad][periodo + '_contribucion']))
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📦 {data.metadata.titulo}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📅 {data.metadata.periodo}</span>
          <span>🏢 {data.metadata.region}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {periodo === 'enero_agosto' ? '+0.5%' : '-0.1%'}
          </span>
          <span>📊 {data.metadata.fuente}</span>
          <span className="text-xs">🗓️ {data.metadata.fecha_actualizacion}</span>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <select value={view} onChange={e => setView(e.target.value)} className="p-2 border rounded">
            <option value="resumen">📊 Resumen Ejecutivo</option>
            <option value="categorias">🏢 Por Categorías</option>
            <option value="capitulos">📋 Por Capítulos</option>
          </select>
          <select value={periodo} onChange={e => setPeriodo(e.target.value)} className="p-2 border rounded">
            <option value="enero_agosto">📅 Ene-Ago</option>
            <option value="agosto">🗓️ Agosto</option>
          </select>
          <select value={unidad} onChange={e => setUnidad(e.target.value)} className="p-2 border rounded">
            <option value="valor_dolares">💰 Valor (Miles $)</option>
            <option value="toneladas_metricas">⚖️ Toneladas</option>
          </select>
          {view === 'capitulos' && (
            <select value={selectedCategoria?.id || ''} onChange={e => setSelectedCategoria(data.categorias.find(c => c.id === e.target.value))} className="p-2 border rounded">
              <option value="">Seleccionar Categoría...</option>
              {data.categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* KPIs CRÍTICOS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className={`bg-green-50 rounded-lg p-6 text-center ${getColorContribucion(8.5)}`}>
          <h3 className="text-lg font-semibold text-green-900">☕ AGRO +37.4%</h3>
          <p className="text-2xl font-bold text-green-700">+10.1M</p>
          <p className="text-sm">+8.5pp TOTAL</p>
        </div>
        <div className={`bg-yellow-50 rounded-lg p-6 text-center ${getColorContribucion(-9.5)}`}>
          <h3 className="text-lg font-semibold text-yellow-900">⛽ COMBUST. -19.6%</h3>
          <p className="text-2xl font-bold text-yellow-700">-3.1M</p>
          <p className="text-sm">-9.5pp TOTAL</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-purple-900">🥩 CARNE +114%</h3>
          <p className="text-2xl font-bold text-purple-700">+65K</p>
        </div>
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-900">⬆️ HULLA -35.6%</h3>
          <p className="text-2xl font-bold text-red-700">-1.7M</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-orange-900">💰 ORO +12.5%</h3>
          <p className="text-2xl font-bold text-orange-700">+0.3M</p>
        </div>
      </div>

      {/* GRÁFICOS DINÁMICOS */}
      {view === 'resumen' && (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              📊 {periodo === 'enero_agosto' ? 'Ene-Ago' : 'Agosto'} {unidad === 'valor_dolares' ? '$' : 'Ton'}
            </h2>
            <Bar data={categoriasData} options={options} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1 md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">
              🥧 Participación {periodo === 'enero_agosto' ? 'Ene-Ago' : 'Agosto'} 2025
            </h2>
            <Doughnut 
              data={{
                labels: data.categorias.map(c => c.nombre),
                datasets: [{
                  data: data.categorias.map(c => c.totales[unidad][periodo + '_2025']),
                  backgroundColor: data.categorias.map(c => getColorCategoria(c.id))
                }]
              }} 
            />
          </div>
        </div>
      )}

      {view === 'contribucion' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📈 Contribución al Cambio Total ({periodo})</h2>
          <Bar data={contribucionData} options={{...options, indexAxis: 'y'}} />
        </div>
      )}

      {selectedCategoria && view === 'capitulos' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{selectedCategoria.nombre} - Capítulos</h2>
          <Bar 
            data={{
              labels: selectedCategoria.capitulos.map(c => c.descripcion),
              datasets: [
                { label: '2024', data: selectedCategoria.capitulos.map(c => c[unidad][periodo + '_2024']), backgroundColor: '#6b7280' },
                { label: '2025', data: selectedCategoria.capitulos.map(c => c[unidad][periodo + '_2025']), backgroundColor: '#3b82f6' }
              ]
            }} 
            options={options} 
          />
        </div>
      )}

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold bg-gray-50 px-6 py-4 border-b">
          📋 {view === 'resumen' ? 'Resumen Categorías' : view === 'capitulos' ? `${selectedCategoria?.nombre || ''}` : 'Análisis Completo'}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {periodo === 'enero_agosto' ? 'Ene-Ago' : 'Agosto'} 2025
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {periodo === 'enero_agosto' ? 'Ene-Ago' : 'Agosto'} 2024
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {view === 'capitulos' && selectedCategoria ? 
                selectedCategoria.capitulos.map((cap, i) => (
                  <tr key={cap.codigo} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-3 flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="font-medium">{cap.descripcion}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">{formatNumber(cap[unidad][periodo + '_2025'])}</td>
                    <td className="px-6 py-4 text-sm text-right">{formatNumber(cap[unidad][periodo + '_2024'])}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${cap[unidad][periodo + '_variacion_porcentual'] >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {formatVariacion(cap[unidad][periodo + '_variacion_porcentual'])}
                      </span>
                    </td>
                  </tr>
                )) :
                data.categorias.map((cat, i) => (
                  <tr key={cat.id} className="hover:bg-gray-50" onClick={() => view === 'capitulos' && setSelectedCategoria(cat)}>
                    <td className="px-6 py-4 cursor-pointer">
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full text-white text-xs font-bold mr-3 flex items-center justify-center`}
                              style={{backgroundColor: getColorCategoria(cat.id)}}>
                          {i + 1}
                        </span>
                        <span className="font-medium">{cat.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">{formatNumber(cat.totales[unidad][periodo + '_2025'])}</td>
                    <td className="px-6 py-4 text-sm text-right">{formatNumber(cat.totales[unidad][periodo + '_2024'])}</td>

                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ALERTAS CRÍTICAS */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`bg-green-50 rounded-lg p-4 ${getColorContribucion(8.5)}`}>
          <h3 className="font-semibold">🚀 HÉROE ☕</h3>
          <p className="font-bold">Agro +37.4%</p>
        </div>
        <div className={`bg-yellow-50 rounded-lg p-4 ${getColorContribucion(-9.5)}`}>
          <h3 className="font-semibold">💥 CRISIS ⛽</h3>
          <p className="font-bold">Combust. -19.6%</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="font-semibold">🥩 EXPLOSIÓN</h3>
          <p className="text-orange-600 font-bold">Carne +114%</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="font-semibold">⬆️ DESASTRE</h3>
          <p className="text-red-600 font-bold">Hulla -35.6%</p>
        </div>
      </div>
    </div>
  );
};

export default ExportacionesGruposCapítulosCUCI;