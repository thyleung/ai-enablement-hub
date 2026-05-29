# 💡 AI Enablement Hub

An enterprise AI intake and review workflow built with Next.js, Django REST Framework, and PostgreSQL.

## Live Demo

Frontend: https://... (coming soon)

Backend API: https://ai-enablement-hub-1.onrender.com/api/requests/


## Features

* Submit AI initiative requests through a streamlined intake form
* Optional AI-assisted request review
* Reviewer queue for internal triage
* Mock Jira handoff workflow
* Accessible, enterprise-focused UI


## Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | Next.js 14 + TypeScript |
| Forms    | React Hook Form         |
| Backend  | Django REST Framework   |
| Database | PostgreSQL              |
| Styling  | Plain CSS               |


## Architecture

```text
Next.js Frontend
├── Employee Intake Form
├── AI Review Workflow
└── Reviewer Queue

Django REST API
├── POST /api/requests/
├── GET /api/requests/
└── POST /api/review-request/

PostgreSQL
└── IntakeRequest records

Mock Integrations
└── Jira handoff workflow
```

## Notes

* The AI review workflow is mocked server-side for the demo.
* The Jira handoff is simulated on the frontend.
* In production, employee authentication would be integrated with the organization's SSO provider.
