// ─── Intake Request ────────────────────────────────────────────────────────

export type SensitivityLevel = 'public' | 'internal' | 'confidential' | 'restricted' | '';

export type RequestStatus =
  | 'submitted'
  | 'under_review'
  | 'sent_to_jira'
  | 'approved'
  | 'declined';

export interface IntakeRequest {
  id: number;
  name: string;
  contact_email: string;
  department: string;
  project_title: string;
  business_problem: string;
  desired_outcome: string;
  systems_involved: string;
  sensitivity_level: SensitivityLevel;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export type IntakeRequestListItem = Pick<
  IntakeRequest,
  'id' | 'name' | 'department' | 'project_title' | 'sensitivity_level' | 'status' | 'created_at'
>;

// ─── Form Data ──────────────────────────────────────────────────────────────

export interface IntakeFormData {
  name: string;
  contact_email: string;
  department: string;
  project_title: string;
  business_problem: string;
  desired_outcome: string;
  systems_involved?: string;
  sensitivity_level?: SensitivityLevel;
}

// ─── AI Review ──────────────────────────────────────────────────────────────

export type SuggestionType = 'missing' | 'improve' | 'optional' | 'ready' | 'info';

export interface Suggestion {
  type: SuggestionType;
  field: string | null;
  text: string;
}

export interface ReviewResponse {
  suggestions: Suggestion[];
  encouragement: string;
}

// ─── API ────────────────────────────────────────────────────────────────────

export interface ApiError {
  [field: string]: string[];
}
