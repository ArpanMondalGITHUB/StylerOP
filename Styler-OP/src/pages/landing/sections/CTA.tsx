import { Button } from "../../../components/ui/Button";
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

function CTA() {
  return (
    <section id="cta" className="relative py-32 bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-grey/5 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-grey/3 blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-grey/3 blur-2xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA card */}
          <div className="card-premium p-12 md:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-b from-grey/20 to-transparent blur-2xl" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Try StyleForge AI
              </h2>
              <p className="text-xl md:text-2xl text-grey mb-4">
                Your creativity, one click away.
              </p>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10">
                Join thousands of creators who are already transforming their
                photos into stunning works of art. No credit card required.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth">
                  <Button variant="hero" size="lg" className="group min-w-[200px]">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  View Pricing
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-10 pt-10 border-t border-border">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-grey"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground">
                    Secure Processing
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-grey"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground">
                    Instant Results
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-grey"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground">
                    No Card Required
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
