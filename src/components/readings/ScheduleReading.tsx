import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { addDays, format, addMinutes, isBefore, isAfter, startOfDay } from "date-fns";

interface ScheduleReadingProps {
  readerId: number;
  readerName: string;
  readerImage?: string;
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  clientId: number;
  clientBalance: number;
  onScheduled: () => void;
}

export function ScheduleReading({
  readerId,
  readerName,
  readerImage,
  serviceId,
  serviceName,
  servicePrice,
  clientId,
  clientBalance,
  onScheduled
}: ScheduleReadingProps) {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Generate available time slots
  const getAvailableTimeSlots = () => {
    if (!date) return [];
    
    const slots = [];
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0); // Start at 9 AM
    
    const endTime = new Date(date);
    endTime.setHours(21, 0, 0, 0); // End at 9 PM
    
    let currentSlot = startTime;
    
    while (isBefore(currentSlot, endTime)) {
      slots.push({
        value: format(currentSlot, "HH:mm"),
        label: format(currentSlot, "h:mm a")
      });
      
      currentSlot = addMinutes(currentSlot, 30); // 30-minute slots
    }
    
    return slots;
  };

  const handleScheduleReading = async () => {
    if (!date || !timeSlot) {
      toast({
        title: "Missing information",
        description: "Please select both a date and time for your reading.",
        variant: "destructive",
      });
      return;
    }
    
    if (clientBalance < servicePrice) {
      toast({
        title: "Insufficient balance",
        description: `You need $${servicePrice.toFixed(2)} to book this reading. Please add funds to your account.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse the selected date and time
      const [hours, minutes] = timeSlot.split(":").map(Number);
      const scheduledTime = new Date(date);
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // Create the booking
      await fine.table("bookings").insert({
        clientId,
        readerId,
        serviceId,
        status: "scheduled",
        scheduledTime: scheduledTime.toISOString(),
        duration: 30, // 30-minute scheduled reading
        amount: servicePrice
      });
      
      // Deduct the amount from client balance
      const newBalance = clientBalance - servicePrice;
      await fine.table("users").update({ balance: newBalance }).eq("id", clientId);
      
      // Add transaction record
      await fine.table("transactions").insert({
        userId: clientId,
        type: "booking",
        amount: servicePrice,
        status: "completed"
      });
      
      toast({
        title: "Reading scheduled",
        description: `Your reading with ${readerName} has been scheduled for ${format(scheduledTime, "PPpp")}.`,
      });
      
      onScheduled();
    } catch (error) {
      console.error("Error scheduling reading:", error);
      toast({
        title: "Error",
        description: "Failed to schedule your reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTimeSlots = getAvailableTimeSlots();
  const today = new Date();
  const oneMonthFromNow = addDays(today, 30);

  return (
    <Card className="glass-effect border-0">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          {readerImage && (
            <img 
              src={readerImage} 
              alt={readerName} 
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span>Schedule Reading with {readerName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-background/50 rounded-md p-3"
              disabled={(date) => 
                isBefore(date, startOfDay(today)) || 
                isAfter(date, oneMonthFromNow)
              }
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Select Time</h3>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-2">Booking Summary</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="text-white">{serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-white">30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="text-primary font-semibold">${servicePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Balance:</span>
                  <span className={`font-semibold ${clientBalance < servicePrice ? 'text-red-400' : 'text-white'}`}>
                    ${clientBalance.toFixed(2)}
                  </span>
                </div>
                
                {clientBalance < servicePrice && (
                  <div className="text-red-400 text-sm mt-2">
                    Insufficient balance. Please add funds to your account.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleScheduleReading}
          disabled={isSubmitting || !date || !timeSlot || clientBalance < servicePrice}
        >
          {isSubmitting ? "Scheduling..." : "Schedule Reading"}
        </Button>
      </CardContent>
    </Card>
  );
}