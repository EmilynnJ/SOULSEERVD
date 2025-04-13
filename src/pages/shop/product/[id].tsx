import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ArrowLeft, Plus, Minus, Star } from "lucide-react";
import { getProductById } from "@/lib/db-service";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        
        if (!productData) {
          toast({
            title: "Product not found",
            description: "The requested product could not be found.",
            variant: "destructive",
          });
          navigate("/shop");
          return;
        }
        
        setProduct(productData);
        
        // Load cart from localStorage
        const savedCart = localStorage.getItem('soulseer-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          setCartCount(parsedCart.reduce((total, item) => total + item.quantity, 0));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [id, toast, navigate]);
  
  const increaseQuantity = () => {
    if (product && quantity < product.inventory) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const addToCart = () => {
    if (!product) return;
    
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      // Item already in cart, update quantity
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity
      };
    } else {
      // Add new item to cart
      updatedCart = [...cartItems, { ...product, quantity }];
    }
    
    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    
    // Save to localStorage
    localStorage.setItem('soulseer-cart', JSON.stringify(updatedCart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const viewCart = () => {
    navigate('/shop/cart');
  };

  if (loading) {
    return (
      <div className="app-background min-h-screen flex flex-col dark">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="text-white hover:text-primary hover:bg-transparent p-0 mr-4"
              onClick={() => navigate('/shop')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Shop</span>
            </Button>
            
            <div className="ml-auto">
              <Button 
                variant="outline" 
                className="relative border-primary text-primary hover:bg-primary/10"
                onClick={viewCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          <Card className="glass-effect border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <img 
                    src={product.imageUrl || "https://via.placeholder.com/500"} 
                    alt={product.name} 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary/90">{product.category}</Badge>
                </div>
                
                <div>
                  <h1 className="text-3xl font-semibold text-white mb-2 header-glow">{product.name}</h1>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="h-5 w-5 star-rating fill-current" 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-300">(12 reviews)</span>
                  </div>
                  
                  <p className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                    <p className="text-gray-300">{product.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">Availability</h3>
                    <p className={`${product.inventory > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.inventory > 0 ? `In Stock (${product.inventory} available)` : 'Out of Stock'}
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <h3 className="text-lg font-medium text-white mr-4">Quantity</h3>
                    <div className="flex items-center border border-gray-600 rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:text-primary hover:bg-transparent"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-white">{quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:text-primary hover:bg-transparent"
                        onClick={increaseQuantity}
                        disabled={product.inventory <= quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={addToCart}
                      disabled={product.inventory <= 0}
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-primary text-primary hover:bg-primary/10"
                      onClick={viewCart}
                    >
                      View Cart
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;