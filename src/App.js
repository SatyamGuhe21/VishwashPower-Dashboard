"use client"

import { useState, useEffect } from "react"
import "./App.css"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import MainAdminDashboard from "./components/MainAdminDashboard"
import ETCAdminPanel from "./components/ETCAdminPanel"
import CompanyWorkflow from "./components/CompanyWorkflow"

function App() {
  const [currentView, setCurrentView] = useState("login")
  const [user, setUser] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedView = localStorage.getItem("currentView")
    const savedProject = localStorage.getItem("selectedProject")
    const savedCompany = localStorage.getItem("selectedCompany")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedView && savedUser) {
      setCurrentView(savedView)
    }
    if (savedProject) {
      setSelectedProject(JSON.parse(savedProject))
    }
    if (savedCompany) {
      setSelectedCompany(JSON.parse(savedCompany))
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      localStorage.setItem("currentView", currentView)
    }
  }, [user, currentView])

  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("selectedProject", JSON.stringify(selectedProject))
    }
  }, [selectedProject])

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem("selectedCompany", JSON.stringify(selectedCompany))
    }
  }, [selectedCompany])

  const handleLogin = (userData) => {
    setUser(userData)
    if (userData.role === "main-admin") {
      setCurrentView("main-dashboard")
    } else if (userData.role === "etc-admin") {
      setCurrentView("etc-panel")
    } else if (userData.role === "company-admin") {
      setCurrentView("etc-panel")
    }
  }

  const handleRegister = (userData) => {
    // Save registered user to localStorage
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    existingUsers.push(userData)
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

    // Auto login after registration
    handleLogin(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedProject(null)
    setSelectedCompany(null)
    setCurrentView("login")

    // Clear localStorage
    localStorage.removeItem("currentUser")
    localStorage.removeItem("currentView")
    localStorage.removeItem("selectedProject")
    localStorage.removeItem("selectedCompany")
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setCurrentView("etc-panel")
  }

  const handleCompanySelect = (company) => {
    setSelectedCompany(company)
    setCurrentView("company-workflow")
  }

  const handleBackToETC = () => {
    setSelectedCompany(null)
    localStorage.removeItem("selectedCompany")
    setCurrentView("etc-panel")
  }

  const handleBackToMain = () => {
    setSelectedProject(null)
    setSelectedCompany(null)
    localStorage.removeItem("selectedProject")
    localStorage.removeItem("selectedCompany")
    setCurrentView("main-dashboard")
  }

  return (
    <div className="App">
      {currentView === "login" && (
        <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentView("register")} />
      )}

      {currentView === "register" && (
        <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setCurrentView("login")} />
      )}

      {currentView === "main-dashboard" && user?.role === "main-admin" && (
        <MainAdminDashboard
          user={user}
          onLogout={handleLogout}
          onSelectAdmin={(adminType) => {
            if (adminType === "etc") {
              setCurrentView("etc-panel")
            }
          }}
        />
      )}

      {currentView === "etc-panel" && (
        <ETCAdminPanel
          user={user}
          selectedProject={selectedProject}
          onLogout={handleLogout}
          onProjectSelect={handleProjectSelect}
          onCompanySelect={handleCompanySelect}
          onBackToMain={handleBackToMain}
        />
      )}

      {currentView === "company-workflow" && selectedCompany && (
        <CompanyWorkflow
          company={selectedCompany}
          project={selectedProject}
          user={user}
          onBack={handleBackToETC}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
