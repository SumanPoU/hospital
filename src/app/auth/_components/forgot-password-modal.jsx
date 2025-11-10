"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import { PasswordField } from "./password-field";

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSendResetCode = async () => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    try {
      // Using your existing reset password API endpoint
      const response = await fetch("/api/public/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Reset code sent! Please check your email.");
        setStep("reset");
      } else {
        toast.error(data.error || "Failed to send reset code");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.code || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Using your existing reset password confirm API endpoint
      const response = await fetch("/api/public/user/reset-password/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Password reset successfully! You can now login with your new password."
        );
        setTimeout(() => {
          handleClose();
          onSuccess();
        }, 1500);
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordGenerated = (password) => {
    setFormData((prev) => ({
      ...prev,
      newPassword: password,
      confirmPassword: password,
    }));
    toast.success("Strong password generated and confirmed!");
  };

  const handleClose = () => {
    setStep("email");
    setFormData({
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 playfair-text">
            <KeyRound className="h-5 w-5 text-primary/90" />
            {step === "email" ? "Reset Password" : "Enter New Password"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 nunito-text">
            {step === "email"
              ? "Enter your email address and we'll send you a reset code."
              : `Enter the reset code sent to ${formData.email} and your new password.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 nunito-text">
          {step === "email" ? (
            <div className="space-y-2">
              <Label
                htmlFor="reset-email"
                className="text-gray-700 font-medium"
              >
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="h-12 border-gray-300 focus:border-primary/80 focus:ring-primary/80"
              />
            </div>
          ) : (
            <>
              <div className="space-y-2 nunito-text">
                <Label
                  htmlFor="reset-code"
                  className="text-gray-700 font-medium"
                >
                  Reset Code
                </Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="Enter reset code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  className="h-12 border-gray-300 focus:border-primary/80 focus:ring-primary/80 text-center font-mono"
                />
              </div>
              <div className="space-y-2 nunito-text">
                <Label
                  htmlFor="new-password"
                  className="text-gray-700 font-medium"
                >
                  New Password
                </Label>
                <PasswordField
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                  field={{
                    value: formData.newPassword,
                    onChange: (value) =>
                      setFormData((prev) => ({ ...prev, newPassword: value })),
                  }}
                  placeholder="Enter new password"
                  showGenerator={true}
                  showStrengthMeter={true}
                  onPasswordGenerated={handlePasswordGenerated}
                  className="h-12"
                />
              </div>
              <div className="space-y-2 nunito-text">
                <Label
                  htmlFor="confirm-new-password"
                  className="text-gray-700 font-medium"
                >
                  Confirm New Password
                </Label>
                <PasswordField
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  field={{
                    value: formData.confirmPassword,
                    onChange: (value) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: value,
                      })),
                  }}
                  placeholder="Confirm new password"
                  className="h-12"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 nunito-text">
          {step === "reset" && (
            <Button
              variant="outline"
              onClick={() => setStep("email")}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back
            </Button>
          )}
          <Button
            onClick={
              step === "email" ? handleSendResetCode : handleResetPassword
            }
            disabled={loading}
            className="w-full sm:w-auto bg-primary/90 hover:bg-primary text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step === "email" ? "Sending..." : "Resetting..."}
              </>
            ) : step === "email" ? (
              "Send Reset Code"
            ) : (
              "Reset Password"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
