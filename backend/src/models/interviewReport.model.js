const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], required: true }
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String }]
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: true },
    resume: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    grade: { type: String },
    readiness: { type: String },
    candidateName: { type: String },
    title: { type: String, required: true },
    experienceYears: { type: String },
    parseRate: { type: Number },
    recruiterMatch: { type: Number },
    aiSummary: { type: String },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    sectionScores: {
        atsCompatibility: Number,
        impactAndAchievements: Number,
        skillsValidation: Number,
        projectQuality: Number,
        writingQuality: Number,
        professionalism: Number
    },
    quickInsights: {
        atsFriendlyScore: Number,
        impactScore: Number,
        strongKeywordsCount: Number,
        missingKeywordsCount: Number,
        projectQualityScore: Number
    },
    strongKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    tailoredResumeHtml: { type: String },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
}, {
    timestamps: true,
    strict: false
});

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;