import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fine } from "@/lib/fine";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { data: session } = fine.auth.useSession();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would be implemented with actual update functionality
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Your Profile</h1>
          
          <div className="max-w-md mx-auto">
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-background/50"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Profile = () => <ProtectedRoute Component={ProfilePage} />;

export default Profile;