import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import { getUserRole } from "@/lib/db-service";
import { ProtectedRoute } from "@/components/auth/route-components";

const DashboardPage = () => {
  const { data: session } = fine.auth.useSession();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function checkUserRole() {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        
        // Check user role
        let userRole;
        
        // Special case for our predefined users
        if (session.user.email === 'emilynnj14@gmail.com') {
          userRole = 'admin';
        } else if (session.user.email === 'emilynn992@gmail.com') {
          userRole = 'reader';
        } else if (session.user.email === 'emily81292@gmail.com') {
          userRole = 'client';
        } else {
          // For other users, check the database
          userRole = await getUserRole(session.user.id);
        }
        
        // Redirect based on role
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'reader') {
          navigate('/reader/dashboard');
        } else {
          navigate('/client/dashboard');
        }
        
      } catch (error) {
        console.error("Error checking user role:", error);
        toast({
          title: "Error",
          description: "Failed to load your dashboard. Please try again.",
          variant: "destructive",
        });
        // Default to client dashboard on error
        navigate('/client/dashboard');
      } finally {
        setLoading(false);
      }
    }
    
    checkUserRole();
  }, [session, toast, navigate]);

  if (loading) {
    return (
      <div className="app-background min-h-screen flex flex-col items-center justify-center">
        <div className="glass-effect p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-white mb-2">Loading Dashboard</h1>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  return null; // This component will redirect, so no need to render anything
};

const Dashboard = () => <ProtectedRoute Component={DashboardPage} />;

export default Dashboard;