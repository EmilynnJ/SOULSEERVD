import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionTimer } from "./SessionTimer";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/lib/config";
import { fine } from "@/lib/fine";
import { Mic, MicOff, MessageSquare } from "lucide-react";

// Note: In a real implementation, you would import the ZegoUIKit
// This is a placeholder component that simulates the phone interface

interface PhoneReadingProps {
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

export function PhoneReading({
  readerId,
  readerName,
  readerImage,
  readerRate,
  clientId,
  clientName,
  clientBalance,
  onBalanceUpdate,
  onSessionEnd
}: PhoneReadingProps) {
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  // Simulate connection process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: "Connected",
        description: `You are now connected with ${readerName}.`,
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [readerName, toast]);

  const handleEndSession = () => {
    setIsSessionActive(false);
    onSessionEnd();
    
    // In a real implementation, this would end the ZegoCloud session
    // and update the session status in the database
    
    toast({
      title: "Session Ended",
      description: "Your phone reading session has ended.",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "Others can now hear you." : "Others cannot hear you.",
    });
  };

  const toggleChat = () => {
    setShowChat(!showChat);
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
      
      <Card className="glass-effect border-0 flex-grow">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          {isConnecting ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-white">Connecting to your reader...</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <img 
                  src={readerImage || `https://i.pravatar.cc/300?img=${readerId}`} 
                  alt={readerName}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-2xl font-semibold text-white">{readerName}</h3>
                <p className="text-gray-300">Voice Reading</p>
              </div>
              
              <div className="flex justify-center space-x-6">
                <Button 
                  variant="outline"
                  className={`rounded-full w-14 h-14 p-0 ${
                    isMuted 
                      ? 'bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30' 
                      : 'border-primary text-primary hover:bg-primary/10'
                  }`}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                
                <Button 
                  variant="outline"
                  className={`rounded-full w-14 h-14 p-0 ${
                    showChat 
                      ? 'bg-primary/20 text-primary border-primary/50' 
                      : 'border-primary text-primary hover:bg-primary/10'
                  }`}
                  onClick={toggleChat}
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
                
                <Button 
                  variant="destructive"
                  className="rounded-full w-14 h-14 p-0"
                  onClick={handleEndSession}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2H2v20"></path>
                    <path d="M22 16H16a2 2 0 0 0-2 2v4"></path>
                    <path d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                    <path d="M18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                    <path d="M8 6v14"></path>
                    <path d="M18 6v8"></path>
                  </svg>
                </Button>
              </div>
              
              {showChat && (
                <div className="mt-8 w-full max-w-md">
                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Text Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-300 text-sm">
                      Text chat is available during your voice reading session.
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}