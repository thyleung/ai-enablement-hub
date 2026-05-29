import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import { Badge, Button, LoadingSpinner } from '@/components/ui';
import { fetchIntakeRequests } from '@/lib/api';
import type { IntakeRequestListItem, RequestStatus } from '@/types';

interface JiraState {
  status: 'idle' | 'loading' | 'done';
  ticketKey?: string;
}

function generateJiraKey(): string {
  return `AIEN-${Math.floor(1000 + Math.random() * 9000)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReviewPage() {
  const [requests, setRequests] = useState<IntakeRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [jiraStates, setJiraStates] = useState<Record<number, JiraState>>({});

  useEffect(() => {
    fetchIntakeRequests()
      .then(setRequests)
      .catch(() => setError('Could not load requests. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  function toggleRow(id: number) {
    setExpandedRow((prev) => (prev === id ? null : id));
  }

  async function handleCreateJira(id: number) {
    setJiraStates((prev) => ({ ...prev, [id]: { status: 'loading' } }));
    await new Promise((r) => setTimeout(r, 1200));
    const key = generateJiraKey();
    setJiraStates((prev) => ({ ...prev, [id]: { status: 'done', ticketKey: key } }));
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'sent_to_jira' as RequestStatus } : r))
    );
  }

  return (
    <>
      <Head><title>Review Queue - AI Enablement Hub</title></Head>
      <div className="page-wrapper">
        <Header />
        <main className="main-content">
          <div className="wide-container">
            <div className="page-header">
              <h1>Review Queue</h1>
              <p>Submitted intake requests from across the organization. Click a row to expand details.</p>
            </div>

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '40px 0' }}>
                <LoadingSpinner />
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9375rem' }}>Loading requests...</span>
              </div>
            )}

            {error && (
              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderLeft: '3px solid var(--accent)', borderRadius: 'var(--radius-md)', padding: '16px 20px', fontSize: '0.9375rem', color: 'var(--text-secondary)' }} role="alert">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="table-container">
                {requests.length === 0 ? (
                  <div className="empty-state"><p>No requests submitted yet.</p></div>
                ) : (
                  <table className="data-table" aria-label="Intake request queue">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '32px' }}></th>
                        <th scope="col">Project</th>
                        <th scope="col">Department</th>
                        <th scope="col">Sensitivity</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => {
                        const isExpanded = expandedRow === req.id;
                        const jira = jiraStates[req.id];
                        return (
                          <>
                            <tr
                              key={req.id}
                              style={{ cursor: 'pointer' }}
                              onClick={() => toggleRow(req.id)}
                              aria-expanded={isExpanded}
                            >
                              <td style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', userSelect: 'none' }}>
                                {isExpanded ? '▼' : '▶'}
                              </td>
                              <td>
                                <div className="table-project-title">{req.project_title}</div>
                                <div className="table-submitter">{req.name} &middot; {req.contact_email}</div>
                              </td>
                              <td>{req.department}</td>
                              <td><Badge value={req.sensitivity_level ?? ''} type="sensitivity" /></td>
                              <td><Badge value={req.status} type="status" /></td>
                              <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatDate(req.created_at)}</td>
                              <td onClick={(e) => e.stopPropagation()}>
                                <JiraAction
                                  requestId={req.id}
                                  jiraState={jira}
                                  alreadySent={req.status === 'sent_to_jira'}
                                  onCreateJira={handleCreateJira}
                                />
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr key={`${req.id}-detail`} style={{ background: '#fafafa', borderTop: '1px solid #e5e5e5' }}>                                <td></td>
                                <td colSpan={6} style={{ padding: '0' }}>
                                  <div style={{ padding: '20px 24px 24px', display: 'grid', gap: '20px' }}>
                                    <DetailField
                                      label="Problem Statement"
                                      value={req.business_problem}
                                    />
                                    <DetailField
                                      label="Desired Outcome"
                                      value={req.desired_outcome}
                                    />
                                    {req.systems_involved && (
                                      <DetailField
                                        label="Systems / Data Involved"
                                        value={req.systems_involved}
                                      />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
        {value}
      </div>
    </div>
  );
}

function JiraAction({ requestId, jiraState, alreadySent, onCreateJira }: {
  requestId: number;
  jiraState: JiraState | undefined;
  alreadySent: boolean;
  onCreateJira: (id: number) => void;
}) {
  if (jiraState?.status === 'done' || (alreadySent && !jiraState)) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--status-jira-text)', background: 'var(--status-jira-bg)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
        {jiraState?.ticketKey ? `✓ ${jiraState.ticketKey}` : '✓ Sent to Jira'}
      </span>
    );
  }

  if (jiraState?.status === 'loading') {
    return <Button variant="secondary" size="sm" disabled loading>Creating...</Button>;
  }

  return (
    <Button variant="secondary" size="sm" onClick={() => onCreateJira(requestId)}>
      Create Jira Ticket
    </Button>
  );
}
