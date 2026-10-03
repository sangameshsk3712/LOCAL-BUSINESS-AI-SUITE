import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Copy,
  Check,
  Download,
  Trash2,
  Edit2,
  ChevronRight,
  Send,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { CrmContact, CrmInteraction, CrmFollowUpDraft } from "../types";

interface SmartCrmProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

const INITIAL_CONTACTS: CrmContact[] = [
  {
    id: "crm-1",
    fullName: "Vikram Malhotra",
    company: "Malhotra Tech Solutions",
    phone: "+91 98451 12233",
    email: "vikram@malhotratech.com",
    source: "WhatsApp",
    status: "Proposal Sent",
    dealValue: 14500,
    currency: "INR",
    followUpDate: "2026-09-27",
    lastContactedDate: "2026-09-25",
    notes: "Requires weekly coffee bean subscription and monthly team catering for 35 people.",
    priority: "High",
    tags: ["Corporate", "Monthly Recurring", "Indiranagar"],
  },
  {
    id: "crm-2",
    fullName: "Ananya Deshmukh",
    company: "Studio Bloom Architecture",
    phone: "+91 99201 88776",
    email: "ananya@studiobloom.design",
    source: "Google Maps",
    status: "Qualified",
    dealValue: 8200,
    currency: "INR",
    followUpDate: "2026-09-28",
    lastContactedDate: "2026-09-24",
    notes: "Client loved the sourdough brunch tasting. Inquired about catering launch party.",
    priority: "High",
    tags: ["Event Catering", "High Intent"],
  },
  {
    id: "crm-3",
    fullName: "Rahul K. Sharma",
    phone: "+91 98200 44556",
    email: "rahul.sharma@gmail.com",
    source: "Walk-In",
    status: "Closed-Won",
    dealValue: 3500,
    currency: "INR",
    followUpDate: "2026-10-02",
    lastContactedDate: "2026-09-26",
    notes: "Ordered weekend custom birthday cake. Paid via FamPay UPI. Send review link.",
    priority: "Medium",
    tags: ["Custom Cake", "VIP Customer"],
  },
  {
    id: "crm-4",
    fullName: "Kavita Rao",
    phone: "+91 88612 33445",
    email: "kavita.rao@zenith.in",
    source: "Voice Call",
    status: "New Lead",
    dealValue: 5000,
    currency: "INR",
    followUpDate: "2026-09-27",
    lastContactedDate: "2026-09-27",
    notes: "Called AI Voice Receptionist asking for 20 breakfast boxes for Sunday morning.",
    priority: "High",
    tags: ["Breakfast Box", "Inbound Call"],
  },
];

export default function SmartCrm({
  isKeyReady,
  onOpenKeyGuide,
  onSaveToWorkspace,
}: SmartCrmProps) {
  const [contacts, setContacts] = useState<CrmContact[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_smart_crm_contacts");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CONTACTS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(contacts[0]);

  // AI Follow-up draft modal state
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftChannel, setDraftChannel] = useState<"WhatsApp" | "Email">("WhatsApp");
  const [activeDraft, setActiveDraft] = useState<CrmFollowUpDraft | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // New contact drawer state
  const [showAddContact, setShowAddContact] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newDealValue, setNewDealValue] = useState<number>(3000);
  const [newSource, setNewSource] = useState<any>("WhatsApp");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    localStorage.setItem("lbs_smart_crm_contacts", JSON.stringify(contacts));
  }, [contacts]);

  // Calculate Pipeline Metrics
  const totalPipelineValue = contacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);
  const wonContacts = contacts.filter((c) => c.status === "Closed-Won");
  const activeLeadsCount = contacts.filter((c) => c.status !== "Closed-Won" && c.status !== "Lost").length;
  const todayDateStr = new Date().toISOString().split("T")[0];
  const dueTodayCount = contacts.filter((c) => c.followUpDate === todayDateStr).length;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) return;

    const contact: CrmContact = {
      id: `crm-${Date.now()}`,
      fullName: newFullName.trim(),
      company: newCompany.trim() || undefined,
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newFullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      source: newSource,
      status: "New Lead",
      dealValue: Number(newDealValue) || 2000,
      currency: "INR",
      followUpDate: new Date().toISOString().split("T")[0],
      lastContactedDate: new Date().toISOString().split("T")[0],
      notes: newNotes.trim() || "Inbound inquiry recorded in CRM",
      priority: "High",
      tags: ["Direct Lead", newSource],
    };

    setContacts((prev) => [contact, ...prev]);
    setSelectedContact(contact);
    setShowAddContact(false);
    setNewFullName("");
    setNewPhone("");
    setNewEmail("");
    setNewCompany("");
    setNewNotes("");
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Delete this contact from your CRM?")) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(contacts.find((c) => c.id !== id) || null);
      }
    }
  };

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedContact?.id === id) {
      setSelectedContact((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Generate AI Follow-up draft
  const handleGenerateAiFollowup = async (contact: CrmContact) => {
    setIsGeneratingDraft(true);
    try {
      const res = await fetch("/api/crm/generate-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          channel: draftChannel,
          businessName: "Artisan Roast Cafe",
        }),
      });

      const data = await res.json();
      if (res.ok && data.draft) {
        setActiveDraft(data.draft);
      }
    } catch (err) {
      console.error("AI followup draft error", err);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleExportCsv = () => {
    const headers = ["Full Name", "Company", "Phone", "Email", "Status", "Deal Value", "Source", "Follow-up Date", "Notes"];
    const rows = contacts.map((c) => [
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${(c.company || "").replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.status}"`,
      c.dealValue,
      `"${c.source}"`,
      c.followUpDate,
      `"${c.notes.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `crm_leads_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Smart CRM & Pipeline Manager
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {contacts.length} Tracked Accounts
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Customer Intelligence & Deal Pipeline
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage high-value customer accounts, schedule follow-ups, and generate 1-click personalized AI WhatsApp & Email outreach.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowAddContact(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Pipeline Value</span>
          <p className="text-lg font-black text-white font-mono">₹{totalPipelineValue.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Across all active accounts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Deals In Flight</span>
          <p className="text-lg font-black text-indigo-300 font-mono">{activeLeadsCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">Negotiating & Proposals</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Follow-Ups Due Today</span>
          <p className="text-lg font-black text-amber-300 font-mono">{dueTodayCount}</p>
          <span className="text-[11px] text-amber-400/80 font-medium">Requires immediate ping</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Won Revenue</span>
          <p className="text-lg font-black text-emerald-400 font-mono">
            ₹{wonContacts.reduce((s, c) => s + c.dealValue, 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">{wonContacts.length} Closed-Won Deals</span>
        </div>
      </div>

      {/* Add Contact Modal / Drawer */}
      {showAddContact && (
        <form
          onSubmit={handleAddContact}
          className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Create New Customer / Lead Profile</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddContact(false)}
              className="text-xs text-slate-500 hover:text-white"
            >
              ✕ Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="e.g. Aditi Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98451xxxxx"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Company / Organization</label>
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="e.g. Infosys Campus or Private Buyer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Estimated Deal Value (₹)</label>
              <input
                type="number"
                value={newDealValue}
                onChange={(e) => setNewDealValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Lead Source</label>
              <select
                value={newSource}
                onChange={(e: any) => setNewSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="WhatsApp">WhatsApp Inbound</option>
                <option value="Google Maps">Google Maps 3-Pack</option>
                <option value="Voice Call">AI Voice Receptionist</option>
                <option value="Walk-In">Counter Walk-In</option>
                <option value="Referral">Customer Referral</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Deal Notes & Requirements</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Inquired about catering for 25 people on Saturday morning"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddContact(false)}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
            >
              Save to CRM
            </button>
          </div>
        </form>
      )}

      {/* Main CRM Workspace (List + Details & AI Followup) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Contact List with Filters */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, phone or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">All Stages</option>
              <option value="New Lead">New Lead</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed-Won">Closed-Won</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredContacts.map((c) => {
              const isSelected = selectedContact?.id === c.id;
              const isDueToday = c.followUpDate === todayDateStr;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedContact(c);
                    setActiveDraft(null);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/30"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{c.fullName}</span>
                      {c.company && (
                        <span className="text-[10px] text-slate-400 font-medium">({c.company})</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === "Closed-Won"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : c.status === "Proposal Sent"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : c.status === "Qualified"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-emerald-400 font-bold">₹{c.dealValue.toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {c.phone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                    <span>Source: {c.source}</span>
                    <span className={`font-mono ${isDueToday ? "text-amber-400 font-bold" : ""}`}>
                      Follow-up: {c.followUpDate} {isDueToday ? "(TODAY)" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Detail & AI Outreach Generator */}
        <div className="lg:col-span-7 space-y-4">
          {selectedContact ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
              {/* Contact Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedContact.fullName}</h3>
                    {selectedContact.company && (
                      <span className="text-xs text-slate-400 font-mono">• {selectedContact.company}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedContact.phone}</span>
                    </a>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{selectedContact.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedContact.status}
                    onChange={(e: any) => handleUpdateStatus(selectedContact.id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-bold focus:outline-none"
                  >
                    <option value="New Lead">Stage: New Lead</option>
                    <option value="Contacted">Stage: Contacted</option>
                    <option value="Qualified">Stage: Qualified</option>
                    <option value="Proposal Sent">Stage: Proposal Sent</option>
                    <option value="Closed-Won">Stage: Closed-Won</option>
                    <option value="Lost">Stage: Lost</option>
                  </select>

                  <button
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Deal Data & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Deal Value</span>
                  <p className="text-base font-black text-emerald-400 font-mono">₹{selectedContact.dealValue.toLocaleString()}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Next Action Date</span>
                  <p className="text-base font-bold text-white font-mono">{selectedContact.followUpDate}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Acquisition Source</span>
                  <p className="text-base font-bold text-indigo-300">{selectedContact.source}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1 text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Customer Requirements & Context:</span>
                <p className="text-slate-300 leading-relaxed font-medium">{selectedContact.notes}</p>
              </div>

              {/* AI Follow-Up Generator Box */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">AI Contextual Follow-Up Drafter</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setDraftChannel("WhatsApp")}
                        className={`text-[11px] px-2.5 py-1 rounded font-bold transition-all ${
                          draftChannel === "WhatsApp" ? "bg-emerald-600 text-white" : "text-slate-400"
                        }`}
                      >
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => setDraftChannel("Email")}
                        className={`text-[11px] px-2.5 py-1 rounded font-bold transition-all ${
                          draftChannel === "Email" ? "bg-emerald-600 text-white" : "text-slate-400"
                        }`}
                      >
                        Email
                      </button>
                    </div>

                    <button
                      onClick={() => handleGenerateAiFollowup(selectedContact)}
                      disabled={isGeneratingDraft}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGeneratingDraft ? "animate-spin" : ""}`} />
                      <span>{isGeneratingDraft ? "Drafting..." : "Generate Draft"}</span>
                    </button>
                  </div>
                </div>

                {activeDraft ? (
                  <div className="space-y-3 pt-1">
                    {activeDraft.subject && (
                      <div className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-850">
                        <strong>Subject:</strong> {activeDraft.subject}
                      </div>
                    )}

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                      {activeDraft.draftText}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 italic">
                        Tip: {activeDraft.recommendedAction}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(activeDraft.draftText);
                            setCopiedDraft(true);
                            setTimeout(() => setCopiedDraft(false), 2000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
                        >
                          {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedDraft ? "Copied" : "Copy"}</span>
                        </button>

                        {draftChannel === "WhatsApp" && (
                          <a
                            href={`https://wa.me/${selectedContact.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              activeDraft.draftText
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send on WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    Click "Generate Draft" to produce a tailored {draftChannel} follow-up based on {selectedContact.fullName}'s deal stage and requirements.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 border border-slate-800 border-dashed rounded-2xl text-center text-slate-500">
              Select an account on the left to view profile and generate follow-ups.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
