
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { motion } from "framer-motion";
import { Star, Heart, Share2, Eye, Sparkles, Zap, Trophy, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OutfitCardProps {
  suggestion: OutfitSuggestion;
  top: ClothingItem;
  bottom: ClothingItem;
  rank?: number;
  isPodium?: boolean;
}

const OutfitCard = ({ suggestion, top, bottom, rank, isPodium }: OutfitCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShared, setIsShared] = useState(false);
  
  // Convert score to a percentage and round to nearest integer
  const scorePercentage = Math.round(suggestion.score * 100);
  
  // Determine match quality with more granular levels
  let matchQuality = "Fair Match";
  let badgeVariant: "outline" | "default" | "secondary" | "destructive" = "outline";
  let MatchIcon = Star;
  let scoreColor = "text-slate-600";
  let cardGlow = "";
  
  if (scorePercentage >= 90) {
    matchQuality = "Exceptional";
    badgeVariant = "default";
    MatchIcon = Trophy;
    scoreColor = "text-yellow-600";
    cardGlow = "shadow-yellow-200/50";
  } else if (scorePercentage >= 80) {
    matchQuality = "Excellent";
    badgeVariant = "default";
    MatchIcon = Award;
    scoreColor = "text-emerald-600";
    cardGlow = "shadow-emerald-200/30";
  } else if (scorePercentage >= 70) {
    matchQuality = "Great Match";
    badgeVariant = "secondary";
    MatchIcon = Sparkles;
    scoreColor = "text-blue-600";
    cardGlow = "shadow-blue-200/20";
  } else if (scorePercentage >= 60) {
    matchQuality = "Good Match";
    badgeVariant = "outline";
    MatchIcon = Zap;
    scoreColor = "text-purple-600";
  }
  
  // Special podium styles with enhanced visual hierarchy
  let podiumClass = "";
  let medalClass = "";
  let rankIcon = null;
  
  if (isPodium && rank) {
    if (rank === 1) {
      podiumClass = "ring-2 ring-yellow-400/60 bg-gradient-to-br from-yellow-50 via-white to-yellow-50/30 shadow-xl shadow-yellow-200/40";
      medalClass = "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg";
      rankIcon = <Trophy className="w-3 h-3 mr-1" />;
    } else if (rank === 2) {
      podiumClass = "ring-2 ring-slate-300/80 bg-gradient-to-br from-slate-50 via-white to-slate-50/30 shadow-lg shadow-slate-200/30";
      medalClass = "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-md";
      rankIcon = <Award className="w-3 h-3 mr-1" />;
    } else if (rank === 3) {
      podiumClass = "ring-2 ring-amber-400/60 bg-gradient-to-br from-amber-50 via-white to-amber-50/30 shadow-lg shadow-amber-200/30";
      medalClass = "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md";
      rankIcon = <Sparkles className="w-3 h-3 mr-1" />;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: rank ? rank * 0.1 : 0,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ y: -5 }}
      className={cn("group", isPodium && "relative")}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className={cn(
        "overflow-hidden bg-white border transition-all duration-500 relative shadow-lg",
        "hover:shadow-2xl transform-gpu",
        isPodium && podiumClass,
        !isPodium && `hover:shadow-xl ${cardGlow}`,
        isHovering && "scale-[1.02]"
      )}>
        {/* Rank Badge for Podium */}
        {isPodium && rank && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.3 + (rank * 0.1), 
              type: "spring",
              stiffness: 200 
            }}
            className="absolute top-1 sm:top-2 left-2 sm:left-4 z-30"
          >
            <Badge 
              className={cn(
                "font-bold text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 flex items-center shadow-xl border-2 border-white",
                medalClass
              )}
            >
              {rankIcon}
              <span className="ml-1">#{rank}</span>
            </Badge>
          </motion.div>
        )}
        
        {/* Images Section with Enhanced Layout */}
        <div className="relative bg-gray-50">
          <div className="grid grid-cols-2">
            {/* Top Image */}
            <div className="aspect-square relative overflow-hidden">
              <motion.img
                src={top.imageUrl}
                alt={top.name || "Top"}
                className="object-cover w-full h-full transition-all duration-500"
                animate={{
                  scale: isHovering ? 1.05 : 1,
                  filter: isHovering ? "brightness(1.1)" : "brightness(1)"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
            </div>

            {/* Bottom Image */}
            <div className="aspect-square relative overflow-hidden border-l border-gray-200">
              <motion.img
                src={bottom.imageUrl}
                alt={bottom.name || "Bottom"}
                className="object-cover w-full h-full transition-all duration-500"
                animate={{
                  scale: isHovering ? 1.05 : 1,
                  filter: isHovering ? "brightness(1.1)" : "brightness(1)"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/10" />
            </div>
          </div>
        </div>
        
        {/* Enhanced Content Section */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
          {/* Score and Quality Header */}
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <MatchIcon className={cn("h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0", scoreColor)} />
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{matchQuality}</h3>
              </div>
              
              {/* Enhanced Score Display */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1">
                  <span className={cn("text-lg sm:text-xl font-bold", scoreColor)}>
                    {scorePercentage}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">%</span>
                </div>
                
                {/* Score Progress Bar */}
                <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden min-w-0">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scorePercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={cn(
                      "h-full rounded-full",
                      scorePercentage >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-600" :
                      scorePercentage >= 70 ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                      scorePercentage >= 60 ? "bg-gradient-to-r from-purple-400 to-purple-600" :
                      "bg-gradient-to-r from-gray-400 to-gray-600"
                    )}
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-1 ml-2 sm:ml-3 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isFavorite ? "default" : "ghost"} 
                      size="icon" 
                      className={cn(
                        "h-6 w-6 sm:h-8 sm:w-8 transition-all duration-300",
                        isFavorite 
                          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:shadow-lg" 
                          : "hover:bg-red-50 hover:text-red-600"
                      )}
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={cn("h-3 w-3 sm:h-4 sm:w-4 transition-all", isFavorite && "fill-current scale-110")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorite ? "Remove from favorites" : "Save outfit"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                      onClick={() => setIsShared(!isShared)}
                    >
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share outfit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* AI Analysis Reason */}
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {suggestion.matchReason}
            </p>
          </div>
          
          {/* Color Harmony Indicators */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Colors:</span>
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                  style={{ backgroundColor: top.color }}
                />
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                  style={{ backgroundColor: bottom.color }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Style:</span>
              <Badge variant="outline" className="text-xs px-2 py-0 h-5 border-gray-300">
                {top.style === bottom.style ? top.style : 'Mixed'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default OutfitCard;
