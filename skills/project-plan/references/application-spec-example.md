# Application Specification Example

This example demonstrates the structure and tone for application specification documents.

---

## Document Structure

```
[Application Name] - Application Specification

1. Application Overview
   - Name
   - Description (2-3 sentences)

2. User Personas
   | Persona | Count | Primary Goal | Key Pain Points |
   |---------|-------|--------------|-----------------|

3. Feature Matrix
   | Feature | Persona1 | Persona2 | Persona3 |
   |---------|----------|----------|----------|
   | F1: Name | P | V | - |

4. Feature Descriptions
   F1: Feature Name
   Description paragraph explaining what this feature does.
   Primary User: [Persona]
   Pain Point Addressed: "[Quote from workshop/discovery]"

5. Workflows
   Workflow 1: [Name]
   Persona: [Who]
   Trigger: [What starts this]
   Current State: [How it's done today]
   
   | Step | Actor | Action | System Response |
   |------|-------|--------|-----------------|
   | 1 | Instructor | Opens dashboard | Shows member list |
   
   Outcome: [What success looks like]

6. Integration Points
   - System 1: Purpose
   - System 2: Purpose

7. Infrastructure & Third-Party Costs
   Monthly AWS costs by environment
   Third-party service costs
   Cost scaling factors

8. Footer
   Prepared by [Company Name]
   [Date]
```

---

## Example Content

### Personas Section

```
## User Personas

### Instructor (14 users)
**Primary Goal:** Maintain strong relationships with members through timely, personalized coaching.

**Key Pain Points:**
- "Spend 30+ minutes preparing for each class gathering information from multiple systems"
- "Can't remember what we discussed last time without digging through notes"
- "No way to see all member activity in one place"

### Front Desk Staff (4 users)
**Primary Goal:** Keep member data accurate and sign-ups processed efficiently.

**Key Pain Points:**
- "Membership sign-up requires multiple systems and manual e-signature tracking"
- "Grouping members by plan takes hours because data is scattered"
```

### Feature Description Section

```
## Feature Descriptions

### F1: Member Profile Dashboard
A unified view of all member information including contact details, 
relationship history, current bookings, and recent activity. The dashboard 
consolidates data from multiple systems into a single interface, eliminating 
the need to switch between applications.

**Primary User:** Instructor  
**Pain Point Addressed:** *"Spend 30+ minutes preparing for each class gathering information from multiple systems"*

### F2: Pre-Class Briefing
Automatically generated summary for upcoming classes including recent 
attendance changes for enrolled members, outstanding follow-up items, and 
conversation history highlights. Accessible from mobile for on-the-go preparation.

**Primary User:** Instructor  
**Pain Point Addressed:** *"Can't remember what we discussed last time without digging through notes"*
```

### Workflow Section

```
## Workflows

### Workflow 1: Weekly Class Prep

**Persona:** Instructor  
**Trigger:** Weekly class schedule or ad-hoc member request  
**Current State:** Instructor manually searches through the legacy booking system, 
email, and notes to prepare. Takes 30+ minutes per class.

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | Instructor | Opens class roster | Displays unified dashboard |
| 2 | Instructor | Reviews pre-class briefing | Shows auto-generated summary with member context |
| 3 | Instructor | Checks member profiles | Displays goals, injury notes, and attendance history |
| 4 | Instructor | Reviews communication timeline | Shows last 5 interactions with notes |
| 5 | Instructor | Marks class as "prepared" | Updates class queue status |

**Outcome:** Instructor has complete context for a productive class in under 5 minutes.
```

---

## Style Guidelines

### Tone
- Professional but not overly formal
- Client-ready but not full of legal boilerplate
- Technical enough for engineers, readable for stakeholders

### Feature IDs
Use sequential IDs: F1, F2, F3... This allows easy reference in discussions.

### Pain Points
Always italicize pain point quotes. These should come directly from discovery sessions, workshops, or user interviews when available.

### Workflow Tables
Keep actions concise. One clear action per step. System response should describe what the user sees, not implementation details.

### Integration Points
List external systems with brief purpose. Don't over-specify APIs or technical details.

### Infrastructure & Third-Party Costs
Always include cost estimates to help clients understand ongoing expenses.

---

## Infrastructure & Third-Party Costs Example

```
## Infrastructure & Third-Party Costs

### Monthly AWS Costs (Estimated)

| Environment | Monthly Cost | Notes |
|-------------|--------------|-------|
| Development | $150-250 | t3.small instances, single-AZ |
| QA | $400-600 | Production-like configuration |
| Production | $1,200-2,000 | Multi-AZ, auto-scaling, enhanced monitoring |

**Cost Drivers:**
- ECS Fargate: ~$50-150/environment (API + UI containers)
- RDS PostgreSQL: ~$100-400/environment (db.t3.medium to db.r5.large)
- Application Load Balancer: ~$20-30/environment
- S3 + CloudFront: ~$20-50 (depends on file storage volume)
- Data Transfer: ~$50-200 (depends on user geographic distribution)

### Third-Party Services

| Service | Purpose | Estimated Monthly Cost |
|---------|---------|------------------------|
| Anthropic Claude API | AI-powered chat and analysis | $500-3,000 (usage dependent) |
| SendGrid | Transactional email | $15-50 (up to 50k emails) |
| Twilio | SMS notifications | $0.0079/message |
| Stripe | Payment processing | 2.9% + $0.30 per transaction |
| Sentry | Error monitoring | $26/month (Team plan) |
| Pinecone | Vector database for RAG | $70/month (starter pod) |

### Cost Scaling Factors

**User Growth:**
- 1,000 → 10,000 users: ECS tasks scale 2-3x, RDS may need upgrade
- Database connections become bottleneck around 5,000 concurrent users

**AI Usage:**
- Each conversation averages ~2,000 tokens input + 500 tokens output
- At $3/1M input tokens + $15/1M output tokens (Claude Sonnet):
  - 1,000 conversations/month ≈ $15
  - 10,000 conversations/month ≈ $150
  - 100,000 conversations/month ≈ $1,500

**Data Volume:**
- S3 storage: $0.023/GB/month
- Document uploads: estimate 10MB average per member
- 500 members × 10MB × 12 months = 60GB = ~$1.40/month

### Compliance Considerations

For HIPAA compliance, add:
- AWS Business Support: $100/month minimum
- CloudTrail logging: ~$2/100k events
- Enhanced encryption: minimal cost increase
- BAA agreements: no additional cost
```