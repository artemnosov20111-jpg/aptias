import { useState } from "react";
import {
  Upload, CheckCircle2, ArrowRight, FileSpreadsheet, ShieldCheck,
  Truck, Factory, Boxes,
} from "lucide-react";

interface SupplierPageProps {
  onSubmit: () => void;
}

export function SupplierPage({ onSubmit }: SupplierPageProps) {
  const [supplierType, setSupplierType] = useState<"factory" | "contractor">("factory");
  const [orgName, setOrgName] = useState("");
  const [inn, setInn] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isValid = orgName.trim().length > 0 && inn.trim().length >= 10 && phone.trim().length >= 6;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit();
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
          Спасибо за интерес к платформе КВОТА B2B. Модератор проверит ваши данные и свяжется с
          вами в течение 1–2 рабочих дней для размещения товаров на платформе.
        </p>
        <button
          onClick={() => { setSubmitted(false); setOrgName(""); setInn(""); setPhone(""); setEmail(""); setFileName(null); }}
          className="mt-6 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Отправить ещё заявку
        </button>
      </div>
    );
  }

  const STEPS = [
    {
      icon: FileSpreadsheet,
      title: "1. Загрузка прайса из 1С / Excel",
      desc: "Загрузите ваш прайс-лист через форму или передайте через менеджера",
    },
    {
      icon: ShieldCheck,
      title: "2. Проверка ИНН модератором",
      desc: "Проверяем реквизиты компании, сертификаты и паспорта качества",
    },
    {
      icon: Truck,
      title: "3. Получение оплаченных заказов",
      desc: "Заказы поступают на ваш расчётный счёт, отгрузка напрямую со склада",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Landing header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Factory className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Как начать продавать на КВОТА B2B</h2>
        <p className="mt-2 text-sm text-slate-500">
          Для производителей и владельцев проектных остатков. Размещайте товары и получайте
          заказы от снабженцев со всей России.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Registration form */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Регистрация поставщика</h3>
        <p className="mt-1 text-sm text-slate-500">Заполните форму — модератор свяжется с вами</p>

        {/* Supplier type toggle */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setSupplierType("factory")}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
              supplierType === "factory"
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Factory className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Завод-производитель / Дистрибьютор</p>
              <p className="text-xs text-slate-500">Регулярные поставки, работа под заказ и из наличия</p>
            </div>
          </button>
          <button
            onClick={() => setSupplierType("contractor")}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
              supplierType === "contractor"
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Boxes className="h-6 w-6 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Подрядчик с проектными остатками</p>
              <p className="text-xs text-slate-500">Складские излишки, неликвиды, сток</p>
            </div>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Название организации"
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (необязательно)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        {/* File upload */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Прайс-лист (1С / Excel) — необязательно
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-400">
            <Upload className="h-6 w-6 text-slate-400" />
            <span className="text-sm text-slate-500">
              {fileName ? fileName : "Прикрепить прайс-лист (.xlsx, .csv)"}
            </span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
              }}
            />
          </label>
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
          Отправить заявку
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
