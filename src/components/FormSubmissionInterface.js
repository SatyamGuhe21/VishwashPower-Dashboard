"use client"

import { useState } from "react"

export const FormSubmissionInterface = ({ company, stage, onSubmitForms, onBack }) => {
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Define stage-wise form templates
  const getStageFormTemplates = (stage) => {
    const templates = {
      1: [
        {
          id: "technical_specs",
          name: "Technical Specifications Form",
          fields: [
            {
              name: "transformerType",
              label: "Transformer Type",
              type: "select",
              options: ["Auto Transformer", "Traction Transformer", "V Connected 63 MVA"],
              required: true,
            },
            { name: "capacity", label: "Capacity (MVA)", type: "text", required: true },
            { name: "voltage", label: "Voltage Rating", type: "text", required: true },
            { name: "frequency", label: "Frequency (Hz)", type: "number", required: true },
            {
              name: "cooling",
              label: "Cooling Type",
              type: "select",
              options: ["ONAN", "ONAF", "OFAF", "ODAF"],
              required: true,
            },
            {
              name: "tapChanger",
              label: "Tap Changer Type",
              type: "select",
              options: ["On Load", "Off Load", "No Tap Changer"],
              required: true,
            },
            {
              name: "bushingType",
              label: "Bushing Type",
              type: "select",
              options: ["Porcelain", "Composite", "Oil Filled"],
              required: true,
            },
            {
              name: "oilType",
              label: "Oil Type",
              type: "select",
              options: ["Mineral Oil", "Synthetic Oil", "Natural Ester"],
              required: true,
            },
            {
              name: "windingMaterial",
              label: "Winding Material",
              type: "select",
              options: ["Copper", "Aluminum"],
              required: true,
            },
            { name: "coreMaterial", label: "Core Material", type: "text", required: true },
          ],
        },
        {
          id: "quality_assurance",
          name: "Quality Assurance Form",
          fields: [
            {
              name: "testingStandard",
              label: "Testing Standard",
              type: "select",
              options: ["IEC 60076", "IEEE C57", "IS 2026"],
              required: true,
            },
            {
              name: "qualityGrade",
              label: "Quality Grade",
              type: "select",
              options: ["Grade A", "Grade B", "Grade C"],
              required: true,
            },
            {
              name: "inspectionLevel",
              label: "Inspection Level",
              type: "select",
              options: ["Level 1", "Level 2", "Level 3"],
              required: true,
            },
            {
              name: "certificationRequired",
              label: "Certification Required",
              type: "select",
              options: ["Yes", "No"],
              required: true,
            },
            {
              name: "witnessTest",
              label: "Witness Test",
              type: "select",
              options: ["Customer Witness", "Third Party", "Manufacturer Only"],
              required: true,
            },
            { name: "qualityPlan", label: "Quality Plan", type: "textarea", required: true },
            { name: "testingFacility", label: "Testing Facility", type: "text", required: true },
            {
              name: "calibrationCertificate",
              label: "Calibration Certificate",
              type: "select",
              options: ["Available", "Not Available"],
              required: true,
            },
          ],
        },
        {
          id: "installation_requirements",
          name: "Installation Requirements Form",
          fields: [
            {
              name: "installationSite",
              label: "Installation Site",
              type: "select",
              options: ["Indoor", "Outdoor", "Semi-Outdoor"],
              required: true,
            },
            {
              name: "foundationType",
              label: "Foundation Type",
              type: "select",
              options: ["Concrete", "Steel Structure", "Composite"],
              required: true,
            },
            { name: "accessRequirements", label: "Access Requirements", type: "textarea", required: true },
            {
              name: "environmentalConditions",
              label: "Environmental Conditions",
              type: "select",
              options: ["Normal", "Coastal", "Industrial", "Desert"],
              required: true,
            },
            { name: "specialRequirements", label: "Special Requirements", type: "textarea", required: true },
            {
              name: "transportationMethod",
              label: "Transportation Method",
              type: "select",
              options: ["Road", "Rail", "Sea", "Air"],
              required: true,
            },
            { name: "installationTimeline", label: "Installation Timeline", type: "text", required: true },
            { name: "safetyRequirements", label: "Safety Requirements", type: "textarea", required: true },
          ],
        },
      ],
      2: [
        {
          id: "manufacturing_process",
          name: "Manufacturing Process Form",
          fields: [
            {
              name: "manufacturingStandard",
              label: "Manufacturing Standard",
              type: "select",
              options: ["IEC 60076-1", "IEEE C57.12.00", "IS 2026"],
              required: true,
            },
            { name: "productionTimeline", label: "Production Timeline (weeks)", type: "number", required: true },
            {
              name: "qualityControlProcess",
              label: "Quality Control Process",
              type: "select",
              options: ["ISO 9001:2015", "ISO 14001", "OHSAS 18001"],
              required: true,
            },
            { name: "materialSpecification", label: "Material Specification", type: "text", required: true },
            {
              name: "windingMaterial",
              label: "Winding Material",
              type: "select",
              options: ["Copper", "Aluminum"],
              required: true,
            },
            { name: "manufacturingLocation", label: "Manufacturing Location", type: "text", required: true },
            { name: "productionCapacity", label: "Production Capacity", type: "text", required: true },
            { name: "qualityAssurancePlan", label: "Quality Assurance Plan", type: "textarea", required: true },
          ],
        },
        {
          id: "testing_protocol",
          name: "Testing Protocol Form",
          fields: [
            { name: "routineTests", label: "Routine Tests", type: "textarea", required: true },
            { name: "typeTests", label: "Type Tests", type: "textarea", required: true },
            { name: "specialTests", label: "Special Tests", type: "textarea", required: true },
            {
              name: "testingFacility",
              label: "Testing Facility",
              type: "select",
              options: ["NABL Accredited", "ILAC Accredited", "In-house"],
              required: true,
            },
            {
              name: "witnessRequirement",
              label: "Witness Requirement",
              type: "select",
              options: ["Customer", "Third Party", "None"],
              required: true,
            },
            { name: "testingSchedule", label: "Testing Schedule", type: "text", required: true },
            {
              name: "testReportFormat",
              label: "Test Report Format",
              type: "select",
              options: ["Standard", "Custom", "International"],
              required: true,
            },
            { name: "calibrationDetails", label: "Calibration Details", type: "textarea", required: true },
          ],
        },
      ],
      3: [
        {
          id: "final_inspection",
          name: "Final Inspection Form",
          fields: [
            {
              name: "finalInspection",
              label: "Final Inspection Status",
              type: "select",
              options: ["Completed", "In Progress", "Pending"],
              required: true,
            },
            { name: "deliverySchedule", label: "Delivery Schedule", type: "date", required: true },
            {
              name: "warrantyPeriod",
              label: "Warranty Period",
              type: "select",
              options: ["1 Year", "2 Years", "3 Years", "5 Years"],
              required: true,
            },
            { name: "packingDetails", label: "Packing Details", type: "textarea", required: true },
            { name: "shippingInstructions", label: "Shipping Instructions", type: "textarea", required: true },
            {
              name: "installationSupport",
              label: "Installation Support",
              type: "select",
              options: ["Included", "Additional Cost", "Not Required"],
              required: true,
            },
            {
              name: "commissioningSupport",
              label: "Commissioning Support",
              type: "select",
              options: ["Included", "Additional Cost", "Not Required"],
              required: true,
            },
            { name: "sparePartsAvailability", label: "Spare Parts Availability", type: "textarea", required: true },
          ],
        },
        {
          id: "documentation",
          name: "Documentation Form",
          fields: [
            { name: "technicalDocuments", label: "Technical Documents", type: "textarea", required: true },
            {
              name: "operationManual",
              label: "Operation Manual",
              type: "select",
              options: ["Provided", "Not Provided"],
              required: true,
            },
            {
              name: "maintenanceManual",
              label: "Maintenance Manual",
              type: "select",
              options: ["Provided", "Not Provided"],
              required: true,
            },
            { name: "testCertificates", label: "Test Certificates", type: "textarea", required: true },
            { name: "complianceCertificates", label: "Compliance Certificates", type: "textarea", required: true },
            {
              name: "warrantyDocuments",
              label: "Warranty Documents",
              type: "select",
              options: ["Complete", "Incomplete"],
              required: true,
            },
          ],
        },
      ],
    }
    return templates[stage] || []
  }

  const currentStageTemplates = getStageFormTemplates(stage)

  const handleFieldChange = (formId, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [fieldName]: value,
      },
    }))
  }

  const isFormComplete = (formId) => {
    const form = currentStageTemplates.find((f) => f.id === formId)
    if (!form) return false

    const requiredFields = form.fields.filter((field) => field.required)
    const formValues = formData[formId] || {}

    return requiredFields.every((field) => formValues[field.name] && formValues[field.name].toString().trim() !== "")
  }

  const isAllFormsComplete = () => {
    return currentStageTemplates.every((template) => isFormComplete(template.id))
  }

  const handleSubmitStage = async () => {
    if (!isAllFormsComplete()) {
      alert("Please complete all forms before submitting the stage.")
      return
    }

    setIsSubmitting(true)

    // Prepare forms for submission
    const formsToSubmit = currentStageTemplates.map((template) => ({
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id,
      stage: stage,
      formName: template.name,
      formId: template.id,
      submittedAt: new Date().toISOString().split("T")[0],
      submittedTime: new Date().toLocaleTimeString(),
      status: "pending-review",
      data: formData[template.id] || {},
      submittedBy: "Site Engineer",
      engineerName: "John Smith", // This would come from user context
      engineerId: "ENG001",
    }))

    try {
      await onSubmitForms(formsToSubmit)
      alert(`Stage ${stage} submitted successfully! All forms are now under ETC Admin review.`)
      onBack()
    } catch (error) {
      alert("Error submitting stage. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field, formId) => {
    const value = formData[formId]?.[field.name] || ""

    switch (field.type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(formId, field.name, e.target.value)}
            required={field.required}
            className="form-select"
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(formId, field.name, e.target.value)}
            required={field.required}
            rows="4"
            className="form-textarea"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(formId, field.name, e.target.value)}
            required={field.required}
            className="form-input"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(formId, field.name, e.target.value)}
            required={field.required}
            className="form-input"
          />
        )

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(formId, field.name, e.target.value)}
            required={field.required}
            className="form-input"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
    }
  }

  if (currentStageTemplates.length === 0) {
    return (
      <div className="form-submission-container">
        <div className="no-forms-message">
          <h3>No forms available for Stage {stage}</h3>
          <button onClick={onBack} className="back-btn">
            ← Back to Companies
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-submission-container">
      <div className="form-submission-header">
        <div className="header-info">
          <h2>Stage {stage} - All Forms</h2>
          <p>
            {company.name} - Complete all {currentStageTemplates.length} forms to submit Stage {stage}
          </p>
        </div>
        <button onClick={onBack} className="back-btn">
          ← Back to Companies
        </button>
      </div>

      <div className="stage-progress">
        <div className="progress-info">
          <span>
            {currentStageTemplates.filter((template) => isFormComplete(template.id)).length} of{" "}
            {currentStageTemplates.length} forms completed
          </span>
          <span className="stage-indicator">Stage {stage}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(currentStageTemplates.filter((template) => isFormComplete(template.id)).length / currentStageTemplates.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="all-forms-container">
        {currentStageTemplates.map((template, index) => (
          <div key={template.id} className="form-card">
            <div className="form-card-header">
              <div className="form-info">
                <h3>
                  {index + 1}. {template.name}
                </h3>
                <div className="form-status">
                  {isFormComplete(template.id) ? (
                    <span className="status-complete">✓ Complete</span>
                  ) : (
                    <span className="status-incomplete">⚠ Incomplete</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-fields">
              {template.fields.map((field) => (
                <div key={field.name} className="field-group">
                  <label className="field-label">
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  {renderField(field, template.id)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="stage-submission">
        <div className="submission-summary">
          <h3>Stage {stage} Submission Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Forms:</span>
              <span className="stat-value">{currentStageTemplates.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed:</span>
              <span className="stat-value">
                {currentStageTemplates.filter((template) => isFormComplete(template.id)).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Remaining:</span>
              <span className="stat-value">
                {currentStageTemplates.length -
                  currentStageTemplates.filter((template) => isFormComplete(template.id)).length}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmitStage}
          disabled={isSubmitting || !isAllFormsComplete()}
          className="submit-stage-btn"
        >
          {isSubmitting ? "Submitting Stage..." : `Submit Complete Stage ${stage} for ETC Review`}
        </button>
      </div>
    </div>
  )
}
