import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ReaderList } from "@/components/readers/ReaderList";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { LiveStreamPreview } from "@/components/home/LiveStreamPreview";
import { ShopPreview } from "@/components/home/ShopPreview";

const Index = () => {
  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4">
        <Hero />
        
        <div className="glass-effect rounded-lg p-6 mb-12">
          <ReaderList onlineOnly={true} limit={4} title="Online Readers" />
        </div>
        
        <FeaturedServices />
        
        <div className="glass-effect rounded-lg p-6 mb-12">
          <LiveStreamPreview />
        </div>
        
        <div className="glass-effect rounded-lg p-6 mb-12">
          <ShopPreview />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Index;