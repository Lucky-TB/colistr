import Link from "next/link"
import { CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data for profile completion
const profileSteps = [
  {
    id: "personal",
    title: "Personal Information",
    completed: true,
  },
  {
    id: "professional",
    title: "Professional Details",
    completed: true,
  },
  {
    id: "verification",
    title: "License Verification",
    completed: false,
  },
  {
    id: "investment",
    title: "Investment Preferences",
    completed: true,
  },
  {
    id: "photo",
    title: "Profile Photo",
    completed: false,
  },
]

export function ProfileCompletion() {
  // Calculate completion percentage
  const completedSteps = profileSteps.filter((step) => step.completed).length
  const completionPercentage = Math.round((completedSteps / profileSteps.length) * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Profile Completion</span>
        <span className="text-sm font-medium">{completionPercentage}%</span>
      </div>
      <Progress value={completionPercentage} className="h-2" />

      <div className="space-y-3 pt-2">
        {profileSteps.map((step) => (
          <div key={step.id} className="flex items-center justify-between">
            <div className="flex items-center">
              {step.completed ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">{step.title}</span>
            </div>
            {!step.completed && (
              <Link href={`/profile/edit#${step.id}`} className="text-xs text-primary hover:underline">
                Complete
              </Link>
            )}
          </div>
        ))}
      </div>

      {completionPercentage < 100 && (
        <div className="mt-4 flex items-start rounded-md bg-muted p-3 text-sm">
          <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
          <div>
            <p>Complete your profile to improve match quality and visibility.</p>
          </div>
        </div>
      )}
    </div>
  )
}

