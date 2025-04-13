import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";
import { useNavigate } from "react-router-dom";
import { createReaderApplication } from "@/lib/db-service";
import { ProtectedRoute } from "@/components/auth/route-components";

const ApplyPage = () => {
  const { data: session } = fine.auth.useSession();
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    experience: "",
    specialties: "",
    motivation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!formData.name || !formData.email || !formData.experience || !formData.specialties || !formData.motivation) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      // Submit application
      await createReaderApplication({
        userId: session?.user?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        specialties: formData.specialties,
        motivation: formData.motivation
      });
      
      toast({
        title: "Application submitted",
        description: "Your application to become a reader has been submitted successfully. We'll review it and get back to you soon.",
      });
      
      navigate('/');
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6 max-w-3xl mx-auto">
          <h1 className="alex-brush text-4xl pink-text mb-2 text-center">Become a Reader</h1>
          <p className="text-center text-muted-foreground mb-8">
            Share your gifts with our community and help others find guidance
          </p>
          
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="text-white">Reader Application</CardTitle>
              <CardDescription>
                Please fill out the form below to apply to become a reader on SoulSeer.
                Our team will review your application and contact you soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-background/50"
                      required
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
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input
                      id="specialties"
                      name="specialties"
                      placeholder="e.g., Tarot, Mediumship, Astrology"
                      value={formData.specialties}
                      onChange={handleChange}
                      className="bg-background/50"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Tell us about your experience as a psychic reader..."
                    value={formData.experience}
                    onChange={handleChange}
                    className="bg-background/50"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to join SoulSeer?</Label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    placeholder="Share your motivation for becoming a reader on our platform..."
                    value={formData.motivation}
                    onChange={handleChange}
                    className="bg-background/50"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Apply = () => <ProtectedRoute Component={ApplyPage} />;

export default Apply;