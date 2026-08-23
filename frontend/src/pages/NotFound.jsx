import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 text-foreground">
      <div className="text-center glass-effect p-10 rounded-2xl border border-border/40 max-w-md w-full shadow-2xl">
        <div className="inline-block text-6xl font-extrabold text-gradient mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold mb-3 text-foreground">
          Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's get you back to the portfolio.
        </p>
        <Link
          to="/"
          className="btn-hero inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3"
          aria-label="Return to portfolio home page"
        >
          <Home size={16} />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
