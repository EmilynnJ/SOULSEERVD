import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Phone, Video, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number | null;
}

interface ServiceSelectionProps {
  readerId?: number;
  readerRate?: number;
}

export function ServiceSelection({ readerId, readerRate }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const servicesData = await fine.table("services").select("*");
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [toast]);

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "chat":
        return MessageCircle;
      case "call":
        return Phone;
      case "video":
        return Video;
      case "scheduled":
        return Calendar;
      default:
        return MessageCircle;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "chat":
        return "bg-pink-500/20 text-pink-500";
      case "call":
        return "bg-purple-500/20 text-purple-500";
      case "video":
        return "bg-blue-500/20 text-blue-500";
      case "scheduled":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  const handleSelectService = (service: Service) => {
    if (!readerId) {
      navigate(`/readings/${service.type}`);
    } else {
      navigate(`/readings/${service.type}/${readerId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service) => {
        const Icon = getServiceIcon(service.type);
        const colorClass = getServiceColor(service.type);
        
        // For pay-per-minute services, show the reader's rate if available
        const isPPM = service.price === null;
        const priceDisplay = isPPM && readerRate 
          ? `$${readerRate.toFixed(2)}/min` 
          : service.price 
            ? `$${service.price.toFixed(2)}` 
            : "Price varies";
        
        return (
          <Card key={service.id} className="glass-effect border-0">
            <CardHeader>
              <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">{service.name}</CardTitle>
              <CardDescription className="text-gray-300">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-primary">{priceDisplay}</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary/90 hover:bg-primary"
                onClick={() => handleSelectService(service)}
              >
                Select
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}