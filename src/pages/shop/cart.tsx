import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { fine } from "@/lib/fine";
import { createOrder } from "@/lib/db-service";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('soulseer-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('soulseer-cart', JSON.stringify(updatedCart));
  };
  
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('soulseer-cart', JSON.stringify(updatedCart));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('soulseer-cart');
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  const handleCheckout = async () => {
    if (!session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete your purchase.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    if (!shippingAddress) {
      toast({
        title: "Shipping address required",
        description: "Please enter your shipping address.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setProcessingOrder(true);
      
      // Calculate order total and item count
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
      
      // Create order items array
      const items = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Create order in database
      const order = await createOrder({
        userId: session.user.id,
        total,
        itemCount,
        shippingAddress,
        items
      });
      
      // Clear cart
      setCartItems([]);
      localStorage.removeItem('soulseer-cart');
      
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
      
      // Redirect to order confirmation page
      navigate(`/shop/order/${order.id}`);
      
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingOrder(false);
    }
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

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
              <span>Continue Shopping</span>
            </Button>
            
            <h1 className="alex-brush text-4xl pink-text ml-auto header-glow">Your Cart</h1>
          </div>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle className="text-white">Shopping Cart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center border-b border-gray-700 pb-4">
                          <div className="flex-shrink-0 w-24 h-24 mb-4 sm:mb-0">
                            <img 
                              src={item.imageUrl || "https://via.placeholder.com/100"} 
                              alt={item.name} 
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          
                          <div className="flex-grow sm:ml-4">
                            <h3 className="text-white font-medium">{item.name}</h3>
                            <p className="text-gray-400 text-sm">{item.category}</p>
                            <p className="text-primary font-semibold mt-1">${item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center mt-4 sm:mt-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-white hover:text-primary hover:bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center text-white">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-white hover:text-primary hover:bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-right mt-4 sm:mt-0 sm:ml-4">
                            <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-400 hover:text-red-300 hover:bg-transparent mt-1"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle className="text-white">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Shipping</span>
                      <span className="text-white">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-4 flex justify-between">
                      <span className="text-white font-medium">Total</span>
                      <span className="text-primary font-bold">${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4">
                      <label className="text-white mb-2 block">Shipping Address</label>
                      <Input 
                        placeholder="Enter your shipping address"
                        className="bg-background/50 mb-4"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                      />
                      
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={handleCheckout}
                        disabled={processingOrder}
                      >
                        {processingOrder ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          "Checkout"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;