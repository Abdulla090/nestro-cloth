import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import ClothingItemPreview from "@/components/ClothingItemPreview";
import ChatOutfitCard from "@/components/ChatOutfitCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { fetchClothingItems, fetchOutfitSuggestions } from "@/services/clothingService";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Sparkles, Shirt, Image as ImageIcon, Palette, Scissors, Calendar, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSuggestions } from "@/contexts/SuggestionsContext";
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  outfitSuggestions?: {
    top: ClothingItem;
    bottom: ClothingItem;
    suggestion: OutfitSuggestion;
  }[];
  clothingMentions?: ClothingItem[];
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Check if API key is configured
if (!GEMINI_API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not configured. Please set up your environment variables.');
}

const AIChat = () => {
  const { toast } = useToast();
  const { suggestions: savedSuggestions, clothingItems: savedClothingItems } = useSuggestions();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [outfitSuggestions, setOutfitSuggestions] = useState<OutfitSuggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadData = async () => {
    try {
      const items = await fetchClothingItems();
      setClothingItems(items);
      
      // Load outfit suggestions
      const suggestions = await fetchOutfitSuggestions();
      setOutfitSuggestions(suggestions);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load your wardrobe data",
        variant: "destructive",
      });
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "ai",
      content: `👋 **Welcome to your personal AI styling assistant!** 

I have access to all your clothing items and can help you with:

• **Outfit suggestions** based on your wardrobe  
• **Style advice** for specific occasions  
• **Color coordination** tips  
• **Fashion trends** that match your pieces  
• **Wardrobe analysis** and recommendations  

I can reference your existing outfit combinations and suggest new ones. 

**What would you like to talk about today?** ✨`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const createWardrobiContext = (): string => {
    const tops = clothingItems.filter(item => item.type === 'top');
    const bottoms = clothingItems.filter(item => item.type === 'bottom');
    
    const wardrobeContext = `
USER'S WARDROBE INVENTORY:

TOPS (${tops.length} items):
${tops.map(item => `- ${item.name || `${item.type} item`} (ID: ${item.id}): ${item.color} ${item.style} ${item.fabric}`).join('\n')}

BOTTOMS (${bottoms.length} items):
${bottoms.map(item => `- ${item.name || `${item.type} item`} (ID: ${item.id}): ${item.color} ${item.style} ${item.fabric}`).join('\n')}

EXISTING OUTFIT COMBINATIONS (${outfitSuggestions.length} saved):
${outfitSuggestions.slice(0, 10).map((suggestion, index) => {
  const top = clothingItems.find(item => item.id === suggestion.topId);
  const bottom = clothingItems.find(item => item.id === suggestion.bottomId);
  return `${index + 1}. ${top?.name || 'Top'} + ${bottom?.name || 'Bottom'} (Score: ${(suggestion.score * 100).toFixed(0)}% - ${suggestion.matchReason})`;
}).join('\n')}
${outfitSuggestions.length > 10 ? '... and more combinations available' : ''}

STYLE ANALYSIS:
- Most common top colors: ${getMostCommonColors(tops)}
- Most common bottom colors: ${getMostCommonColors(bottoms)}
- Preferred styles: ${getMostCommonStyles()}
- Fabric types: ${getMostCommonFabrics()}
`;
    
    return wardrobeContext;
  };

  const getMostCommonColors = (items: ClothingItem[]): string => {
    const colorCounts = items.reduce((acc, item) => {
      acc[item.color] = (acc[item.color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([color, count]) => `${color} (${count})`)
      .join(', ');
  };

  const getMostCommonStyles = (): string => {
    const styleCounts = clothingItems.reduce((acc, item) => {
      acc[item.style] = (acc[item.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(styleCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([style, count]) => `${style} (${count})`)
      .join(', ');
  };

  const getMostCommonFabrics = (): string => {
    const fabricCounts = clothingItems.reduce((acc, item) => {
      acc[item.fabric] = (acc[item.fabric] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(fabricCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([fabric, count]) => `${fabric} (${count})`)
      .join(', ');
  };

  const identifyClothingMentions = (aiResponse: string): ClothingItem[] => {
    const mentions: ClothingItem[] = [];
    
    clothingItems.forEach(item => {
      const itemName = item.name?.toLowerCase() || `${item.color} ${item.style} ${item.type}`.toLowerCase();
      const itemIdentifiers = [
        itemName,
        `${item.color} ${item.type}`,
        `${item.style} ${item.type}`,
        item.id
      ];
      
      if (itemIdentifiers.some(identifier => 
        aiResponse.toLowerCase().includes(identifier.toLowerCase())
      )) {
        mentions.push(item);
      }
    });
    
    return mentions;
  };

  const parseOutfitSuggestions = (content: string): {
    top: ClothingItem;
    bottom: ClothingItem;
    suggestion: OutfitSuggestion;
  }[] => {
    const outfits: {
      top: ClothingItem;
      bottom: ClothingItem;
      suggestion: OutfitSuggestion;
    }[] = [];

    // Look for outfit suggestions in the response
    outfitSuggestions.forEach(suggestion => {
      const top = clothingItems.find(item => item.id === suggestion.topId);
      const bottom = clothingItems.find(item => item.id === suggestion.bottomId);
      
      if (top && bottom) {
        // Check if this outfit is mentioned in the content
        const isRelevant = content.toLowerCase().includes(top.id.toLowerCase()) ||
                          content.toLowerCase().includes(bottom.id.toLowerCase()) ||
                          content.toLowerCase().includes(top.style.toLowerCase()) ||
                          content.toLowerCase().includes(bottom.style.toLowerCase()) ||
                          content.toLowerCase().includes(top.color.toLowerCase()) ||
                          content.toLowerCase().includes(bottom.color.toLowerCase());
        
        if (isRelevant || outfits.length < 3) { // Show up to 3 relevant outfits
          outfits.push({ top, bottom, suggestion });
        }
      }
    });

    return outfits.slice(0, 3); // Limit to 3 outfits max
  };

  const identifyOutfitReference = (aiResponse: string): { top: ClothingItem; bottom: ClothingItem; suggestion: OutfitSuggestion; } | undefined => {
    // Look for outfit references in the AI response
    for (const suggestion of outfitSuggestions) {
      const top = clothingItems.find(item => item.id === suggestion.topId);
      const bottom = clothingItems.find(item => item.id === suggestion.bottomId);
      
      if (top && bottom) {
        const outfitDescription = `${top.name || top.color + ' ' + top.type} and ${bottom.name || bottom.color + ' ' + bottom.type}`;
        if (aiResponse.toLowerCase().includes(outfitDescription.toLowerCase()) ||
            aiResponse.includes(suggestion.id)) {
          return { top, bottom, suggestion };
        }
      }
    }
    return undefined;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const wardrobeContext = createWardrobiContext();
      
      const prompt = `You are a professional fashion stylist and personal AI assistant with access to the user's complete wardrobe. You should provide specific, actionable advice based on their actual clothing items.

${wardrobeContext}

INSTRUCTIONS:
1. Always reference specific items from their wardrobe when making suggestions
2. Mention item IDs when referencing specific pieces
3. Consider the user's style preferences based on their collection
4. Suggest specific outfit combinations using their existing items
5. Provide fashion advice that's practical and personalized
6. If suggesting new purchases, relate them to existing items
7. Be conversational, enthusiastic, and helpful
8. Use emojis to make responses engaging
9. Format your response with proper markdown:
   - Use **bold** for emphasis on important points
   - Use bullet points (•) for lists
   - Use ### for section headings if needed
   - Keep responses well-structured and easy to read

USER QUERY: ${inputMessage}

Please provide a helpful, personalized response based on their wardrobe and fashion preferences. Use proper markdown formatting for better readability.`;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content.parts[0].text || "I'm sorry, I couldn't generate a response. Please try again.";

      // Identify clothing mentions and outfit suggestions
      const clothingMentions = identifyClothingMentions(aiResponse);
      const outfitSuggestions = parseOutfitSuggestions(aiResponse);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        clothingMentions: clothingMentions.length > 0 ? clothingMentions : undefined,
        outfitSuggestions: outfitSuggestions.length > 0 ? outfitSuggestions : undefined,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I'm sorry, I encountered an error while processing your request. Please check your internet connection and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const QuickSuggestions = () => {
    const suggestions = [
      { icon: Sparkles, text: "Suggest an outfit for today", query: "Can you suggest a great outfit for today based on my wardrobe?" },
      { icon: Calendar, text: "Work outfit ideas", query: "I need professional work outfit ideas from my clothes" },
      { icon: TrendingUp, text: "What's trending with my style?", query: "What current fashion trends would work well with my existing wardrobe?" },
      { icon: Palette, text: "Color coordination help", query: "Help me understand which colors in my wardrobe work best together" },
      { icon: Scissors, text: "Wardrobe gaps analysis", query: "What types of clothing should I consider buying to complete my wardrobe?" },
      { icon: ImageIcon, text: "Style a specific item", query: "I have a specific piece I want to style. Can you help me create outfits with it?" },
    ];

    return (
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => setInputMessage(suggestion.query)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs px-2 sm:px-3 py-1.5 sm:py-2 h-auto"
          >
            <suggestion.icon className="w-3 h-3 flex-shrink-0" />
            <span className="hidden sm:inline">{suggestion.text}</span>
            <span className="sm:hidden text-xs">{suggestion.text.split(' ')[0]}</span>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            AI Style Assistant
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Chat with your personal fashion AI that knows your entire wardrobe
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shirt className="w-3 h-3" />
              <span className="hidden sm:inline">{clothingItems.length} items</span>
              <span className="sm:hidden">{clothingItems.length}</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">{outfitSuggestions.length} outfits</span>
              <span className="sm:hidden">{outfitSuggestions.length}</span>
            </Badge>
          </div>
        </div>

        <Card className="h-[600px] sm:h-[700px] flex flex-col">
          <CardHeader className="flex-shrink-0 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Chat History</CardTitle>
            <Separator />
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 sm:gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[90%] sm:max-w-[85%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div
                        className={`rounded-xl p-3 sm:p-4 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        {message.type === 'ai' ? (
                          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            <ReactMarkdown
                              components={{
                                // Custom styling for markdown elements with responsive sizes
                                h1: ({children}) => <h1 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-foreground">{children}</h1>,
                                h2: ({children}) => <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-foreground">{children}</h2>,
                                h3: ({children}) => <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2 text-foreground">{children}</h3>,
                                p: ({children}) => <p className="mb-2 sm:mb-3 last:mb-0 text-foreground leading-relaxed text-sm sm:text-base">{children}</p>,
                                strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                                em: ({children}) => <em className="italic text-foreground">{children}</em>,
                                ul: ({children}) => <ul className="list-none mb-3 sm:mb-4 space-y-1 sm:space-y-2 pl-0">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside mb-3 sm:mb-4 space-y-1 sm:space-y-2 pl-1 sm:pl-2">{children}</ol>,
                                li: ({children}) => <li className="text-sm sm:text-base text-foreground flex items-start gap-2 sm:gap-3 before:content-['•'] before:text-primary before:font-bold before:flex-shrink-0 before:text-base sm:before:text-lg">{children}</li>,
                                code: ({children}) => <code className="bg-background/70 border border-border px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono text-foreground">{children}</code>,
                                blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-3 sm:pl-4 italic text-foreground/80 my-2 sm:my-3 text-sm sm:text-base">{children}</blockquote>,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</div>
                        )}
                        
                        {/* Show visual outfit suggestions */}
                        {message.outfitSuggestions && message.outfitSuggestions.length > 0 && (
                          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                            <div className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                              Outfit Suggestions
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              {message.outfitSuggestions.map((outfit, index) => (
                                <ChatOutfitCard
                                  key={`${outfit.suggestion.id}-${index}`}
                                  top={outfit.top}
                                  bottom={outfit.bottom}
                                  suggestion={outfit.suggestion}
                                  size="md"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Show clothing mentions */}
                        {message.clothingMentions && message.clothingMentions.length > 0 && (
                          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                            <div className="text-xs sm:text-sm font-medium text-muted-foreground">Referenced items:</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                              {message.clothingMentions.map((item) => (
                                <ClothingItemPreview key={item.id} item={item} size="sm" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-sm text-muted-foreground mt-2 ${
                        message.type === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {message.type === 'user' && (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-secondary">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 sm:gap-4"
                >
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full" />
                      <span className="text-sm sm:text-base">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-3 sm:p-4 space-y-2 sm:space-y-3">
              {messages.length <= 1 && <QuickSuggestions />}
              
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your outfits, style advice, or fashion trends..."
                  className="flex-1 text-sm sm:text-base"
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIChat;
