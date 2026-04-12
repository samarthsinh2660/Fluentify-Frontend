# Fluentify — AI-Powered Language Learning Platform

Fluentify is a full-stack language learning platform that combines AI-generated courses, a knowledge graph engine, A* pathfinding recommendations, 3D concept visualization, and competitive contests into a single adaptive learning experience.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   React 19 Frontend                  │
│   Dashboard · Lessons · 3D Knowledge Graph · Admin   │
└─────────────────┬───────────────────────────────────┘
                  │ REST + SSE
┌─────────────────▼───────────────────────────────────┐
│              Node.js / Express 5 Backend             │
│  Course Gen · Progress · Recommendations · Contests  │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│                    PostgreSQL                         │
│  courses · concept_nodes · concept_edges ·           │
│  concept_mastery · recommendation_history            │
└─────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              Google Gemini AI                        │
│  Course generation · Concept extraction · Exercises  │
└─────────────────────────────────────────────────────┘
```

**Stack:**
- **Frontend:** React 19, Vite 7, TailwindCSS 4, React Query, reagraph, Three.js
- **Backend:** Node.js, Express 5.1, PostgreSQL (`pg`), Server-Sent Events
- **AI:** Google Gemini 2.0 Flash
- **Auth:** JWT, bcrypt
- **Deployment:** Docker + docker-compose (or Supabase for managed DB)

---

## Core Features

### AI Course Generation (Streaming)
Courses are generated on-demand by Gemini via Server-Sent Events — the learner watches units and lessons appear in real time. Each course is structured into units, lessons (vocabulary / grammar / conversation / review), exercises, key phrases, and XP rewards. Token limits and `responseMimeType: application/json` prevent truncation.

### Knowledge Graph + Concept Extraction
After a course is saved, a background job calls Gemini for each lesson to extract 1–3 granular learnable concepts (e.g. "Present Tense Conjugation", not just "Grammar"). The prompt instructs Gemini to infer concept type freely from content — ensuring vocabulary, grammar, conversation, and review nodes all appear — rather than inheriting the lesson's category blindly.

Extracted concepts are stored as nodes in `concept_nodes`. Edges between them are inferred by five rules:

| Rule | Description |
|---|---|
| Within-lesson | vocab → grammar → conversation → review |
| Same-type chain | sequential links within each type |
| Cross-type bridge | grammar bridges to conversation every 3 nodes |
| Review hub | each review node links back to 3 prior concepts |
| Difficulty escalation | low-difficulty node → nearest harder same-type node |

This produces a **web** of connections, not a chain, so the 3D force layout spreads into distinct clusters.

If concept extraction was missed at course creation, it is triggered on-demand the first time the knowledge graph or recommendations endpoint is called for that course.

### A* Recommendation Engine
The A* algorithm runs over the concept graph to compute the optimal learning path from the learner's current mastery state toward full course mastery. Each node's cost combines:

- **g(n):** accumulated mastery gap along the path so far
- **h(n):** estimated remaining effort (descendant count × difficulty × unmastered weight)

The top 3 nodes from the path surface as recommendations in the dashboard sidebar, each with urgency, reason, and estimated mastery time. Recommendations auto-refresh after every lesson completion or mastery update.

### Mastery Tracking
When a learner completes a lesson, mastery scores are calculated per concept type:

| Type | Score weight | Exercise weight |
|---|---|---|
| vocabulary | 40% | 60% |
| grammar | 35% | 65% |
| conversation | 50% | 50% |
| review | 45% | 55% |

**First completion** awards XP and marks the lesson done. **Retakes** (for already-completed lessons recommended due to low mastery) update only `concept_mastery` — no XP re-award, no duplicate completion.

### 3D Knowledge Graph Visualization
The learner's knowledge map renders in 3D using **reagraph** (React + Three.js force-directed layout). Nodes are colored by concept type and sized by mastery. Clicking a node highlights all its connected edges and neighbours. The A* recommended path is highlighted in gold with animated particles.

Admins see a 2D ReactFlow layout of any learner's graph via the user detail page, with the same mastery overlay and A* path.

### Remedial Content Generation
When A* surfaces a weak concept in an already-completed lesson, a background job checks whether to generate remedial exercises specifically targeting that concept's weak points.

### Competitive Contests
Timed language contests with MCQ and fill-in-the-blank questions. Admins can create contests manually or generate them with Gemini in seconds. Real-time leaderboards update on submission.

### Voice AI Practice
Integrated voice conversation using Retell AI for natural speaking practice with real-time feedback.

---

## Quick Start

### Option A — Docker (self-hosted database)

```bash
# Backend
cd Fluentify-Backend
cp .env.example .env          # fill in GEMINI_API_KEY, JWT_SECRET
docker-compose up --build     # starts PostgreSQL + API on :3000

# Frontend
cd Fluentify-Frontend
npm install
npm run dev                   # http://localhost:5173
```

### Option B — Supabase (managed database)

```bash
# Backend
cd Fluentify-Backend
cp .env.example .env
# Set DB_MODE=supabase, DATABASE_URL=<your-supabase-connection-string>
npm install
npm run dev                   # API on :3000

# Frontend
cd Fluentify-Frontend
npm install
npm run dev
```

### Environment Variables (Backend)

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `DB_MODE` | No | `docker` or `supabase` (default: `supabase`) |
| `DATABASE_URL` | Supabase | Full Postgres connection string |
| `DB_HOST` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_PORT` | Docker | Individual connection params |
| `RETELL_API_KEY` | No | Retell AI for voice practice |

---

## API Reference

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register learner or admin |
| POST | `/api/auth/login` | Login, returns JWT |

### Courses
| Method | Path | Description |
|---|---|---|
| GET | `/api/courses` | List learner's courses |
| POST | `/api/courses/generate/stream` | Generate course (SSE stream) |
| GET | `/api/courses/:courseId` | Course detail with progress |
| GET | `/api/courses/:courseId/units/:unitId/lessons/:lessonId` | Lesson detail |

### Progress
| Method | Path | Description |
|---|---|---|
| POST | `/api/progress/courses/:courseId/units/:unitId/lessons/:lessonId/complete` | Mark lesson complete (first time, awards XP) |
| POST | `/api/progress/courses/:courseId/units/:unitId/lessons/:lessonId/retry` | Retake quiz, updates mastery only |
| GET | `/api/progress/courses/:courseId` | Full course progress |

### Knowledge Graph & Recommendations
| Method | Path | Description |
|---|---|---|
| GET | `/api/recommendations/:courseId` | Run A* and return top recommendations |
| GET | `/api/recommendations/:courseId/graph` | Full concept graph with mastery overlay |
| GET | `/api/recommendations/:courseId/mastery` | Mastery breakdown by type |
| POST | `/api/recommendations/:courseId/rebuild-graph` | Delete and re-extract concept graph with Gemini |
| POST | `/api/recommendations/:courseId/follow` | Mark a recommendation as followed |

### Admin
| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | List all learners |
| GET | `/api/users/:id` | Learner detail + stats |
| PUT | `/api/users/:id` | Edit learner |
| DELETE | `/api/users/:id` | Delete learner + all data |
| GET | `/api/recommendations/:courseId/graph?learnerId=X` | Admin: view any learner's knowledge graph |

### Contests
| Method | Path | Description |
|---|---|---|
| GET | `/api/contests` | List published contests |
| POST | `/api/contests/generate` | AI-generate a contest |
| POST | `/api/contests/:id/submit` | Submit answers |
| GET | `/api/contests/:id/leaderboard` | Contest leaderboard |

---

## Learner Flow

```
Sign up → Set preferences → Generate course (streaming)
  → Study lesson (vocabulary / grammar / exercises)
  → Submit quiz → Score calculated → Lesson marked complete
  → Concept mastery updated
  → A* re-runs → Dashboard shows next recommended concept
  → Click recommendation → Navigate directly to lesson
  → If already completed: Retake quiz → Mastery updated
  → Knowledge graph reflects updated mastery in 3D
```

## Admin Flow

```
Login as admin → Admin Dashboard
  → User Management → select learner
    → View profile (XP, streak, lessons)
    → Enrolled Courses tab
    → Knowledge Graph tab → select course → 2D concept graph with mastery overlay
  → Contest Management → generate with AI or create manually
    → Publish → learners can participate → view leaderboard
```

---

## Supported Languages

Spanish · French · German · Italian · Japanese · Hindi

---

## Project Structure

```
Fluentify-Backend/
├── src/
│   ├── config/          # DB connection (Supabase + Docker modes)
│   ├── controllers/     # courseController, progressController, recommendationController
│   ├── services/        # geminiService, astarService, conceptExtractionService
│   ├── repositories/    # courseRepository, progressRepository, knowledgeGraphRepository
│   ├── routes/          # Express routers
│   ├── utils/           # masteryUtils, response helpers
│   └── database/        # schema.sql, migrations
├── docker-compose.yml
└── .env.example

Fluentify-Frontend/
├── src/
│   ├── api/             # fetch wrappers (courses, recommendations, userManagement)
│   ├── hooks/           # useCourses, useRecommendations, useAuth
│   ├── modules/
│   │   ├── learner/
│   │   │   ├── dashboard/       # Dashboard + RecommendationPanel
│   │   │   ├── courses/         # CourseCard, LessonPage (quiz + retry flow)
│   │   │   └── knowledge/       # KnowledgeMapPage (reagraph 3D)
│   │   └── admin/
│   │       ├── dashboard/       # AdminDashboard
│   │       ├── users/           # UserManagementPage, UserDetailsPage
│   │       └── knowledge/       # KnowledgeGraphViewer (ReactFlow 2D)
│   ├── components/      # Button, PageHeader, Skeleton, VoiceAIModal
│   └── contexts/        # StreamingContext, AuthContext
```

---

## License

MIT
