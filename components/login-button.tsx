"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export function LoginButton() {
  const router = useRouter();

  const switchToDoctor = () => {
    window.location.href = "/doctors/dashboard";
  };

  const switchToPatient = () => {
    window.location.href = "/patients/dashboard";
  };

  const goToLandingPage = () => {
    window.location.href = "/";
  };

  const goToLoginForm = () => {
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full object-cover"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={switchToDoctor}>
          Doctor
        </DropdownMenuItem>
        <DropdownMenuItem onClick={switchToPatient}>
          Patient
        </DropdownMenuItem>
        <DropdownMenuItem onClick={goToLandingPage}>
          Landing Page
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={goToLoginForm}>
          Login
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}