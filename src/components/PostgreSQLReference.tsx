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
    <Card className="p-6 bg-card border border-border rounded-2xl">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">PostgreSQL Reference</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Access quick guides and resources for PostgreSQL syntax functions and optimization.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleSyntaxGuide}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium py-3 border-0 flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="h-4 w-4" />
            Download Syntax Guide
          </Button>
          
          <Button 
            onClick={handleOptimizationTips}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium py-3 border-0 flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="h-4 w-4" />
            Download Optimization Tips
          </Button>

          <Button 
            onClick={handleSetupGuide}
            variant="secondary"
            className="w-full py-3 flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Setup Guide
          </Button>

          <Button 
            onClick={handleCommunityDetails}
            variant="secondary"
            className="w-full py-3 flex items-center justify-center gap-2"
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