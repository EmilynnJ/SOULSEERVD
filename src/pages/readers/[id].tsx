import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageCircle, Phone, Video, Calendar, Clock } from "lucide-react";
import { fine } from "@/lib/fine";

const ReaderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reader, setReader] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  useEffect(() => {
    async function fetchReaderData() {
      try {
        setLoading(true);
        
        // Fetch reader data
        const readerData = await fine.table("readers").select("*").eq("id", parseInt(id || "0"));
        
        if (!readerData || readerData.length === 0) {
          toast({
            title: "Reader not found",
            description: "The requested reader could not be found.",
            variant: "destructive",
          });
          navigate("/readers");
          return;
        }
        
        // Get reader's user details for name
        const userData = await fine.table("users").select("name").eq("id", readerData[0].userId);
        
        setReader({
          ...readerData[0],
          name: userData[0]?.name || "Unknown Reader"
        });
        
      } catch (error) {
        console.error("Error fetching reader data:", error);
        toast({
          title: "Error",
          description: "Failed to load reader information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchReaderData();
  }, [id, toast, navigate]);

  const handleStartReading = (type: string) => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start a reading.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate(`/readings/${type}/${id}`);
  };
  
  const handleScheduleReading = () => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to schedule a reading.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate(`/readings/schedule/${id}`);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="glass-effect border-0 sticky top-24">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img 
                        src={reader.imageUrl || `https://i.pravatar.cc/300?img=${reader.id}`} 
                        alt={reader.name} 
                        className="w-40 h-40 rounded-full object-cover"
                      />
                      <div 
                        className={`absolute bottom-2 right-2 w-5 h-5 rounded-full ${
                          reader.isOnline ? 'online-indicator' : 'offline-indicator'
                        }`}
                      />
                    </div>
                    
                    <h1 className="text-3xl font-semibold text-white mb-2">{reader.name}</h1>
                    
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(reader.rating) ? 'star-rating fill-current' : 'text-gray-400'}`} 
                        />
                      ))}
                      <span className="ml-2 text-gray-300">{reader.rating.toFixed(1)}</span>
                    </div>
                    
                    <p className="text-2xl font-bold text-primary mb-6">${reader.rate.toFixed(2)}/min</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
                      {reader.specialties?.split(', ').map((specialty: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="space-y-3 w-full">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => handleStartReading('chat')}
                        disabled={!reader.isOnline}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat Reading
                      </Button>
                      
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => handleStartReading('call')}
                        disabled={!reader.isOnline}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Voice Reading
                      </Button>
                      
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => handleStartReading('video')}
                        disabled={!reader.isOnline}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Video Reading
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-primary text-primary hover:bg-primary/10"
                        onClick={handleScheduleReading}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Reading
                      </Button>
                    </div>
                    
                    {!reader.isOnline && (
                      <p className="text-yellow-400 text-sm mt-4">
                        This reader is currently offline. You can schedule a reading or check back later.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <CardTitle className="text-white">About {reader.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <p className="text-gray-300">
                        {reader.bio || `${reader.name} is a gifted psychic with years of experience helping clients find clarity and guidance. 
                        Specializing in ${reader.specialties}, they provide compassionate and insightful readings 
                        to help you navigate life's challenges and opportunities.`}
                      </p>
                      
                      <h3 className="text-xl font-semibold text-white mt-6 mb-3">Specialties</h3>
                      <ul className="text-gray-300">
                        {reader.specialties?.split(', ').map((specialty: string, index: number) => (
                          <li key={index}>{specialty}</li>
                        ))}
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-white mt-6 mb-3">Reading Style</h3>
                      <p className="text-gray-300">
                        {reader.name}'s reading style is compassionate, direct, and insightful. They connect with your energy 
                        to provide clear guidance while creating a safe space for exploration and healing.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <CardTitle className="text-white">Client Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, j) => (
                                  <Star 
                                    key={j} 
                                    className={`h-4 w-4 ${j < 5 - i ? 'star-rating fill-current' : 'text-gray-400'}`} 
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-300">{new Date().toLocaleDateString()}</span>
                            </div>
                            <p className="text-white font-medium mb-1">Anonymous Client</p>
                            <p className="text-gray-300">
                              {i === 0 ? 
                                `${reader.name} was amazing! Their insights were spot on and they provided exactly the guidance I needed.` :
                                i === 1 ?
                                `I've had several readings with ${reader.name} and they never disappoint. Highly recommended!` :
                                `Very accurate and compassionate reading. ${reader.name} helped me see my situation from a new perspective.`
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="availability">
                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <CardTitle className="text-white">Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white">Current Status:</span>
                          <span className={reader.isOnline ? 'text-green-400' : 'text-gray-400'}>
                            {reader.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-white mt-4 mb-2">Regular Hours</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-300 font-medium">Monday - Friday</p>
                            <p className="text-white">9:00 AM - 5:00 PM EST</p>
                          </div>
                          <div>
                            <p className="text-gray-300 font-medium">Saturday</p>
                            <p className="text-white">10:00 AM - 2:00 PM EST</p>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-lg font-medium text-white mb-2">Schedule a Reading</h3>
                          <p className="text-gray-300 mb-4">
                            Can't catch {reader.name} online? Schedule a reading at a time that works for you.
                          </p>
                          <Button 
                            className="bg-primary hover:bg-primary/90"
                            onClick={handleScheduleReading}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            View Available Times
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReaderProfile;