import { useRef, useState } from "react";
import {
  Upload, FileText, Calculator, CheckCircle2, ArrowRight, Clock, FileSpreadsheet,
} from "lucide-react";

interface SpecRequestPageProps {
  onSubmit: (data: { orgName: string; inn: string; phone: string; fileName: string | null }) => void;
}

export function SpecRequestPage({ onSubmit }: SpecRequestPageProps) {
  const [orgName, setOrgName] = useState("");
  const [inn, setInn] = useState("");
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = orgName.trim().length > 0 && inn.trim().length >= 10 && phone.trim().length >= 6;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ orgName, inn, phone, fileName });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Заявка принята!</h2>
        <p className="mt-3 text-sm text-slate-500">
          Мы получили вашу спецификацию{fileName ? ` (${fileName})` : ""}. Менеджер соберёт сводное
          коммерческое предложение от 20+ заводов и пришлёт его на указанный контакт в течение
          45 минут.
        </p>
        <button
          onClick={() => { setSubmitted(false); setOrgName(""); setInn(""); setPhone(""); setFileName(null); }}
          className="mt-6 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Calculator className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Заявка по спецификации</h2>
        <p className="mt-2 text-sm text-slate-500">
          Прикрепите ведомость материалов или проектную спецификацию — соберем единый счёт с
          лучшими ценами от 20+ заводов за 45 минут.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
            dragOver ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-400"
          }`}
        >
          {fileName ? (
            <div className="flex flex-col items-center gap-2">
              <FileSpreadsheet className="h-10 w-10 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">{fileName}</span>
              <span className="text-xs text-blue-600">Нажмите, чтобы заменить</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-slate-400" />
              <span className="text-sm text-slate-500">Перетащите файл сюда или нажмите для выбора</span>
              <span className="text-xs text-slate-400">Excel (.xlsx, .xls), PDF, скан (PNG/JPG)</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFileName(file.name);
            }}
          />
        </div>

        <div className="mt-6 space-y-3">
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Название компании"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
              placeholder="ИНН компании"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон для связи"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <Clock className="h-4 w-4 shrink-0" />
          Среднее время подготовки КП — 45 минут в рабочее время.
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition ${
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          Получить сводное КП
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* How it works */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: FileText, title: "1. Прикрепляете ведомость", desc: "Excel, PDF или скан спецификации" },
          { icon: Calculator, title: "2. Собираем КП от 20+ заводов", desc: "Сравниваем цены и сроки отгрузки" },
          { icon: CheckCircle2, title: "3. Получаете единый счёт", desc: "С НДС 20%, с возможностью ЭДО" },
        ].map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-4">
              <Icon className="mb-2 h-6 w-6 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
