import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { getOrderById, getOrderItems } from "@/lib/db-service";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        
        // Fetch order details
        const orderData = await getOrderById(id);
        
        if (!orderData) {
          toast({
            title: "Order not found",
            description: "The requested order could not be found.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        // Check if order belongs to current user
        if (orderData.userId !== parseInt(session?.user?.id)) {
          toast({
            title: "Unauthorized",
            description: "You do not have permission to view this order.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setOrder(orderData);
        
        // Fetch order items
        const items = await getOrderItems(id);
        setOrderItems(items || []);
        
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (session?.user?.id) {
      fetchOrderDetails();
    }
  }, [id, session, toast, navigate]);

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
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-semibold text-white mb-2 header-glow">Order Confirmed!</h1>
            <p className="text-gray-300">Thank you for your purchase. Your order has been received.</p>
          </div>
          
          <Card className="glass-effect border-0 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Order Number:</span>
                      <span className="text-white">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Date:</span>
                      <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Status:</span>
                      <span className={`${
                        order.status === 'completed' ? 'text-green-400' : 
                        order.status === 'processing' ? 'text-blue-400' : 'text-yellow-400'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total:</span>
                      <span className="text-primary font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Shipping Address</h3>
                  <p className="text-gray-300">{order.shippingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="text-white">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length > 0 ? (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center border-b border-gray-700 pb-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                      </div>
                      
                      <div className="flex-grow ml-4">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 flex justify-between">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-primary font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No items found for this order.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8">
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const OrderConfirmation = () => <ProtectedRoute Component={OrderConfirmationPage} />;

export default OrderConfirmation;