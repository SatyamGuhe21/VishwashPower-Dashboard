"use client"

import { useState, useEffect } from "react"

const ETCAdminPanel = ({ user, selectedProject, onLogout, onProjectSelect, onCompanySelect, onBackToMain }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [companies, setCompanies] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [reviewMode, setReviewMode] = useState(false)
  const [selectedCompanyForReview, setSelectedCompanyForReview] = useState(null)
  const [submittedForms, setSubmittedForms] = useState([])
  const [currentStageReview, setCurrentStageReview] = useState(1)
  const [showSubmitterReview, setShowSubmitterReview] = useState(false)

  // Initialize departments
  useEffect(() => {
    const defaultDepartments = [
      {
        id: 1,
        name: "Auto transformer",
        description: "Auto transformer department for power distribution systems",
        icon: "⚡",
        color: "#C41E3A",
        projects: [],
      },
      {
        id: 2,
        name: "Traction transformer",
        description: "Traction transformer department for railway systems",
        icon: "🚊",
        color: "#1E3A8A",
        projects: [],
      },
      {
        id: 3,
        name: "V Connected 63 MVA transformer",
        description: "V Connected 63 MVA transformer department for high voltage systems",
        icon: "🔌",
        color: "#047857",
        projects: [],
      },
    ]
    setDepartments(defaultDepartments)
  }, [])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("etc_projects")
    const savedCompanies = localStorage.getItem("etc_companies")
    const savedSubmittedForms = localStorage.getItem("etc_submitted_forms")

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Initialize with default projects for each department
      const defaultProjects = [
        {
          id: 1,
          name: "Smart City Infrastructure",
          description: "Urban development project for smart city implementation",
          status: "active",
          companies: 3,
          createdAt: "2024-01-15",
          departmentId: 1,
        },
        {
          id: 2,
          name: "Green Energy Initiative",
          description: "Renewable energy project for sustainable development",
          status: "active",
          companies: 3,
          createdAt: "2024-02-01",
          departmentId: 2,
        },
        {
          id: 3,
          name: "High Voltage Distribution",
          description: "High voltage power distribution project",
          status: "active",
          companies: 3,
          createdAt: "2024-02-15",
          departmentId: 3,
        },
      ]
      setProjects(defaultProjects)
      localStorage.setItem("etc_projects", JSON.stringify(defaultProjects))
    }

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies))
    } else {
      // Initialize with default companies for each project
      const defaultCompanies = [
        // Auto transformer department companies
        {
          id: 1,
          name: "TCS (Tata Consultancy Services)",
          projectId: 1,
          stage: 1,
          formsCompleted: 17,
          totalForms: 17,
          status: "pending-approval",
          lastActivity: "2024-06-01",
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: true, 2: false, 3: false },
        },
        {
          id: 2,
          name: "IBM Corporation",
          projectId: 1,
          stage: 1,
          formsCompleted: 8,
          totalForms: 17,
          status: "in-progress",
          lastActivity: "2024-06-02",
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        {
          id: 3,
          name: "HCL Technologies",
          projectId: 1,
          stage: 1,
          formsCompleted: 12,
          totalForms: 17,
          status: "in-progress",
          lastActivity: "2024-06-01",
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        // Traction transformer department companies
        {
          id: 4,
          name: "TCS (Tata Consultancy Services)",
          projectId: 2,
          stage: 2,
          formsCompleted: 34,
          totalForms: 34,
          status: "pending-approval",
          lastActivity: "2024-05-28",
          stageApprovals: { 1: true, 2: false, 3: false },
          submittedStages: { 1: true, 2: true, 3: false },
        },
        {
          id: 5,
          name: "IBM Corporation",
          projectId: 2,
          stage: 1,
          formsCompleted: 8,
          totalForms: 17,
          status: "in-progress",
          lastActivity: "2024-06-01",
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        {
          id: 6,
          name: "HCL Technologies",
          projectId: 2,
          stage: 1,
          formsCompleted: 2,
          totalForms: 17,
          status: "in-progress",
          lastActivity: "2024-06-02",
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        // V Connected 63 MVA transformer department companies
        {
          id: 7,
          name: "TCS (Tata Consultancy Services)",
          projectId: 3,
          stage: 3,
          formsCompleted: 51,
          totalForms: 51,
          status: "completed",
          lastActivity: "2024-06-03",
          stageApprovals: { 1: true, 2: true, 3: true },
          submittedStages: { 1: true, 2: true, 3: true },
        },
        {
          id: 8,
          name: "IBM Corporation",
          projectId: 3,
          stage: 1,
          formsCompleted: 7,
          totalForms: 17,
          status: "in-progress",
          lastActivity: "2024-06-02",
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        {
          id: 9,
          name: "HCL Technologies",
          projectId: 3,
          stage: 1,
          formsCompleted: 11,
          totalForms: 17,
          status: "in-progress",
          lastActivity: "2024-06-01",
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
      ]
      setCompanies(defaultCompanies)
      localStorage.setItem("etc_companies", JSON.stringify(defaultCompanies))
    }

    // Load submitted forms with better persistence
    if (savedSubmittedForms) {
      setSubmittedForms(JSON.parse(savedSubmittedForms))
    } else {
      // Initialize with mock submitted forms
      const mockSubmittedForms = [
        // TCS Auto Transformer - Stage 1 Forms
        {
          id: 1,
          companyId: 1,
          stage: 1,
          formName: "Technical Specifications Form",
          submittedAt: "2024-06-15",
          status: "pending-review",
          data: {
            transformerType: "Auto Transformer",
            capacity: "100 MVA",
            voltage: "132/33 kV",
            frequency: "50 Hz",
            cooling: "ONAN/ONAF",
            tapChanger: "On Load",
            bushingType: "Porcelain",
            oilType: "Mineral Oil",
          },
        },
        {
          id: 2,
          companyId: 1,
          stage: 1,
          formName: "Quality Assurance Form",
          submittedAt: "2024-06-15",
          status: "pending-review",
          data: {
            testingStandard: "IEC 60076",
            qualityGrade: "Grade A",
            inspectionLevel: "Level 2",
            certificationRequired: "Yes",
            witnessTest: "Customer Witness",
          },
        },
        {
          id: 3,
          companyId: 1,
          stage: 1,
          formName: "Installation Requirements Form",
          submittedAt: "2024-06-15",
          status: "pending-review",
          data: {
            installationSite: "Outdoor",
            foundationType: "Concrete",
            accessRequirements: "Crane Access Required",
            environmentalConditions: "Normal",
            specialRequirements: "Seismic Zone IV",
          },
        },
        // TCS Traction Transformer - Stage 2 Forms
        {
          id: 4,
          companyId: 4,
          stage: 2,
          formName: "Manufacturing Process Form",
          submittedAt: "2024-06-10",
          status: "pending-review",
          data: {
            manufacturingStandard: "IEC 60076-1",
            productionTimeline: "16 weeks",
            qualityControlProcess: "ISO 9001:2015",
            materialSpecification: "CRGO Steel",
            windingMaterial: "Copper",
          },
        },
        {
          id: 5,
          companyId: 4,
          stage: 2,
          formName: "Testing Protocol Form",
          submittedAt: "2024-06-10",
          status: "pending-review",
          data: {
            routineTests: "All IEC Tests",
            typeTests: "Complete Type Tests",
            specialTests: "Seismic Tests",
            testingFacility: "NABL Accredited",
            witnessRequirement: "Third Party",
          },
        },
        // TCS V Connected - All Stages (Completed)
        {
          id: 6,
          companyId: 7,
          stage: 1,
          formName: "Technical Specifications Form",
          submittedAt: "2024-05-15",
          status: "approved",
          reviewedAt: "2024-05-16",
          data: {
            transformerType: "V Connected 63 MVA",
            capacity: "63 MVA",
            voltage: "220/33 kV",
            frequency: "50 Hz",
            cooling: "ONAF",
          },
        },
        {
          id: 7,
          companyId: 7,
          stage: 2,
          formName: "Manufacturing Process Form",
          submittedAt: "2024-05-20",
          status: "approved",
          reviewedAt: "2024-05-21",
          data: {
            manufacturingStandard: "IEC 60076-1",
            productionTimeline: "20 weeks",
            qualityControlProcess: "ISO 9001:2015",
          },
        },
        {
          id: 8,
          companyId: 7,
          stage: 3,
          formName: "Final Inspection Form",
          submittedAt: "2024-05-25",
          status: "approved",
          reviewedAt: "2024-05-26",
          data: {
            finalInspection: "Completed",
            deliverySchedule: "2024-06-30",
            warrantyPeriod: "2 Years",
          },
        },
      ]
      setSubmittedForms(mockSubmittedForms)
      localStorage.setItem("etc_submitted_forms", JSON.stringify(mockSubmittedForms))
    }
  }, [])

  // Save to localStorage whenever data changes with unique keys
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("etc_projects", JSON.stringify(projects))
    }
  }, [projects])

  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem("etc_companies", JSON.stringify(companies))
    }
  }, [companies])

  useEffect(() => {
    if (submittedForms.length > 0) {
      localStorage.setItem("etc_submitted_forms", JSON.stringify(submittedForms))
    }
  }, [submittedForms])

  const handleCreateProject = () => {
    if (newProject.name && newProject.description && selectedDepartment) {
      const projectId = Math.max(...projects.map((p) => p.id), 0) + 1

      const project = {
        id: projectId,
        name: newProject.name,
        description: newProject.description,
        status: "active",
        companies: 3,
        createdAt: new Date().toISOString().split("T")[0],
        departmentId: selectedDepartment.id,
      }

      setProjects([...projects, project])

      // Automatically add TCS, IBM, HCL companies for this project
      const newCompanies = [
        {
          id: Math.max(...companies.map((c) => c.id), 0) + 1,
          name: "TCS (Tata Consultancy Services)",
          projectId: projectId,
          stage: 1,
          formsCompleted: 0,
          totalForms: 17,
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        {
          id: Math.max(...companies.map((c) => c.id), 0) + 2,
          name: "IBM Corporation",
          projectId: projectId,
          stage: 1,
          formsCompleted: 0,
          totalForms: 17,
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        {
          id: Math.max(...companies.map((c) => c.id), 0) + 3,
          name: "HCL Technologies",
          projectId: projectId,
          stage: 1,
          formsCompleted: 0,
          totalForms: 17,
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
      ]

      setCompanies([...companies, ...newCompanies])
      setNewProject({ name: "", description: "" })
      setShowCreateForm(false)
      alert(
        `Project "${project.name}" created successfully in ${selectedDepartment.name} with TCS, IBM, and HCL companies!`,
      )
    }
  }

  const handleReviewStage = (company, stage) => {
    const stageForms = submittedForms.filter((form) => form.companyId === company.id && form.stage === stage)

    if (stageForms.length === 0) {
      alert(`No forms submitted for Stage ${stage} yet.`)
      return
    }

    setSelectedCompanyForReview(company)
    setCurrentStageReview(stage)
    setReviewMode(true)
  }

  const handleApproveStage = (stage) => {
    // Approve all forms in the current stage
    setSubmittedForms((forms) =>
      forms.map((form) =>
        form.companyId === selectedCompanyForReview.id && form.stage === stage
          ? { ...form, status: "approved", reviewedAt: new Date().toISOString().split("T")[0] }
          : form,
      ),
    )

    // Update company stage approval
    setCompanies((companies) =>
      companies.map((company) =>
        company.id === selectedCompanyForReview.id
          ? {
              ...company,
              stageApprovals: { ...company.stageApprovals, [stage]: true },
              status: stage === 3 ? "completed" : "in-progress",
              stage: stage === 3 ? 3 : stage + 1,
            }
          : company,
      ),
    )

    alert(
      `Stage ${stage} approved! ${stage === 3 ? "Company completed all stages." : `Stage ${stage + 1} is now available.`}`,
    )
    setReviewMode(false)
  }

  const handleRejectStage = (stage) => {
    const rejectionReason = prompt("Please provide a reason for rejecting this stage:")
    if (!rejectionReason) return

    // Reject all forms in the current stage
    setSubmittedForms((forms) =>
      forms.map((form) =>
        form.companyId === selectedCompanyForReview.id && form.stage === stage
          ? {
              ...form,
              status: "rejected",
              rejectionReason,
              reviewedAt: new Date().toISOString().split("T")[0],
            }
          : form,
      ),
    )

    // Update company status
    setCompanies((companies) =>
      companies.map((company) =>
        company.id === selectedCompanyForReview.id
          ? {
              ...company,
              status: "in-progress",
              submittedStages: { ...company.submittedStages, [stage]: false },
            }
          : company,
      ),
    )

    alert(`Stage ${stage} rejected. Company needs to resubmit forms.`)
    setReviewMode(false)
  }

  const handleViewSubmittedForms = (company) => {
    const companyForms = submittedForms.filter((form) => form.companyId === company.id)
    if (companyForms.length === 0) {
      alert("No forms submitted yet.")
      return
    }

    setSelectedCompanyForReview(company)
    setShowSubmitterReview(true)
  }

  const handleBackFromReview = () => {
    setReviewMode(false)
    setShowSubmitterReview(false)
    setSelectedCompanyForReview(null)
    setCurrentStageReview(1)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "status-completed"
      case "in-progress":
        return "status-progress"
      case "pending-approval":
        return "status-pending"
      default:
        return "status-default"
    }
  }

  const getStageStatus = (company, stage) => {
    if (company.stageApprovals[stage]) return "approved"
    if (company.submittedStages[stage]) return "pending-approval"
    if (stage === 1 || company.stageApprovals[stage - 1]) return "available"
    return "locked"
  }

  const filteredProjects = selectedDepartment
    ? projects.filter(
        (project) =>
          project.departmentId === selectedDepartment.id &&
          project.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const projectCompanies = selectedProject
    ? companies.filter((company) => company.projectId === selectedProject.id)
    : []

  const getDepartmentProjects = (departmentId) => {
    return projects.filter((project) => project.departmentId === departmentId)
  }

  const currentStageForms = reviewMode
    ? submittedForms.filter(
        (form) => form.companyId === selectedCompanyForReview.id && form.stage === currentStageReview,
      )
    : []

  const allCompanyForms = showSubmitterReview
    ? submittedForms.filter((form) => form.companyId === selectedCompanyForReview.id)
    : []

  const handleLogout = () => {
    // Clear all ETC admin data on logout
    localStorage.removeItem("etc_projects")
    localStorage.removeItem("etc_companies")
    localStorage.removeItem("etc_submitted_forms")

    // Reset all states
    setProjects([])
    setCompanies([])
    setSubmittedForms([])
    setSelectedDepartment(null)
    setSelectedCompanyForReview(null)
    setReviewMode(false)
    setShowSubmitterReview(false)

    // Call the parent logout function
    onLogout()
  }

  const handleSimulateFormSubmission = (companyId, stage) => {
    const newForms = [
      {
        id: Math.max(...submittedForms.map((f) => f.id), 0) + 1,
        companyId: companyId,
        stage: stage,
        formName: `Technical Form ${stage}-1`,
        submittedAt: new Date().toISOString().split("T")[0],
        status: "pending-review",
        data: {
          field1: `Sample data for stage ${stage}`,
          field2: `More sample data`,
          field3: `Additional information`,
        },
      },
      {
        id: Math.max(...submittedForms.map((f) => f.id), 0) + 2,
        companyId: companyId,
        stage: stage,
        formName: `Quality Form ${stage}-2`,
        submittedAt: new Date().toISOString().split("T")[0],
        status: "pending-review",
        data: {
          qualityCheck: "Passed",
          inspector: "John Doe",
          date: new Date().toISOString().split("T")[0],
        },
      },
    ]

    setSubmittedForms((prev) => [...prev, ...newForms])

    // Update company status
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId
          ? {
              ...company,
              status: "pending-approval",
              submittedStages: { ...company.submittedStages, [stage]: true },
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : company,
      ),
    )

    alert(`Forms submitted for Stage ${stage}!`)
  }

  return (
    <div className="dashboard-container">
      <header className="etc-header">
        <div className="header-content">
          <div className="header-left">
            {user?.role === "main-admin" && (
              <button onClick={onBackToMain} className="back-btn">
                ← Back
              </button>
            )}
            {/* Mobile menu toggle button */}
            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            {/* EASY LOGO REPLACEMENT - Just replace the src path */}
            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <div className="header-title">
              <h1>
                {reviewMode
                  ? `Review Stage ${currentStageReview} - ${selectedCompanyForReview.name}`
                  : showSubmitterReview
                    ? `Submitted Forms - ${selectedCompanyForReview.name}`
                    : selectedProject
                      ? `${selectedProject.name} - Companies`
                      : selectedDepartment
                        ? `${selectedDepartment.name} - Projects`
                        : "ETC Admin Panel"}
              </h1>
              <p>
                {reviewMode
                  ? "Review and approve/reject stage forms"
                  : showSubmitterReview
                    ? "View all submitted forms by company"
                    : selectedProject
                      ? "Manage companies and workflows"
                      : selectedDepartment
                        ? "Manage projects in department"
                        : "Manage departments, projects and companies"}
              </p>
            </div>
          </div>

          {/* Desktop header right */}
          <div className="header-right desktop-only">
            <span className="user-badge">ETC Admin</span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>

          {/* Mobile menu overlay */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
                  <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                    ×
                  </button>
                </div>
                <div className="mobile-menu-content">
                  <div className="mobile-user-info">
                    <span className="user-badge">ETC Admin</span>
                  </div>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="etc-main">
        {reviewMode ? (
          // Stage Review Interface
          <>
            <div className="section-header">
              <div>
                <h2>Stage {currentStageReview} Forms Review</h2>
                <p>Review all forms submitted for Stage {currentStageReview}</p>
              </div>
              <button onClick={handleBackFromReview} className="back-btn">
                ← Back to Companies
              </button>
            </div>

            <div className="stage-review-summary">
              <div className="stage-info-card">
                <h3>Stage {currentStageReview} Information</h3>
                <p>
                  <strong>Company:</strong> {selectedCompanyForReview.name}
                </p>
                <p>
                  <strong>Total Forms:</strong> {currentStageForms.length}
                </p>
                <p>
                  <strong>Status:</strong> {getStageStatus(selectedCompanyForReview, currentStageReview)}
                </p>
              </div>
            </div>

            <div className="forms-review-grid">
              {currentStageForms.map((form) => (
                <div key={form.id} className={`form-review-card ${form.status}`}>
                  <div className="form-review-header">
                    <h3>{form.formName}</h3>
                    <span
                      className={`status-badge ${
                        form.status === "approved"
                          ? "status-completed"
                          : form.status === "rejected"
                            ? "status-pending"
                            : "status-progress"
                      }`}
                    >
                      {form.status === "approved" && "✅ Approved"}
                      {form.status === "rejected" && "❌ Rejected"}
                      {form.status === "pending-review" && "⏳ Pending Review"}
                    </span>
                  </div>

                  <div className="form-review-details">
                    <p>
                      <strong>Submitted:</strong> {form.submittedAt}
                    </p>
                    {form.reviewedAt && (
                      <p>
                        <strong>Reviewed:</strong> {form.reviewedAt}
                      </p>
                    )}
                    {form.rejectionReason && (
                      <div className="rejection-reason">
                        <strong>Rejection Reason:</strong>
                        <p>{form.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="form-data-preview">
                    <h4>Form Data:</h4>
                    <div className="data-grid">
                      {Object.entries(form.data).map(([key, value]) => (
                        <div key={key} className="data-item">
                          <span className="data-label">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                          </span>
                          <span className="data-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="stage-approval-actions">
              <button
                onClick={() => handleApproveStage(currentStageReview)}
                className="approve-stage-btn"
                disabled={currentStageForms.some((form) => form.status === "pending-review")}
              >
                ✅ Approve Stage {currentStageReview}
              </button>
              <button onClick={() => handleRejectStage(currentStageReview)} className="reject-stage-btn">
                ❌ Reject Stage {currentStageReview}
              </button>
            </div>
          </>
        ) : showSubmitterReview ? (
          // Submitter Review Interface
          <>
            <div className="section-header">
              <div>
                <h2>All Submitted Forms</h2>
                <p>Review all forms submitted by {selectedCompanyForReview.name}</p>
              </div>
              <button onClick={handleBackFromReview} className="back-btn">
                ← Back to Companies
              </button>
            </div>

            <div className="submitter-review-summary">
              <div className="review-stats">
                <div className="stat-card">
                  <h4>Total Forms</h4>
                  <div className="stat-number">{allCompanyForms.length}</div>
                </div>
                <div className="stat-card">
                  <h4>Approved</h4>
                  <div className="stat-number">{allCompanyForms.filter((f) => f.status === "approved").length}</div>
                </div>
                <div className="stat-card">
                  <h4>Pending</h4>
                  <div className="stat-number">
                    {allCompanyForms.filter((f) => f.status === "pending-review").length}
                  </div>
                </div>
                <div className="stat-card">
                  <h4>Rejected</h4>
                  <div className="stat-number">{allCompanyForms.filter((f) => f.status === "rejected").length}</div>
                </div>
              </div>
            </div>

            <div className="stages-review-container">
              {[1, 2, 3].map((stage) => {
                const stageForms = allCompanyForms.filter((form) => form.stage === stage)
                if (stageForms.length === 0) return null

                return (
                  <div key={stage} className="stage-forms-section">
                    <h3>Stage {stage} Forms</h3>
                    <div className="forms-review-grid">
                      {stageForms.map((form) => (
                        <div key={form.id} className={`form-review-card ${form.status}`}>
                          <div className="form-review-header">
                            <h4>{form.formName}</h4>
                            <span
                              className={`status-badge ${
                                form.status === "approved"
                                  ? "status-completed"
                                  : form.status === "rejected"
                                    ? "status-pending"
                                    : "status-progress"
                              }`}
                            >
                              {form.status === "approved" && "✅ Approved"}
                              {form.status === "rejected" && "❌ Rejected"}
                              {form.status === "pending-review" && "⏳ Pending Review"}
                            </span>
                          </div>

                          <div className="form-review-details">
                            <p>
                              <strong>Submitted:</strong> {form.submittedAt}
                            </p>
                            {form.reviewedAt && (
                              <p>
                                <strong>Reviewed:</strong> {form.reviewedAt}
                              </p>
                            )}
                            {form.rejectionReason && (
                              <div className="rejection-reason">
                                <strong>Rejection Reason:</strong>
                                <p>{form.rejectionReason}</p>
                              </div>
                            )}
                          </div>

                          <div className="form-data-preview">
                            <h5>Form Data:</h5>
                            <div className="data-grid">
                              {Object.entries(form.data).map(([key, value]) => (
                                <div key={key} className="data-item">
                                  <span className="data-label">
                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                                  </span>
                                  <span className="data-value">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !selectedDepartment ? (
          // Department Selection View
          <>
            <div className="section-header">
              <div>
                <h2>Transformer Departments</h2>
                <p>Select a department to manage projects and companies</p>
              </div>
            </div>

            <div className="departments-grid">
              {departments.map((department) => {
                const departmentProjects = getDepartmentProjects(department.id)
                return (
                  <div
                    key={department.id}
                    className="department-card"
                    onClick={() => setSelectedDepartment(department)}
                  >
                    <div className="department-header">
                      <div className="department-icon" style={{ backgroundColor: department.color }}>
                        {department.icon}
                      </div>
                      <span className="status-badge status-progress">Active</span>
                    </div>
                    <h3>{department.name}</h3>
                    <p>{department.description}</p>
                    <div className="department-footer">
                      <span>📁 {departmentProjects.length} projects</span>
                      <span>🏢 {departmentProjects.length * 3} companies</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !selectedProject ? (
          // Projects View for Selected Department
          <>
            <div className="section-header">
              <div>
                <h2>Projects in {selectedDepartment.name}</h2>
                <p>Create and manage projects for this department</p>
              </div>
              <div className="section-actions">
                <button onClick={() => setShowCreateForm(true)} className="create-btn">
                  ➕ Create Project
                </button>
                <button onClick={() => setSelectedDepartment(null)} className="back-btn">
                  ← Back to Departments
                </button>
              </div>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {showCreateForm && (
              <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
                    <h3>Create New Project in {selectedDepartment.name}</h3>
                  </div>
                  <p>TCS, IBM, and HCL will be automatically added to this project</p>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      placeholder="Enter project name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter project description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      onClick={handleCreateProject}
                      className="submit-btn"
                      disabled={!newProject.name || !newProject.description}
                    >
                      Create Project
                    </button>
                    <button onClick={() => setShowCreateForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card" onClick={() => onProjectSelect(project)}>
                  <div className="project-header">
                    <div className="project-icon" style={{ backgroundColor: selectedDepartment.color }}>
                      📁
                    </div>
                    <span className={`status-badge ${getStatusColor(project.status)}`}>{project.status}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-footer">
                    <span>🏢 {project.companies} companies</span>
                    <span>📅 {project.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Companies View for Selected Project
          <>
            <div className="section-header">
              <div>
                <h2>Companies in {selectedProject.name}</h2>
                <p>Manage companies and their workflows</p>
              </div>
              <button onClick={() => onProjectSelect(null)} className="back-btn">
                ← Back to Projects
              </button>
            </div>

            <div className="companies-grid">
              {projectCompanies.map((company) => (
                <div key={company.id} className="company-card">
                  <div className="company-header">
                    <div className="company-icon" style={{ backgroundColor: "#1E3A8A" }}>
                      🏢
                    </div>
                    <span className={`status-badge ${getStatusColor(company.status)}`}>
                      {company.status === "pending-approval" && "⏳"}
                      {company.status === "in-progress" && "🔄"}
                      {company.status === "completed" && "✅"}
                      {company.status}
                    </span>
                  </div>
                  <h3>{company.name}</h3>
                  <p>
                    Stage {company.stage} • {company.formsCompleted}/{company.totalForms} forms completed
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(company.formsCompleted / company.totalForms) * 100}%` }}
                    ></div>
                  </div>
                  <div className="company-footer">
                    <span>📊 {Math.round((company.formsCompleted / company.totalForms) * 100)}% complete</span>
                    <span>📅 {company.lastActivity}</span>
                  </div>

                  {/* Stage Management */}
                  <div className="stage-management">
                    <h4>Stage Management:</h4>
                    <div className="stages-row">
                      {[1, 2, 3].map((stage) => {
                        const stageStatus = getStageStatus(company, stage)
                        return (
                          <div key={stage} className={`stage-item ${stageStatus}`}>
                            <div className="stage-number">{stage}</div>
                            <div className="stage-status-text">
                              {stageStatus === "approved" && "✅ Approved"}
                              {stageStatus === "pending-approval" && "⏳ Pending"}
                              {stageStatus === "available" && "📝 Available"}
                              {stageStatus === "locked" && "🔒 Locked"}
                            </div>
                            {stageStatus === "pending-approval" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReviewStage(company, stage)
                                }}
                                className="review-stage-btn"
                              >
                                Review
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="company-actions" style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewSubmittedForms(company)
                      }}
                      className="view-forms-btn"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      📋 View Forms
                    </button>
                    <button
                      onClick={() => onCompanySelect(company)}
                      className="view-btn"
                      style={{
                        background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      👁️ View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const nextStage = company.stage
                        const canSubmit = nextStage === 1 || company.stageApprovals[nextStage - 1]
                        if (canSubmit && !company.submittedStages[nextStage]) {
                          handleSimulateFormSubmission(company.id, nextStage)
                        } else if (company.submittedStages[nextStage]) {
                          alert(`Stage ${nextStage} forms already submitted!`)
                        } else {
                          alert(`Stage ${nextStage - 1} must be approved first!`)
                        }
                      }}
                      className="submit-test-btn"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      📝 Submit Stage {company.stage}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Company Logo Footer */}
        <div className="dashboard-footer">
          <div className="footer-logo">
            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <p>Powered by Vishvas Power</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ETCAdminPanel
