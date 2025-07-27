
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import OutfitCard from "./OutfitCard";
import { motion } from "framer-motion";
import { Trophy, Award, Medal, Sparkles, Crown, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface TopOutfitsPodiumProps {
  suggestions: OutfitSuggestion[];
  findClothingItem: (id: string) => ClothingItem | undefined;
}

const TopOutfitsPodium = ({ suggestions, findClothingItem }: TopOutfitsPodiumProps) => {
  // Get top 3 suggestions
  const topSuggestions = [...suggestions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
    
  const isMobile = useIsMobile();
  
  if (topSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 sm:mb-12 lg:mb-16 px-2 sm:px-4">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-8 lg:mb-12"
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent text-center">
            Top Outfit Suggestions
          </h2>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 1 }}
          >
            <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">Your best AI-analyzed outfit combinations</p>
        
        {/* AI Vision Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 sm:mt-4"
        >
          <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Enhanced with AI Vision Analysis
          </Badge>
        </motion.div>
      </motion.div>
      
      {/* Enhanced Podium Display */}
      <div className="relative">
        {/* Desktop Podium Platform */}
        {!isMobile && (
          <div className="hidden lg:block mb-6 lg:mb-8">
            <div className="flex justify-center items-end h-16 sm:h-20 lg:h-24 relative">
              {topSuggestions.map((suggestion, index) => {
                // Reorder for podium display (1st in middle, 2nd on left, 3rd on right)
                const podiumOrder = index === 0 ? 1 : index === 1 ? 0 : 2;
                const heights = ["h-12 sm:h-14 lg:h-16", "h-16 sm:h-18 lg:h-20", "h-8 sm:h-10 lg:h-12"]; // 2nd, 1st, 3rd
                const gradients = [
                  "from-yellow-400 via-yellow-500 to-amber-600", // 1st
                  "from-slate-300 via-slate-400 to-slate-500", // 2nd  
                  "from-amber-600 via-amber-700 to-amber-800"  // 3rd
                ];
                
                const scorePercentage = Math.round(suggestion.score * 100);
                
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ 
                      delay: 0.5 + (index * 0.2), 
                      duration: 0.6,
                      type: "spring" 
                    }}
                    style={{ order: podiumOrder }}
                    className={`${heights[index]} mx-2 sm:mx-3 rounded-t-xl w-24 sm:w-28 lg:w-32 relative overflow-hidden`}
                  >
                    {/* Podium Base */}
                    <div className={`h-full bg-gradient-to-t ${gradients[index]} shadow-lg border border-white/20`} />
                    
                    {/* Rank Badge */}
                    <motion.div
                      initial={{ scale: 0, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: 0.8 + (index * 0.2), type: "spring" }}
                      className="absolute -top-8 sm:-top-10 lg:-top-12 left-1/2 transform -translate-x-1/2"
                    >
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-xl border-2 sm:border-3 lg:border-4 border-white`}>
                        <span className="text-white font-bold text-base sm:text-lg lg:text-xl">
                          {index + 1}
                        </span>
                      </div>
                    </motion.div>
                    
                    {/* Score Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + (index * 0.2) }}
                      className="absolute -bottom-6 sm:-bottom-7 lg:-bottom-8 left-1/2 transform -translate-x-1/2"
                    >
                      <Badge 
                        variant="secondary" 
                        className="bg-white shadow-md border text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1"
                      >
                        {scorePercentage}%
                      </Badge>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Podium Labels */}
            <div className="flex justify-center items-center mt-8 sm:mt-10 lg:mt-12 mb-4 sm:mb-5 lg:mb-6">
              {["2nd Place", "1st Place", "3rd Place"].map((label, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + (idx * 0.1) }}
                  className="w-24 sm:w-28 lg:w-32 mx-2 sm:mx-3 text-center"
                >
                  <span className={`text-sm sm:text-base lg:text-lg font-bold ${
                    label.includes("1st") ? "text-yellow-600" :
                    label.includes("2nd") ? "text-slate-600" :
                    "text-amber-700"
                  }`}>
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Enhanced Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {topSuggestions.map((suggestion, index) => {
            const top = findClothingItem(suggestion.topId);
            const bottom = findClothingItem(suggestion.bottomId);
            
            if (!top || !bottom) return null;
            
            // For mobile view, maintain actual rank order
            // For desktop, reorder for podium display (1st in middle, 2nd on left, 3rd on right)
            const displayIndex = isMobile ? index : 
                                index === 0 ? 1 : 
                                index === 1 ? 0 : 2;
            
            return (
              <motion.div 
                key={suggestion.id} 
                style={{ order: isMobile ? index : displayIndex }}
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.6 + (index * 0.15),
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className="relative"
              >
                {/* Special Effects for Winner */}
                {index === 0 && (
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                    }}
                    className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-xl -z-10"
                  />
                )}
                
                <OutfitCard 
                  suggestion={suggestion}
                  top={top}
                  bottom={bottom}
                  rank={index + 1}
                  isPodium={true}
                />
                
                {/* Floating Icons for Top Performers */}
                {index === 0 && (
                  <motion.div
                    animate={{ 
                      y: [-5, 5, -5],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-4 -right-4 z-20"
                  >
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2 shadow-lg">
                      <Star className="w-5 h-5 text-white fill-current" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl px-8 py-4 shadow-lg border">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {topSuggestions.length}
              </div>
              <div className="text-sm text-gray-600">Top Combos</div>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {topSuggestions.length > 0 ? Math.round(topSuggestions[0].score * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Best Match</div>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">AI</div>
              <div className="text-sm text-gray-600">Vision</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TopOutfitsPodium;
