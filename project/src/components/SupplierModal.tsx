import { useEffect, useState, useRef } from "react";
import { X, Upload, FileSpreadsheet, Send, CheckCircle2 } from "lucide-react";

interface SupplierModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export function SupplierModal({ open, onClose, onSubmit }: SupplierModalProps) {
  const [inn, setInn] = useState("");
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setInn("");
      setPhone("");
      setFileName(null);
      setDragOver(false);
      setSubmitted(false);
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

  const handleFile = (file: File) => {
    const validExtensions = [".xlsx", ".xls", ".csv", ".dbf"];
    const isValid = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (isValid) {
      setFileName(file.name);
    } else {
      setFileName(file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const isValid = inn.trim().length >= 10 && phone.trim().length >= 6;

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Заявка принята</h3>
            <p className="mt-2 text-sm text-slate-500">
              Ваш прайс-лист{fileName ? ` «${fileName}»` : ""} направлен на оценку. Мы рассчитаем
              предложение по выкупу и свяжемся с вами в течение 1–2 рабочих дней.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Сдать остатки на реализацию</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Заполните форму — мы оценим ваш неликвид за 1–2 дня
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  ИНН компании
                </label>
                <input
                  type="text"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  placeholder="10 или 12 цифр"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Телефон для связи
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Прайс-лист (Excel / 1С)
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
                    dragOver
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                >
                  {fileName ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
                      <span className="text-sm font-medium text-slate-700">{fileName}</span>
                      <span className="text-xs text-blue-600">Нажмите, чтобы заменить</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        Перетащите файл сюда или нажмите для выбора
                      </span>
                      <span className="text-xs text-slate-400">.xlsx, .xls, .csv, .dbf</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.dbf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                  isValid
                    ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                <Send className="h-4 w-4" />
                Отправить на оценку
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
