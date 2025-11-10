"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Mail, Clock } from "lucide-react";
import { toast } from "react-toastify";

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onSuccess,
}) {
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(180);
    setCanResend(false);
    setVerificationCode("");

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // // Auto-resend when timer expires
  // useEffect(() => {
  //   if (canResend && timeLeft === 0) {
  //     handleAutoResend();
  //   }
  // }, [canResend, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      toast.error("Verification code is required");
      return;
    }

    setVerificationLoading(true);

    try {
      const response = await fetch("/api/public/user/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Email verified successfully! You can now login.");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);

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
        setTimeLeft(180); // Reset timer
        setCanResend(false);
      } else {
        toast.error(data.error || "Failed to resend code");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleAutoResend = async () => {
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
        toast.info("Verification code expired. New code sent automatically!");
        setTimeLeft(180); // Reset timer
        setCanResend(false);
      } else {
        toast.error("Failed to auto-resend verification code");
      }
    } catch (err) {
      toast.error("Network error during auto-resend.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 text-roboto">
            <Mail className="h-5 w-5 text-primary/90  " />
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="text-gray-600 nunito-text">
            We've sent a verification code to{" "}
            <strong className="text-gray-900">{email}</strong>. Please enter the
            code below to verify your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg nunito-text">
            <Clock className="h-4 w-4 text-primary/90" />
            <span>
              {timeLeft > 0 ? (
                <>
                  Code expires in:{" "}
                  <strong className="text-gray-900">
                    {formatTime(timeLeft)}
                  </strong>
                </>
              ) : (
                <span className="text-orange-600 font-medium">
                  Code expired - New code sent automatically
                </span>
              )}
            </span>
          </div>

          <div className="space-y-2 nunito-text">
            <Label
              htmlFor="verification-code"
              className="text-gray-700 font-medium"
            >
              Verification Code
            </Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="h-12 border-gray-300 focus:border-primary/90 focus:ring-primary/90 text-center text-lg font-mono"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 nunito-text">
          <Button
            variant="outline"
            onClick={handleResendCode}
            disabled={resendLoading || !canResend}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {resendLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
          <Button
            onClick={handleVerifyEmail}
            disabled={verificationLoading || !verificationCode.trim()}
            className="w-full sm:w-auto bg-primary/90 hover:bg-primary text-white"
          >
            {verificationLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
