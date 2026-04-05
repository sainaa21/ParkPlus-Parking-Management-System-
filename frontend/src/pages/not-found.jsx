import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="glass-card p-12 rounded-2xl text-center border border-white/10">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-white/50 mb-8">Page not found</p>
        <Link href="/">
          <button className="px-6 py-3 rounded-xl bg-primary hover:bg-red-600 text-white font-medium transition-colors">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}