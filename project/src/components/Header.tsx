import { useState } from "react";
import { Boxes, ChevronDown, Settings, Upload, FileText } from "lucide-react";
import { REGIONS } from "@/data/products";

export type TabId = "exchange" | "factory" | "spec" | "suppliers" | "safe-deal";

const TABS: { id: TabId; label: string; short: string }[] = [
  { id: "exchange", label: "Биржа резервов (дисконт до 50%)", short: "Биржа" },
  { id: "factory", label: "Новая продукция (заводы и дистрибьюторы)", short: "Заводы" },
  { id: "spec", label: "Заявка по спецификации", short: "Спецификация" },
  { id: "suppliers", label: "Поставщикам", short: "Поставщикам" },
  { id: "safe-deal", label: "Безопасная сделка и ЭДО", short: "ЭДО" },
];

interface HeaderProps {
  region: string;
  onRegionChange: (regionId: string) => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onAdminImportClick: () => void;
}

export function Header({
  region,
  onRegionChange,
  activeTab,
  onTabChange,
  onAdminImportClick,
}: HeaderProps) {
  const [regionOpen, setRegionOpen] = useState(false);
  const [adminHover, setAdminHover] = useState(false);
  const currentRegion = REGIONS.find((r) => r.id === region) ?? REGIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Logo */}
          <button onClick={() => onTabChange("exchange")} className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/30">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-wide">
                КВОТА B2B <span className="font-normal text-blue-400">kvota.su</span>
              </h1>
              <p className="text-xs text-slate-400">Единая биржа складских квот и проектных резервов</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {/* Region selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setRegionOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
              >
                <span className="text-slate-400">Регион:</span>
                <span>{currentRegion.label}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {regionOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setRegionOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl">
                    {REGIONS.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onRegionChange(r.id);
                          setRegionOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-slate-700 ${
                          r.id === region ? "text-blue-400" : "text-slate-200"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* EDO badge */}
            <div className="hidden items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-400 lg:flex">
              <FileText className="h-4 w-4" />
              <span>ЭДО • НДС 20%</span>
            </div>

            {/* Hidden admin toggle */}
            <div
              className="relative"
              onMouseEnter={() => setAdminHover(true)}
              onMouseLeave={() => setAdminHover(false)}
            >
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                aria-label="Администрирование"
              >
                <Settings className="h-4 w-4" />
              </button>
              {adminHover && (
                <button
                  onClick={onAdminImportClick}
                  className="absolute right-0 top-full z-30 mt-1 flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 shadow-xl transition hover:bg-slate-700"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Режим администратора: Загрузить прайс 1С
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-slate-800 pb-1 pt-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.short}</span>
            </button>
          ))}
        </nav>

        {/* Mobile region selector */}
        <div className="flex items-center gap-2 pb-3 sm:hidden">
          <span className="text-xs text-slate-400">Регион:</span>
          <select
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200"
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
