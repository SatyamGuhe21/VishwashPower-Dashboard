"use client"

import { useState, useEffect } from "react"
import SiteEngineerAuth from "../components/SiteEngineerAuth"
import SiteEngineerDashboard from "../components/SiteEngineerDashboard"
import ProjectWorkflow from "../components/ProjectWorkflow"

export default function SiteEngineerApp() {
  const [currentView, setCurrentView] = useState("auth")
  const [siteEngineer, setSiteEngineer] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)

  // Check if site engineer is already logged in
  useEffect(() => {
    const savedEngineer = localStorage.getItem("currentSiteEngineer")
    if (savedEngineer) {
      try {
        const engineerData = JSON.parse(savedEngineer)
        setSiteEngineer(engineerData)
        setCurrentView("dashboard")
      } catch (error) {
        console.error("Error parsing saved engineer data:", error)
        localStorage.removeItem("currentSiteEngineer")
      }
    }
  }, [])

  const handleLogin = (engineerData) => {
    setSiteEngineer(engineerData)
    localStorage.setItem("currentSiteEngineer", JSON.stringify(engineerData))
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setSiteEngineer(null)
    setSelectedProject(null)
    localStorage.removeItem("currentSiteEngineer")
    setCurrentView("auth")
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setCurrentView("workflow")
  }

  const handleBackToDashboard = () => {
    setSelectedProject(null)
    setCurrentView("dashboard")
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "auth":
        return <SiteEngineerAuth onLogin={handleLogin} />

      case "dashboard":
        return (
          <SiteEngineerDashboard
            siteEngineer={siteEngineer}
            onProjectSelect={handleProjectSelect}
            onLogout={handleLogout}
          />
        )

      case "workflow":
        return (
          <ProjectWorkflow
            siteEngineer={siteEngineer}
            project={selectedProject}
            onBack={handleBackToDashboard}
            onLogout={handleLogout}
          />
        )

      default:
        return <SiteEngineerAuth onLogin={handleLogin} />
    }
  }

  return <div className="site-engineer-app">{renderCurrentView()}</div>
}
