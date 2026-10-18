---
name: statement-of-work
description: "Create Statement of Work (SOW) documents for client projects. Use when: (1) Defining scope for a new client engagement, (2) Documenting features and personas for a web application, (3) Creating client-ready scope documents with value stories and feature lists. Outputs Word documents (.docx) using the docx skill."
---

# Statement of Work Creation

Create client-ready SOW documents for web application projects. SOWs define what will be built without specifying effort or timelines.

## Document Structure

SOW documents follow this exact structure:

1. **Title** - "[Application Name] SOW"
2. **Overview** - 2-3 sentence description of what the application does and its goal
3. **Personas** - Simple bullet list of user types
4. **Value Stories** - "As a [persona], I want [capability] so that [benefit]"
5. **Features** - Organized by persona with "Able to..." bullets
6. **Application** - Technical requirements section

## Required Sections

### Overview

Brief paragraph describing:
- What the application is
- Who it serves
- The primary goal

Example:
```
StudioFlow (V2) is a web application that supports multi-location fitness 
studio operations. The goal is to help instructors manage their classes and 
members, keep schedules full, and provide business insight while giving 
members visibility into their bookings and self-service account management.
```

### Personas

Simple bullet list. No descriptions needed—just the role names.

```
- Members
- Instructors
- Analysts
- Front Desk Staff
- Studio Managers
```

### Value Stories

One per persona. Format: "As a [persona], I want [capability] so that [benefit]."

```
- As an instructor, I want to have all member information in one place so that 
  I can prepare for classes quickly and provide better coaching.
- As a member, I want to view my bookings and membership status so that I 
  can plan my week without calling the front desk.
```

### Features

Organized by persona. Use two levels of bullets:
- **Level 1**: "Able to [action]"
- **Level 2**: "Includes [detail]"

```
## Instructor

- Able to log into the application
- Able to view member profile dashboard
  - Includes contact information and key dates
  - Includes fitness goals and injury notes
  - Includes communication history
- Able to view class roster summary
  - Includes upcoming classes by location
  - Includes capacity and waitlist status
- Able to add session notes and follow-up items
```

### Application (Technical Requirements)

Technical capabilities required by the system itself:

```
## Application

- Responsive web application (mobile-friendly)
- Role-based access control
- Audit logging for compliance
- Integration with [external systems]
```

## Gathering Information

Before creating the SOW, clarify:
- Who is the client?
- What problem does this solve?
- Who are the users (personas)?
- What existing systems are being replaced or integrated?
- Are there compliance requirements?

If the user provides discovery notes, workshop outputs, or existing system documentation:
- Extract personas from user descriptions
- Convert pain points into value stories
- Organize features by persona

## Document Format

See references/sow-example.md for complete structure.

Use the docx skill to create Word documents with:
- Centered title (large, bold)
- Section headers (Heading 1 style)
- Persona headers within Features (Heading 2 style)
- Proper bullet formatting using numbering config (never unicode bullets)
- Arial font throughout

## MVP vs Future Features

When scope is large, split into sections:

```
## Features (MVP)

[Features for initial release]

## Features (Future)

[Features planned for later phases]
```

This allows clients to see the full vision while understanding what's included in the initial engagement.

## Quality Checklist

Before finalizing:

- [ ] Overview clearly states what the app does and for whom
- [ ] Each persona has at least one value story
- [ ] Features are organized by persona
- [ ] "Able to" format used consistently
- [ ] "Includes" sub-bullets provide necessary detail
- [ ] Application section covers technical requirements
- [ ] No effort estimates or timelines included