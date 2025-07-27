import { ClothingItem } from "@/types/clothing";
import { Badge } from "@/components/ui/badge";
import { Shirt } from "lucide-react";

interface ClothingItemPreviewProps {
  item: ClothingItem;
  size?: 'sm' | 'md';
}

const ClothingItemPreview = ({ item, size = 'sm' }: ClothingItemPreviewProps) => {
  const imageSize = size === 'sm' ? 'w-8 h-8' : 'w-12 h-12';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg border border-border/50">
      <img 
        src={item.imageUrl} 
        alt={item.name || `${item.color} ${item.type}`}
        className={`${imageSize} object-cover rounded border`}
      />
      <div className="flex-1 min-w-0">
        <div className={`${textSize} font-medium truncate`}>
          {item.name || `${item.color} ${item.type}`}
        </div>
        <div className="flex gap-1 mt-1">
          <Badge variant="outline" className={`${textSize} px-1 py-0`}>
            {item.style}
          </Badge>
          <Badge variant="outline" className={`${textSize} px-1 py-0`}>
            {item.fabric}
          </Badge>
        </div>
      </div>
      <Shirt className="w-3 h-3 text-muted-foreground flex-shrink-0" />
    </div>
  );
};

export default ClothingItemPreview;
