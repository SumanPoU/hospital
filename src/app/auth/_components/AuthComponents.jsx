"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import EmailVerificationModal from "./email-verification-modal";
import ForgotPasswordModal from "./forgot-password-modal";
import UnverifiedEmailModal from "./unverified-email-modal";
import ProviderLinkedModal from "./provider-linked-modal";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("login");

  // Email verification modal state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // Forgot password modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Unverified email modal state
  const [showUnverifiedEmailModal, setShowUnverifiedEmailModal] =
    useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  // Provider linked modal state
  const [showProviderLinkedModal, setShowProviderLinkedModal] = useState(false);
  const [providerLinkedEmail, setProviderLinkedEmail] = useState("");

  const { data: session, status } = useSession();

  // Handle URL-based tab navigation
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register" || tab === "login") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", value);
    router.replace(newUrl.pathname + newUrl.search, { scroll: false });
  };

  const handleLoginSuccess = () => {
    // Middleware will handle the redirect based on role
    window.location.href = "/user";
  };

  const handleRegisterSuccess = (data, email) => {
    setVerificationEmail(email);
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setActiveTab("login");
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", "login");
    router.replace(newUrl.pathname + newUrl.search, { scroll: false });
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPasswordModal(false);
    setActiveTab("login");
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", "login");
    router.replace(newUrl.pathname + newUrl.search, { scroll: false });
  };

  const handleUnverifiedEmail = (email) => {
    setUnverifiedEmail(email);
    setShowUnverifiedEmailModal(true);
  };

  const handleUnverifiedEmailVerificationSent = () => {
    setVerificationEmail(unverifiedEmail);
    setShowVerificationModal(true);
  };

  const handleProviderLinked = (email) => {
    setProviderLinkedEmail(email);
    setShowProviderLinkedModal(true);
  };

  const handleProviderLinkedSwitchToLogin = () => {
    setActiveTab("login");
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", "login");
    router.replace(newUrl.pathname + newUrl.search, { scroll: false });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-roboto">
            Welcome
          </h1>
          <p className="text-gray-600 nunito-text">
            Sign in to your account or create a new one
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl solway-text">
              <TabsTrigger
                value="login"
                className="rounded-lg data-[state=active]:bg-primary/5 text-roboto data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg data-[state=active]:bg-primary/5 text-roboto data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm
                onSuccess={handleLoginSuccess}
                onForgotPassword={() => setShowForgotPasswordModal(true)}
                onUnverifiedEmail={handleUnverifiedEmail}
              />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onUnverifiedEmail={handleUnverifiedEmail}
                onProviderLinked={handleProviderLinked}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Email Verification Modal */}
        <EmailVerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          email={verificationEmail}
          onSuccess={handleVerificationSuccess}
        />

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          isOpen={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
          onSuccess={handleForgotPasswordSuccess}
        />

        {/* Unverified Email Modal */}
        <UnverifiedEmailModal
          isOpen={showUnverifiedEmailModal}
          onClose={() => setShowUnverifiedEmailModal(false)}
          email={unverifiedEmail}
          onVerificationSent={handleUnverifiedEmailVerificationSent}
        />

        {/* Provider Linked Modal */}
        <ProviderLinkedModal
          isOpen={showProviderLinkedModal}
          onClose={() => setShowProviderLinkedModal(false)}
          email={providerLinkedEmail}
          onSwitchToLogin={handleProviderLinkedSwitchToLogin}
        />
      </div>
    </div>
  );
}

export default function AuthPage() {
  return <AuthPageContent />;
}
