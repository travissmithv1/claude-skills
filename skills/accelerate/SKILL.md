---
name: accelerate
description: "Apply the research findings of 'Accelerate' (Forsgren, Humble, Kim) and the DORA program on software *delivery performance*. Use ONLY for delivery/DevOps topics, not code style: (1) Measuring or improving the four key metrics — deployment frequency, lead time for changes, time to restore service (MTTR), change failure rate, (2) Benchmarking a team as Elite/High/Medium/Low performer, (3) Adopting continuous-delivery capabilities — trunk-based development, deployment automation, test automation, CI, loosely coupled architecture, (4) Diagnosing delivery bottlenecks, deployment pain, or burnout, (5) Assessing Westrum organizational culture or transformational leadership for delivery. Do NOT use for naming, refactoring, or code-level design. Reach for this when someone asks how to measure DevOps/delivery performance, improve deployment frequency or lead time, or what DORA/Accelerate says."
---

# Accelerate (DORA Metrics)

Accelerate presents the statistically-validated research behind the DORA program: *how* an organization builds and delivers software predicts its software delivery performance, which in turn predicts organizational performance (profitability, productivity, market share). The central, counter-intuitive finding: **speed and stability are not a trade-off — they move together.** Elite teams deploy faster *and* break less.

Scope note: this skill is about delivery practice and measurement. For code-level craft use the code-design skills; this is the system around the code.

## The Four Key Metrics

These four — and only these four — define software delivery performance. Two measure throughput (tempo), two measure stability.

**Throughput**
- **Deployment Frequency** — how often the org deploys code to production / releases to end users. (Proxy for batch size: frequent = small batches.)
- **Lead Time for Changes** — time from code committed to code running in production. Short lead time = fast feedback and recovery.

**Stability**
- **Time to Restore Service (MTTR)** — how long to recover from a failure/degradation in production. Reflects resilience; failures are inevitable, fast recovery is the skill.
- **Change Failure Rate** — what percentage of changes to production result in degraded service requiring remediation (rollback, hotfix, patch).

Key insight: measure **outcomes, not output.** Don't measure lines of code, velocity points, or utilization (busy ≠ valuable, and high utilization destroys lead time via queueing). A fifth measure, **availability/operational performance** (later **reliability**), was added in subsequent DORA research.

## Performance Tiers

Teams cluster into groups by the four metrics. The bands (orders of magnitude, not exact cutoffs):

| Metric | Elite | Low |
|---|---|---|
| Deployment frequency | On-demand (multiple/day) | Between once/month and once/6 months |
| Lead time for changes | < 1 hour | 1–6 months |
| Time to restore service | < 1 hour | 1 week – 1 month |
| Change failure rate | 0–15% | 40–60%+ |

Elite/High performers do better on *all four* simultaneously — refuting the belief that you trade reliability for speed.

## The 24 Capabilities (the drivers)

DORA found ~two dozen capabilities that statistically *drive* the four metrics. They group into five categories. Improvement work means picking the capability most constraining *your* team — not adopting all at once.

**Continuous Delivery**
- Version control for *all* production artifacts (app code, configs, scripts, system config).
- Deployment automation.
- Continuous Integration (commit to trunk frequently; automated build+test on every commit).
- **Trunk-based development** — short-lived branches (< a day), merged to trunk daily, fewer than ~3 active branches. One of the strongest predictors.
- Test automation (reliable, developer-owned automated tests run continuously).
- Test data management.
- Shift left on security (build security in throughout).
- Continuous delivery (the system is always in a deployable state; deployability is prioritized over new work when broken).

**Architecture**
- **Loosely coupled architecture** — teams can test, deploy, and change their systems on demand without depending on other teams. The biggest architectural predictor of performance.
- Empowered teams choose their own tools.

**Product & Process**
- Work in small batches; make the flow of work visible through the value stream.
- Gather and implement customer feedback.
- Team experimentation (authority to try and change things without outside approval).

**Lean Management & Monitoring**
- Limit work in progress (WIP); visualize work (e.g. boards).
- Lightweight change-approval process (peer review / pair programming beats external change-approval boards — CABs correlate with *worse* performance and don't reduce failures).
- Monitoring across applications and infrastructure to inform decisions.
- Proactive notification / observability of system health.
- WIP limits and visual displays to surface problems.

**Cultural**
- **Westrum generative culture** (below).
- Support learning as a strategic investment.
- Enable collaboration across teams.
- Provide tools and resources; transformational leadership.

## Westrum Organizational Culture

How an organization processes information predicts delivery performance. Three types:

- **Pathological** (power-oriented) — information hoarded for personal gain; failure → scapegoating; novelty crushed.
- **Bureaucratic** (rule-oriented) — information moves through channels; failure → justice/blame; novelty → problems.
- **Generative** (performance-oriented) — information flows freely; failure → inquiry and learning; novelty welcomed; high cooperation, messengers trained not shot, risk shared. **Aim for generative.**

A blameless culture and psychological safety are not soft extras — they statistically predict higher delivery performance.

## Other Validated Findings

- **Transformational leadership** (vision, inspirational communication, intellectual stimulation, supportive leadership, personal recognition) enables — but cannot substitute for — the technical and lean capabilities.
- **Burnout and deployment pain** drop when delivery is automated and low-risk. Painful, fragile, after-hours deployments predict burnout; making deploys boring is a wellbeing intervention.
- **Continuous delivery and loosely coupled architecture predict lower burnout and higher job satisfaction**, not just speed.
- **Identity, autonomy, and a sense of doing meaningful work** correlate with performance.
- Investment in delivery capability pays back in organizational outcomes — this is a business case, not just an engineering preference.

## How to Use This Skill

1. **Measure the four key metrics first.** You can't improve delivery performance you don't measure; resist vanity output metrics (velocity, LOC, utilization).
2. **Find the constraining capability.** Pick the one of the 24 capabilities most limiting *this* team's metrics (often: large batches, manual deployment, tight architectural coupling, or heavyweight approvals) and improve it.
3. **Pursue speed and stability together** — they reinforce each other; a proposal that trades one for the other usually signals a missing capability (automation, test coverage, decoupling).
4. **Treat culture as causal, not cosmetic.** Move toward Westrum-generative: blameless retrospectives, free information flow, peer review over change-approval boards.
5. Improve through small, measured experiments; re-measure the four metrics to confirm the capability change moved the outcome.
