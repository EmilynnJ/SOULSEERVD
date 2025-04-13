import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionTimer } from "./SessionTimer";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/lib/config";
import { fine } from "@/lib/fine";

// Note: In a real implementation, you would import the ZegoUIKit
// This is a placeholder component that simulates the video interface

interface VideoReadingProps {
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

export function VideoReading({
  readerId,
  readerName,
  readerImage,
  readerRate,
  clientId,
  clientName,
  clientBalance,
  onBalanceUpdate,
  onSessionEnd
}: VideoReadingProps) {
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
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
      description: "Your video reading session has ended.",
    });
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
            <div className="w-full h-full relative">
              {/* This would be replaced with the actual ZegoUIKit component */}
              <div className="absolute inset-0 grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <img 
                      src={readerImage || `https://i.pravatar.cc/300?img=${readerId}`} 
                      alt={readerName}
                      className="w-24 h-24 rounded-full mx-auto mb-2"
                    />
                    <p className="text-white">{readerName}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <img 
                      src={`https://i.pravatar.cc/300?img=${clientId + 20}`} 
                      alt={clientName}
                      className="w-24 h-24 rounded-full mx-auto mb-2"
                    />
                    <p className="text-white">{clientName}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  className="rounded-full w-12 h-12 p-0 border-primary text-primary hover:bg-primary/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>
                </Button>
                <Button 
                  variant="outline"
                  className="rounded-full w-12 h-12 p-0 border-primary text-primary hover:bg-primary/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7 16 12 23 17 23 7z"></path>
                    <rect width="15" height="14" x="1" y="5" rx="2"></rect>
                  </svg>
                </Button>
                <Button 
                  variant="destructive"
                  className="rounded-full w-12 h-12 p-0"
                  onClick={handleEndSession}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 2v4"></path>
                    <path d="M8 2v4"></path>
                    <path d="M3 10h18"></path>
                    <path d="M18 6H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z"></path>
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}