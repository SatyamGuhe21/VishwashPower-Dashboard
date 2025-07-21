"use client"

import { useState, useEffect } from "react"
import FormStage from "./FormStage"

export default function CompanyForms({ siteEngineer, project, company, onBack, onLogout }) {
  const [currentStage, setCurrentStage] = useState(1)
  const [companyData, setCompanyData] = useState(company)

  useEffect(() => {
    loadCompanyData()
  }, [company.id])

  const loadCompanyData = () => {
    const etcCompanies = JSON.parse(localStorage.getItem("etc_companies") || "[]")
    const updatedCompany = etcCompanies.find((c) => c.id === company.id)
    if (updatedCompany) {
      setCompanyData(updatedCompany)
      setCurrentStage(updatedCompany.stage || 1)
    }
  }

  const handleStageComplete = (stage) => {
    // Update company status to pending approval
    const etcCompanies = JSON.parse(localStorage.getItem("etc_companies") || "[]")
    const updatedCompanies = etcCompanies.map((c) => {
      if (c.id === company.id) {
        return {
          ...c,
          status: "pending-approval",
          lastActivity: new Date().toISOString().split("T")[0],
          submittedStages: {
            ...c.submittedStages,
            [stage]: true,
          },
        }
      }
      return c
    })
    localStorage.setItem("etc_companies", JSON.stringify(updatedCompanies))
    loadCompanyData()
  }

  const handleApproval = (stage, approved) => {
    const etcCompanies = JSON.parse(localStorage.getItem("etc_companies") || "[]")
    const updatedCompanies = etcCompanies.map((c) => {
      if (c.id === company.id) {
        if (approved) {
          return {
            ...c,
            stageApprovals: {
              ...c.stageApprovals,
              [stage]: true,
            },
            stage: stage < 5 ? stage + 1 : stage,
            status: stage === 5 ? "completed" : "in-progress",
            lastActivity: new Date().toISOString().split("T")[0],
          }
        } else {
          return {
            ...c,
            status: "in-progress",
            lastActivity: new Date().toISOString().split("T")[0],
            submittedStages: {
              ...c.submittedStages,
              [stage]: false,
            },
          }
        }
      }
      return c
    })
    localStorage.setItem("etc_companies", JSON.stringify(updatedCompanies))
    loadCompanyData()
  }

  const getStageData = (stageNumber) => {
    const stageForms = {
      1: 7, // Stage 1: 7 forms
      2: 2, // Stage 2: 2 forms
      3: 4, // Stage 3: 4 forms
      4: 4, // Stage 4: 4 forms
      5: 2, // Stage 5: 2 forms
    }

    const totalForms = stageForms[stageNumber] || 0
    const completed =
      stageNumber === companyData.stage
        ? companyData.formsCompleted || 0
        : stageNumber < companyData.stage
          ? totalForms
          : 0

    return {
      total: totalForms,
      completed: completed,
      approved: companyData.stageApprovals && companyData.stageApprovals[stageNumber],
      status:
        companyData.submittedStages && companyData.submittedStages[stageNumber] ? "pending-approval" : "in-progress",
    }
  }

  const canAccessStage = (stageNum) => {
    if (stageNum === 1) return true
    return companyData.stageApprovals && companyData.stageApprovals[stageNum - 1]
  }

  const stages = [
    { id: 1, name: "Initial Documentation", description: "Basic project setup and documentation" },
    { id: 2, name: "Technical Testing", description: "Circuit testing and measurements" },
    { id: 3, name: "Advanced Testing", description: "Comprehensive testing procedures" },
    { id: 4, name: "Final Verification", description: "Final checks and verification" },
    { id: 5, name: "Quality Assurance", description: "Quality control and final approval" },
  ]

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">
              ← Back to Companies
            </button>
            <div className="logo-placeholder">🏗️ VPES</div>
            <div className="header-title">
              <h1>{company.name} - Forms</h1>
              <p>
                {project.name} - Stage {currentStage}
              </p>
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
        {/* Stage Overview */}
        <div className="stages-overview">
          <h2>Form Stages Overview</h2>
          <div className="stages-grid">
            {stages.map((stage) => {
              const stageData = getStageData(stage.id)
              const isActive = currentStage === stage.id
              const canAccess = canAccessStage(stage.id)

              return (
                <div
                  key={stage.id}
                  className={`stage-card ${stageData.approved ? "approved" : ""} ${isActive ? "active" : ""} ${!canAccess ? "locked" : ""}`}
                  onClick={() => canAccess && setCurrentStage(stage.id)}
                >
                  <div className="stage-header">
                    <div className="stage-number">{stage.id}</div>
                    <div className="stage-status-badge">
                      {stageData.approved && "✅ Approved"}
                      {!stageData.approved && stageData.status === "pending-approval" && "⏳ Pending"}
                      {!stageData.approved && stageData.status !== "pending-approval" && canAccess && "📝 Available"}
                      {!canAccess && "🔒 Locked"}
                    </div>
                  </div>
                  <h3>{stage.name}</h3>
                  <p>{stage.description}</p>
                  <div className="stage-forms-count">{stageData.total} forms to complete</div>
                  <div className="stage-progress">
                    <span>
                      {stageData.completed}/{stageData.total} completed
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Stage Form */}
        <div className="current-stage-section">
          <FormStage
            stage={currentStage}
            stageData={getStageData(currentStage)}
            onStageComplete={() => handleStageComplete(currentStage)}
            onApproval={(approved) => handleApproval(currentStage, approved)}
            isETCAdmin={false}
            company={companyData}
          />
        </div>
      </main>
    </div>
  )
}
