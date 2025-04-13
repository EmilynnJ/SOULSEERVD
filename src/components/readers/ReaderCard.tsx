import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ReaderCardProps {
  id: number;
  name: string;
  specialties?: string;
  rate: number;
  isOnline: boolean;
  rating: number;
  imageUrl?: string;
}

export function ReaderCard({ id, name, specialties, rate, isOnline, rating, imageUrl }: ReaderCardProps) {
  const navigate = useNavigate();
  
  const specialtiesList = specialties?.split(', ') || [];
  
  return (
    <Card className="reader-card glass-effect border-0 overflow-hidden">
      <div className="relative">
        <img 
          src={imageUrl || `https://i.pravatar.cc/300?img=${id}`} 
          alt={name} 
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => navigate(`/readers/${id}`)}
        />
        <div 
          className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
            isOnline ? 'online-indicator' : 'offline-indicator'
          }`}
        />
      </div>
      
      <CardContent className="pt-4">
        <h3 
          className="text-xl font-semibold text-white mb-1 cursor-pointer hover:text-primary"
          onClick={() => navigate(`/readers/${id}`)}
        >
          {name}
        </h3>
        
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(rating) ? 'star-rating fill-current' : 'text-gray-400'}`} 
            />
          ))}
          <span className="ml-1 text-sm text-gray-300">{rating.toFixed(1)}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {specialtiesList.slice(0, 2).map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {specialty}
            </Badge>
          ))}
          {specialtiesList.length > 2 && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              +{specialtiesList.length - 2}
            </Badge>
          )}
        </div>
        
        <p className="text-lg font-semibold text-primary">${rate.toFixed(2)}/min</p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={() => navigate(`/readers/${id}`)}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}