"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Building,
  LogOut,
  Plus,
  Search,
  ArrowLeft,
  FolderPlus,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface ETCAdminPanelProps {
  user: any
  selectedProject: any
  onLogout: () => void
  onProjectSelect: (project: any) => void
  onCompanySelect: (company: any) => void
  onBackToMain: () => void
}

export function ETCAdminPanel({
  user,
  selectedProject,
  onLogout,
  onProjectSelect,
  onCompanySelect,
  onBackToMain,
}: ETCAdminPanelProps) {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Smart City Infrastructure",
      description: "Urban development project for smart city implementation",
      status: "active",
      companies: 8,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Green Energy Initiative",
      description: "Renewable energy project for sustainable development",
      status: "active",
      companies: 12,
      createdAt: "2024-02-01",
    },
  ])

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "TCS (Tata Consultancy Services)",
      projectId: 1,
      stage: 1,
      formsCompleted: 5,
      totalForms: 17,
      status: "in-progress",
      lastActivity: "2024-06-01",
    },
    {
      id: 2,
      name: "IBM Corporation",
      projectId: 1,
      stage: 2,
      formsCompleted: 3,
      totalForms: 5,
      status: "pending-approval",
      lastActivity: "2024-06-02",
    },
    {
      id: 3,
      name: "HCL Technologies",
      projectId: 1,
      stage: 1,
      formsCompleted: 12,
      totalForms: 17,
      status: "in-progress",
      lastActivity: "2024-06-01",
    },
    {
      id: 4,
      name: "TCS (Tata Consultancy Services)",
      projectId: 2,
      stage: 3,
      formsCompleted: 5,
      totalForms: 5,
      status: "completed",
      lastActivity: "2024-05-28",
    },
    {
      id: 5,
      name: "IBM Corporation",
      projectId: 2,
      stage: 1,
      formsCompleted: 8,
      totalForms: 17,
      status: "in-progress",
      lastActivity: "2024-06-01",
    },
    {
      id: 6,
      name: "HCL Technologies",
      projectId: 2,
      stage: 2,
      formsCompleted: 2,
      totalForms: 5,
      status: "in-progress",
      lastActivity: "2024-06-02",
    },
  ])

  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const [searchTerm, setSearchTerm] = useState("")

  const handleCreateProject = () => {
    if (newProject.name && newProject.description) {
      const project = {
        id: projects.length + 1,
        name: newProject.name,
        description: newProject.description,
        status: "active",
        companies: 3, // Always 3 companies (TCS, IBM, HCL)
        createdAt: new Date().toISOString().split("T")[0],
      }

      // Add the project
      setProjects([...projects, project])

      // Automatically add TCS, IBM, and HCL companies for this project
      const newCompanies = [
        {
          id: companies.length + 1,
          name: "TCS (Tata Consultancy Services)",
          projectId: project.id,
          stage: 1,
          formsCompleted: 0,
          totalForms: 17,
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
        },
        {
          id: companies.length + 2,
          name: "IBM Corporation",
          projectId: project.id,
          stage: 1,
          formsCompleted: 0,
          totalForms: 17,
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
        },
        {
          id: companies.length + 3,
          name: "HCL Technologies",
          projectId: project.id,
          stage: 1,
          formsCompleted: 0,
          totalForms: 17,
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
        },
      ]

      setCompanies([...companies, ...newCompanies])
      setNewProject({ name: "", description: "" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending-approval":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "pending-approval":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const projectCompanies = selectedProject
    ? companies.filter((company) => company.projectId === selectedProject.id)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onBackToMain} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedProject ? `${selectedProject.name} - Companies` : "ETC Admin Panel"}
                </h1>
                <p className="text-sm text-gray-500">
                  {selectedProject ? "Manage companies and workflows" : "Manage projects and companies"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                ETC Admin
              </Badge>
              <Button variant="outline" onClick={onLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedProject ? (
          // Projects View
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects</h2>
                <p className="text-gray-600">Create and manage your projects</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <Plus className="w-4 h-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>Add a new project to manage companies and workflows</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Description</Label>
                      <Input
                        id="projectDescription"
                        placeholder="Enter project description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={handleCreateProject}
                      className="w-full"
                      disabled={!newProject.name || !newProject.description}
                    >
                      Create Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-0 shadow-md"
                  onClick={() => onProjectSelect(project)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                        <FolderPlus className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-200">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.companies} companies
                      </span>
                      <span>Created: {project.createdAt}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          // Companies View
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Companies</h2>
                <p className="text-gray-600">Manage companies in {selectedProject.name}</p>
              </div>
              <Button variant="outline" onClick={() => onProjectSelect(null)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectCompanies.map((company) => (
                <Card
                  key={company.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-0 shadow-md"
                  onClick={() => onCompanySelect(company)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${getStatusColor(company.status)} flex items-center gap-1`}>
                        {getStatusIcon(company.status)}
                        {company.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors duration-200">
                      {company.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Stage {company.stage} • {company.formsCompleted}/{company.totalForms} forms completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(company.formsCompleted / company.totalForms) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Progress: {Math.round((company.formsCompleted / company.totalForms) * 100)}%</span>
                        <span>Last activity: {company.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
