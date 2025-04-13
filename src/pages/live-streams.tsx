import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LiveStreamList } from "@/components/live-streams/LiveStreamList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fine } from "@/lib/fine";

const LiveStreams = () => {
  const { data: session } = fine.auth.useSession();
  const [userBalance, setUserBalance] = useState(0);
  
  useEffect(() => {
    async function fetchUserBalance() {
      if (!session?.user?.id) return;
      
      try {
        const userData = await fine.table("users").select("balance").eq("id", parseInt(session.user.id) || 0);
        if (userData && userData.length > 0) {
          setUserBalance(userData[0].balance || 0);
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    }
    
    fetchUserBalance();
  }, [session]);

  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {session?.user && (
          <Card className="glass-effect border-0 mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white">Your Balance</p>
                </div>
                <p className="text-xl font-semibold text-primary">${userBalance.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Live Streams</h1>
          
          <Tabs defaultValue="live" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="live">Live Now</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            <TabsContent value="live">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Live Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <LiveStreamList showViewAll={false} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upcoming">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Upcoming Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Upcoming streams feature coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="popular">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Popular Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Popular streams feature coming soon!</p>
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

export default LiveStreams;