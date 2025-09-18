import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Clock, CheckCircle, Brain, Loader2, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "@/config";
import PostgreSQLEditor from "@/components/PostgreSQLEditor";

const QueryOfTheDay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [editorVisible, setEditorVisible] = useState(true);
  const { toast } = useToast();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  // Example data - in a real app this would come from your backend
  // const todaysQuery = {
  //   question: "A 65-year-old patient presents with chest pain and elevated troponin levels. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most likely location of the myocardial infarction?",
  //   answer: "Inferior wall myocardial infarction. The ST-elevation in leads II, III, and aVF indicates inferior wall involvement, typically caused by occlusion of the right coronary artery (RCA) or left circumflex artery (LCX)."
  // };
  
  useEffect(() => {
  const fetchQuestion = async () => {
    const localTime = new Date().toISOString();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    //const res = await fetch('https://mite-kind-neatly.ngrok-free.app/webhook/getQuestion', {
    const res = await fetch(`${BASE_URL}/getQuestion`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ localTime: localTime,zone: timezone })
    });
    
    const data = await res.json();
    
    setQuestion(data.question);
    setAnswer(data.correct_answer);
  };
  fetchQuestion();
}, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for countdown

    // Simulate loading and then show content with animation
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setContentVisible(true), 100);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(loadingTimer);
    };
  }, []);

  const currentHour = currentTime.getHours();
  const showAnswer = currentHour >= 20; // 8 PM or later
  const showQuery = currentHour >= 9; // 9 AM or later

  // Calculate time until 8 PM
  const getTimeUntil8PM = () => {
    const now = new Date();
    const today8PM = new Date();
    today8PM.setHours(20, 0, 0, 0);
    
    // If it's already past 8 PM, get tomorrow's 8 PM
    if (now >= today8PM) {
      today8PM.setDate(today8PM.getDate() + 1);
    }
    
    const timeDiff = today8PM.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, isTime: timeDiff <= 0 };
  };

  const timeUntil8PM = getTimeUntil8PM();

  // Show toast when answer is revealed and handle editor transition
  useEffect(() => {
    if (showAnswer && !answerRevealed && !isLoading) {
      setAnswerRevealed(true);
      
      // Fade out editor first
      setEditorVisible(false);
      
      // Show toast after a delay
      setTimeout(() => {
        const timeString = currentTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        
        toast({
          title: "✓ Answer Revealed",
          description: timeString,
          className: "bg-gradient-to-r from-blue-500 to-purple-500 border-none text-white [&_*]:text-white",
          duration: 5000,
        });
      }, 500);
    }
  }, [showAnswer, answerRevealed, isLoading, currentTime, toast]);
  
  
  if (isLoading) {
    return (
      <Card 
        className="p-0 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center"
        role="status"
        aria-label="Loading today's medical query"
      >
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Brain className="h-8 w-8 text-blue-400 animate-pulse" />
            </div>
            <Loader2 className="h-6 w-6 text-blue-400 animate-spin absolute -top-1 -right-1" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-blue-500 rounded-full w-48 mx-auto animate-pulse"></div>
            <p className="text-slate-400">Loading today's challenge...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="p-0 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden h-full"
      role="main"
      aria-labelledby="query-title"
    >
      {/* Progress Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl"></div>
      
      {/* Header Section */}
      <header className="p-6 sm:p-8">
        <h1 
          id="query-title"
          className="text-2xl font-bold text-white mb-2"
        >
          Today's Medical Query
        </h1>
      </header>
      
      {/* Main Content */}
      <main className="p-6 sm:p-8 space-y-6">
        {showQuery ? (
          <div className={`space-y-6 transition-all duration-500 ${contentVisible ? 'animate-fade-in opacity-100' : 'opacity-0'}`}>
            {/* Loading State or Question */}
            {!showAnswer && (
              <div className="flex items-center gap-3 text-slate-400 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Loading your daily medical challenge...</span>
              </div>
            )}
            
            {/* Question Section */}
            <section 
              className="space-y-4"
              role="article"
              aria-labelledby="question-heading"
            >
              <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-xl">
                <p className="text-base text-slate-200 leading-relaxed">
                  {question}
                </p>
              </div>
            </section>
            
            {/* Answer Section */}
            <section 
              role="article"
              aria-labelledby="answer-heading"
              className="space-y-6"
            >
              <h3 
                id="answer-heading"
                className="text-lg font-semibold text-white mb-6 flex items-center gap-2"
              >
                {showAnswer ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Clock className="h-5 w-5 text-slate-400 animate-pulse" />
                )}
                Expert Analysis & Answer
              </h3>
              
              {/* Answer/Placeholder Content */}
              <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-xl min-h-[120px] flex items-center">
                {showAnswer ? (
                  <p className="text-slate-200 leading-relaxed animate-fade-in">
                    {answer}
                  </p>
                ) : (
                  <p className="text-slate-400">
                    The detailed answer and clinical explanation will be revealed here at 8:00 PM daily.
                  </p>
                )}
              </div>
              
              {/* Countdown Timer - only show when answer not revealed */}
              {!showAnswer && !timeUntil8PM.isTime && (
                <div className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 border border-slate-500/50 p-5 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Timer className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium">Time until answer reveal:</span>
                  </div>
                  <div className="flex gap-6 justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {timeUntil8PM.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {timeUntil8PM.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {timeUntil8PM.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Seconds</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* PostgreSQL Editor - only show when answer not revealed */}
              {!showAnswer && (
                <div className={`transition-all duration-500 ${editorVisible ? 'opacity-100 animate-fade-in' : 'opacity-0 animate-fade-out'}`}>
                  {editorVisible && <PostgreSQLEditor />}
                </div>
              )}
            </section>
          </div>
        ) : (
          <section 
            className="text-center py-12 animate-fade-in"
            role="status"
            aria-live="polite"
          >
            <div className="relative inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-2xl mb-6">
              <Clock className="h-8 w-8 text-slate-400" aria-hidden="true" />
              <div className="absolute inset-0 bg-slate-600/20 rounded-2xl animate-pulse"></div>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              Preparing Today's Challenge
            </h2>
            <p className="text-slate-400 text-base mb-2 max-w-md mx-auto">
              Daily medical queries are available from 9:00 AM to 11:59 PM
            </p>
            <p className="text-sm text-slate-500">
              Return at 9:00 AM for your next clinical challenge
            </p>
          </section>
        )}
      </main>
    </Card>
  );
};

export default QueryOfTheDay;