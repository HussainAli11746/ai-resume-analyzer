const { GoogleGenAI } = require("@google/genai");
const z = require("zod");
const puppeteer = require("puppeteer");

const MODEL = "gemini-3.6-flash";

let ai;
function getAI() {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
}

const questionSchema = {
    type: "object",
    properties: {
        question: { type: "string", description: "The interview question title" },
        topic: { type: "string", description: "Category/Topic badge e.g. React, Authentication, System Design, Leadership, Culture" },
        difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"], description: "Difficulty level" },
        estimatedTime: { type: "string", description: "Estimated answer time e.g. 3 min, 5 min" },
        intention: { type: "string", description: "Why interviewers ask this question" },
        answer: { type: "string", description: "Ideal formatted answer or key points to cover" },
        proTip: { type: "string", description: "Helpful pro tip for tackling this question" }
    },
    required: ["question", "topic", "difficulty", "estimatedTime", "intention", "answer", "proTip"]
};

const atsRiskSchema = {
    type: "object",
    properties: {
        issue: { type: "string", description: "Title of formatting or structural issue e.g. Inconsistent formatting" },
        severity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"], description: "Severity tag" },
        description: { type: "string", description: "Description of the risk" },
        fixRecommendation: { type: "string", description: "Recommended fix step" }
    },
    required: ["issue", "severity", "description", "fixRecommendation"]
};

const interviewReportJsonSchema = {
    type: "object",
    properties: {
        matchScore: { type: "number", description: "Score 0-100 indicating JD match" },
        grade: { type: "string", description: "A+ Grade, B+ Grade, etc." },
        readiness: { type: "string", description: "Readiness level statement" },
        candidateName: { type: "string", description: "Candidate name from resume" },
        title: { type: "string", description: "Target job title" },
        experienceYears: { type: "string", description: "Years of experience" },
        parseRate: { type: "number", description: "Parse rate percentage" },
        recruiterMatch: { type: "number", description: "Recruiter match score percentage" },
        aiSummary: { type: "string", description: "Executive candidate summary" },
        strengths: {
            type: "array",
            items: { type: "string" },
            description: "4-5 key candidate strengths"
        },
        improvements: {
            type: "array",
            items: { type: "string" },
            description: "4-5 key actionable improvements"
        },
        sectionScores: {
            type: "object",
            properties: {
                atsCompatibility: { type: "number" },
                impactAndAchievements: { type: "number" },
                skillsValidation: { type: "number" },
                projectQuality: { type: "number" },
                writingQuality: { type: "number" },
                professionalism: { type: "number" }
            },
            required: ["atsCompatibility", "impactAndAchievements", "skillsValidation", "projectQuality", "writingQuality", "professionalism"]
        },
        quickInsights: {
            type: "object",
            properties: {
                atsFriendlyScore: { type: "number" },
                impactScore: { type: "number" },
                strongKeywordsCount: { type: "number" },
                missingKeywordsCount: { type: "number" },
                projectQualityScore: { type: "number" }
            },
            required: ["atsFriendlyScore", "impactScore", "strongKeywordsCount", "missingKeywordsCount", "projectQualityScore"]
        },
        atsRisks: {
            type: "array",
            items: atsRiskSchema,
            description: "2-3 ATS risks or formatting issues to fix"
        },
        strongKeywords: {
            type: "array",
            items: { type: "string" }
        },
        missingKeywords: {
            type: "array",
            items: { type: "string" }
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"]
            }
        },
        technicalQuestions: {
            type: "array",
            items: questionSchema,
            description: "Exactly 3 technical interview questions with metadata"
        },
        behavioralQuestions: {
            type: "array",
            items: questionSchema,
            description: "Exactly 3 behavioral interview questions with metadata"
        },
        hrQuestions: {
            type: "array",
            items: questionSchema,
            description: "Exactly 3 HR and Culture fit interview questions with metadata"
        },
        tailoredResumeHtml: {
            type: "string",
            description: "Complete, styled HTML document of single-page ATS tailored resume in strict black monochrome styling with embedded CSS."
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: [
        "matchScore",
        "grade",
        "readiness",
        "candidateName",
        "title",
        "experienceYears",
        "parseRate",
        "recruiterMatch",
        "aiSummary",
        "strengths",
        "improvements",
        "sectionScores",
        "quickInsights",
        "atsRisks",
        "strongKeywords",
        "missingKeywords",
        "tailoredResumeHtml",
        "skillGaps",
        "technicalQuestions",
        "behavioralQuestions",
        "hrQuestions",
        "preparationPlan"
    ]
};

const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema);

async function generateContentWithRetry({ contents, config }) {
    const modelsToTry = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(`Calling Gemini API with model: ${modelName}${attempt > 1 ? ` (retry ${attempt})` : ""}`);
                const response = await getAI().models.generateContent({
                    model: modelName,
                    contents,
                    config
                });
                if (response && response.text) {
                    return response.text;
                }
            } catch (err) {
                lastError = err;
                const isRateLimit = err.message.includes("429") || err.message.includes("503") || err.message.includes("RESOURCE_EXHAUSTED") || err.message.includes("UNAVAILABLE");

                if (isRateLimit) {
                    console.warn(`⚠️ [Gemini Rate Limit 429] Model ${modelName} hit quota limit.`);
                    if (attempt < 2) {
                        console.log("Pausing 3s before retry...");
                        await new Promise((r) => setTimeout(r, 3000));
                    } else {
                        break;
                    }
                } else {
                    console.warn(`❌ [Gemini Error] Model ${modelName} attempt ${attempt} failed: ${err.message.substring(0, 80)}`);
                    break;
                }
            }
        }
    }
    throw new Error("AI Token Limit Reached! Gemini AI free tier request quota exceeded.");
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert resume writer. Generate a detailed ATS analysis, interview prep report, and a COMPLETE tailored HTML resume.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

INSTRUCTIONS:
1. Provide exactly 3 Technical questions, 3 Behavioral questions, and 3 HR questions.
2. Provide 2-3 ATS risks.
3. In tailoredResumeHtml, produce a COMPLETE single-page A4 resume HTML. CRITICAL RULES:

=== CONTENT ===
- Use candidate's REAL name, phone, email, LinkedIn, GitHub from resume.
- SECTION ORDER (top to bottom): Header → Professional Summary → Technical Skills → Experience (if any) → Projects → Education → Achievements.
- Include EXPERIENCE section only if the resume has internship/work experience. Use real dates.
- Professional Summary: 2 tight sentences, tailored to the job.
- Technical Skills: one line per category, e.g. "Languages: Java, Python | Frameworks: React, Node.js | Tools: Git, Docker"
- Projects: each project gets bold name + tech stack on right, then exactly 2 bullet points (action verb + measurable result).
- Education: degree, university, graduation date, CGPA on one line.
- Achievements: max 3 compact single-line bullet points.
- NO page numbers. NO footer. NO repeated name at bottom.

=== HTML/CSS — CRITICAL FOR EXACT A4 FILL ===
The resume body MUST be exactly 297mm tall (full A4). Use this EXACT structure:
- Wrap ALL content in a <div class="page"> container.
- After all sections, add <div class="spacer"></div> which flexes to fill remaining space.
- This guarantees NO blank bottom gap and NO overflow.

<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 210mm;
    height: 297mm;
  }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #000;
    font-size: 9.5pt;
    line-height: 1.3;
    display: flex;
    flex-direction: column;
  }
  .page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 297mm;
    padding: 11mm 13mm 10mm 13mm;
  }
  .spacer { flex: 1; }
  h1 { font-size: 17pt; font-weight: 800; color: #000; margin-bottom: 1px; text-align: center; }
  .contact { font-size: 8pt; color: #111; text-align: center; margin-bottom: 5px; }
  h2 { font-size: 9pt; text-transform: uppercase; font-weight: 700; color: #000; border-bottom: 1.2px solid #000; margin: 6px 0 3px 0; padding-bottom: 1px; letter-spacing: 0.5px; }
  p { font-size: 9pt; margin-bottom: 2px; }
  ul { margin: 1px 0 3px 15px; padding: 0; }
  li { font-size: 8.8pt; margin-bottom: 1px; }
  .row { display: flex; justify-content: space-between; align-items: baseline; }
  .bold { font-weight: 700; }
  .italic { font-style: italic; }
  .skills-line { font-size: 8.8pt; margin-bottom: 2px; }
  .project-block { margin-bottom: 4px; }
</style>

HTML body structure MUST be:
<body><div class="page">[all sections here]<div class="spacer"></div></div></body>

ALL text color must be #000 or #111. NO blue, teal, gray, or accent colors.
`;

    let responseText = "";
    try {
        responseText = await generateContentWithRetry({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportJsonSchema,
            }
        });
    } catch (err) {
        console.error(`Gemini model ${MODEL} failed:`, err.message);
        throw new Error(`Gemini AI service error: ${err.message}`);
    }

    if (!responseText) {
        throw new Error("Gemini AI model service unavailable. Please check your API key or connection.");
    }

    const parsed = interviewReportSchema.parse(JSON.parse(responseText));
    return parsed;
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--single-process"
        ]
    });
    const page = await browser.newPage();

    // Set viewport to exact A4 pixel dimensions (96 DPI: 210mm x 297mm)
    await page.setViewport({ width: 794, height: 1123 });
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Step 1: Measure how much of A4 the content currently fills
    const fillRatio = await page.evaluate(() => {
        return document.body.scrollHeight / 1123; // 297mm at 96dpi = 1123px
    });

    // Step 2: If content fills less than 88% of A4, scale up spacing proportionally
    if (fillRatio > 0.05 && fillRatio < 0.88) {
        // Cap factor at 1.3 to keep the resume looking professional, not too loose
        const factor = Math.min(0.90 / fillRatio, 1.3);
        await page.addStyleTag({
            content: `
                body { line-height: ${(1.3 * factor).toFixed(2)} !important; }
                h1 { margin-bottom: ${Math.round(3 * factor)}px !important; }
                .contact { margin-bottom: ${Math.round(7 * factor)}px !important; }
                h2 {
                    margin-top: ${Math.round(7 * factor)}px !important;
                    margin-bottom: ${Math.round(4 * factor)}px !important;
                    padding-bottom: ${Math.round(2 * factor)}px !important;
                }
                p { margin-bottom: ${Math.round(3 * factor)}px !important; }
                ul { margin-top: ${Math.round(2 * factor)}px !important; margin-bottom: ${Math.round(4 * factor)}px !important; }
                li { margin-bottom: ${Math.round(2 * factor)}px !important; }
                .project-block { margin-bottom: ${Math.round(6 * factor)}px !important; }
                .section, .section-block { margin-bottom: ${Math.round(4 * factor)}px !important; }
            `
        });
    }

    // Step 3: Lock html/body to exact A4 size so no overflow or blank excess
    await page.addStyleTag({
        content: `
            @page { size: A4; margin: 0; }
            html { height: 297mm !important; width: 210mm !important; overflow: hidden !important; }
            body { height: 297mm !important; width: 210mm !important; overflow: hidden !important; }
        `
    });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
        printBackground: true,
        displayHeaderFooter: false,
        preferCSSPageSize: true
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
}

async function generateResumePdf({ tailoredResumeHtml, resume, selfDescription, jobDescription }) {
    // IF TAILORED HTML IS ALREADY SAVED IN MONGODB: USE PUPPETEER ONLY! (NO AI CALL REQUIRED)
    if (tailoredResumeHtml && typeof tailoredResumeHtml === "string" && tailoredResumeHtml.trim().length > 50) {
        console.log("⚡ Generating PDF from saved MongoDB tailoredResumeHtml via Puppeteer ONLY...");
        return await generatePdfFromHtml(tailoredResumeHtml);
    }

    // FALLBACK: Generate HTML via Gemini AI if tailoredResumeHtml is missing
    const resumePdfJsonSchema = {
        type: "object",
        properties: {
            html: {
                type: "string",
                description: "The complete <!DOCTYPE html> document of the single-page ATS resume with embedded CSS"
            }
        },
        required: ["html"]
    };

    const prompt = `You are an expert resume writer. Generate a polished, ATS-optimized, COMPLETE single-page resume.

=== CANDIDATE INPUT ===
Resume Content: ${resume}
Self Description: ${selfDescription}
Target Job Description: ${jobDescription}

=== MANDATORY STRUCTURE (top to bottom) ===
1. HEADER: Candidate's REAL name centered as h1. Contact line (phone | email | LinkedIn | GitHub) centered below.
2. PROFESSIONAL SUMMARY: 2 tight sentences tailored to the target job.
3. TECHNICAL SKILLS: One line per category. e.g. "Languages: Java, C++ | Frameworks: React, Node.js | Tools: Git, Docker"
4. EXPERIENCE (only if resume contains internship/job): Job title | Company | Dates. 2 bullet points each.
5. PROJECTS: For each: bold project name + tech stack right-aligned. 2 bullet points per project.
6. EDUCATION: Degree, University, Graduation date, CGPA on one line.
7. ACHIEVEMENTS: Max 3 bullet points.

=== CRITICAL CSS — MUST FOLLOW EXACTLY ===
Return a complete <!DOCTYPE html> with this EXACT structure.
Wrap ALL content in <body><div class="page">[sections]<div class="spacer"></div></div></body>.
The .spacer fills remaining height so the resume is exactly A4 with no blank gap.

<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 210mm; height: 297mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #000; font-size: 9.5pt; line-height: 1.3; display: flex; flex-direction: column; }
  .page { display: flex; flex-direction: column; width: 100%; height: 297mm; padding: 11mm 13mm 10mm 13mm; }
  .spacer { flex: 1; }
  h1 { font-size: 17pt; font-weight: 800; color: #000; margin-bottom: 1px; text-align: center; }
  .contact { font-size: 8pt; color: #111; text-align: center; margin-bottom: 5px; }
  h2 { font-size: 9pt; text-transform: uppercase; font-weight: 700; color: #000; border-bottom: 1.2px solid #000; margin: 6px 0 3px 0; padding-bottom: 1px; letter-spacing: 0.5px; }
  p { font-size: 9pt; margin-bottom: 2px; }
  ul { margin: 1px 0 3px 15px; padding: 0; }
  li { font-size: 8.8pt; margin-bottom: 1px; }
  .row { display: flex; justify-content: space-between; align-items: baseline; }
  .bold { font-weight: 700; }
  .italic { font-style: italic; }
  .skills-line { font-size: 8.8pt; margin-bottom: 2px; }
  .project-block { margin-bottom: 4px; }
</style>

=== STRICT RULES ===
- ALL text color MUST be #000 or #111. ABSOLUTELY NO blue, teal, gray, or any accent color.
- NO page numbers, NO "Page 1 of 1", NO footer, NO header bar, NO repeated name at bottom.
- Use REAL data from the resume only. Do NOT invent or hallucinate facts.
- Use 3+ projects if candidate has them.

Return ONLY a JSON object with key "html" containing the complete <!DOCTYPE html> document.
`;

    let htmlContent = "";
    try {
        const text = await generateContentWithRetry({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumePdfJsonSchema,
            }
        });
        if (text) {
            const parsed = JSON.parse(text);
            if (parsed && parsed.html) {
                htmlContent = parsed.html;
            }
        }
    } catch (err) {
        console.error("Gemini failed for HTML resume generation:", err.message);
        throw err;
    }

    if (!htmlContent) {
        throw new Error("Unable to generate HTML resume content.");
    }

    const pdfBuffer = await generatePdfFromHtml(htmlContent);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
