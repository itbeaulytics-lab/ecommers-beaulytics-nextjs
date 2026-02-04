import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";
import { redirectIfAuthenticated } from "@/lib/authHelpers";

export default async function RegisterPage() {
  await redirectIfAuthenticated("/dashboard");

  return (
    <AuthCard title="Register">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}

