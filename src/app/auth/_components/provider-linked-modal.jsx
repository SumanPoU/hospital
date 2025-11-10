"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, ExternalLink } from "lucide-react";

export default function ProviderLinkedModal({
  isOpen,
  onClose,
  email,
  onSwitchToLogin,
}) {
  const handleSwitchToLogin = () => {
    onClose();
    onSwitchToLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            Account Already Exists
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            The email address <strong className="text-gray-900">{email}</strong>{" "}
            is already associated with a social login account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <ExternalLink className="h-4 w-4 text-blue-600" />
          <span>
            Please use Google or another social provider to sign in to your
            existing account.
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
            onClick={handleSwitchToLogin}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
