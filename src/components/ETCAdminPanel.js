"use client"

import { useState, useEffect } from "react"

const ETCAdminPanel = ({ user, selectedProject, onLogout, onProjectSelect, onCompanySelect, onBackToMain }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [companies, setCompanies] = useState([])
  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects")
    const savedCompanies = localStorage.getItem("companies")

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Initialize with default projects
      const defaultProjects = [
        {
          id: 1,
          name: "Smart City Infrastructure",
          description: "Urban development project for smart city implementation",
          status: "active",
          companies: 3,
          createdAt: "2024-01-15",
        },
        {
          id: 2,
          name: "Green Energy Initiative",
          description: "Renewable energy project for sustainable development",
          status: "active",
          companies: 3,
          createdAt: "2024-02-01",
        },
      ]
      setProjects(defaultProjects)
      localStorage.setItem("projects", JSON.stringify(defaultProjects))
    }

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies))
    } else {
      // Initialize with default companies
      const defaultCompanies = [
        {
          id: 1,
          name: "TCS (Tata Consultancy Services)",
          projectId: 1,
          stage: 1,
          formsCompleted: 5,
          totalForms: 17,
          status: "in-progress",
          lastActivity: "2024-06-01",
          stageApprovals: { 1: false, 2: false, 3: false },
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
        },
        {
          id: 4,
          name: "TCS (Tata Consultancy Services)",
          projectId: 2,
          stage: 1,
          formsCompleted: 15,
          totalForms: 17,
          status: "pending-approval",
          lastActivity: "2024-05-28",
          stageApprovals: { 1: false, 2: false, 3: false },
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
        },
      ]
      setCompanies(defaultCompanies)
      localStorage.setItem("companies", JSON.stringify(defaultCompanies))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies))
  }, [companies])

  const handleCreateProject = () => {
    if (newProject.name && newProject.description) {
      const projectId = Math.max(...projects.map((p) => p.id), 0) + 1

      const project = {
        id: projectId,
        name: newProject.name,
        description: newProject.description,
        status: "active",
        companies: 3,
        createdAt: new Date().toISOString().split("T")[0],
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
        },
      ]

      setCompanies([...companies, ...newCompanies])
      setNewProject({ name: "", description: "" })
      setShowCreateForm(false)
      alert(`Project "${project.name}" created successfully with TCS, IBM, and HCL companies!`)
    }
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

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const projectCompanies = selectedProject
    ? companies.filter((company) => company.projectId === selectedProject.id)
    : []

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
            <h1>{selectedProject ? `${selectedProject.name} - Companies` : "ETC Admin Panel"}</h1>
            <p>{selectedProject ? "Manage companies and workflows" : "Manage projects and companies"}</p>
          </div>
        </div>

        {/* Desktop header right */}
        <div className="header-right desktop-only">
          <span className="user-badge">ETC Admin</span>
          <button onClick={onLogout} className="logout-btn">
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
                <button onClick={onLogout} className="mobile-logout-btn">
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>

      <main className="etc-main">
        {!selectedProject ? (
          <>
            <div className="section-header">
              <div>
                <h2>Projects</h2>
                <p>Create and manage your projects</p>
              </div>
              <button onClick={() => setShowCreateForm(true)} className="create-btn">
                ➕ Create Project
              </button>
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
                    {/* EASY LOGO REPLACEMENT - Just replace the src path */}
                    <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
                    <h3>Create New Project</h3>
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
                    <div className="project-icon" style={{ backgroundColor: "#C41E3A" }}>
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
                <div key={company.id} className="company-card" onClick={() => onCompanySelect(company)}>
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
                </div>
              ))}
            </div>
          </>
        )}

        {/* Company Logo Footer */}
        <div className="dashboard-footer">
          <div className="footer-logo">
            {/* EASY LOGO REPLACEMENT - Just replace the src path */}
            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <p>Powered by Vishvas Power</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ETCAdminPanel
