/** Register page. */
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/20 mb-4">
              <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400 mt-1 text-sm">Join and start managing your teams</p>
          </div>

          {errors.non_field_errors && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-4 py-3 mb-6 text-sm">
              {errors.non_field_errors[0]}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="register-username" name="username" label="Username"
              type="text" value={form.username} onChange={handleChange}
              placeholder="Choose a username" required error={fieldErr("username")}
              accentColor="emerald"
            />
            <Input
              id="register-email" name="email" label="Email"
              type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" required error={fieldErr("email")}
              accentColor="emerald"
            />
            <Input
              id="register-password" name="password" label="Password"
              type="password" value={form.password} onChange={handleChange}
              placeholder="Min 8 characters" required error={fieldErr("password")}
              accentColor="emerald"
            />
            <Button id="register-submit" type="submit" loading={loading} variant="success" className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
