"use client";

import { useAuth, SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/launch-control");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-text-secondary">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <SignIn
        routing="hash"
        afterSignInUrl="/launch-control"
      />
    </div>
  );
}
