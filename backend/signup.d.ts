
import type { User } from "firebase/auth";

export type SignUpInput = {
  fullName: string;
  email: string;
  password: string;
  role?: "student" | "employer";
  termsAccepted: boolean;
};

export function signUpUser(input: SignUpInput): Promise<User>;
