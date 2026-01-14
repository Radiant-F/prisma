import { useNavigate } from "react-router";

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            Please enter your details to sign in
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/home");
          }}
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-purple-100 block ml-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/30 transition-all duration-200 hover:bg-white/10"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-purple-100 block ml-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/30 transition-all duration-200 hover:bg-white/10"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm px-1">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500/50 focus:ring-offset-0"
              />
              <span className="text-purple-200 group-hover:text-white transition-colors">
                Remember me
              </span>
            </label>
            <a
              href="#"
              className="text-purple-300 hover:text-white transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-purple-200">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-semibold text-white hover:text-purple-300 transition-colors"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
