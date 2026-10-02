import React, { useState } from "react";
import { LogIn, UserPlus, Sparkles, CheckCircle2, Shield, ArrowRight } from "lucide-react";

const AuthModal = ({ isOpen, onLogin, onSignUp, onContinueDemo }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const registeredUsersKey = "taskly_registered_users";
    let users = {};
    try {
      users = JSON.parse(localStorage.getItem(registeredUsersKey) || "{}");
    } catch (e) {}

    if (isSignUp) {
      // 1. Register new user
      const newUser = {
        id: `user-${Date.now()}`,
        fullName: fullName.trim(),
        email: trimmedEmail,
        password: trimmedPass,
        role: "Personal Workspace",
        avatar: "/assets/avatar.jpg",
        isNewUser: true,
      };

      users[trimmedEmail] = newUser;
      try {
        localStorage.setItem(registeredUsersKey, JSON.stringify(users));
        // Initialize an empty workspace for the new user
        localStorage.setItem(`taskly_tasks_${trimmedEmail}`, JSON.stringify([]));
        localStorage.setItem(`taskly_notes_${trimmedEmail}`, JSON.stringify([]));
      } catch (err) {}

      // Prompt user to sign in
      setSuccessMsg("Account created successfully! Please sign in with your password.");
      setIsSignUp(false);
      return;
    }

    // 2. Sign In
    const foundUser = users[trimmedEmail];
    if (foundUser && foundUser.password !== trimmedPass) {
      setError("Incorrect password. Please try again.");
      return;
    }

    const signedInUser = foundUser || {
      id: `user-${trimmedEmail}`,
      fullName: fullName.trim() || trimmedEmail.split("@")[0] || "Taskly User",
      email: trimmedEmail,
      role: "Personal Workspace",
      avatar: "/assets/avatar.jpg",
      isNewUser: !foundUser,
    };

    onLogin(signedInUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl border border-neutral-150 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Brand Header */}
        <div className="text-center mb-6 relative">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white mx-auto flex items-center justify-center shadow-md mb-3">
            <Sparkles size={22} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            Taskly Workspace
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            {isSignUp
              ? "Create your account for a fresh, clean workspace."
              : "Sign in to access your personal tasks, notes, and metrics."}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF9F6] rounded-2xl border border-neutral-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError("");
              setSuccessMsg("");
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isSignUp
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError("");
              setSuccessMsg("");
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isSignUp
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error message banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900 shadow-2xs font-medium"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900 shadow-2xs font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900 shadow-2xs font-medium"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-102"
          >
            {isSignUp ? (
              <>
                <UserPlus size={15} />
                <span>Create Clean Workspace</span>
              </>
            ) : (
              <>
                <LogIn size={15} />
                <span>Sign In to Taskly</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Option */}
        <div className="mt-5 pt-4 border-t border-neutral-150 text-center">
          <p className="text-[11px] text-neutral-400 mb-2">
            Want to test with sample project data first?
          </p>
          <button
            type="button"
            onClick={onContinueDemo}
            className="text-xs font-bold text-neutral-700 hover:text-black flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <span>Continue with Demo Workspace</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
