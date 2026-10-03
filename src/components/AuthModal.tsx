import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  ExternalLink,
  Zap
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import { auth, saveUserProfile, signInWithGoogle, saveLocalMerchantSession } from "../services/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [role, setRole] = useState<"owner" | "manager" | "staff">("owner");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isIdentityToolkitError, setIsIdentityToolkitError] = useState(false);

  if (!isOpen) return null;

  const handleInstantLocalMode = (chosenName?: string, chosenStore?: string) => {
    const finalName = chosenName || displayName || "Rajesh Gupta";
    const finalStore = chosenStore || storeName || "Royal Spices & Cafe";
    saveLocalMerchantSession({
      uid: `local-${Date.now()}`,
      email: email || "merchant@localbizsuite.ai",
      displayName: finalName,
      isAnonymous: false,
    });
    setIsLoading(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsIdentityToolkitError(false);
    try {
      await signInWithGoogle();
      setIsLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.message || String(err);
      if (msg.includes("identity-toolkit") || msg.includes("identitytoolkit") || err.code === "auth/operation-not-allowed") {
        setIsIdentityToolkitError(true);
        setErrorMsg("Google Cloud Project Identity Toolkit API is currently disabled or initializing.");
      } else {
        setErrorMsg(msg || "Google Sign-In failed.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setIsIdentityToolkitError(false);

    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
        await saveUserProfile(userCredential.user, storeName, role);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await saveUserProfile(userCredential.user);
      }

      setIsLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsLoading(false);
      console.error("Auth error:", err);
      const msg = err.message || String(err);

      if (msg.includes("identity-toolkit") || msg.includes("identitytoolkit") || err.code === "auth/operation-not-allowed") {
        setIsIdentityToolkitError(true);
        setErrorMsg("Google Cloud Project Identity Toolkit API is not enabled yet in project 195168490405.");
      } else if (err.code === "auth/email-already-in-use") {
        setErrorMsg("This email is already registered. Please switch to Sign In.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorMsg("Invalid email or password. Please verify your credentials.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg("Password should be at least 6 characters.");
      } else {
        setErrorMsg(err.message || "Authentication failed. Please try again.");
      }
    }
  };

  // Instant Guest Login
  const handleGuestLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsIdentityToolkitError(false);
    try {
      const userCredential = await signInAnonymously(auth);
      await saveUserProfile(userCredential.user, "Demo Store", "guest");
      setIsLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.message || String(err);
      if (msg.includes("identity-toolkit") || msg.includes("identitytoolkit") || err.code === "auth/operation-not-allowed") {
        setIsIdentityToolkitError(true);
        setErrorMsg("Identity Toolkit API is initializing in Google Cloud. Click Instant Local Mode below to continue without wait.");
      } else {
        setErrorMsg("Guest login failed: " + msg);
      }
    }
  };

  // Quick Demo Account Auto-Fill
  const handleQuickDemo = (type: "owner" | "franchise") => {
    if (type === "owner") {
      handleInstantLocalMode("Rajesh Gupta", "Royal Spices & Cafe");
    } else {
      handleInstantLocalMode("Priya Menon", "Urban Bistro Franchise Network");
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/40 text-left overflow-hidden">
        {/* Glow Element */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase font-mono">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>Persistent Cloud Session</span>
          </div>
          <h3 className="text-xl font-black text-white">
            {mode === "signin" ? "Sign In to Your Workspace" : "Create Merchant Account"}
          </h3>
          <p className="text-xs text-slate-400">
            Keep your generated marketing campaigns, AI SEO audits, and code widgets saved across all devices.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === "signin" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === "signup" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Your Full Name:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rajesh Gupta"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Store / Business Name:</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Blue Pine Cafe & Roastery"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Email Address:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@business.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition active:scale-95 mt-1"
          >
            {isLoading ? (
              <span className="animate-pulse">Authenticating with Firebase...</span>
            ) : (
              <>
                <span>{mode === "signin" ? "Sign In & Sync History" : "Create Account & Save Work"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-slate-900 px-2 text-slate-500">Or Quick Start</span>
          </div>
        </div>

        {/* Identity Toolkit Guidance Banner */}
        {isIdentityToolkitError && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold block">Identity Toolkit API Disabled or Initializing</strong>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  Google Cloud Project <code>195168490405</code> has not enabled Identity Toolkit API yet. Enable it in GCP Console or continue immediately in Local Merchant Mode.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <a
                href="https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=195168490405"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                <span>Enable in GCP Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => handleInstantLocalMode()}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3 h-3" />
                <span>Instant Local Mode (No Wait)</span>
              </button>
            </div>
          </div>
        )}

        {/* Guest & Demo Options */}
        <div className="space-y-2">
          {/* Instant 1-Click Local Merchant Mode */}
          <button
            type="button"
            onClick={() => handleInstantLocalMode()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>⚡ Instant 1-Click Local Merchant Login (Zero Wait)</span>
          </button>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition border border-slate-700"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Instant Guest */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition border border-slate-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Continue as Guest Mode</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Instant Profiles:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("owner")}
                className="text-cyan-400 hover:underline font-bold"
              >
                Store Owner
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleQuickDemo("franchise")}
                className="text-indigo-400 hover:underline font-bold"
              >
                Franchise Director
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
