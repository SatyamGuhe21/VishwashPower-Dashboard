// Data Persistence Manager for ETC Admin Panel
export class DataPersistenceManager {
  static ETC_KEYS = {
    PROJECTS: "etc_projects",
    COMPANIES: "etc_companies",
    SUBMITTED_FORMS: "etc_submitted_forms",
    SESSION_ID: "etc_session_id",
  }

  // Initialize session
  static initializeSession() {
    const sessionId = Date.now().toString()
    localStorage.setItem(this.ETC_KEYS.SESSION_ID, sessionId)
    return sessionId
  }

  // Check if session is valid
  static isSessionValid() {
    return localStorage.getItem(this.ETC_KEYS.SESSION_ID) !== null
  }

  // Save data with validation
  static saveData(key, data) {
    try {
      if (!this.isSessionValid()) {
        this.initializeSession()
      }

      const dataWithTimestamp = {
        data: data,
        timestamp: new Date().toISOString(),
        sessionId: localStorage.getItem(this.ETC_KEYS.SESSION_ID),
      }

      localStorage.setItem(key, JSON.stringify(dataWithTimestamp))
      return true
    } catch (error) {
      console.error("Error saving data:", error)
      return false
    }
  }

  // Load data with validation
  static loadData(key) {
    try {
      const stored = localStorage.getItem(key)
      if (!stored) return null

      const parsed = JSON.parse(stored)

      // Return just the data part
      return parsed.data || parsed
    } catch (error) {
      console.error("Error loading data:", error)
      return null
    }
  }

  // Clear all ETC data
  static clearAllData() {
    Object.values(this.ETC_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  // Get data summary
  static getDataSummary() {
    const projects = this.loadData(this.ETC_KEYS.PROJECTS) || []
    const companies = this.loadData(this.ETC_KEYS.COMPANIES) || []
    const forms = this.loadData(this.ETC_KEYS.SUBMITTED_FORMS) || []

    return {
      projects: projects.length,
      companies: companies.length,
      submittedForms: forms.length,
      sessionId: localStorage.getItem(this.ETC_KEYS.SESSION_ID),
      lastUpdated: new Date().toISOString(),
    }
  }
}
