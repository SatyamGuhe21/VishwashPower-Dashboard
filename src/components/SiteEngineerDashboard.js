"use client"

import { useState, useEffect } from "react"

export default function SiteEngineerDashboard({ siteEngineer, onProjectSelect, onLogout }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    try {
      // Load projects created by ETC Admin or create sample data
      let etcProjects = JSON.parse(localStorage.getItem("etc_projects") || "[]")
      let etcCompanies = JSON.parse(localStorage.getItem("etc_companies") || "[]")

      // Create sample data if none exists
      if (etcProjects.length === 0) {
        etcProjects = [
          {
            id: 1,
            name: "Smart City Infrastructure",
            description: "Power distribution system for smart city project",
            departmentName: "ETC Department",
            createdAt: "2024-01-15",
            status: "active",
          },
          {
            id: 2,
            name: "Industrial Power Grid",
            description: "High voltage power grid for industrial complex",
            departmentName: "ETC Department",
            createdAt: "2024-01-10",
            status: "active",
          },
        ]
        localStorage.setItem("etc_projects", JSON.stringify(etcProjects))
      }

      if (etcCompanies.length === 0) {
        etcCompanies = [
          {
            id: 1,
            projectId: 1,
            name: "IBM",
            stage: 1,
            status: "in-progress",
            formsCompleted: 0,
            totalForms: 7,
            lastActivity: "2024-01-15",
            stageApprovals: {},
            submittedStages: {},
          },
          {
            id: 2,
            projectId: 1,
            name: "TCS",
            stage: 1,
            status: "in-progress",
            formsCompleted: 0,
            totalForms: 7,
            lastActivity: "2024-01-15",
            stageApprovals: {},
            submittedStages: {},
          },
          {
            id: 3,
            projectId: 1,
            name: "HCL",
            stage: 1,
            status: "in-progress",
            formsCompleted: 0,
            totalForms: 7,
            lastActivity: "2024-01-15",
            stageApprovals: {},
            submittedStages: {},
          },
          {
            id: 4,
            projectId: 2,
            name: "Infosys",
            stage: 1,
            status: "in-progress",
            formsCompleted: 0,
            totalForms: 7,
            lastActivity: "2024-01-10",
            stageApprovals: {},
            submittedStages: {},
          },
          {
            id: 5,
            projectId: 2,
            name: "Wipro",
            stage: 1,
            status: "in-progress",
            formsCompleted: 0,
            totalForms: 7,
            lastActivity: "2024-01-10",
            stageApprovals: {},
            submittedStages: {},
          },
        ]
        localStorage.setItem("etc_companies", JSON.stringify(etcCompanies))
      }

      // Get projects with their companies
      const projectsWithCompanies = etcProjects.map((project) => {
        const projectCompanies = etcCompanies.filter((company) => company.projectId === project.id)
        return {
          ...project,
          companies: projectCompanies,
        }
      })

      setProjects(projectsWithCompanies)
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProjectStatusSummary = (project) => {
    const totalCompanies = project.companies.length
    const completedCompanies = project.companies.filter((c) => c.status === "completed").length
    const inProgressCompanies = project.companies.filter(
      (c) => c.status === "in-progress" || c.status === "pending-approval",
    ).length

    return {
      total: totalCompanies,
      completed: completedCompanies,
      inProgress: inProgressCompanies,
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-placeholder">🏗️ VPES</div>
            <div className="header-title">
              <h1>Site Engineer Dashboard</h1>
              <p>
                Welcome, {siteEngineer.name} - {siteEngineer.department}
              </p>
            </div>
          </div>
          <div className="header-right">
            <div className="engineer-info">
              <span className="engineer-badge">👷‍♂️ Site Engineer</span>
              <span className="engineer-id">ID: {siteEngineer.engineerId}</span>
            </div>
            <button onClick={onLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <h2>Available Projects</h2>
            <p>Select a project to view companies and fill forms</p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="no-projects">
            <div className="no-projects-icon">📋</div>
            <h3>No Projects Available</h3>
            <p>No projects have been created by ETC Admin yet. Please check back later.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const statusSummary = getProjectStatusSummary(project)

              return (
                <div key={project.id} className="project-card" onClick={() => onProjectSelect(project)}>
                  <div className="project-header">
                    <div className="project-icon">📁</div>
                    <span className="status-badge status-active">Active</span>
                  </div>

                  <h3>{project.name}</h3>
                  <p>{project.description}</p>

                  <div className="project-stats">
                    <div className="stat-item">
                      <span className="stat-number">{statusSummary.total}</span>
                      <span className="stat-label">Companies</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{statusSummary.inProgress}</span>
                      <span className="stat-label">In Progress</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{statusSummary.completed}</span>
                      <span className="stat-label">Completed</span>
                    </div>
                  </div>

                  <div className="project-companies">
                    <h4>Companies:</h4>
                    <div className="companies-list">
                      {project.companies.map((company) => (
                        <div key={company.id} className="company-chip">
                          <span className="company-name">{company.name}</span>
                          <span className={`company-status ${company.status}`}>
                            {company.status === "completed" && "✅"}
                            {company.status === "in-progress" && "🔄"}
                            {company.status === "pending-approval" && "⏳"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="project-footer">
                    <span>📅 Created: {project.createdAt}</span>
                    <span>🏢 Department: {project.departmentName || "ETC"}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="dashboard-footer">
          <div className="footer-logo">
            <div className="logo-placeholder">🏗️ VPES</div>
            <p>Powered by Vishvas Power Engineering Services</p>
          </div>
        </div>
      </main>
    </div>
  )
}
