"use client"

import { useState } from "react"

export default function StageForm({ stage, company, project, siteEngineer, onSubmit, stageStatus, submittedForms }) {
  const [formData, setFormData] = useState({})
  const [currentFormIndex, setCurrentFormIndex] = useState(0)

  const getStageFormTemplates = (stageNumber) => {
    const templates = {
      1: [
        {
          id: "project_info",
          name: "Project Information",
          fields: ["projectName", "location", "startDate", "expectedCompletion"],
        },
        {
          id: "technical_specs",
          name: "Technical Specifications",
          fields: ["voltage", "capacity", "frequency", "phases"],
        },
        {
          id: "safety_checklist",
          name: "Safety Checklist",
          fields: ["safetyOfficer", "equipmentCheck", "emergencyPlan"],
        },
        { id: "material_list", name: "Material Requirements", fields: ["materials", "quantities", "suppliers"] },
        { id: "team_assignment", name: "Team Assignment", fields: ["teamLead", "engineers", "technicians"] },
        { id: "schedule_plan", name: "Schedule Planning", fields: ["milestones", "deadlines", "dependencies"] },
        {
          id: "quality_plan",
          name: "Quality Assurance Plan",
          fields: ["qualityStandards", "testingProcedures", "documentation"],
        },
      ],
      2: [
        {
          id: "circuit_testing",
          name: "Circuit Testing",
          fields: ["circuitType", "testResults", "measurements", "compliance"],
        },
        {
          id: "oil_filtration",
          name: "Oil Filtration Records",
          fields: ["oilType", "filtrationDate", "testResults", "approval"],
        },
      ],
      3: [
        {
          id: "insulation_test",
          name: "Insulation Testing",
          fields: ["insulationType", "testVoltage", "results", "certification"],
        },
        {
          id: "winding_test",
          name: "Winding Resistance Test",
          fields: ["windingType", "resistance", "temperature", "results"],
        },
        {
          id: "pressure_test",
          name: "Pressure Testing",
          fields: ["testPressure", "duration", "leakageCheck", "results"],
        },
        {
          id: "performance_test",
          name: "Performance Testing",
          fields: ["loadTest", "efficiency", "losses", "compliance"],
        },
      ],
      4: [
        {
          id: "final_inspection",
          name: "Final Inspection",
          fields: ["visualInspection", "functionalTest", "documentation", "approval"],
        },
        {
          id: "commissioning",
          name: "Commissioning Report",
          fields: ["commissioningDate", "testResults", "performance", "handover"],
        },
        {
          id: "documentation",
          name: "Documentation Review",
          fields: ["manuals", "certificates", "warranties", "compliance"],
        },
        {
          id: "client_acceptance",
          name: "Client Acceptance",
          fields: ["clientName", "acceptanceDate", "feedback", "signature"],
        },
      ],
      5: [
        {
          id: "quality_certificate",
          name: "Quality Certificate",
          fields: ["certificateNumber", "issueDate", "validUntil", "authority"],
        },
        {
          id: "final_report",
          name: "Final Project Report",
          fields: ["summary", "achievements", "recommendations", "closure"],
        },
      ],
    }
    return templates[stageNumber] || []
  }

  const currentForms = getStageFormTemplates(stage)
  const currentForm = currentForms[currentFormIndex]

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (currentFormIndex < currentForms.length - 1) {
      // Move to next form
      setCurrentFormIndex(currentFormIndex + 1)
      alert(`Form ${currentFormIndex + 1} completed! Moving to next form.`)
    } else {
      // Submit entire stage
      onSubmit(stage, formData)
      setFormData({})
      setCurrentFormIndex(0)
    }
  }

  const renderFormField = (fieldName) => {
    const value = formData[fieldName] || ""

    return (
      <div key={fieldName} className="form-group">
        <label>
          {fieldName.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
          <span className="required">*</span>
        </label>
        {fieldName.includes("Date") ? (
          <input type="date" value={value} onChange={(e) => handleFieldChange(fieldName, e.target.value)} required />
        ) : fieldName.includes("plan") || fieldName.includes("description") || fieldName.includes("summary") ? (
          <textarea
            rows="4"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={`Enter ${fieldName.toLowerCase()}`}
            required
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={`Enter ${fieldName.toLowerCase()}`}
            required
          />
        )}
      </div>
    )
  }

  if (stageStatus === "approved") {
    return (
      <div className="stage-approved">
        <div className="approved-message">
          <div className="approved-icon">✅</div>
          <h3>Stage {stage} Approved!</h3>
          <p>This stage has been approved by ETC Admin. You can now proceed to the next stage.</p>
        </div>
      </div>
    )
  }

  if (stageStatus === "pending-approval") {
    return (
      <div className="stage-pending">
        <div className="pending-message">
          <div className="pending-icon">⏳</div>
          <h3>Stage {stage} Under Review</h3>
          <p>Your forms have been submitted and are currently being reviewed by ETC Admin.</p>

          {submittedForms.length > 0 && (
            <div className="submitted-forms-list">
              <h4>Submitted Forms:</h4>
              {submittedForms.map((form, index) => (
                <div key={index} className="submitted-form-item">
                  <span>📋 Form {index + 1}</span>
                  <span>Submitted: {new Date(form.submittedAt).toLocaleDateString()}</span>
                  <span className="status-pending">⏳ Pending Review</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (stageStatus === "locked") {
    return (
      <div className="stage-locked">
        <div className="locked-message">
          <div className="locked-icon">🔒</div>
          <h3>Stage {stage} Locked</h3>
          <p>Complete and get approval for the previous stage to unlock this stage.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="stage-form-container">
      <div className="form-header">
        <h2>
          Stage {stage} - Form {currentFormIndex + 1} of {currentForms.length}
        </h2>
        <h3>{currentForm?.name}</h3>
        <div className="form-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentFormIndex + 1) / currentForms.length) * 100}%` }}
            ></div>
          </div>
          <span>
            {currentFormIndex + 1}/{currentForms.length} forms completed
          </span>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="stage-form">
        <div className="form-fields">{currentForm?.fields.map((fieldName) => renderFormField(fieldName))}</div>

        <div className="form-actions">
          {currentFormIndex > 0 && (
            <button type="button" onClick={() => setCurrentFormIndex(currentFormIndex - 1)} className="prev-btn">
              ← Previous Form
            </button>
          )}

          <button type="submit" className="submit-btn">
            {currentFormIndex < currentForms.length - 1 ? "Next Form →" : `Submit Stage ${stage}`}
          </button>
        </div>
      </form>
    </div>
  )
}
