"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Topbar */}
      <div className="bg-red-800 text-white text-sm py-2 px-4 flex justify-between items-center">
        <span>Visualización desarrollada a partir de datos públicos del DANE = Departamento Administrativo Nacional de Estadística - DANE</span>
        <span>Jueves 16 de octubre de 2025</span>
      </div>

      {/* Encabezado */}
      <header className="bg-white shadow p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Estadísticas de Exportaciones de Colombia
        </h1>
        <p className="mt-2 text-gray-600">
          Información procesada por el DANE y la DIAN — Agosto 2025
        </p>
      </header>

      {/* Sección principal */}
      <section className="max-w-5xl mx-auto p-6 space-y-6">
        <p>
          En agosto de 2025, las ventas externas del país fueron{" "}
          <strong>US$3.842,2 millones FOB</strong> y presentaron una caída de{" "}
          <strong>0,1%</strong> frente a agosto de 2024. Este resultado se debió
          principalmente a la disminución de <strong>18,1%</strong> en el grupo
          de <em>Combustibles y productos de industrias extractivas</em>.
        </p>

        <p>
          Participación por grupos de productos:
          <ul className="list-disc ml-6 mt-2">
            <li>Combustibles e industrias extractivas: 36,8%</li>
            <li>Agropecuarios, alimentos y bebidas: 33,1%</li>
            <li>Manufacturas: 22,0%</li>
            <li>Otros sectores: 8,2%</li>
          </ul>
        </p>

        <p>
          En agosto de 2025 se exportaron <strong>11,2 millones</strong> de
          barriles de petróleo crudo, lo que representó una caída de{" "}
          <strong>24,4%</strong> frente a agosto de 2024.
        </p>

        <div className="border-l-4 border-blue-600 pl-4 text-sm text-gray-700 italic">
          “A partir de enero de 2025, las estadísticas de Exportaciones adoptan
          la nomenclatura M49 de la División de Estadísticas de las Naciones
          Unidas. La correlativa ALADI vs. M49 está disponible junto con los
          microdatos en el Archivo Nacional de Datos (ANDA).”
        </div>
      </section>

      {/* Acceso a visualizaciones */}
      <section className="bg-gray-100 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Visualizaciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/ExportacionAduana"
              className="bg-white shadow hover:shadow-md p-6 rounded-xl border"
            >
              <h3 className="font-bold text-lg">Exportaciones por Aduana</h3>
              <p className="text-sm text-gray-600">
                Desglose de exportaciones por puntos aduaneros nacionales.
              </p>
            </Link>

            <Link
              href="/PetroleoData"
              className="bg-white shadow hover:shadow-md p-6 rounded-xl border"
            >
              <h3 className="font-bold text-lg">Exportaciones de Petróleo</h3>
              <p className="text-sm text-gray-600">
                Análisis de volúmenes, precios y destinos del crudo.
              </p>
            </Link>

            <Link
              href="/TopProductosExportados"
              className="bg-white shadow hover:shadow-md p-6 rounded-xl border"
            >
              <h3 className="font-bold text-lg">Top Productos Exportados</h3>
              <p className="text-sm text-gray-600">
                Ranking de productos y sectores de mayor participación.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Referencias */}
      <footer className="bg-gray-900 text-white text-sm py-8 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <p>
            Fuente oficial:{" "}
            <a
              href="https://www.dane.gov.co/index.php/estadisticas-por-tema/comercio-internacional/exportaciones"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300"
            >
              DANE - Estadísticas de Exportaciones
            </a>
          </p>
          <p>
            Archivo base:{" "}
            <a
              href="https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.dane.gov.co%2Ffiles%2Foperaciones%2FEXPORTACIONES%2Fanex-EXPORTACIONES-ago2025.xls"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300"
            >
              anex-EXPORTACIONES-ago2025.xls
            </a>
          </p>
          <p className="text-gray-400">
            Visualización desarrollada a partir de datos públicos del DANE.
          </p>
        </div>
      </footer>
    </main>
  );
}
