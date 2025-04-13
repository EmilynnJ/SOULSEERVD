import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PhoneReading } from "@/components/readings/PhoneReading";
import { ReaderList } from "@/components/readers/ReaderList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/route-components";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";

const PhoneReadingPage = () => {
  const { readerId } = useParams();
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();
  const [reader, setReader] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
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
  
  const handleStartReading = () => {
    if (userBalance < reader.rate) {
      toast({
        title: "Insufficient balance",
        description: "Please add funds to your account to start a reading.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSessionActive(true);
    
    // In a real implementation, this would create a booking record
    // and establish a connection with the reader
  };
  
  const handleBalanceUpdate = (newBalance: number) => {
    setUserBalance(newBalance);
  };
  
  const handleSessionEnd = () => {
    setIsSessionActive(false);
    
    // In a real implementation, this would update the booking record
    // and close the connection with the reader
    
    toast({
      title: "Reading ended",
      description: "Your reading session has ended.",
    });
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
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Voice Reading</h1>
          
          {reader ? (
            isSessionActive ? (
              <PhoneReading 
                readerId={reader.id}
                readerName={reader.name}
                readerImage={reader.imageUrl}
                readerRate={reader.rate}
                clientId={parseInt(session?.user?.id || "0")}
                clientName={session?.user?.name || "Client"}
                clientBalance={userBalance}
                onBalanceUpdate={handleBalanceUpdate}
                onSessionEnd={handleSessionEnd}
              />
            ) : (
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    {reader.imageUrl && (
                      <img 
                        src={reader.imageUrl} 
                        alt={reader.name} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    <span>{reader.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rate:</span>
                    <span className="text-primary font-semibold">${reader.rate.toFixed(2)}/min</span>
                  </div>
                  
                  {reader.specialties && (
                    <div>
                      <span className="text-gray-300">Specialties:</span>
                      <p className="text-white">{reader.specialties}</p>
                    </div>
                  )}
                  
                  {reader.bio && (
                    <div>
                      <span className="text-gray-300">About:</span>
                      <p className="text-white">{reader.bio}</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleStartReading}
                      disabled={userBalance < reader.rate}
                    >
                      Start Voice Reading
                    </Button>
                    
                    {userBalance < reader.rate && (
                      <p className="text-red-400 text-sm mt-2 text-center">
                        Insufficient balance. Please add funds to your account.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <>
              <p className="text-center text-white mb-8">
                Select a reader to start a voice reading
              </p>
              <ReaderList onlineOnly={true} title="Available Readers" />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const PhoneReadingRoute = () => <ProtectedRoute Component={PhoneReadingPage} />;

export default PhoneReadingRoute;