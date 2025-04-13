import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">About SoulSeer</h1>
          
          <div className="flex flex-col items-center mt-8 mb-6">
            <img 
              src="https://i.postimg.cc/yxy5Xthz/Picsart-25-03-12-11-39-59-336-1.jpg" 
              alt="Emily - Founder" 
              className="rounded-full w-48 h-48 object-cover mb-4"
            />
            <p className="text-white text-xl font-semibold">Emily</p>
            <p className="text-primary">Founder, Developer, & Reader</p>
          </div>
          
          <Card className="glass-effect border-0">
            <CardContent className="p-6 prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6">
                At SoulSeer, we are dedicated to providing ethical, compassionate, and judgment-free spiritual guidance. Our mission is twofold: to offer clients genuine, heart-centered readings and to uphold fair, ethical standards for our readers.
              </p>
              
              <p className="text-gray-300 mb-6">
                Founded by psychic medium Emilynn, SoulSeer was created as a response to the corporate greed that dominates many psychic platforms. Unlike other apps, our readers keep the majority of what they earn and play an active role in shaping the platform.
              </p>
              
              <p className="text-gray-300 mb-6">
                SoulSeer is more than just an app—it's a soul tribe. A community of gifted psychics united by our life's calling: to guide, heal, and empower those who seek clarity on their journey.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;