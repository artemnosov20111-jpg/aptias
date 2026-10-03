import { useEffect, useState } from "react";
import {
  X, Calculator, CheckCircle2, FileText, Send, ArrowRight, Loader2,
  Building2, Package, Clock,
} from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, generateReserveId } from "@/lib/format";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface RequestModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: number, requestId: string) => void;
}

export function RequestModal({ product, onClose, onConfirm }: RequestModalProps) {
  const [volume, setVolume] = useState("");
  const [inn, setInn] = useState("");
  const [orgName, setOrgName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState(false);

  useEffect(() => {
    if (product) {
      setVolume(String(product.minOrder ?? product.quantity));
      setInn("");
      setOrgName("");
      setContactPerson("");
      setPhone("");
      setConfirmed(false);
      setRequestId("");
      setSubmitting(false);
      setSendError(false);
    }
  }, [product]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!product) return null;

  const requestedVolume = parseFloat(volume) || 0;
  const total = requestedVolume * product.liquidationPrice;
  const isValid =
    inn.trim().length >= 10 &&
    orgName.trim().length > 0 &&
    contactPerson.trim().length > 0 &&
    phone.trim().length >= 6;

  const handleConfirm = async () => {
    const id = generateReserveId();
    setRequestId(id);
    setSubmitting(true);
    setSendError(false);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/telegram-reserve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            productName: product.name,
            volume: `${requestedVolume} ${product.unit}`,
            total: `${Math.round(total)}`,
            orgName,
            inn,
            contactPerson,
            phone,
            reserveId: id,
          }),
        },
      );

      if (!response.ok) setSendError(true);
    } catch {
      setSendError(true);
    }

    setSubmitting(false);
    setConfirmed(true);
    onConfirm(product.id, id);
  };

  const telegramText = `Заявка на КП #${requestId}
Товар: ${product.name}
Производитель: ${product.manufacturer}
Объём: ${requestedVolume} ${product.unit}
Сумма: ${formatPrice(total)}
ИНН: ${inn}
Организация: ${orgName}
Контакт: ${contactPerson}
Телефон: ${phone}`;

  const telegramUrl = `https://t.me/aptias?text=${encodeURIComponent(telegramText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {confirmed ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Заявка #{requestId} отправлена</h3>
            <p className="mt-2 text-sm text-slate-500">
              Менеджер подготовит счёт с НДС 20% на «{product.name}» и свяжется с вами в течение
              рабочего дня.
            </p>
            {sendError && (
              <div className="mt-3 rounded-lg bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                Не удалось отправить автоматически. Используйте кнопку ниже.
              </div>
            )}
            <div className="mt-5 rounded-lg bg-slate-50 p-4 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Запрашиваемый объём:</span>
                <span className="font-semibold text-slate-900">
                  {requestedVolume} {product.unit}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Расчётная сумма с НДС:</span>
                <span className="font-bold text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#2AABEE] to-[#229ED9] py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-xl active:scale-[0.98]"
            >
              <Send className="h-5 w-5" />
              Открыть в Telegram для выставления счёта
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <button
              onClick={onClose}
              className="mt-3 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Вернуться в каталог
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Запрос счёта с НДС / КП</h3>
                <p className="mt-1 text-sm text-slate-500">{product.name}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <Building2 className="h-3.5 w-3.5" />
                  {product.supplier.name}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5 rounded-xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  Калькулятор заказа
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-slate-500">
                      Объём, {product.unit}
                      {product.minOrder ? ` (мин. ${product.minOrder})` : ""}
                    </label>
                    <input
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      min={product.minOrder ?? 0}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Итого с НДС</p>
                    <p className="text-xl font-bold text-blue-600">{formatPrice(total)}</p>
                  </div>
                </div>
                {product.leadTime && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    Срок отгрузки: {product.leadTime}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">ИНН компании</label>
                    <input
                      type="text"
                      value={inn}
                      onChange={(e) => setInn(e.target.value)}
                      placeholder="10 или 12 цифр"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Организация</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="ООО «СтройМонтаж»"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Контактное лицо</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Иванов И. И."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Телефон</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-700">
                <FileText className="h-4 w-4 shrink-0" />
                Счёт будет выставлен с НДС 20%. Закрывающие документы — через ЭДО (Диадок / СБИС).
              </div>

              <button
                onClick={handleConfirm}
                disabled={!isValid || submitting}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                  isValid && !submitting
                    ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Запросить счёт / КП
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
