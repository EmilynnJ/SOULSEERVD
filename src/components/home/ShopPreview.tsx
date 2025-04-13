import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const shopItems = [
  {
    id: 1,
    name: "Crystal Healing Set",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1603344204980-4edb0ea63148?q=80&w=2070&auto=format&fit=crop",
    category: "Crystals"
  },
  {
    id: 2,
    name: "Tarot Card Deck",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1633058851353-e5166a0ebc3f?q=80&w=2070&auto=format&fit=crop",
    category: "Tarot"
  },
  {
    id: 3,
    name: "Chakra Meditation Guide",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1602940659805-770d1b3b9911?q=80&w=2070&auto=format&fit=crop",
    category: "Books"
  },
  {
    id: 4,
    name: "Aura Cleansing Kit",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=2070&auto=format&fit=crop",
    category: "Spiritual"
  }
];

export function ShopPreview() {
  const navigate = useNavigate();
  
  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl alex-brush pink-text">Spiritual Shop</h2>
        <Button 
          variant="link" 
          className="text-primary"
          onClick={() => navigate('/shop')}
        >
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {shopItems.map((item) => (
          <Card key={item.id} className="glass-effect border-0 overflow-hidden">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-40 object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-primary/90">{item.category}</Badge>
            </div>
            
            <CardContent className="pt-4">
              <h3 className="text-white font-medium mb-1">{item.name}</h3>
              <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
            </CardContent>
            
            <CardFooter className="pt-0 pb-4">
              <Button 
                className="w-full bg-primary/90 hover:bg-primary"
                onClick={() => navigate(`/shop/product/${item.id}`)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}