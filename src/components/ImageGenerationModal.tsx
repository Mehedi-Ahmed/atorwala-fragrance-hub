
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RunwareService } from "@/services/imageGeneration";

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (productId: string, imageUrl: string) => void;
}

const ImageGenerationModal = ({ isOpen, onClose, onImageGenerated }: ImageGenerationModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const productPrompts = {
    'mystic-blossom': "Elegant perfume bottle with delicate floral design, feminine, pastel colors, crystal clear glass, luxury attar bottle, 6ml size, beautiful feminine fragrance container, soft lighting, premium cosmetic photography",
    'sapphire-sand': "Luxury masculine perfume bottle, deep blue and gold accents, geometric design, premium glass, desert-inspired, sapphire gem details, 6ml attar bottle, masculine fragrance, professional product photography",
    'raw-pulse': "Bold masculine perfume bottle, dark and powerful design, black and metallic finish, strong geometric shapes, intense fragrance bottle, 6ml luxury attar, premium mens cologne bottle, dramatic lighting"
  };

  const generateImages = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Runware API key to generate images.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const runwareService = new RunwareService(apiKey);

    try {
      for (const [productId, prompt] of Object.entries(productPrompts)) {
        const result = await runwareService.generateImage({
          positivePrompt: prompt,
          model: "runware:100@1",
          width: 1024,
          height: 1024,
          numberResults: 1,
          outputFormat: "WEBP",
        });

        setGeneratedImages(prev => ({
          ...prev,
          [productId]: result.imageURL
        }));
      }

      toast({
        title: "Images Generated Successfully!",
        description: "All product images have been generated. Click 'Apply Images' to use them.",
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate images. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyImages = () => {
    Object.entries(generatedImages).forEach(([productId, imageUrl]) => {
      onImageGenerated(productId, imageUrl);
    });
    onClose();
    toast({
      title: "Images Applied!",
      description: "New product images have been applied successfully.",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold text-luxury-navy">
            Generate Product Images
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
            disabled={isGenerating}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-luxury-navy font-semibold">
              Runware API Key *
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Runware API key"
              disabled={isGenerating}
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from <a href="https://runware.ai/" target="_blank" rel="noopener noreferrer" className="text-luxury-gold hover:underline">runware.ai</a>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(productPrompts).map(([productId, prompt]) => (
              <div key={productId} className="space-y-2">
                <h4 className="font-semibold text-luxury-navy capitalize">
                  {productId.replace('-', ' ')}
                </h4>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  {generatedImages[productId] ? (
                    <img 
                      src={generatedImages[productId]} 
                      alt={productId}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <RefreshCw className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Image will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={generateImages}
              disabled={isGenerating || !apiKey.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Images"
              )}
            </Button>
            
            {Object.keys(generatedImages).length > 0 && (
              <Button 
                onClick={applyImages}
                variant="outline"
                disabled={isGenerating}
              >
                Apply Images
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGenerationModal;
