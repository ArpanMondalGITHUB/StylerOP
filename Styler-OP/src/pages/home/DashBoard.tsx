import { useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/Button";
import {
  History,
  LogOut,
  Upload,
  X,
  Image,
  Sparkles,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import type { StyleType } from "../../types/images.types";
import { useAppDispatch, useAppSelector } from "../../hooks/All_Hooks";
import { resetTransform, transformImage } from "../../redux/slice/imageSlice";

const styles = [
  {
    value: "ghibli",
    label: "Ghibli",
    description: "Studio Ghibli anime style",
  },
  {
    value: "illustration",
    label: "Illustration",
    description: "Digital illustration style",
  },
  { value: "csk", label: "CSK", description: "Comic sketch style" },
  { value: "pixar", label: "Pixar", description: "3D Pixar animation style" },
  { value: "anime", label: "Anime", description: "Japanese anime style" },
];

function DashBoard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    transformedImage,
    originalImage,
    currentResponse,
    history,
    isLoading,
    error,
  } = useAppSelector((state) => state.image);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Clear previous transformatio
      dispatch(resetTransform());
    }
  };

  const handleTransform = async () => {
    if (!selectedFile || !selectedStyle) {
      toast.error("Please select both an image and a style");
      return;
    }

    try {
      const result = await dispatch(
        transformImage({
          file: selectedFile,
          style: selectedStyle as StyleType,
        }),
      ).unwrap();

      toast.success("Image transformed successfully! 🎨");

      if (
        result.response.transformations_remaining !== null &&
        result.response.transformations_remaining !== undefined
      ) {
        toast.info(
          `${result.response.transformations_remaining} transformations remaining`,
        );
      }
    } catch (error: any) {
      console.error("Transformation error:", error);
      if (error.response?.status === 403) {
        toast.error(
          "Transformation limit reached. Please upgrade your subscription.",
        );
      } else if (error.response?.status === 413) {
        toast.error("File too large. Maximum size is 5MB");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.detail || "Invalid image file");
      } else {
        toast.error("Failed to transform image. Please try again.");
      }
    }
  };

  const handleLogout = () => {};

  const downloadImage = () => {
    if (!transformedImage) return;
    const link = document.createElement("a");
    link.href = transformedImage;
    link.download = `transformed-${selectedStyle}-${Date.now()}.png`;
    link.click();
    toast.success("Image downloaded!");
  };

  const clearImage = () => {
    setSelectedFile(null);
    setSelectedStyle("");

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Revoke object URL to free memory
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    dispatch(resetTransform());
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Styler
          </h1>

          <div className="flex items-center gap-3">
            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <History className="w-4 h-4" />
                  History
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="text-foreground">
                    Transformation History
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      No transformations yet. Start by uploading an image!
                    </p>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="aspect-square rounded-md overflow-hidden">
                            <img
                              src={item.originalImage}
                              alt="Original"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="aspect-square rounded-md overflow-hidden">
                            <img
                              src={item.transformedImage}
                              alt="Transformed"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground capitalize">
                            {item.style}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 ">
        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Transform Your Photo
            </h2>
            <p className="text-muted-foreground">
              Upload an image and select a style to transform it with AI
            </p>
          </div>
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {transformedImage && (
            <div className="mb-8 p-6 rounded-xl bg-secondary/30 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Transformation Result
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Original</p>
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    <img
                      src={originalImage || previewUrl}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedStyle} Style
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadImage}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    <img
                      src={transformedImage}
                      alt="Transformed"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Show remaining transformations */}
              {currentResponse?.transformations_remaining !== null &&
                currentResponse?.transformations_remaining !== undefined && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {currentResponse.transformations_remaining}{" "}
                      transformations remaining
                    </p>
                  </div>
                )}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={clearImage}
                  className="gap-2"
                >
                  Transform Another Image
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">
                Upload Image
              </label>
              <div
                onClick={() => !previewUrl && fileInputRef.current?.click()}
                className={`
                  relative aspect-square rounded-xl border-2 border-dashed 
                  transition-all duration-300 cursor-pointer
                  ${
                    previewUrl
                      ? "border-border bg-secondary/30"
                      : "border-muted-foreground/30 hover:border-muted-foreground/60 bg-secondary/20"
                  }
                `}
              >
                {previewUrl ? (
                  <div>
                    <img
                      src={previewUrl}
                      alt="Selected"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background border border-border transition-colors"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="p-4 rounded-full bg-secondary">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-medium">
                        Drop your image here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">
                  Choose a Style
                </label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder="Select a style..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {styles.map((style) => (
                      <SelectItem
                        value={style.value}
                        key={style.value}
                        className="focus:bg-secondary"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{style.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {style.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Style Preview Cards */}
              <div className="grid grid-cols-3 gap-3">
                {styles.slice(0, 3).map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`
                      p-4 rounded-lg border transition-all duration-200
                      ${
                        selectedStyle === style.value
                          ? "border-foreground bg-secondary"
                          : "border-border bg-secondary/30 hover:bg-secondary/50"
                      }
                    `}
                  >
                    <Image className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs font-medium text-foreground text-center">
                      {style.label}
                    </p>
                  </button>
                ))}
              </div>
              {/* TransForm  utton */}
              <Button
                className="w-full h-14 text-lg font-semibold gap-2"
                size="lg"
                onClick={handleTransform}
                disabled={!selectedStyle || !previewUrl || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Transforming...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Transform Image
                  </>
                )}
              </Button>
              {/* Info */}
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Tip:</span> For
                  best results, use clear, well-lit photos with a single
                  subject.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashBoard;
