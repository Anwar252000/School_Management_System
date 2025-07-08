import { useState, useEffect, useCallback } from "react";
import { ZodNullDef } from "zod";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(0);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem(userId?.toString() ? "userId" : "0");

    setIsAuthenticated(false);
    setUserName(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem(userId?.toString() ? "userId" : "0");

    if (userRole === "Teacher") {
      setIsTeacher(true);
    }

    if (userRole === "Admin") {
      setIsAdmin(true);
    }

    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
      setUserName(storedUserName); 
      setUserId(storedUserId ? parseInt(storedUserId) : 0);
    } else {
      setIsAuthenticated(false);
      setUserName(null);
    }

    setIsLoading(false);
  }, [logout]);

  return { isAuthenticated, isLoading, role,userId, userName, isTeacher, isAdmin, logout };
};

export default useAuth;
