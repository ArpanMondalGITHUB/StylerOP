import { images } from "../../../constants";

const showcaseItems = [
  {
    style: "Ghibli",
    beforeImage:images.girl_real,
    afterImage:images.ghibli,
  },
  {
    style: "csk",
    beforeImage:images.arpan,
    afterImage:images.csk,
  },
  {
    style: "Avtar",
    beforeImage:images.girlsecond,
    afterImage:images.avatar,
  },
];
function Showcase() {
  return (
    <section
      id="showcase"
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Showcase
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            See the Magic
            <br />
            <span className="text-grey">In Action</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real transformations. Real results. No editing skills required.
          </p>
        </div>

        {/* Showcase grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {showcaseItems.map((item, index) => (
            <div
              key={item.style}
              className="group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Style label */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-8 bg-border" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {item.style} Style
                </span>
                <div className="h-px w-8 bg-border" />
              </div>

              {/* Image comparison */}
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-border group-hover:border-grey/50 transition-colors">
                {/* Before image */}
                <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
                  <img
                    src={item.beforeImage}
                    alt={`Before ${item.style} transformation`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-sm font-medium text-foreground bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    Original
                  </span>
                </div>

                {/* After image */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <img
                    src={item.afterImage}
                    alt={`After ${item.style} transformation`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-sm font-medium text-foreground bg-foreground/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    {item.style}
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Instruction */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Hover to see transformation
              </p>
            </div>
          ))}
        </div>

        {/* Additional styles indicator */}
        <div className="flex items-center justify-center gap-4 mt-16">
          <span className="text-sm text-muted-foreground">Also available:</span>
          <div className="flex gap-2">
            {["Comic", "Watercolor", "Oil Paint", "Sketch"].map((style) => (
              <span
                key={style}
                className="px-3 py-1 text-sm text-muted-foreground border border-border rounded-full hover:border-grey/50 hover:text-foreground transition-colors cursor-default"
              >
                {style}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Showcase;
