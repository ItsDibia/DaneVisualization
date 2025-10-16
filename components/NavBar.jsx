"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
    { name: "Home", path: "/" },
  { name: "Exportación Aduana", path: "/ExportacionAduana" },
  { name: "Grupos Capítulos CUCI", path: "/ExportacionesGruposCapitulosCUCI" },
  { name: "Grupos Económicos", path: "/ExportacionesGruposEconomicos" },
  { name: "Grupos Países Colombia", path: "/ExportacionesGruposPaisesColombia" },
  { name: "Tradicionales / No Tradicionales", path: "/ExportacionesTradicionalesNoTradicionales" },
  { name: "Países y Capítulos Arancel", path: "/ExportacionPaises_capitulos_Arancel" },
  { name: "Petróleo", path: "/PetroleoData" },
  { name: "Top Productos Exportados", path: "/TopProductosExportados" }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-lg">
      <ul className="flex flex-wrap gap-6 justify-center">
        {routes.map((route) => {
          const active = pathname === route.path;
          return (
            <li key={route.path}>
              <Link
                href={route.path}
                className={`transition-colors duration-200 ${
                  active
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "hover:text-blue-300"
                }`}
              >
                {route.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
