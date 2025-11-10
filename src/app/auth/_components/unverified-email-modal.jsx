"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Mail, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

export default function UnverifiedEmailModal({
  isOpen,
  onClose,
  email,
  onVerificationSent,
}) {
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/public/user/resend-verification-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification code sent! Please check your email.");
        onClose();
        onVerificationSent();
      } else {
        toast.error(data.error || "Failed to send verification code");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Email Not Verified
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Your email address{" "}
            <strong className="text-gray-900">{email}</strong> is already
            registered but not verified. Would you like to receive a new
            verification code?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
          <Mail className="h-4 w-4 text-orange-600" />
          <span>
            You need to verify your email before you can login or register.
          </span>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendVerification}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Verification Email"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
