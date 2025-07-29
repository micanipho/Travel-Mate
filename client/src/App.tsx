import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginPage from "@/pages/LoginPage";
import LogoutPage from "@/pages/LogoutPage";
import SignUpPage from "@/pages/SignUpPage";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";



function Router() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow overflow-auto">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignUpPage} />
            <Route path="/logout" component={LogoutPage} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/profile" component={ProfilePage} />
          </Switch>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;