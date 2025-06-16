"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, LogOut, CheckCircle, Clock, AlertCircle, FileText, Send, Trophy } from "lucide-react"
import { FormStage } from "./form-stage"

interface CompanyWorkflowProps {
  company: any
  project: any
  user: any
  onBack: () => void
  onLogout: () => void
}

export function CompanyWorkflow({ company, project, user, onBack, onLogout }: CompanyWorkflowProps) {
  const [currentStage, setCurrentStage] = useState(company.stage || 1)
  const [stageData, setStageData] = useState({
    1: { completed: 5, total: 17, status: "in-progress", approved: false },
    2: { completed: 0, total: 5, status: "locked", approved: false },
    3: { completed: 0, total: 5, status: "locked", approved: false },
  })

  const stages = [
    {
      id: 1,
      name: "Initial Documentation",
      description: "Complete all required initial forms and documentation",
      forms: 17,
      icon: FileText,
    },
    {
      id: 2,
      name: "Technical Review",
      description: "Technical specifications and compliance forms",
      forms: 5,
      icon: AlertCircle,
    },
    {
      id: 3,
      name: "Final Approval",
      description: "Final review and approval documentation",
      forms: 5,
      icon: Trophy,
    },
  ]

  const getStageStatus = (stageId: number) => {
    const stage = stageData[stageId]
    if (stage.approved) return "completed"
    if (stage.completed === stage.total && !stage.approved) return "pending-approval"
    if (stage.completed > 0) return "in-progress"
    return "locked"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending-approval":
        return "bg-yellow-100 text-yellow-800"
      case "locked":
        return "bg-gray-100 text-gray-800"
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
        return <Send className="w-4 h-4" />
      case "locked":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleStageComplete = (stageId: number) => {
    setStageData((prev) => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        completed: prev[stageId].total,
        status: "pending-approval",
      },
    }))
  }

  const handleApproval = (stageId: number) => {
    setStageData((prev) => {
      const newData = {
        ...prev,
        [stageId]: {
          ...prev[stageId],
          approved: true,
          status: "completed",
        },
      }

      // Unlock next stage
      if (stageId < 3) {
        newData[stageId + 1] = {
          ...newData[stageId + 1],
          status: "in-progress",
        }
      }

      return newData
    })
  }

  const overallProgress = stages.reduce((acc, stage) => {
    const stageProgress = (stageData[stage.id].completed / stageData[stage.id].total) * 100
    return acc + stageProgress / stages.length
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-sm text-gray-500">{project.name} - Workflow Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Company Admin
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
        {/* Overall Progress */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overall Progress</span>
              <Badge className="bg-blue-100 text-blue-800">{Math.round(overallProgress)}% Complete</Badge>
            </CardTitle>
            <CardDescription>Track your progress through all workflow stages</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Started</span>
              <span>{Math.round(overallProgress)}% Complete</span>
              <span>Finished</span>
            </div>
          </CardContent>
        </Card>

        {/* Stage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stages.map((stage) => {
            const status = getStageStatus(stage.id)
            const stageInfo = stageData[stage.id]
            const IconComponent = stage.icon

            return (
              <Card
                key={stage.id}
                className={`border-0 shadow-md cursor-pointer transition-all duration-200 ${
                  currentStage === stage.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => status !== "locked" && setCurrentStage(stage.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                      {getStatusIcon(status)}
                      {status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    Stage {stage.id}: {stage.name}
                  </CardTitle>
                  <CardDescription className="text-sm">{stage.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {stageInfo.completed}/{stageInfo.total} forms
                      </span>
                    </div>
                    <Progress value={(stageInfo.completed / stageInfo.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stage Details */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Stage {currentStage} Details</CardTitle>
            <CardDescription>Complete all forms in this stage to proceed</CardDescription>
          </CardHeader>
          <CardContent>
            <FormStage
              stage={currentStage}
              stageData={stageData[currentStage]}
              onStageComplete={() => handleStageComplete(currentStage)}
              onApproval={() => handleApproval(currentStage)}
              isETCAdmin={user?.role === "etc-admin"}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
