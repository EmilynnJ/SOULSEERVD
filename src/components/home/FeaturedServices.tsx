import { useNavigate } from "react-router-dom";
import { MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function FeaturedServices() {
  const navigate = useNavigate();
  
  return (
    <div className="py-12">
      <h2 className="text-3xl alex-brush pink-text mb-6 text-center">Our Services</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect border-0">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6" />
            </div>
            <CardTitle className="text-white">Pay-Per-Minute Readings</CardTitle>
            <CardDescription className="text-gray-300">
              Connect with our gifted psychics through chat, voice, or video readings. 
              You only pay for the time you use.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full bg-primary/90 hover:bg-primary"
              onClick={() => navigate('/readers')}
            >
              Find a Reader
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-effect border-0">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <CardTitle className="text-white">Schedule a Reading</CardTitle>
            <CardDescription className="text-gray-300">
              Book a private session with your preferred psychic at a time that works for you.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full bg-primary/90 hover:bg-primary"
              onClick={() => navigate('/readings/schedule')}
            >
              Book Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}