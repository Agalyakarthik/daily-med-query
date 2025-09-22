import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database, Users, BookOpen } from "lucide-react";

const PostgreSQLReference = () => {
  const handleSyntaxGuide = () => {
    // In a real app, this would trigger the actual download
    window.open("https://www.postgresql.org/docs/current/sql.html", "_blank");
  };

  const handleOptimizationTips = () => {
    window.open("https://www.postgresql.org/docs/current/performance-tips.html", "_blank");
  };

  const handleSetupGuide = () => {
    window.open("https://www.postgresql.org/docs/current/tutorial-install.html", "_blank");
  };

  const handleCommunityDetails = () => {
    window.open("https://www.postgresql.org/community/", "_blank");
  };

  return (
    <Card className="p-6 bg-slate-800 border border-slate-700 rounded-2xl">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white">PostgreSQL Reference</h3>
          </div>
          <p className="text-slate-400 text-sm">
            Access quick guides and resources for PostgreSQL syntax functions and optimization.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleSyntaxGuide}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 border-0 flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="h-4 w-4" />
            Download Syntax Guide
          </Button>
          
          <Button 
            onClick={handleOptimizationTips}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 border-0 flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="h-4 w-4" />
            Download Optimization Tips
          </Button>

          <Button 
            onClick={handleSetupGuide}
            className="w-full py-3 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white"
          >
            <BookOpen className="h-4 w-4" />
            Setup Guide
          </Button>

          <Button 
            onClick={handleCommunityDetails}
            className="w-full py-3 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white"
          >
            <Users className="h-4 w-4" />
            Community Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PostgreSQLReference;