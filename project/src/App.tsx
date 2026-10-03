import { useState, useMemo } from "react";
import { Boxes } from "lucide-react";
import { Header } from "@/components/Header";
import type { TabId } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { Catalog } from "@/components/Catalog";
import { ReserveModal } from "@/components/ReserveModal";
import { RequestModal } from "@/components/RequestModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { SupplierModal } from "@/components/SupplierModal";
import { ImportModal } from "@/components/ImportModal";
import { SpecRequestPage } from "@/components/SpecRequestPage";
import { SupplierPage } from "@/components/SupplierPage";
import { SafeDealPage } from "@/components/SafeDealPage";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { INITIAL_PRODUCTS } from "@/data/products";
import type { Product, ProductSource } from "@/types";
import { calcDiscount } from "@/lib/format";

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<TabId>("exchange");
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [discount, setDiscount] = useState("any");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [source, setSource] = useState<"all" | ProductSource>("all");
  const [view, setView] = useState<"table" | "cards">("cards");
  const [reserveProduct, setReserveProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
      if (category !== "all" && p.category !== category) return false;
      if (source !== "all" && p.source !== source) return false;
      if (inStockOnly && p.reserved) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.manufacturer.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (discount !== "any") {
        const d = calcDiscount(p.marketPrice, p.liquidationPrice);
        const threshold = discount === "30" ? 30 : 45;
        if (d < threshold) return false;
      }
      return true;
    });
  }, [products, region, category, source, discount, inStockOnly, search]);

  const handleReserveConfirm = (productId: number, reserveId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, reserved: true, reservedByMe: true, reserveId }
          : p
      )
    );
    setToast(`Бронь #${reserveId} принята — товар переведён в статус «Забронировано»`);
  };

  const handleRequestConfirm = (productId: number, requestId: string) => {
    setToast(`Заявка #${requestId} отправлена — менеджер подготовит счёт с НДС`);
  };

  const handleSupplierSubmit = () => {
    setToast("Заявка поставщика отправлена на проверку модератору");
  };

  const handleImport = (imported: Product[]) => {
    setProducts((prev) => [...imported, ...prev]);
    setToast(`Импорт завершён: добавлено ${imported.length} позиций в каталог`);
  };

  const handleQuickSpecSubmit = (data: { orgName: string; inn: string; phone: string; fileName: string | null }) => {
    setToast(`Спецификация принята — КП будет готово в течение 45 минут (${data.orgName})`);
  };

  const handleProductAction = (product: Product) => {
    if (product.source === "stock") {
      setReserveProduct(product);
    } else {
      setReserveProduct(product);
    }
  };

  // Determine which modal to show based on product source
  const activeProduct = reserveProduct;
  const showRequestModal = activeProduct?.source === "factory";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        region={region}
        onRegionChange={setRegion}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAdminImportClick={() => setImportOpen(true)}
      />

      {/* Hero only on exchange and factory tabs */}
      {(activeTab === "exchange" || activeTab === "factory") && (
        <Hero onQuickSpecSubmit={handleQuickSpecSubmit} />
      )}

      {/* Catalog tabs */}
      {(activeTab === "exchange" || activeTab === "factory") && (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <Boxes className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              {activeTab === "exchange" ? "Биржа резервов" : "Новая продукция с заводов"}
            </h2>
            <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {filteredProducts.length} позиций
            </span>
          </div>

          <Filters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            discount={discount}
            onDiscountChange={setDiscount}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
            view={view}
            onViewChange={setView}
            totalCount={products.length}
            filteredCount={filteredProducts.length}
            source={source}
            onSourceChange={setSource}
          />

          <Catalog
            products={filteredProducts}
            view={view}
            onReserve={handleProductAction}
            onDetail={(p) => setDetailProduct(p)}
          />
        </main>
      )}

      {/* Spec request tab */}
      {activeTab === "spec" && (
        <SpecRequestPage onSubmit={handleQuickSpecSubmit} />
      )}

      {/* Suppliers tab */}
      {activeTab === "suppliers" && (
        <SupplierPage onSubmit={handleSupplierSubmit} />
      )}

      {/* Safe deal tab */}
      {activeTab === "safe-deal" && (
        <SafeDealPage onGoToCatalog={() => setActiveTab("exchange")} />
      )}

      <Footer onTabChange={setActiveTab} />

      {/* Modals */}
      {showRequestModal ? (
        <RequestModal
          product={reserveProduct}
          onClose={() => setReserveProduct(null)}
          onConfirm={handleRequestConfirm}
        />
      ) : (
        <ReserveModal
          product={reserveProduct}
          onClose={() => setReserveProduct(null)}
          onConfirm={handleReserveConfirm}
        />
      )}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onReserve={handleProductAction}
      />
      <SupplierModal
        open={supplierOpen}
        onClose={() => setSupplierOpen(false)}
        onSubmit={handleSupplierSubmit}
      />
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
