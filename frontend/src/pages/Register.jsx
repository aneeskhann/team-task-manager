/** Register page — matching login style with emerald accent. */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

export default function Register() {
  const { register: registerUser, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await registerUser(form.username, form.email, form.password);
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      const d = err.response?.data || {};
      if (typeof d === "object") setErrors(d);
      else setErrors({ non_field_errors: ["Registration failed."] });
    } finally {
      setLoading(false);
    }
  };

  const fieldErr = (name) => {
    const e = errors[name];
    return e ? (Array.isArray(e) ? e[0] : e) : undefined;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden">
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-600/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-teal-600/6 rounded-full blur-[120px]" />

      <div className="w-full max-w-md mx-4 relative page-enter">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/20 p-8">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-5 shadow-xl shadow-emerald-500/25">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Join your team and start collaborating</p>
          </div>

          {errors.non_field_errors && (
            <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              {errors.non_field_errors[0]}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="register-username" name="username" label="Username"
              type="text" value={form.username} onChange={handleChange}
              placeholder="Choose a username" required error={fieldErr("username")}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <Input
              id="register-email" name="email" label="Email"
              type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" required error={fieldErr("email")}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            <Input
              id="register-password" name="password" label="Password"
              type="password" value={form.password} onChange={handleChange}
              placeholder="Min 8 characters" required error={fieldErr("password")}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            />
            <Button id="register-submit" type="submit" loading={loading} variant="success" className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <div className="flex items-center mt-6 mb-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="px-3 text-xs text-slate-600">OR</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
