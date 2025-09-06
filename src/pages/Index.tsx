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
            <span className="text-blue-200 text-sm font-medium">Daily Med Query</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Medical Knowledge
            <br />
            Daily Challenge
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Elevate your clinical expertise with carefully curated daily medical queries
            sourced from real-world datasets. Join thousands of healthcare professionals
            enhancing their diagnostic skills.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Query of the Day (spans 2 columns) */}
          <div className="lg:col-span-2">
            <QueryOfTheDay />
          </div>

          {/* Right Column - Subscription & Dataset (spans 1 column) */}
          <div className="space-y-6">
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
