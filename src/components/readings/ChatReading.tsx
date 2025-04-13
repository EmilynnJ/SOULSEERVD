import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, PaperclipIcon } from "lucide-react";
import { SessionTimer } from "./SessionTimer";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { config } from "@/lib/config";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isReader: boolean;
}

interface ChatReadingProps {
  readerId: number;
  readerName: string;
  readerImage?: string;
  readerRate: number;
  clientId: number;
  clientName: string;
  clientBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
  onSessionEnd: () => void;
}

export function ChatReading({
  readerId,
  readerName,
  readerImage,
  readerRate,
  clientId,
  clientName,
  clientBalance,
  onBalanceUpdate,
  onSessionEnd
}: ChatReadingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simulate initial welcome message from reader
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      sender: readerName,
      content: `Hello ${clientName}, welcome to your reading session. How can I help you today?`,
      timestamp: new Date(),
      isReader: true
    };
    
    setMessages([welcomeMessage]);
  }, [readerName, clientName]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add client message
    const clientMessage: Message = {
      id: Date.now().toString(),
      sender: clientName,
      content: newMessage,
      timestamp: new Date(),
      isReader: false
    };
    
    setMessages(prev => [...prev, clientMessage]);
    setNewMessage("");
    
    // In a real implementation, this would send the message to the reader
    // through a real-time communication channel
    
    // Simulate reader response after a delay
    setTimeout(() => {
      // Only add reader response if session is still active
      if (isSessionActive) {
        const readerMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: readerName,
          content: getSimulatedResponse(),
          timestamp: new Date(),
          isReader: true
        };
        
        setMessages(prev => [...prev, readerMessage]);
      }
    }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
  };

  // Simulated reader responses for demo purposes
  const getSimulatedResponse = () => {
    const responses = [
      "I'm sensing a strong energy around you related to your question.",
      "The cards are showing a period of transition in your life.",
      "I see a new opportunity coming your way soon.",
      "There's someone from your past who still thinks about you.",
      "Your spiritual guides are trying to communicate an important message.",
      "I'm feeling that you've been worried about a specific situation lately.",
      "The energy I'm receiving suggests you should trust your intuition on this matter.",
      "There's a significant change coming in the next few months.",
      "I sense that you've been feeling uncertain about a decision.",
      "The spiritual realm is showing me that you have untapped potential."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    onSessionEnd();
    
    // Add system message about session ending
    const systemMessage: Message = {
      id: Date.now().toString(),
      sender: "System",
      content: "This reading session has ended. Thank you for using SoulSeer.",
      timestamp: new Date(),
      isReader: false
    };
    
    setMessages(prev => [...prev, systemMessage]);
    
    // In a real implementation, this would save the chat transcript
    // and update the session status in the database
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-3">
          <Card className="glass-effect border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                {readerImage && (
                  <img 
                    src={readerImage} 
                    alt={readerName} 
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span>{readerName}</span>
                <span className="ml-2 text-sm text-primary">${readerRate.toFixed(2)}/min</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <SessionTimer 
            isActive={isSessionActive}
            rate={readerRate}
            initialBalance={clientBalance}
            onBalanceUpdate={onBalanceUpdate}
            onSessionEnd={handleEndSession}
          />
        </div>
      </div>
      
      <Card className="glass-effect border-0 flex-grow flex flex-col">
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex-grow overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isReader ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isReader 
                      ? 'bg-secondary text-white' 
                      : 'bg-primary text-white'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">
                    {message.sender}
                  </div>
                  <div>{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              className="border-primary text-primary hover:bg-primary/10"
              disabled={!isSessionActive}
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isSessionActive}
              className="bg-background/50"
            />
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleSendMessage}
              disabled={!isSessionActive || !newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}