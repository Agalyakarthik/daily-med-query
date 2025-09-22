import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import SQLEvaluationModal from './SQLEvaluationModal';

type ButtonState = 'default' | 'loading' | 'completed' | 'disabled';

interface EvaluationResult {
  score: number;
  level: 'perfect' | 'nearly' | 'good' | 'keep-going';
  title: string;
  message: string;
  checklist: Array<{
    requirement: string;
    met: boolean;
    hint?: string;
  }>;
}

const PostgreSQLEditor = () => {
  const [query, setQuery] = useState(`SELECT id, name, salary
FROM employees
WHERE salary > 50000;`);
  const [warningToast, setWarningToast] = useState<any>(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [buttonState, setButtonState] = useState<ButtonState>('default');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const { toast } = useToast();

  // Mock SQL parser to evaluate query
  const evaluateQuery = (sqlQuery: string): EvaluationResult => {
    const upperQuery = sqlQuery.toUpperCase().trim();
    const checklist = [
      {
        requirement: "Uses SELECT statement",
        met: upperQuery.includes('SELECT'),
        hint: "Start your query with SELECT to retrieve data"
      },
      {
        requirement: "Includes FROM clause",
        met: upperQuery.includes('FROM'),
        hint: "Specify which table to query using FROM tablename"
      },
      {
        requirement: "Has WHERE condition",
        met: upperQuery.includes('WHERE'),
        hint: "Add WHERE clause to filter results based on conditions"
      },
      {
        requirement: "Uses AVG() function",
        met: upperQuery.includes('AVG('),
        hint: "Try using AVG(column_name) to calculate average values"
      },
      {
        requirement: "Includes column aliases",
        met: upperQuery.includes(' AS ') || /\w+\s+\w+(?:\s|$)/.test(upperQuery),
        hint: "Use AS keyword or spaces to give columns readable names"
      }
    ];

    const metCount = checklist.filter(item => item.met).length;
    const score = (metCount / checklist.length) * 100;

    let level: EvaluationResult['level'];
    let title: string;
    let message: string;

    if (score === 100) {
      level = 'perfect';
      title = 'Perfect Solution';
      message = 'Outstanding work! Your query meets all requirements and demonstrates excellent SQL skills.';
    } else if (score >= 80) {
      level = 'nearly';
      title = 'Nearly There';
      message = 'Great progress! Just a few small adjustments and your query will be perfect.';
    } else if (score >= 60) {
      level = 'good';
      title = 'Good Start';
      message = 'You\'re on the right track! Keep building on this foundation.';
    } else {
      level = 'keep-going';
      title = 'Keep Going';
      message = 'Don\'t give up! Review the requirements and try again. You\'ve got this!';
    }

    return { score, level, title, message, checklist };
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    
    // Reset button state when query changes (if not already submitted)
    if (buttonState === 'completed' || buttonState === 'disabled') {
      // Don't reset if already submitted
      return;
    }
    
    // Show warning toast when user starts typing for the first time
    if (!hasStartedTyping && value.trim() !== '' && !warningToast) {
      setHasStartedTyping(true);
      const newWarningToast = toast({
        title: "⚠️ API Limitation Notice",
        description: "Evaluation results may not always be consistent because the free-tier Gemini API has token limits and may generate hallucinations.",
        className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 [&_*]:text-white",
        duration: Infinity, // Persist until manually dismissed
      });
      setWarningToast(newWarningToast);
    }
  };

  const handleSubmit = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a SQL query before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (buttonState === 'disabled') {
      return; // Prevent multiple submissions
    }

    // Dismiss the warning toast if it exists
    if (warningToast) {
      warningToast.dismiss();
      setWarningToast(null);
    }

    // Set loading state
    setButtonState('loading');

    // Simulate server processing with 1.5 second delay
    setTimeout(() => {
      const result = evaluateQuery(query);
      setEvaluationResult(result);
      setButtonState('completed');
      setShowResultModal(true);
      
      // After showing completion, disable the button permanently
      setTimeout(() => {
        setButtonState('disabled');
      }, 2000);
    }, 1500);
  };

  const handleClear = () => {
    if (buttonState === 'loading') {
      return; // Don't allow clearing while evaluating
    }
    
    setQuery('');
    setButtonState('default');
    setEvaluationResult(null);
    toast({
      title: "Editor Cleared",
      description: "The query editor has been cleared.",
      className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0",
    });
  };

  const getButtonContent = () => {
    switch (buttonState) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Evaluating...
          </>
        );
      case 'completed':
        return (
          <>
            <CheckCircle className="h-4 w-4" />
            Evaluated!
          </>
        );
      case 'disabled':
        return 'Submitted';
      default:
        return 'Submit & Evaluate';
    }
  };

  const getButtonClassName = () => {
    switch (buttonState) {
      case 'loading':
        return "bg-amber-600 hover:bg-amber-600 text-white font-medium cursor-not-allowed";
      case 'completed':
        return "bg-emerald-600 hover:bg-emerald-600 text-white font-medium cursor-not-allowed";
      case 'disabled':
        return "bg-slate-600 hover:bg-slate-600 text-slate-400 font-medium cursor-not-allowed";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white font-medium";
    }
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
            onChange={handleQueryChange}
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
            disabled={buttonState === 'loading' || buttonState === 'disabled'}
            className={getButtonClassName()}
          >
            {getButtonContent()}
          </Button>
          <Button 
            onClick={handleClear}
            disabled={buttonState === 'loading'}
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Editor
          </Button>
        </div>
      </CardContent>
      
      <SQLEvaluationModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={evaluationResult}
      />
    </Card>
  );
};

export default PostgreSQLEditor;