import { Button } from "../../../components/ui/Button";
import { Upload } from "lucide-react";
import Scene3D from "./Scene3D";

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <Scene3D />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 backdrop-blur-sm opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Powered by Advanced AI
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-foreground opacity-0 animate-fade-in-up text-center"
            style={{ animationDelay: "0.4s" }}
          >
            Transform Your Photoes{" "}
            <span className="text-gradient">Instantly</span>
            <br />
            <span className="text-gray-400">No Prompts Needed.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            Upload your picture, choose a style, and let our AI do the magic.
            <br className="hidden md:block" />
            Ghibli, Anime, Pixar, Comic — all at your fingertips.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Button variant="hero" size="lg" className="group">
              <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Upload Your Photo
            </Button>
            <Button variant="ghost" size="lg">
              Watch Demo
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
          </div>

          {/* Stats */}
          <div
            className="flex items-center justify-center gap-8 md:gap-16 pt-12 opacity-0 animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                50K+
              </p>
              <p className="text-sm text-muted-foreground">
                Images Transformed
              </p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                10+
              </p>
              <p className="text-sm text-muted-foreground">Art Styles</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                &lt;5s
              </p>
              <p className="text-sm text-muted-foreground">Processing Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-fade-in"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-muted-foreground animate-bounce" />
        </div>
      </div>
      
    </section>
  );
}

export default Hero;
