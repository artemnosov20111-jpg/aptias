import { useEffect } from "react";
import {
  X, Factory, Package, MapPin, Truck, RefreshCw, FileBadge,
  CheckCircle2, Lock, ArrowRight, BadgeCheck, ShieldCheck, Building2, FileText,
} from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, calcDiscount } from "@/lib/format";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onReserve: (product: Product) => void;
}

export function ProductDetailModal({ product, onClose, onReserve }: ProductDetailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!product) return null;

  const discount = calcDiscount(product.marketPrice, product.liquidationPrice);
  const isReserved = product.reserved;
  const isStock = product.source === "stock";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-6">
          <div className="pr-8">
            <div className="mb-2 flex items-center gap-2">
              {isStock ? (
                <span className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">
                  -{discount}% • Сток
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
            <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Supplier card */}
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Building2 className="h-4 w-4 text-blue-600" />
              {product.supplier.name}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              {product.supplier.verified && (
                <span className="flex items-center gap-0.5 text-emerald-600">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Проверенный поставщик КВОТА
                </span>
              )}
              {product.supplier.innChecked && (
                <span className="flex items-center gap-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  ИНН проверен
                </span>
              )}
              <span>{product.supplier.yearsOnMarket} года на рынке</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
              <Factory className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Производитель</p>
                <p className="font-medium text-slate-700">{product.manufacturer}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
              <Package className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">{isStock ? "Объём на складе" : "Наличие / партия"}</p>
                <p className="font-medium text-slate-700">{product.quantityDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Склад</p>
                <p className="font-medium text-slate-700">{product.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
              <Truck className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Условия отгрузки</p>
                <p className="font-medium text-slate-700">{product.shipping}</p>
              </div>
            </div>
            {!isStock && product.minOrder && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm">
                <Package className="h-4 w-4 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-400">Мин. партия</p>
                  <p className="font-medium text-blue-700">{product.minOrder} {product.unit}</p>
                </div>
              </div>
            )}
            {!isStock && product.leadTime && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm">
                <RefreshCw className="h-4 w-4 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-400">Срок отгрузки</p>
                  <p className="font-medium text-blue-700">{product.leadTime}</p>
                </div>
              </div>
            )}
          </div>

          {/* Certificate + verification */}
          <div className="mt-3 flex flex-wrap gap-2">
            {product.hasCertificate && (
              <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <FileBadge className="h-3.5 w-3.5" />
                Сертификат завода и паспорт в наличии
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <FileText className="h-3 w-3" />
              Отгрузка с НДС 20%
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <RefreshCw className="h-3 w-3" />
              {product.verifiedAt}
            </span>
          </div>

          {/* Tech specs */}
          <h4 className="mt-6 text-sm font-bold text-slate-900">Технические характеристики</h4>
          <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {product.techSpecs.map((spec) => (
                  <tr key={spec.label} className="hover:bg-slate-50">
                    <td className="w-1/2 px-4 py-2.5 text-slate-500">{spec.label}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  {isStock ? "Рыночная цена" : "Опт. цена с НДС 20%"}
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
                <p className="text-2xl font-bold text-slate-900">
                  {formatPrice(product.liquidationPrice)}
                </p>
                <p className="text-xs text-slate-400">за {product.unit}</p>
              </div>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => {
              onClose();
              onReserve(product);
            }}
            disabled={isReserved}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition ${
              isReserved
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : isStock
                  ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
                  : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]"
            }`}
          >
            {isReserved ? (
              "Объём забронирован"
            ) : (
              <>
                {isStock ? "Забронировать объём (24ч)" : "Запросить счёт с НДС / КП"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
