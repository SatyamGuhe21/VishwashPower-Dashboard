"use client"

import { useState, useEffect } from "react"
import CompanyForms from "./CompanyForms"

export default function ProjectWorkflow({ siteEngineer, project, onBack, onLogout }) {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    if (project) {
      loadCompanies()
    }
  }, [project])

  const loadCompanies = () => {
    const etcCompanies = JSON.parse(localStorage.getItem("etc_companies") || "[]")
    const projectCompanies = etcCompanies.filter((company) => company.projectId === project.id)
    setCompanies(projectCompanies)
  }

  const handleCompanySelect = (company) => {
    setSelectedCompany(company)
  }

  const handleBackToCompanies = () => {
    setSelectedCompany(null)
    loadCompanies() // Refresh companies data
  }

  if (selectedCompany) {
    return (
      <CompanyForms
        siteEngineer={siteEngineer}
        project={project}
        company={selectedCompany}
        onBack={handleBackToCompanies}
        onLogout={onLogout}
      />
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">
              ← Back to Projects
            </button>
            <div className="logo-placeholder">🏗️ VPES</div>
            <div className="header-title">
              <h1>{project.name}</h1>
              <p>Select a company to fill forms</p>
            </div>
          </div>
          <div className="header-right">
            <span className="engineer-badge">👷‍♂️ {siteEngineer.name}</span>
            <button onClick={onLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="section-header">
          <div>
            <h2>Companies in {project.name}</h2>
            <p>Select a company to view and fill their forms</p>
          </div>
        </div>

        <div className="companies-grid">
          {companies.map((company) => (
            <div key={company.id} className="company-card" onClick={() => handleCompanySelect(company)}>
              <div className="company-header">
                <div className="company-icon">🏢</div>
                <span className={`status-badge ${getStatusClass(company.status)}`}>
                  {getStatusIcon(company.status)} {company.status}
                </span>
              </div>

              <h3>{company.name}</h3>
              <p>Current Stage: {company.stage}</p>

              <div className="progress-info">
                <div className="progress-text">
                  <span>
                    Forms Progress: {company.formsCompleted}/{company.totalForms}
                  </span>
                  <span>{Math.round((company.formsCompleted / company.totalForms) * 100)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(company.formsCompleted / company.totalForms) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="stage-indicators">
                <h4>Stage Progress:</h4>
                <div className="stages-row">
                  {[1, 2, 3, 4, 5].map((stageNum) => (
                    <div key={stageNum} className={`stage-indicator ${getStageStatus(company, stageNum)}`}>
                      <div className="stage-number">{stageNum}</div>
                      <div className="stage-status">{getStageStatusIcon(company, stageNum)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="company-footer">
                <span>📅 Last Activity: {company.lastActivity}</span>
                <span>🎯 Stage {company.stage}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function getStatusClass(status) {
  switch (status) {
    case "completed":
      return "status-completed"
    case "pending-approval":
      return "status-pending"
    case "in-progress":
      return "status-progress"
    default:
      return "status-default"
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "completed":
      return "✅"
    case "pending-approval":
      return "⏳"
    case "in-progress":
      return "🔄"
    default:
      return "📋"
  }
}

function getStageStatus(company, stageNum) {
  if (company.stageApprovals && company.stageApprovals[stageNum]) {
    return "approved"
  }
  if (company.stage === stageNum) {
    return "current"
  }
  if (company.stage > stageNum) {
    return "completed"
  }
  return "locked"
}

function getStageStatusIcon(company, stageNum) {
  const status = getStageStatus(company, stageNum)
  switch (status) {
    case "approved":
      return "✅"
    case "current":
      return "🔄"
    case "completed":
      return "✅"
    case "locked":
      return "🔒"
    default:
      return "⏳"
  }
}
