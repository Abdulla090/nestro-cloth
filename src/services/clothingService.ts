
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { v4 as uuidv4 } from 'uuid';

// Save clothing item to localStorage
export const saveClothingItem = async (item: Omit<ClothingItem, 'id'>): Promise<ClothingItem> => {
  try {
    const newItem: ClothingItem = {
      ...item,
      id: uuidv4(),
      added: new Date(),
    };
    
    // Get existing items from localStorage
    const existingItems = await fetchClothingItems(newItem.type);
    const updatedItems = [...existingItems, newItem];
    
    // Save to localStorage
    const storageKey = newItem.type === 'top' ? "closet-fusion-tops" : "closet-fusion-bottoms";
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    
    return newItem;
  } catch (error) {
    console.error("Error saving clothing item:", error);
    throw new Error("Failed to save clothing item");
  }
};

// Save outfit suggestion to localStorage
export const saveOutfitSuggestion = async (suggestion: OutfitSuggestion): Promise<OutfitSuggestion> => {
  try {
    const existingSuggestions = localStorage.getItem("outfit-suggestions");
    const suggestions = existingSuggestions ? JSON.parse(existingSuggestions) : [];
    suggestions.push(suggestion);
    localStorage.setItem("outfit-suggestions", JSON.stringify(suggestions));
    return suggestion;
  } catch (error) {
    console.error("Error saving outfit suggestion:", error);
    return suggestion;
  }
};

// Fetch clothing items from localStorage
export const fetchClothingItems = async (type?: 'top' | 'bottom'): Promise<ClothingItem[]> => {
  try {
    const localTops = localStorage.getItem("closet-fusion-tops");
    const localBottoms = localStorage.getItem("closet-fusion-bottoms");
    let items: ClothingItem[] = [];
    
    if (type === 'top' && localTops) {
      items = JSON.parse(localTops);
    } else if (type === 'bottom' && localBottoms) {
      items = JSON.parse(localBottoms);
    } else if (!type) {
      items = [
        ...(localTops ? JSON.parse(localTops) : []),
        ...(localBottoms ? JSON.parse(localBottoms) : [])
      ];
    }
    
    // Ensure all items have proper Date objects
    return items.map(item => ({
      ...item,
      added: new Date(item.added)
    }));
  } catch (error) {
    console.error("Error fetching clothing items:", error);
    return [];
  }
};

// Delete a clothing item from localStorage
export const deleteClothingItem = async (id: string): Promise<void> => {
  try {
    const localTops = localStorage.getItem("closet-fusion-tops");
    const localBottoms = localStorage.getItem("closet-fusion-bottoms");
    
    if (localTops) {
      const tops = JSON.parse(localTops);
      const updatedTops = tops.filter((item: ClothingItem) => item.id !== id);
      localStorage.setItem("closet-fusion-tops", JSON.stringify(updatedTops));
    }
    
    if (localBottoms) {
      const bottoms = JSON.parse(localBottoms);
      const updatedBottoms = bottoms.filter((item: ClothingItem) => item.id !== id);
      localStorage.setItem("closet-fusion-bottoms", JSON.stringify(updatedBottoms));
    }
  } catch (error) {
    console.error("Error deleting clothing item:", error);
    throw new Error("Failed to delete clothing item");
  }
};

// Fetch outfit suggestions from localStorage
export const fetchOutfitSuggestions = async (): Promise<OutfitSuggestion[]> => {
  try {
    const savedSuggestions = localStorage.getItem("outfit-suggestions");
    if (savedSuggestions) {
      return JSON.parse(savedSuggestions);
    }
    return [];
  } catch (error) {
    console.error("Error fetching outfit suggestions:", error);
    return [];
  }
};
