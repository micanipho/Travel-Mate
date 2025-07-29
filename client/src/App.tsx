import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginPage from "@/pages/LoginPage";
import LogoutPage from "@/pages/LogoutPage";
import SignUpPage from "@/pages/SignUpPage";
import UserProfile from "@/pages/UserProfile";



function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/profile" component={UserProfile} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      {/* <TooltipProvider> */}
      <Toaster />
      <Router />
      {/* </TooltipProvider> */}
    </>
  );
}

export default App;