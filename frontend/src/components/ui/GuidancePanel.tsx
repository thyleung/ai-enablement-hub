import type { ReviewResponse, Suggestion } from '@/types';

interface GuidancePanelProps {
  review: ReviewResponse;
}

export default function GuidancePanel({ review }: GuidancePanelProps) {
  return (
    <div className="guidance-panel" role="region" aria-label="Request review suggestions">
      <p className="guidance-panel-title">Suggestions to strengthen your request</p>

      {review.encouragement && (
        <p className="guidance-encouragement">{review.encouragement}</p>
      )}

      {review.suggestions.length > 0 && (
        <ul className="guidance-suggestions" aria-label="Suggestions">
          {review.suggestions.map((suggestion, i) => (
            <SuggestionItem key={i} suggestion={suggestion} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SuggestionItem({ suggestion }: { suggestion: Suggestion }) {
  const dotClass = `suggestion-dot${suggestion.type === 'ready' ? ' ready' : ''}`;
  return (
    <li className="guidance-suggestion">
      <span className={dotClass} aria-hidden="true" />
      <span>{suggestion.text}</span>
    </li>
  );
}
