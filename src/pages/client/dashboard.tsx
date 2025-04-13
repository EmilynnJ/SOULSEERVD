import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Clock, Calendar, History, ShoppingBag } from "lucide-react";
import { fine } from "@/lib/fine";
import { AccountBalance } from "@/components/payments/AccountBalance";
import { useToast } from "@/hooks/use-toast";
import { getUserBookings, getUserTransactions, getUserOrders } from "@/lib/db-service";

const ClientDashboardPage = () => {
  const { data: session } = fine.auth.useSession();
  const [userBalance, setUserBalance] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch user data including balance
        const userData = await fine.table("users").select("*").eq("id", parseInt(session.user.id) || 0);
        if (userData && userData.length > 0) {
          setUserBalance(userData[0].balance || 0);
        }
        
        // Fetch user's bookings
        const userBookings = await getUserBookings(session.user.id);
        setBookings(userBookings || []);
        
        // Fetch user's transactions
        const userTransactions = await getUserTransactions(session.user.id);
        setTransactions(userTransactions || []);
        
        // Fetch user's orders
        const userOrders = await getUserOrders(session.user.id);
        setOrders(userOrders || []);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your account data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [session, toast]);
  
  const handleBalanceUpdate = (newBalance: number) => {
    setUserBalance(newBalance);
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
          <h1 className="alex-brush text-4xl pink-text mb-2 text-center">Your Dashboard</h1>
          <p className="text-center text-muted-foreground mb-8">
            Welcome back, {session?.user?.name || "User"}
          </p>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="balance">Balance</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="history">Reading History</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AccountBalance 
                  balance={userBalance} 
                  userId={session?.user?.id || ""} 
                  onBalanceUpdate={handleBalanceUpdate}
                />
                
                <Card className="glass-effect border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-white text-lg">Upcoming Readings</CardTitle>
                    <Calendar className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white">{bookings.filter(b => b.status === 'scheduled').length || 0}</p>
                    <Button 
                      className="mt-4 w-full bg-primary hover:bg-primary/90"
                      onClick={() => window.location.href = '/readers'}
                    >
                      Book Reading
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-white text-lg">Reading Time</CardTitle>
                    <Clock className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white">
                      {bookings.reduce((total, b) => total + (b.duration || 0), 0)} mins
                    </p>
                    <Button 
                      className="mt-4 w-full bg-primary hover:bg-primary/90"
                      onClick={() => window.location.href = '/readers'}
                    >
                      Find Reader
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.slice(0, 5).map((transaction, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <div>
                              <p className="text-white font-medium">
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <p className={`font-semibold ${
                              transaction.type === 'deposit' ? 'text-green-400' : 'text-primary'
                            }`}>
                              {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No recent activity to display</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="balance">
              <div className="max-w-md mx-auto">
                <AccountBalance 
                  balance={userBalance} 
                  userId={session?.user?.id || ""} 
                  onBalanceUpdate={handleBalanceUpdate}
                />
                
                <Card className="glass-effect border-0 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white">Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.map((transaction, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <div>
                              <p className="text-white font-medium">
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <p className={`font-semibold ${
                              transaction.type === 'deposit' ? 'text-green-400' : 'text-primary'
                            }`}>
                              {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No transaction history to display</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Your Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking, index) => (
                        <Card key={index} className="glass-effect border-0">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white font-medium">Reading with Reader #{booking.readerId}</p>
                                <p className="text-sm text-gray-400">
                                  {booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString() : 'On-demand'}
                                </p>
                                <p className="text-sm text-gray-400">
                                  Duration: {booking.duration || 'N/A'} minutes
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-primary font-semibold">${booking.amount?.toFixed(2) || '0.00'}</p>
                                <p className={`text-sm ${
                                  booking.status === 'completed' ? 'text-green-400' : 
                                  booking.status === 'scheduled' ? 'text-blue-400' : 'text-yellow-400'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-6">You don't have any bookings yet</p>
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => window.location.href = '/readers'}
                      >
                        Book a Reading
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Reading History</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.filter(b => b.status === 'completed').length > 0 ? (
                    <div className="space-y-4">
                      {bookings
                        .filter(b => b.status === 'completed')
                        .map((booking, index) => (
                          <Card key={index} className="glass-effect border-0">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-white font-medium">Reading with Reader #{booking.readerId}</p>
                                  <p className="text-sm text-gray-400">
                                    {booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString() : 'On-demand'}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    Duration: {booking.duration || 'N/A'} minutes
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-primary font-semibold">${booking.amount?.toFixed(2) || '0.00'}</p>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-primary text-primary hover:bg-primary/10 mt-2"
                                  >
                                    Rate Reader
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reading history to display</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card className="glass-effect border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Order History</CardTitle>
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <Card key={index} className="glass-effect border-0">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white font-medium">Order #{order.id}</p>
                                <p className="text-sm text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-400">
                                  Items: {order.itemCount || 'N/A'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-primary font-semibold">${order.total?.toFixed(2) || '0.00'}</p>
                                <p className={`text-sm ${
                                  order.status === 'completed' ? 'text-green-400' : 
                                  order.status === 'processing' ? 'text-blue-400' : 'text-yellow-400'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-primary text-primary hover:bg-primary/10 mt-2"
                                  onClick={() => window.location.href = `/orders/${order.id}`}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-6">You haven't placed any orders yet</p>
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => window.location.href = '/shop'}
                      >
                        Visit Shop
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientDashboardPage;