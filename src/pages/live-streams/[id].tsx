import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LiveStreamView } from "@/components/live-streams/LiveStreamView";
import { Card, CardContent } from "@/components/ui/card";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";

const LiveStreamViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();
  const [stream, setStream] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch the actual live stream data
        // For now, we'll use sample data
        const sampleStreams = [
          {
            id: "1",
            title: "Tarot Reading for the Week Ahead",
            readerName: "Mystic Maya",
            readerId: 1,
            viewers: 124,
            imageUrl: "https://i.pravatar.cc/300?img=1",
            thumbnailUrl: "https://images.unsplash.com/photo-1659535824233-dbb7349bfd4d?q=80&w=2070&auto=format&fit=crop"
          },
          {
            id: "2",
            title: "Astrology Insights & Horoscopes",
            readerName: "Celestial Sarah",
            readerId: 2,
            viewers: 87,
            imageUrl: "https://i.pravatar.cc/300?img=5",
            thumbnailUrl: "https://images.unsplash.com/photo-1632937083436-2a15b15e5c4d?q=80&w=2070&auto=format&fit=crop"
          },
          {
            id: "3",
            title: "Spiritual Guidance Q&A Session",
            readerName: "Visionary Victoria",
            readerId: 4,
            viewers: 56,
            imageUrl: "https://i.pravatar.cc/300?img=9",
            thumbnailUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop"
          },
          {
            id: "4",
            title: "Connecting with Spirit Guides",
            readerName: "Ethereal Emma",
            readerId: 5,
            viewers: 42,
            imageUrl: "https://i.pravatar.cc/300?img=3",
            thumbnailUrl: "https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=2069&auto=format&fit=crop"
          },
          {
            id: "5",
            title: "Career & Finance Predictions",
            readerName: "Psychic Paul",
            readerId: 6,
            viewers: 38,
            imageUrl: "https://i.pravatar.cc/300?img=15",
            thumbnailUrl: "https://images.unsplash.com/photo-1568347877321-f8935c7dc5a3?q=80&w=2146&auto=format&fit=crop"
          }
        ];
        
        const foundStream = sampleStreams.find(s => s.id === id);
        
        if (foundStream) {
          setStream(foundStream);
        } else {
          toast({
            title: "Stream not found",
            description: "The requested live stream could not be found.",
            variant: "destructive",
          });
          navigate("/live-streams");
        }
        
        // If user is logged in, fetch their balance
        if (session?.user?.id) {
          const userData = await fine.table("users").select("balance").eq("id", parseInt(session.user.id) || 0);
          if (userData && userData.length > 0) {
            setUserBalance(userData[0].balance || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching stream data:", error);
        toast({
          title: "Error",
          description: "Failed to load stream information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id, session, navigate, toast]);
  
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
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">{stream.title}</h1>
          
          <LiveStreamView 
            streamId={stream.id}
            readerId={stream.readerId}
            readerName={stream.readerName}
            readerImage={stream.imageUrl}
            title={stream.title}
            clientId={session?.user?.id ? parseInt(session.user.id) || 0 : undefined}
            clientName={session?.user?.name}
            clientBalance={userBalance}
            onBalanceUpdate={handleBalanceUpdate}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiveStreamViewPage;