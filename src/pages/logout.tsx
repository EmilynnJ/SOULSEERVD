import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Logout() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function handleLogout() {
      try {
        await fine.auth.signOut();
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } catch (error) {
        console.error("Error signing out:", error);
        toast({
          title: "Error",
          description: "There was a problem signing out. Please try again.",
          variant: "destructive",
        });
      } finally {
        navigate("/");
      }
    }

    handleLogout();
  }, [navigate, toast]);

  return (
    <div className="app-background min-h-screen flex flex-col items-center justify-center">
      <div className="glass-effect p-8 rounded-lg text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-white mb-2">Signing Out</h1>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
}