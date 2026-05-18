import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/interview",
    withCredentials: true,
});

/**
 * Generate a new interview report.
 * Sends resume PDF, selfDescription, and jobDescription as form-data.
 */
export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("selfDescription", selfDescription);
        formData.append("jobDescription", jobDescription);

        const response = await api.post("/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Generate Interview Report Error:", error);
        throw error;
    }
}

/**
 * Get all interview reports for the logged-in user.
 */
export async function getAllInterviewReports() {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        console.error("Get All Interview Reports Error:", error);
        throw error;
    }
}

/**
 * Get a single interview report by its ID.
 */
export async function getInterviewReportById(interviewId) {
    try {
        const response = await api.get(`/${interviewId}`);
        return response.data;
    } catch (error) {
        console.error("Get Interview Report Error:", error);
        throw error;
    }
}

/**
 * Download the generated resume PDF for an interview report.
 * Returns a Blob that can be used to trigger a file download.
 */
export async function downloadResumePdf(interviewReportId) {
    try {
        const response = await api.get(`/${interviewReportId}/resume-pdf`, {
            responseType: "blob",
        });
        return response.data;
    } catch (error) {
        console.error("Download Resume PDF Error:", error);
        throw error;
    }
}
