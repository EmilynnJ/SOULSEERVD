import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import "./index.css";

// Pages
import Index from "./pages";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import Logout from "./pages/logout";
import Readers from "./pages/readers";
import ReaderProfile from "./pages/readers/[id]";
import ChatReading from "./pages/readings/chat";
import VideoReading from "./pages/readings/video";
import PhoneReading from "./pages/readings/call";
import ScheduleReading from "./pages/readings/schedule";
import LiveStreams from "./pages/live-streams";
import LiveStreamView from "./pages/live-streams/[id]";
import Shop from "./pages/shop";
import ProductDetail from "./pages/shop/product/[id]";
import Cart from "./pages/shop/cart";
import OrderConfirmation from "./pages/shop/order/[id]";
import Community from "./pages/community";
import Contact from "./pages/contact";
import Messages from "./pages/messages";
import Dashboard from "./pages/dashboard";
import ClientDashboard from "./pages/client/dashboard";
import ReaderDashboard from "./pages/reader/dashboard";
import AdminDashboard from "./pages/admin/dashboard";
import Help from "./pages/help";
import Profile from "./pages/profile";
import Policies from "./pages/policies";
import Apply from "./pages/apply";
import About from "./pages/about";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/signup' element={<SignupForm />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/readers' element={<Readers />} />
            <Route path='/readers/:id' element={<ReaderProfile />} />
            <Route path='/readings/chat' element={<ChatReading />} />
            <Route path='/readings/chat/:readerId' element={<ChatReading />} />
            <Route path='/readings/video' element={<VideoReading />} />
            <Route path='/readings/video/:readerId' element={<VideoReading />} />
            <Route path='/readings/call' element={<PhoneReading />} />
            <Route path='/readings/call/:readerId' element={<PhoneReading />} />
            <Route path='/readings/schedule' element={<ScheduleReading />} />
            <Route path='/readings/schedule/:readerId' element={<ScheduleReading />} />
            <Route path='/live-streams' element={<LiveStreams />} />
            <Route path='/live-streams/:id' element={<LiveStreamView />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/shop/product/:id' element={<ProductDetail />} />
            <Route path='/shop/cart' element={<Cart />} />
            <Route path='/shop/order/:id' element={<OrderConfirmation />} />
            <Route path='/community' element={<Community />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/client/dashboard' element={<ClientDashboard />} />
            <Route path='/reader/dashboard' element={<ReaderDashboard />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/help' element={<Help />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/policies' element={<Policies />} />
            <Route path='/apply' element={<Apply />} />
            <Route path='/about' element={<About />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);