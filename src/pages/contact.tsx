import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <CardTitle className="text-white">Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  <a href="mailto:contact@soulseer.com" className="text-primary hover:underline">
                    contact@soulseer.com
                  </a>
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <CardTitle className="text-white">Phone</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  <a href="tel:+18005551234" className="text-primary hover:underline">
                    +1 (800) 555-1234
                  </a>
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0">
              <CardHeader className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <CardTitle className="text-white">Address</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  123 Mystic Way<br />
                  Spiritual City, SC 12345<br />
                  United States
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="text-white">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
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
                    <Label htmlFor="email">Email Address</Label>
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-background/50"
                    rows={6}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;