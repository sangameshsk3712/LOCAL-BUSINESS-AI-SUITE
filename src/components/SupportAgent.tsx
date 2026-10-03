import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Bot,
  User,
  Send,
  Phone,
  MessageCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ShoppingBag,
  Clock,
  ShieldCheck,
  RefreshCw,
  Download,
  Share2
} from "lucide-react";
import { BusinessFaqItem, ProductCatalogItem, SupportChatMessage } from "../types";

interface SupportAgentProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onLeadCaptured?: (name: string, contact: string, notes: string) => void;
}

const DEFAULT_FAQS: BusinessFaqItem[] = [
  { id: "faq-1", question: "What are your daily opening and closing hours?", answer: "We are open Monday to Saturday from 8:00 AM to 10:30 PM, and Sundays from 9:00 AM to 9:00 PM.", category: "Hours & Location" },
  { id: "faq-2", question: "Do you offer home delivery or takeaway?", answer: "Yes! We offer direct zero-commission delivery within a 7km radius via WhatsApp, as well as takeaway pickup at our counter.", category: "Delivery & Takeout" },
  { id: "faq-3", question: "Do you take bulk or catering orders for corporate events?", answer: "Absolutely! We cater for office events, parties, and family gatherings. Custom packaging and volume discounts are available.", category: "Pricing & Menu" },
  { id: "faq-4", question: "What is your refund or satisfaction policy?", answer: "100% Satisfaction Guarantee. If an item does not meet your expectations, we will replace it immediately or issue a full credit.", category: "Policies" },
];

const DEFAULT_PRODUCTS: ProductCatalogItem[] = [
  { id: "prod-1", name: "Artisan Pour-Over Arabica Coffee", category: "Beverages", price: 180, description: "Single-origin Chikmagalur beans with hints of cocoa and dark berries.", inStock: true },
  { id: "prod-2", name: "Butter Flaky French Croissant", category: "Bakery", price: 140, description: "Baked fresh every morning with 100% pure Normandy butter.", inStock: true },
  { id: "prod-3", name: "Avocado & Sourdough Toast Deluxe", category: "Brunch", price: 320, description: "Hass avocado, cherry tomatoes, pumpkin seeds on wild yeast sourdough.", inStock: true },
  { id: "prod-4", name: "Custom Belgian Chocolate Celebration Cake", category: "Custom Orders", price: 1250, description: "1kg decadent layered dark chocolate cake with personalized message plaque.", inStock: true },
];

export default function SupportAgent({
  isKeyReady,
  onOpenKeyGuide,
  onLeadCaptured,
}: SupportAgentProps) {
  const [faqs, setFaqs] = useState<BusinessFaqItem[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_support_faqs");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FAQS;
  });

  const [products, setProducts] = useState<ProductCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_support_products");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PRODUCTS;
  });

  const [operatingHours, setOperatingHours] = useState(
    "Monday to Saturday: 8:00 AM - 10:30 PM • Sunday: 9:00 AM - 9:00 PM"
  );
  const [storePolicies, setStorePolicies] = useState(
    "100% Satisfaction Guarantee. Same-day modifications allowed. Contact Founder Sangamesh (8431107332) for instant support."
  );

  const [activeView, setActiveView] = useState<"chat" | "knowledge">("chat");

  // Chat conversation state
  const [messages, setMessages] = useState<SupportChatMessage[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: "Hello! Welcome to our store. I am your 24/7 AI Concierge, trained on our menu, prices, and operating hours. How can I help you today?",
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // New FAQ Form
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [newFaqCat, setNewFaqCat] = useState<any>("General");

  // New Product Form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState(150);
  const [newProdCat, setNewProdCat] = useState("Bakery");
  const [newProdDesc, setNewProdDesc] = useState("");

  const founderPhone = "8431107332";

  useEffect(() => {
    localStorage.setItem("lbs_support_faqs", JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem("lbs_support_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage.trim();
    const userMsg: SupportChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "customer",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/support-agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          conversationHistory: messages,
          businessName: "Artisan Roast Cafe",
          faqs,
          products,
          hours: operatingHours,
          policies: storePolicies,
          founderPhone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const aiMsg: SupportChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "ai",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isLeadCaptured: data.isLeadCaptured,
          leadData: data.leadData,
          escalationRequired: data.escalationRequired,
        };

        setMessages((prev) => [...prev, aiMsg]);

        // Auto trigger lead capture callback if phone/email was detected
        if (data.isLeadCaptured && data.leadData?.contact && onLeadCaptured) {
          onLeadCaptured(
            data.leadData.name || "Chat Visitor",
            data.leadData.contact,
            `Inquired via AI Support Agent: "${userText}"`
          );
        }
      }
    } catch (err) {
      const errorMsg: SupportChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: `Thank you for your message! Our team at the storefront will be delighted to assist you directly at ${founderPhone}.`,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;

    const item: BusinessFaqItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQ.trim(),
      answer: newFaqA.trim(),
      category: newFaqCat,
    };
    setFaqs((prev) => [...prev, item]);
    setNewFaqQ("");
    setNewFaqA("");
    setShowAddFaq(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const item: ProductCatalogItem = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCat,
      price: Number(newProdPrice) || 0,
      description: newProdDesc.trim(),
      inStock: true,
    };
    setProducts((prev) => [...prev, item]);
    setNewProdName("");
    setNewProdDesc("");
    setShowAddProduct(false);
  };

  const clearChatHistory = () => {
    if (confirm("Reset conversation history?")) {
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "Hello! Welcome to our store. I am your 24/7 AI Concierge, trained on our menu, prices, and operating hours. How can I help you today?",
          timestamp: "Just now",
        },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border-2 border-teal-500/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5 text-teal-400" />
              <span>Autonomous Customer Support & Lead Concierge</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              AI Customer Support Agent
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Trained on your business's proprietary FAQs, menu items, price sheets, and policies. Automatically answers customer questions 24/7, captures hot buyer leads, and escalates to Founder Sangamesh on WhatsApp in 1 click.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setActiveView("chat")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === "chat" ? "bg-teal-500 text-slate-950 shadow" : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              Live Chat Simulator
            </button>
            <button
              onClick={() => setActiveView("knowledge")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === "knowledge" ? "bg-teal-500 text-slate-950 shadow" : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Train Knowledge Base ({faqs.length} FAQs)</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: LIVE CHAT SIMULATOR */}
      {activeView === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Window */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col h-[580px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Storefront AI Concierge</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <span className="text-[11px] text-slate-400">Trained on {faqs.length} FAQs & {products.length} Products</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/91${founderPhone}?text=${encodeURIComponent("Hello Sangamesh Sir, customer requesting direct human escalation from AI chat.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 text-xs font-bold flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Handover</span>
                </a>

                <button
                  onClick={clearChatHistory}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  title="Clear Chat History"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === "customer" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.sender === "customer"
                        ? "bg-blue-600 text-white"
                        : "bg-teal-500/20 border border-teal-500/40 text-teal-300"
                    }`}
                  >
                    {msg.sender === "customer" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[80%] space-y-1 ${msg.sender === "customer" ? "text-right" : ""}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === "customer"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
                      <span>{msg.timestamp}</span>
                      {msg.isLeadCaptured && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                          ★ Lead Captured!
                        </span>
                      )}
                      {msg.escalationRequired && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Manager Escalation Flagged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span>AI Concierge is consulting knowledge base...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Test Prompt Pills */}
            <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-slate-500 shrink-0">Try asking:</span>
              {[
                "What are your opening hours on Sunday?",
                "Can I order a custom cake for delivery?",
                "Here is my number 9876543210 please book a table",
                "I want to speak with owner Sangamesh",
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => setInputMessage(pill)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Ask about store items, hours, bulk quotes, or type phone number..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-400 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>

          {/* Side Info & Lead Capture Monitor */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Lead & Escalation Engine
                </h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                When a customer types their phone or email, the AI automatically extracts the lead into your pipeline. If they ask for a human, it formats a 1-click WhatsApp message to Founder Sangamesh Khatge.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Connected Store Manager:
                </span>
                <div className="font-bold text-white">Sangamesh Khatge (Founder)</div>
                <div className="font-mono text-emerald-400">{founderPhone}</div>
              </div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Active Store Hours</span>
              </h4>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-850">
                {operatingHours}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KNOWLEDGE BASE EDITOR */}
      {activeView === "knowledge" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FAQs Manager */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Store FAQs & Training Data</h3>
                <p className="text-xs text-slate-400">Add questions your customers ask frequently.</p>
              </div>
              <button
                onClick={() => setShowAddFaq(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            {/* FAQs List */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <button
                      onClick={() => setFaqs((prev) => prev.filter((f) => f.id !== faq.id))}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h5 className="text-xs font-bold text-white">Q: {faq.question}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product & Menu Catalog */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Product & Price Catalog</h3>
                <p className="text-xs text-slate-400">AI quotes these exact prices to shoppers.</p>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {products.map((prod) => (
                <div key={prod.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{prod.name}</span>
                      <span className="text-[10px] text-slate-400">({prod.category})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{prod.description}</p>
                    <span className="text-xs font-mono font-bold text-emerald-400">₹{prod.price}</span>
                  </div>
                  <button
                    onClick={() => setProducts((prev) => prev.filter((p) => p.id !== prod.id))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      {showAddFaq && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Add Knowledge Base FAQ</h4>
            <form onSubmit={handleAddFaq} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Customer Question:</label>
                <input
                  type="text"
                  placeholder="e.g. Do you have vegetarian or gluten-free options?"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">AI Verified Answer:</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Yes! We have dedicated gluten-free pastries and vegan milks."
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Category:</label>
                <select
                  value={newFaqCat}
                  onChange={(e) => setNewFaqCat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="General">General</option>
                  <option value="Hours & Location">Hours & Location</option>
                  <option value="Pricing & Menu">Pricing & Menu</option>
                  <option value="Delivery & Takeout">Delivery & Takeout</option>
                  <option value="Policies">Policies</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFaq(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
                >
                  Save to Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Add Product / Menu Item</h4>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Item Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Signature Cold Brew Latte"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Category:</label>
                  <input
                    type="text"
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Price (₹):</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Description:</label>
                <input
                  type="text"
                  placeholder="e.g. 18-hour slow steeped with vanilla bean"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
