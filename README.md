# JustText — Text-to-Learn

JustText turns any topic into a complete, structured course. A user types a subject, and the app generates a curriculum of modules and lessons. Each lesson's actual content — explanations, code examples, a quiz, and a video suggestion — is generated on demand when the user opens it, rather than all at once. Lessons can be exported as PDFs.

The interface is designed around a single-input, chat-style pattern (a top navbar, no sidebar) similar to GPT/Claude, since the core interaction is "type what you want, get structured content back."

## Core features

- **Course generation** — a topic prompt produces a full curriculum: modules, each containing lessons
- **On-demand lesson generation** — lesson content (headings, paragraphs, code, quiz, video) is written only when a user opens that specific lesson
- **Interactive quizzes** — multiple-choice questions embedded in lesson content, with instant right/wrong feedback and explanations
- **Code blocks** — syntax-highlighted, with copy-to-clipboard
- **PDF export** — download a generated lesson as a PDF
- **Authentication** — register/login, JWT-based, protected routes for all course/lesson content
- **Course library** — a dedicated page listing all of a user's generated courses, separate from the course-generation prompt

## Tech stack

**Frontend** (`client/`)
- React (Vite)
- React Router
- Tailwind CSS, with a CSS custom-property token system for theming (colors, type, spacing all centralized in one file)
- Axios for API calls
- react-syntax-highlighter for code blocks
- jsPDF + html2canvas for PDF export

**Backend** (`server/`)
- Node.js + Express
- MongoDB Atlas (Mongoose)
- Groq API (`llama-3.3-70b-versatile`) for course outline and lesson content generation, prompted to return structured JSON
- JWT for authentication
- YouTube Data API v3 for video suggestions per lesson

## Project structure

```
text-to-learn-main/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # prompt box — generate a new course
│   │   │   ├── CoursesPage.jsx      # list of all the user's courses
│   │   │   ├── CoursePage.jsx       # one course's modules/lessons (accordion)
│   │   │   ├── LessonPage.jsx       # one lesson's content, generate/export actions
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # top nav — Home / Courses / profile dropdown
│   │   │   ├── ProtectedRoute.jsx   # redirects to /login if not authenticated
│   │   │   ├── LessonRenderer.jsx   # maps lesson content blocks to components
│   │   │   └── blocks/
│   │   │       ├── HeadingBlock.jsx
│   │   │       ├── ParagraphBlock.jsx
│   │   │       ├── CodeBlock.jsx
│   │   │       ├── MCQBlock.jsx
│   │   │       └── VideoBlock.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # user state, login/logout, localStorage-backed
│   │   ├── utils/
│   │   │   └── api.js               # axios instance, all backend calls
│   │   ├── App.jsx                  # routes
│   │   ├── main.jsx                 # entry point
│   │   └── index.css                # Tailwind directives + design tokens
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # register / login logic
│   │   ├── courseController.js      # generate / list / get / delete courses
│   │   └── lessonController.js      # get lesson, generate lesson content
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Module.js
│   │   └── Lesson.js
│   ├── routes/
│   │   ├── authRoutes.js            # POST /register, /login
│   │   ├── courseRoutes.js
│   │   └── lessonRoutes.js
│   ├── services/
│   │   └── aiService.js             # Groq API calls, prompt templates
│   ├── utils/
│   │   └── generateToken.js         # JWT signing
│   ├── package.json
│   └── server.js                    # entry point, route mounting, CORS
│
└── README.md
```

## How a course flows through the app

1. **Home** — user types a topic, submits. Backend calls Groq to generate a course outline (title, description, tags, 4 modules × 3 lessons each), saves it to MongoDB, returns the new course's id. User is redirected to that course.
2. **CoursesPage** — separately, lists every course the user has generated, each as a card with module/lesson counts and delete option.
3. **CoursePage** — shows one course's full curriculum as an accordion. Each lesson row shows whether its content has already been generated ("Ready") or not ("Generate").
4. **LessonPage** — the actual reading view. If content hasn't been generated yet, shows a "Generate lesson content" action; once generated, renders the content blocks (heading/paragraph/code/quiz/video) and offers Regenerate and Export PDF.

## Backend request flow

Each API request flows: **route → middleware (auth check) → controller → model/service**.

- `routes/` define the endpoint paths and which controller handles each
- `middlewares/authMiddleware.js` verifies the JWT before a request reaches protected controllers
- `controllers/` hold the actual logic — validating input, calling `aiService.js` for generation, reading/writing via Mongoose models
- `models/` define the MongoDB schemas (User, Course, Module, Lesson)
- `services/aiService.js` is the only place that talks to the Groq API

## Data model (high level)

- **User** — name, email, hashed password
- **Course** — title, description, tags, owner (user ref), array of modules
- **Module** — title, array of lessons
- **Lesson** — title, `isEnriched` flag, objectives, content (array of typed blocks: heading/paragraph/code/mcq/video)

## Deployment

- Backend deployed on Render (`server/` as root, `node server.js` as start command)
- Frontend deployed on Vercel (`client/` as root, Vite build)
- Environment variables (MongoDB URI, Groq API key, JWT secret, YouTube API key, frontend API URL) are set in each platform's dashboard, not committed to the repo
