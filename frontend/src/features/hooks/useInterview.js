import { useContext } from "react";
import { InterviewContext } from "../interview/interview.context";
import {
    generateInterviewReport,
    getAllInterviewReports,
    getInterviewReportById,
    downloadResumePdf
} from "../services/interview.api";
export const useInterview = () => {
    const { loading, setLoading, report, setReport, reports, setReports } = useContext(InterviewContext);
    const handleGenerateReport = async ({ resume, selfDescription, jobDescription }) => {
        setLoading("generateReport");
        try {
            const data = await generateInterviewReport({ resume, selfDescription, jobDescription });
            setReport(data.interviewReport);
            setReports((prevReports) => [data.interviewReport, ...prevReports]);
            return data;
        } catch (error) {
            console.error("Generate Report Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handleGetAllReports = async () => {
        setLoading("getAllReports");
        try {
            const data = await getAllInterviewReports();
            setReports(data.interviewReports);
            return data;
        } catch (error) {
            console.error("Get All Reports Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handleGetReportById = async (interviewId) => {
        setLoading("getReportById");
        try {
            const data = await getInterviewReportById(interviewId);
            setReport(data.interviewReport);
            return data;
        } catch (error) {
            console.error("Get Report By ID Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handleDownloadResumePdf = async (interviewReportId, filename) => {
        setLoading("downloadResumePdf");
        try {
            const blobData = await downloadResumePdf(interviewReportId);
            const url = window.URL.createObjectURL(new Blob([blobData]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename || `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            return blobData;
        } catch (error) {
            console.error("Download Resume PDF Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    return {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        generateReport: handleGenerateReport,
        getAllReports: handleGetAllReports,
        getReportById: handleGetReportById,
        downloadResumePdf: handleDownloadResumePdf,
    };
};