import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { BASE_URL } from '@/config';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type ButtonState = 'default' | 'loading' | 'completed' | 'disabled';

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MCQ {
  question: string;
  options: MCQOption[];
  explanation: string;
}

interface MCQResponse {
  mcqs: MCQ[];
}

interface PostgreSQLEditorProps {
  question?: string;
}

const PostgreSQLEditor = ({ question = "Default medical query" }: PostgreSQLEditorProps) => {
  const [query, setQuery] = useState('');
  const [buttonState, setButtonState] = useState<ButtonState>('default');
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showMcqs, setShowMcqs] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState(false);
  const { toast } = useToast();

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Solution",
        description: "Please write your SQL solution before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (buttonState === 'disabled') {
      return;
    }

    setButtonState('loading');

    try {
      const response = await fetch(`${BASE_URL}/generate-mcqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: question, 
          userSolution: query 
        }),
      });

      if (!response.ok) throw new Error('Failed to generate MCQs');

      const data: MCQResponse = await response.json();
      setMcqs(data.mcqs);
      setShowMcqs(true);
      setButtonState('completed');
      
      toast({
        title: "MCQs Generated! ✨",
        description: "Answer the questions below to test your understanding.",
      });
    } catch (error) {
      console.error('Error generating MCQs:', error);
      toast({
        title: "Error",
        description: "Failed to generate MCQs. Please try again.",
        variant: "destructive",
      });
      setButtonState('default');
    }
  };

  const handleMCQSubmit = () => {
    if (Object.keys(userAnswers).length !== mcqs.length) {
      toast({
        title: "Incomplete",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmittedAnswers(true);
    
    const correctCount = mcqs.reduce((count, mcq, index) => {
      const selectedOption = mcq.options.find(opt => opt.id === userAnswers[index]);
      return selectedOption?.isCorrect ? count + 1 : count;
    }, 0);

    const encouragingMessages = [
      "Excellent! Well done! 🎉",
      "Perfect! You got it right! ✨",
      "Amazing work! Keep it up! 🌟",
      "Brilliant! You're on fire! 🔥"
    ];

    const supportiveMessages = [
      "Good try! Keep learning! 💪",
      "Nice effort! Practice makes perfect! 📚",
      "Keep going! You're improving! 🌱",
      "Great attempt! Don't give up! 💫"
    ];

    mcqs.forEach((mcq, index) => {
      const selectedOption = mcq.options.find(opt => opt.id === userAnswers[index]);
      const isCorrect = selectedOption?.isCorrect;
      
      const message = isCorrect 
        ? encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
        : supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)];

      setTimeout(() => {
        toast({
          title: `Question ${index + 1}`,
          description: message,
          className: isCorrect 
            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 [&_*]:text-white"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 [&_*]:text-white",
        });
      }, index * 500);
    });

    setButtonState('disabled');
  };

  const handleClear = () => {
    if (buttonState === 'loading') {
      return;
    }
    
    setQuery('');
    setButtonState('default');
    setMcqs([]);
    setUserAnswers({});
    setShowMcqs(false);
    setSubmittedAnswers(false);
    
    toast({
      title: "Editor Cleared",
      description: "The query editor has been cleared.",
    });
  };

  const getButtonContent = () => {
    switch (buttonState) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating MCQs...
          </>
        );
      case 'completed':
        return (
          <>
            <CheckCircle className="h-4 w-4" />
            Submitted!
          </>
        );
      case 'disabled':
        return 'Submitted';
      default:
        return 'Submit';
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
          {!showMcqs ? (
            <>
              <Button 
                onClick={handleSubmit}
                disabled={buttonState === 'loading' || buttonState === 'completed' || buttonState === 'disabled'}
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
            </>
          ) : null}
        </div>

        {showMcqs && mcqs.length > 0 && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold">Test Your Understanding</h3>
            </div>

            {mcqs.map((mcq, mcqIndex) => (
              <Card key={mcqIndex} className="bg-slate-700/50 border-slate-600">
                <CardContent className="pt-6 space-y-4">
                  <p className="text-white font-medium">
                    {mcqIndex + 1}. {mcq.question}
                  </p>

                  <RadioGroup
                    value={userAnswers[mcqIndex]}
                    onValueChange={(value) => {
                      if (!submittedAnswers) {
                        setUserAnswers(prev => ({ ...prev, [mcqIndex]: value }));
                      }
                    }}
                    disabled={submittedAnswers}
                  >
                    {mcq.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.id} 
                          id={`mcq-${mcqIndex}-${option.id}`}
                          disabled={submittedAnswers}
                        />
                        <Label
                          htmlFor={`mcq-${mcqIndex}-${option.id}`}
                          className={`text-slate-300 cursor-pointer ${submittedAnswers ? 'cursor-not-allowed' : ''}`}
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            {!submittedAnswers && (
              <Button
                onClick={handleMCQSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
              >
                <Heart className="h-4 w-4 mr-2" />
                Submit Answers
              </Button>
            )}

            {submittedAnswers && (
              <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="text-slate-300 text-sm">
                  ✨ Correct answers and explanations will be revealed at 8 PM
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostgreSQLEditor;