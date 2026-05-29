import type {
  IntakeFormData,
  IntakeRequest,
  IntakeRequestListItem,
  ReviewResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw body;
  }
  return res.json() as Promise<T>;
}

export async function submitIntakeRequest(data: IntakeFormData): Promise<IntakeRequest> {
  const res = await fetch(`${API_URL}/api/requests/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<IntakeRequest>(res);
}

export async function fetchIntakeRequests(): Promise<IntakeRequestListItem[]> {
  const res = await fetch(`${API_URL}/api/requests/`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<IntakeRequestListItem[]>(res);
}

export async function reviewRequest(data: Partial<IntakeFormData>): Promise<ReviewResponse> {
  const res = await fetch(`${API_URL}/api/review-request/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ReviewResponse>(res);
}
