"use client"

import { useState } from "react"
import { Mail, Phone, FileText, Eye, Trash2, Star } from "lucide-react"
import { FaDownload } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { RiAccountBoxFill } from "react-icons/ri";
import { GrValidate } from "react-icons/gr";
import { FaCalendar } from "react-icons/fa";
import { MdCreditScore } from "react-icons/md";
import axiosInstance from "../api/axiosInstance";

export default function Maintable({ cvData = [], loading = false, onPreview }) {
    const [openSkillsId, setOpenSkillsId] = useState(null)

    // Transform CV data to match table format
    const applicants = cvData.map((cv) => {
        // Prefer Supabase URL, fall back to local file path
        const baseURL = axiosInstance.defaults.baseURL || 'http://localhost:3001';
        const fileUrl = cv.file?.supabaseUrl 
            ? cv.file.supabaseUrl
            : cv.file?.localFilePath 
                ? `${baseURL}${cv.file.localFilePath}`
                : null;
        
        // Combine matched experience and technical skills
        const allMatchedSkills = [
            ...(cv.matchedExperience || []),
            ...(cv.matchedTechnicalSkills || [])
        ];
        
        return {
            id: cv._id || cv.id,
            name: cv.fullName || 'N/A',
            email: cv.email || 'N/A',
            phone: cv.phoneNumber || 'N/A',
            appliedDate: cv.timestamp || cv.createdAt || new Date(),
            cvUrl: fileUrl,
            fileName: cv.file?.localFileName || cv.file?.fileName || 'CV.pdf',
            jobTitle: cv.jobTitle || 'N/A',
            // Scoring data
            score: cv.score ?? null,
            rank: cv.rank || null,
            decision: cv.decision || null,
            hasLiquid: cv.hasLiquid || false,
            shopifyExperienceMatches: cv.shopifyExperienceMatches ?? null,
            technicalMatches: cv.technicalMatches ?? null,
            matchedExperience: cv.matchedExperience || [],
            matchedTechnicalSkills: cv.matchedTechnicalSkills || [],
            allMatchedSkills: allMatchedSkills,
            reason: cv.reason || null,
        };
    })

    const handleDelete = (id) => {
        // TODO: Implement delete functionality with API call
        console.log('Delete CV:', id)
    }
    const handleEmailClick = (email) => {
        const subject = encodeURIComponent("Interview Invitation – QC / Lab Analyst Position");

        const body = encodeURIComponent(
            `Hello,
  
Thank you for applying for the QC / Lab Analyst position at Avoria. 
We reviewed your profile and would like to invite you for an interview.
                
📅 Date:  
⏰ Time:  
📍 Location: Google Meet (link will be shared)  
⏳ Duration: 20–30 minutes
                
Please reply to this email with your availability, or let us know if you need to reschedule.
                
Looking forward to speaking with you.
                
Best regards,
Team Avoria`
        );

        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
            "_blank"
        );
    };


    const handlePhoneClick = (phone) => {
        if (phone && phone !== 'N/A') {
            window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank")
        }
    }
    
    const handleCvClick = (url, fileName) => {
        if (url && onPreview) {
            onPreview(url, fileName)
        } else if (url) {
            window.open(url, "_blank")
        }
    }
    
    const handleDownload = (url, fileName) => {
        if (url) {
            const link = document.createElement('a')
            link.href = url
            link.download = fileName || 'CV.pdf'
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const getScoreClasses = (score) => {
        if (score === null || score === undefined) return "bg-gray-100 text-gray-500"
        if (score >= 85) return "bg-emerald-100 text-emerald-800"
        if (score >= 70) return "bg-blue-100 text-blue-800"
        if (score >= 55) return "bg-amber-100 text-amber-800"
        if (score >= 50) return "bg-orange-100 text-orange-800"
        return "bg-red-100 text-red-800"
    }

    const getRankClasses = (rank) => {
        if (!rank) return "bg-gray-100 text-gray-500"
        if (rank === 'S') return "bg-purple-100 text-purple-800"
        if (rank === 'A') return "bg-emerald-100 text-emerald-800"
        if (rank === 'B') return "bg-blue-100 text-blue-800"
        if (rank === 'C') return "bg-amber-100 text-amber-800"
        return "bg-red-100 text-red-800"
    }

    const getDecisionClasses = (decision) => {
        if (decision === 'YES') return "bg-green-100 text-green-800"
        if (decision === 'NO') return "bg-red-100 text-red-800"
        return "bg-gray-100 text-gray-500"
    }


    const selectedApplicant =
        openSkillsId !== null ? applicants.find((a) => a.id === openSkillsId) : null

    if (loading) {
        return (
            <div className="w-full overflow-hidden rounded-lg border border-border bg-card p-8">
                <div className="text-center text-gray-500">Loading CVs...</div>
            </div>
        )
    }

    if (applicants.length === 0) {
        return (
            <div className="w-full overflow-hidden rounded-lg border border-border bg-card p-8">
                <div className="text-center text-gray-500">No CVs found. Upload a CV to get started.</div>
            </div>
        )
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-border bg-card relative">
            {/* TABLE */}
            <div className="overflow-x-auto relative z-10">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-gray-100">

                            <th className="px-6 py-4 text-left text-md font-semibold">
                                <div className="flex items-center gap-2">
                                    <RiAccountBoxFill className="h-5 w-5" />
                                    Name
                                </div>
                            </th>

                            <th className="px-6 py-4 text-left text-md font-semibold">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Email
                                </div>
                            </th>

                            <th className="px-6 py-4 text-left text-md font-semibold">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Phone
                                </div>
                            </th>

                            <th className="px-6 py-4 text-left text-md font-semibold">
                                <div className="flex items-center gap-2">
                                    <FaCalendar className="h-5 w-5" />
                                    Applied
                                </div>
                            </th>

                            <th className="px-6 py-4 text-left text-md font-semibold">
                                <div className="flex items-center gap-2">
                                    <GrValidate className="h-5 w-5" />
                                    Job Title
                                </div>
                            </th>

                            <th className="px-6 py-4 text-left text-md font-semibold">
                                <div className="flex items-center gap-2">
                                    <MdCreditScore className="h-5 w-5" />
                                    Score
                                </div>
                            </th>

                            <th className="px-6 py-4 text-left text-md font-semibold">
                                <div className="flex items-center gap-2">
                                    <ImProfile className="h-5 w-5" />
                                    CV
                                </div>
                            </th>

                            <th className="px-6 py-4 text-left text-md font-semibold">
                                <div className="flex items-center gap-2">
                                    <MdCreditScore className="h-5 w-5" />
                                    Actions
                                </div>
                            </th>

                        </tr>

                    </thead>

                    <tbody>
                        {applicants.map((applicant, index) => (
                            <tr
                                key={applicant.id}
                                className={`border-b border-border hover:bg-muted/30 transition-colors ${index === applicants.length - 1 ? "border-b-0" : ""
                                    }`}
                            >
                                {/* NAME */}
                                <td className="px-6 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                            {applicant.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
                                        <span className="text-[17px] font-medium">
                                            {applicant.name}
                                        </span>
                                    </div>
                                </td>

                                {/* EMAIL */}
                                <td className="px-6 py-2">
                                    <button
                                        onClick={() => handleEmailClick(applicant.email)}
                                        className="flex items-center gap-2 text-[16px] text-muted-foreground hover:text-foreground"
                                    >
                                        <Mail className="h-4 w-4 text-red-500" />
                                        <span className="hover:underline">{applicant.email}</span>
                                    </button>
                                </td>

                                {/* PHONE */}
                                <td className="px-6 py-2">
                                    <button
                                        onClick={() => handlePhoneClick(applicant.phone)}
                                        className="flex items-center gap-2 text-[16px] text-muted-foreground hover:text-foreground"
                                    >
                                        <Phone className="h-4 w-4 text-green-500" />
                                        <span className="hover:underline">{applicant.phone}</span>
                                    </button>
                                </td>

                                {/* DATE */}
                                <td className="px-6 py-2 text-[16px] text-muted-foreground">
                                    {new Date(applicant.appliedDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>

                                {/* JOB TITLE */}
                                <td className="px-6 py-2">
                                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800">
                                        {applicant.jobTitle}
                                    </span>
                                </td>

                                {/* SCORE */}
                                <td className="px-6 py-2">
                                    {applicant.score !== null && applicant.score !== undefined ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${getScoreClasses(
                                                        applicant.score
                                                    )}`}
                                                >
                                                    {applicant.score}%
                                                </span>
                                                {applicant.rank && (
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getRankClasses(
                                                            applicant.rank
                                                        )}`}
                                                    >
                                                        {applicant.rank}
                                                    </span>
                                                )}
                                                {applicant.decision && (
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getDecisionClasses(
                                                            applicant.decision
                                                        )}`}
                                                    >
                                                        {applicant.decision}
                                                    </span>
                                                )}
                                            </div>
                                            {applicant.allMatchedSkills?.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenSkillsId(applicant.id)}
                                                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[13px] font-semibold text-muted-foreground hover:bg-muted/80"
                                                >
                                                    {applicant.allMatchedSkills.length} skills matched
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-[16px] text-gray-400">Not scored</span>
                                    )}
                                </td>

                                {/* CV */}
                                <td className="px-6 py-2">
                                    {applicant.cvUrl ? (
                                        <button
                                            onClick={() => handleCvClick(applicant.cvUrl, applicant.fileName)}
                                            className="flex items-center gap-2 text-[16px] text-muted-foreground hover:text-foreground"
                                        >
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            <span className="hover:underline">View CV</span>
                                        </button>
                                    ) : (
                                        <span className="text-[16px] text-gray-400">No CV available</span>
                                    )}
                                </td>

                                {/* ACTIONS */}
                                <td className="px-6 py-2">
                                    <div className="flex items-center gap-2">
                                        {applicant.cvUrl && (
                                            <button 
                                                onClick={() => handleDownload(applicant.cvUrl, applicant.fileName)}
                                                className="h-8 w-8 rounded-md hover:bg-primary/10"
                                                title="Download CV"
                                            >
                                                <FaDownload className="h-5 w-5" />
                                            </button>
                                        )}
                                        <button className="h-8 w-8 rounded-md hover:bg-yellow-500/10" title="Star">
                                            <Star className="h-5 w-5 text-yellow-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(applicant.id)}
                                            className="h-8 w-8 rounded-md hover:bg-red-500/10"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {selectedApplicant && (
                <>
                    {/* CLICK OUTSIDE OVERLAY */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40"
                        onClick={() => setOpenSkillsId(null)}
                    />

                    {/* CENTER MODAL */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-3 flex-1">
                                    <h2 className="text-2xl font-semibold text-gray-800">Applicant Details</h2>
                                    
                                    <div className="space-y-2">
                                        <p className="text-lg font-medium text-gray-800">
                                            {selectedApplicant.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Email:</strong> {selectedApplicant.email}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Job Title:</strong> {selectedApplicant.jobTitle}
                                        </p>
                                    </div>

                                    {/* Scoring Section */}
                                    {selectedApplicant.score !== null && selectedApplicant.score !== undefined && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                                            <h3 className="text-lg font-semibold text-gray-800">Scoring Results</h3>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Score</p>
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getScoreClasses(selectedApplicant.score)}`}>
                                                        {selectedApplicant.score}%
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Rank</p>
                                                    {selectedApplicant.rank ? (
                                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getRankClasses(selectedApplicant.rank)}`}>
                                                            {selectedApplicant.rank}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">N/A</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Decision</p>
                                                    {selectedApplicant.decision ? (
                                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getDecisionClasses(selectedApplicant.decision)}`}>
                                                            {selectedApplicant.decision}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">N/A</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Has Liquid</p>
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${selectedApplicant.hasLiquid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {selectedApplicant.hasLiquid ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                            </div>

                                            {selectedApplicant.reason && (
                                                <div className="mt-3">
                                                    <p className="text-sm text-gray-600 mb-1">Reason</p>
                                                    <p className="text-sm text-gray-800 bg-white p-2 rounded border">
                                                        {selectedApplicant.reason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Matched Skills Section */}
                                    {(selectedApplicant.matchedExperience?.length > 0 || selectedApplicant.matchedTechnicalSkills?.length > 0) && (
                                        <div className="mt-4 space-y-3">
                                            {selectedApplicant.matchedExperience?.length > 0 && (
                                                <div>
                                                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                                                        Shopify Experience Skills ({selectedApplicant.shopifyExperienceMatches || selectedApplicant.matchedExperience.length})
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedApplicant.matchedExperience.map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[13px] font-medium text-blue-800"
                                                            >
                                                                {skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedApplicant.matchedTechnicalSkills?.length > 0 && (
                                                <div>
                                                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                                                        Technical Skills ({selectedApplicant.technicalMatches || selectedApplicant.matchedTechnicalSkills.length})
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedApplicant.matchedTechnicalSkills.map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-[13px] font-medium text-green-800"
                                                            >
                                                                {skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setOpenSkillsId(null)}
                                    className="text-lg text-muted-foreground hover:text-foreground ml-4"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setOpenSkillsId(null)}
                                    className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted bg-black text-white"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
