import {
  ShieldCheck, FileText, BadgeCheck, Building2, Lock, Receipt,
  CheckCircle2, ArrowRight,
} from "lucide-react";

interface SafeDealPageProps {
  onGoToCatalog: () => void;
}

export function SafeDealPage({ onGoToCatalog }: SafeDealPageProps) {
  const BLOCKS = [
    {
      icon: BadgeCheck,
      title: "Проверка контрагентов",
      desc: "Каждый поставщик на платформе проходит проверку ИНН через ЕГРЮЛ. Мы проверяем действующие свидетельства, лицензии и сертификаты соответствия. На карточке поставщика отображается статус «Проверенный поставщик КВОТА».",
    },
    {
      icon: Receipt,
      title: "Безналичный расчёт с НДС 20%",
      desc: "Все сделки оформляются официально. Счета выставляются с НДС 20%. Работаем с плательщиками НДС по общей и упрощённой системе налогообложения.",
    },
    {
      icon: FileText,
      title: "Электронный документооборот (ЭДО)",
      desc: "Автоматический обмен УПД, счетами-фактурами и договорами через Диадок и СБИС. Никакой бумаги — закрывающие документы приходят в электронном виде с юридической силой.",
    },
    {
      icon: Lock,
      title: "Безопасность платежей",
      desc: "Оплата по счёту на расчётный счёт поставщика. Платформа выступает гарантом корректности реквизитов и полноты документов. При необходимости — эскроу-сервис через банк-партнёр.",
    },
    {
      icon: Building2,
      title: "Реквизиты платформы",
      desc: "ООО «Квота Технологии», ИНН 7701234567, ОГРН 1234567890123. Работаем по всей территории РФ. Договоры и счета через ЭДО (Диадок / СБИС).",
    },
    {
      icon: ShieldCheck,
      title: "Гарантия возврата",
      desc: "Если товар не соответствует заявленным характеристикам или ГОСТ — платформа гарантирует возврат средств и компенсацию логистических расходов в течение 14 дней.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Безопасная сделка и ЭДО</h2>
        <p className="mt-2 text-sm text-slate-500">
          Как платформа КВОТА B2B гарантирует чистоту сделок и закрывающие документы
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {BLOCKS.map((block) => {
          const Icon = block.icon;
          return (
            <div key={block.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{block.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{block.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl bg-slate-900 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
        <p className="text-sm font-medium text-white">
          Все сделки на платформе КВОТА B2B защищены проверкой контрагентов и ЭДО
        </p>
        <button
          onClick={onGoToCatalog}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
        >
          Перейти к каталогу
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
