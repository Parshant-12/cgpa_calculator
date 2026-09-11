import React, { useMemo, useState } from "react";
import { apiRequest } from "./api";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Home as HomeIcon,
  LockKeyhole,
  Mail,
  Plus,
  Sparkles,
  User,
  X,
  Github
} from "lucide-react";

/*
  BACKEND INTEGRATION NOTES
  -------------------------
  This frontend intentionally keeps authentication local so the UI can be tested
  without a server. Replace the marked handlers below with your API calls.

  Suggested endpoints:
    POST /api/auth/signup
    POST /api/auth/signin
    POST /api/auth/forgot-password
    GET  /api/me
    POST /api/calculations

  Store an access token in an httpOnly secure cookie on the backend rather than
  localStorage for a production authentication flow.
*/

const formulaOptions = [
  {
    id: "weighted",
    label: "Weighted by Credits",
    expression: "Σ(Grade Point × Credit Hours) / Total Credit Hours"
  },
  {
    id: "average",
    label: "Simple Average",
    expression: "ΣGPA / Number of Semesters"
  },
  {
    id: "percentage",
    label: "Percentage to CGPA",
    expression: "Percentage / 9.5"
  }
];

const initialSemesters = [
  { id: 1, gpa: "", credits: "" },
  { id: 2, gpa: "", credits: "" },
  { id: 3, gpa: "", credits: "" },
  { id: 4, gpa: "", credits: "" }
];

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="CGPA Calc home">
      <span className="logo-mark"><GraduationCap size={30} /></span>
      <span><b>CGPA</b> Calc</span>
    </Link>
  );
}

function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Logo />
        <nav className="nav-links">
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            <HomeIcon size={16} /> Home
          </Link>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-actions">
          <Link className="button button-outline small" to="/signin">Sign In</Link>
          <Link className="button button-gradient small" to="/signup">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}

function SemesterCard({ semester, index, onChange, onRemove }) {
  return (
    <div className="semester-card">
      <div className="semester-heading">
        <h3>Semester {index + 1}</h3>
        <button
          className="remove-button"
          onClick={() => onRemove(semester.id)}
          aria-label={`Remove semester ${index + 1}`}
          disabled={index < 4}
          title={index < 4 ? "The first four semesters are required" : "Remove semester"}
        >
          <X size={18} />
        </button>
      </div>

      <label>GPA (Grade Point)</label>
      <input
        type="number"
        min="0"
        max="10"
        step="0.01"
        placeholder="e.g. 8.5"
        value={semester.gpa}
        onChange={(e) => onChange(semester.id, "gpa", e.target.value)}
      />

      <label>Total Credits</label>
      <input
        type="number"
        min="0"
        step="0.5"
        placeholder="e.g. 24"
        value={semester.credits}
        onChange={(e) => onChange(semester.id, "credits", e.target.value)}
      />
    </div>
  );
}

function CalculatorPage() {
  const [semesters, setSemesters] = useState(initialSemesters);
  const [formula, setFormula] = useState("weighted");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const selectedFormula = useMemo(
    () => formulaOptions.find((item) => item.id === formula),
    [formula]
  );

  const updateSemester = (id, field, value) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === id ? { ...semester, [field]: value } : semester
      )
    );
    setResult(null);
    setError("");
  };

  const addSemester = () => {
    setSemesters((current) => [
      ...current,
      { id: Date.now(), gpa: "", credits: "" }
    ]);
  };

  const removeSemester = (id) => {
    setSemesters((current) => current.filter((semester) => semester.id !== id));
    setResult(null);
  };

  const calculate = async () => {
    const filled = semesters.filter(
      (semester) => semester.gpa !== "" || semester.credits !== ""
    );

    if (!filled.length) {
      setError("Enter at least one semester's GPA and total credits.");
      setResult(null);
      return;
    }

    const invalid = filled.some((semester) => {
      const gpa = Number(semester.gpa);
      const credits = Number(semester.credits);
      return (
        semester.gpa === "" ||
        semester.credits === "" ||
        Number.isNaN(gpa) ||
        Number.isNaN(credits) ||
        gpa < 0 ||
        gpa > 10 ||
        credits <= 0
      );
    });

    if (invalid) {
      setError("Please enter a valid GPA (0–10) and positive total credits for every semester.");
      setResult(null);
      return;
    }

    let cgpa;
    let totalCredits = filled.reduce((sum, s) => sum + Number(s.credits), 0);
    let totalPoints = filled.reduce(
      (sum, s) => sum + Number(s.gpa) * Number(s.credits),
      0
    );

    if (formula === "weighted") {
      cgpa = totalPoints / totalCredits;
    } else if (formula === "average") {
      cgpa = filled.reduce((sum, s) => sum + Number(s.gpa), 0) / filled.length;
    } else {
      // For this option, the input GPA field is treated as percentage.
      const percentages = filled.map((s) => Number(s.gpa));
      if (percentages.some((p) => p > 100)) {
        setError("For Percentage to CGPA, enter percentage values between 0 and 100 in the GPA field.");
        setResult(null);
        return;
      }
      cgpa = percentages.reduce((sum, p) => sum + p, 0) / percentages.length / 9.5;
    }

    cgpa = Math.min(10, Math.max(0, cgpa));

    setResult({
      cgpa,
      totalCredits,
      totalPoints,
      semesterCount: filled.length
    });

    /*
      BACKEND INTEGRATION:
      Save the calculation for authenticated users. The API uses the httpOnly
      session cookie; unauthenticated calculations still display locally.
    */
    try {
      await apiRequest("/api/calculations", {
        method: "POST",
        body: JSON.stringify({
          formula,
          semesters: filled.map((item, i) => ({
            semester: i + 1,
            gpa: Number(item.gpa),
            credits: Number(item.credits)
          })),
          cgpa
        })
      });
    } catch (saveError) {
      console.info("Calculation not saved:", saveError.message);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-note left-note">Plan<br />Calculate<br />Achieve <ArrowRight size={22} /></div>
          <div className="hero-note right-note">A Brighter<br />Academic Future <ArrowRight size={22} /></div>

          <div className="hero-icon"><GraduationCap size={48} /></div>
          <h1><span>CGPA</span> Calculator</h1>
        </section>

        <section className="calculator-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">
                <span className="title-icon"><Calculator size={21} /></span>
                <div>
                  <h2>Calculate Your CGPA</h2>
                  <p>Enter your semester GPA and total credits for each semester</p>
                </div>
              </div>
            </div>

            <div className="formula-picker">
              <label htmlFor="formula">CGPA Formula <span className="info">i</span></label>
              <select id="formula" value={formula} onChange={(e) => {
                setFormula(e.target.value);
                setResult(null);
              }}>
                {formulaOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} ({option.expression})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="formula-hint">
            <strong>Default:</strong> {selectedFormula.expression}
          </div>

          <div className="semester-grid">
            {semesters.map((semester, index) => (
              <SemesterCard
                key={semester.id}
                semester={semester}
                index={index}
                onChange={updateSemester}
                onRemove={removeSemester}
              />
            ))}
          </div>

          <div className="calculator-actions">
            <button className="button button-outline add-button" onClick={addSemester}>
              <Plus size={21} /> Add Semester
            </button>
            <button className="button button-gradient calculate-button" onClick={calculate}>
              <Calculator size={20} /> Calculate Your CGPA
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className={`result-panel ${result ? "has-result" : ""}`}>
            {result ? (
              <>
                <div className="result-main">
                  <div className="trophy"><Sparkles size={42} /></div>
                  <div>
                    <p>Your CGPA is</p>
                    <strong>{result.cgpa.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="result-details">
                  <h3>Calculation Details</h3>
                  <p>Total Credit Hours <b>{result.totalCredits.toFixed(1)}</b></p>
                  <p>Total (Grade Point × Credits) <b>{result.totalPoints.toFixed(1)}</b></p>
                  <div className="calculation-line">
                    {formula === "weighted"
                      ? `${result.totalPoints.toFixed(1)} ÷ ${result.totalCredits.toFixed(1)} = ${result.cgpa.toFixed(2)}`
                      : `${selectedFormula.label} = ${result.cgpa.toFixed(2)}`
                    }
                  </div>
                </div>

                <div className="quote-box">
                  <span>“</span>
                  Consistent effort today,<br />greater opportunities tomorrow.
                </div>
              </>
            ) : (
              <div className="empty-result">
                <BarChart3 size={30} />
                <h3>Your CGPA</h3>
                <div className="placeholder-score">— —</div>
                <p>Enter your semester details and click calculate</p>
              </div>
            )}
          </div>
        </section>

        <section className="faq" id="faq">
          <h2>FAQ</h2>
          <details>
            <summary>Which formula is used by default?</summary>
            <p>The default calculation is credit-weighted: Σ(Grade Point × Credit Hours) divided by Total Credit Hours.</p>
          </details>
          <details>
            <summary>Can I add more than four semesters?</summary>
            <p>Yes. Four semesters are shown by default, and the Add Semester button lets you add more.</p>
          </details>
        </section>
      </main>
    </div>
  );
}


function AuthLayout({ children, oppositeText, oppositeLink, oppositeLabel }) {
  return (
    <div className="auth-shell">
      <div className="auth-topbar">
        <Logo />
        <span>{oppositeText} <Link to={oppositeLink}>{oppositeLabel}</Link></span>
      </div>
      {children}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-wrap">
      <LockKeyhole size={18} />
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      <button type="button" onClick={() => setVisible((v) => !v)} aria-label="Toggle password visibility">
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function SignInPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      await apiRequest("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ ...form, remember })
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout
      oppositeText="Don't have an account?"
      oppositeLink="/signup"
      oppositeLabel="Sign Up"
    >
      <div className="auth-card">
        <div className="auth-heading">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue to your CGPA Calculator</p>
        </div>

        <form onSubmit={submit}>
          <label>Email</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <label>Password</label>
          <PasswordInput
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <Link className="text-button" to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="button button-gradient full-width" type="submit">
            Sign In <ArrowRight size={19} />
          </button>
        </form>

        <AuthSocialButtons action="sign in" />

        <div className="auth-footer">
          <GraduationCap size={28} />
          <span>Better Planning&nbsp; • &nbsp;Higher Grades&nbsp; • &nbsp;Brighter Future</span>
        </div>
      </div>
    </AuthLayout>
  );
}

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!accepted) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout
      oppositeText="Already have an account?"
      oppositeLink="/signin"
      oppositeLabel="Sign In"
    >
      <div className="auth-card signup-card">
        <div className="auth-heading">
          <h1>Create Your Account</h1>
        </div>

        <form onSubmit={submit}>
          <div className="two-column">
            <div>
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label>Email</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label>Password</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <PasswordInput
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <label className="checkbox-label terms">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            I agree to the <button type="button" className="text-button">Terms of Service</button> and <button type="button" className="text-button">Privacy Policy</button>
          </label>

          {error && <div className="error-message">{error}</div>}

          <button className="button button-gradient full-width" type="submit">
            Create Account <ArrowRight size={19} />
          </button>
        </form>

        <AuthSocialButtons action="sign up" />
      </div>
    </AuthLayout>
  );
}

function AuthSocialButtons({ action }) {
  const social = (provider) => {
    /*
      BACKEND INTEGRATION:
      Start the OAuth flow here, for example:
      window.location.href = `/api/auth/${provider.toLowerCase()}`;
      The backend handles OAuth callback, account creation/login, and session.
    */
    alert(`Connect ${provider} OAuth in the backend.`);
  };

  return (
    <div className="social-section">
      <div className="divider"><span>Or {action} with</span></div>
      <div className="social-grid">
        <button type="button" className="social-button" onClick={() => social("Google")}>
          <span className="google-g">G</span> Continue with Google
        </button>
        <button type="button" className="social-button" onClick={() => social("GitHub")}>
          <Github size={19} /> Continue with GitHub
        </button>
      </div>
    </div>
  );
}


function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      navigate("/reset-link-sent", { state: { email } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout
      oppositeText="Remember your password?"
      oppositeLink="/signin"
      oppositeLabel="Sign In"
    >
      <div className="auth-card recovery-card">
        <div className="recovery-icon"><GraduationCap size={48} /></div>
        <div className="auth-heading">
          <h1><span>Forgot</span> Password?</h1>
        </div>

        <form onSubmit={submit}>
          <label>Email</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="button button-gradient full-width" type="submit">
            <ArrowRight size={19} /> Send Reset Link
          </button>
        </form>

        <Link className="back-link" to="/signin">← &nbsp;Back to Sign In</Link>

        <div className="auth-footer">
          <GraduationCap size={28} />
          <span>"A Brighter Academic Future Awaits You"</span>
        </div>
      </div>
    </AuthLayout>
  );
}

function ResetLinkSentPage() {
  const location = useLocation();
  const email = location.state?.email || "your email address";

  return (
    <AuthLayout
      oppositeText="Need help?"
      oppositeLink="/forgot-password"
      oppositeLabel="Try again"
    >
      <div className="auth-card recovery-card status-card">
        <div className="status-icon">
          <Mail size={42} />
          <Check size={20} />
        </div>

        <div className="auth-heading">
          <h1><span>Reset Link</span> Sent!</h1>
          <p>
            We've sent a password reset link to<br />
            <strong>{email}</strong>
          </p>
        </div>

        <div className="instruction-box">
          Please check your inbox and click the link to reset your password.
          If you don't see it, check your spam or junk folder.
        </div>

        <Link className="button button-gradient full-width" to="/signin">
          Back to Sign In <ArrowRight size={19} />
        </Link>

        <Link className="back-link" to="/forgot-password">← &nbsp;Use a different email</Link>

        <div className="auth-footer">
          <GraduationCap size={28} />
          <span>"A Brighter Academic Future Awaits You"</span>
        </div>
      </div>
    </AuthLayout>
  );
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError("This reset link is missing or invalid. Please request a new one.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: form.password })
      });
      navigate("/reset-success");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout
      oppositeText="Remember your password?"
      oppositeLink="/signin"
      oppositeLabel="Sign In"
    >
      <div className="auth-card recovery-card reset-card">
        <div className="recovery-icon"><GraduationCap size={48} /></div>
        <div className="auth-heading">
          <h1><span>Reset</span> Your Password</h1>
          <p>Enter your new password below.</p>
        </div>

        <form onSubmit={submit}>
          <label>New Password</label>
          <PasswordInput
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter new password"
            autoComplete="new-password"
          />

          <ul className="password-rules">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
          </ul>

          <label>Confirm New Password</label>
          <PasswordInput
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />

          {error && <div className="error-message">{error}</div>}

          <button className="button button-gradient full-width" type="submit">
            <Check size={19} /> Reset Password
          </button>
        </form>

        <Link className="back-link" to="/signin">← &nbsp;Back to Sign In</Link>

        <div className="auth-footer">
          <GraduationCap size={28} />
          <span>"A Brighter Academic Future Awaits You"</span>
        </div>
      </div>
    </AuthLayout>
  );
}

function ResetSuccessPage() {
  return (
    <AuthLayout
      oppositeText="Ready to continue?"
      oppositeLink="/signin"
      oppositeLabel="Sign In"
    >
      <div className="auth-card recovery-card status-card success-card">
        <div className="success-icon"><Check size={48} /></div>

        <div className="auth-heading">
          <h1><span>Password</span> Reset Successfully!</h1>
          <p>Your password has been updated.<br />You can now sign in with your new password.</p>
        </div>

        <Link className="button button-gradient full-width" to="/signin">
          Go to Sign In <ArrowRight size={19} />
        </Link>

        <div className="auth-footer">
          <GraduationCap size={28} />
          <span>"A Brighter Academic Future Awaits You"</span>
        </div>
      </div>
    </AuthLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CalculatorPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-link-sent" element={<ResetLinkSentPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/reset-success" element={<ResetSuccessPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;