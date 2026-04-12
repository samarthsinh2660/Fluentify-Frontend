import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, TrendingUp, AlertCircle, BarChart2, ArrowRight } from 'lucide-react';
import { useRecommendations } from '../../../../hooks/useRecommendations';

const URGENCY_STYLES = {
  high:   { bar: 'bg-red-500',    badge: 'bg-red-100 text-red-700',    label: 'High' },
  normal: { bar: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', label: 'Normal' },
  low:    { bar: 'bg-green-400',  badge: 'bg-green-100 text-green-700', label: 'Low' },
};

const TYPE_COLORS = {
  vocabulary:   'bg-blue-100 text-blue-700',
  grammar:      'bg-purple-100 text-purple-700',
  conversation: 'bg-teal-100 text-teal-700',
  review:       'bg-orange-100 text-orange-700',
};

const MasteryBar = ({ label, value }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="w-24 text-gray-600 shrink-0 capitalize">{label}</span>
    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full bg-green-500 transition-all duration-500"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
    <span className="w-8 text-right text-gray-700 font-medium">{Math.round(value * 100)}%</span>
  </div>
);

const RecommendationPanel = ({ courseId }) => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useRecommendations(courseId);

  const result = data?.data;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg mb-2" />
        ))}
      </div>
    );
  }

  if (isError || !result) return null;

  const { recommendations = [], masteryProfile, graphStats } = result;

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">A* Learning Path</h3>
        </div>
        <p className="text-sm text-gray-500">
          Complete a few lessons to unlock personalised recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">A* Learning Path</h3>
        </div>
        <button
          onClick={() => navigate(`/knowledge-map/${courseId}`)}
          className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 font-medium transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          View Map
        </button>
      </div>

      {/* Mastery snapshot */}
      {masteryProfile && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
          <p className="text-xs font-medium text-gray-500 mb-2">Mastery by type</p>
          {['vocabulary', 'grammar', 'conversation', 'review'].map(type => (
            <MasteryBar key={type} label={type} value={masteryProfile[type] ?? 0} />
          ))}
        </div>
      )}

      {/* Graph summary */}
      {graphStats && (
        <div className="flex gap-3 text-xs">
          <span className="text-gray-500">{graphStats.totalConcepts} concepts</span>
          <span className="text-green-600 font-medium">✓ {graphStats.masteredConcepts} mastered</span>
          <span className="text-red-500 font-medium">⚠ {graphStats.weakConcepts} weak</span>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500">Top priorities right now</p>
        {recommendations.map((rec) => {
          const urgency = URGENCY_STYLES[rec.urgency] ?? URGENCY_STYLES.normal;
          const typeColor = TYPE_COLORS[rec.conceptType] ?? 'bg-gray-100 text-gray-700';
          const canNavigate = rec.unitNumber != null && rec.lessonNumber != null;

          return (
            <div
              key={rec.conceptId}
              onClick={() => canNavigate && navigate(`/lesson/${courseId}/${rec.unitNumber}/${rec.lessonNumber}`)}
              className={`border border-gray-100 rounded-lg p-3 transition-colors ${canNavigate ? 'cursor-pointer hover:border-green-300 hover:bg-green-50 hover:shadow-sm' : 'hover:border-green-200 hover:bg-green-50'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-gray-900 text-sm truncate">
                      {rec.conceptLabel}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${typeColor}`}>
                      {rec.conceptType}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${urgency.badge}`}>
                      {rec.urgency === 'high' && <AlertCircle className="w-3 h-3 inline mr-0.5" />}
                      {urgency.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{rec.reason}</p>
                  {/* Mastery progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${urgency.bar} transition-all`}
                        style={{ width: `${Math.round(rec.masteryScore * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {Math.round(rec.masteryScore * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs text-gray-500">{rec.estimatedMasteryTime}m</span>
                  </div>
                  {canNavigate && (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-600">
                      Go <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total estimated time */}
      {result.totalEstimatedTime > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1 border-t border-gray-100">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>
            Full path: {result.totalPathLength} concepts · ~{Math.round(result.totalEstimatedTime / 60)}h total
          </span>
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;
