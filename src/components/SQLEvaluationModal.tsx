import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Target, Trophy, ThumbsUp, Zap } from 'lucide-react';

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

interface SQLEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EvaluationResult | null;
}

const levelConfig = {
  perfect: {
    icon: Trophy,
    gradient: 'from-emerald-500 to-green-600',
    emoji: '🎉'
  },
  nearly: {
    icon: Target,
    gradient: 'from-blue-500 to-indigo-600',
    emoji: '🎯'
  },
  good: {
    icon: ThumbsUp,
    gradient: 'from-amber-500 to-orange-600',
    emoji: '👍'
  },
  'keep-going': {
    icon: Zap,
    gradient: 'from-purple-500 to-pink-600',
    emoji: '💪'
  }
};

const SQLEvaluationModal: React.FC<SQLEvaluationModalProps> = ({ isOpen, onClose, result }) => {
  if (!result) return null;

  const config = levelConfig[result.level];
  const LevelIcon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <div className={`w-full h-20 bg-gradient-to-r ${config.gradient} rounded-t-lg -mx-6 -mt-6 mb-6 flex items-center justify-center`}>
            <div className="flex items-center gap-4">
              <LevelIcon className="h-8 w-8 text-white" />
              <DialogTitle className="text-2xl font-bold text-white">
                {config.emoji} {result.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-slate-300 text-center text-lg">
            {result.message}
          </p>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-400" />
              Requirements Checklist
            </h3>
            
            <div className="space-y-3">
              {result.checklist.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    item.met ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-700/50 border border-slate-600/50'
                  }`}
                >
                  {item.met ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="space-y-1">
                    <p className={`font-medium ${item.met ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {item.requirement}
                    </p>
                    {!item.met && item.hint && (
                      <p className="text-sm text-slate-400 italic">
                        💡 {item.hint}
                    </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SQLEvaluationModal;