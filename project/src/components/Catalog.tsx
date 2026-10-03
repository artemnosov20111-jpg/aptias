import {
  MapPin, Package, Factory, CheckCircle2, Lock, FileBadge,
  Truck, RefreshCw, BadgeCheck, Building2, ShieldCheck, FileText,
} from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, formatNumber, calcDiscount } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  onReserve: (product: Product) => void;
  onDetail: (product: Product) => void;
}

export function ProductCard({ product, onReserve, onDetail }: ProductCardProps) {
  const discount = calcDiscount(product.marketPrice, product.liquidationPrice);
  const isReserved = product.reserved;
  const isStock = product.source === "stock";
  const price = isStock ? product.liquidationPrice : product.liquidationPrice;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      {/* Top: source badge + status */}
      <div className="mb-3 flex items-start justify-between gap-2">
        {isStock ? (
          <span className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">
            -{discount}% • Спеццена со склада
          </span>
        ) : (
          <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
            Новый от производителя
          </span>
        )}
        {isReserved ? (
          <span className="flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Lock className="h-3.5 w-3.5" />
            Забронировано
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isStock ? "В наличии" : "Опт от завода"}
          </span>
        )}
      </div>

      {/* Name — clickable */}
      <button
        onClick={() => onDetail(product)}
        className="text-left text-sm font-semibold leading-snug text-slate-900 transition hover:text-blue-600 hover:underline"
      >
        {product.name}
      </button>

      {/* Source label */}
      <div className="mt-1.5 text-xs font-medium text-slate-500">
        {isStock ? "Проектный резерв (Сток)" : "Завод-изготовитель (Новый)"}
      </div>

      {/* Manufacturer */}
      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <Factory className="h-3.5 w-3.5" />
        {product.manufacturer}
      </div>

      {/* Supplier card — B2B Avito style */}
      <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <Building2 className="h-3.5 w-3.5 text-blue-600" />
          {product.supplier.name}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
          {product.supplier.verified && (
            <span className="flex items-center gap-0.5 text-emerald-600">
              <BadgeCheck className="h-3 w-3" />
              Проверенный поставщик КВОТА
            </span>
          )}
          {product.supplier.innChecked && (
            <span className="flex items-center gap-0.5">
              <ShieldCheck className="h-3 w-3" />
              ИНН проверен
            </span>
          )}
          <span>{product.supplier.yearsOnMarket} года на рынке</span>
        </div>
      </div>

      {/* Certificate badge */}
      {product.hasCertificate && (
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
          <FileBadge className="h-3.5 w-3.5 shrink-0" />
          Сертификат завода и паспорт в наличии
        </div>
      )}

      {/* Quantity + Location + Shipping */}
      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{product.quantityDescription}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {product.location}
        </div>
        <div className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-slate-400" />
          {product.shipping}
        </div>
        {!isStock && product.minOrder && (
          <div className="flex items-center gap-1.5 text-blue-600">
            <Package className="h-3 w-3" />
            Мин. партия: {formatNumber(product.minOrder)} {product.unit}
          </div>
        )}
        {!isStock && product.leadTime && (
          <div className="flex items-center gap-1.5 text-blue-600">
            <Clock className="h-3 w-3" />
            Срок отгрузки: {product.leadTime}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3 text-slate-400" />
          <span className="text-slate-400">{product.verifiedAt}</span>
        </div>
      </div>

      {/* VAT */}
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-600">
        <FileText className="h-3.5 w-3.5 text-slate-400" />
        Отгрузка с НДС 20%
      </div>

      <div className="flex-1" />

      {/* Prices */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">
              {isStock ? "Рыночная цена" : "Опт. цена с НДС"}
            </p>
            {isStock && (
              <p className="text-sm text-slate-400 line-through">
                {formatPrice(product.marketPrice)} / {product.unit}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-blue-600">
              {isStock ? "Цена ликвидации" : "Цена за ед."}
            </p>
            <p className="text-xl font-bold text-slate-900">
              {formatPrice(price)}
            </p>
            <p className="text-xs text-slate-400">за {product.unit}</p>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={() => onReserve(product)}
        disabled={isReserved}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
          isReserved
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : isStock
              ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
              : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]"
        }`}
      >
        {isReserved
          ? "Объём забронирован"
          : isStock
            ? "Забронировать объём (24ч)"
            : "Запросить счёт с НДС / КП"}
      </button>
    </div>
  );
}

// Inline clock icon (reused in card)
function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

interface ProductTableProps {
  products: Product[];
  onReserve: (product: Product) => void;
  onDetail: (product: Product) => void;
}

export function ProductTable({ products, onReserve, onDetail }: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Наименование / ГОСТ</th>
            <th className="hidden px-4 py-3 font-semibold lg:table-cell">Поставщик</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">Объём</th>
            <th className="hidden px-4 py-3 font-semibold lg:table-cell">Склад</th>
            <th className="px-4 py-3 font-semibold">Цена</th>
            <th className="px-4 py-3 font-semibold">Статус</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const discount = calcDiscount(product.marketPrice, product.liquidationPrice);
            const isStock = product.source === "stock";
            return (
              <tr key={product.id} className="transition hover:bg-slate-50">
                <td className="max-w-xs px-4 py-3">
                  <div className="mb-1 flex items-center gap-2">
                    {isStock ? (
                      <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-bold text-white">
                        -{discount}%
                      </span>
                    ) : (
                      <span className="rounded bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
                        Новый
                      </span>
                    )}
                    <button
                      onClick={() => onDetail(product)}
                      className="text-left font-medium text-slate-900 transition hover:text-blue-600 hover:underline"
                    >
                      {product.name}
                    </button>
                  </div>
                  {product.hasCertificate && (
                    <div className="flex items-center gap-1 text-xs text-emerald-700">
                      <FileBadge className="h-3 w-3 shrink-0" />
                      Сертификат и паспорт в наличии
                    </div>
                  )}
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <RefreshCw className="h-2.5 w-2.5" />
                    {product.verifiedAt}
                  </div>
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <div className="font-medium text-slate-700">{product.supplier.name}</div>
                  {product.supplier.verified && (
                    <div className="mt-0.5 flex items-center gap-0.5 text-xs text-emerald-600">
                      <BadgeCheck className="h-3 w-3" />
                      Проверен • {product.supplier.yearsOnMarket} года
                    </div>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                  {product.quantityDescription}
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <Truck className="h-3 w-3" />
                    {product.shipping}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                  {product.location}
                </td>
                <td className="px-4 py-3">
                  {isStock && (
                    <div className="text-xs text-slate-400 line-through">
                      {formatPrice(product.marketPrice)}/{product.unit}
                    </div>
                  )}
                  <div className="text-base font-bold text-slate-900">
                    {formatPrice(product.liquidationPrice)}
                  </div>
                  <div className="text-xs text-slate-400">с НДС 20%</div>
                </td>
                <td className="px-4 py-3">
                  {product.reserved ? (
                    <span className="flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <Lock className="h-3.5 w-3.5" />
                      Забронировано
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {isStock ? "В наличии" : "Опт"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onReserve(product)}
                    disabled={product.reserved}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      product.reserved
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : isStock
                          ? "bg-blue-600 text-white hover:bg-blue-500"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {product.reserved
                      ? "Забронировано"
                      : isStock
                        ? "Бронь (24ч)"
                        : "Запросить КП"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface CatalogProps {
  products: Product[];
  view: "table" | "cards";
  onReserve: (product: Product) => void;
  onDetail: (product: Product) => void;
}

export function Catalog({ products, view, onReserve, onDetail }: CatalogProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <Package className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">
          Ничего не найдено по заданным критериям
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Попробуйте изменить регион, категорию или поисковый запрос
        </p>
      </div>
    );
  }

  if (view === "table") {
    return <ProductTable products={products} onReserve={onReserve} onDetail={onDetail} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onReserve={onReserve}
          onDetail={onDetail}
        />
      ))}
    </div>
  );
}

export { formatNumber };
