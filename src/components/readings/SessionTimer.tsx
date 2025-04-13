import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SessionTimerProps {
  isActive: boolean;
  rate: number;
  initialBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
  onSessionEnd: () => void;
}

export function SessionTimer({ isActive, rate, initialBalance, onBalanceUpdate, onSessionEnd }: SessionTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);
  const [lowBalanceWarning, setLowBalanceWarning] = useState(false);
  const { toast } = useToast();

  // Calculate cost per second
  const costPerSecond = rate / 60;

  // Calculate maximum session time based on balance
  const maxSessionTimeInSeconds = Math.floor(initialBalance / costPerSecond);

  // Calculate remaining time
  const remainingTimeInSeconds = maxSessionTimeInSeconds - (minutes * 60 + seconds);
  const remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
  const remainingSeconds = remainingTimeInSeconds % 60;

  // Format time for display
  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Update balance every minute
  const updateBalance = useCallback(() => {
    if (minutes > 0 && minutes % 1 === 0) {
      const cost = rate * (minutes / 60);
      const newBalance = initialBalance - cost;
      setCurrentBalance(newBalance);
      onBalanceUpdate(newBalance);
      
      // Check if balance is getting low (less than 2 minutes remaining)
      if (newBalance < rate * 2 && !lowBalanceWarning) {
        setLowBalanceWarning(true);
        toast({
          title: "Low Balance Warning",
          description: "You have less than 2 minutes of reading time remaining.",
          variant: "destructive",
        });
      }
      
      // End session if balance is depleted
      if (newBalance <= 0) {
        toast({
          title: "Session Ended",
          description: "Your session has ended due to insufficient balance.",
          variant: "destructive",
        });
        onSessionEnd();
      }
    }
  }, [minutes, rate, initialBalance, onBalanceUpdate, lowBalanceWarning, toast, onSessionEnd]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Update balance effect
  useEffect(() => {
    updateBalance();
  }, [minutes, updateBalance]);

  return (
    <Card className={`glass-effect border-0 ${lowBalanceWarning ? 'border-red-500 border-2' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <span className="text-white font-medium">Session Time:</span>
          </div>
          <span className="text-xl font-bold text-white">{formatTime(minutes, seconds)}</span>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-gray-300">Current Cost:</span>
          <span className="text-primary font-semibold">${((minutes * 60 + seconds) * costPerSecond).toFixed(2)}</span>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-gray-300">Remaining Balance:</span>
          <span className="text-white font-semibold">${currentBalance.toFixed(2)}</span>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-gray-300">Time Remaining:</span>
          <span className={`font-semibold ${remainingTimeInSeconds < 120 ? 'text-red-400' : 'text-white'}`}>
            {formatTime(remainingMinutes, remainingSeconds)}
          </span>
        </div>
        
        {lowBalanceWarning && (
          <div className="mt-3 flex items-center text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Low balance warning</span>
          </div>
        )}
        
        <Button 
          variant="destructive" 
          className="w-full mt-4"
          onClick={onSessionEnd}
        >
          End Session
        </Button>
      </CardContent>
    </Card>
  );
}