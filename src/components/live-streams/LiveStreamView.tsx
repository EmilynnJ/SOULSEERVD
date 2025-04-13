import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Gift, Heart, ThumbsUp, Star, Users } from "lucide-react";
import { config } from "@/lib/config";
import { fine } from "@/lib/fine";

// Note: In a real implementation, you would import the ZegoUIKit
// This is a placeholder component that simulates the live stream interface

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isHost: boolean;
}

interface Gift {
  id: string;
  name: string;
  icon: string;
  value: number;
}

interface LiveStreamViewProps {
  streamId: string;
  readerId: number;
  readerName: string;
  readerImage?: string;
  title: string;
  clientId?: number;
  clientName?: string;
  clientBalance?: number;
  onBalanceUpdate?: (newBalance: number) => void;
}

export function LiveStreamView({
  streamId,
  readerId,
  readerName,
  readerImage,
  title,
  clientId,
  clientName,
  clientBalance = 0,
  onBalanceUpdate
}: LiveStreamViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showGiftMenu, setShowGiftMenu] = useState(false);
  const { toast } = useToast();

  // Available gifts
  const gifts: Gift[] = [
    { id: "1", name: "Rose", icon: "🌹", value: 1 },
    { id: "2", name: "Star", icon: "⭐", value: 5 },
    { id: "3", name: "Crystal Ball", icon: "🔮", value: 10 },
    { id: "4", name: "Diamond", icon: "💎", value: 25 },
    { id: "5", name: "Crown", icon: "👑", value: 50 }
  ];

  // Simulate connection process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
      
      // Simulate random viewer count
      setViewerCount(Math.floor(Math.random() * 100) + 20);
      
      // Simulate welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        sender: readerName,
        content: "Welcome to my live stream! Feel free to ask questions in the chat.",
        timestamp: new Date(),
        isHost: true
      };
      
      setMessages([welcomeMessage]);
      
      // Simulate periodic messages from the host and other viewers
      const messageInterval = setInterval(() => {
        const isHostMessage = Math.random() > 0.7;
        const randomMessage: Message = {
          id: Date.now().toString(),
          sender: isHostMessage ? readerName : getRandomName(),
          content: isHostMessage ? getRandomHostMessage() : getRandomViewerMessage(),
          timestamp: new Date(),
          isHost: isHostMessage
        };
        
        setMessages(prev => [...prev, randomMessage]);
        
        // Randomly update viewer count
        if (Math.random() > 0.8) {
          setViewerCount(prev => {
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            return Math.max(20, prev + change);
          });
        }
      }, 8000 + Math.random() * 10000); // Random interval between 8-18 seconds
      
      return () => clearInterval(messageInterval);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [readerName]);

  const getRandomName = () => {
    const names = ["SpiritSeeker", "MysticMoon", "StarGazer", "CosmicSoul", "EnergyFlow", "LightWorker", "SoulJourney", "AstralWanderer"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomHostMessage = () => {
    const messages = [
      "I'm sensing a strong collective energy today.",
      "Remember to focus on your intentions as we continue.",
      "The cards are showing a period of transformation for many of you.",
      "Thank you for all the gifts and support!",
      "I'll be taking questions from the chat in a few minutes.",
      "I'm feeling a powerful spiritual presence with us right now.",
      "Don't forget to follow me for notifications about future streams.",
      "The energy in this stream is absolutely beautiful today."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomViewerMessage = () => {
    const messages = [
      "Thank you for the insights!",
      "Can you do a card pull for me?",
      "This resonates with me so much.",
      "I've been feeling exactly what you're describing.",
      "Your energy is so calming.",
      "Will you be streaming again tomorrow?",
      "I had a dream about this last night!",
      "Sending positive vibes to everyone here.",
      "This is exactly what I needed to hear today."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !clientName) return;
    
    const clientMessage: Message = {
      id: Date.now().toString(),
      sender: clientName,
      content: newMessage,
      timestamp: new Date(),
      isHost: false
    };
    
    setMessages(prev => [...prev, clientMessage]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendGift = async (gift: Gift) => {
    if (!clientId || !clientName || clientBalance < gift.value) {
      toast({
        title: "Insufficient balance",
        description: `You need ${gift.value} credits to send this gift.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update user balance
      const newBalance = clientBalance - gift.value;
      await fine.table("users").update({ balance: newBalance }).eq("id", clientId);
      
      // Add transaction record
      await fine.table("transactions").insert({
        userId: clientId,
        type: "gift",
        amount: gift.value,
        status: "completed"
      });
      
      // Update reader's earnings (in a real app)
      // This would add to the reader's pending balance
      
      // Show gift animation (simulated)
      const giftMessage: Message = {
        id: Date.now().toString(),
        sender: "System",
        content: `${clientName} sent a ${gift.name} ${gift.icon} to ${readerName}!`,
        timestamp: new Date(),
        isHost: false
      };
      
      setMessages(prev => [...prev, giftMessage]);
      setShowGiftMenu(false);
      
      if (onBalanceUpdate) {
        onBalanceUpdate(newBalance);
      }
      
      toast({
        title: "Gift sent!",
        description: `You sent a ${gift.name} to ${readerName}.`,
      });
    } catch (error) {
      console.error("Error sending gift:", error);
      toast({
        title: "Error",
        description: "Failed to send gift. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="glass-effect border-0 mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              {readerImage && (
                <img 
                  src={readerImage} 
                  alt={readerName} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <span>{readerName}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>{viewerCount}</span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        <div className="md:col-span-2">
          <Card className="glass-effect border-0 h-full">
            <CardContent className="p-0 h-full">
              {isConnecting ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-white">Connecting to live stream...</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full bg-gray-900">
                  {/* This would be replaced with the actual ZegoUIKit live stream component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <img 
                        src={readerImage || `https://i.pravatar.cc/300?img=${readerId}`} 
                        alt={readerName}
                        className="w-32 h-32 rounded-full mx-auto mb-4"
                      />
                      <h3 className="text-2xl font-semibold text-white mb-2">{readerName}</h3>
                      <p className="text-xl text-primary">{title}</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={() => {}}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      <span>Follow</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={() => {}}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>Like</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={() => {}}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      <span>Rate</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card className="glass-effect border-0 h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col">
              <div className="flex-grow overflow-y-auto mb-4 space-y-2">
                {messages.map((message) => (
                  <div key={message.id} className="text-sm">
                    <span className={`font-semibold ${message.isHost ? 'text-primary' : 'text-white'}`}>
                      {message.sender}:
                    </span>
                    <span className="text-gray-300 ml-1">{message.content}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto">
                {showGiftMenu && (
                  <div className="mb-4 p-2 bg-background/30 rounded-md">
                    <div className="text-sm text-white mb-2">Select a gift:</div>
                    <div className="grid grid-cols-5 gap-2">
                      {gifts.map((gift) => (
                        <Button
                          key={gift.id}
                          variant="outline"
                          className="h-12 p-1 flex flex-col items-center justify-center border-primary/30 hover:bg-primary/10"
                          onClick={() => handleSendGift(gift)}
                          disabled={!clientId || (clientBalance || 0) < gift.value}
                        >
                          <span className="text-lg">{gift.icon}</span>
                          <span className="text-xs text-primary">${gift.value}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => setShowGiftMenu(!showGiftMenu)}
                  >
                    <Gift className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!clientId}
                    className="bg-background/50"
                  />
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleSendMessage}
                    disabled={!clientId || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}