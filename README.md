# AI Enablement Hub

An internal enterprise intake application for submitting and reviewing AI project requests.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript |
| Forms | React Hook Form |
| Styling | Plain CSS (no Tailwind) |
| Backend | Django 4.2 + Django REST Framework |
| Database | PostgreSQL |

## Project Structure

```
ai-enablement-hub/
├── backend/                        # Django REST API
│   ├── ai_enablement_hub/          # Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── intake/                     # Intake app
│   │   ├── migrations/
│   │   ├── models.py               # IntakeRequest model
│   │   ├── serializers.py
│   │   ├── views.py                # API views + AI guidance logic
│   │   └── urls.py
│   ├── requirements.txt
│   ├── manage.py
│   ├── render.yaml                 # Render deployment config
│   └── .env.example
│
└── frontend/                       # Next.js app
    └── src/
        ├── components/
        │   ├── layout/
        │   │   └── Header.tsx      # Site header + navigation
        │   └── ui/
        │       ├── index.tsx       # Button, Input, TextArea, Select, Badge, Spinner
        │       └── GuidancePanel.tsx
        ├── lib/
        │   └── api.ts              # API client
        ├── pages/
        │   ├── _app.tsx
        │   ├── _document.tsx
        │   ├── index.tsx           # Employee intake form
        │   └── review.tsx          # Reviewer queue
        ├── styles/
        │   ├── globals.css         # Design tokens + all component styles
        │   └── header.css
        └── types/
            └── index.ts            # TypeScript types
```

## Local Development

### Backend

**Prerequisites:** Python 3.11+, PostgreSQL

```bash
cd backend

# Create virtualenv
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your local DB credentials

# Create the database
createdb ai_enablement_hub   # or use pgAdmin / psql

# Run migrations
python manage.py migrate

# Start dev server
python manage.py runserver
```

API runs at: `http://localhost:8000`

### Frontend

**Prerequisites:** Node.js 18+

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed (default: http://localhost:8000)

# Start dev server
npm run dev
```

App runs at: `http://localhost:3000`

---

## API Endpoints

### `GET /api/requests/`
Returns all submitted intake requests (lightweight list view).

### `POST /api/requests/`
Submit a new intake request.

**Request body:**
```json
{
  "name": "Jane Smith",
  "contact_email": "jane@company.com",
  "department": "engineering",
  "project_title": "Automated triage for support tickets",
  "business_problem": "Our support team manually categorizes 500+ tickets per day...",
  "desired_outcome": "Reduce manual categorization time by 70%...",
  "systems_involved": "Zendesk, internal knowledge base",
  "sensitivity_level": "internal"
}
```

### `POST /api/review-request/`
Returns supportive AI-style guidance on a form draft. Accepts the same fields as the create endpoint (all optional). Returns:

```json
{
  "suggestions": [
    {
      "type": "improve",
      "field": "business_problem",
      "text": "Your problem statement is a good start..."
    }
  ],
  "encouragement": "You're off to a good start..."
}
```

---

## Deployment

### Backend → Render

1. Push the `backend/` folder to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repo
4. Set environment variables (see `.env.example`)
5. Or use `render.yaml` for infrastructure-as-code deployment

**Key env vars for Render:**
```
SECRET_KEY=<generate a strong key>
DEBUG=false
ALLOWED_HOSTS=your-service.onrender.com
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
DATABASE_URL=<auto-set by Render PostgreSQL>
```

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repo
2. Import into [vercel.com](https://vercel.com)
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-service.onrender.com
   ```
4. Deploy

---

## Design System

The UI uses a restrained enterprise design language:

- **Accent color:** `#b01c2e` (deep red — trustworthy, professional)
- **Backgrounds:** warm neutral grays
- **Typography:** System UI stack for clarity and performance
- **Focus states:** Red outline ring on all interactive elements
- **No Tailwind** — all styles in plain CSS with CSS custom properties

---

## Notes

- No authentication is implemented. Reviewer access would be protected by SSO/RBAC in production.
- The "Review My Request" AI guidance is mocked server-side — no LLM required.
- The "Create Jira Ticket" action is frontend-only — generates a fake `AIEN-XXXX` key.
