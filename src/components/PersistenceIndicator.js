"use client"

// Persistence Indicator Component
import { useState, useEffect } from "react"
import { DataPersistenceManager } from "./DataPersistenceManager"

export const PersistenceIndicator = () => {
  const [summary, setSummary] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateSummary = () => {
      setSummary(DataPersistenceManager.getDataSummary())
    }

    updateSummary()
    const interval = setInterval(updateSummary, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (!summary) return null

  return (
    <div className="persistence-indicator">
      <button className="persistence-toggle" onClick={() => setIsVisible(!isVisible)} title="Data Persistence Status">
        💾 Data Status
      </button>

      {isVisible && (
        <div className="persistence-details">
          <div className="persistence-card">
            <h4>Session Data</h4>
            <div className="data-stats">
              <div className="stat-item">
                <span className="stat-label">Projects:</span>
                <span className="stat-value">{summary.projects}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Companies:</span>
                <span className="stat-value">{summary.companies}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Forms:</span>
                <span className="stat-value">{summary.submittedForms}</span>
              </div>
            </div>
            <div className="session-info">
              <p>
                <strong>Session ID:</strong> {summary.sessionId?.slice(-8)}
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date(summary.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
            <div className="persistence-status">
              <span className="status-indicator active">🟢 Data Persisted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
