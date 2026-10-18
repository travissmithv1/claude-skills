---
name: technical-estimate
description: "Create technical estimate documents for client projects. Use when: (1) Estimating development effort for a project defined in an SOW, (2) Documenting infrastructure architecture and costs, (3) Identifying risks and where time will be spent, (4) Creating client-ready technical planning documents. Outputs Word documents (.docx) using the docx skill."
---

# Technical Estimate Creation

Create technical estimate documents that accompany SOWs. Technical estimates cover architecture, effort, costs, and risks.

## Document Structure

Technical estimates follow this structure:

1. **Title** - "[Application Name] Technical Estimate"
2. **Executive Summary** - Brief overview with key numbers table
3. **Infrastructure Architecture** - Services, environments, networking
4. **Risk Assessment** - Categorized by High/Medium/Low
5. **Effort Estimates** - Development time by feature area
6. **Where Time Will Be Spent** - Narrative on complex areas
7. **Cost Estimates** - Infrastructure and third-party services
8. **Recommendations** - Pre-development actions and technical guidance

## Required Sections

### Executive Summary

Brief paragraph describing what the document covers, followed by a summary table:

| Item | Estimate |
|------|----------|
| Total Development Time | X weeks (context on team/approach) |
| Monthly Infrastructure Cost | $X - $Y (all environments) |
| Monthly AI Model Cost | $X - $Y (usage dependent) |
| Target Users | X concurrent, scalable to Y |

### Infrastructure Architecture

#### Services Overview Table

| Layer | Service | Purpose |
|-------|---------|---------|
| Frontend Hosting | Azure Blob + CDN / S3 + CloudFront | Static app with global CDN |
| API Layer | Container Apps / ECS Fargate | Containerized API, auto-scaling |
| Database | Azure PostgreSQL / RDS | Managed database |
| Cache | Redis | Session management, data cache |
| Secrets | Key Vault / Secrets Manager | API keys, credentials |
| Queue | Service Bus / SQS | Background job processing |
| Monitoring | App Insights / CloudWatch | Logs, metrics, tracing |

#### Environment Configuration

Document all environments (typically: Dev, QA, Staging, Prod) with sizing:

| Environment | API Instances | Database | Cache | Purpose |
|-------------|---------------|----------|-------|---------|
| Development | 1 | Basic tier | Shared | Active development |
| QA | 1-2 | Basic tier | Shared | Testing |
| Staging | 2 | Standard | Dedicated | Pre-prod validation |
| Production | 2-4 | Standard + replica | Dedicated | Live traffic |

#### Security Architecture

- Data protection (TLS, encryption at rest, password hashing)
- PII anonymization for AI (required for any LLM integration)
- Infrastructure security (WAF, security groups, secrets rotation)

### Risk Assessment

Categorize risks by severity with specific mitigations:

#### High Risk Items
- Third-party API complexity (unknown constraints, rate limits)
- Integration dependencies (vendor coordination required)
- Compliance requirements (e-signature, data handling)

#### Medium Risk Items  
- Data migration complexity
- Performance at scale
- AI response quality

#### Low Risk Items
- Standard CRUD operations
- Authentication (well-understood patterns)
- Auto-scaling (cloud-native solutions)

### Effort Estimates

#### Feature Estimate Table

| Feature Area | Estimate | Confidence |
|--------------|----------|------------|
| Infrastructure & DevOps Setup | X hours/days | High |
| Authentication & User Management | X hours/days | High |
| [Feature Area 1] | X hours/days | Medium |
| [Feature Area 2] | X hours/days | Medium |

Confidence levels:
- **High**: Well-understood, done before
- **Medium**: Some unknowns, typical complexity
- **Low**: Significant unknowns, needs discovery

#### Project Overhead Table

| Activity | Estimate | Notes |
|----------|----------|-------|
| Discovery & Requirements | X days/weeks | Upfront + ongoing |
| Project Setup | X hours | Repo, tooling, accounts |
| Project Management | Ongoing | Communication, demos |
| Feedback Cycles | X days | Client review periods |
| Data Migration | X hours | If applicable |

### Where Time Will Be Spent

Narrative section explaining the complex areas:

1. **[Complex Area 1] (X hours)** - Why this takes time, what's involved
2. **[Complex Area 2] (X hours)** - Dependencies, coordination needed
3. **[Integration Work] (X hours)** - External systems, unknown APIs

Also include "Time Savers" if using AI-assisted development:
- Boilerplate code generation
- Test generation
- Infrastructure as Code
- Database migrations

### Cost Estimates

#### Monthly Infrastructure Costs Table

| Service | Low | High | Notes |
|---------|-----|------|-------|
| Compute (all envs) | $X | $Y | Usage-based |
| Database (all envs) | $X | $Y | Prod has replica |
| Cache | $X | $Y | |
| Storage + CDN | $X | $Y | Traffic dependent |
| Monitoring | $X | $Y | Log volume |
| **TOTAL** | $X | $Y | |

#### Third-Party / AI Costs Table

| Service | Low | High | Notes |
|---------|-----|------|-------|
| LLM API (Claude/GPT) | $X | $Y | Per conversation estimate |
| Other APIs | $X | $Y | Licensing, per-call |
| **TOTAL** | $X | $Y | |

Include calculation basis for AI costs:
- Tokens per conversation (input/output)
- Expected conversation volume
- Model pricing

### Recommendations

#### Pre-Development Actions
- Items that need clarification before starting
- API documentation to obtain
- Licensing/compliance questions
- Vendor coordination needed

#### Technical Recommendations
- Architecture decisions (monorepo, feature flags, etc.)
- Observability setup timing
- Security considerations (PII anonymization)
- Testing strategy

## Gathering Information

Before creating the estimate, clarify:
- What's the SOW? (features to estimate)
- Who is doing the work? (solo, team, AI-assisted)
- What infrastructure preference? (AWS, Azure, GCP)
- How many environments needed?
- What compliance requirements exist?
- What third-party integrations are required?
- Expected user volume?

## Document Format

See references/technical-estimate-example.md for complete structure.

Use the docx skill to create Word documents with:
- Tables for all data (services, estimates, costs)
- Gray header rows in tables
- Clear section headers
- Page breaks between major sections

## Quality Checklist

Before finalizing:

- [ ] Executive summary has key numbers table
- [ ] All environments documented with sizing
- [ ] Risks categorized with mitigations
- [ ] Effort estimates include confidence levels
- [ ] Infrastructure costs cover all environments
- [ ] AI/third-party costs calculated with assumptions stated
- [ ] Pre-development actions are specific and actionable
- [ ] Security section addresses PII if AI is involved