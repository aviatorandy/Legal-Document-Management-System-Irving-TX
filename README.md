# Concourse LegalFlow — City of Irving Office of the City Attorney

Interactive desktop prototype for RFP 147C-26F: a Legal Case and Document Management System replacing the legacy Cycom CityLaw platform.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with a slate/navy/zinc municipal design system
- lucide-react icons
- Local React state with pre-seeded mock data (no external database)

## Views

- **Litigation & Claims Docket** — metrics, filters, and an 18-matter docket table
- **Document Bundle Ingestion & Triage** — AI triage simulation, auto-tagging, PII redaction
- **Contract Compliance Studio** — split-screen contract review with Texas statutory compliance flags and remediation actions

## Run locally

```bash
npm install
npm run dev
```
