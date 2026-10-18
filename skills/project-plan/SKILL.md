---
name: project-plan
description: "Create comprehensive project plans for client web applications. Use when: (1) Starting a new client project and need to define scope, (2) Developing personas, features, and workflows for an application, (3) Identifying infrastructure and third-party service costs, (4) Preparing scope documents for client conversations. Outputs Word documents (.docx) using the docx skill."
---

# Project Plan Creation

Create comprehensive project planning documents for web applications covering scope, user experience, and cost considerations.

---

## Application Specification

Use when defining scope before discussing MVP or timelines.

### Required Sections

1. **Application Name & Description** - 2-3 sentence summary of what the app does and who it serves
2. **Personas** - Each persona includes:
   - Role name
   - User count (approximate)
   - Primary goal
   - Key pain points (2-3 bullets)
3. **Feature Matrix** - Table showing features × personas with P (Primary), V (View), or - (No access)
4. **Feature Descriptions** - For each feature:
   - Feature ID and name (F1: Feature Name)
   - Description paragraph
   - Primary User
   - Pain Point Addressed (italicized quote from discovery/workshop)
5. **Workflows** - Step-by-step user journeys with:
   - Workflow name
   - Persona(s) involved
   - Trigger (what starts this workflow)
   - Current State (how it's done today, if applicable)
   - Steps table: Actor | Action | System Response
   - Outcome
6. **Integration Points** - External systems the app connects to
7. **Infrastructure & Third-Party Costs** - See "Cost Identification" below

### Gathering Information

Before creating the document, clarify:
- Who is the client?
- What problem does this solve?
- What are the primary user types?
- Are there existing systems being replaced?
- Are there competitors to research?

If the user provides workshop notes, transcripts, or existing system documentation, extract:
- Pain points and sticky note quotes for feature descriptions
- User counts and roles for personas
- Current workflows for comparison

### Document Format

See references/application-spec-example.md for complete structure.

Use the docx skill to create professional Word documents with:
- Green color scheme (#2E7D32 for headers)
- Arial font throughout
- Tables for feature matrix and workflow steps
- Clear section headers

---

## Cost Identification

Identify recurring costs for infrastructure and third-party services. This helps clients understand ongoing expenses beyond development.

### AWS Infrastructure Costs

Identify which AWS services are needed based on features:

| Feature Type | Likely AWS Services |
|--------------|---------------------|
| Web application hosting | ECS/Fargate, ALB, Route 53 |
| Database | RDS (PostgreSQL), ElastiCache |
| File storage/uploads | S3, CloudFront |
| Background jobs | SQS, Lambda |
| Search | OpenSearch |
| AI/ML features | Bedrock, SageMaker |
| Authentication | Cognito |
| Email | SES |

For each environment (Dev, QA, Prod), estimate monthly costs. Consider:
- Instance sizes based on expected user load
- Data transfer costs
- Storage growth over time
- Multi-AZ for production

### Third-Party Service Costs

Common services and typical pricing models:

| Service Category | Examples | Pricing Model |
|------------------|----------|---------------|
| AI/LLM | OpenAI, Anthropic Claude API | Per token/request |
| Email delivery | SendGrid, Postmark | Per email sent |
| SMS/Notifications | Twilio, AWS SNS | Per message |
| Payment processing | Stripe | Percentage of transaction |
| Document signing | DocuSign, HelloSign | Per envelope |
| Analytics | Mixpanel, Amplitude | Per tracked user |
| Error monitoring | Sentry, Datadog | Per event/host |
| Vector database | Pinecone | Per pod/storage |
| Search | Algolia | Per search/record |
| Maps | Google Maps, Mapbox | Per request |

### Cost Documentation Format

Include in project plan:

```
## Infrastructure & Third-Party Costs

### Monthly AWS Costs (Estimated)

| Environment | Monthly Cost | Notes |
|-------------|--------------|-------|
| Development | $150-250 | Minimal instances, shared resources |
| QA | $300-500 | Production-like for testing |
| Production | $800-1,500 | Multi-AZ, auto-scaling |

### Third-Party Services

| Service | Purpose | Estimated Monthly Cost |
|---------|---------|------------------------|
| Anthropic Claude API | AI chat features | $500-2,000 (usage dependent) |
| SendGrid | Transactional email | $20-50 |
| Stripe | Payment processing | 2.9% + $0.30 per transaction |

### Cost Scaling Factors

- User growth: Each 10x users increases [specific costs]
- Data volume: Storage costs grow with [specific data types]
- API usage: AI features scale with [conversation volume]
```

### Gathering Cost Information

Questions to clarify costs:
- Expected number of users (launch, 6 months, 1 year)?
- Data storage requirements (documents, images, video)?
- Which AI features require external APIs?
- Compliance requirements affecting infrastructure (HIPAA, SOC 2)?
- Geographic distribution of users (multi-region needs)?

---

## Quality Checklist

Before finalizing any project plan document:

- [ ] Each feature traces to a pain point
- [ ] Each workflow has clear trigger and outcome
- [ ] Personas have realistic user counts
- [ ] Integration points are identified
- [ ] Infrastructure costs cover all environments
- [ ] Third-party services are identified with pricing models
- [ ] Cost scaling factors are documented