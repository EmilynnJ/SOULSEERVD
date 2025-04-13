import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveStream {
  id: number;
  title: string;
  readerName: string;
  readerId: number;
  viewers: number;
  imageUrl?: string;
  thumbnailUrl?: string;
}

interface LiveStreamListProps {
  limit?: number;
  showViewAll?: boolean;
}

export function LiveStreamList({ limit, showViewAll = true }: LiveStreamListProps) {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLiveStreams() {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch actual live streams from the database
        // For now, we'll use sample data
        const sampleStreams: LiveStream[] = [
          {
            id: 1,
            title: "Tarot Reading for the Week Ahead",
            readerName: "Mystic Maya",
            readerId: 1,
            viewers: 124,
            imageUrl: "https://i.pravatar.cc/300?img=1",
            thumbnailUrl: "https://images.unsplash.com/photo-1659535824233-dbb7349bfd4d?q=80&w=2070&auto=format&fit=crop"
          },
          {
            id: 2,
            title: "Astrology Insights & Horoscopes",
            readerName: "Celestial Sarah",
            readerId: 2,
            viewers: 87,
            imageUrl: "https://i.pravatar.cc/300?img=5",
            thumbnailUrl: "https://images.unsplash.com/photo-1632937083436-2a15b15e5c4d?q=80&w=2070&auto=format&fit=crop"
          },
          {
            id: 3,
            title: "Spiritual Guidance Q&A Session",
            readerName: "Visionary Victoria",
            readerId: 4,
            viewers: 56,
            imageUrl: "https://i.pravatar.cc/300?img=9",
            thumbnailUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop"
          },
          {
            id: 4,
            title: "Connecting with Spirit Guides",
            readerName: "Ethereal Emma",
            readerId: 5,
            viewers: 42,
            imageUrl: "https://i.pravatar.cc/300?img=3",
            thumbnailUrl: "https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=2069&auto=format&fit=crop"
          },
          {
            id: 5,
            title: "Career & Finance Predictions",
            readerName: "Psychic Paul",
            readerId: 6,
            viewers: 38,
            imageUrl: "https://i.pravatar.cc/300?img=15",
            thumbnailUrl: "https://images.unsplash.com/photo-1568347877321-f8935c7dc5a3?q=80&w=2146&auto=format&fit=crop"
          }
        ];
        
        // Apply limit if provided
        const limitedStreams = limit ? sampleStreams.slice(0, limit) : sampleStreams;
        
        setStreams(limitedStreams);
      } catch (error) {
        console.error("Error fetching live streams:", error);
        toast({
          title: "Error",
          description: "Failed to load live streams. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchLiveStreams();
  }, [limit, toast]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No live streams are currently available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <Card key={stream.id} className="glass-effect border-0 overflow-hidden">
            <div className="relative">
              <img 
                src={stream.thumbnailUrl} 
                alt={stream.title} 
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                LIVE
              </div>
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {stream.viewers}
              </div>
            </div>
            
            <CardContent className="pt-4">
              <div className="flex items-center mb-2">
                <img 
                  src={stream.imageUrl} 
                  alt={stream.readerName} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm text-gray-300">{stream.readerName}</span>
              </div>
              
              <h3 className="text-white font-medium mb-3">{stream.title}</h3>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="sm"
                  onClick={() => navigate(`/live-streams/${stream.id}`)}
                >
                  Watch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {showViewAll && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate('/live-streams')}
          >
            View All Live Streams
          </Button>
        </div>
      )}
    </div>
  );
}