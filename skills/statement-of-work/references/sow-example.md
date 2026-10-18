# Statement of Work Example

This example demonstrates the structure and tone for SOW documents.

---

## Complete SOW Example

```
                        StudioFlow (V2) SOW

Overview:

StudioFlow (V2) is a web application that supports multi-location fitness 
studio operations. The goal is to help instructors manage their classes and 
members, keep schedules full, and provide business insight while giving 
members visibility into their bookings and self-service account management.

Personas:

• Members
• Instructors
• Analysts
• Front Desk Staff
• Studio Managers

Value Stories:

• As an instructor, I want to have all member information in one place so that 
  I can prepare for classes quickly and provide better coaching.
• As a member, I want to view my bookings and membership status so that I 
  can plan my week without calling the front desk.
• As an analyst, I want attendance dashboards so that I can identify 
  trends and support scheduling recommendations.
• As front desk staff, I want streamlined membership sign-up so that I can 
  process new contracts quickly and accurately.
• As a studio manager, I want visibility into instructor activity so that I can 
  ensure members are receiving timely attention.

Features (MVP):

Instructor

• Able to log into StudioFlow (V2)
• Able to view member profile dashboard
  ○ Includes contact information and key dates
  ○ Includes fitness goals and injury notes
  ○ Includes communication history
• Able to view class roster summary
  ○ Includes upcoming classes by location
  ○ Includes capacity and waitlist status
  ○ Includes attendance trends
• Able to view program summaries
  ○ Includes strength program summary
  ○ Includes yoga program summary
  ○ Includes cycling program summary
• Able to add session notes and follow-up items
• Able to view communication timeline
  ○ Includes AI-generated summaries of past interactions

Member

• Able to log into StudioFlow (V2)
• Able to view personal dashboard
  ○ Includes membership overview
  ○ Includes recent activity
• Able to view booking details
• Able to interact with AI chatbot
  ○ Includes questions about bookings
  ○ Includes class recommendation questions
• Able to upload a health waiver via mobile document scanning

Front Desk Staff

• Able to log into StudioFlow (V2)
• Able to enter membership contracts
  ○ Includes e-signature workflow
  ○ Includes SMS confirmation notifications
• Able to manage member data
• Able to group members by plan or start date

Studio Manager

• Able to log into StudioFlow (V2)
• Able to view team activity dashboard
• Able to view engagement analytics
• Able to manage member follow-up queue

Application

• Responsive web application (mobile-friendly)
• Role-based access control
• Audit logging for compliance
• Integration with Microsoft 365 (calendar, email)
• Integration with wearable fitness trackers
• LLM-powered AI chatbot with guardrails

Features (Future):

Instructor

• Able to view predictive analytics
  ○ Includes attendance predictions
  ○ Includes churn-risk forecasting
• Able to configure automated class reminders
• Able to view substitute-instructor board

Analyst

• Able to view business intelligence dashboards
  ○ Includes revenue drivers
  ○ Includes local event integration
  ○ Includes seasonal demand modeling
• Able to view class format research
• Able to view pricing research

Member

• Able to receive custom progress reports
  ○ Includes scheduled delivery
  ○ Includes personalized content
```

---

## Style Notes

### Tone
- Direct and scannable
- No marketing fluff
- Technical enough for developers, readable for clients

### Bullets
- Always use "Able to" for top-level features
- Always use "Includes" for sub-features
- Keep bullets concise—one capability per line

### Personas
- List in order of importance/primary users first
- Simple names only—no descriptions in the list
- Details come through in value stories and features

### Value Stories
- One per persona minimum
- Focus on the "so that" benefit—this is what clients care about
- Keep them realistic, not aspirational

### MVP vs Future
- MVP should be achievable in initial engagement
- Future shows vision without committing to scope
- Be explicit about the split—clients appreciate clarity

### Application Section
- Technical requirements that apply to the whole system
- Integrations go here
- Compliance/security requirements go here
- AI capabilities with guardrails noted
