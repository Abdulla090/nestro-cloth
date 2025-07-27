
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/ImageUploader";
import ClothingCard from "@/components/ClothingCard";
import { ClothingItem, ClothingType } from "@/types/clothing";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getDominantColor } from "@/utils/colorAnalysis";
import { determineClothingStyle, determineFabricType } from "@/utils/styleAnalysis";
import { AnimatePresence } from "framer-motion";
import { saveClothingItem, fetchClothingItems, deleteClothingItem } from "@/services/clothingService";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { testGeminiConnection } from "@/utils/geminiService";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const MAX_ITEMS = 30; // Increased max items

const Closet = () => {
  const { toast } = useToast();
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tops" | "bottoms">("tops");
  const [geminiStatus, setGeminiStatus] = useState<"checking" | "ok" | "error">("checking");

  // Check Gemini API status on component mount
  useEffect(() => {
    const checkGeminiStatus = async () => {
      try {
        const isConnected = await testGeminiConnection();
        setGeminiStatus(isConnected ? "ok" : "error");
        
        if (!isConnected) {
          toast({
            title: "Gemini API Issue",
            description: "There may be issues with the Gemini API connection. Outfit suggestions might use fallback methods.",
            variant: "destructive",
          });
        }
      } catch (error) {
        setGeminiStatus("error");
      }
    };
    
    checkGeminiStatus();
  }, [toast]);

  // Load clothing items from localStorage
  useEffect(() => {
    const loadClothingItems = async () => {
      setLoading(true);
      try {
        const fetchedTops = await fetchClothingItems('top');
        const fetchedBottoms = await fetchClothingItems('bottom');
        
        setTops(fetchedTops);
        setBottoms(fetchedBottoms);
      } catch (error) {
        console.error("Error loading clothing items:", error);
        toast({
          title: "Error",
          description: "Failed to load your clothing items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClothingItems();
  }, [toast]);

  // Save items to localStorage as backup
  useEffect(() => {
    if (tops.length > 0) {
      localStorage.setItem("closet-fusion-tops", JSON.stringify(tops));
    }
  }, [tops]);

  useEffect(() => {
    if (bottoms.length > 0) {
      localStorage.setItem("closet-fusion-bottoms", JSON.stringify(bottoms));
    }
  }, [bottoms]);

  const handleImageUploaded = async (imageData: string, type: ClothingType) => {
    try {
      // Get dominant color
      const color = await getDominantColor(imageData);
      
      // For simplicity, we're using random assignments for style and fabric
      // In a real app, these would be determined through image analysis
      const style = determineClothingStyle();
      const fabric = determineFabricType();

      const newItemData = {
        type,
        imageUrl: imageData,
        color,
        style,
        fabric,
        added: new Date(),
      };

      // Save to localStorage and get back the item with ID
      const savedItem = await saveClothingItem(newItemData);

      // Update local state
      if (type === "top") {
        setTops((prev) => [savedItem, ...prev]);
      } else {
        setBottoms((prev) => [savedItem, ...prev]);
      }

      toast({
        title: "Item added",
        description: `${type === "top" ? "Top" : "Bottom"} has been added to your closet`,
      });
    } catch (error) {
      console.error("Error processing image", error);
      toast({
        title: "Error",
        description: "Failed to process the image",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      // Determine if it's a top or bottom
      const itemType = tops.some((item) => item.id === id) ? "top" : "bottom";

      // Delete from localStorage
      await deleteClothingItem(id);
      
      // Update local state
      if (itemType === "top") {
        setTops((prev) => prev.filter((item) => item.id !== id));
      } else {
        setBottoms((prev) => prev.filter((item) => item.id !== id));
      }

      toast({
        title: "Item removed",
        description: `${itemType === "top" ? "Top" : "Bottom"} has been removed from your closet`,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete the item",
        variant: "destructive",
      });
    }
  };

  // Filter items based on search query
  const filteredTops = tops.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.style?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.fabric?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBottoms = bottoms.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.style?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.fabric?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading your closet...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-2 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h1 className="text-xl font-bold mb-1">My Closet</h1>
            <p className="text-sm text-muted-foreground">
              Manage your clothing items
            </p>
          </div>
          
          {geminiStatus !== "checking" && (
            <div className="flex items-center">
              <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md">
                <div className={`h-1.5 w-1.5 rounded-full ${geminiStatus === "ok" ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-xs">
                  <span className="hidden sm:inline">{geminiStatus === "ok" ? "AI Connected" : "AI Issues"}</span>
                  <span className="sm:hidden">{geminiStatus === "ok" ? "AI OK" : "Issues"}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <ImageUploader
            type="top"
            onImageUploaded={handleImageUploaded}
            maxImages={MAX_ITEMS}
            currentCount={tops.length}
          />
          <ImageUploader
            type="bottom"
            onImageUploaded={handleImageUploaded}
            maxImages={MAX_ITEMS}
            currentCount={bottoms.length}
          />
        </div>
        
        <Separator className="my-4" />

        <Tabs 
          defaultValue="tops" 
          className="mb-4" 
          onValueChange={(value) => setActiveTab(value as "tops" | "bottoms")}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 h-8">
              <TabsTrigger value="tops" className="text-xs">Tops ({tops.length})</TabsTrigger>
              <TabsTrigger value="bottoms" className="text-xs">Bottoms ({bottoms.length})</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-8 text-sm"
              />
            </div>
          </div>

          <TabsContent value="tops">
            {filteredTops.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                <AnimatePresence>
                  {filteredTops.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-muted/10">
                {searchQuery ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      No tops match "{searchQuery}"
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="h-7 text-xs">
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tops yet. Upload to get started!
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bottoms">
            {filteredBottoms.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence>
                  {filteredBottoms.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                {searchQuery ? (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      No bottoms match your search "{searchQuery}"
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No bottoms added yet. Upload some images to get started!
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Closet;
