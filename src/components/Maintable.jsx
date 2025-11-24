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
        // Prefer Cloudinary URL, fall back to local file path
        const baseURL = axiosInstance.defaults.baseURL || 'http://localhost:3001';
        const fileUrl = cv.file?.supabaseUrl 
            ? cv.file.supabaseUrl
            : cv.file?.localFilePath 
                ? `${baseURL}${cv.file.localFilePath}`
                : null;
        
        return {
            id: cv._id || cv.id,
            name: cv.fullName || 'N/A',
            email: cv.email || 'N/A',
            phone: cv.phoneNumber || 'N/A',
            appliedDate: cv.timestamp || cv.createdAt || new Date(),
            cvUrl: fileUrl,
            fileName: cv.file?.localFileName || cv.file?.fileName || 'CV.pdf',
            jobTitle: cv.jobTitle || 'N/A',
            score: null, // Score not available from CV data
            skillsMatched: [], // Skills not available from CV data
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-8">Applicant Details</h2>
                                    <div className="flex gap-2">
                                        <p className="text-lg font-medium text-muted-foreground">
                                            {selectedApplicant.name}
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium text-muted-foreground">
                                        Job Title: {selectedApplicant.jobTitle}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Email: {selectedApplicant.email}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setOpenSkillsId(null)}
                                    className="text-lg text-muted-foreground hover:text-foreground"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex justify-end">
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
