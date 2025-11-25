"use client"

import { useState, useEffect, memo, useRef } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, FileText, Trash2, Star, Copy } from "lucide-react"
import { toast } from 'sonner'
import { FaDownload } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { RiAccountBoxFill } from "react-icons/ri";
import { GrValidate } from "react-icons/gr";
import { FaCalendar } from "react-icons/fa";
import { MdCreditScore } from "react-icons/md";
import axiosInstance from "../api/axiosInstance";
import { useLanguage } from "../i18n/LanguageProvider";



function mapCvToApplicant(cv) {
  const baseURL = axiosInstance?.defaults?.baseURL || "http://localhost:3001";

  const fileUrl = cv.file?.supabaseUrl
    ? cv.file.supabaseUrl
    : cv.file?.localFilePath
      ? `${baseURL}${cv.file.localFilePath}`
      : null;

  const gcmsMatchedGroups = Array.isArray(cv.gcmsMatchedGroups) ? cv.gcmsMatchedGroups : []
  const rawGcmsKeywords = cv.gcmsMatchedKeywords && typeof cv.gcmsMatchedKeywords === 'object'
    ? cv.gcmsMatchedKeywords
    : {}
  const normalizedGcmsKeywords =
    rawGcmsKeywords instanceof Map ? Object.fromEntries(rawGcmsKeywords) : rawGcmsKeywords
  const gcmsKeywordsFlat = Object.values(normalizedGcmsKeywords || {}).reduce((acc, value) => {
    if (Array.isArray(value)) {
      return acc.concat(value)
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      acc.push(value)
    }
    return acc
  }, [])

  const allMatchedSkills = [
    ...(cv.matchedExperience || []),
    ...(cv.matchedTechnicalSkills || []),
    ...gcmsMatchedGroups,
    ...gcmsKeywordsFlat,
  ];

  const inferCategory = () => {
    if (cv.jobCategory) return cv.jobCategory
    if (cv.evaluationRole) return cv.evaluationRole
    const title = (cv.jobTitle || '').toLowerCase()
    if (title.includes('shopify')) return 'SHOPIFY'
    if (title.includes('gcms') || title.includes('gc/ms') || title.includes('lab')) return 'GCMS'
    return null
  }

  return {
    id: (cv._id || cv.id)?.toString(),
    name: cv.fullName || "N/A",
    email: cv.email || "N/A",
    phone: cv.phoneNumber || "N/A",
    appliedDate: cv.timestamp || cv.createdAt || new Date(),
    cvUrl: fileUrl,
    fileName: cv.file?.localFileName || cv.file?.fileName || "CV.pdf",
    jobTitle: cv.jobTitle || "N/A",
    score: cv.score ?? null,
    rank: cv.rank || null,
    shopifyExperienceMatches: cv.shopifyExperienceMatches ?? null,
    technicalMatches: cv.technicalMatches ?? null,
    matchedExperience: cv.matchedExperience || [],
    matchedTechnicalSkills: cv.matchedTechnicalSkills || [],
    allMatchedSkills,
    reason: cv.reason || null,
    jobCategory: inferCategory(),
    gcmsPositiveGroupsHit: cv.gcmsPositiveGroupsHit ?? null,
    gcmsMinPositiveGroupsRequired: cv.gcmsMinPositiveGroupsRequired ?? null,
    gcmsMatchedGroups,
    gcmsMatchedKeywords: normalizedGcmsKeywords,
    starred: !!cv.starred,
  };
}

function formatAppliedDate(value) {
  if (!value) return '--';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch (error) {
    return '--';
  }
}

const Maintable = memo(function Maintable({
  cvData = [],
  loading = false,
  onPreview,
  onToggleStar = () => { },
  onDelete = () => { },
  startIndex = 0,
  enableBulkActions = true,
  onBulkDeleteSelected = async () => { }
}) {
  const { t } = useLanguage()
  const [openSkillsId, setOpenSkillsId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const getJobCategory = (applicant) => {
    if (!applicant) return null
    if (applicant.jobCategory) return applicant.jobCategory
    if (applicant.gcmsPositiveGroupsHit || applicant.gcmsMatchedGroups?.length) return 'GCMS'
    if (applicant.shopifyExperienceMatches || applicant.matchedTechnicalSkills?.length) return 'SHOPIFY'
    return null
  }

  const getTranslatedReason = (applicant) => {
    if (!applicant) return ''
    if (applicant.reason) {
      return applicant.reason
    }
    return t('maintable.reason.noScore')
  }

  // 👉 LOCAL STATE: keep a copy of the rows here
  const [applicants, setApplicants] = useState(() =>
    cvData.map(mapCvToApplicant)
  )
  useEffect(() => {
    setSelectedIds([])
  }, [cvData])

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(applicants.map((a) => a.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleRowSelect = (id, checked) => {
    setSelectedIds((prev) => {
      if (checked) {
        return [...new Set([...prev, id])]
      }
      return prev.filter((selectedId) => selectedId !== id)
    })
  }

  const openBulkModal = () => {
    if (selectedIds.length === 0) return
    setBulkModalOpen(true)
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return
    setBulkDeleting(true)
    try {
      await onBulkDeleteSelected(selectedIds)
      setSelectedIds([])
      setBulkModalOpen(false)
    } catch (error) {
      console.error('Bulk delete failed:', error)
    } finally {
      setBulkDeleting(false)
    }
  }

  const allSelected =
    applicants.length > 0 && selectedIds.length === applicants.length
  const hasSelection = selectedIds.length > 0


  // Track if we're doing a local update to prevent sync
  const isLocalUpdateRef = useRef(false)
  const prevCvDataLengthRef = useRef(cvData.length)
  const prevCvDataIdsRef = useRef(new Set(cvData.map(cv => cv._id || cv.id)))

  // 👉 Sync local state only when cvData has structural changes (new items, removed items, or initial load)
  // NOT when it's just a single item property update (starred status, etc.)
  useEffect(() => {
    // Skip sync if we just did a local update
    if (isLocalUpdateRef.current) {
      isLocalUpdateRef.current = false
      prevCvDataLengthRef.current = cvData.length
      prevCvDataIdsRef.current = new Set(cvData.map(cv => cv._id || cv.id))
      return
    }

    const currentIds = new Set(cvData.map(cv => cv._id || cv.id))
    const prevIds = prevCvDataIdsRef.current

    // Only sync if there's a structural change:
    // - Different length (items added/removed)
    // - Different IDs (items added/removed)
    const hasStructuralChange =
      prevCvDataLengthRef.current !== cvData.length ||
      prevIds.size !== currentIds.size ||
      [...prevIds].some(id => !currentIds.has(id)) ||
      [...currentIds].some(id => !prevIds.has(id))

    if (hasStructuralChange) {
      setApplicants(cvData.map(mapCvToApplicant))
      prevCvDataLengthRef.current = cvData.length
      prevCvDataIdsRef.current = currentIds
    }
    // If no structural change, don't sync - local state is already correct
  }, [cvData])

  const handleEmailClick = (email) => {
//     const subject = encodeURIComponent(
//       "Interview Invitation – QC / Lab Analyst Position"
//     )

//     const body = encodeURIComponent(
//       `Hello,
  
// Thank you for applying for the QC / Lab Analyst position at Avoria. 
// We reviewed your profile and would like to invite you for an interview.
                
// 📅 Date:  
// ⏰ Time:  
// 📍 Location: Google Meet (link will be shared)  
// ⏳ Duration: 20–30 minutes
                
// Please reply to this email with your availability, or let us know if you need to reschedule.
                
// Looking forward to speaking with you.
                
// Best regards,
// Team Avoria`
//     )

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
      "_blank"
    )
  }

  const handlePhoneClick = (phone) => {
    if (phone && phone !== "N/A") {
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
      const link = document.createElement("a")
      link.href = url
      link.download = fileName || "CV.pdf"
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleCopy = async (value, type) => {
    if (!value) return
    const fieldKey = type === 'phone' ? 'phone' : 'email'
    try {
      await navigator.clipboard.writeText(value)
      toast(t(`maintable.copy.${fieldKey}`))
    } catch (err) {
      console.error('Failed to copy text:', err)
      toast.error(t('maintable.copy.error', { field: t(`maintable.columns.${fieldKey}`) }))
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
    if (rank === "S") return "bg-purple-100 text-purple-800"
    if (rank === "A") return "bg-emerald-100 text-emerald-800"
    if (rank === "B") return "bg-blue-100 text-blue-800"
    if (rank === "C") return "bg-amber-100 text-amber-800"
    return "bg-red-100 text-red-800"
  }

  const getStatusClasses = (score) => {
    if (score !== null && score !== undefined && score >= 50)
      return "bg-green-100 text-green-800"
    if (score !== null && score !== undefined)
      return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-500"
  }

  const getStatusLabel = (score) => {
    if (score !== null && score !== undefined && score >= 50) return t('maintable.status.accepted')
    if (score !== null && score !== undefined) return t('maintable.status.rejected')
    return t('maintable.status.notEvaluated')
  }

  // 👉 LOCAL UPDATE: star toggle only changes that row in state
  const handleStarClick = (id) => {
    isLocalUpdateRef.current = true // Mark as local update to prevent sync
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, starred: !a.starred } : a
      )
    )

    const updated = applicants.find((a) => a.id === id)
    const newValue = updated ? !updated.starred : true
    onToggleStar(id, newValue)
  }

  const handleDeleteClick = (applicant) => {
    setDeleteTarget(applicant)
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      isLocalUpdateRef.current = true // Mark as local update to prevent sync
      // 👉 LOCAL UPDATE: remove that row only
      setApplicants((prev) =>
        prev.filter((a) => a.id !== deleteTarget.id)
      )
      // still inform parent to sync / call API
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteTarget(null)
  }

  const selectedApplicant =
    openSkillsId !== null
      ? applicants.find((a) => a.id === openSkillsId)
      : null

  const translatedReason = selectedApplicant
    ? getTranslatedReason(selectedApplicant)
    : ''

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-border bg-card p-8">
        <div className="text-center text-gray-500">{t('maintable.loading')}</div>
      </div>
    )
  }

  if (applicants.length === 0) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-border bg-card p-8">
        <div className="text-center text-gray-500">
          {t('maintable.empty')}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card relative">
      {enableBulkActions && hasSelection && (
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-200 text-amber-900">
          <span className="text-sm font-medium">
            {t('maintable.bulkBar.selected', { count: selectedIds.length })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1 text-xs font-semibold text-amber-900 hover:text-amber-700"
            >
              {t('common.clearSelection')}
            </button>
            <button
              onClick={openBulkModal}
              className="px-4 py-1 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              {t('common.deleteSelected')}
            </button>
          </div>
        </div>
      )}
      {bulkModalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{t('maintable.bulkModal.title')}</h3>
              <p className="text-gray-600">
                {t('maintable.bulkModal.body', { count: selectedIds.length })}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setBulkModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={bulkDeleting}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleBulkDeleteConfirm}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={bulkDeleting}
                >
                  {bulkDeleting ? t('common.loading') : t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* TABLE */}
      <div className="overflow-x-auto relative z-10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-100 text-gray-600">
              {enableBulkActions && (
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-400"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label="Select all"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <RiAccountBoxFill className="h-4 w-4" />
                  {t('maintable.columns.name')}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('maintable.columns.email')}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('maintable.columns.phone')}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <FaCalendar className="h-4 w-4" />
                  {t('maintable.columns.applied')}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <GrValidate className="h-4 w-4" />
                  {t('maintable.columns.jobTitle')}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <MdCreditScore className="h-4 w-4" />
                  {t('maintable.columns.score')}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <ImProfile className="h-4 w-4" />
                  {t('maintable.columns.cv')}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <MdCreditScore className="h-4 w-4" />
                  {t('maintable.columns.actions')}
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {applicants.map((applicant, index) => (
              <motion.tr
                key={applicant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`border-b border-border hover:bg-muted/30 transition-colors text-sm ${index === applicants.length - 1 ? "border-b-0" : ""
                  }`}
              >
                {enableBulkActions && (
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-400"
                      checked={selectedIds.includes(applicant.id)}
                      onChange={(e) =>
                        handleRowSelect(applicant.id, e.target.checked)
                      }
                      aria-label={`Select ${applicant.name}`}
                    />
                  </td>
                )}
                {/* NAME */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {startIndex + index + 1}
                    </div>

                    <span className="text-sm text-muted-foreground font-medium truncate max-w-[150px]">
                      {applicant.name}
                    </span>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEmailClick(applicant.email)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground truncate max-w-[180px]"
                    >
                      <Mail className="h-3.5 w-3.5 text-red-500" />
                      <span className="hover:underline truncate">{applicant.email}</span>
                    </button>
                    <button
                      onClick={() => handleCopy(applicant.email, 'email')}
                      className="h-6 w-6 flex items-center justify-center rounded-md border border-border text-xs text-gray-500 hover:text-gray-800"
                      title={t('maintable.buttons.copyEmail')}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>

                {/* PHONE */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePhoneClick(applicant.phone)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground truncate max-w-[130px]"
                    >
                      <Phone className="h-3.5 w-3.5 text-green-500" />
                      <span className="hover:underline truncate">{applicant.phone}</span>
                    </button>
                    <button
                      onClick={() => handleCopy(applicant.phone, 'phone')}
                      className="h-6 w-6 flex items-center justify-center rounded-md border border-border text-xs text-gray-500 hover:text-gray-800"
                      title={t('maintable.buttons.copyPhone')}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>

                {/* DATE */}
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {formatAppliedDate(applicant.appliedDate)}
                </td>

                {/* JOB TITLE */}
                <td className="px-4 py-3">
                  <span className="
                      inline-flex items-center gap-2 rounded-full px-3 py-1 
                      bg-blue-100 text-blue-800
                      text-xs font-medium
                      max-w-[120px] 
                      truncate
                    ">
                    {applicant.jobTitle}
                  </span>
                </td>


                {/* SCORE */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {applicant.score !== null  &&
                    applicant.score !== undefined ? (
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${getScoreClasses(
                            applicant.score
                          )}`}
                        >
                          {applicant.score}%
                        </span>
                      </div>
                      {applicant.allMatchedSkills?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setOpenSkillsId(applicant.id)}
                          className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[13px] font-semibold text-muted-foreground hover:bg-muted/80 whitespace-nowrap"
                        >
                          {t('maintable.messages.skillsMatched', { count: applicant.allMatchedSkills.length })}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[16px] text-gray-400">
                      {t('maintable.messages.notScored')}
                    </span>
                  )}
                </td>

                {/* CV */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {applicant.cvUrl ? (
                    <button
                      onClick={() =>
                        handleCvClick(applicant.cvUrl, applicant.fileName)
                      }
                      className="flex items-center gap-2 text-[16px] text-muted-foreground hover:text-foreground"
                    >
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="hover:underline">{t('maintable.buttons.viewCv')}</span>
                    </button>
                  ) : (
                    <span className="text-[16px] text-gray-400">
                      {t('maintable.messages.noCv')}
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {applicant.cvUrl && (
                      <button
                        onClick={() =>
                          handleDownload(applicant.cvUrl, applicant.fileName)
                        }
                        className="h-8 w-8 rounded-md hover:bg-primary/10"
                        title={t('maintable.buttons.download')}
                      >
                        <FaDownload className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleStarClick(applicant.id)}
                      className={`h-8 w-8 rounded-md hover:bg-yellow-500/10 ${applicant.starred ? "bg-yellow-50" : ""
                        }`}
                      title={
                        applicant.starred ? t('maintable.buttons.unsave') : t('maintable.buttons.save')
                      }
                    >
                      <Star
                        className={`h-5 w-5 ${applicant.starred
                            ? "text-yellow-500"
                            : "text-gray-400"
                          } items-center justify-center`}
                        fill={applicant.starred ? "#facc15" : "none"}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(applicant)}
                      className="h-8 w-8 rounded-md hover:bg-red-500/10"
                      title={t('maintable.buttons.delete')}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: matched skills + score */}
      {selectedApplicant && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpenSkillsId(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-3 flex-1">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {t('maintable.modal.title')}
                    </h2>

                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-800">
                      {selectedApplicant.name}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>{t('maintable.columns.email')}:</strong> {selectedApplicant.email}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>{t('maintable.columns.jobTitle')}:</strong> {selectedApplicant.jobTitle}
                    </p>
                  </div>

                  {selectedApplicant.score !== null && selectedApplicant.score >= 50 &&
                    selectedApplicant.score !== undefined && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t('maintable.modal.scoring')}
                    </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{t('maintable.modal.score')}</p>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getScoreClasses(
                                selectedApplicant.score
                              )}`}
                            >
                              {selectedApplicant.score}%
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{t('maintable.modal.rank')}</p>
                            {selectedApplicant.rank ? (
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getRankClasses(
                                  selectedApplicant.rank
                                )}`}
                              >
                                {selectedApplicant.rank}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                N/A
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              {t('maintable.modal.status')}
                            </p>
                            {selectedApplicant.score !== null && selectedApplicant.score >= 50 &&
                              selectedApplicant.score !== undefined ? (
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                                  selectedApplicant.score
                                )}`}
                              >
                                {getStatusLabel(selectedApplicant.score)}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Not evaluated
                              </span>
                            )}
                          </div>
                        </div>

                        {translatedReason && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-1">
                              {t('maintable.reasonLabel')}
                            </p>
                            <p className="text-sm text-gray-800 bg-white p-2 rounded border whitespace-pre-line">
                              {translatedReason}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  {(selectedApplicant.matchedExperience?.length > 0 ||
                    selectedApplicant.matchedTechnicalSkills?.length > 0) && (
                      <div className="mt-4 space-y-3">
                        {selectedApplicant.matchedExperience?.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold text-gray-800 mb-2">
                            {t('maintable.sections.shopifyExperience')} (
                              {selectedApplicant.shopifyExperienceMatches ||
                                selectedApplicant.matchedExperience.length}
                              )
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedApplicant.matchedExperience.map(
                                (skill, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[13px] font-medium text-blue-800"
                                  >
                                    {skill
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (l) =>
                                        l.toUpperCase()
                                      )}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {selectedApplicant.matchedTechnicalSkills?.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold text-gray-800 mb-2">
                            {t('maintable.sections.technical')} (
                              {selectedApplicant.technicalMatches ||
                                selectedApplicant.matchedTechnicalSkills.length}
                              )
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedApplicant.matchedTechnicalSkills.map(
                                (skill, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-[13px] font-medium text-green-800"
                                  >
                                    {skill
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (l) =>
                                        l.toUpperCase()
                                      )}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {selectedApplicant.gcmsMatchedGroups?.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-2">
                          {t('maintable.sections.gcmsGroups')} (
                          {selectedApplicant.gcmsPositiveGroupsHit ||
                            selectedApplicant.gcmsMatchedGroups.length}
                          )
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.gcmsMatchedGroups.map((group, idx) => (
                            <span
                              key={`${group}-${idx}`}
                              className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-[13px] font-medium text-purple-800"
                            >
                              {group
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          ))}
                        </div>
                      </div>

                      {Object.entries(selectedApplicant.gcmsMatchedKeywords || {}).map(
                        ([group, keywords]) => {
                          const keywordList = Array.isArray(keywords)
                            ? keywords
                            : [keywords]
                          return (
                            <div key={group}>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                {t('maintable.sections.keywordsFor', {
                                  group: group
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())
                                })}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {keywordList
                                  .filter(Boolean)
                                  .map((keyword, idx) => (
                                    <span
                                      key={`${group}-${keyword}-${idx}`}
                                      className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-[12px] font-medium text-indigo-800"
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )
                        }
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
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={handleCancelDelete}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {t('maintable.deleteModal.title')}
              </h3>
              <p className="text-gray-600">
                {t('maintable.deleteModal.body', {
                  name: deleteTarget.name || '—'
                })}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
})

export default Maintable
