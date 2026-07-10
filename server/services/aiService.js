import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

function getClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

async function askAI(prompt) {
  const groq = getClient();
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 3000,
    temperature: 0.7,
  });

  const text = response.choices[0]?.message?.content || "";
  console.log("AI response:", text);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in AI response: " + text);
  return JSON.parse(jsonMatch[0]);
}

export async function generateCourseOutline(topic) {
  const prompt = `You are a curriculum designer. Create a structured online course for: "${topic}".

Return ONLY a valid JSON object. No markdown, no backticks, no extra text before or after.

{
  "title": "Course title here",
  "description": "2-3 sentence course overview",
  "tags": ["tag1", "tag2", "tag3"],
  "modules": [
    {
      "title": "Module 1 title",
      "lessons": ["Lesson 1", "Lesson 2", "Lesson 3"]
    },
    {
      "title": "Module 2 title",
      "lessons": ["Lesson 1", "Lesson 2", "Lesson 3"]
    }
  ]
}

Rules:
- Exactly 4 modules, each with exactly 3 lessons
- Progress from basics to advanced
- Raw JSON only, nothing else`;

  return await askAI(prompt);
}

export async function generateLessonContent(courseTitle, moduleTitle, lessonTitle) {
  const prompt = `You are an expert educator. Create a detailed lesson.
Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"

Return ONLY a valid JSON object. No markdown, no backticks, no extra text.

{
  "title": "${lessonTitle}",
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "content": [
    { "type": "heading", "text": "Introduction" },
    { "type": "paragraph", "text": "Write 4-5 educational sentences here." },
    { "type": "heading", "text": "Core Concepts" },
    { "type": "paragraph", "text": "Write 4-5 sentences explaining core concepts." },
    { "type": "code", "language": "javascript", "text": "// relevant code example\nconsole.log('example');" },
    { "type": "heading", "text": "Key Takeaways" },
    { "type": "paragraph", "text": "Write 3-4 sentences summarizing the lesson." },
    { "type": "video", "query": "youtube search query for this lesson topic" },
    { "type": "mcq", "question": "Question 1?", "options": ["A", "B", "C", "D"], "answer": 0, "explanation": "Explanation here." },
    { "type": "mcq", "question": "Question 2?", "options": ["A", "B", "C", "D"], "answer": 1, "explanation": "Explanation here." },
    { "type": "mcq", "question": "Question 3?", "options": ["A", "B", "C", "D"], "answer": 2, "explanation": "Explanation here." }
  ]
}

Raw JSON only. Nothing else.`;

  return await askAI(prompt);
}