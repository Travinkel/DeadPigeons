# Knowledge Domains — Conceptual Analysis

## Introduction

This document provides a comprehensive conceptual analysis of the knowledge domains that underpin the Dead Pigeons project. Knowledge domains represent distinct areas of technical competency required to design, develop, deploy, and maintain the distributed web application. Each domain corresponds to specific learning outcomes from the third-semester curriculum, spanning Systems Development II (SDE2), Programming II (PROG), CDS Security, and CDS Networking.

The purpose of this analysis is fourfold:

1. **Conceptual clarity:** Define what each domain encompasses and its boundaries
2. **Interdependency mapping:** Explain how domains relate and depend upon each other
3. **Curriculum alignment:** Connect domains to specific course weeks and learning objectives
4. **Traceability:** Map domains to project deliverables, MVP scope, and sprint activities

Understanding these domains holistically enables effective project planning, informed architectural decisions, and comprehensive exam preparation. The domains are not isolated silos but form an integrated system where decisions in one area ripple across others. Mastery of these domains demonstrates the professional competencies expected of a graduating computer science student.

---

## KD1 — Version Control & Collaboration

### Conceptual Overview

Version control is the foundational practice that enables collaborative software development. It provides a structured approach to tracking changes, managing concurrent work, and maintaining a complete history of the codebase evolution. Beyond mere file versioning, modern version control encompasses collaboration workflows, code review processes, and integration with automated systems.

### Significance in the Project

The Dead Pigeons project employs Git as the version control system, with GitHub as the collaboration platform. The project follows GitHub Flow, a lightweight branching strategy where feature branches are created from main, developed independently, reviewed via pull requests, and merged back to main. This workflow supports:

- **Atomic changes:** Each feature or fix is isolated in its own branch
- **Code review:** Pull requests enable peer review before integration
- **Audit trail:** Complete history of who changed what and why
- **Rollback capability:** Any commit can be reverted if issues arise
- **Parallel development:** Multiple features can progress simultaneously

### Curriculum Alignment

This domain aligns with SDE2 weeks 35-37:
- W35: Git fundamentals and branching
- W36: Pull requests, code review, merge conflict resolution
- W37: Branching workflows (Git Flow, GitHub Flow, GitLab Flow)

### Domain Boundaries

This domain covers branching strategies, commit practices, merge workflows, and collaboration patterns. It does not cover the content of commits (covered by other domains) but rather the process of managing and integrating changes.

### Interdependencies

Version control is prerequisite to CI/CD (KD2), as pipelines are triggered by commits and pull requests. It also enables Code Quality enforcement (KD3) through pre-commit hooks and supports Agile Process (KD14) through feature branch isolation.

---

## KD2 — CI/CD & Automation

### Conceptual Overview

Continuous Integration and Continuous Delivery (CI/CD) automate the build, test, and deployment pipeline. CI ensures that code changes integrate correctly with the existing codebase, while CD extends this to automated deployment. The fundamental principle is that every change should be validated automatically, providing rapid feedback and reducing the risk of integration problems.

### Significance in the Project

The project uses GitHub Actions to implement CI/CD. Every push and pull request triggers a pipeline that:

- Restores dependencies and builds the solution
- Executes unit and integration tests
- Validates code quality (linting, formatting, type checking)
- Scans for secrets
- Generates and verifies the API client
- Performs deployment (when applicable)

This automation serves as the primary quality gate, ensuring that only validated code reaches the main branch. The pipeline provides rapid feedback, catching issues before they propagate and reducing the cost of defect remediation.

### Curriculum Alignment

This domain aligns with SDE2 weeks 38-39 and 45:
- W38: CI/CD introduction, GitHub Actions fundamentals
- W39: Full-stack CI workflows
- W45: Smoke testing and sanity checks

### Domain Boundaries

This domain encompasses pipeline design, job orchestration, artifact management, and deployment automation. It does not include the tools being automated (testing, linting) but rather the orchestration of those tools.

### Interdependencies

CI/CD depends on Version Control (KD1) for triggers and Code Quality (KD3) for validation steps. It supports Testing Strategy (KD6) by providing the execution environment and enables Deployment (KD9) through automated release pipelines.

---

## KD3 — Code Quality (Linting, Formatting, Hooks)

### Conceptual Overview

Code quality practices establish and enforce consistent standards across the codebase. This includes static analysis (linting), code formatting, commit message conventions, and automated enforcement through Git hooks. The goal is to catch issues as early as possible in the development lifecycle, ideally before code leaves the developer's machine.

### Significance in the Project

The project implements multiple code quality tools:

- **ESLint:** Static analysis for TypeScript/React code, catching potential bugs and enforcing best practices
- **Prettier:** Consistent code formatting, eliminating style debates
- **commitlint:** Conventional commit message enforcement, enabling automated changelog generation
- **secretlint:** Secret detection to prevent credential leaks
- **Husky:** Git hook management for pre-commit validation
- **lint-staged:** Run linters only on staged files for performance

These tools shift quality enforcement left, catching issues at commit time rather than in code review or production. Conventional commits enable semantic versioning and automated release notes.

### Curriculum Alignment

This domain aligns with SDE2 weeks 40 and 43:
- W40: Linting and formatting (ESLint configuration, custom rules)
- W43: Git hooks (Husky, lint-staged, commitlint, secretlint)

### Domain Boundaries

This domain covers static analysis, formatting rules, commit conventions, and hook configuration. It does not include runtime quality (testing) or security vulnerabilities beyond secret detection.

### Interdependencies

Code Quality integrates with Version Control (KD1) through Git hooks and CI/CD (KD2) as pipeline steps. It complements Testing Strategy (KD6) by catching syntactic and stylistic issues that tests do not address.

---

## KD4 — Code Generation & Scaffolding

### Conceptual Overview

Code generation automates the creation of boilerplate code, reducing manual effort and ensuring consistency. Scaffolding provides project structure templates that establish architectural patterns from the start. These practices improve developer productivity while reducing the risk of human error in repetitive tasks.

### Significance in the Project

The project uses NSwag to generate a TypeScript API client from the OpenAPI specification. This ensures:

- **Type safety:** Client code matches server contracts exactly at compile time
- **Contract synchronization:** Changes to API automatically propagate to client
- **Reduced boilerplate:** No manual HTTP client code required
- **Documentation:** OpenAPI serves as living API documentation

The generated client is treated as a build artifact, regenerated when API contracts change and validated in CI to detect drift. This approach eliminates an entire category of runtime errors caused by client-server contract mismatches.

### Curriculum Alignment

This domain aligns with SDE2 week 41 and PROG throughout:
- SDE2 W41: Code generation and scaffolding (Plop.js, generators)
- PROG: swagger-typescript-api, NSwag TypeScript generation

### Domain Boundaries

This domain covers OpenAPI specification, client generation, and template-based scaffolding. It does not include the implementation of the API itself (KD8) but rather the tooling that bridges API and client.

### Interdependencies

Code Generation depends on Web API (KD8) as the source of truth and produces artifacts consumed by Web Frontend (KD7). CI/CD (KD2) validates generation consistency.

---

## KD5 — Environments & Configuration Management

### Conceptual Overview

Environment and configuration management addresses how applications adapt to different deployment contexts (development, testing, staging, production) without code changes. This includes environment variables, configuration files, secrets management, and the twelve-factor app methodology. The principle is that configuration should be strictly separated from code.

### Significance in the Project

The project separates configuration from code through:

- **Environment variables:** Database connections, API keys, feature flags
- **Configuration files:** appsettings.json with environment-specific overrides
- **.env files:** Local development configuration (not committed to version control)
- **Secrets management:** Sensitive values never in version control
- **Validation:** Runtime validation of required configuration

This separation enables the same codebase to run in different environments with appropriate configuration. The twelve-factor app methodology provides a principled framework for this separation.

### Curriculum Alignment

This domain aligns with SDE2 week 44 and CDS.Security week 38:
- SDE2 W44: Environments and configuration management (Envalid, Zod)
- CDS.Security W38: Managing secrets, environment variables

### Domain Boundaries

This domain covers configuration sources, environment detection, and secrets handling. It does not include the infrastructure that hosts these environments (KD9) but rather how applications consume configuration.

### Interdependencies

Configuration Management supports Deployment (KD9) by enabling environment-specific behavior and Application Security (KD12) by keeping secrets out of code. CI/CD (KD2) uses configuration for test environments.

---

## KD6 — Testing Strategy (Unit, Integration, Smoke)

### Conceptual Overview

Testing strategy defines what to test, how to test, and when to test. It encompasses the testing pyramid (unit, integration, end-to-end), test design principles, test data management, and test execution contexts. A comprehensive testing strategy balances confidence with execution speed and maintenance cost.

### Significance in the Project

The project implements a layered testing strategy:

- **Unit tests:** Isolated logic testing without dependencies, run locally with mocked dependencies
- **Integration tests:** Database and API testing with Testcontainers, run in CI where Docker is available
- **Smoke tests:** Basic health checks after deployment to verify system operability

Testcontainers provides real PostgreSQL instances for integration tests, ensuring tests reflect production behavior. The test strategy accounts for environmental constraints, with Docker-dependent tests running only in CI due to development environment limitations.

### Curriculum Alignment

This domain aligns with SDE2 and PROG testing modules:
- SDE2 W45: Smoke testing and sanity testing
- PROG: XUnit, Testcontainers, dependency injection in tests, test-driven development

### Domain Boundaries

This domain covers test design, test frameworks, test data management, and test environment setup. It does not include the systems under test but rather the practices for validating them.

### Interdependencies

Testing Strategy is executed by CI/CD (KD2), validates Web API (KD8) and Web Frontend (KD7), and requires Environments (KD5) for test configuration. It contributes to Application Security (KD12) through security-focused test cases.

---

## KD7 — Web Frontend (React + TypeScript)

### Conceptual Overview

The web frontend domain encompasses client-side application development, including component architecture, state management, routing, styling, and user interface design. Modern frontend development emphasizes component-based architecture, type safety, and declarative UI patterns.

### Significance in the Project

The Dead Pigeons client is built with React and TypeScript, using Vite as the build tool. Key architectural decisions include:

- **TypeScript:** Static typing for maintainability, refactoring confidence, and tooling support
- **React Router:** Client-side routing for single-page application behavior with data loading patterns
- **Component architecture:** Reusable, composable UI elements with clear props contracts
- **State management:** Local state with useState, global state with Jotai atoms
- **Generated API client:** Type-safe communication with backend via NSwag-generated code
- **UI library:** DaisyUI/Tailwind CSS for consistent, accessible styling

The frontend consumes the NSwag-generated client, ensuring compile-time validation of API contracts and eliminating runtime type errors.

### Curriculum Alignment

This domain aligns with PROG weeks 33-34 and throughout:
- W33: React fundamentals (components, props, events, API communication)
- W34: UI frameworks, state management, deployment
- Throughout: React Router, Jotai, TypeScript patterns

### Domain Boundaries

This domain covers component design, state management, routing, styling, and client-server communication. It does not include the API implementation (KD8) but rather the client that consumes it.

### Interdependencies

Web Frontend consumes artifacts from Code Generation (KD4), is validated by Testing Strategy (KD6), and interacts with Auth (KD10) for session management. It is served by Deployment (KD9) infrastructure.

---

## KD8 — Web API & Data Layer (.NET + EF + SQL)

### Conceptual Overview

The Web API and data layer domain covers server-side application development, including HTTP API design, business logic implementation, and database persistence. This encompasses RESTful principles, object-relational mapping, query patterns, and data validation.

### Significance in the Project

The Dead Pigeons API is built with ASP.NET Core and Entity Framework Core, using PostgreSQL as the database. The architecture follows:

- **Layered separation:** API controllers, application services, data access layer
- **EF Core:** Object-relational mapping with migrations and fluent configuration
- **Repository/service pattern:** Abstraction over data access for testability
- **Domain model:** Entities representing business concepts (Player, Board, Game, Transaction)
- **DTOs:** Separate models for API contracts, preventing circular references
- **Data validation:** Server-side validation with data annotations

The API exposes OpenAPI documentation via Swagger, serving as the contract for client generation. All endpoints follow RESTful conventions with appropriate HTTP methods and status codes.

### Curriculum Alignment

This domain aligns with PROG weeks 35-41:
- W35-36: .NET Web API, controllers, dependency injection, validation
- W37: Entity Framework with scaffolding
- W38-40: Full-stack project integrating all concepts
- W41: Advanced querying (pagination, ordering)

### Domain Boundaries

This domain covers API design, request handling, business logic, data modeling, and database operations. It does not include deployment (KD9) or client consumption (KD7).

### Interdependencies

Web API produces the OpenAPI specification consumed by Code Generation (KD4), is validated by Testing Strategy (KD6), and implements Auth (KD10) and Authorization (KD11). It relies on Environments (KD5) for configuration.

---

## KD9 — Deployment & Cloud

### Conceptual Overview

Deployment and cloud encompasses the infrastructure, platforms, and processes for running applications in production environments. This includes containerization, cloud services, infrastructure as code, and operational concerns like monitoring and scaling.

### Significance in the Project

The project targets deployment on Fly.io with:

- **Containerization:** Docker images for consistent deployment across environments
- **Multi-stage builds:** Optimized container images with minimal footprint
- **Reverse proxy:** Nginx for TLS termination and routing
- **Managed database:** PostgreSQL as a service
- **Static hosting:** Client assets served efficiently

Containerization ensures environment parity between development and production, eliminating "works on my machine" issues. The deployment process is automated through CI/CD pipelines.

### Curriculum Alignment

This domain aligns with CDS.Security weeks 37-38 and 44-45:
- W37: Docker containers
- W38: Deployment to cloud (Fly.io)
- W44-45: Cloud providers and services

### Domain Boundaries

This domain covers infrastructure provisioning, container orchestration, cloud platforms, and deployment pipelines. It does not include application code but rather the platforms that run it.

### Interdependencies

Deployment receives artifacts from CI/CD (KD2), uses configuration from Environments (KD5), and hosts Web API (KD8) and Web Frontend (KD7). It implements Infrastructure Security (KD13).

---

## KD10 — Auth & Session Management

### Conceptual Overview

Authentication and session management address user identity verification and session lifecycle. This includes credential validation, secure password storage, token issuance, and session persistence. The fundamental question is: "Who is this user?"

### Significance in the Project

The project implements JWT-based authentication:

- **Password security:** Argon2 or bcrypt hashing with salting
- **Token-based:** Stateless authentication via JSON Web Tokens
- **Claims:** User identity and roles encoded in tokens
- **Session lifecycle:** Token expiration, refresh mechanisms
- **Secure storage:** Appropriate token storage on client (httpOnly cookies or secure local storage)

Authentication establishes user identity, which authorization (KD11) then uses to control access. The separation between authentication (identity) and authorization (permissions) is fundamental.

### Curriculum Alignment

This domain aligns with CDS.Security weeks 39-40:
- W39: Authentication, password strength, secure hashing
- W40: Session management, JWT vs cookies

### Domain Boundaries

This domain covers credential verification, token generation, session state, and identity providers. It does not include access control decisions (KD11) but rather identity establishment.

### Interdependencies

Auth is implemented in Web API (KD8), consumed by Web Frontend (KD7), and enables Authorization (KD11). It contributes to Application Security (KD12) as a primary defense layer.

---

## KD11 — Authorization & Access Control

### Conceptual Overview

Authorization determines what authenticated users are permitted to do. This includes role-based access control (RBAC), permissions, policy-based authorization, and enforcement mechanisms. The fundamental question is: "What can this user do?"

### Significance in the Project

The project implements role-based authorization:

- **Roles:** Admin and Player with distinct permissions
- **Policies:** Declarative rules applied to endpoints via attributes
- **Claims:** User roles embedded in JWT tokens
- **Enforcement:** Server-side validation on every request
- **Resource-based:** Users can only access their own data

Authorization ensures that players cannot access admin functions, that users can only modify their own data, and that unauthenticated users cannot access protected resources.

### Curriculum Alignment

This domain aligns with CDS.Security week 41:
- W41: Authorization, policy-based access control, protecting endpoints

### Domain Boundaries

This domain covers access control models, policy definition, and permission checking. It does not include identity verification (KD10) but rather access decisions based on identity.

### Interdependencies

Authorization depends on Auth (KD10) for identity, is implemented in Web API (KD8), and contributes to Application Security (KD12). It informs UI behavior in Web Frontend (KD7) for conditional rendering.

---

## KD12 — Application Security (Web & OWASP)

### Conceptual Overview

Application security addresses vulnerabilities in application code and design. This includes the OWASP Top 10 vulnerabilities, secure coding practices, input validation, output encoding, and security testing. The attacker's mindset is essential: understanding how systems can be compromised enables building defenses.

### Significance in the Project

The project addresses application security through:

- **Input validation:** Server-side validation of all inputs with data annotations
- **Parameterized queries:** EF Core prevents SQL injection by design
- **Output encoding:** React prevents XSS by default through JSX escaping
- **CSRF protection:** Token-based APIs are inherently protected
- **Secret scanning:** Automated detection of leaked credentials in code
- **Secure headers:** Appropriate HTTP security headers

Security is not an afterthought but integrated into development practices and CI pipelines. The OWASP Top 10 provides a framework for prioritizing security efforts.

### Curriculum Alignment

This domain aligns with CDS.Security week 43:
- W43: Web security, OWASP vulnerabilities, SQL injection, XSS, IDOR, Burp Suite

### Domain Boundaries

This domain covers vulnerability prevention, secure coding, and security testing. It does not include infrastructure security (KD13) but rather application-level defenses.

### Interdependencies

Application Security builds on Auth (KD10) and Authorization (KD11), is validated by Testing Strategy (KD6), and is enforced by Code Quality (KD3) through secret scanning.

---

## KD13 — Infrastructure Security & Virtualization

### Conceptual Overview

Infrastructure security addresses the security of systems and networks that host applications. This includes network security, container security, platform hardening, and virtualization. The principle of defense in depth applies: multiple layers of security provide redundancy.

### Significance in the Project

The project implements infrastructure security through:

- **TLS encryption:** All traffic encrypted via HTTPS
- **Container isolation:** Docker containers limit blast radius
- **Minimal images:** Reduced attack surface through multi-stage builds
- **Network policies:** Container networking limits exposure
- **Secrets management:** Environment variables, not files in images
- **Platform security:** Fly.io manages infrastructure patching

Infrastructure security complements application security, providing defense in depth even if application-level controls fail.

### Curriculum Alignment

This domain aligns with CDS.Security weeks 36-37:
- W36: Virtualization fundamentals
- W37: Docker and containerization

### Domain Boundaries

This domain covers network security, platform security, container security, and virtualization. It does not include application vulnerabilities (KD12) but rather the infrastructure that hosts applications.

### Interdependencies

Infrastructure Security is implemented in Deployment (KD9), supports Auth (KD10) through secure transport, and complements Application Security (KD12).

---

## KD14 — Agile Process & Sprint Management

### Conceptual Overview

Agile process encompasses the methodologies, ceremonies, and artifacts used to manage software development iteratively. This includes Scrum practices (sprints, backlogs, reviews, retrospectives), user story creation, estimation, and continuous improvement.

### Significance in the Project

The project follows Scrum-inspired agile practices:

- **Sprint planning:** Time-boxed iterations with clear goals
- **Product backlog:** Prioritized list of features and improvements
- **Sprint backlog:** Committed work for current sprint
- **User stories:** Requirements expressed from user perspective
- **Acceptance criteria:** Definition of done for each story
- **Sprint review:** Demonstration of completed work
- **Retrospective:** Continuous process improvement

These practices enable adaptive planning, early delivery, and continuous improvement while maintaining alignment with stakeholder needs.

### Curriculum Alignment

This domain aligns with SDE2 course structure and exam project requirements:
- Sprint-based delivery model
- User story format for requirements
- Definition of done criteria

### Domain Boundaries

This domain covers process management, sprint planning, and team coordination. It does not include technical implementation but rather the process of managing development work.

### Interdependencies

Agile Process depends on Version Control (KD1) for branch-per-feature workflows and CI/CD (KD2) for sprint validation. It drives all other domains through prioritized delivery.

---

## KD15 — Domain Modeling & Business Logic

### Conceptual Overview

Domain modeling addresses the representation of business concepts in software. This includes entity design, relationship modeling, business rules, and the translation of real-world processes into code. Domain-driven design principles inform this domain.

### Significance in the Project

The Dead Pigeons domain model represents the game system:

- **Player:** Game participants with balance tracking
- **Transaction:** Financial movements for audit trails
- **Board:** Purchased number selections for games
- **Game:** Weekly draws with winning numbers
- **Relationships:** One-to-many, many-to-many with junction tables
- **Business rules:** Balance calculation, board validation, game state transitions

The domain model is the foundation upon which all features are built. Accurate modeling of business concepts ensures the software correctly implements the real-world process.

### Curriculum Alignment

This domain aligns with PROG data modeling and EF Core modules:
- Entity design and relationships
- Business rule implementation
- Data validation and constraints

### Domain Boundaries

This domain covers entity design, relationship modeling, and business rule implementation. It does not include persistence mechanisms (covered by KD8) but rather the conceptual model.

### Interdependencies

Domain Modeling is implemented in Web API (KD8), validated by Testing Strategy (KD6), and documented through Documentation (KD16).

---

## KD16 — Documentation & Technical Communication

### Conceptual Overview

Documentation and technical communication address how technical information is captured, organized, and presented. This includes the Diátaxis framework (tutorials, how-to guides, explanations, references), architecture decision records (ADRs), and project documentation.

### Significance in the Project

The project follows structured documentation practices:

- **Diátaxis framework:** Four-quadrant documentation model
- **ADRs:** Capturing significant technical decisions with context and consequences
- **README:** Project overview and quick start
- **CLAUDE.md:** AI assistant guidance
- **Sprint documentation:** Epics, reviews, retrospectives
- **API documentation:** OpenAPI/Swagger specification

Good documentation reduces onboarding time, preserves institutional knowledge, and demonstrates professional competency.

### Curriculum Alignment

This domain aligns with exam project requirements:
- Documented architecture decisions
- Clear project documentation
- Security policy documentation

### Domain Boundaries

This domain covers documentation structure, content organization, and technical writing. It does not include the technical content itself but rather how it is communicated.

### Interdependencies

Documentation supports all other domains by capturing decisions and rationale. It depends on Domain Modeling (KD15) for accurate technical descriptions.

---

## KD17 — Object-Relational Mapping & Data Access Patterns

### Conceptual Overview

Object-relational mapping (ORM) bridges the impedance mismatch between object-oriented programming and relational databases. This includes entity mapping, query patterns, change tracking, migrations, and performance optimization.

### Significance in the Project

The project uses Entity Framework Core as the ORM:

- **Entity mapping:** Fluent API configuration for entities
- **Migrations:** Version-controlled schema changes
- **LINQ queries:** Type-safe database queries
- **Change tracking:** Automatic detection of entity modifications
- **Eager/lazy loading:** Control over relationship loading
- **Query optimization:** Efficient queries with proper includes and projections

EF Core abstracts database operations while providing escape hatches for raw SQL when needed. Proper use of the ORM prevents common pitfalls like N+1 queries and excessive database roundtrips.

### Curriculum Alignment

This domain aligns with PROG Entity Framework modules:
- W37: EF Core scaffolding and reverse engineering
- W38-40: Query patterns, DTOs, mapping
- W41-44: Advanced querying (pagination, ordering, Sieve)

### Domain Boundaries

This domain covers ORM configuration, query patterns, and migration management. It does not include domain modeling (KD15) but rather the persistence of that model.

### Interdependencies

ORM depends on Domain Modeling (KD15) for entity definitions and is validated by Testing Strategy (KD6). It is implemented within Web API (KD8).

---

## Domain Traceability

### Mapping to MVP Scope

The MVP requires functionality across all domains. The following table shows how domains contribute to MVP requirements:

| MVP Requirement | Primary Domains | Supporting Domains |
|-----------------|-----------------|-------------------|
| Player Management | KD8, KD15 | KD6, KD10, KD11, KD17 |
| Balance Tracking | KD8, KD15 | KD6, KD12, KD17 |
| Board Purchasing | KD7, KD8, KD15 | KD4, KD6, KD17 |
| Game Management | KD8, KD15 | KD6, KD11, KD17 |
| Authentication | KD10 | KD8, KD12 |
| Authorization | KD11 | KD8, KD10 |
| Deployment | KD9 | KD2, KD5, KD13 |
| Testing | KD6 | KD2, KD17 |
| Documentation | KD16 | All |

### Mapping to Sprints

Each sprint addresses specific domains with varying emphasis:

| Sprint | Primary Domains | Focus Area |
|--------|-----------------|------------|
| Sprint 1 | KD1, KD2, KD4, KD6 | Walking Skeleton |
| Sprint 2 | KD3, KD5, KD14 | DevOps Hardening |
| Sprint 3 | KD8, KD15, KD17 | Data Model & First Endpoints |
| Sprint 4 | KD10, KD11, KD12 | Authentication & Security |
| Sprint 5 | KD7, KD8, KD15 | Core Domain & UI |
| Sprint 6 | KD9, KD13, KD16 | Deployment & Polish |

### Domain Progression

The domains follow a logical progression that reflects software engineering best practices:

1. **Foundation (Sprint 1-2):** KD1, KD2, KD3, KD5 establish development infrastructure
2. **Core (Sprint 3-5):** KD7, KD8, KD15, KD17 implement application functionality
3. **Security (Sprint 4):** KD10, KD11, KD12 add protection layers
4. **Operations (Sprint 6):** KD9, KD13 enable production deployment
5. **Continuous (All):** KD6, KD14, KD16 support ongoing quality

This progression ensures that supporting infrastructure exists before application development begins, security is addressed before deployment, and documentation accompanies all work.

### Mapping to Curriculum Weeks

| Domain | SDE2 Weeks | PROG Weeks | CDS.Security Weeks |
|--------|------------|------------|-------------------|
| KD1 | W35-37 | - | - |
| KD2 | W38-39, W45 | - | - |
| KD3 | W40, W43 | - | - |
| KD4 | W41 | W33-34 | - |
| KD5 | W44 | - | W38 |
| KD6 | W45 | W38-40 | - |
| KD7 | - | W33-34 | - |
| KD8 | - | W35-44 | - |
| KD9 | - | W34 | W37-38, W44-45 |
| KD10 | - | - | W39-40 |
| KD11 | - | - | W41 |
| KD12 | - | - | W43 |
| KD13 | - | - | W36-37 |

---

## Conclusion

The seventeen knowledge domains form an integrated framework for understanding the Dead Pigeons project. Each domain represents a distinct area of competency while maintaining clear relationships with other domains. This conceptual analysis provides the foundation for:

- **Architectural decisions:** Understanding domain boundaries prevents inappropriate coupling
- **Sprint planning:** Domains map to deliverables and learning objectives
- **Risk management:** Identifying domain dependencies reveals critical paths
- **Exam preparation:** Domains align with curriculum learning outcomes
- **Professional development:** Domains represent industry-standard competencies

The project serves as a practical demonstration of these domains working together in a real distributed application. Mastery of these domains, as evidenced by the working system and accompanying documentation, demonstrates readiness for professional software development.

---

## References

- OWASP Top 10: https://owasp.org/Top10/
- Twelve-Factor App: https://12factor.net/
- Diátaxis Documentation Framework: https://diataxis.fr/
- Conventional Commits: https://www.conventionalcommits.org/
- React Documentation: https://react.dev/
- ASP.NET Core Documentation: https://learn.microsoft.com/en-us/aspnet/core/
- Entity Framework Core: https://learn.microsoft.com/en-us/ef/core/
