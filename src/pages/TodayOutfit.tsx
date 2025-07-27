import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { fetchClothingItems, fetchOutfitSuggestions } from "@/services/clothingService";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  Heart, 
  X, 
  RotateCcw, 
  Sparkles, 
  Calendar,
  Star,
  Trophy,
  Award,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeableOutfit {
  id: string;
  top: ClothingItem;
  bottom: ClothingItem;
  suggestion: OutfitSuggestion;
  swiped?: 'left' | 'right';
}

const TodayOutfit = () => {
  const { toast } = useToast();
  const [outfits, setOutfits] = useState<SwipeableOutfit[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedOutfits, setLikedOutfits] = useState<SwipeableOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    setLoading(true);
    try {
      const clothingItems = await fetchClothingItems();
      const suggestions = await fetchOutfitSuggestions();
      
      // Create swipeable outfits from suggestions
      const swipeableOutfits: SwipeableOutfit[] = suggestions.map(suggestion => {
        const top = clothingItems.find(item => item.id === suggestion.topId);
        const bottom = clothingItems.find(item => item.id === suggestion.bottomId);
        
        if (top && bottom) {
          return {
            id: suggestion.id,
            top,
            bottom,
            suggestion
          };
        }
        return null;
      }).filter(Boolean) as SwipeableOutfit[];
      
      // Shuffle outfits for variety
      const shuffled = [...swipeableOutfits].sort(() => Math.random() - 0.5);
      setOutfits(shuffled);
      
      if (shuffled.length === 0) {
        toast({
          title: "No outfits found",
          description: "Generate some outfit suggestions first to use Today's Outfit feature.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error loading outfits",
        description: "Failed to load outfit suggestions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= outfits.length) return;

    const currentOutfit = outfits[currentIndex];
    
    if (direction === 'right') {
      setLikedOutfits(prev => [...prev, currentOutfit]);
      toast({
        title: "Outfit Liked! ❤️",
        description: "Added to your today's selections",
      });
    }

    setCurrentIndex(prev => prev + 1);
    setDragDirection(null);

    // Show results when all outfits are swiped
    if (currentIndex + 1 >= outfits.length) {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= threshold) {
      handleSwipe(offset > 0 ? 'right' : 'left');
    }
  };

  const handlePan = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      setDragDirection('right');
    } else if (info.offset.x < -threshold) {
      setDragDirection('left');
    } else {
      setDragDirection(null);
    }
  };

  const resetSwipes = () => {
    setCurrentIndex(0);
    setLikedOutfits([]);
    setShowResults(false);
    setDragDirection(null);
    loadOutfits();
  };

  const goToNextOutfit = () => {
    if (currentIndex < outfits.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPreviousOutfit = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getMatchQuality = (score: number) => {
    const percentage = Math.round(score * 100);
    if (percentage >= 90) return { label: "Exceptional", color: "text-yellow-600", icon: Trophy };
    if (percentage >= 80) return { label: "Excellent", color: "text-emerald-600", icon: Award };
    if (percentage >= 70) return { label: "Great", color: "text-blue-600", icon: Star };
    return { label: "Good", color: "text-purple-600", icon: Star };
  };

  if (loading) {
    return (
      <Layout>
        <div className="container px-3 sm:px-4 py-6 sm:py-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Loading today's outfit suggestions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (showResults) {
    return (
      <Layout>
        <div className="container px-2 sm:px-4 py-4 sm:py-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="text-xl sm:text-2xl font-bold mb-1 flex items-center justify-center gap-2">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              Your Selections
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {likedOutfits.length} liked out of {outfits.length}
            </p>
          </motion.div>

          {likedOutfits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😅</div>
              <h3 className="text-xl font-semibold mb-2">No outfits selected</h3>
              <p className="text-muted-foreground mb-6">
                Looks like you were picky today! Try again with new combinations.
              </p>
              <Button onClick={resetSwipes} size="lg">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {likedOutfits.map((outfit, index) => {
                  const quality = getMatchQuality(outfit.suggestion.score);
                  const MatchIcon = quality.icon;
                  
                  return (
                    <motion.div
                      key={outfit.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <div className="grid grid-cols-2">
                            <div className="aspect-square relative overflow-hidden bg-gray-50">
                              <img
                                src={outfit.top.imageUrl}
                                alt={outfit.top.name || "Top"}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="aspect-square relative overflow-hidden bg-gray-50 border-l border-gray-200">
                              <img
                                src={outfit.bottom.imageUrl}
                                alt={outfit.bottom.name || "Bottom"}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                          <div className="absolute top-1 right-1">
                            <Badge className="bg-green-600 text-white text-xs px-1.5 py-0.5">
                              <Heart className="w-2 h-2 mr-0.5 fill-current" />
                              ❤️
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <MatchIcon className={`w-3 h-3 ${quality.color}`} />
                              <span className="text-xs font-medium">{quality.label}</span>
                            </div>
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {Math.round(outfit.suggestion.score * 100)}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-700 font-medium truncate">
                              {outfit.top.name || `${outfit.top.color} ${outfit.top.style}`}
                            </p>
                            <p className="text-xs text-gray-700 font-medium truncate">
                              {outfit.bottom.name || `${outfit.bottom.color} ${outfit.bottom.style}`}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetSwipes} variant="outline" size="lg">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try New Outfits
                  </Button>
                  <Button asChild size="lg">
                    <a href="/suggestions">
                      <Sparkles className="mr-2 h-4 w-4" />
                      View All Suggestions
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    );
  }

  const currentOutfit = outfits[currentIndex];
  const remainingCount = outfits.length - currentIndex;

  if (!currentOutfit) {
    return (
      <Layout>
        <div className="container px-3 sm:px-4 py-6 sm:py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">👔</div>
            <h3 className="text-xl font-semibold mb-2">No more outfits</h3>
            <p className="text-muted-foreground mb-6">
              You've seen all available outfit combinations for today.
            </p>
            <Button onClick={resetSwipes} size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const quality = getMatchQuality(currentOutfit.suggestion.score);
  const MatchIcon = quality.icon;

  return (
    <Layout>
      <div className="container px-2 sm:px-4 py-4 sm:py-6 max-w-sm sm:max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Today's Outfit
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {remainingCount} remaining
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-4 sm:mb-6">
          <div 
            className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex) / outfits.length) * 100}%` }}
          />
        </div>

        {/* Swipeable Card */}
        <div className="relative h-[400px] sm:h-[500px] mb-4 sm:mb-6">
          <AnimatePresence>
            <motion.div
              key={currentOutfit.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onPan={handlePan}
              onPanEnd={handlePanEnd}
              dragElastic={0.2}
              initial={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ 
                x: dragDirection === 'left' ? -500 : dragDirection === 'right' ? 500 : 0,
                opacity: 0,
                scale: 0.8,
                rotate: dragDirection === 'left' ? -30 : dragDirection === 'right' ? 30 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full cursor-grab active:cursor-grabbing"
              style={{
                filter: dragDirection ? 'brightness(0.9)' : 'brightness(1)',
                transform: `perspective(1000px) rotateY(${dragDirection === 'left' ? '5deg' : dragDirection === 'right' ? '-5deg' : '0deg'})`,
              }}
            >
              <Card className="h-full overflow-hidden shadow-xl bg-white">
                {/* Outfit Images */}
                <div className="h-2/3 relative overflow-hidden">
                  {/* Like/Dislike Indicators */}
                  <AnimatePresence>
                    {dragDirection === 'right' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-4 left-4 z-20 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg border-2 border-white"
                      >
                        💚 LOVE IT
                      </motion.div>
                    )}
                    {dragDirection === 'left' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: 15 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-4 right-4 z-20 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg border-2 border-white"
                      >
                        ❌ NOPE
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 h-full">
                    <div className="relative overflow-hidden bg-gray-50">
                      <img
                        src={currentOutfit.top.imageUrl}
                        alt={currentOutfit.top.name || "Top"}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          Top
                        </Badge>
                      </div>
                    </div>
                    <div className="relative overflow-hidden bg-gray-50 border-l border-gray-200">
                      <img
                        src={currentOutfit.bottom.imageUrl}
                        alt={currentOutfit.bottom.name || "Bottom"}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          Bottom
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outfit Details - Fixed */}
                <CardContent className="h-1/3 p-3 sm:p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MatchIcon className={`w-4 h-4 ${quality.color}`} />
                        <span className="font-semibold text-sm">{quality.label}</span>
                      </div>
                      <Badge className="bg-primary text-xs">
                        {Math.round(currentOutfit.suggestion.score * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {currentOutfit.top.name || `${currentOutfit.top.color} ${currentOutfit.top.style}`}
                      </p>
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {currentOutfit.bottom.name || `${currentOutfit.bottom.color} ${currentOutfit.bottom.style}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {currentOutfit.suggestion.matchReason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <Button
            onClick={() => handleSwipe('left')}
            variant="outline"
            size="lg"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0 border-red-200 hover:border-red-300 hover:bg-red-50"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          </Button>
          
          <Button
            onClick={() => handleSwipe('right')}
            size="lg"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0 bg-green-500 hover:bg-green-600"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Swipe the image left to pass, right to like
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TodayOutfit;
