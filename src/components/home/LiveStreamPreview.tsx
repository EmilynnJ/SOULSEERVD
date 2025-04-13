import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Gift } from "lucide-react";

const liveStreams = [
  {
    id: 1,
    title: "Tarot Reading for the Week Ahead",
    readerName: "Mystic Maya",
    viewers: 124,
    imageUrl: "https://i.pravatar.cc/300?img=1",
    thumbnailUrl: "https://images.unsplash.com/photo-1659535824233-dbb7349bfd4d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Astrology Insights & Horoscopes",
    readerName: "Celestial Sarah",
    viewers: 87,
    imageUrl: "https://i.pravatar.cc/300?img=5",
    thumbnailUrl: "https://images.unsplash.com/photo-1632937083436-2a15b15e5c4d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Spiritual Guidance Q&A Session",
    readerName: "Visionary Victoria",
    viewers: 56,
    imageUrl: "https://i.pravatar.cc/300?img=9",
    thumbnailUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop"
  }
];

export function LiveStreamPreview() {
  const navigate = useNavigate();
  
  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl alex-brush pink-text">Live Now</h2>
        <Button 
          variant="link" 
          className="text-primary"
          onClick={() => navigate('/live-streams')}
        >
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {liveStreams.map((stream) => (
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
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  size="sm"
                  onClick={() => navigate(`/live-streams/${stream.id}`)}
                >
                  <Gift className="h-4 w-4 mr-1" />
                  Gift
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}