"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Loader2, Edit, Save, X, CheckCircle } from "lucide-react";
import ImageUpload from "@/lib/image-upload";

export default function UserDetailsPage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data directly from session.user
  const user = session?.user || {};
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `api/auth/user/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully!, Please Login again");
        setIsEditing(false);
        // Optionally reload or refetch session to reflect changes
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6 text-center text-gray-700">Not authenticated</div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Profile Details
        </h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                disabled={isLoading}
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <Card className="shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-gray-700 p-3 rounded-md bg-gray-50">
                  {user.name || "Not provided"}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 p-3 rounded-md bg-gray-50">
                <p className="text-gray-700">{user.email}</p>
                {user.emailVerified && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-xs text-gray-400">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-md bg-gray-50">
                  <p className="text-gray-700">
                    {user.phone || "Not provided"}
                  </p>
                  {user.phoneVerified && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>

            {/* Role */}
            <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <p className="text-gray-700 p-3 rounded-md bg-gray-50">
                {user.role || "User"}
              </p>
            </div>

            {/* Avatar */}
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="avatar">Avatar</Label>
              {isEditing ? (
                <ImageUpload
                  title="Upload Avatar"
                  currentImage={formData.avatar}
                  onImageUploaded={(url) =>
                    setFormData((prev) => ({ ...prev, avatar: url }))
                  }
                  onImageRemoved={() =>
                    setFormData((prev) => ({ ...prev, avatar: "" }))
                  }
                />
              ) : (
                <div className="flex items-center gap-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover border"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
