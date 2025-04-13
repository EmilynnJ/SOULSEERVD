import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Policies = () => {
  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Policies</h1>
          
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="refund">Refund Policy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Terms of Service</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h2>1. Introduction</h2>
                  <p>Welcome to SoulSeer. By accessing our website and services, you agree to these Terms of Service.</p>
                  
                  <h2>2. Services</h2>
                  <p>SoulSeer provides a platform connecting clients with psychic readers for spiritual guidance. Our services include pay-per-minute readings, scheduled sessions, live streams, and spiritual products.</p>
                  
                  <h2>3. User Accounts</h2>
                  <p>You must create an account to access most features. You are responsible for maintaining the confidentiality of your account information.</p>
                  
                  <h2>4. Payment Terms</h2>
                  <p>Clients prepay for readings by adding funds to their account balance. Rates vary by reader. Scheduled readings require full payment at booking.</p>
                  
                  <h2>5. Disclaimer</h2>
                  <p>Readings are for entertainment and spiritual guidance only. We do not guarantee specific outcomes or results.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h2>1. Information Collection</h2>
                  <p>We collect personal information including name, email, payment details, and reading history to provide our services.</p>
                  
                  <h2>2. How We Use Your Information</h2>
                  <p>We use your information to facilitate readings, process payments, improve our services, and communicate with you.</p>
                  
                  <h2>3. Information Sharing</h2>
                  <p>We share your information with readers as necessary to provide services. We do not sell your personal information to third parties.</p>
                  
                  <h2>4. Data Security</h2>
                  <p>We implement security measures to protect your personal information from unauthorized access or disclosure.</p>
                  
                  <h2>5. Your Rights</h2>
                  <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="refund">
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="text-white">Refund Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h2>1. Pay-Per-Minute Readings</h2>
                  <p>For pay-per-minute readings, you are charged only for the time used. If you experience technical issues during a reading, contact support within 24 hours for assistance.</p>
                  
                  <h2>2. Scheduled Readings</h2>
                  <p>Scheduled readings may be canceled up to 24 hours before the appointment for a full refund. Cancellations within 24 hours are eligible for a 50% refund or rescheduling.</p>
                  
                  <h2>3. Satisfaction Guarantee</h2>
                  <p>If you're unsatisfied with your reading, contact support within 24 hours. We'll review your case and may offer a partial refund or credit at our discretion.</p>
                  
                  <h2>4. Shop Purchases</h2>
                  <p>Physical products may be returned within 14 days of receipt if unused and in original packaging. Digital products are non-refundable once accessed.</p>
                  
                  <h2>5. Account Credits</h2>
                  <p>Unused account balance is non-refundable but remains available for future readings with no expiration.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Policies;