import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12 md:py-16">
      <h1 className="alex-brush text-5xl md:text-7xl header-glow mb-4">SoulSeer</h1>
      <img 
        src="https://i.postimg.cc/prT8Qbzc/HERO-IMAGE.jpg" 
        alt="SoulSeer Hero" 
        className="mx-auto mb-4 max-w-full md:max-w-md"
      />
      <p className="playfair text-xl md:text-2xl text-white mb-8">A Community of Gifted Psychics</p>
      
      <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
        <Button 
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => navigate('/readers')}
        >
          Readers
        </Button>
        <Button 
          variant="outline" 
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => navigate('/shop')}
        >
          Shop
        </Button>
        <Button 
          variant="outline" 
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => navigate('/community')}
        >
          Community
        </Button>
        <Button 
          variant="outline" 
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => navigate('/contact')}
        >
          Contact
        </Button>
      </div>
    </div>
  );
}