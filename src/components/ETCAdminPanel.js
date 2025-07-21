"use client"

import { useState, useEffect } from "react"

const ETCAdminPanel = ({ user, selectedProject, onLogout, onProjectSelect, onCompanySelect, onBackToMain }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [projects, setProjects] = useState([])
  const [subProjects, setSubProjects] = useState([]) // New state for sub-projects
  const [companies, setCompanies] = useState([])
  const [submittedForms, setSubmittedForms] = useState([])

  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedMainProject, setSelectedMainProject] = useState(null) // Renamed selectedProject to selectedMainProject for clarity
  const [selectedSubProject, setSelectedSubProject] = useState(null) // New state for selected sub-project

  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const [newSubProject, setNewSubProject] = useState({ name: "", description: "" }) // New state for creating sub-projects
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false) // Renamed for clarity
  const [showCreateSubProjectForm, setShowCreateSubProjectForm] = useState(false) // New state for sub-project form

  const [searchTerm, setSearchTerm] = useState("")
  const [reviewMode, setReviewMode] = useState(false)
  const [selectedCompanyForReview, setSelectedCompanyForReview] = useState(null)
  const [currentStageReview, setCurrentStageReview] = useState(1)
  const [showSubmitterReview, setShowSubmitterReview] = useState(false)

  // Default data for initialization
  const defaultDepartments = [
    {
      id: 1,
      name: "Auto Transformer",
      description: "Auto transformer department for power distribution systems",
      icon: "⚡",
      color: "#C41E3A",
    },
    {
      id: 2,
      name: "Traction Transformer",
      description: "Traction transformer department for railway systems",
      icon: "🚊",
      color: "#1E3A8A",
    },
    {
      id: 3,
      name: "V Connected 63 MVA Transformer",
      description: "V Connected 63 MVA transformer department for high voltage systems",
      icon: "🔌",
      color: "#047857",
    },
  ]

  const defaultProjects = [
    {
      id: 101,
      name: "Smart City Infrastructure",
      description: "Urban development project for smart city implementation",
      status: "active",
      createdAt: "2024-01-15",
      departmentId: 1,
    },
    {
      id: 102,
      name: "Railway Electrification",
      description: "Project for electrifying railway lines",
      status: "active",
      createdAt: "2024-02-01",
      departmentId: 2,
    },
    {
      id: 103,
      name: "Grid Modernization",
      description: "Modernizing the power grid for efficiency",
      status: "active",
      createdAt: "2024-02-15",
      departmentId: 3,
    },
  ]

  const defaultSubProjects = [
    // Sub-projects for Smart City Infrastructure (projectId: 101)
    {
      id: 1001,
      name: "Phase 1 - Downtown",
      description: "Initial phase covering downtown area",
      status: "active",
      createdAt: "2024-03-01",
      projectId: 101,
    },
    {
      id: 1002,
      name: "Phase 2 - Industrial Zone",
      description: "Second phase covering industrial zone",
      status: "active",
      createdAt: "2024-03-15",
      projectId: 101,
    },
    // Sub-projects for Railway Electrification (projectId: 102)
    {
      id: 2001,
      name: "North Line Upgrade",
      description: "Upgrade of the northern railway line",
      status: "active",
      createdAt: "2024-04-01",
      projectId: 102,
    },
    // Sub-projects for Grid Modernization (projectId: 103)
    {
      id: 3001,
      name: "Substation A Expansion",
      description: "Expansion of Substation A capacity",
      status: "active",
      createdAt: "2024-05-01",
      projectId: 103,
    },
  ]

  const defaultCompanies = [
    // Companies for Phase 1 - Downtown (subProjectId: 1001)
    {
      id: 1,
      name: "RVNL",
      subProjectId: 1001,
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
      name: "Eastern Railway",
      subProjectId: 1001,
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
      name: "RS Infra",
      subProjectId: 1001,
      stage: 1,
      formsCompleted: 12,
      totalForms: 17,
      status: "in-progress",
      lastActivity: "2024-06-01",
      stageApprovals: { 1: false, 2: false, 3: false },
      submittedStages: { 1: false, 2: false, 3: false },
    },
    {
      id: 4,
      name: "Blue Star",
      subProjectId: 1001,
      stage: 1,
      formsCompleted: 5,
      totalForms: 17,
      status: "in-progress",
      lastActivity: "2024-06-03",
      stageApprovals: { 1: false, 2: false, 3: false },
      submittedStages: { 1: false, 2: false, 3: false },
    },
    {
      id: 5,
      name: "Track and Tower",
      subProjectId: 1001,
      stage: 1,
      formsCompleted: 10,
      totalForms: 17,
      status: "in-progress",
      lastActivity: "2024-06-04",
      stageApprovals: { 1: false, 2: false, 3: false },
      submittedStages: { 1: false, 2: false, 3: false },
    },

    // Companies for Phase 2 - Industrial Zone (subProjectId: 1002)
    {
      id: 6,
      name: "RVNL",
      subProjectId: 1002,
      stage: 2,
      formsCompleted: 34,
      totalForms: 34,
      status: "pending-approval",
      lastActivity: "2024-05-28",
      stageApprovals: { 1: true, 2: false, 3: false },
      submittedStages: { 1: true, 2: true, 3: false },
    },
    {
      id: 7,
      name: "Eastern Railway",
      subProjectId: 1002,
      stage: 1,
      formsCompleted: 8,
      totalForms: 17,
      status: "in-progress",
      lastActivity: "2024-06-01",
      stageApprovals: { 1: false, 2: false, 3: false },
      submittedStages: { 1: false, 2: false, 3: false },
    },
    // Companies for North Line Upgrade (subProjectId: 2001)
    {
      id: 8,
      name: "RS Infra",
      subProjectId: 2001,
      stage: 3,
      formsCompleted: 51,
      totalForms: 51,
      status: "completed",
      lastActivity: "2024-06-03",
      stageApprovals: { 1: true, 2: true, 3: true },
      submittedStages: { 1: true, 2: true, 3: true },
    },
  ]

  const mockSubmittedForms = [
    // RVNL Phase 1 - Stage 1 Forms
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
    // RVNL Phase 2 - Stage 2 Forms
    {
      id: 4,
      companyId: 6,
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
      companyId: 6,
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
    // RS Infra North Line Upgrade - All Stages (Completed)
    {
      id: 6,
      companyId: 8,
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
      companyId: 8,
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
      companyId: 8,
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

  // Load data from localStorage on component mount
  useEffect(() => {
    setDepartments(defaultDepartments) // Departments are static

    const savedProjects = localStorage.getItem("etc_projects")
    const savedSubProjects = localStorage.getItem("etc_sub_projects") // New localStorage key
    const savedCompanies = localStorage.getItem("etc_companies")
    const savedSubmittedForms = localStorage.getItem("etc_submitted_forms")

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      setProjects(defaultProjects)
      localStorage.setItem("etc_projects", JSON.stringify(defaultProjects))
    }

    if (savedSubProjects) {
      setSubProjects(JSON.parse(savedSubProjects))
    } else {
      setSubProjects(defaultSubProjects)
      localStorage.setItem("etc_sub_projects", JSON.stringify(defaultSubProjects))
    }

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies))
    } else {
      setCompanies(defaultCompanies)
      localStorage.setItem("etc_companies", JSON.stringify(defaultCompanies))
    }

    if (savedSubmittedForms) {
      setSubmittedForms(JSON.parse(savedSubmittedForms))
    } else {
      setSubmittedForms(mockSubmittedForms)
      localStorage.setItem("etc_submitted_forms", JSON.stringify(mockSubmittedForms))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("etc_projects", JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem("etc_sub_projects", JSON.stringify(subProjects))
  }, [subProjects])

  useEffect(() => {
    localStorage.setItem("etc_companies", JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    localStorage.setItem("etc_submitted_forms", JSON.stringify(submittedForms))
  }, [submittedForms])

  const handleCreateProject = () => {
    if (newProject.name && newProject.description && selectedDepartment) {
      const projectId = Math.max(...projects.map((p) => p.id), 0) + 1

      const project = {
        id: projectId,
        name: newProject.name,
        description: newProject.description,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        departmentId: selectedDepartment.id,
      }

      setProjects([...projects, project])
      setNewProject({ name: "", description: "" })
      setShowCreateProjectForm(false)
      alert(`Main Project "${project.name}" created successfully in ${selectedDepartment.name}!`)
    }
  }

  const handleCreateSubProject = () => {
    if (newSubProject.name && newSubProject.description && selectedMainProject) {
      const subProjectId = Math.max(...subProjects.map((sp) => sp.id), 0) + 1

      const subProject = {
        id: subProjectId,
        name: newSubProject.name,
        description: newSubProject.description,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        projectId: selectedMainProject.id,
      }

      setSubProjects([...subProjects, subProject])

      // Automatically add the 5 new companies for this sub-project
      const newCompanies = [
        {
          id: Math.max(...companies.map((c) => c.id), 0) + 1,
          name: "RVNL",
          subProjectId: subProjectId,
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
          name: "Eastern Railway",
          subProjectId: subProjectId,
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
          name: "RS Infra",
          subProjectId: subProjectId,
          stage: 1,
          formsCompleted: 0,
          totalForms: 17,
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        {
          id: Math.max(...companies.map((c) => c.id), 0) + 4,
          name: "Blue Star",
          subProjectId: subProjectId,
          stage: 1,
          formsCompleted: 0,
          totalForms: 17,
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
          stageApprovals: { 1: false, 2: false, 3: false },
          submittedStages: { 1: false, 2: false, 3: false },
        },
        {
          id: Math.max(...companies.map((c) => c.id), 0) + 5,
          name: "Track and Tower",
          subProjectId: subProjectId,
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
      setNewSubProject({ name: "", description: "" })
      setShowCreateSubProjectForm(false)
      alert(
        `Sub-project "${subProject.name}" created successfully under "${selectedMainProject.name}" with 5 companies!`,
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

  const getDepartmentProjects = (departmentId) => {
    return projects.filter((project) => project.departmentId === departmentId)
  }

  const getProjectSubProjects = (projectId) => {
    return subProjects.filter((subProject) => subProject.projectId === projectId)
  }

  const getSubProjectCompanies = (subProjectId) => {
    return companies.filter((company) => company.subProjectId === subProjectId)
  }

  const filteredProjects = selectedDepartment
    ? getDepartmentProjects(selectedDepartment.id).filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const filteredSubProjects = selectedMainProject
    ? getProjectSubProjects(selectedMainProject.id).filter((subProject) =>
        subProject.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const currentStageForms = reviewMode
    ? submittedForms.filter(
        (form) => form.companyId === selectedCompanyForReview.id && form.stage === currentStageReview,
      )
    : []

  const allCompanyForms = showSubmitterReview
    ? submittedForms.filter((form) => form.companyId === selectedCompanyForReview.id)
    : []

  const handleLogoutAndClearData = () => {
    // Clear all ETC admin data on logout
    localStorage.removeItem("etc_projects")
    localStorage.removeItem("etc_sub_projects")
    localStorage.removeItem("etc_companies")
    localStorage.removeItem("etc_submitted_forms")

    // Reset all states
    setProjects([])
    setSubProjects([])
    setCompanies([])
    setSubmittedForms([])
    setSelectedDepartment(null)
    setSelectedMainProject(null)
    setSelectedSubProject(null)
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
                  ? `Review Stage ${currentStageReview} - ${selectedCompanyForReview?.name}`
                  : showSubmitterReview
                    ? `Submitted Forms - ${selectedCompanyForReview?.name}`
                    : selectedSubProject
                      ? `${selectedSubProject.name} - Companies`
                      : selectedMainProject
                        ? `${selectedMainProject.name} - Sub-Projects`
                        : selectedDepartment
                          ? `${selectedDepartment.name} - Projects`
                          : "ETC Admin Panel"}
              </h1>
              <p>
                {reviewMode
                  ? "Review and approve/reject stage forms"
                  : showSubmitterReview
                    ? "View all submitted forms by company"
                    : selectedSubProject
                      ? "Manage companies and their workflows"
                      : selectedMainProject
                        ? "Manage sub-projects under this project"
                        : selectedDepartment
                          ? "Manage projects in department"
                          : "Manage departments, projects and companies"}
              </p>
            </div>
          </div>

          {/* Desktop header right */}
          <div className="header-right desktop-only">
            <span className="user-badge">ETC Admin</span>
            <button onClick={handleLogoutAndClearData} className="logout-btn">
              🚪 Logout
            </button>
          </div>

          {/* Mobile menu overlay */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <img src="/placeholder.svg?height=32&width=32" alt="Vishvas Power" className="logo-small" />
                  <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                    ×
                  </button>
                </div>
                <div className="mobile-menu-content">
                  <div className="mobile-user-info">
                    <span className="user-badge">ETC Admin</span>
                  </div>
                  <button onClick={handleLogoutAndClearData} className="mobile-logout-btn">
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
                  <strong>Company:</strong> {selectedCompanyForReview?.name}
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
                <p>Review all forms submitted by {selectedCompanyForReview?.name}</p>
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
                <h2>Transformer Categories</h2>
                <p>Select a category to manage projects and sub-projects</p>
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
                      <span>
                        🏢{" "}
                        {departmentProjects.reduce((acc, proj) => {
                          const subProjs = getProjectSubProjects(proj.id)
                          return acc + subProjs.length * 5 // 5 companies per sub-project
                        }, 0)}{" "}
                        companies
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !selectedMainProject ? (
          // Projects View for Selected Department
          <>
            <div className="section-header">
              <div>
                <h2>Projects in {selectedDepartment.name}</h2>
                <p>Create and manage projects for this category</p>
              </div>
              <div className="section-actions">
                <button onClick={() => setShowCreateProjectForm(true)} className="create-btn">
                  ➕ Create Project
                </button>
                <button onClick={() => setSelectedDepartment(null)} className="back-btn">
                  ← Back to Categories
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

            {showCreateProjectForm && (
              <div className="modal-overlay" onClick={() => setShowCreateProjectForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <img src="/placeholder.svg?height=32&width=32" alt="Vishvas Power" className="logo-small" />
                    <h3>Create New Project in {selectedDepartment.name}</h3>
                  </div>
                  <p>Sub-projects and companies will be added later</p>
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
                    <button onClick={() => setShowCreateProjectForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card" onClick={() => setSelectedMainProject(project)}>
                  <div className="project-header">
                    <div className="project-icon" style={{ backgroundColor: selectedDepartment.color }}>
                      📁
                    </div>
                    <span className={`status-badge ${getStatusColor(project.status)}`}>{project.status}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-footer">
                    <span>📂 {getProjectSubProjects(project.id).length} sub-projects</span>
                    <span>📅 {project.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : !selectedSubProject ? (
          // Sub-Projects View for Selected Main Project
          <>
            <div className="section-header">
              <div>
                <h2>Sub-Projects in {selectedMainProject.name}</h2>
                <p>Create and manage sub-projects for this main project</p>
              </div>
              <div className="section-actions">
                <button onClick={() => setShowCreateSubProjectForm(true)} className="create-btn">
                  ➕ Create Sub-Project
                </button>
                <button onClick={() => setSelectedMainProject(null)} className="back-btn">
                  ← Back to Projects
                </button>
              </div>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search sub-projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {showCreateSubProjectForm && (
              <div className="modal-overlay" onClick={() => setShowCreateSubProjectForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <img src="/placeholder.svg?height=32&width=32" alt="Vishvas Power" className="logo-small" />
                    <h3>Create New Sub-Project under {selectedMainProject.name}</h3>
                  </div>
                  <p>5 companies will be automatically added to this sub-project</p>
                  <div className="form-group">
                    <label>Sub-Project Name</label>
                    <input
                      type="text"
                      placeholder="Enter sub-project name"
                      value={newSubProject.name}
                      onChange={(e) => setNewSubProject({ ...newSubProject, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter sub-project description"
                      value={newSubProject.description}
                      onChange={(e) => setNewSubProject({ ...newSubProject, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      onClick={handleCreateSubProject}
                      className="submit-btn"
                      disabled={!newSubProject.name || !newSubProject.description}
                    >
                      Create Sub-Project
                    </button>
                    <button onClick={() => setShowCreateSubProjectForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="projects-grid">
              {filteredSubProjects.map((subProject) => (
                <div key={subProject.id} className="project-card" onClick={() => setSelectedSubProject(subProject)}>
                  <div className="project-header">
                    <div className="project-icon" style={{ backgroundColor: selectedDepartment.color }}>
                      📦
                    </div>
                    <span className={`status-badge ${getStatusColor(subProject.status)}`}>{subProject.status}</span>
                  </div>
                  <h3>{subProject.name}</h3>
                  <p>{subProject.description}</p>
                  <div className="project-footer">
                    <span>🏢 {getSubProjectCompanies(subProject.id).length} companies</span>
                    <span>📅 {subProject.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Companies View for Selected Sub-Project
          <>
            <div className="section-header">
              <div>
                <h2>Companies in {selectedSubProject.name}</h2>
                <p>Manage companies and their workflows</p>
              </div>
              <button onClick={() => setSelectedSubProject(null)} className="back-btn">
                ← Back to Sub-Projects
              </button>
            </div>

            <div className="companies-grid">
              {getSubProjectCompanies(selectedSubProject.id).map((company) => (
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
