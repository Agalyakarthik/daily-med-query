import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { BASE_URL } from "@/config";

const SubscriptionForm = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const { toast } = useToast();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!email || !/\S+@\S+\.\S+/.test(email)) {
  //     toast({
  //       title: "Invalid email",
  //       description: "Please enter a valid email address",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   // TODO: Save to Supabase when connected
  //   console.log("Email subscription:", email);
    
  //   setIsSubscribed(true);
  //   toast({
  //     title: "Successfully subscribed! 🎉",
  //     description: "You'll receive daily medical insights in your inbox",
  //   });
    
  //   setEmail("");
  // };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    toast({
      title: "Invalid email",
      description: "Please enter a valid email address",
      variant: "destructive"
    });
    return;
  }

  try {
    //const response = await fetch("https://mite-kind-neatly.ngrok-free.app/webhook/subscribe", {
    const response = await fetch(`${BASE_URL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email ,zone:Intl.DateTimeFormat().resolvedOptions().timeZone }),
    });

    

    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    

    if(data.success=="true"){
    // ✅ Only mark subscribed if server accepted
    setIsSubscribed(true);
    toast({
      title: "Successfully subscribed! 🎉",
      description: "You'll receive daily medical insights in your inbox",
    });

    setEmail(""); // reset field
  }
  else {
    toast({
      title: data.message,
      description: "Try with different mail id!!",
      variant: "destructive",
    });
  }
  } catch (error) {
    console.error("Error submitting:", error);
    toast({
      title: "Submission failed ❌",
      description: "Please try again later.",
      variant: "destructive",
    });
  }
};

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) throw new Error("Failed to unsubscribe");

      const data = await response.json();

      if(data.success === "true"){
        toast({
          title: "Unsubscribed successfully",
          description: "You won't receive daily medical insights anymore",
        });
        setEmail("");
        setShowUnsubscribe(false);
      } else {
        toast({
          title: data.message || "Unsubscribe failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast({
        title: "Unsubscribe failed ❌",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isSubscribed) {
    return (
      <Card className="p-6 bg-slate-800 border border-slate-700 rounded-2xl">
        <div className="text-center space-y-4">
          <div className="text-4xl">✅</div>
          <h3 className="text-xl font-semibold text-white">
            Welcome to HAQ!
          </h3>
          <p className="text-slate-400">
            You're all set to receive daily medical insights. Check your inbox for confirmation!
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsSubscribed(false)}
            className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Subscribe Another Email
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-slate-800 border border-slate-700 rounded-2xl">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white">
              {showUnsubscribe ? "Unsubscribe" : "Daily Delivery"}
            </h3>
          </div>
          <p className="text-slate-400 text-sm">
            {showUnsubscribe 
              ? "Enter your email to stop receiving daily medical insights"
              : "Get the query at 9 AM and the answer at 8 PM delivered to your inbox!"
            }
          </p>
        </div>
        
        <form onSubmit={showUnsubscribe ? handleUnsubscribe : handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your.email@hospital.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3"
          >
            {showUnsubscribe ? "Unsubscribe" : "Start My Daily Learning"}
          </Button>
          
          <button
            type="button"
            onClick={() => setShowUnsubscribe(!showUnsubscribe)}
            className="w-full text-sm text-slate-400 hover:text-slate-300 underline transition-colors"
          >
            {showUnsubscribe ? "Back to Subscribe" : "Unsubscribe"}
          </button>
        </form>
      </div>
    </Card>
  );
};

export default SubscriptionForm;