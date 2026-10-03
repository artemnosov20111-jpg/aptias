import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  X, Upload, FileSpreadsheet, CheckCircle2, Loader2, AlertCircle,
} from "lucide-react";
import type { Product, Category, ProductUnit } from "@/types";

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

function guessCategory(name: string): Category {
  const lower = name.toLowerCase();
  if (lower.includes("кабель") || lower.includes("провод") || lower.includes("ввг") || lower.includes("кг-") || lower.includes("аввг") || lower.includes("вббшв")) {
    return "cable";
  }
  if (lower.includes("задвижк") || lower.includes("затвор") || lower.includes("кран") || lower.includes("вентиль")) {
    return "valve";
  }
  if (lower.includes("труб") || lower.includes("фитинг") || lower.includes("ппу")) {
    return "pipe";
  }
  if (lower.includes("болт") || lower.includes("гайк") || lower.includes("швеллер") || lower.includes("уголок") || lower.includes("арматур") || lower.includes("металл") || lower.includes("крепёж") || lower.includes("крепеж")) {
    return "metal";
  }
  return "other";
}

function guessUnit(raw: string): ProductUnit {
  const lower = raw.toLowerCase().trim();
  if (lower.startsWith("шт") || lower.includes("штук")) return "шт";
  if (lower.startsWith("кг") || lower.includes("кило")) return "кг";
  if (lower.startsWith("т") && !lower.startsWith("тр")) return "т";
  if (lower.includes("м2") || lower.includes("м²")) return "м²";
  if (lower.startsWith("л") || lower.includes("литр")) return "л";
  return "м";
}

function normalizeProduct(row: Record<string, unknown>, index: number): Product | null {
  const keys = Object.keys(row);
  const findKey = (patterns: string[]): string | undefined => {
    return keys.find((k) => {
      const lower = k.toLowerCase().trim();
      return patterns.some((p) => lower.includes(p));
    });
  };

  const nameKey = findKey(["наименован", "номенклат", "товар", "назван"]);
  const gostKey = findKey(["характерист", "гост", "марка", "описан"]);
  const qtyKey = findKey(["количество", "кол-во", "остаток", "объём", "объем"]);
  const unitKey = findKey(["ед", "единиц", "изм"]);
  const priceKey = findKey(["цена", "стоим", "прайс"]);

  const name = nameKey ? String(row[nameKey] ?? "").trim() : "";
  if (!name) return null;

  const gost = gostKey ? String(row[gostKey] ?? "").trim() : "";
  const fullName = gost ? `${name} ${gost}` : name;

  const qtyRaw = qtyKey ? String(row[qtyKey] ?? "0").replace(/\s/g, "").replace(",", ".") : "0";
  const quantity = parseFloat(qtyRaw) || 0;

  const unitRaw = unitKey ? String(row[unitKey] ?? "шт").trim() : "шт";
  const unit = guessUnit(unitRaw);

  const priceRaw = priceKey ? String(row[priceKey] ?? "0").replace(/\s/g, "").replace(",", ".") : "0";
  const liquidationPrice = Math.round((parseFloat(priceRaw) || 0) * 0.6);
  const marketPrice = Math.round(liquidationPrice / 0.6);

  const category = guessCategory(fullName);
  const quantityDescription = `${new Intl.NumberFormat("ru-RU").format(quantity)} ${unit}`;

  return {
    id: 10000 + index,
    name: fullName,
    manufacturer: "Импорт из 1С",
    category,
    unit,
    quantity,
    quantityDescription,
    location: "Уточняется",
    region: "all",
    marketPrice: marketPrice || 100,
    liquidationPrice: liquidationPrice || 60,
    reserved: false,
    hasCertificate: true,
    shipping: "Самовывоз / доставка ТК",
    verifiedAt: "только что (импорт)",
    source: "stock",
    supplier: {
      name: "Импорт из 1С",
      verified: false,
      innChecked: false,
      yearsOnMarket: 0,
    },
    techSpecs: gost
      ? [{ label: "Характеристика / ГОСТ", value: gost }]
      : [{ label: "Источник", value: "Импорт из 1С" }],
  };
}

export function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedCount, setParsedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setFileName(null);
      setDragOver(false);
      setParsing(false);
      setParsedCount(0);
      setError(null);
      setImported(false);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setError(null);
    setParsing(true);
    setImported(false);

    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const products = rows
        .map((row, i) => normalizeProduct(row, i))
        .filter((p): p is Product => p !== null);

      if (products.length === 0) {
        setError("Не удалось распознать ни одной позиции. Проверьте колонки: Наименование, Количество, Цена.");
        setParsing(false);
        return;
      }

      setParsedCount(products.length);
      setParsing(false);
      onImport(products);
      setImported(true);
    } catch {
      setError("Ошибка чтения файла. Убедитесь, что это корректный .xlsx или .csv файл.");
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {imported ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Прайс загружен</h3>
            <p className="mt-2 text-sm text-slate-500">
              Из файла «{fileName}» распознано и добавлено в каталог{" "}
              <span className="font-bold text-slate-700">{parsedCount}</span> позиций. Каталог
              витрины обновлён.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Перейти к каталогу
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Загрузка прайса из 1С</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Импорт остатков из выгрузки 1С / Excel в каталог витрины
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !parsing && fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
                  dragOver
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
                } ${parsing ? "pointer-events-none" : ""}`}
              >
                {parsing ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-slate-600">Обработка файла...</span>
                  </div>
                ) : fileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="h-10 w-8 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">{fileName}</span>
                    <span className="text-xs text-blue-600">Нажмите, чтобы заменить</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      Перетащите сюда отчет по остаткам из 1С
                    </span>
                    <span className="text-xs text-slate-400">.xlsx или .csv</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                <p className="font-medium text-slate-600">Ожидаемые колонки:</p>
                <p className="mt-1">Наименование, Характеристики/ГОСТ, Количество, Ед. изм., Цена</p>
                <p className="mt-1.5 text-slate-400">
                  Приложение автоматически определит колонки, нормализует названия и добавит товары
                  в каталог.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
