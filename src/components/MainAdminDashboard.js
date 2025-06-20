"use client"

import { useState, useEffect } from "react"

const MainAdminDashboard = ({ user, onLogout, onSelectAdmin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [newDepartment, setNewDepartment] = useState("")
  const [departmentError, setDepartmentError] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [showDepartmentDetails, setShowDepartmentDetails] = useState(false)

  const adminPanels = [
    {
      id: "etc",
      name: "ETC Admin Panel",
      description: "Manage projects, companies, and approval workflows",
      icon: "🏢",
      color: "#C41E3A",
      stats: { projects: 12, companies: 45, pending: 8 },
    },
    {
      id: "finance",
      name: "Finance Admin Panel",
      description: "Handle financial operations and budgets",
      icon: "💰",
      color: "#1E3A8A",
      stats: { budget: "$2.5M", transactions: 156, pending: 3 },
    },
    {
      id: "hr",
      name: "HR Admin Panel",
      description: "Manage human resources and employee data",
      icon: "👥",
      color: "#6B7280",
      stats: { employees: 234, applications: 12, reviews: 5 },
    },
    {
      id: "operations",
      name: "Operations Admin Panel",
      description: "Oversee daily operations and processes",
      icon: "⚙️",
      color: "#C41E3A",
      stats: { processes: 89, active: 67, issues: 2 },
    },
    {
      id: "compliance",
      name: "Compliance Admin Panel",
      description: "Ensure regulatory compliance and documentation",
      icon: "📋",
      color: "#1E3A8A",
      stats: { documents: 456, audits: 8, alerts: 1 },
    },
  ]

  // Load departments from localStorage on component mount
  useEffect(() => {
    const savedDepartments = JSON.parse(localStorage.getItem("departments") || "[]")
    setDepartments(savedDepartments)
  }, [])

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      setDepartmentError("Department name cannot be empty")
      return
    }

    // Check if department already exists
    if (departments.includes(newDepartment.trim())) {
      setDepartmentError("Department already exists")
      return
    }

    const updatedDepartments = [...departments, newDepartment.trim()]
    setDepartments(updatedDepartments)

    // Save to localStorage
    localStorage.setItem("departments", JSON.stringify(updatedDepartments))

    // Reset form
    setNewDepartment("")
    setDepartmentError("")
  }

  const handleDeleteDepartment = (deptToDelete) => {
    const updatedDepartments = departments.filter((dept) => dept !== deptToDelete)
    setDepartments(updatedDepartments)
    localStorage.setItem("departments", JSON.stringify(updatedDepartments))
  }

  // Generate random stats for department panels
  const generateRandomStats = (departmentName) => {
    // Use the department name as a seed for pseudo-random but consistent numbers
    const seed = departmentName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return {
      users: (seed % 50) + 5,
      projects: (seed % 20) + 2,
      active: (seed % 10) + 1,
    }
  }

  // Generate a color for department panels
  const getDepartmentColor = (index) => {
    const colors = ["#C41E3A", "#1E3A8A", "#6B7280", "#047857", "#7C3AED", "#B45309", "#0369A1"]
    return colors[index % colors.length]
  }

  // Generate an icon for department panels
  const getDepartmentIcon = (index) => {
    const icons = ["🏛️", "🏢", "📊", "📈", "📁", "🔍", "🔧", "📝"]
    return icons[index % icons.length]
  }

  const handleViewDepartmentDetails = (dept, index) => {
    const stats = generateRandomStats(dept)
    const color = getDepartmentColor(index)
    const icon = getDepartmentIcon(index)

    // Get users from this department
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const departmentUsers = registeredUsers.filter((user) => user.department === dept)

    setSelectedDepartment({
      name: dept,
      icon,
      color,
      stats,
      users: departmentUsers,
      createdAt: new Date().toLocaleDateString(),
    })

    setShowDepartmentDetails(true)
  }

  return (
    <div className="dashboard-container">
            <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            {/* Mobile menu toggle button */}
            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            {/* EASY LOGO REPLACEMENT - Just replace the src path */}
            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <div className="header-title">
              <h1>Main Admin Dashboard</h1>
              <p>Welcome back, {user.name}</p>
            </div>
          </div>

          {/* Desktop header right */}
          <div className="header-right desktop-only">
            <span className="user-badge online">🟢 Online</span>
            <button onClick={onLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>

          {/* Mobile menu overlay */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
                  <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                    ×
                  </button>
                </div>
                <div className="mobile-menu-content">
                  <div className="mobile-user-info">
                    <span className="user-badge online">🟢 Online</span>
                    <p>Welcome back, {user.name}</p>
                  </div>
                  <button onClick={onLogout} className="mobile-logout-btn">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-title">
          <h2>Admin Panels</h2>
          <p>Select an admin panel to manage specific operations</p>
        </div>

        <div className="admin-panels-grid">
          {adminPanels.map((panel) => (
            <div
              key={panel.id}
              className="admin-panel-card"
              onClick={() => onSelectAdmin(panel.id)}
              style={{ borderLeft: `4px solid ${panel.color}` }}
            >
              <div className="panel-header">
                <div className="panel-icon" style={{ backgroundColor: panel.color }}>
                  {panel.icon}
                </div>
                <div className="panel-arrow">→</div>
              </div>
              <h3>{panel.name}</h3>
              <p>{panel.description}</p>
              <div className="panel-stats">
                {Object.entries(panel.stats).map(([key, value]) => (
                  <div key={key} className="stat-item">
                    <span className="stat-value">{value}</span>
                    <span className="stat-label">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Department Management Section */}
        <div className="section-header">
          <div>
            <h2>Department Management</h2>
            <p>Create and manage departments for your organization</p>
          </div>
          <div className="department-form-container">
            {departmentError && <div className="error-message">{departmentError}</div>}
            <div className="department-form-inline">
              <input
                type="text"
                placeholder="Department Name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="department-input"
              />
              <button className="create-btn" onClick={handleAddDepartment}>
                Add Department
              </button>
            </div>
          </div>
        </div>

        {/* Department Admin Panels */}
        <div className="admin-panels-grid">
          {departments.length === 0 ? (
            <div className="no-departments">
              <p>No departments created yet. Add your first department above.</p>
            </div>
          ) : (
            departments.map((dept, index) => {
              const stats = generateRandomStats(dept)
              const color = getDepartmentColor(index)
              const icon = getDepartmentIcon(index)

              return (
                <div
                  key={index}
                  className="admin-panel-card"
                  onClick={() => handleViewDepartmentDetails(dept, index)}
                  style={{ borderLeft: `4px solid ${color}` }}
                >
                  <div className="panel-header">
                    <div className="panel-icon" style={{ backgroundColor: color }}>
                      {icon}
                    </div>
                    <div className="panel-arrow">→</div>
                  </div>
                  <h3>{dept} Department</h3>
                  <p>Manage operations and resources for the {dept} department</p>
                  <div className="panel-stats">
                    {Object.entries(stats).map(([key, value]) => (
                      <div key={key} className="stat-item">
                        <span className="stat-value">{value}</span>
                        <span className="stat-label">{key}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="delete-department-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteDepartment(dept)
                    }}
                  >
                    Delete
                  </button>
                </div>
              )
            })
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon vishvas-primary">📊</div>
            <div className="stat-content">
              <h4>Total Projects</h4>
              <div className="stat-number">127</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon vishvas-secondary">👤</div>
            <div className="stat-content">
              <h4>Active Users</h4>
              <div className="stat-number">1,234</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon vishvas-accent">⏳</div>
            <div className="stat-content">
              <h4>Pending Approvals</h4>
              <div className="stat-number">23</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon vishvas-success">✅</div>
            <div className="stat-content">
              <h4>System Health</h4>
              <div className="stat-number">98.5%</div>
            </div>
          </div>
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

      {/* Department Details Modal */}
      {showDepartmentDetails && selectedDepartment && (
        <div className="modal-overlay">
          <div className="modal-content department-details-modal">
            <div className="modal-header">
              <div className="department-modal-icon" style={{ backgroundColor: selectedDepartment.color }}>
                {selectedDepartment.icon}
              </div>
              <h3>{selectedDepartment.name} Department</h3>
              <button className="close-btn" onClick={() => setShowDepartmentDetails(false)}>
                ×
              </button>
            </div>

            <div className="department-details-content">
              <div className="department-info-section">
                <h4>Department Information</h4>
                <div className="department-info-grid">
                  <div className="info-item">
                    <span className="info-label">Created</span>
                    <span className="info-value">{selectedDepartment.createdAt}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className="status-badge status-completed">Active</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Users</span>
                    <span className="info-value">{selectedDepartment.stats.users}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Projects</span>
                    <span className="info-value">{selectedDepartment.stats.projects}</span>
                  </div>
                </div>
              </div>

              <div className="department-stats-section">
                <h4>Department Statistics</h4>
                <div className="stats-grid department-stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon vishvas-primary">👥</div>
                    <div className="stat-content">
                      <h4>Total Users</h4>
                      <div className="stat-number">{selectedDepartment.stats.users}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon vishvas-secondary">📊</div>
                    <div className="stat-content">
                      <h4>Projects</h4>
                      <div className="stat-number">{selectedDepartment.stats.projects}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon vishvas-accent">⚡</div>
                    <div className="stat-content">
                      <h4>Active Projects</h4>
                      <div className="stat-number">{selectedDepartment.stats.active}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon vishvas-success">📈</div>
                    <div className="stat-content">
                      <h4>Completion Rate</h4>
                      <div className="stat-number">{Math.floor(Math.random() * 30) + 70}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="department-users-section">
                <h4>Department Users</h4>
                {selectedDepartment.users && selectedDepartment.users.length > 0 ? (
                  <div className="department-users-list">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDepartment.users.map((user, index) => (
                          <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-data">No users assigned to this department yet.</p>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDepartmentDetails(false)}>
                Close
              </button>
              <button className="submit-btn">Manage Department</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainAdminDashboard
