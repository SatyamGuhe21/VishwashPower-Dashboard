"use client"

import { useState, useEffect } from "react"

const FormStage = ({ stage, stageData, onStageComplete, onApproval, isETCAdmin, company }) => {
  const [currentForm, setCurrentForm] = useState(1)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    setCurrentForm(stageData.completed + 1)
  }, [stageData.completed])

  const getFormsForStage = (stageNumber) => {
    switch (stageNumber) {
      case 1:
        return [
          "Company Registration Details",
          "Business License Information",
          "Tax Registration Documents",
          "Financial Statements",
          "Insurance Documentation",
          "Environmental Compliance",
          "Safety Protocols",
          "Quality Assurance Plans",
          "Technical Specifications",
          "Project Timeline",
          "Resource Allocation",
          "Risk Assessment",
          "Stakeholder Information",
          "Communication Plan",
          "Budget Breakdown",
          "Legal Compliance",
          "Final Documentation Review",
        ]
      case 2:
        return [
          "Technical Architecture Review",
          "Security Assessment",
          "Performance Standards",
          "Integration Requirements",
          "Final Technical Approval",
        ]
      case 3:
        return [
          "Executive Summary",
          "Final Risk Assessment",
          "Compliance Verification",
          "Stakeholder Sign-off",
          "Project Authorization",
        ]
      default:
        return []
    }
  }

  const forms = getFormsForStage(stage)
  const isFormCompleted = (formIndex) => formIndex <= stageData.completed
  const isCurrentFormActive = currentForm <= stageData.completed + 1 && !stageData.approved
  const allFormsCompleted = stageData.completed === stageData.total
  const isPendingApproval = allFormsCompleted && !stageData.approved && stageData.status === "pending-approval"

  const handleFormSubmit = () => {
    if (currentForm === stageData.total) {
      onStageComplete()
      alert("All forms completed! Sent for ETC Admin approval.")
    } else {
      setCurrentForm(currentForm + 1)

      // Update company progress in localStorage
      const savedCompanies = localStorage.getItem("companies")
      if (savedCompanies) {
        const companies = JSON.parse(savedCompanies)
        const updatedCompanies = companies.map((c) => {
          if (c.id === company.id) {
            return {
              ...c,
              formsCompleted: currentForm,
              lastActivity: new Date().toISOString().split("T")[0],
            }
          }
          return c
        })
        localStorage.setItem("companies", JSON.stringify(updatedCompanies))
      }

      alert(`Form ${currentForm} completed successfully!`)
    }
  }

  const handleApprovalAction = (approved) => {
    onApproval(approved)
  }

  return (
    <div className="form-stage">
      {/* Progress Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon vishvas-success">✅</div>
          <div className="stat-content">
            <h4>Completed Forms</h4>
            <div className="stat-number">{stageData.completed}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon vishvas-accent">⏳</div>
          <div className="stat-content">
            <h4>Remaining Forms</h4>
            <div className="stat-number">{stageData.total - stageData.completed}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon vishvas-primary">📊</div>
          <div className="stat-content">
            <h4>Progress</h4>
            <div className="stat-number">{Math.round((stageData.completed / stageData.total) * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Forms List */}
      <div className="forms-list">
        <div className="logo-container">
          {/* EASY LOGO REPLACEMENT - Just replace the src path */}
          <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
        </div>
        <h4>📋 Forms Checklist</h4>
        <p>Complete each form in sequence to progress through the stage</p>
        <div className="forms-grid">
          {forms.map((formName, index) => {
            const formNumber = index + 1
            const isCompleted = isFormCompleted(formNumber)
            const isCurrent = formNumber === currentForm && isCurrentFormActive

            return (
              <div
                key={formNumber}
                className={`form-item ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="form-number">{isCompleted ? "✅" : formNumber}</div>
                <div className="form-content">
                  <h5>{formName}</h5>
                  <p>
                    Form {formNumber} of {forms.length}
                  </p>
                </div>
                <div className="form-status">
                  {isCompleted ? (
                    <span className="status-badge status-completed">✅ Completed</span>
                  ) : isCurrent ? (
                    <span className="status-badge status-progress">🔄 Current</span>
                  ) : (
                    <span className="status-badge status-pending">⏳ Pending</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Form */}
      {isCurrentFormActive && !allFormsCompleted && (
        <div className="current-form">
          <div className="logo-container">
            {/* EASY LOGO REPLACEMENT - Just replace the src path */}
            <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
          </div>
          <h4>
            📝 Form {currentForm}: {forms[currentForm - 1]}
          </h4>
          <p>Fill out the required information for this form</p>
          <div className="form-fields">
            <div className="form-group">
              <label>📄 Document Reference</label>
              <input
                type="text"
                placeholder="Enter document reference"
                value={formData[`form${currentForm}_field1`] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`form${currentForm}_field1`]: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>📅 Date</label>
              <input
                type="date"
                value={formData[`form${currentForm}_field2`] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`form${currentForm}_field2`]: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group full-width">
              <label>📝 Description</label>
              <textarea
                placeholder="Enter detailed description"
                value={formData[`form${currentForm}_description`] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`form${currentForm}_description`]: e.target.value,
                  })
                }
                rows="4"
              />
            </div>
          </div>
          <button onClick={handleFormSubmit} className="submit-btn">
            {currentForm === stageData.total ? "📤 Submit for Approval" : "✅ Complete Form"}
          </button>
        </div>
      )}

      {/* Approval Section */}
      {isPendingApproval && (
        <div className="approval-section">
          <div className="approval-card pending">
            <div className="logo-container">
              {/* EASY LOGO REPLACEMENT - Just replace the src path */}
              <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
            </div>
            <div className="approval-icon">⏳</div>
            <h4>Pending ETC Admin Approval</h4>
            <p>All forms have been completed and are awaiting approval from ETC Admin</p>
            {isETCAdmin && (
              <div className="approval-actions">
                <button onClick={() => handleApprovalAction(true)} className="approve-btn">
                  ✅ Approve Stage
                </button>
                <button onClick={() => handleApprovalAction(false)} className="reject-btn">
                  ❌ Request Changes
                </button>
              </div>
            )}
            {!isETCAdmin && <p className="waiting-message">⏳ Waiting for ETC Admin approval...</p>}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {stageData.approved && (
        <div className="approval-section">
          <div className="approval-card completed">
            <div className="logo-container">
              {/* EASY LOGO REPLACEMENT - Just replace the src path */}
              <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
            </div>
            <div className="approval-icon">🎉</div>
            <h4>Stage {stage} Completed!</h4>
            <p>All forms have been completed and approved. You can now proceed to the next stage.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormStage
