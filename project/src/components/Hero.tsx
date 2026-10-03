import { BadgeCheck, Clock, Receipt, Upload, FileText, ArrowRight, Building2, TrendingDown, Factory, ShieldCheck, Calculator, Percent } from "lucide-react";
import { useRef, useState } from "react";

const ADVANTAGES = [
  {
    icon: BadgeCheck,
    title: "100% ГОСТ и сертификаты завода",
    description: "Каждая партия сопровождается паспортами качества и сертификатами соответствия",
  },
  {
    icon: Clock,
    title: "Бесплатная бронь на 24 часа",
    description: "Резервируйте объём без предоплаты — гарантия удержания в течение суток",
  },
  {
    icon: Receipt,
    title: "Безналичный расчет с НДС через ЭДО",
    description: "Закрывающие документы через Диадок или СБИС, работаем с плательщиками НДС",
  },
];

const STATS = [
  { icon: TrendingDown, value: "₽480+ млн", label: "объем подтвержденного складского стока" },
  { icon: Factory, value: "140+", label: "проверенных заводов и компаний-поставщиков" },
  { icon: Clock, value: "24 часа", label: "бесплатная фиксация цены и бронь объема" },
  { icon: ShieldCheck, value: "100% ЭДО", label: "автоматический обмен УПД через Диадок и СБИС" },
];

interface HeroProps {
  onQuickSpecSubmit: (data: { orgName: string; inn: string; phone: string; fileName: string | null }) => void;
}

export function Hero({ onQuickSpecSubmit }: HeroProps) {
  const [orgName, setOrgName] = useState("");
  const [inn, setInn] = useState("");
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
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
    onQuickSpecSubmit({ orgName, inn, phone, fileName });
    setOrgName("");
    setInn("");
    setPhone("");
    setFileName(null);
  };

  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: headline + advantages */}
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-blue-600/20 px-4 py-1.5 text-xs font-semibold text-blue-400">
              B2B-маркетплейс • Прямые отгрузки с НДС 20%
            </span>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Ликвидация проектных резервов кабеля и инженерных систем со скидкой{" "}
              <span className="text-blue-400">10–50%</span>
            </h2>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Прямые отгрузки со складов девелоперов и подрядчиков. Проверенный ГОСТ, резерв объема
              на 24 часа
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <Icon className="mb-2 h-5 w-5 text-blue-400" />
                    <p className="text-xl font-bold text-white">{s.value}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{s.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {ADVANTAGES.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition hover:border-blue-600/50 hover:bg-slate-800"
                  >
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-semibold text-white">{a.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{a.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Quick Spec Request */}
          <div className="flex items-center">
            <div className="w-full rounded-2xl border border-slate-700/50 bg-slate-800/80 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <Calculator className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Быстрая оценка спецификации</h3>
                  <p className="text-xs text-slate-400">Сводное КП за 45 минут от 20+ заводов</p>
                </div>
              </div>

              <p className="mb-4 text-sm text-slate-300">
                Скиньте ведомость материалов или проектную спецификацию — соберем единый счет с
                лучшими ценами от 20+ заводов за 45 минут.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Название компании"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={inn}
                    onChange={(e) => setInn(e.target.value)}
                    placeholder="ИНН компании"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Телефон"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${
                    dragOver ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-blue-400"
                  }`}
                >
                  {fileName ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <FileText className="h-7 w-7 text-emerald-400" />
                      <span className="text-sm font-medium text-white">{fileName}</span>
                      <span className="text-xs text-blue-400">Нажмите, чтобы заменить</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <Upload className="h-7 w-7 text-slate-500" />
                      <span className="text-sm text-slate-400">Прикрепите ведомость</span>
                      <span className="text-xs text-slate-500">Excel, PDF, скан</span>
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

                <button
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition ${
                    isValid
                      ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
                      : "cursor-not-allowed bg-slate-700 text-slate-500"
                  }`}
                >
                  Получить сводное КП
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Re-export for use elsewhere
export { Building2, Percent };
