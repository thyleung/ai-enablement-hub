import { useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import Header from '@/components/layout/Header';
import { Button, Input, TextArea, Select } from '@/components/ui';
import GuidancePanel from '@/components/ui/GuidancePanel';
import { submitIntakeRequest, reviewRequest } from '@/lib/api';
import type { IntakeFormData, ReviewResponse } from '@/types';

const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'data', label: 'Data & Analytics' },
  { value: 'operations', label: 'Operations' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'legal', label: 'Legal & Compliance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'it', label: 'IT & Infrastructure' },
  { value: 'other', label: 'Other' },
];

const SENSITIVITY_OPTIONS = [
  { value: 'public', label: 'Public - No data restrictions' },
  { value: 'internal', label: 'Internal - For employees only' },
  { value: 'confidential', label: 'Confidential - Restricted audience' },
  { value: 'restricted', label: 'Restricted - Highest sensitivity' },
];

type FormState = 'idle' | 'reviewing' | 'submitting' | 'success';

export default function IntakePage() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [guidance, setGuidance] = useState<ReviewResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IntakeFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      contact_email: '',
      department: '',
      project_title: '',
      business_problem: '',
      desired_outcome: '',
      systems_involved: '',
      sensitivity_level: '',
    },
  });

  async function handleReview() {
    setFormState('reviewing');
    setGuidance(null);
    try {
      const draft = getValues();
      const result = await reviewRequest(draft);
      setGuidance(result);
    } catch {
      setGuidance({
        suggestions: [{ type: 'info', field: null, text: "We couldn't reach the review service right now. You can still submit your request." }],
        encouragement: '',
      });
    } finally {
      setFormState('idle');
    }
  }

  async function onSubmit(data: IntakeFormData) {
    setFormState('submitting');
    setSubmitError(null);
    try {
      await submitIntakeRequest(data);
      setFormState('success');
    } catch {
      setFormState('idle');
      setSubmitError('Something went wrong submitting your request. Please try again.');
    }
  }

  if (formState === 'success') {
    return (
      <>
        <Head><title>Request Submitted - AI Enablement Hub</title></Head>
        <div className="page-wrapper">
          <Header />
          <main className="main-content">
            <div className="content-container">
              <div className="success-card">
                <div className="success-icon" aria-hidden="true">&#10003;</div>
                <h2>Request submitted</h2>
                <p>Your request has been received by the AI Enablement team. We will review it and be in touch to discuss next steps.</p>
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Submit another request
                </Button>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  const isReviewing = formState === 'reviewing';
  const isSubmitting = formState === 'submitting';

  return (
    <>
      <Head><title>Submit a Request - AI Enablement Hub</title></Head>
      <div className="page-wrapper">
        <Header />
        <main className="main-content">
          <div className="content-container">
            <div className="page-header">
              <h1>Submit an AI Enablement Request</h1>
              <p>Share your idea or challenge with the AI Enablement team. You do not need a finished plan -- just tell us what is on your mind.</p>
            </div>

            <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>

              <section className="form-section">
                <div className="form-section-header">
                  <h2 className="form-section-title">Contact Information</h2>
                </div>
                <div className="form-grid form-grid-2">
                  <Input
                    label="Name"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    error={errors.name?.message}
                    {...register('name', { required: 'Please enter your name.' })}
                  />
                  <Input
                    label="Contact Email"
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    error={errors.contact_email?.message}
                    {...register('contact_email', {
                      required: 'Please enter your email address.',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
                    })}
                  />
                  <Select
                    label="Department"
                    required
                    options={DEPARTMENTS}
                    placeholder="Select your department"
                    error={errors.department?.message}
                    {...register('department', {
                      required: 'Please select your department.',
                    })}
                  />
                </div>
              </section>

              <section className="form-section">
                <div className="form-section-header">
                  <h2 className="form-section-title">Request Details</h2>
                  <p className="form-section-description">Describe the problem and what success would look like. Rough ideas are welcome.</p>
                </div>
                <div className="form-grid">
                  <Input
                    label="Project Title"
                    required
                    placeholder="A short name for this project or idea"
                    hint="A brief working title helps us track this request."
                    error={errors.project_title?.message}
                    {...register('project_title', {
                      required: 'Please give your project a title.',
                      maxLength: { value: 500, message: 'Title must be 500 characters or fewer.' },
                    })}
                  />
                  <TextArea
                    label="What problem are you trying to solve?"
                    required
                    rows={4}
                    placeholder="Describe the challenge or opportunity you have identified..."
                    hint="You do not need technical language -- just explain what is slowing your team down."
                    error={errors.business_problem?.message}
                    {...register('business_problem', { required: 'Please describe the problem you are trying to solve.' })}
                  />
                  <TextArea
                    label="What would a good outcome look like?"
                    required
                    rows={4}
                    placeholder="Describe what done or better looks like for your team..."
                    hint="Even a rough description of the desired result is helpful."
                    error={errors.desired_outcome?.message}
                    {...register('desired_outcome', { required: 'Please describe what a good outcome would look like.' })}
                  />
                </div>
              </section>

              <section className="form-section">
                <div className="form-section-header">
                  <h2 className="form-section-title">Optional Context</h2>
                  <p className="form-section-description">These fields are optional but help us route and scope your request more quickly.</p>
                </div>
                <div className="form-grid">
                  <TextArea
                    label="Systems or data involved"
                    rows={3}
                    placeholder="e.g. Salesforce, internal data warehouse, customer records..."
                    hint="Which tools, platforms, or data sources does this project involve?"
                    {...register('systems_involved')}
                  />
                  <Select
                    label="Sensitivity level"
                    options={SENSITIVITY_OPTIONS}
                    placeholder="Select a sensitivity level (optional)"
                    hint="Helps the team apply the right data handling practices from the start."
                    {...register('sensitivity_level')}
                  />
                </div>
              </section>

              <div className="form-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReview}
                  loading={isReviewing}
                  disabled={isSubmitting || isReviewing}
                >
                  {isReviewing ? 'Reviewing...' : 'Review My Request'}
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting || isReviewing}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>

                {submitError && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--accent)', margin: '0' }} role="alert">
                    {submitError}
                  </p>
                )}
              </div>

              {guidance && <GuidancePanel review={guidance} />}

            </form>
          </div>
        </main>
      </div>
    </>
  );
}
