import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, ShoppingBag, DollarSign } from "lucide-react";

const AdminDashboardPage = () => {
  const { data: session } = fine.auth.useSession();
  const [users, setUsers] = useState([]);
  const [readers, setReaders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchAdminData() {
      try {
        setLoading(true);
        
        // Check if user is admin - we'll check by email since role might not be available
        const isAdmin = session?.user?.email === 'emilynnj14@gmail.com';
        if (!isAdmin) {
          toast({
            title: "Unauthorized",
            description: "You do not have permission to access the admin dashboard.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Fetch users
        const usersData = await fine.table("users").select("*");
        setUsers(usersData || []);
        
        // Fetch readers
        const readersData = await fine.table("readers").select("*");
        setReaders(readersData || []);
        
        // Fetch bookings
        const bookingsData = await fine.table("bookings").select("*");
        setBookings(bookingsData || []);
        
        // Fetch orders
        const ordersData = await fine.table("orders").select("*");
        setOrders(ordersData || []);
        
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast({
          title: "Error",
          description: "Failed to load admin data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (session?.user?.id) {
      fetchAdminData();
    }
  }, [session, toast, navigate]);

  if (loading) {
    return (
      <div className="app-background min-h-screen flex flex-col dark">
        <Header />
        <Navigation />
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
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-2 text-center">Admin Dashboard</h1>
          <p className="text-center text-muted-foreground mb-8">
            Welcome, {session?.user?.name || "Admin"}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Total Users</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{users.length}</p>
                <Button 
                  className="mt-4 w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/admin/users')}
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Readers</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{readers.length}</p>
                <Button 
                  className="mt-4 w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/admin/readers')}
                >
                  Manage Readers
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Bookings</CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{bookings.length}</p>
                <Button 
                  className="mt-4 w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/admin/bookings')}
                >
                  View Bookings
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Orders</CardTitle>
                <ShoppingBag className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{orders.length}</p>
                <Button 
                  className="mt-4 w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/admin/orders')}
                >
                  View Orders
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="readers">Readers</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Platform Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Recent Activity</h3>
                      <div className="space-y-2">
                        {bookings.slice(0, 5).map((booking, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <div>
                              <p className="text-white font-medium">
                                Booking #{booking.id}
                              </p>
                              <p className="text-sm text-gray-400">
                                Client #{booking.clientId} with Reader #{booking.readerId}
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
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Recent Orders</h3>
                      <div className="space-y-2">
                        {orders.slice(0, 5).map((order, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <div>
                              <p className="text-white font-medium">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-400">
                                User #{order.userId} - {order.itemCount} items
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-primary font-semibold">${order.total.toFixed(2)}</p>
                              <p className={`text-sm ${
                                order.status === 'completed' ? 'text-green-400' : 
                                order.status === 'processing' ? 'text-blue-400' : 'text-yellow-400'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card className="glass-effect border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">User Management</CardTitle>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/admin/users/new')}
                  >
                    Add User
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-white">ID</th>
                          <th className="text-left py-3 px-4 text-white">Name</th>
                          <th className="text-left py-3 px-4 text-white">Email</th>
                          <th className="text-left py-3 px-4 text-white">Role</th>
                          <th className="text-left py-3 px-4 text-white">Balance</th>
                          <th className="text-left py-3 px-4 text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-700">
                            <td className="py-3 px-4 text-gray-300">{user.id}</td>
                            <td className="py-3 px-4 text-white">{user.name}</td>
                            <td className="py-3 px-4 text-gray-300">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.email === 'emilynnj14@gmail.com' ? 'bg-red-500 text-white' : 
                                user.email === 'emilynn992@gmail.com' ? 'bg-primary text-white' : 'bg-blue-500 text-white'
                              }`}>
                                {user.email === 'emilynnj14@gmail.com' ? 'admin' : 
                                 user.email === 'emilynn992@gmail.com' ? 'reader' : 'client'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-300">${user.balance?.toFixed(2) || '0.00'}</td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="ghost" 
                                className="text-primary hover:text-primary/80 hover:bg-transparent"
                                onClick={() => navigate(`/admin/users/${user.id}`)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="readers">
              <Card className="glass-effect border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Reader Management</CardTitle>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate('/admin/readers/new')}
                  >
                    Add Reader
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-white">ID</th>
                          <th className="text-left py-3 px-4 text-white">User ID</th>
                          <th className="text-left py-3 px-4 text-white">Rate</th>
                          <th className="text-left py-3 px-4 text-white">Status</th>
                          <th className="text-left py-3 px-4 text-white">Rating</th>
                          <th className="text-left py-3 px-4 text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {readers.map((reader) => (
                          <tr key={reader.id} className="border-b border-gray-700">
                            <td className="py-3 px-4 text-gray-300">{reader.id}</td>
                            <td className="py-3 px-4 text-gray-300">{reader.userId}</td>
                            <td className="py-3 px-4 text-white">${reader.rate.toFixed(2)}/min</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${reader.isOnline ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                {reader.isOnline ? 'Online' : 'Offline'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{reader.rating?.toFixed(1) || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="ghost" 
                                className="text-primary hover:text-primary/80 hover:bg-transparent"
                                onClick={() => navigate(`/admin/readers/${reader.id}`)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="finances">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="glass-effect border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <DollarSign className="h-8 w-8 text-green-400 mr-2" />
                          <p className="text-3xl font-bold text-white">
                            ${bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">From readings</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-effect border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">Shop Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <DollarSign className="h-8 w-8 text-green-400 mr-2" />
                          <p className="text-3xl font-bold text-white">
                            ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">From product sales</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-effect border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">Total Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-white">
                          {bookings.length + orders.length}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">Combined readings and orders</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Recent Transactions</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-white">Type</th>
                            <th className="text-left py-3 px-4 text-white">ID</th>
                            <th className="text-left py-3 px-4 text-white">User</th>
                            <th className="text-left py-3 px-4 text-white">Amount</th>
                            <th className="text-left py-3 px-4 text-white">Status</th>
                            <th className="text-left py-3 px-4 text-white">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ...bookings.map(b => ({ type: 'reading', ...b })),
                            ...orders.map(o => ({ type: 'order', ...o }))
                          ]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 10)
                            .map((transaction, index) => (
                              <tr key={`${transaction.type}-${transaction.id}`} className="border-b border-gray-700">
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'reading' ? 'bg-primary text-white' : 'bg-blue-500 text-white'}`}>
                                    {transaction.type === 'reading' ? 'Reading' : 'Order'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{transaction.id}</td>
                                <td className="py-3 px-4 text-gray-300">
                                  {transaction.type === 'reading' ? `Client #${transaction.clientId}` : `User #${transaction.userId}`}
                                </td>
                                <td className="py-3 px-4 text-white">
                                  ${(transaction.type === 'reading' ? transaction.amount : transaction.total)?.toFixed(2) || '0.00'}
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    transaction.status === 'completed' ? 'bg-green-500 text-white' : 
                                    transaction.status === 'scheduled' || transaction.status === 'processing' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-white'
                                  }`}>
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-300">
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
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

export default AdminDashboardPage;