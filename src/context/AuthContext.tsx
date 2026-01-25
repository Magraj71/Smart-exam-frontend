"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "teacher" | "student" | "parent" | null;

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  role: Role;
  user: User | null;
  login: (role: Role, userData?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = (userRole: Role, userData?: User) => {
    setRole(userRole);
    
    // यदि userData दिया गया है तो उसे सेट करें, नहीं तो डिफॉल्ट बनाएं
    if (userData) {
      setUser(userData);
    } else {
      // डिफॉल्ट user डेटा
      const defaultUsers: Record<string, User> = {
        admin: {
          id: "1",
          name: "Administrator",
          email: "admin@smartexam.com"
        },
        teacher: {
          id: "2",
          name: "Teacher Name",
          email: "teacher@school.edu"
        },
        student: {
          id: "3",
          name: "Student Name",
          email: "student@school.edu"
        },
        parent: {
          id: "4",
          name: "Parent Name",
          email: "parent@email.com"
        }
      };
      
      setUser(defaultUsers[userRole as string] || {
        id: "0",
        name: "User",
        email: "user@example.com"
      });
    }
    
    router.push("/dashboard");
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};