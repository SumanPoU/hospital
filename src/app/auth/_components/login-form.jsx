"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { PasswordField } from "./password-field";

export default function LoginForm({
  onSuccess,
  onForgotPassword,
  onUnverifiedEmail,
}) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Check if the error is about unverified email
        if (result.error.includes("Email not verified")) {
          onUnverifiedEmail(formData.email);
        } else {
          toast.error(result.error);
        }
      } else if (result?.ok) {
        toast.success("Login successful!");
        window.location.href = "/"
        onSuccess();
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard/user", // Adjust this to your desired redirect URL
      });

      if (result?.error) {
        toast.error("Google login failed");
      } else if (result?.ok) {
        toast.success("Login successful!");
        window.location.href = "/dashboard/user"
        onSuccess();
      }
    } catch (err) {
      toast.error("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-roboto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 text-roboto">Sign In</h2>
        <p className="text-gray-600 nunito-text">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-gray-700 font-medium poppins-text">
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="h-12 border-gray-300 focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password" className="text-gray-700 font-medium poppins-text">
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
            placeholder="Enter your password"
            className="h-12"
          />
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              className="text-sm text-primary/90 hover:text-primary font-medium p-0 h-auto cursor-pointer poppins-text"
              onClick={onForgotPassword}
            >
              Forgot your password?
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-primary/90 hover:bg-primary text-white font-medium cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 nunito-text">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 nunito-text"
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin nunito-text" />
              Signing in with Google...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
