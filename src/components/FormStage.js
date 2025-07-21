"use client"

import { useState, useEffect, useRef } from "react"

const FormStage = ({ stage, stageData, onStageComplete, onApproval, isETCAdmin, company }) => {
  const [currentForm, setCurrentForm] = useState(1)
  const [formData, setFormData] = useState({})
  const [signatures, setSignatures] = useState({})

  useEffect(() => {
    // Only allow progression through forms if not all completed yet
    if (stageData.completed < stageData.total) {
      setCurrentForm(stageData.completed + 1)
    }
  }, [stageData.completed, stageData.total])

  const getFormsForStage = (stageNumber) => {
    switch (stageNumber) {
      case 1:
        return [
          "Core Insulation Check",
          "Record of Oil Testing Prior to Filling",
          "IR Value During Circulation",
          "Protection Wiring and Cable Termination",
          "Record of Measurement of IR Values",
          "Cabling/Wiring Checklist",
          "Record of Oil Handling",
        ]
      case 2:
        return ["Short Circuit Test", "Record for Oil Filtration"]
      case 3:
        return [
          "Tan Delta and Capacitance Test on Bushing",
          "Tan Delta and Capacitance Test on Winding",
          "Winding Resistance Test",
          "Pressure Test Report",
        ]
      case 4:
        return [
          "Pre-Charging Check List",
          "Final Testing Report",
          "Work Completion Report",
          "Final Documentation Review",
        ]
      case 5:
        return ["Quality Assurance Certificate", "Final Assembly Check"]
      default:
        return []
    }
  }

  const forms = getFormsForStage(stage)
  const isFormCompleted = (formIndex) => formIndex <= stageData.completed
  const isCurrentFormActive =
    currentForm <= stageData.total && stageData.completed < stageData.total && !stageData.approved
  const allFormsCompleted = stageData.completed === stageData.total
  const isPendingApproval = allFormsCompleted && !stageData.approved && stageData.status === "pending-approval"
  const isLastFormInStage = currentForm === stageData.total

  const handleFormSubmit = () => {
    // Validate signatures before submission
    const vpesSignatureKey = `form${currentForm}_vpes`
    const customerSignatureKey = `form${currentForm}_customer`

    if (!signatures[vpesSignatureKey]) {
      alert("❌ VPES Signature is required to submit this form.")
      return
    }

    if (isLastFormInStage && !signatures[customerSignatureKey]) {
      alert("❌ Customer Signature is required on the last form of the stage.")
      return
    }

    try {
      const newCompletedCount = stageData.completed + 1

      // Update company progress in localStorage immediately
      const savedCompanies = localStorage.getItem("companies")
      if (savedCompanies) {
        const companies = JSON.parse(savedCompanies)
        const updatedCompanies = companies.map((c) => {
          if (c.id === company.id) {
            return {
              ...c,
              formsCompleted: newCompletedCount,
              lastActivity: new Date().toISOString().split("T")[0],
              status: newCompletedCount === stageData.total ? "pending-approval" : "in-progress",
            }
          }
          return c
        })
        localStorage.setItem("companies", JSON.stringify(updatedCompanies))
      }

      // Check if this is the last form in the stage
      if (newCompletedCount === stageData.total) {
        onStageComplete()
        alert(`🎉 All ${stageData.total} forms in Stage ${stage} completed! Sent for ETC Admin approval.`)
      } else {
        setCurrentForm(currentForm + 1)
        alert(
          `✅ Form ${currentForm} completed successfully! (${newCompletedCount}/${stageData.total} forms completed)`,
        )
      }
    } catch (err) {
      console.error("Form submission error:", err)
      alert("❌ Error submitting form. Please try again.")
    }
  }

  const handleApprovalAction = (approved) => {
    try {
      onApproval(approved)
    } catch (err) {
      console.error("Approval action error:", err)
      alert("❌ Error processing approval. Please try again.")
    }
  }

  const getFormStatus = (formIndex) => {
    if (isFormCompleted(formIndex)) {
      return "completed"
    } else if (formIndex === currentForm && isCurrentFormActive) {
      return "current"
    } else {
      return "pending"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✓"
      case "current":
        return "📋"
      default:
        return "⏳"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "current":
        return "Current"
      default:
        return "Pending"
    }
  }

  // Digital Signature Component
  const DigitalSignature = ({ signatureType, label, required }) => {
    const canvasRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [hasSignature, setHasSignature] = useState(false)
    const signatureKey = `form${currentForm}_${signatureType}`

    // Initialize canvas and restore signature if exists
    useEffect(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        // Clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Restore existing signature if available
        if (signatures[signatureKey]) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
            setHasSignature(true)
          }
          img.src = signatures[signatureKey].dataUrl
        } else {
          setHasSignature(false)
        }
      }
    }, [signatureKey, signatures])

    const getCoordinates = (e) => {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      let clientX, clientY

      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      }
    }

    const startDrawing = (e) => {
      e.preventDefault()
      setIsDrawing(true)
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const coords = getCoordinates(e)

      ctx.beginPath()
      ctx.moveTo(coords.x, coords.y)
    }

    const draw = (e) => {
      if (!isDrawing) return
      e.preventDefault()

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const coords = getCoordinates(e)

      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()

      if (!hasSignature) {
        setHasSignature(true)
      }
    }

    const stopDrawing = (e) => {
      if (!isDrawing) return
      e.preventDefault()

      setIsDrawing(false)
      const canvas = canvasRef.current
      const signatureData = canvas.toDataURL()

      // Save signature data
      setSignatures((prev) => ({
        ...prev,
        [signatureKey]: {
          dataUrl: signatureData,
          timestamp: new Date().toISOString(),
          type: "digital",
        },
      }))
    }

    const clearSignature = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasSignature(false)

      // Remove signature from state
      setSignatures((prev) => {
        const updated = { ...prev }
        delete updated[signatureKey]
        return updated
      })
    }

    return (
      <div className="digital-signature-container">
        <label className="signature-label">
          {label}
          {required && <span style={{ color: "red", marginLeft: "5px" }}>*</span>}
        </label>
        <div className="signature-pad-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="signature-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              border: "2px solid #ccc",
              borderRadius: "4px",
              cursor: "crosshair",
              backgroundColor: "#fff",
              touchAction: "none", // Prevent scrolling on touch devices
            }}
          />
          <div className="signature-controls">
            <button
              type="button"
              onClick={clearSignature}
              className="clear-signature-btn"
              style={{
                padding: "8px 16px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Clear Signature
            </button>
            {hasSignature && (
              <span className="signature-status" style={{ marginLeft: "10px", color: "#4CAF50" }}>
                ✓ Signature captured
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Digital Signature Section Component
  const SignatureSection = () => {
    const isCustomerSignatureRequired = isLastFormInStage

    return (
      <div
        className="signature-section"
        style={{ marginTop: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}
      >
        <h4 style={{ marginBottom: "20px", textAlign: "center" }}>Digital Signatures</h4>
        <div
          className="signature-row"
          style={{ display: "flex", gap: "40px", justifyContent: "space-around", flexWrap: "wrap" }}
        >
          <DigitalSignature signatureType="vpes" label="VPES Signature:" required={true} />
          {isLastFormInStage && (
            <DigitalSignature
              signatureType="customer"
              label="Customer Signature:"
              required={isCustomerSignatureRequired}
            />
          )}
        </div>
        <div className="signature-date" style={{ marginTop: "20px", textAlign: "center" }}>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>Date:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_signature_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_signature_date`]: e.target.value })}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
      </div>
    )
  }

  // Individual Form Components

  // Form 1: Core Insulation Check
  const CoreInsulationCheckForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>CORE INSULATION CHECK: At 1 KV {">"} 500 MΩ</h3>
      </div>
      <div className="form-table">
        <table className="technical-table">
          <thead>
            <tr>
              <th>Test Parameter</th>
              <th>Obtained Value (MΩ)</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="field-label">Between Core – frame</td>
              <td>
                <input
                  type="text"
                  placeholder="Enter value (MΩ)"
                  value={formData[`form${currentForm}_core_frame`] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_core_frame`]: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Remarks"
                  value={formData[`form${currentForm}_core_frame_remarks`] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_core_frame_remarks`]: e.target.value,
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="field-label">Between Frame – tank</td>
              <td>
                <input
                  type="text"
                  placeholder="Enter value (MΩ)"
                  value={formData[`form${currentForm}_frame_tank`] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_frame_tank`]: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Remarks"
                  value={formData[`form${currentForm}_frame_tank_remarks`] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_frame_tank_remarks`]: e.target.value,
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="field-label">Between core – tank</td>
              <td>
                <input
                  type="text"
                  placeholder="Enter value (MΩ)"
                  value={formData[`form${currentForm}_core_tank`] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_core_tank`]: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Remarks"
                  value={formData[`form${currentForm}_core_tank_remarks`] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_core_tank_remarks`]: e.target.value,
                    })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <SignatureSection />
    </div>
  )

  // Form 2: Record of Oil Testing Prior to Filling
  const OilTestingForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>Record of Oil testing prior to filling in Main Tank</h3>
        <p>
          VALUES OF OIL CHECKED AT SITE AND THIRD PARTY LABORATORY VALUES OBSERVED TO BE WITHIN LIMITS AND CLEARANCE IS
          GIVEN TO FILL OIL IN TRANSFORMER
        </p>
        <p>*CHECKED BDV OF MAIN TANK BEFORE OIL FILLING.</p>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>BDV MAIN TANK:</label>
          <input
            type="text"
            placeholder="Enter KV value"
            value={formData[`form${currentForm}_bdv_main_tank`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_bdv_main_tank`]: e.target.value })}
          />
        </div>
      </div>
      <div className="form-section-title">
        <h4>RECORD FOR OIL FILTRATION</h4>
        <h5>Oil filtration of Main Tank</h5>
      </div>
      <div className="form-table">
        <table className="technical-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Vacuum Level</th>
              <th>M/C Outlet Temp.</th>
              <th>OTI Temp.</th>
              <th>WTI Temp.</th>
              <th>Sign.</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
              <tr key={row}>
                <td>
                  <input
                    type="date"
                    value={formData[`form${currentForm}_date_${row}`] || ""}
                    onChange={(e) => setFormData({ ...formData, [`form${currentForm}_date_${row}`]: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={formData[`form${currentForm}_time_${row}`] || ""}
                    onChange={(e) => setFormData({ ...formData, [`form${currentForm}_time_${row}`]: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="mm/Hg"
                    value={formData[`form${currentForm}_vacuum_${row}`] || ""}
                    onChange={(e) => setFormData({ ...formData, [`form${currentForm}_vacuum_${row}`]: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="°C"
                    value={formData[`form${currentForm}_mc_temp_${row}`] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [`form${currentForm}_mc_temp_${row}`]: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="°C"
                    value={formData[`form${currentForm}_oti_temp_${row}`] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [`form${currentForm}_oti_temp_${row}`]: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="°C"
                    value={formData[`form${currentForm}_wti_temp_${row}`] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [`form${currentForm}_wti_temp_${row}`]: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Sign"
                    value={formData[`form${currentForm}_sign_${row}`] || ""}
                    onChange={(e) => setFormData({ ...formData, [`form${currentForm}_sign_${row}`]: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Remark"
                    value={formData[`form${currentForm}_remark_${row}`] || ""}
                    onChange={(e) => setFormData({ ...formData, [`form${currentForm}_remark_${row}`]: e.target.value })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SignatureSection />
    </div>
  )

  // Form 3: IR Value During Circulation
  const IRValueCirculationForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>IR Value during circulation</h3>
      </div>

      {/* First IR Value Section */}
      <div className="ir-section">
        <div className="ir-header">
          <p>IR Value during circulation, Temp OTI ....°C WTI.........°C, AMB.....°C RANGE ONLY 1 KV</p>
        </div>
        <table className="technical-table">
          <thead>
            <tr>
              <th>Test Point</th>
              <th>15 Sec MΩ</th>
              <th>60 Sec MΩ</th>
              <th>Ratio of IR 60/IR 15</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="field-label">HV-Earth</td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_15_1`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`form${currentForm}_hv_earth_15_1`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_60_1`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`form${currentForm}_hv_earth_60_1`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_ratio_1`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_hv_earth_ratio_1`]: e.target.value })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <SignatureSection />
      </div>

      {/* Second IR Value Section */}
      <div className="ir-section">
        <div className="ir-header">
          <p>IR Value during circulation, Temp OTI ........°C WTI............°C, AMB........°C RANGE ONLY 1 KV</p>
        </div>
        <table className="technical-table">
          <thead>
            <tr>
              <th>Test Point</th>
              <th>15 Sec MΩ</th>
              <th>60 Sec MΩ</th>
              <th>Ratio of IR 60/IR 15</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="field-label">HV-Earth</td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_15_2`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`form${currentForm}_hv_earth_15_2`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_60_2`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`form${currentForm}_hv_earth_60_2`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_ratio_2`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_hv_earth_ratio_2`]: e.target.value })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <SignatureSection />
      </div>

      {/* Third IR Value Section */}
      <div className="ir-section">
        <div className="ir-header">
          <p>IR Value after filteration, Temp OTI ....°C WTI..........°C, AMB....°C RANGE ONLY 1 KV</p>
        </div>
        <table className="technical-table">
          <thead>
            <tr>
              <th>Test Point</th>
              <th>15 Sec</th>
              <th>60 Sec</th>
              <th>Ratio of IR 60/IR 15 600 Sec</th>
              <th>PI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="field-label">HV-Earth</td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_15_3`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`form${currentForm}_hv_earth_15_3`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_60_3`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`form${currentForm}_hv_earth_60_3`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_600_3`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`form${currentForm}_hv_earth_600_3`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_hv_earth_pi_3`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`form${currentForm}_hv_earth_pi_3`]: e.target.value })}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <SignatureSection />
      </div>
    </div>
  )

  // Form 4: Protection Wiring and Cable Termination
  const ProtectionWiringForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h3>
        <h4>Protection wiring and Cable Termination</h4>
        <p>CHECK: - All Cabling/Wiring done as per Required Ferrule no, Proper size Lugs and cable dressing.</p>
      </div>
      <div className="form-table">
        <table className="technical-table">
          <thead>
            <tr>
              <th>Sr no</th>
              <th>Descriptions</th>
              <th>Check</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {["CT 1.1", "CT 2", "CT 2.1", "Bucholz Relay", "Main Tank PRV", "MOG", "", "", "", ""].map(
              (description, index) => (
                <tr key={index + 1}>
                  <td>{index + 1}</td>
                  <td>
                    {description ? (
                      description
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter description"
                        value={formData[`form${currentForm}_description_${index + 1}`] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [`form${currentForm}_description_${index + 1}`]: e.target.value,
                          })
                        }
                      />
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="✓ or ✗"
                      value={formData[`form${currentForm}_check_${index + 1}`] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`form${currentForm}_check_${index + 1}`]: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Remark"
                      value={formData[`form${currentForm}_remark_protection_${index + 1}`] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`form${currentForm}_remark_protection_${index + 1}`]: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <SignatureSection />
    </div>
  )

  // Form 5: Record of Measurement of IR Values
  const IRMeasurementForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>RECORD OF MEASUREMENT OF IR VALUES</h3>
      </div>

      {/* Test Details */}
      <div className="form-row">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_ir_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={formData[`form${currentForm}_ir_time`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_time`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Details of Insulation tester</label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Amb. Temp:</label>
          <input
            type="text"
            placeholder="°C"
            value={formData[`form${currentForm}_ir_amb_temp`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_amb_temp`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Make:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_ir_make`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_make`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>OTI. Temp.</label>
          <input
            type="text"
            placeholder="°C"
            value={formData[`form${currentForm}_ir_oti_temp`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_oti_temp`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Sr. No.:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_ir_sr_no`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_sr_no`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>WTI Temp.</label>
          <input
            type="text"
            placeholder="°C"
            value={formData[`form${currentForm}_ir_wti_temp`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_wti_temp`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Range:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_ir_range`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_range`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Relative Humidity:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_ir_humidity`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_humidity`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Voltage Level:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_ir_voltage_level`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_voltage_level`]: e.target.value })}
          />
        </div>
      </div>

      {/* IR Measurement Table */}
      <table className="technical-table">
        <thead>
          <tr>
            <th>Test Point</th>
            <th>10 Sec MΩ</th>
            <th>60 Sec MΩ</th>
            <th>Ratio of IR 60/10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="field-label">HV-Earth</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_ir_hv_earth_10`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_hv_earth_10`]: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_ir_hv_earth_60`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_hv_earth_60`]: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_ir_hv_earth_ratio`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_ir_hv_earth_ratio`]: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 6: Cabling/Wiring Checklist
  const CablingChecklistForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>CHECK: - All Cabling/Wiring done as per Required Ferrule no, Proper size Lugs and cable dressing.</h3>
      </div>
      <div className="form-table">
        <table className="technical-table">
          <thead>
            <tr>
              <th>Sr no</th>
              <th>Descriptions</th>
              <th>Check</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {["CT 1.1", "CT 2", "CT 2.1", "Bucholz Relay", "Main Tank PRV", "MOG", "", "", "", ""].map(
              (description, index) => (
                <tr key={index + 1}>
                  <td>{index + 1}</td>
                  <td>
                    {description ? (
                      description
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter description"
                        value={formData[`form${currentForm}_cabling_description_${index + 1}`] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [`form${currentForm}_cabling_description_${index + 1}`]: e.target.value,
                          })
                        }
                      />
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="✓ or ✗"
                      value={formData[`form${currentForm}_cabling_check_${index + 1}`] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`form${currentForm}_cabling_check_${index + 1}`]: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Remark"
                      value={formData[`form${currentForm}_cabling_remark_${index + 1}`] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`form${currentForm}_cabling_remark_${index + 1}`]: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <SignatureSection />
    </div>
  )

  // Form 7: Record of Oil Handling
  const OilHandlingForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>RECORD OF OIL HANDLING</h3>
        <h4>TEST VALUES PRIOR TO FILTERATION</h4>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>1) BDV:</label>
          <input
            type="text"
            placeholder="KV"
            value={formData[`form${currentForm}_oil_bdv_prior`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_oil_bdv_prior`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>2) Moisture Content:</label>
          <input
            type="text"
            placeholder="PPM"
            value={formData[`form${currentForm}_oil_moisture_prior`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_oil_moisture_prior`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-section-title">
        <h4>Oil Filling in the Reservoirs Tank:</h4>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>Tank</th>
            <th>No of barrels</th>
            <th>Started on Date & time</th>
            <th>Completed on Date & time</th>
            <th>BDV</th>
            <th>MOISTURE CONTENT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="field-label">Tank1</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_oil_barrels_tank1`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_oil_barrels_tank1`]: e.target.value })}
              />
            </td>
            <td>
              <input
                type="datetime-local"
                value={formData[`form${currentForm}_oil_start_tank1`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_oil_start_tank1`]: e.target.value })}
              />
            </td>
            <td>
              <input
                type="datetime-local"
                value={formData[`form${currentForm}_oil_complete_tank1`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_oil_complete_tank1`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="KV"
                value={formData[`form${currentForm}_oil_bdv_tank1`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_oil_bdv_tank1`]: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="PPM"
                value={formData[`form${currentForm}_oil_moisture_tank1`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_oil_moisture_tank1`]: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 8: Short Circuit Test
  const ShortCircuitTestForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>TYPE OF TEST – SHORT CIRCUIT TEST</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>APPLIED VOLTAGE:</label>
          <input
            type="text"
            placeholder="VOLTS"
            value={formData[`form${currentForm}_short_applied_voltage`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_short_applied_voltage`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>DATE:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_short_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_short_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>TIME:</label>
          <input
            type="time"
            value={formData[`form${currentForm}_short_time`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_short_time`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>METER MAKE SR. NO.</label>
          <input
            type="text"
            value={formData[`form${currentForm}_short_meter_make`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_short_meter_make`]: e.target.value })}
          />
        </div>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>APPLIED VOLTAGE</th>
            <th>Measured Current</th>
            <th>Measured Current</th>
          </tr>
          <tr>
            <th>1.1 – 2</th>
            <th>1.1</th>
            <th>2 – 2.1 SHORTED</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                placeholder="V"
                value={formData[`form${currentForm}_short_voltage_1`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_short_voltage_1`]: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="A"
                value={formData[`form${currentForm}_short_current_1_1`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_short_current_1_1`]: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="A"
                value={formData[`form${currentForm}_short_current_1_2`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_short_current_1_2`]: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 9: Record for Oil Filtration (Complex Form)
  const OilFiltrationComplexForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h3>
        <h4>RECORD FOR OIL FILTRATION</h4>
      </div>

      {/* Oil filtration of Radiator */}
      <div className="form-section-title">
        <h4>Oil filtration of Radiator</h4>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level</th>
            <th>M/C Outlet Temp.</th>
            <th>OTI Temp.</th>
            <th>WTI Temp.</th>
            <th>Sign.</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((row) => (
            <tr key={row}>
              <td>
                <input
                  type="date"
                  value={formData[`form${currentForm}_radiator_date_${row}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_radiator_date_${row}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="time"
                  value={formData[`form${currentForm}_radiator_time_${row}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_radiator_time_${row}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="mm/Hg"
                  value={formData[`form${currentForm}_radiator_vacuum_${row}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_radiator_vacuum_${row}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="°C"
                  value={formData[`form${currentForm}_radiator_mc_temp_${row}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_radiator_mc_temp_${row}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="°C"
                  value={formData[`form${currentForm}_radiator_oti_temp_${row}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_radiator_oti_temp_${row}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="°C"
                  value={formData[`form${currentForm}_radiator_wti_temp_${row}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_radiator_wti_temp_${row}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Sign"
                  value={formData[`form${currentForm}_radiator_sign_${row}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_radiator_sign_${row}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Remark"
                  value={formData[`form${currentForm}_radiator_remark_${row}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_radiator_remark_${row}`]: e.target.value })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 10: Tan Delta and Capacitance Test on Bushing
  const TanDeltaBushingForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>Tan delta and capacitance test on bushing</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>METER USED</label>
          <input
            type="text"
            placeholder="Tan delta kit"
            value={formData[`form${currentForm}_bushing_meter_used`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_bushing_meter_used`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>DATE:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_bushing_test_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_bushing_test_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>TIME:</label>
          <input
            type="time"
            value={formData[`form${currentForm}_bushing_test_time`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_bushing_test_time`]: e.target.value })}
          />
        </div>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th rowSpan="2">AT 05 KV PHASE</th>
            <th>TAN DELTA</th>
            <th>CAPACITANCE</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="field-label">1.1 - 05 KV</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_bushing_tan_delta_1_1`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_bushing_tan_delta_1_1`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="pF"
                value={formData[`form${currentForm}_bushing_capacitance_1_1`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_bushing_capacitance_1_1`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="mA"
                value={formData[`form${currentForm}_bushing_excitation_1_1`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_bushing_excitation_1_1`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="W"
                value={formData[`form${currentForm}_bushing_dielectric_1_1`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_bushing_dielectric_1_1`]: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 11: Tan Delta and Capacitance Test on Winding
  const TanDeltaWindingForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>Tan delta and capacitance test on winding</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>METER USED</label>
          <input
            type="text"
            placeholder="Tan delta kit"
            value={formData[`form${currentForm}_winding_meter_used`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_winding_meter_used`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>DATE:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_winding_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_winding_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>TIME:</label>
          <input
            type="time"
            value={formData[`form${currentForm}_winding_time`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_winding_time`]: e.target.value })}
          />
        </div>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>AT 05 KV IN BETWEEN</th>
            <th>TAN DELTA</th>
            <th>CAPACITANCE</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="field-label">HV – G</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_winding_hv_g_tan_delta_05`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_winding_hv_g_tan_delta_05`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="pF"
                value={formData[`form${currentForm}_winding_hv_g_capacitance_05`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_winding_hv_g_capacitance_05`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="mA"
                value={formData[`form${currentForm}_winding_hv_g_excitation_05`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_winding_hv_g_excitation_05`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="W"
                value={formData[`form${currentForm}_winding_hv_g_dielectric_05`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_winding_hv_g_dielectric_05`]: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 12: Winding Resistance Test
  const WindingResistanceTestForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>WINDING RESISTANCE TEST</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>DATE:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_resistance_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_resistance_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>TIME:</label>
          <input
            type="time"
            value={formData[`form${currentForm}_resistance_time`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_resistance_time`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>AMBIENT TEMP:</label>
          <input
            type="text"
            placeholder="°C"
            value={formData[`form${currentForm}_resistance_ambient_temp`] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [`form${currentForm}_resistance_ambient_temp`]: e.target.value })
            }
          />
        </div>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>WINDING</th>
            <th>RESISTANCE (Ω)</th>
            <th>CORRECTED TO 75°C (Ω)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="field-label">HV (1.1 - 2)</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_resistance_hv_1_2`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_resistance_hv_1_2`]: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_resistance_hv_1_2_corrected`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_resistance_hv_1_2_corrected`]: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td className="field-label">LV (2 - 2.1)</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_resistance_lv_2_2_1`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_resistance_lv_2_2_1`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_resistance_lv_2_2_1_corrected`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_resistance_lv_2_2_1_corrected`]: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 13: Pressure Test Report
  const PressureTestReportForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>PRESSURE TEST REPORT</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>DATE:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_pressure_test_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_pressure_test_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>TIME:</label>
          <input
            type="time"
            value={formData[`form${currentForm}_pressure_test_time`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_pressure_test_time`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>AMBIENT TEMP:</label>
          <input
            type="text"
            placeholder="°C"
            value={formData[`form${currentForm}_pressure_test_ambient_temp`] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [`form${currentForm}_pressure_test_ambient_temp`]: e.target.value })
            }
          />
        </div>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>TEST COMPONENT</th>
            <th>APPLIED PRESSURE (kg/cm²)</th>
            <th>DURATION (minutes)</th>
            <th>RESULT</th>
            <th>REMARKS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="field-label">Main Tank</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_pressure_main_tank_pressure`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_pressure_main_tank_pressure`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_pressure_main_tank_duration`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_pressure_main_tank_duration`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Pass/Fail"
                value={formData[`form${currentForm}_pressure_main_tank_result`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_pressure_main_tank_result`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_pressure_main_tank_remarks`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_pressure_main_tank_remarks`]: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 14: Pre-Charging Check List
  const PreChargingCheckListForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>VISHVAS POWER ENGINEERING SERVICES PVT. LTD.</h3>
        <h4>PRE-CHARGING CHECK LIST</h4>
      </div>

      {/* Valve Status Section */}
      <div className="form-section-title">
        <h4>I. Valve Status</h4>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Particulars</th>
            <th>Qty.</th>
            <th>Status</th>
            <th>Review by VPES</th>
            <th>Review by Customer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A</td>
            <td className="field-label">Bucholz to Conservator</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_bucholz_conservator_qty`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_bucholz_conservator_qty`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Open/Close"
                value={formData[`form${currentForm}_bucholz_conservator_status`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_bucholz_conservator_status`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="OK"
                value={formData[`form${currentForm}_bucholz_conservator_vpes`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_bucholz_conservator_vpes`]: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_bucholz_conservator_customer`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`form${currentForm}_bucholz_conservator_customer`]: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 15: Final Testing Report
  const FinalTestingReportForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>FINAL TESTING REPORT</h3>
      </div>

      {/* Oil Values Section */}
      <table className="technical-table">
        <thead>
          <tr>
            <th>V</th>
            <th>Oil Values</th>
            <th>Value</th>
            <th>Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td className="field-label">BDV</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_final_bdv`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_final_bdv`]: e.target.value })}
              />
            </td>
            <td>KV</td>
            <td></td>
          </tr>
          <tr>
            <td>2</td>
            <td className="field-label">Moisture Content</td>
            <td>
              <input
                type="text"
                value={formData[`form${currentForm}_final_moisture`] || ""}
                onChange={(e) => setFormData({ ...formData, [`form${currentForm}_final_moisture`]: e.target.value })}
              />
            </td>
            <td>PPM</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 16: Work Completion Report
  const WorkCompletionReportForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>WORK COMPLETION REPORT</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Project Name:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_project_name`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_project_name`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Completion Date:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_completion_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_completion_date`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-section-title">
        <h4>Work Summary</h4>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Work Description</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {[
            "Core Insulation Check",
            "Oil Testing and Filtration",
            "IR Value Measurements",
            "Protection Wiring",
            "Pressure Testing",
            "Final Testing",
            "Documentation",
          ].map((work, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td className="field-label">{work}</td>
              <td>
                <input
                  type="text"
                  placeholder="Completed/Pending"
                  value={formData[`form${currentForm}_work_status_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_work_status_${index + 1}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_work_remarks_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_work_remarks_${index + 1}`]: e.target.value })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 17: Final Documentation Review
  const FinalDocumentationReviewForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>FINAL DOCUMENTATION REVIEW</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Review Date:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_review_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_review_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Reviewer Name:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_reviewer_name`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_reviewer_name`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-section-title">
        <h4>Document Checklist</h4>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Document Name</th>
            <th>Available</th>
            <th>Reviewed</th>
            <th>Approved</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {[
            "Core Insulation Check Report",
            "Oil Testing Records",
            "IR Value Measurement Reports",
            "Protection Wiring Documentation",
            "Pressure Test Reports",
            "Final Testing Reports",
            "Work Completion Certificate",
            "Customer Sign-off Documents",
            "Quality Assurance Records",
            "Safety Compliance Documents",
          ].map((document, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td className="field-label">{document}</td>
              <td>
                <input
                  type="checkbox"
                  checked={formData[`form${currentForm}_doc_available_${index + 1}`] || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_doc_available_${index + 1}`]: e.target.checked,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={formData[`form${currentForm}_doc_reviewed_${index + 1}`] || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_doc_reviewed_${index + 1}`]: e.target.checked,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={formData[`form${currentForm}_doc_approved_${index + 1}`] || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_doc_approved_${index + 1}`]: e.target.checked,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_doc_remarks_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_doc_remarks_${index + 1}`]: e.target.value })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SignatureSection />
    </div>
  )

  // Form 18: Quality Assurance Certificate
  const QualityAssuranceCertificateForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>QUALITY ASSURANCE CERTIFICATE</h3>
        <h4>VISHVAS POWER ENGINEERING SERVICES PVT. LTD.</h4>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Certificate No:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_certificate_no`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_certificate_no`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Issue Date:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_issue_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_issue_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Valid Until:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_valid_until`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_valid_until`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-section-title">
        <h4>Quality Standards Compliance</h4>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Quality Parameter</th>
            <th>Standard Required</th>
            <th>Achieved Value</th>
            <th>Compliance Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {[
            { param: "Insulation Resistance", standard: "> 500 MΩ" },
            { param: "Oil BDV", standard: "> 60 KV" },
            { param: "Moisture Content", standard: "< 15 PPM" },
            { param: "Tan Delta", standard: "< 0.5%" },
            { param: "Winding Resistance", standard: "Within ±5%" },
            { param: "Pressure Test", standard: "No Leakage" },
          ].map((item, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td className="field-label">{item.param}</td>
              <td>{item.standard}</td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_qa_achieved_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_qa_achieved_${index + 1}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <select
                  value={formData[`form${currentForm}_qa_compliance_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_qa_compliance_${index + 1}`]: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                  <option value="Conditional">Conditional</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_qa_remarks_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_qa_remarks_${index + 1}`]: e.target.value })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-section-title">
        <h4>Overall Assessment</h4>
      </div>

      <div className="form-group">
        <label>Overall Quality Rating:</label>
        <select
          value={formData[`form${currentForm}_overall_rating`] || ""}
          onChange={(e) => setFormData({ ...formData, [`form${currentForm}_overall_rating`]: e.target.value })}
        >
          <option value="">Select Rating</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Satisfactory">Satisfactory</option>
          <option value="Needs Improvement">Needs Improvement</option>
        </select>
      </div>

      <div className="form-group">
        <label>QA Manager Comments:</label>
        <textarea
          rows="4"
          placeholder="Enter quality assurance comments"
          value={formData[`form${currentForm}_qa_comments`] || ""}
          onChange={(e) => setFormData({ ...formData, [`form${currentForm}_qa_comments`]: e.target.value })}
        />
      </div>

      <SignatureSection />
    </div>
  )

  // Form 19: Final Assembly Check
  const FinalAssemblyCheckForm = () => (
    <div className="individual-technical-form">
      <div className="form-header">
        <h3>FINAL ASSEMBLY CHECK</h3>
        <h4>Complete System Verification</h4>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Assembly Date:</label>
          <input
            type="date"
            value={formData[`form${currentForm}_assembly_date`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_assembly_date`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Inspector Name:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_inspector_name`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_inspector_name`]: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Assembly Location:</label>
          <input
            type="text"
            value={formData[`form${currentForm}_assembly_location`] || ""}
            onChange={(e) => setFormData({ ...formData, [`form${currentForm}_assembly_location`]: e.target.value })}
          />
        </div>
      </div>

      <div className="form-section-title">
        <h4>Assembly Verification Checklist</h4>
      </div>

      <table className="technical-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Assembly Component</th>
            <th>Specification</th>
            <th>Status</th>
            <th>Inspector Initial</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {[
            { component: "Main Tank Assembly", spec: "Properly Sealed" },
            { component: "Bushing Installation", spec: "Torque Specified" },
            { component: "Radiator Connection", spec: "No Leakage" },
            { component: "Control Panel Wiring", spec: "As Per Drawing" },
            { component: "Protection System", spec: "Functional Test OK" },
            { component: "Oil Level Indicator", spec: "Calibrated" },
            { component: "Temperature Gauges", spec: "Working" },
            { component: "Pressure Relief Valve", spec: "Set Correctly" },
            { component: "Earthing System", spec: "Continuity OK" },
            { component: "Nameplate & Markings", spec: "Clearly Visible" },
          ].map((item, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td className="field-label">{item.component}</td>
              <td>{item.spec}</td>
              <td>
                <select
                  value={formData[`form${currentForm}_assembly_status_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_assembly_status_${index + 1}`]: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="OK">OK</option>
                  <option value="Not OK">Not OK</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_assembly_initial_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_assembly_initial_${index + 1}`]: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`form${currentForm}_assembly_remarks_${index + 1}`] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [`form${currentForm}_assembly_remarks_${index + 1}`]: e.target.value })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-section-title">
        <h4>Final Assembly Approval</h4>
      </div>

      <div className="form-group">
        <label>Assembly Status:</label>
        <select
          value={formData[`form${currentForm}_final_assembly_status`] || ""}
          onChange={(e) => setFormData({ ...formData, [`form${currentForm}_final_assembly_status`]: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="Approved">Approved</option>
          <option value="Approved with Conditions">Approved with Conditions</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending Review">Pending Review</option>
        </select>
      </div>

      <div className="form-group">
        <label>Final Comments:</label>
        <textarea
          rows="4"
          placeholder="Enter final assembly comments"
          value={formData[`form${currentForm}_final_assembly_comments`] || ""}
          onChange={(e) => setFormData({ ...formData, [`form${currentForm}_final_assembly_comments`]: e.target.value })}
        />
      </div>

      <SignatureSection />
    </div>
  )

  // Form Renderer Function
  const renderForm = () => {
    const formName = forms[currentForm - 1]
    switch (formName) {
      case "Core Insulation Check":
        return <CoreInsulationCheckForm />
      case "Record of Oil Testing Prior to Filling":
        return <OilTestingForm />
      case "IR Value During Circulation":
        return <IRValueCirculationForm />
      case "Protection Wiring and Cable Termination":
        return <ProtectionWiringForm />
      case "Record of Measurement of IR Values":
        return <IRMeasurementForm />
      case "Cabling/Wiring Checklist":
        return <CablingChecklistForm />
      case "Record of Oil Handling":
        return <OilHandlingForm />
      case "Short Circuit Test":
        return <ShortCircuitTestForm />
      case "Record for Oil Filtration":
        return <OilFiltrationComplexForm />
      case "Tan Delta and Capacitance Test on Bushing":
        return <TanDeltaBushingForm />
      case "Tan Delta and Capacitance Test on Winding":
        return <TanDeltaWindingForm />
      case "Winding Resistance Test":
        return <WindingResistanceTestForm />
      case "Pressure Test Report":
        return <PressureTestReportForm />
      case "Pre-Charging Check List":
        return <PreChargingCheckListForm />
      case "Final Testing Report":
        return <FinalTestingReportForm />
      case "Work Completion Report":
        return <WorkCompletionReportForm />
      case "Final Documentation Review":
        return <FinalDocumentationReviewForm />
      case "Quality Assurance Certificate":
        return <QualityAssuranceCertificateForm />
      case "Final Assembly Check":
        return <FinalAssemblyCheckForm />
      default:
        return (
          <div className="individual-technical-form">
            <div className="form-header">
              <h3>{formName}</h3>
            </div>
            <div className="form-content">
              <p>Form content for {formName} will be implemented here.</p>
            </div>
            <SignatureSection />
          </div>
        )
    }
  }

  return (
    <div className="form-stage">
      {/* Stage Header */}
      <div className="stage-header-new">
        <div className="stage-icon">📋</div>
        <div className="stage-title">
          <h1>
            Stage {stage} Forms Checklist ({stageData.completed}/{stageData.total} completed)
          </h1>
          <p>Complete all forms in this stage before submission for approval</p>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="forms-checklist-grid">
        {forms.map((formName, index) => {
          const formNumber = index + 1
          const status = getFormStatus(formNumber)

          return (
            <div
              key={formNumber}
              className={`form-checklist-card ${status}`}
              onClick={() => {
                if (status === "current" || status === "completed") {
                  setCurrentForm(formNumber)
                }
              }}
            >
              <div className="form-card-header">
                <div className={`form-number-badge ${status}`}>{formNumber}</div>
                <div className={`form-status-badge ${status}`}>
                  <span className="status-icon">{getStatusIcon(status)}</span>
                  <span className="status-text">{getStatusText(status)}</span>
                </div>
              </div>
              <div className="form-card-content">
                <h3 className="form-title">{formName}</h3>
                <p className="form-progress">
                  Form {formNumber} of {stageData.total}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Current Form Display */}
      {isCurrentFormActive && (
        <div className="current-form">
          <div className="form-header-info">
            <h3>
              Form {currentForm} of {stageData.total}: {forms[currentForm - 1]}
            </h3>
          </div>
          {renderForm()}
          <div className="form-actions">
            <button className="submit-btn" onClick={handleFormSubmit}>
              Submit Form {currentForm}
            </button>
          </div>
        </div>
      )}

      {/* Completion Status */}
      {allFormsCompleted && (
        <div className="completion-status">
          <h3>🎉 All Forms Completed!</h3>
          <p>
            All {stageData.total} forms in Stage {stage} have been completed successfully.
          </p>
          {isPendingApproval && (
            <div className="pending-approval">
              <p>⏳ Waiting for ETC Admin approval...</p>
            </div>
          )}
          {stageData.approved && (
            <div className="approved-status">
              <p>✅ Stage {stage} has been approved by ETC Admin!</p>
            </div>
          )}
        </div>
      )}

      {/* ETC Admin Approval Section */}
      {isETCAdmin && isPendingApproval && (
        <div className="admin-approval-section">
          <h3>ETC Admin Approval Required</h3>
          <p>
            Company: <strong>{company.name}</strong>
          </p>
          <p>
            Stage {stage}: {stageData.completed}/{stageData.total} forms completed
          </p>
          <div className="approval-actions">
            <button className="approve-btn" onClick={() => handleApprovalAction(true)}>
              ✅ Approve Stage {stage}
            </button>
            <button className="reject-btn" onClick={() => handleApprovalAction(false)}>
              ❌ Reject Stage {stage}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormStage
