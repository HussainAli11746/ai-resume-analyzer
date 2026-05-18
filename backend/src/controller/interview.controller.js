const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let extractedText = "";
        try {
            if (typeof pdfParse === "function") {
                const data = await pdfParse(req.file.buffer);
                extractedText = data.text || "";
            } else if (pdfParse && pdfParse.PDFParse) {
                const parser = new pdfParse.PDFParse(Uint8Array.from(req.file.buffer));
                const resText = await parser.getText();
                extractedText = typeof resText === "string" ? resText : (resText.text || "");
            } else {
                extractedText = req.file.buffer.toString("utf-8");
            }
        } catch (pdfErr) {
            console.warn("PDF parse warning, falling back to text:", pdfErr.message);
            extractedText = req.file.buffer.toString("utf-8");
        }

        const { selfDescription = "", jobDescription = "" } = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: extractedText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: extractedText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        // Enforce maximum 5 recent reports limit per user
        const userReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("_id");

        if (userReports.length > 5) {
            const reportsToDelete = userReports.slice(5).map(r => r._id);
            await interviewReportModel.deleteMany({ _id: { $in: reportsToDelete } });
        }

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        const errStr = String(error.message || "");
        const isRateLimit = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("503") || errStr.includes("All Gemini AI models failed") || errStr.includes("quota") || errStr.includes("limit");

        if (isRateLimit) {
            console.warn("⚠️ [AI Quota Limit] 429 Token limit reached. Returned 429 response to client.");
            return res.status(429).json({
                message: "AI Token Limit Reached! Gemini AI is taking a short nap. Please try again in 1-2 minutes! 🤖💤",
                isRateLimit: true,
                error: "AI Token Limit Reached"
            });
        }

        console.error("Error generating interview report:", error.message || error);
        res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({
            message: "Failed to fetch interview report.",
            error: error.message
        })
    }
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("Error fetching interview reports:", error);
        res.status(500).json({
            message: "Failed to fetch interview reports.",
            error: error.message
        })
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription, tailoredResumeHtml } = interviewReport

        const pdfBuffer = await generateResumePdf({ tailoredResumeHtml, resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        const errStr = String(error.message || "");
        const isRateLimit = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("503") || errStr.includes("All Gemini AI models failed") || errStr.includes("quota") || errStr.includes("limit");

        if (isRateLimit) {
            console.warn("⚠️ [AI Quota Limit] 429 Token limit reached during PDF generation.");
            return res.status(429).json({
                message: "AI Token Limit Reached! Gemini AI is taking a short nap. Please try again in 1-2 minutes! 🤖💤",
                isRateLimit: true,
                error: "AI Token Limit Reached"
            });
        }

        console.error("Error generating resume PDF:", error.message || error);
        res.status(500).json({
            message: "Failed to generate resume PDF.",
            error: error.message
        });
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }