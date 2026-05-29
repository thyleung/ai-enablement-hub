import type { ReviewResponse } from '@/types';

interface GuidancePanelProps {
  review: ReviewResponse;
}

export default function GuidancePanel({ review }: GuidancePanelProps) {
  const actionable = review.suggestions
    .filter((s) => s.type !== 'ready' && s.type !== 'info')
    .slice(0, 3);

  if (actionable.length === 0) return null;

  return (
    <div style={{
      margin: '16px 32px 32px',
      padding: '16px 20px',
      background: '#ffffff',
      border: '1px solid #e2e2de',
      borderLeft: '3px solid #b01c2e',
      borderRadius: '5px',
    }}>
      <p style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: '#5a5a56',
        marginBottom: '10px',
      }}>
        Suggestions
      </p>
      <ul style={{ listStyle: 'disc', paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {actionable.map((s, i) => (
          <li key={i} style={{ fontSize: '0.875rem', color: '#3a3a38', lineHeight: '1.55' }}>
            {s.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
