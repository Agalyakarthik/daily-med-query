import QueryOfTheDay from "@/components/QueryOfTheDay";
import SubscriptionForm from "@/components/SubscriptionForm";
import DatasetDownload from "@/components/DatasetDownload";
import AboutProject from "@/components/AboutProject";
import { Stethoscope } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full mb-8 border border-slate-700">
            <Stethoscope className="h-5 w-5 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Healthcare Analysis HQ</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-none md:leading-none">
            Health care Analysis HQ (HAQ)
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Enhance your medical knowledge with our daily curated questions from real clinical datasets. 
            Subscribe to receive queries at 9 AM and answers at 8 PM.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Query of the Day (spans 8 columns) */}
          <div className="lg:col-span-8 order-1">
            <QueryOfTheDay />
          </div>

          {/* Right Column - Subscription & Dataset (spans 4 columns) */}
          <div className="lg:col-span-4 order-2 flex flex-col gap-6">
            <SubscriptionForm />
            <DatasetDownload />
          </div>
        </div>
      </main>

      {/* About This Project Section */}
      <AboutProject />
    </div>
  );
};

export default Index;
