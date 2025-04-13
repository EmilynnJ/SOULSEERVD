import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Help = () => {
  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <h1 className="alex-brush text-4xl pink-text mb-6 text-center header-glow">Help Center</h1>
          
          <Card className="glass-effect border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do pay-per-minute readings work?</AccordionTrigger>
                  <AccordionContent>
                    Pay-per-minute readings allow you to connect with psychics instantly. You'll only be charged for the time you spend in the reading. Simply add funds to your account balance, then start a chat, call, or video session with your chosen reader. The per-minute rate varies by reader.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I add funds to my account?</AccordionTrigger>
                  <AccordionContent>
                    You can add funds to your account by visiting your Dashboard and clicking on "Add Funds." We accept all major credit cards and various payment methods for your convenience.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I schedule a reading in advance?</AccordionTrigger>
                  <AccordionContent>
                    Yes! You can schedule a reading with your preferred psychic by visiting their profile and selecting "Schedule Reading." Choose a date and time that works for you, and make a one-time payment to secure your booking.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What if I'm not satisfied with my reading?</AccordionTrigger>
                  <AccordionContent>
                    We want you to be completely satisfied with your experience. If you're unhappy with your reading, please contact our customer support team within 24 hours, and we'll work with you to resolve the issue.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I become a reader on SoulSeer?</AccordionTrigger>
                  <AccordionContent>
                    Reader registration is managed by our admin team. If you're interested in becoming a reader, please contact us with your experience and specialties, and we'll get back to you with more information about our application process.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Contact our support team.
            </p>
            <p className="text-primary">support@soulseer.com</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;