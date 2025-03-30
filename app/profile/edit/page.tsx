import type { Metadata } from "next"
import ProfileEditForm from "./profile-edit-form"

export const metadata: Metadata = {
  title: "Edit Profile | CoListr",
  description: "Update your professional profile and investment preferences",
}

export default function ProfileEditPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
      <p className="text-muted-foreground mb-8">Update your professional information and investment preferences.</p>

      <ProfileEditForm />
    </div>
  )
}

