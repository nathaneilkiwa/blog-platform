import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const navigate = useNavigate();

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  // Apply theme class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-serif relative overflow-hidden transition-colors duration-300
      dark:bg-[#0a0a0a] bg-[#f8f5f0]">

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300
          dark:bg-[#1a1a1a] dark:border-[#c9a84c] dark:text-[#c9a84c]
          bg-white border border-[#8a7a60] text-[#5a5040]
          hover:scale-110 shadow-lg"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Decorative left panel */}
      <div className={`w-[45%] flex-col justify-center px-16 py-20 relative hidden md:flex
        transition-all duration-500
        dark:border-r dark:border-[#2a2010]
        border-r border-[#e0d5c5]`}
        style={{
          background: isDark
            ? "linear-gradient(160deg, #1a1208 0%, #0f0a04 50%, #0a0a0a 100%)"
            : "linear-gradient(160deg, #f0e9e0 0%, #f5f0e8 50%, #faf7f2 100%)"
        }}>

        {/* Gold accent line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500
          ${isDark 
            ? 'bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent' 
            : 'bg-gradient-to-r from-transparent via-[#b89a4a] to-transparent'}`} />

        <div className="mb-16">
          {/* Diamond logo mark */}
          <div className={`w-10 h-10 border flex items-center justify-center mb-12 transition-all duration-500
            ${isDark ? 'border-[#c9a84c]' : 'border-[#8a7a60]'}`}>
            <div className={`w-4 h-4 transition-all duration-500
              ${isDark ? 'bg-[#c9a84c]' : 'bg-[#8a7a60]'}`}
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
          </div>

          <p className={`text-[11px] tracking-[4px] uppercase mb-6 transition-all duration-500
            ${isDark ? 'text-[#c9a84c]' : 'text-[#8a7a60]'}`}>
            Member Access
          </p>

          <h1 className={`text-[52px] font-normal leading-[1.1] tracking-tight m-0 transition-all duration-500
            ${isDark ? 'text-[#f5f0e8]' : 'text-[#2a2010]'}`}>
            Welcome<br />
            <em className={`italic transition-all duration-500
              ${isDark ? 'text-[#c9a84c]' : 'text-[#b89a4a]'}`}>Back.</em>
          </h1>
        </div>

        <div className={`border-t pt-8 transition-all duration-500
          ${isDark ? 'border-[#2a2010]' : 'border-[#d0c5b5]'}`}>
          <p className={`text-[13px] leading-[1.8] transition-all duration-500
            ${isDark ? 'text-[#5a5040]' : 'text-[#6a6050]'}`}>
            "The details are not the details.<br />
            They make the design."
          </p>
          <p className={`text-[11px] mt-2 tracking-[2px] transition-all duration-500
            ${isDark ? 'text-[#3a3020]' : 'text-[#8a7a60]'}`}>
            — CHARLES EAMES
          </p>
        </div>

        {/* Decorative circles */}
        <div className={`absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full border opacity-50 transition-all duration-500
          ${isDark ? 'border-[#2a2010]' : 'border-[#d0c5b5]'}`} />
        <div className={`absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full border opacity-50 transition-all duration-500
          ${isDark ? 'border-[#2a2010]' : 'border-[#d0c5b5]'}`} />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-[380px]">
          <p className={`text-[11px] tracking-[4px] uppercase mb-10 transition-all duration-500
            ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
            Sign In
          </p>

          {error && (
            <div className={`border px-4 py-3 mb-6 text-[13px] tracking-[0.3px] transition-all duration-500
              ${isDark 
                ? 'bg-[#1a0a0a] border-[#5a1a1a] text-[#cc6666]' 
                : 'bg-[#fff0f0] border-[#ffaaaa] text-[#cc3333]'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email field */}
            <div className="mb-7">
              <label className={`block text-[10px] tracking-[3px] uppercase mb-2.5 transition-all duration-500
                ${isDark ? 'text-[#8a7a60]' : 'text-[#6a6050]'}`}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full bg-transparent border-0 border-b py-2.5 px-0 text-[15px] font-serif outline-none transition-all duration-200 placeholder:transition-colors
                  ${isDark 
                    ? 'text-[#f5f0e8] border-[#2a2010] placeholder-[#3a3020] focus:border-[#c9a84c]' 
                    : 'text-[#2a2010] border-[#d0c5b5] placeholder-[#a09585] focus:border-[#8a7a60]'}`}
              />
            </div>

            {/* Password field */}
            <div className="mb-10">
              <label className={`block text-[10px] tracking-[3px] uppercase mb-2.5 transition-all duration-500
                ${isDark ? 'text-[#8a7a60]' : 'text-[#6a6050]'}`}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full bg-transparent border-0 border-b py-2.5 px-0 text-[15px] font-serif outline-none transition-all duration-200 placeholder:transition-colors
                  ${isDark 
                    ? 'text-[#f5f0e8] border-[#2a2010] placeholder-[#3a3020] focus:border-[#c9a84c]' 
                    : 'text-[#2a2010] border-[#d0c5b5] placeholder-[#a09585] focus:border-[#8a7a60]'}`}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-[11px] tracking-[4px] uppercase font-serif font-semibold transition-all duration-200 border-none
                ${isLoading
                  ? isDark
                    ? "bg-[#2a2010] text-[#8a7a60] cursor-not-allowed"
                    : "bg-[#d0c5b5] text-[#6a6050] cursor-not-allowed"
                  : isDark
                    ? "bg-[#c9a84c] text-[#0a0a0a] cursor-pointer hover:bg-[#e0b85c]"
                    : "bg-[#8a7a60] text-white cursor-pointer hover:bg-[#9a8a70]"
                }`}
            >
              {isLoading ? "Authenticating..." : "Enter"}
            </button>
          </form>

          <p className={`mt-8 text-[12px] tracking-[0.5px] transition-all duration-500
            ${isDark ? 'text-[#3a3020]' : 'text-[#8a7a60]'}`}>
            No account?{" "}
            <a
              href="/register"
              className={`border-b pb-px no-underline transition-all duration-200
                ${isDark 
                  ? 'text-[#8a7a60] border-[#3a3020] hover:text-[#c9a84c] hover:border-[#c9a84c]' 
                  : 'text-[#5a5040] border-[#b0a595] hover:text-[#8a7a60] hover:border-[#8a7a60]'}`}
            >
              Register
            </a>
          </p>

          {/* Mobile decorative element - visible only on small screens */}
          <div className="md:hidden mt-12 pt-8 border-t border-[#d0c5b5] dark:border-[#2a2010]">
            <p className="text-[11px] text-[#8a7a60] dark:text-[#5a5040]">
              "The details make the design."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;