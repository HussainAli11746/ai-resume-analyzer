const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const interviewController = require("../controller/interview.controller")
const upload = require("../middleware/file.middleware")

const interviewRouter = express.Router()


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/:interviewId", authMiddleware, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/:interviewReportId/resume-pdf
 * @description generate resume PDF based on interview report.
 * @access private
 */
interviewRouter.get("/:interviewReportId/resume-pdf", authMiddleware, interviewController.generateResumePdfController)

/**
 * @route POST /resume/pdf/:interviewReportId or /api/interview/resume/pdf/:interviewReportId
 * @description generate resume PDF based on interview report ID in params.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware, interviewController.generateResumePdfController)
interviewRouter.get("/resume/pdf/:interviewReportId", authMiddleware, interviewController.generateResumePdfController)

/**
 * @route POST /pdf/:interviewReportId (for /resume/pdf/:interviewReportId URL)
 * @description generate resume PDF based on interview report ID in params.
 * @access private
 */
interviewRouter.post("/pdf/:interviewReportId", authMiddleware, interviewController.generateResumePdfController)
interviewRouter.get("/pdf/:interviewReportId", authMiddleware, interviewController.generateResumePdfController)

module.exports = interviewRouter
