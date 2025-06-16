"use client"

import { useState, useEffect } from "react"
import FormStage from "./FormStage"

const CompanyWorkflow = ({ company, project, user, onBack, onLogout }) => {
  const [currentStage, setCurrentStage] = useState(1)
  const [stageData, setStageData] = useState({
    1: { completed: 0, total: 17, status: "in-progress", approved: false },
    2: { completed: 0, total: 5, status: "locked", approved: false },
    3: { completed: 0, total: 5, status: "locked", approved: false },
  })

  // Load company data from localStorage
  useEffect(() => {
    const savedCompanies = localStorage.getItem("companies")
    if (savedCompanies) {
      const companies = JSON.parse(savedCompanies)
      const currentCompany = companies.find((c) => c.id === company.id)
      if (currentCompany) {
        setCurrentStage(currentCompany.stage || 1)

        // Initialize stage data based on company progress
        const newStageData = {
          1: {
            completed: currentCompany.stage === 1 ? currentCompany.formsCompleted : 17,
            total: 17,
            status: currentCompany.stage > 1 ? "completed" : currentCompany.status,
            approved: currentCompany.stageApprovals?.["1"] || false,
          },
          2: {
            completed: currentCompany.stage === 2 ? currentCompany.formsCompleted : currentCompany.stage > 2 ? 5 : 0,
            total: 5,
            status:
              currentCompany.stage > 2 ? "completed" : currentCompany.stage === 2 ? currentCompany.status : "locked",
            approved: currentCompany.stageApprovals?.["2"] || false,
          },
          3: {
            completed: currentCompany.stage === 3 ? currentCompany.formsCompleted : 0,
            total: 5,
            status: currentCompany.stage === 3 ? currentCompany.status : "locked",
            approved: currentCompany.stageApprovals?.["3"] || false,
          },
        }
        setStageData(newStageData)
      }
    }
  }, [company])

  const stages = [
    {
      id: 1,
      name: "Initial Documentation",
      description: "Complete all required initial forms and documentation",
      forms: 17,
      icon: "📋",
    },
    {
      id: 2,
      name: "Technical Review",
      description: "Technical specifications and compliance forms",
      forms: 5,
      icon: "🔧",
    },
    {
      id: 3,
      name: "Final Approval",
      description: "Final review and approval documentation",
      forms: 5,
      icon: "🏆",
    },
  ]

  const handleStageComplete = (stageId) => {
    setStageData((prev) => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        completed: prev[stageId].total,
        status: "pending-approval",
      },
    }))

    // Update company in localStorage
    updateCompanyInStorage(stageId, (prev) => prev[stageId].total, "pending-approval")
  }

  const handleApproval = (stageId, approved) => {
    if (approved) {
      setStageData((prev) => {
        const newData = {
          ...prev,
          [stageId]: {
            ...prev[stageId],
            approved: true,
            status: "completed",
          },
        }

        // Unlock next stage
        if (stageId < 3) {
          newData[stageId + 1] = {
            ...newData[stageId + 1],
            status: "in-progress",
          }
        }

        return newData
      })

      // Update company stage and approval status
      updateCompanyInStorage(stageId + 1, 0, "in-progress", { [stageId]: true })

      if (stageId === 3) {
        alert("🎉 Congratulations! All stages completed successfully!")
      } else {
        alert(`✅ Stage ${stageId} approved! Stage ${stageId + 1} is now unlocked.`)
      }
    } else {
      // Reset stage for revision
      setStageData((prev) => ({
        ...prev,
        [stageId]: {
          ...prev[stageId],
          completed: 0,
          status: "in-progress",
          approved: false,
        },
      }))

      updateCompanyInStorage(stageId, 0, "in-progress")
      alert(`❌ Stage ${stageId} sent back for revision. Please complete the forms again.`)
    }
  }

  const updateCompanyInStorage = (stage, formsCompleted, status, approvals = {}) => {
    const savedCompanies = localStorage.getItem("companies")
    if (savedCompanies) {
      const companies = JSON.parse(savedCompanies)
      const updatedCompanies = companies.map((c) => {
        if (c.id === company.id) {
          return {
            ...c,
            stage: stage,
            formsCompleted: formsCompleted,
            status: status,
            lastActivity: new Date().toISOString().split("T")[0],
            stageApprovals: { ...c.stageApprovals, ...approvals },
          }
        }
        return c
      })
      localStorage.setItem("companies", JSON.stringify(updatedCompanies))
    }
  }

  const overallProgress = stages.reduce((acc, stage) => {
    const stageProgress = (stageData[stage.id].completed / stageData[stage.id].total) * 100
    return acc + stageProgress / stages.length
  }, 0)

  const getStageStatus = (stageId) => {
    const stage = stageData[stageId]
    if (stage.approved) return "completed"
    if (stage.completed === stage.total && !stage.approved) return "pending-approval"
    if (stage.completed > 0) return "in-progress"
    return "locked"
  }

  return (
    <div className="dashboard-container">
      <header className="workflow-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">
              ← Back
            </button>
            {/* EASY LOGO REPLACEMENT - Just replace the src path */}
            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <div>
              <h1>{company.name}</h1>
              <p>{project.name} - Workflow Management</p>
            </div>
          </div>
          <div className="header-right">
            <span className="user-badge">{user?.role === "etc-admin" ? "ETC Admin" : "Company Admin"}</span>
            <button onClick={onLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="workflow-main">
        {/* Overall Progress */}
        <div className="progress-card">
          <div className="logo-container">
            {/* EASY LOGO REPLACEMENT - Just replace the src path */}
            <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
          </div>
          <h3>🎯 Overall Progress - {Math.round(overallProgress)}% Complete</h3>
          <p>Track your progress through all workflow stages</p>
          <div className="progress-bar large">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>

        {/* Stage Overview */}
        <div className="stages-grid">
          {stages.map((stage) => {
            const stageInfo = stageData[stage.id]
            const status = getStageStatus(stage.id)
            const isActive = currentStage === stage.id
            const isLocked = status === "locked"

            return (
              <div
                key={stage.id}
                className={`stage-card ${isActive ? "active" : ""} ${isLocked ? "locked" : ""} ${status}`}
                onClick={() => !isLocked && setCurrentStage(stage.id)}
              >
                <div className="stage-header">
                  <div className="stage-icon">{stage.icon}</div>
                  <span className={`status-badge ${status}`}>
                    {status === "completed" && "✅"}
                    {status === "pending-approval" && "⏳"}
                    {status === "in-progress" && "🔄"}
                    {status === "locked" && "🔒"}
                    {status}
                  </span>
                </div>
                <h4>
                  Stage {stage.id}: {stage.name}
                </h4>
                <p>{stage.description}</p>
                <div className="stage-progress">
                  <span>
                    {stageInfo.completed}/{stageInfo.total} forms
                  </span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(stageInfo.completed / stageInfo.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stage Details */}
        <div className="stage-details">
          <div className="logo-container">
            {/* EASY LOGO REPLACEMENT - Just replace the src path */}
            <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
          </div>
          <h3>📝 Stage {currentStage} Details</h3>
          <p>Complete all forms in this stage to proceed</p>
          <FormStage
            stage={currentStage}
            stageData={stageData[currentStage]}
            onStageComplete={() => handleStageComplete(currentStage)}
            onApproval={(approved) => handleApproval(currentStage, approved)}
            isETCAdmin={user?.role === "etc-admin"}
            company={company}
          />
        </div>

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

export default CompanyWorkflow
