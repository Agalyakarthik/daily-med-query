import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const PostgreSQLEditor = () => {
  const [query, setQuery] = useState(`SELECT id, name, salary
FROM employees
WHERE salary > 50000;`);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a SQL query before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Show warning about API limitations
    toast({
      title: "⚠️ API Limitation Notice",
      description: "Evaluation results may not always be consistent because the free-tier Gemini API has token limits and may generate hallucinations.",
      className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 [&_*]:text-white",
      duration: 10000, // 10 seconds
    });

    // Show query submitted confirmation
    setTimeout(() => {
      toast({
        title: "Query Submitted",
        description: "Your PostgreSQL query has been submitted for evaluation.",
        className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 [&_*]:text-white",
        duration: 8000, // 8 seconds
      });
    }, 500);
  };

  const handleClear = () => {
    setQuery('');
    toast({
      title: "Editor Cleared",
      description: "The query editor has been cleared.",
      className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">
          Write Your PostgreSQL Query
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <CodeMirror
            value={query}
            onChange={(value) => setQuery(value)}
            extensions={[sql()]}
            theme={oneDark}
            placeholder="-- Write your query here"
            className="text-sm"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
            }}
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Submit & Evaluate
          </Button>
          <Button 
            onClick={handleClear}
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
          >
            Clear Editor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostgreSQLEditor;