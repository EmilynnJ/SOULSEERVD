import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Plus } from "lucide-react";
import { fine } from "@/lib/fine";

interface AccountBalanceProps {
  balance: number;
  userId: string;
  onBalanceUpdate?: (newBalance: number) => void;
}

export function AccountBalance({ balance, userId, onBalanceUpdate }: AccountBalanceProps) {
  const [amount, setAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddFunds = async () => {
    if (amount < 5) {
      toast({
        title: "Invalid amount",
        description: "Minimum amount to add is $5",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, this would create a payment processing session
      // and redirect the user to complete payment
      
      // Simulated successful payment for demo purposes
      const newBalance = balance + amount;
      
      // Convert userId to number
      const userIdNum = parseInt(userId) || 0;
      
      // Update user balance in database
      await fine.table("users").update({ balance: newBalance }).eq("id", userIdNum);
      
      // Update transaction history
      await fine.table("transactions").insert({
        userId: userIdNum,
        type: "deposit",
        amount: amount,
        status: "completed"
      });
      
      toast({
        title: "Funds added",
        description: `$${amount.toFixed(2)} has been added to your account.`,
      });
      
      if (onBalanceUpdate) {
        onBalanceUpdate(newBalance);
      }
      
    } catch (error) {
      console.error("Error adding funds:", error);
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedAmounts = [10, 25, 50, 100];

  return (
    <Card className="glass-effect border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white text-lg">Account Balance</CardTitle>
        <CreditCard className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-white mb-4">${balance.toFixed(2)}</p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {predefinedAmounts.map((value) => (
              <Button
                key={value}
                variant={amount === value ? "default" : "outline"}
                className={amount === value ? "bg-primary hover:bg-primary/90" : "border-primary text-primary hover:bg-primary/10"}
                onClick={() => setAmount(value)}
              >
                ${value}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="5"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-background/50"
            />
            <Button 
              onClick={handleAddFunds} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}