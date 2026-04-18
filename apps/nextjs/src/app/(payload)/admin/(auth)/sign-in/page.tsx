import { SignInForm } from "@/components/auth/sign-in-form";

// Force dynamic rendering - no static generation
export const dynamic = "force-dynamic";

export default function SignInPage() {
  return <SignInForm callbackURL="/admin" />;
}
