import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Heart, Share2, BookmarkPlus, Send } from "lucide-react";
import { fine } from "@/lib/fine";

// Sample data for community posts
const communityPosts = [
  {
    id: 1,
    author: "Mystic Maya",
    authorRole: "Reader",
    authorImage: "https://i.pravatar.cc/150?img=1",
    content: "Just finished a powerful tarot reading session. The energy today is perfect for spiritual growth and self-discovery. What are you all working on in your spiritual journey?",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    tags: ["tarot", "spirituality", "growth"]
  },
  {
    id: 2,
    author: "Celestial Sarah",
    authorRole: "Reader",
    authorImage: "https://i.pravatar.cc/150?img=5",
    content: "Mercury retrograde is ending soon! Here are some tips to navigate the final days:\\\n\\\n1. Double-check all communications\\\n2. Back up your digital data\\\n3. Be patient with technology issues\\\n4. Use this time for reflection rather than new beginnings",
    timestamp: "5 hours ago",
    likes: 42,
    comments: 15,
    tags: ["astrology", "mercuryretrograde", "cosmicadvice"]
  },
  {
    id: 3,
    author: "SpiritSeeker92",
    authorRole: "Client",
    authorImage: "https://i.pravatar.cc/150?img=23",
    content: "Had an amazing reading with Visionary Victoria yesterday. She predicted a job opportunity would come my way, and I just got called for an interview today! So grateful for this community and the guidance I've received.",
    timestamp: "1 day ago",
    likes: 37,
    comments: 12,
    tags: ["testimonial", "gratitude", "predictions"]
  }
];

// Sample data for forum topics
const forumTopics = [
  {
    id: 1,
    title: "Beginner's Guide to Tarot",
    author: "Intuitive Ian",
    replies: 42,
    views: 156,
    lastActivity: "2 hours ago"
  },
  {
    id: 2,
    title: "Interpreting Dreams About Water",
    author: "DreamWalker",
    replies: 28,
    views: 103,
    lastActivity: "5 hours ago"
  },
  {
    id: 3,
    title: "Crystal Healing for Beginners",
    author: "Ethereal Emma",
    replies: 35,
    views: 129,
    lastActivity: "1 day ago"
  },
  {
    id: 4,
    title: "Monthly Astrology Discussion - April 2025",
    author: "Celestial Sarah",
    replies: 67,
    views: 245,
    lastActivity: "3 hours ago"
  },
  {
    id: 5,
    title: "Meditation Techniques for Enhanced Psychic Abilities",
    author: "Mystic Maya",
    replies: 23,
    views: 98,
    lastActivity: "12 hours ago"
  }
];

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = fine.auth.useSession();
  const { toast } = useToast();

  const handlePostSubmit = (e) => {
    e.preventDefault();
    
    if (!newPost.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post in the community.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate post submission
    setTimeout(() => {
      toast({
        title: "Post submitted",
        description: "Your post has been published to the community.",
      });
      setNewPost("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Community</h1>
          
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="feed">Community Feed</TabsTrigger>
              <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed">
              {session?.user && (
                <Card className="glass-effect border-0 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Create Post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePostSubmit}>
                      <Textarea
                        placeholder="Share your thoughts, experiences, or questions with the community..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="bg-background/50 mb-4"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Posting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Post
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-6">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="glass-effect border-0">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={post.authorImage} alt={post.author} />
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-white font-medium">{post.author}</h3>
                            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              {post.authorRole}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{post.timestamp}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-white whitespace-pre-line">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="sm" className="text-white hover:text-primary hover:bg-transparent">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:text-primary hover:bg-transparent">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{post.comments}</span>
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-white hover:text-primary hover:bg-transparent">
                          <BookmarkPlus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:text-primary hover:bg-transparent">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="forum">
              <Card className="glass-effect border-0 mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Discussion Topics</CardTitle>
                    <Button className="bg-primary hover:bg-primary/90">
                      New Topic
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-white">Topic</th>
                          <th className="text-left py-3 px-4 text-white">Author</th>
                          <th className="text-center py-3 px-4 text-white">Replies</th>
                          <th className="text-center py-3 px-4 text-white">Views</th>
                          <th className="text-left py-3 px-4 text-white">Last Activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forumTopics.map((topic) => (
                          <tr key={topic.id} className="border-b border-gray-700 hover:bg-primary/5">
                            <td className="py-3 px-4">
                              <a href="#" className="text-primary hover:underline font-medium">
                                {topic.title}
                              </a>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{topic.author}</td>
                            <td className="py-3 px-4 text-center text-gray-300">{topic.replies}</td>
                            <td className="py-3 px-4 text-center text-gray-300">{topic.views}</td>
                            <td className="py-3 px-4 text-gray-300">{topic.lastActivity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-300">Showing 5 of 42 topics</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Previous
                  </Button>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;