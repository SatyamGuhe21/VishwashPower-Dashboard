"use client"

import { useState } from "react"

export default function SiteEngineerAuth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    engineerId: "",
    department: "ETC Department",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      // Login Logic
      const siteEngineers = JSON.parse(localStorage.getItem("siteEngineers") || "[]")

      // Add default test engineer if none exist
      if (siteEngineers.length === 0) {
        const defaultEngineer = {
          id: 1,
          name: "Test Engineer",
          email: "engineer@test.com",
          password: "123456",
          engineerId: "ENG001",
          department: "ETC Department",
          role: "site-engineer",
          registeredAt: new Date().toISOString(),
        }
        siteEngineers.push(defaultEngineer)
        localStorage.setItem("siteEngineers", JSON.stringify(siteEngineers))
      }

      const engineer = siteEngineers.find((eng) => eng.email === formData.email && eng.password === formData.password)

      if (engineer) {
        onLogin(engineer)
      } else {
        setError("Invalid email or password. Try: engineer@test.com / 123456")
      }
    } else {
      // Registration Logic
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      if (!formData.name || !formData.email) {
        setError("Name and email are required")
        return
      }

      const siteEngineers = JSON.parse(localStorage.getItem("siteEngineers") || "[]")

      // Check if engineer already exists
      if (siteEngineers.find((eng) => eng.email === formData.email)) {
        setError("Site Engineer with this email already exists")
        return
      }

      // Create new site engineer
      const newEngineer = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        engineerId: formData.engineerId || `ENG${Date.now()}`,
        department: formData.department,
        role: "site-engineer",
        registeredAt: new Date().toISOString(),
      }

      siteEngineers.push(newEngineer)
      localStorage.setItem("siteEngineers", JSON.stringify(siteEngineers))

      alert("Registration successful! Please login with your credentials.")
      setIsLogin(true)
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        engineerId: "",
        department: "ETC Department",
      })
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo-placeholder">🏗️ VPES</div>
          </div>
          <h1>{isLogin ? "Site Engineer Login" : "Site Engineer Registration"}</h1>
          <p>{isLogin ? "Access your project assignments" : "Register as a Site Engineer for ETC Department"}</p>
          {isLogin && (
            <div className="test-credentials">
              <p>
                <strong>Test Login:</strong>
              </p>
              <p>Email: engineer@test.com</p>
              <p>Password: 123456</p>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label>
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Engineer ID</label>
                <input
                  type="text"
                  placeholder="Enter your Engineer ID (optional)"
                  value={formData.engineerId}
                  onChange={(e) => setFormData({ ...formData, engineerId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="ETC Department">ETC Department</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder="engineer@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-btn primary">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="link-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
