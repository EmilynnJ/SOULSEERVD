import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScheduleReading } from "@/components/readings/ScheduleReading";
import { ReaderList } from "@/components/readers/ReaderList";
import { Card, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/route-components";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";

const ScheduleReadingPage = () => {
  const { readerId } = useParams();
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();
  const [reader, setReader] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch user balance
        const userData = await fine.table("users").select("balance").eq("id", parseInt(session.user.id) || 0);
        if (userData && userData.length > 0) {
          setUserBalance(userData[0].balance || 0);
        }
        
        // Fetch scheduled service
        const serviceData = await fine.table("services")
          .select("*")
          .eq("type", "scheduled")
          .limit(1);
        
        if (serviceData && serviceData.length > 0) {
          setService(serviceData[0]);
        }
        
        // If readerId is provided, fetch reader details
        if (readerId) {
          const readerData = await fine.table("readers").select("*").eq("id", parseInt(readerId) || 0);
          
          if (readerData && readerData.length > 0) {
            // Get reader's user details for name
            const readerUserData = await fine.table("users").select("name").eq("id", readerData[0].userId);
            
            setReader({
              ...readerData[0],
              name: readerUserData[0]?.name || "Unknown Reader"
            });
          } else {
            toast({
              title: "Reader not found",
              description: "The selected reader could not be found.",
              variant: "destructive",
            });
            navigate("/readers");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load reader information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [session, readerId, navigate, toast]);
  
  const handleScheduled = () => {
    toast({
      title: "Reading scheduled",
      description: "Your reading has been scheduled successfully.",
    });
    navigate("/dashboard");
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
        
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Schedule a Reading</h1>
          
          {reader && service ? (
            <ScheduleReading 
              readerId={reader.id}
              readerName={reader.name}
              readerImage={reader.imageUrl}
              serviceId={service.id}
              serviceName={service.name}
              servicePrice={service.price || 60}
              clientId={parseInt(session?.user?.id || "0")}
              clientBalance={userBalance}
              onScheduled={handleScheduled}
            />
          ) : (
            <>
              <p className="text-center text-white mb-8">
                Select a reader to schedule a reading
              </p>
              <ReaderList title="Available Readers" />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ScheduleReadingRoute = () => <ProtectedRoute Component={ScheduleReadingPage} />;

export default ScheduleReadingRoute;