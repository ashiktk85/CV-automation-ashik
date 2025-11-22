"use client"

import { useState } from "react"
import { Mail, Phone, FileText, Eye, Trash2, Star } from "lucide-react"
import { FaDownload } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { RiAccountBoxFill } from "react-icons/ri";
import { GrValidate } from "react-icons/gr";
import { FaCalendar } from "react-icons/fa";
import { MdCreditScore } from "react-icons/md";

export default function ApplicantTable() {
    const [applicants, setApplicants] = useState([
        {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah.johnson@gmail.com",
            phone: "+1 (555) 123-4567",
            appliedDate: "2024-11-15",
            cvUrl: "/documents/sarah-johnson-cv.pdf",
            score: 92,
            skillsMatched: ["GC-MS", "HPLC", "QC lab", "Method validation"],
        },
        {
            id: 2,
            name: "Michael Chen",
            email: "michael.chen@gmail.com",
            phone: "+1 (555) 234-5678",
            appliedDate: "2024-11-18",
            cvUrl: "/documents/michael-chen-cv.pdf",
            score: 78,
            skillsMatched: ["HPLC", "LC-MS", "Method development"],
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            email: "emily.rodriguez@gmail.com",
            phone: "+1 (555) 345-6789",
            appliedDate: "2024-11-20",
            cvUrl: "/documents/emily-rodriguez-cv.pdf",
            score: 64,
            skillsMatched: ["QC environment", "SOPs", "Stability studies"],
        },
        {
            id: 4,
            name: "James Anderson",
            email: "james.anderson@gmail.com",
            phone: "+1 (555) 456-7890",
            appliedDate: "2024-11-21",
            cvUrl: "/documents/james-anderson-cv.pdf",
            score: 55,
            skillsMatched: ["Laboratory documentation", "Calibration"],
        },
        {
            id: 5,
            name: "Olivia Martinez",
            email: "olivia.martinez@gmail.com",
            phone: "+1 (555) 567-8901",
            appliedDate: "2024-11-22",
            cvUrl: "/documents/olivia-martinez-cv.pdf",
            score: 48,
            skillsMatched: ["General lab work"],
        },
    ])

    const [openSkillsId, setOpenSkillsId] = useState(null)

    const handleDelete = (id) => setApplicants(applicants.filter((a) => a.id !== id))
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


    const handlePhoneClick = (phone) =>
        window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank")
    const handleCvClick = (url, name) => alert(`Opening CV for ${name}`)

    const getScoreClasses = (score) => {
        if (score >= 80) return "bg-emerald-100 text-emerald-800"
        if (score >= 60) return "bg-amber-100 text-amber-800"
        if (score >= 50) return "bg-red-100 text-red-800"
        return "bg-gray-100 text-gray-500"
    }

    const getScoreLabel = (score) => {
        if (score >= 80) return "Strong match"
        if (score >= 60) return "Good match"
        if (score >= 50) return "Borderline"
        return "Low match"
    }

    const selectedApplicant =
        openSkillsId !== null ? applicants.find((a) => a.id === openSkillsId) : null

    return (
        <div className="w-full overflow-hidden rounded-lg border border-border bg-card relative">
            {/* TABLE */}
            <div className="overflow-x-auto relative z-10">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-gray-100">
                            <th className="px-6 py-4 text-left text-lg font-semibold"> <RiAccountBoxFill className="h-5 w-5" /> Name</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold"> <Mail className="h-5 w-5" /> Email</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold"> <Phone className="h-5 w-5" /> Phone</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold"> <FaCalendar className="h-5 w-5" /> Applied</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold"><GrValidate className="h-5 w-5" /> Score</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold"><ImProfile className="h-5 w-5" /> CV</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold"><MdCreditScore className="h-5 w-5" /> Actions</th>
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
                                <td className="px-6 py-4">
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
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEmailClick(applicant.email)}
                                        className="flex items-center gap-2 text-[16px] text-muted-foreground hover:text-foreground"
                                    >
                                        <Mail className="h-4 w-4 text-red-500" />
                                        <span className="hover:underline">{applicant.email}</span>
                                    </button>
                                </td>

                                {/* PHONE */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handlePhoneClick(applicant.phone)}
                                        className="flex items-center gap-2 text-[16px] text-muted-foreground hover:text-foreground"
                                    >
                                        <Phone className="h-4 w-4 text-green-500" />
                                        <span className="hover:underline">{applicant.phone}</span>
                                    </button>
                                </td>

                                {/* DATE */}
                                <td className="px-6 py-4 text-[16px] text-muted-foreground">
                                    {new Date(applicant.appliedDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>

                                {/* SCORE */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${getScoreClasses(
                                            applicant.score
                                        )}`}
                                    >
                                        {applicant.score}% • {getScoreLabel(applicant.score)}
                                    </span>

                                    {/* CLICK TO OPEN SKILLS */}
                                    {applicant.skillsMatched?.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setOpenSkillsId(applicant.id)}
                                            className="mt-2 inline-flex items-center rounded-full bg-muted px-3 py-1 text-[15px] font-semibold text-muted-foreground hover:bg-muted/80"
                                        >
                                            {applicant.skillsMatched.length} skills matched
                                        </button>
                                    )}
                                </td>

                                {/* CV */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleCvClick(applicant.cvUrl, applicant.name)}
                                        className="flex items-center gap-2 text-[16px] text-muted-foreground hover:text-foreground"
                                    >
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        <span className="hover:underline">View CV</span>
                                    </button>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="h-8 w-8 rounded-md hover:bg-primary/10">
                                            <FaDownload className="h-5 w-5" />
                                        </button>
                                        <button className="h-8 w-8 rounded-md hover:bg-yellow-500/10">
                                            <Star className="h-5 w-5 text-yellow-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(applicant.id)}
                                            className="h-8 w-8 rounded-md hover:bg-red-500/10"
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
                                    <h2 className="text-xl font-semibold text-gray-800 mb-8">Matched Skills</h2>
                                    <div className="flex gap-2">
                                        <p className="text-lg font-medium text-muted-foreground">
                                            {selectedApplicant.name}
                                        </p>

                                        {/* SAME COLOR PILL AS TABLE SCORE */}
                                        <span
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-md font-semibold mb-5 ${getScoreClasses(
                                                selectedApplicant.score
                                            )}`}
                                        >
                                            {selectedApplicant.score}% • {getScoreLabel(selectedApplicant.score)}
                                        </span>
                                    </div>
                                    <p className="text-lg font-medium text-muted-foreground">
                                        {selectedApplicant.skillsMatched.length} skills matched
                                    </p>
                                </div>

                                <button
                                    onClick={() => setOpenSkillsId(null)}
                                    className="text-lg text-muted-foreground hover:text-foreground"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedApplicant.skillsMatched.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[14px] font-medium text-muted-foreground"
                                    >
                                        {skill}
                                    </span>
                                ))}
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
