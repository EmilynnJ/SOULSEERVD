import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/route-components";

const MessagesPage = () => {
  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Messages</h1>
          
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Messaging feature coming soon!</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Messages = () => <ProtectedRoute Component={MessagesPage} />;

export default Messages;