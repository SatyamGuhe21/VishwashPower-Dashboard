"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, LogOut, Building, Users, FileText, Settings, BarChart3, ChevronRight, Activity } from "lucide-react"

interface MainAdminDashboardProps {
  user: any
  onLogout: () => void
  onSelectAdmin: (adminType: string) => void
}

export function MainAdminDashboard({ user, onLogout, onSelectAdmin }: MainAdminDashboardProps) {
  const adminPanels = [
    {
      id: "etc",
      name: "ETC Admin Panel",
      description: "Manage projects, companies, and approval workflows",
      icon: Building,
      color: "bg-blue-500",
      stats: { projects: 12, companies: 45, pending: 8 },
    },
    {
      id: "finance",
      name: "Finance Admin Panel",
      description: "Handle financial operations and budgets",
      icon: BarChart3,
      color: "bg-green-500",
      stats: { budget: "$2.5M", transactions: 156, pending: 3 },
    },
    {
      id: "hr",
      name: "HR Admin Panel",
      description: "Manage human resources and employee data",
      icon: Users,
      color: "bg-purple-500",
      stats: { employees: 234, applications: 12, reviews: 5 },
    },
    {
      id: "operations",
      name: "Operations Admin Panel",
      description: "Oversee daily operations and processes",
      icon: Settings,
      color: "bg-orange-500",
      stats: { processes: 89, active: 67, issues: 2 },
    },
    {
      id: "compliance",
      name: "Compliance Admin Panel",
      description: "Ensure regulatory compliance and documentation",
      icon: FileText,
      color: "bg-red-500",
      stats: { documents: 456, audits: 8, alerts: 1 },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Main Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Online
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Panels</h2>
          <p className="text-gray-600">Select an admin panel to manage specific operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminPanels.map((panel) => {
            const IconComponent = panel.icon
            return (
              <Card
                key={panel.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-0 shadow-md"
                onClick={() => onSelectAdmin(panel.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 ${panel.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-200">
                    {panel.name}
                  </CardTitle>
                  <CardDescription className="text-sm">{panel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {Object.entries(panel.stats).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-lg font-semibold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500 capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-green-600">98.5%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
