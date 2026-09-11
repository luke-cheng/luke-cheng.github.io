# Luke Cheng

[LinkedIn](https://www.linkedin.com/in/luke-cheng/) | [GitHub](https://github.com/Luke-Cheng)

## Experience

### Software Engineer | JPMorgan Chase, New York, NY

_Dec 2025 – Present_

- Contributed to the query side of a CQRS-style centralized customer data platform, building the Customer Summary Utility to consolidate customer information from multiple internal systems and serve 10M+ daily requests (~10K TPS) with p99 latency below 200 ms using Java, Spring Boot, Kafka, Cassandra, and CockroachDB.
- Implemented Change Data Capture (CDC) to propagate database changes through lightweight Kafka events rather than transmitting full customer payloads, reducing messaging overhead and enabling lower-latency updates to the customer read model.
- Implemented reactive Kafka consumers with batch processing to asynchronously process customer-data changes at high throughput, keeping the query-side data model synchronized while reducing coupling between upstream systems and the customer-facing API.
- Supported the platform’s transition to Kubernetes-based infrastructure as traffic increased, improving horizontal scalability, deployment consistency, and operational reliability for high-throughput services.
- Expanded automated testing across diverse customer datasets—including addresses, phone numbers, account-to-customer relationships, account identifiers, and card data—using JUnit and Cucumber, providing regression coverage for data-processing paths that could not be reliably exercised through UAT alone.
- Extended the API and underlying data model to support multiple physical and virtual card numbers associated with a single account, enabling customer-data services to accommodate mobile-wallet and virtual-card use cases without relying on one-to-one account-to-card mappings.
- Standardized deployment configuration across environments to improve consistency between test and production, reducing environment-specific configuration issues and increasing confidence in production releases.
- Implemented Dynatrace SaaS observability to provide application and service-level visibility across the distributed platform, enabling developers to identify performance and health issues before diving into detailed Splunk logs.
- Improved release safety through Helm-based Canary deployment and rollback strategies within Jenkins CI/CD pipelines, enabling controlled production releases and faster recovery from deployment issues.
- Helped maintain operational continuity during a team transition by troubleshooting Kubernetes deployments, CI/CD workflows, configuration issues, and legacy service behavior while documenting system knowledge for continued development and support.

### Co-Founder | MOYU LLC, Pittsburgh, PA

_Feb 2023 – Jan 2024_

- Founded an early-stage startup exploring semantic version control for CAD/BIM assets, addressing workflow limitations for complex engineering design files.
- Developed cross-platform visualization and revision-diff tooling using Next.js, Electron, and Three.js for large-scale 2D and 3D architectural models.
- Researched multimodal computer vision and geometric reasoning techniques for engineering design understanding to inform product strategy.

### Graduate Software Developer | University of Pittsburgh Medical Center, Pittsburgh, PA

_Feb 2023 – Jan 2024_

- Built a HIPAA-compliant clinical analytics platform by translating requirements from 50+ clinicians into scalable healthcare software using Java, Spring Boot, MySQL, FHIR APIs, and AWS.
- Developed Python NLP pipelines using spaCy, NLTK, and custom information extraction techniques to convert unstructured clinical notes into structured medical knowledge.
- Designed semantic indexing and intelligent clinical search workflows to improve retrieval of medical information.
- Deployed secure cloud infrastructure supporting high availability, regulatory compliance, and scalable healthcare data processing.

### Research Scientist | ChemPacific Corp, Baltimore, MD

_May 2021 – May 2022_

- Applied data science techniques to laboratory manufacturing datasets, building Python workflows that improved process visibility and operational decision-making.
- Designed automated laboratory data pipelines integrating Agilent analytical instrumentation with enterprise systems, improving traceability and reducing manual processing.
- Performed statistical analysis, data validation, and process optimization across large experimental datasets supporting manufacturing quality and scientific research.
- Automated laboratory workflows using Python and PowerShell, eliminating repetitive manual tasks and saving 150+ hours annually while maintaining GMP and NMPA compliance.

## Education

### Master of Science in Computer & Information Science | University of Pittsburgh

_Aug 2022 – May 2024_

### Bachelor of Science in Chemistry and Philosophy | Virginia Tech

_Aug 2016 – Dec 2020_

## Personal Projects

### Small-Form-Factor PC Checker | Next.js, Vercel, Google Cloud

- Developed a web app and Chrome extension to verify SFF PC part compatibility using AI-driven manual parsing and Google Custom Search.

### Android Morse Code Keyboard | Android, Java, Kotlin, Jetpack Compose

- Designed a custom Android IME to support Morse code learning with haptic feedback and accessible UI.

### Cryptography & Twofish Encryption | Java

- Implemented cryptographic algorithms with an emphasis on security principles and clean object-oriented software design.

### Paint Sales Demand Forecasting | R, Python

- Developed predictive machine learning models on PPG Industries datasets, applying feature engineering and sales forecasting to guide inventory planning.

### Screeps Doc/API Localization | Git, GitHub Actions

- Led an open-source initiative to translate Screeps API documentation into Chinese (zh-CN), building automated GitHub Actions CI/CD workflows for validation.

## Leadership & Activities

- **CyberForce Competition Team Lead**: Led University of Pittsburgh team, securing infrastructure and hardening defenses against simulated cyberattack scenarios.
- **Virginia Tech Parkour Club Treasurer**: Managed club finances, secured 60% gym discounts for members, and navigated leadership transitions during COVID-19.
- **Games4SocialImpact Winner**: Recognized with First Penguin Award for "Bon Voyage".
- **Founder of Screeps China**: Spearheaded open-source API and documentation localization for the Chinese developer community.

## Interests & Hobbies

- **Skiing**: Active meditation and outdoor focus.
- **Philosophy**: Critical thinking, ethics, and epistemology.
- **Gaming & Simulation**:
  - _Automation & Systems_: Screeps, Factorio (modular design, programmatic problem-solving).
  - _Resource Management_: Oxygen Not Included (prioritization and system balance under constraints).
  - _Narrative & Ethics_: This War of Mine, Papers, Please (high-stakes decision-making and ethical dilemmas).
  - _Visual & Interactive Design_: Return of the Obra Dinn, What Remains of Edith Finch (deduction, atmosphere, and visual storytelling).
