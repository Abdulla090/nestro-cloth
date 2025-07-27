import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Star, Award, Trophy } from "lucide-react";

interface ChatOutfitCardProps {
  top: ClothingItem;
  bottom: ClothingItem;
  suggestion?: OutfitSuggestion;
  size?: 'sm' | 'md';
}

const ChatOutfitCard = ({ top, bottom, suggestion, size = 'md' }: ChatOutfitCardProps) => {
  const scorePercentage = suggestion ? Math.round(suggestion.score * 100) : 0;
  
  // Determine match quality
  let matchQuality = "Good Match";
  let badgeColor = "bg-blue-500";
  let MatchIcon = Star;
  
  if (scorePercentage >= 90) {
    matchQuality = "Exceptional";
    badgeColor = "bg-yellow-500";
    MatchIcon = Trophy;
  } else if (scorePercentage >= 80) {
    matchQuality = "Excellent";
    badgeColor = "bg-emerald-500";
    MatchIcon = Award;
  } else if (scorePercentage >= 70) {
    matchQuality = "Great";
    badgeColor = "bg-blue-500";
    MatchIcon = Star;
  }

  const cardSize = size === 'sm' ? 'w-40 sm:w-48' : 'w-56 sm:w-64';
  const imageSize = size === 'sm' ? 'h-16 sm:h-20' : 'h-20 sm:h-24';
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs sm:text-sm';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${cardSize} bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-md overflow-hidden`}
    >
      {/* Images */}
      <div className="grid grid-cols-2 gap-0">
        <div className={`${imageSize} relative overflow-hidden bg-gray-50`}>
          <img
            src={top.imageUrl}
            alt={top.name || "Top"}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1">
            <Badge variant="secondary" className="text-xs px-1 py-0 h-4 bg-white/90">
              Top
            </Badge>
          </div>
        </div>
        <div className={`${imageSize} relative overflow-hidden bg-gray-50 border-l border-gray-200`}>
          <img
            src={bottom.imageUrl}
            alt={bottom.name || "Bottom"}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1">
            <Badge variant="secondary" className="text-xs px-1 py-0 h-4 bg-white/90">
              Bottom
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3">
        {suggestion && (
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center gap-1">
              <MatchIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-600" />
              <span className={`font-medium ${textSize}`}>{matchQuality}</span>
            </div>
            <Badge className={`${badgeColor} text-white text-xs px-1.5 sm:px-2 py-0 h-4 sm:h-5`}>
              {scorePercentage}%
            </Badge>
          </div>
        )}

        {/* Item Names */}
        <div className="space-y-0.5 sm:space-y-1">
          <div className={`${textSize} text-gray-700 font-medium truncate`}>
            {top.name || `${top.color} ${top.style}`}
          </div>
          <div className={`${textSize} text-gray-700 font-medium truncate`}>
            {bottom.name || `${bottom.color} ${bottom.style}`}
          </div>
        </div>

        {/* Style Tags */}
        <div className="flex items-center justify-between mt-1.5 sm:mt-2">
          <div className="flex gap-1">
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-200"
              style={{ backgroundColor: top.color }}
            />
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-200"
              style={{ backgroundColor: bottom.color }}
            />
          </div>
          <Badge variant="outline" className="text-xs px-1 py-0 h-3.5 sm:h-4">
            {top.style === bottom.style ? top.style : 'Mixed'}
          </Badge>
        </div>

        {/* Match Reason */}
        {suggestion && suggestion.matchReason && size === 'md' && (
          <div className="mt-1.5 sm:mt-2 text-xs text-gray-600 leading-relaxed line-clamp-2">
            {suggestion.matchReason}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatOutfitCard;
