import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, History, DollarSign, Star } from "lucide-react";

interface EarningsData {
  total: number;
  today: number;
  thisMonth: number;
}

const ReaderDashboardPage = () => {
  const { data: session } = fine.auth.useSession();
  const [reader, setReader] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<EarningsData>({ total: 0, today: 0, thisMonth: 0 });
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchReaderData() {
      try {
        setLoading(true);
        
        // Check if user is a reader
        const userData = await fine.table("users").select("*").eq("id", parseInt(session?.user?.id) || 0);
        const isReader = userData?.[0]?.role === 'reader' || userData?.[0]?.email === 'emilynn992@gmail.com';
        
        if (!isReader) {
          toast({
            title: "Unauthorized",
            description: "You do not have permission to access the reader dashboard.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Fetch reader profile
        const readerData = await fine.table("readers").select("*").eq("userId", parseInt(session?.user?.id) || 0);
        
        if (readerData && readerData.length > 0) {
          setReader(readerData[0]);
          setIsOnline(readerData[0].isOnline);
        } else {
          toast({
            title: "Reader profile not found",
            description: "Your reader profile could not be found.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Fetch bookings for this reader
        const bookingsData = await fine.table("bookings")
          .select("*")
          .eq("readerId", readerData[0].id)
          .order("scheduledTime", { ascending: false });
        
        setBookings(bookingsData || []);
        
        // Calculate earnings
        const completedBookings = bookingsData?.filter(b => b.status === 'completed') || [];
        const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
        
        const todayEarnings = completedBookings
          .filter(b => new Date(b.createdAt).toDateString() === new Date().toDateString())
          .reduce((sum, booking) => sum + (booking.amount || 0), 0);
          
        const thisMonthEarnings = completedBookings
          .filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth() && 
                       new Date(b.createdAt).getFullYear() === new Date().getFullYear())
          .reduce((sum, booking) => sum + (booking.amount || 0), 0);
        
        setEarnings({
          total: totalEarnings,
          today: todayEarnings,
          thisMonth: thisMonthEarnings
        });
        
      } catch (error) {
        console.error("Error fetching reader data:", error);
        toast({
          title: "Error",
          description: "Failed to load your reader data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (session?.user?.id) {
      fetchReaderData();
    }
  }, [session, toast, navigate]);
  
  const handleToggleOnline = async () => {
    try {
      const newStatus = !isOnline;
      setIsOnline(newStatus);
      
      // Update reader status in database
      await fine.table("readers")
        .update({ isOnline: newStatus })
        .eq("id", reader.id);
      
      toast({
        title: newStatus ? "You are now online" : "You are now offline",
        description: newStatus ? 
          "Clients can now see you and request readings." : 
          "You will not receive new reading requests while offline.",
      });
      
    } catch (error) {
      console.error("Error updating online status:", error);
      setIsOnline(!isOnline); // Revert UI state
      toast({
        title: "Error",
        description: "Failed to update your online status. Please try again.",
        variant: "destructive",
      });
    }
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
          <h1 className="alex-brush text-4xl pink-text mb-2 text-center">Reader Dashboard</h1>
          <p className="text-center text-muted-foreground mb-8">
            Welcome back, {session?.user?.name || "Reader"}
          </p>
          
          <Card className="glass-effect border-0 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  {reader?.imageUrl && (
                    <img 
                      src={reader.imageUrl} 
                      alt={session?.user?.name || "Reader"} 
                      className="w-16 h-16 rounded-full mr-4"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-white">{session?.user?.name}</h2>
                    <p className="text-gray-300">${reader?.rate.toFixed(2)}/min</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center space-x-2 mr-4">
                    <Switch 
                      id="online-mode" 
                      checked={isOnline}
                      onCheckedChange={handleToggleOnline}
                    />
                    <Label htmlFor="online-mode" className="text-white">
                      {isOnline ? 'Online' : 'Offline'}
                    </Label>
                  </div>
                  
                  <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Today's Earnings</CardTitle>
                <DollarSign className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">${earnings.today.toFixed(2)}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Monthly Earnings</CardTitle>
                <DollarSign className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">${earnings.thisMonth.toFixed(2)}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Rating</CardTitle>
                <Star className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{reader?.rating?.toFixed(1) || '5.0'}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">Upcoming Readings</TabsTrigger>
              <TabsTrigger value="history">Reading History</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Upcoming Readings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.filter(b => b.status === 'scheduled').length > 0 ? (
                    <div className="space-y-4">
                      {bookings
                        .filter(b => b.status === 'scheduled')
                        .map((booking, index) => (
                          <Card key={index} className="glass-effect border-0">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-white font-medium">
                                    Reading with Client #{booking.clientId}
                                  </p>
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
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming readings scheduled.</p>
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
                                  <p className="text-white font-medium">
                                    Reading with Client #{booking.clientId}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {new Date(booking.createdAt).toLocaleString()}
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
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reading history to display.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="earnings">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="glass-effect border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">Total Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-white">${earnings.total.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-effect border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">This Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-white">${earnings.thisMonth.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-effect border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">Today</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-white">${earnings.today.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">Detailed earnings reports coming soon!</p>
                    <Button className="bg-primary hover:bg-primary/90">
                      Download Earnings Report
                    </Button>
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

export default ReaderDashboardPage;