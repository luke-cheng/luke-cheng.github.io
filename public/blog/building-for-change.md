---
title: Make your code fool-proof, not efficient  
date: 2026-09-20
description: about the small engineering decisions that keep systems understandable as they grow.
---

# "Make Your Code Fool-Proof, Not Efficient" 

## Metadata & Post Overview

* **Title:** Make Your Code Fool-Proof, Not Efficient
* **Core Thesis:** Code and architecture are media of communication for teams. Prioritize explicit, foolproof maintainability over clever indirection, hyper-efficiency, or custom automated "magic."

---

## Introduction: The Audience Paradox

* **The Technical Guide Rule:**
* Good documentation matches the reader's cognitive bandwidth:
* *Too much information* $\rightarrow$ The reader gets bored and tunes out.
* *Too little information* $\rightarrow$ The reader gets confused and stuck.




* **Translating to Code & Architecture:**
* Code suffers from the exact same spectrum. Hyper-clever or overly custom setups assume an unreasonable mental model from the maintainer.
* Writing "efficient" or overly automated code often ignores the primary user: a context-switching developer under pressure.



---

## Case Study 1: The Clever Syntax Trap (YAML Anchors)

* **The Anti-Pattern:** Using YAML anchors (`&anchor`) and aliases (`*alias`) to keep configuration strictly DRY (Don't Repeat Yourself).
* **The Reality Check:**
* Many developers do not understand YAML anchor references nor care to learn obscure syntax.
* When a deployment fails, developers are forced to mentally unroll merged config blocks under stress.


* **The Fool-Proof Principle:** Explicit duplication in configuration is vastly superior to clever indirection that confuses team members.

---

## Case Study 2: The "Genius Dev" Pipeline (Database Schema Migrations)

* **The Anti-Pattern:** A custom, standalone Liquibase runner forced into the CI/CD pipeline by a former "genius developer."
* **The Clever Setup:** Custom pipeline scripts automatically mapped Git branching strategies (`feature` $\rightarrow$ `develop` $\rightarrow$ `release`) directly to target database environments (`dev` $\rightarrow$ `test` $\rightarrow$ `prod`).


* **The Reality Check:**
* When the developer left, the complex custom glue code fell out of maintainability.
* Because fixing the custom CI logic was too intimidating, the path of least resistance for the team became avoiding Liquibase altogether—leaving database changes manual or unmanaged.


* **Evaluating the 3 Paths Forward:**

| Approach | Architecture | Maintainability | Verdict relative to "Fool-Proof" |
| --- | --- | --- | --- |
| **Path A: Fix Legacy Standalone CI Script** | Repair custom CI pipeline scripts that run Liquibase CLI with branch-to-env mapping logic. | **Low.** Retains complex custom glue code; high risk of breaking when CI environment updates. | ❌ **Clever Trap:** Preserves fragile technical debt and tribal knowledge. |
| **Path B: Enterprise Platform Pipeline** | Adopt the firm's central, opinionated Liquibase CI/CD pipeline. | **Medium–High.** Standardized across teams and maintained by the platform engineering team. | 🟡 **Solid Standard:** Excellent if organization policy mandates schema changes outside the app runtime. |
| **Path C: Embedded Spring Boot Plugin** | Run Liquibase directly inside application boot via `liquibase-core`. | **Highest.** Changesets live with app code and execute deterministically on startup across all environments. | ✅ **Fool-Proof Winner:** Zero external script dependencies; simple to test and debug locally. |

* **The Fool-Proof Principle:** A simple, predictable process that every team member understands beats an automated "magic" pipeline that nobody dares to touch or maintain.


## Key Takeaways & Design Rules

* **Design for 3 AM:** Write code and build pipelines that can be safely diagnosed by an engineer on call who is tired and context-switching.
* **Brevity & Automation $\neq$ Clarity:** Saving lines of code or hiding build steps at the expense of readability is a bad tradeoff.
* **Optimize for Total Maintenance Hours:** System efficiency is measured in how fast a team can safely modify systems six months later, not in how clever the original author felt.