"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { MainAdminDashboard } from "@/components/admin/main-admin-dashboard"
import { ETCAdminPanel } from "@/components/admin/etc-admin-panel"
import { CompanyWorkflow } from "@/components/workflow/company-workflow"

export default function App() {
  const [currentView, setCurrentView] = useState("login")
  const [user, setUser] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    if (userData.role === "main-admin") {
      setCurrentView("main-dashboard")
    } else if (userData.role === "etc-admin") {
      setCurrentView("etc-panel")
    }
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedProject(null)
    setSelectedCompany(null)
    setCurrentView("login")
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
    setCurrentView("etc-panel")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {currentView === "login" && (
        <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentView("register")} />
      )}

      {currentView === "register" && (
        <RegisterForm onRegister={handleLogin} onSwitchToLogin={() => setCurrentView("login")} />
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
          onBackToMain={() => setCurrentView("main-dashboard")}
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
