"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { PasswordField } from "./password-field";

export default function RegisterForm({
  onSuccess,
  onUnverifiedEmail,
  onProviderLinked,
}) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Using your existing register API endpoint
      const response = await fetch("/api/public/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Registration successful! Please check your email for verification."
        );
        onSuccess(data, formData.email);

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        // Handle different error types based on status and flags
        if (response.status === 409) {
          if (data.providerLinked) {
            // Email is linked to social provider
            onProviderLinked(formData.email);
          } else if (data.unverified) {
            // Email is registered but not verified
            onUnverifiedEmail(formData.email);
          } else {
            toast.error(data.error || "Registration failed");
          }
        } else {
          toast.error(data.error || "Registration failed");
        }
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordGenerated = (password) => {
    setFormData((prev) => ({ ...prev, password, confirmPassword: password }));
    toast.success("Strong password generated and confirmed!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 playfair-text">Create Account</h2>
        <p className="text-gray-600 nunito-text">
          Fill in your details to create a new account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div className="space-y-2 nunito-text">
          <Label htmlFor="register-name" className="text-gray-700 font-medium">
            Full Name
          </Label>
          <Input
            id="register-name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2 nunito-text">
          <Label htmlFor="register-email" className="text-gray-700 font-medium">
            Email
          </Label>
          <Input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2 nunito-text">
          <Label
            htmlFor="register-password"
            className="text-gray-700 font-medium"
          >
            Password
          </Label>
          <PasswordField
            show={showPassword}
            setShow={setShowPassword}
            field={{
              value: formData.password,
              onChange: (value) =>
                setFormData((prev) => ({ ...prev, password: value })),
            }}
            placeholder="Create a strong password"
            showGenerator={true}
            showStrengthMeter={true}
            onPasswordGenerated={handlePasswordGenerated}
            className="h-12"
          />
        </div>
        <div className="space-y-2 nunito-text">
          <Label
            htmlFor="register-confirm-password"
            className="text-gray-700 font-medium"
          >
            Confirm Password
          </Label>
          <PasswordField
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            field={{
              value: formData.confirmPassword,
              onChange: (value) =>
                setFormData((prev) => ({ ...prev, confirmPassword: value })),
            }}
            placeholder="Confirm your password"
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-primary/90 hover:bg-primary text-white font-medium nunito-text"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  );
}
