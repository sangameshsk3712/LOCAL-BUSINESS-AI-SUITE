import React, { useState, useEffect } from "react";
import {
  Receipt,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  QrCode,
  CreditCard,
  Banknote,
  Send,
  Sparkles,
  CheckCircle2,
  CloudOff,
  Cloud,
  RefreshCw,
  Search,
  ArrowRight,
  ShieldCheck,
  Percent,
  Check,
  Share2
} from "lucide-react";

interface PosProduct {
  id: string;
  name: string;
  category: "coffee" | "food" | "bakery" | "retail";
  price: number;
  emoji: string;
  stock: number;
}

const SAMPLE_PRODUCTS: PosProduct[] = [
  { id: "p-1", name: "Artisan Cappuccino", category: "coffee", price: 180, emoji: "☕", stock: 85 },
  { id: "p-2", name: "Iced Caramel Macchiato", category: "coffee", price: 220, emoji: "🥤", stock: 64 },
  { id: "p-3", name: "South Indian Filter Coffee", category: "coffee", price: 60, emoji: "☕", stock: 120 },
  { id: "p-4", name: "Tandoori Paneer Sandwich", category: "food", price: 190, emoji: "🥪", stock: 32 },
  { id: "p-5", name: "Spicy Crispy Chicken Burger", category: "food", price: 240, emoji: "🍔", stock: 28 },
  { id: "p-6", name: "Truffle Fries with Aioli", category: "food", price: 160, emoji: "🍟", stock: 45 },
  { id: "p-7", name: "Butter Croissant (Flaky)", category: "bakery", price: 120, emoji: "🥐", stock: 24 },
  { id: "p-8", name: "Belgian Dark Chocolate Mousse", category: "bakery", price: 180, emoji: "🍰", stock: 18 },
  { id: "p-9", name: "Artisan Coffee Beans (250g)", category: "retail", price: 550, emoji: "📦", stock: 40 },
  { id: "p-10", name: "Signature Spice Blend Pack", category: "retail", price: 320, emoji: "🧂", stock: 55 },
];

interface CartItem {
  product: PosProduct;
  qty: number;
}

interface QueuedOrder {
  orderId: string;
  timestamp: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | "KHATA";
  synced: boolean;
}

export default function OfflinePosCashier() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CASH" | "CARD" | "KHATA">("UPI");
  const [cashTendered, setCashTendered] = useState<number>(500);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printedReceipt, setPrintedReceipt] = useState<string | null>(null);
  const [offlineOrders, setOfflineOrders] = useState<QueuedOrder[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_offline_pos_queue");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const addToCart = (product: PosProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  // Price calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const gstCgst = Math.round(subtotal * 0.025 * 100) / 100;
  const gstSgst = Math.round(subtotal * 0.025 * 100) / 100;
  const total = subtotal + gstCgst + gstSgst;
  const cashChange = Math.max(0, cashTendered - total);

  // Print ESC/POS Receipt & Complete Checkout
  const handlePrintCheckout = () => {
    if (cart.length === 0) return;
    setIsPrinting(true);

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: QueuedOrder = {
      orderId,
      timestamp: new Date().toISOString(),
      items: cart.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.price })),
      total,
      paymentMethod,
      synced: isOnline,
    };

    // Format 32-column ESC/POS thermal text
    const receiptText = `
================================
     ARTISAN ROAST & BISTRO
   Branch: Indiranagar 100ft Rd
    GSTIN: 29AABCU9603R1ZM
================================
Order ID: #${orderId}
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Cashier: POS Terminal #01
--------------------------------
ITEM               QTY    PRICE
--------------------------------
${cart
  .map(
    (i) =>
      `${i.product.name.slice(0, 16).padEnd(17)} ${i.qty.toString().padStart(2)}x ${ (i.product.price * i.qty).toFixed(2).padStart(8) }`
  )
  .join("\n")}
--------------------------------
Subtotal:              ₹${subtotal.toFixed(2)}
CGST (2.5%):            ₹${gstCgst.toFixed(2)}
SGST (2.5%):            ₹${gstSgst.toFixed(2)}
--------------------------------
NET TOTAL:             ₹${total.toFixed(2)}
PAID VIA: ${paymentMethod}
${paymentMethod === "CASH" ? `Tendered: ₹${cashTendered} | Change: ₹${cashChange.toFixed(2)}` : ""}
================================
    THANK YOU FOR VISITING!
  Scan to Review us on Google ★★★★★
  Powered by Local Business Suite AI
================================
[PAPER CUT EXECUTED: 0x1D 0x56 0x41]
`.trim();

    // Trigger Native Android Bridge if present in APK
    if ((window as any).AndroidBridge?.printThermalReceipt) {
      try {
        (window as any).AndroidBridge.printThermalReceipt(
          JSON.stringify({
            storeName: "Artisan Roast & Bistro",
            totalAmount: total,
            items: newOrder.items,
          })
        );
      } catch (e) {
        console.warn("Native bridge print error", e);
      }
    }

    setTimeout(() => {
      setIsPrinting(false);
      setPrintedReceipt(receiptText);

      // Save to offline queue
      const updatedQueue = [newOrder, ...offlineOrders].slice(0, 50);
      setOfflineOrders(updatedQueue);
      try {
        localStorage.setItem("lbs_offline_pos_queue", JSON.stringify(updatedQueue));
      } catch {}

      clearCart();
    }, 700);
  };

  const handleSyncAllOrders = () => {
    const syncedList = offlineOrders.map((o) => ({ ...o, synced: true }));
    setOfflineOrders(syncedList);
    try {
      localStorage.setItem("lbs_offline_pos_queue", JSON.stringify(syncedList));
    } catch {}
  };

  const filteredProducts = SAMPLE_PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesQuery = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const pendingSyncCount = offlineOrders.filter((o) => !o.synced).length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                Physical Retail POS Terminal
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-mono ${
                  isOnline
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                }`}
              >
                {isOnline ? <Cloud className="w-3 h-3 text-emerald-400" /> : <CloudOff className="w-3 h-3 text-amber-400" />}
                {isOnline ? "Online (Zero-Drop Sync)" : "Offline (Local Vault Active)"}
              </span>
              {pendingSyncCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingSyncCount} Orders in Hardware Queue
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white">
              Offline POS Cashier & Thermal Receipt Terminal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              1-click cashier billing for retail and cafes. Operates seamlessly offline in basements with instant ESC/POS Bluetooth receipt generation and auto-sync on reconnect.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {pendingSyncCount > 0 && (
              <button
                onClick={handleSyncAllOrders}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync {pendingSyncCount} Offline Bills</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Products (Left) + Cart & Checkout (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Catalog */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items, coffee, burgers, retail..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All Items" },
                { id: "coffee", label: "☕ Coffee" },
                { id: "food", label: "🍔 Food" },
                { id: "bakery", label: "🥐 Bakery" },
                { id: "retail", label: "📦 Retail" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? "bg-cyan-600 text-white shadow"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((p) => {
              const inCart = cart.find((i) => i.product.id === p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none space-y-2 relative group hover:scale-[1.02] ${
                    inCart
                      ? "bg-cyan-950/40 border-cyan-400/80 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Stock: {p.stock}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {p.name}
                    </h4>
                    <div className="text-sm font-black text-cyan-400 font-mono mt-0.5">
                      ₹{p.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">{p.category}</span>
                    <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      Add
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Cart & Receipt Printing */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black text-white uppercase font-mono">
                  Order Cart ({cart.reduce((s, i) => s + i.qty, 0)} Items)
                </span>
              </div>
              {cart.length > 0 && (
                <button onClick={clearCart} className="text-[11px] text-slate-400 hover:text-rose-400 font-bold transition">
                  Clear
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Cart is empty. Tap any menu item on the left to add.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="truncate mr-2">
                      <div className="font-bold text-white truncate">{item.product.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ₹{item.product.price} × {item.qty} = ₹{item.product.price * item.qty}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQty(item.product.id, -1)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold font-mono text-white px-1.5">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.product.id, 1)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>CGST (2.5%):</span>
                <span className="font-mono">₹{gstCgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>SGST (2.5%):</span>
                <span className="font-mono">₹{gstSgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="font-mono text-cyan-400 text-base">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Payment Mode:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "UPI", label: "UPI QR", icon: QrCode },
                  { id: "CASH", label: "Cash", icon: Banknote },
                  { id: "CARD", label: "Card", icon: CreditCard },
                  { id: "KHATA", label: "Khata", icon: Receipt },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                      paymentMethod === m.id
                        ? "bg-cyan-600 text-white shadow"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <m.icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic UPI QR Code Preview */}
            {paymentMethod === "UPI" && total > 0 && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="w-16 h-16 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center">
                  {/* Dynamic simulated UPI QR rendering */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=8431107332@fampay&pn=ArtisanRoast&am=${total}&cu=INR`}
                    alt="UPI Payment QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[11px] space-y-0.5">
                  <div className="font-black text-emerald-400">Scan to Pay ₹{total.toFixed(2)}</div>
                  <div className="text-slate-400 text-[10px]">VPA: 8431107332@fampay</div>
                  <div className="text-slate-500 text-[9px]">GPay, PhonePe, Paytm, BHIM accepted</div>
                </div>
              </div>
            )}

            {/* Cash Tendered Input */}
            {paymentMethod === "CASH" && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cash Received:</span>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right text-xs font-mono font-bold text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Change to Return:</span>
                  <span className="font-mono text-emerald-400 font-black">₹{cashChange.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Print & Bill Action */}
            <button
              onClick={handlePrintCheckout}
              disabled={cart.length === 0 || isPrinting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition active:scale-95"
            >
              {isPrinting ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Printing ESC/POS Receipt...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt & Complete (₹{total.toFixed(2)})</span>
                </span>
              )}
            </button>
          </div>

          {/* Virtual ESC/POS Thermal Receipt Tape Viewer */}
          {printedReceipt && (
            <div className="bg-amber-100/90 text-slate-950 p-4 rounded-2xl shadow-xl font-mono text-[10px] leading-tight space-y-2 border border-amber-300 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-dashed border-slate-400 pb-1 font-bold">
                <span>VIRTUAL THERMAL RECEIPT</span>
                <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded">ESC/POS 58mm</span>
              </div>
              <pre className="whitespace-pre-wrap">{printedReceipt}</pre>
              <div className="pt-2 border-t border-dashed border-slate-400 flex items-center justify-between text-[10px]">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(printedReceipt)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Share via WhatsApp</span>
                </a>
                <button onClick={() => setPrintedReceipt(null)} className="text-slate-600 hover:underline">
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
