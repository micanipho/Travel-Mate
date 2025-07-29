import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
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