import { Sparkles, Palette, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "No Prompts Required",
    description:
      "Simply upload your image and select a style. Our AI understands context automatically — no complex prompting needed.",
  },
  {
    icon: Palette,
    title: "Multiple Styles",
    description:
      "Choose from Ghibli, Anime, Pixar, Comic, Watercolor, and more. New styles added regularly.",
  },
  {
    icon: Zap,
    title: "Fast & Automatic",
    description:
      "Get your transformed image in under 5 seconds. High-quality results every single time.",
  },
  {
    icon: Shield,
    title: "Privacy Friendly",
    description:
      "Your images are processed securely and deleted immediately after. We never store or share your data.",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-32 bg-background">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-grey/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Features
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Everything You Need,
            <br />
            <span className="text-grey">Nothing You Don't</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            StyleForge AI strips away complexity so you can focus on creativity.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-premium p-8 group hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-grey/20 transition-colors">
                <feature.icon className="w-7 h-7 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
