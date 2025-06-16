"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, FileText, Send, Check, X } from "lucide-react"

interface FormStageProps {
  stage: number
  stageData: any
  onStageComplete: () => void
  onApproval: () => void
  isETCAdmin: boolean
}

export function FormStage({ stage, stageData, onStageComplete, onApproval, isETCAdmin }: FormStageProps) {
  const [currentForm, setCurrentForm] = useState(1)
  const [formData, setFormData] = useState({})

  const getFormsForStage = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return [
          "Company Registration Details",
          "Business License Information",
          "Tax Registration Documents",
          "Financial Statements",
          "Insurance Documentation",
          "Environmental Compliance",
          "Safety Protocols",
          "Quality Assurance Plans",
          "Technical Specifications",
          "Project Timeline",
          "Resource Allocation",
          "Risk Assessment",
          "Stakeholder Information",
          "Communication Plan",
          "Budget Breakdown",
          "Legal Compliance",
          "Final Documentation Review",
        ]
      case 2:
        return [
          "Technical Architecture Review",
          "Security Assessment",
          "Performance Standards",
          "Integration Requirements",
          "Final Technical Approval",
        ]
      case 3:
        return [
          "Executive Summary",
          "Final Risk Assessment",
          "Compliance Verification",
          "Stakeholder Sign-off",
          "Project Authorization",
        ]
      default:
        return []
    }
  }

  const forms = getFormsForStage(stage)
  const isFormCompleted = (formIndex: number) => formIndex < stageData.completed
  const isCurrentFormActive = currentForm <= stageData.completed + 1
  const allFormsCompleted = stageData.completed === stageData.total
  const isPendingApproval = allFormsCompleted && !stageData.approved

  const handleFormSubmit = () => {
    if (currentForm === stageData.total) {
      onStageComplete()
    } else {
      setCurrentForm(currentForm + 1)
    }
  }

  const handleApprovalAction = (approved: boolean) => {
    if (approved) {
      onApproval()
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Forms</p>
                <p className="text-2xl font-bold text-blue-600">{stageData.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining Forms</p>
                <p className="text-2xl font-bold text-orange-600">{stageData.total - stageData.completed}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((stageData.completed / stageData.total) * 100)}%
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms List */}
      <Card>
        <CardHeader>
          <CardTitle>Forms Checklist</CardTitle>
          <CardDescription>Complete each form in sequence to progress through the stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forms.map((formName, index) => {
              const formNumber = index + 1
              const isCompleted = isFormCompleted(formNumber)
              const isCurrent = formNumber === currentForm && isCurrentFormActive

              return (
                <div
                  key={formNumber}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    isCompleted
                      ? "bg-green-50 border-green-200"
                      : isCurrent
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{formNumber}</span>
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          isCompleted ? "text-green-800" : isCurrent ? "text-blue-800" : "text-gray-600"
                        }`}
                      >
                        {formName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Form {formNumber} of {forms.length}
                      </p>
                    </div>
                  </div>
                  <Badge variant={isCompleted ? "default" : isCurrent ? "secondary" : "outline"}>
                    {isCompleted ? "Completed" : isCurrent ? "Current" : "Pending"}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Form */}
      {isCurrentFormActive && !allFormsCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>
              Form {currentForm}: {forms[currentForm - 1]}
            </CardTitle>
            <CardDescription>Fill out the required information for this form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field1">Document Reference</Label>
                <Input
                  id="field1"
                  placeholder="Enter document reference"
                  value={formData[`form${currentForm}_field1`] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_field1`]: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field2">Date</Label>
                <Input
                  id="field2"
                  type="date"
                  value={formData[`form${currentForm}_field2`] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`form${currentForm}_field2`]: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter detailed description"
                value={formData[`form${currentForm}_description`] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`form${currentForm}_description`]: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleFormSubmit} className="gap-2">
                {currentForm === stageData.total ? (
                  <>
                    <Send className="w-4 h-4" />
                    Submit for Approval
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Complete Form
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Section */}
      {isPendingApproval && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Pending ETC Admin Approval</CardTitle>
            <CardDescription className="text-yellow-700">
              All forms have been completed and are awaiting approval from ETC Admin
            </CardDescription>
          </CardHeader>
          {isETCAdmin && (
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={() => handleApprovalAction(true)} className="gap-2 bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4" />
                  Approve Stage
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleApprovalAction(false)}
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  Request Changes
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Completion Message */}
      {stageData.approved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Stage {stage} Completed!</h3>
            <p className="text-green-700">
              All forms have been completed and approved. You can now proceed to the next stage.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
