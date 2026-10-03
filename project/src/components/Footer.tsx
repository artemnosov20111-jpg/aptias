import { Boxes, Mail, Phone, Shield, Send, FileText } from "lucide-react";
import type { TabId } from "@/components/Header";
import { CATEGORIES } from "@/data/products";

interface FooterProps {
  onTabChange: (tab: TabId) => void;
}

export function Footer({ onTabChange }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand + requisites */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Boxes className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white">КВОТА B2B <span className="font-normal text-slate-500">kvota.su</span></h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed">
              ООО «Квота Технологии»<br />
              ИНН 7701234567<br />
              ОГРН 1234567890123<br />
              Работа по всей территории РФ
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white">Разделы</h4>
            <div className="mt-3 space-y-2 text-sm">
              <button onClick={() => onTabChange("exchange")} className="block text-slate-400 transition hover:text-blue-400">Биржа резервов</button>
              <button onClick={() => onTabChange("factory")} className="block text-slate-400 transition hover:text-blue-400">Новая продукция</button>
              <button onClick={() => onTabChange("spec")} className="block text-slate-400 transition hover:text-blue-400">Заявка по спецификации</button>
              <button onClick={() => onTabChange("suppliers")} className="block text-slate-400 transition hover:text-blue-400">Поставщикам</button>
              <button onClick={() => onTabChange("safe-deal")} className="block text-slate-400 transition hover:text-blue-400">Безопасная сделка</button>
            </div>
          </div>

          {/* Catalog links */}
          <div>
            <h4 className="text-sm font-semibold text-white">Каталог</h4>
            <div className="mt-3 space-y-2 text-sm">
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onTabChange("exchange")}
                  className="block text-slate-400 transition hover:text-blue-400"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-white">Контакты</h4>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-500">Горячая линия снабжения</p>
                  <p className="text-slate-300">8 800 555-35-35</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-500">Telegram-канал</p>
                  <p className="text-slate-300">@kvota_hot</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-500">Почта</p>
                  <p className="text-slate-300">supply@kvota.su</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs sm:flex-row">
          <div>© 2026 КВОТА B2B • kvota.su. Все права защищены.</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-slate-500" />
              ЭДО: Диадок / СБИС
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              Сделки с НДС 20%
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
