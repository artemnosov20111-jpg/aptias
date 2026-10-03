import { Search, LayoutGrid, Table, CheckSquare } from "lucide-react";
import { CATEGORIES, DISCOUNT_FILTERS } from "@/data/products";
import type { ProductSource } from "@/types";

interface FiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  discount: string;
  onDiscountChange: (v: string) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (v: boolean) => void;
  view: "table" | "cards";
  onViewChange: (v: "table" | "cards") => void;
  totalCount: number;
  filteredCount: number;
  source: "all" | ProductSource;
  onSourceChange: (v: "all" | ProductSource) => void;
}

const SOURCE_FILTERS: { id: "all" | ProductSource; label: string }[] = [
  { id: "all", label: "Все источники" },
  { id: "stock", label: "Складской резерв" },
  { id: "factory", label: "Новая от завода" },
];

export function Filters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  discount,
  onDiscountChange,
  inStockOnly,
  onInStockOnlyChange,
  view,
  onViewChange,
  totalCount,
  filteredCount,
  source,
  onSourceChange,
}: FiltersProps) {
  return (
    <div className="sticky top-[120px] z-30 -mx-4 mb-6 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по названию, марке или ГОСТу — например «ВВГнг 3х2.5», «30ч6бр»"
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {/* Source filter */}
        <div className="flex flex-wrap gap-1.5">
          {SOURCE_FILTERS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSourceChange(s.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                source === s.id
                  ? s.id === "stock"
                    ? "bg-amber-500 text-white"
                    : s.id === "factory"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                category === cat.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        {/* Discount filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Скидка:</span>
          <div className="flex gap-1.5">
            {DISCOUNT_FILTERS.map((d) => (
              <button
                key={d.id}
                onClick={() => onDiscountChange(d.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  discount === d.id
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        {/* In stock checkbox */}
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <button
            onClick={() => onInStockOnlyChange(!inStockOnly)}
            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${
              inStockOnly
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {inStockOnly && <CheckSquare className="h-3.5 w-3.5" />}
          </button>
          Только в наличии
        </label>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-slate-400 sm:inline">
            {filteredCount} из {totalCount}
          </span>
          <div className="flex overflow-hidden rounded-lg border border-slate-300">
            <button
              onClick={() => onViewChange("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition ${
                view === "table"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Таблица</span>
            </button>
            <button
              onClick={() => onViewChange("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition ${
                view === "cards"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Карточки</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
