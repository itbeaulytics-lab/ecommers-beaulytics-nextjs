import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { redirectIfAuthenticated } from "@/lib/authHelpers";

export default async function LoginPage() {
  await redirectIfAuthenticated("/dashboard");

  return (
    <AuthCard title="Login">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
