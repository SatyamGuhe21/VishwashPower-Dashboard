"use client"

import { useState, useEffect } from "react"
import FormStage from "./FormStage"

const CompanyWorkflow = ({ company, project, user, onBack, onLogout, onNavigateToAdmin }) => {
  const [currentStage, setCurrentStage] = useState(1)
  const [stageData, setStageData] = useState({
    1: { completed: 0, total: 7, status: "in-progress", approved: false },
    2: { completed: 0, total: 2, status: "locked", approved: false },
    3: { completed: 0, total: 4, status: "locked", approved: false },
    4: { completed: 0, total: 4, status: "locked", approved: false },
    5: { completed: 0, total: 2, status: "locked", approved: false },
  })

  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Initialize default stage data
  const initializeStageData = () => {
    return {
      1: { completed: 0, total: 7, status: "in-progress", approved: false },
      2: { completed: 0, total: 2, status: "locked", approved: false },
      3: { completed: 0, total: 4, status: "locked", approved: false },
      4: { completed: 0, total: 4, status: "locked", approved: false },
      5: { completed: 0, total: 2, status: "locked", approved: false },
    }
  }

  // Check if all stages are completed
  const checkAllStagesCompleted = (stages) => {
    return stages[1].approved && stages[2].approved && stages[3].approved && stages[4].approved && stages[5].approved
  }

  // Load company data from localStorage
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setIsLoading(true)

        // Check if company prop exists
        if (!company || !company.id) {
          console.error("Company data is missing:", company)
          setError("Company data is missing")
          setStageData(initializeStageData())
          setIsLoading(false)
          return
        }

        const savedCompanies = localStorage.getItem("companies")
        if (savedCompanies) {
          const companies = JSON.parse(savedCompanies)
          const currentCompany = companies.find((c) => c.id === company.id)

          if (currentCompany) {
            setCurrentStage(currentCompany.stage || 1)

            // Initialize stage data based on company progress
            const newStageData = {
              1: {
                completed: currentCompany.stage === 1 ? currentCompany.formsCompleted || 0 : 7,
                total: 7,
                status: currentCompany.stage > 1 ? "completed" : currentCompany.status || "in-progress",
                approved: currentCompany.stageApprovals?.["1"] || false,
              },
              2: {
                completed:
                  currentCompany.stage === 2 ? currentCompany.formsCompleted || 0 : currentCompany.stage > 2 ? 2 : 0,
                total: 2,
                status:
                  currentCompany.stage > 2
                    ? "completed"
                    : currentCompany.stage === 2
                      ? currentCompany.status || "in-progress"
                      : "locked",
                approved: currentCompany.stageApprovals?.["2"] || false,
              },
              3: {
                completed:
                  currentCompany.stage === 3 ? currentCompany.formsCompleted || 0 : currentCompany.stage > 3 ? 4 : 0,
                total: 4,
                status:
                  currentCompany.stage > 3
                    ? "completed"
                    : currentCompany.stage === 3
                      ? currentCompany.status || "in-progress"
                      : "locked",
                approved: currentCompany.stageApprovals?.["3"] || false,
              },
              4: {
                completed:
                  currentCompany.stage === 4 ? currentCompany.formsCompleted || 0 : currentCompany.stage > 4 ? 4 : 0,
                total: 4,
                status:
                  currentCompany.stage > 4
                    ? "completed"
                    : currentCompany.stage === 4
                      ? currentCompany.status || "in-progress"
                      : "locked",
                approved: currentCompany.stageApprovals?.["4"] || false,
              },
              5: {
                completed: currentCompany.stage === 5 ? currentCompany.formsCompleted || 0 : 0,
                total: 2,
                status: currentCompany.stage === 5 ? currentCompany.status || "in-progress" : "locked",
                approved: currentCompany.stageApprovals?.["5"] || false,
              },
            }
            setStageData(newStageData)

            // Check if all stages are completed
            if (checkAllStagesCompleted(newStageData)) {
              setIsCompleted(true)
            }
          } else {
            // Company not found in localStorage, initialize with defaults
            console.log("Company not found in localStorage, initializing with defaults")
            setStageData(initializeStageData())
          }
        } else {
          // No companies in localStorage, initialize with defaults
          console.log("No companies in localStorage, initializing with defaults")
          setStageData(initializeStageData())
        }
      } catch (err) {
        console.error("Error loading company data:", err)
        setError("Error loading company data: " + err.message)
        setStageData(initializeStageData())
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanyData()
  }, [company])

  const stages = [
    {
      id: 1,
      name: "Initial Documentation",
      description: "Complete all 7 required initial forms and documentation",
      forms: 7,
      icon: "📋",
    },
    {
      id: 2,
      name: "Circuit Testing",
      description: "Complete all 2 circuit testing and filtration forms",
      forms: 2,
      icon: "⚡",
    },
    {
      id: 3,
      name: "Advanced Testing",
      description: "Complete all 4 advanced testing and measurement forms",
      forms: 4,
      icon: "🔬",
    },
    {
      id: 4,
      name: "Final Verification",
      description: "Complete all 4 final verification and completion forms",
      forms: 4,
      icon: "✅",
    },
    {
      id: 5,
      name: "Quality Assurance",
      description: "Complete all 2 quality assurance and assembly forms",
      forms: 2,
      icon: "🏆",
    },
  ]

  const handleStageComplete = (stageId) => {
    try {
      // Get the current stage data
      const currentStageData = stageData[stageId]
      if (!currentStageData) {
        console.error("Stage data not found for stage:", stageId)
        return
      }

      // Update stage data to pending approval
      setStageData((prev) => ({
        ...prev,
        [stageId]: {
          ...prev[stageId],
          completed: prev[stageId].total,
          status: "pending-approval",
        },
      }))

      // Update company in localStorage with the total forms for this stage
      updateCompanyInStorage(stageId, currentStageData.total, "pending-approval")
    } catch (err) {
      console.error("Error in handleStageComplete:", err)
      setError("Error completing stage")
    }
  }

  const handleApproval = (stageId, approved) => {
    try {
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

          // Unlock next stage if not the final stage
          if (stageId < 5) {
            newData[stageId + 1] = {
              ...newData[stageId + 1],
              status: "in-progress",
            }
            setCurrentStage(stageId + 1) // Auto-switch to next stage
          }

          // Check if all stages are completed after this approval
          if (checkAllStagesCompleted(newData)) {
            setIsCompleted(true)
            console.log("All stages completed! Setting isCompleted to true")
          }

          return newData
        })

        // Update company stage and approval status
        const nextStage = stageId < 5 ? stageId + 1 : stageId
        const finalStatus = stageId === 5 ? "fully-completed" : stageId < 5 ? "in-progress" : "completed"

        updateCompanyInStorage(nextStage, 0, finalStatus, { [stageId]: true })

        if (stageId === 5) {
          // Final completion - show success message
          setTimeout(() => {
            alert("🎉 Congratulations! All stages completed successfully! You can now access the admin panel.")
          }, 500)
        } else {
          alert(`✅ Stage ${stageId} approved! Stage ${stageId + 1} is now unlocked and ready to begin.`)
        }
      } else {
        // Reset stage for revision - all forms need to be redone
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
        alert(
          `❌ Stage ${stageId} sent back for revision. All ${stageData[stageId]?.total || 0} forms need to be completed again.`,
        )
      }
    } catch (err) {
      console.error("Approval error:", err)
      setError("An error occurred during approval process. Please try again.")
    }
  }

  const handleNavigateToETCAdmin = () => {
    console.log("Navigating to ETC Admin Panel")
    if (onNavigateToAdmin) {
      onNavigateToAdmin("etc")
    } else {
      console.error("onNavigateToAdmin function not provided")
    }
  }

  const handleNavigateToMainAdmin = () => {
    console.log("Navigating to Main Admin Panel")
    if (onNavigateToAdmin) {
      onNavigateToAdmin("main")
    } else {
      console.error("onNavigateToAdmin function not provided")
    }
  }

  const updateCompanyInStorage = (stage, formsCompleted, status, approvals = {}) => {
    try {
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
        console.log(
          "Company updated in storage:",
          updatedCompanies.find((c) => c.id === company.id),
        )
      }
    } catch (err) {
      console.error("Error updating company in storage:", err)
    }
  }

  const overallProgress = stages.reduce((acc, stage) => {
    const currentStageData = stageData[stage.id]
    if (!currentStageData) return acc
    const stageProgress = (currentStageData.completed / currentStageData.total) * 100
    return acc + stageProgress / stages.length
  }, 0)

  const getStageStatus = (stageId) => {
    const stage = stageData[stageId]
    if (!stage) return "locked"
    if (stage.approved) return "completed"
    if (stage.completed === stage.total && !stage.approved) return "pending-approval"
    if (stage.completed > 0) return "in-progress"
    return "locked"
  }

  const getTotalFormsCompleted = () => {
    return stages.reduce((total, stage) => {
      const currentStageData = stageData[stage.id]
      if (!currentStageData) return total
      return total + (currentStageData.approved ? currentStageData.total : currentStageData.completed)
    }, 0)
  }

  const getTotalForms = () => {
    return stages.reduce((total, stage) => total + stage.forms, 0)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading workflow data...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Workflow</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={onBack} className="back-btn">
              ← Go Back
            </button>
            <button onClick={() => window.location.reload()} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show missing company data
  if (!company) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <div className="error-icon">📋</div>
          <h3>No Company Selected</h3>
          <p>Please select a company to view the workflow.</p>
          <button onClick={onBack} className="back-btn">
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="workflow-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">
              ← Back
            </button>
            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <div>
              <h1>{company.name}</h1>
              <p>{project?.name || "Project"} - Workflow Management</p>
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

      {/* Completion Overlay - This shows when all stages are completed */}
      {isCompleted && (
        <div className="completion-overlay">
          <div className="completion-card">
            <div className="logo-container">
              <img src="/logo.png" alt="Vishvas Power" className="logo" />
            </div>
            <div className="completion-content">
              <div className="completion-icon">🎉</div>
              <h2>Workflow Completed Successfully!</h2>
              <p>All stages have been completed and approved for {company.name}</p>
              <div className="completion-stats">
                <div className="stat">
                  <span className="stat-number">19</span>
                  <span className="stat-label">Total Forms Completed</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5</span>
                  <span className="stat-label">Stages Approved</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Progress</span>
                </div>
              </div>
              <div className="completion-actions">
                <button onClick={handleNavigateToETCAdmin} className="primary-btn">
                  🏢 Go to ETC Admin Panel
                </button>
                {user?.role === "main-admin" && (
                  <button onClick={handleNavigateToMainAdmin} className="secondary-btn">
                    🛡️ Go to Main Admin
                  </button>
                )}
                <button onClick={onBack} className="secondary-btn">
                  ← Return to Previous
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={() => setError("")} className="error-close">
            ×
          </button>
        </div>
      )}

      <main className="workflow-main">
        {/* Overall Progress */}
        <div className="progress-card">
          <div className="logo-container">
            <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
          </div>
          <h3>🎯 Overall Progress - {Math.round(overallProgress)}% Complete</h3>
          <p>
            Track your progress through all workflow stages ({getTotalFormsCompleted()}/{getTotalForms()} total forms
            completed)
          </p>
          <div className="progress-bar large">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
          <div className="progress-details">
            <div className="progress-stage">
              <span>Stage 1: {stageData[1]?.completed || 0}/7 forms</span>
              <span className={`stage-status ${getStageStatus(1)}`}>
                {stageData[1]?.approved ? "✅ Approved" : getStageStatus(1)}
              </span>
            </div>
            <div className="progress-stage">
              <span>Stage 2: {stageData[2]?.completed || 0}/2 forms</span>
              <span className={`stage-status ${getStageStatus(2)}`}>
                {stageData[2]?.approved ? "✅ Approved" : getStageStatus(2)}
              </span>
            </div>
            <div className="progress-stage">
              <span>Stage 3: {stageData[3]?.completed || 0}/4 forms</span>
              <span className={`stage-status ${getStageStatus(3)}`}>
                {stageData[3]?.approved ? "✅ Approved" : getStageStatus(3)}
              </span>
            </div>
            <div className="progress-stage">
              <span>Stage 4: {stageData[4]?.completed || 0}/4 forms</span>
              <span className={`stage-status ${getStageStatus(4)}`}>
                {stageData[4]?.approved ? "✅ Approved" : getStageStatus(4)}
              </span>
            </div>
            <div className="progress-stage">
              <span>Stage 5: {stageData[5]?.completed || 0}/2 forms</span>
              <span className={`stage-status ${getStageStatus(5)}`}>
                {stageData[5]?.approved ? "✅ Approved" : getStageStatus(5)}
              </span>
            </div>
          </div>
        </div>

        {/* Stage Overview */}
        <div className="stages-grid">
          {stages.map((stage) => {
            const stageInfo = stageData[stage.id]
            if (!stageInfo) return null // Safety check

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
                    {stageInfo.completed}/{stageInfo.total} forms completed
                  </span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(stageInfo.completed / stageInfo.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                {stageInfo.approved && (
                  <div className="stage-approved">
                    <span className="approved-badge">✅ Stage Approved</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Stage Details - Only show if not completed */}
        {!isCompleted && (
          <div className="stage-details">
            <div className="logo-container">
              <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
            </div>
            <h3>📝 Stage {currentStage} Details</h3>
            <p>Complete all {stageData[currentStage]?.total || 0} forms in this stage before submission for approval</p>
            <FormStage
              stage={currentStage}
              stageData={stageData[currentStage]}
              onStageComplete={() => handleStageComplete(currentStage)}
              onApproval={(approved) => handleApproval(currentStage, approved)}
              isETCAdmin={user?.role === "etc-admin"}
              company={company}
            />
          </div>
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

export default CompanyWorkflow
