import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ReaderList } from "@/components/readers/ReaderList";
import { ServiceSelection } from "@/components/readings/ServiceSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";

const Readings = () => {
  const { data: session } = fine.auth.useSession();
  const [userBalance, setUserBalance] = useState(0);
  const { toast } = useToast();
  
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
      <Navigation />
      
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
        
        <div className="glass-effect rounded-lg p-6 mb-8">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center">Psychic Readings</h1>
          
          <Card className="glass-effect border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Select a Reading Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceSelection />
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All Readers</TabsTrigger>
              <TabsTrigger value="online">Online Now</TabsTrigger>
              <TabsTrigger value="tarot">Tarot</TabsTrigger>
              <TabsTrigger value="astrology">Astrology</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ReaderList title="" />
            </TabsContent>
            <TabsContent value="online">
              <ReaderList onlineOnly={true} title="" />
            </TabsContent>
            <TabsContent value="tarot">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tarot readers coming soon.</p>
              </div>
            </TabsContent>
            <TabsContent value="astrology">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Astrology readers coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Readings;