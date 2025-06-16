"use client"

import { useState, useEffect } from "react"

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleAndDept: "", // Combined role and department
  })
  const [error, setError] = useState("")
  const [departments, setDepartments] = useState([])
  const [adminOptions, setAdminOptions] = useState([])

  // Load departments from localStorage on component mount
  useEffect(() => {
    const savedDepartments = JSON.parse(localStorage.getItem("departments") || "[]")
    setDepartments(savedDepartments)

    // Create admin options including departments
    const options = [
      { value: "main-admin", label: "🛡️ Main Admin" },
      { value: "etc-admin", label: "🏢 ETC Admin" },
      { value: "company-admin", label: "👥 Company Admin" },
    ]

    // Add department options
    savedDepartments.forEach((dept) => {
      options.push({ value: `dept-${dept}`, label: `🏛️ ${dept} Department Admin` })
    })

    setAdminOptions(options)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    // Extract role and department from the combined selection
    let role, department
    if (formData.roleAndDept.startsWith("dept-")) {
      role = "department-admin"
      department = formData.roleAndDept.substring(5) // Remove "dept-" prefix
    } else {
      role = formData.roleAndDept
      department = ""
    }

    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const existingUser = registeredUsers.find((u) => u.email === formData.email)

    if (existingUser) {
      setError("User with this email already exists")
      return
    }

    // Register new user
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      department,
      createdAt: new Date().toISOString(),
    }

    onRegister(newUser)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            {/* EASY LOGO REPLACEMENT - Just replace the src path */}
            <img src="/logo.png" alt="Vishvas Power" className="logo-large" />
          </div>
          <h1>Create Account</h1>
          <p>Register as a new admin</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder="admin@vishvaspower.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Admin Type <span className="required">*</span>
            </label>
            <select
              value={formData.roleAndDept}
              onChange={(e) => setFormData({ ...formData, roleAndDept: e.target.value })}
              required
            >
              <option value="">Select admin type</option>
              {adminOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn primary"
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword ||
              !formData.roleAndDept
            }
          >
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button type="button" className="link-btn" onClick={onSwitchToLogin}>
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
