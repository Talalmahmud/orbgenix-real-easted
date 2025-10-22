"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Check, X } from "lucide-react";
import Link from "next/link";
import api from "@/helpers/axios";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");

  // Check password match in real-time
  useEffect(() => {
    if (formData.password2 && formData.password) {
      setPasswordsMatch(formData.password === formData.password2);
    } else if (!formData.password2) {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.password2]);

  // Check password length in real-time
  useEffect(() => {
    if (formData.password) {
      setPasswordValid(formData.password.length >= 8);
    } else {
      setPasswordValid(null);
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate password length
    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.password2) {
      setMessage("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    // Clear previous messages
    setMessage("");

    // Simulate API call

    try {
      const res = await api.post(
        process.env.NEXT_PUBLIC_URL + "/users/register/",
        formData
      );
      const resData = await res.data;
      if (res.status === 201) {
        setMessage("User registration is success.");
        // Clear form on success
        setFormData({
          username: "",
          password: "",
          password2: "",
          first_name: "",
          last_name: "",
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setMessage("User with this email already exists.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form can be submitted
  const canSubmit =
    formData.first_name &&
    formData.last_name &&
    formData.username &&
    formData.password &&
    formData.password2 &&
    passwordValid &&
    passwordsMatch;

  return (
    <div className="flex h-screen">
      <div className="bg-blue-400 w-full"></div>
      <Card className="w-full max-w-md shadow-sm border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create account
          </CardTitle>
          <CardDescription className="text-gray-600">
            <span> Enter your information to get started</span>
            <br />
            <span
              className={`font-semibold ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label
                  htmlFor="first_name"
                  className="text-gray-700 text-sm font-medium"
                >
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border-gray-300 focus:border-black focus:ring-black h-11"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="last_name"
                  className="text-gray-700 text-sm font-medium"
                >
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border-gray-300 focus:border-black focus:ring-black h-11"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label
                htmlFor="username"
                className="text-gray-700 text-sm font-medium"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 bg-white border-gray-300 focus:border-black focus:ring-black h-11"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-gray-700 text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-12 bg-white border-gray-300 focus:border-black focus:ring-black h-11 ${
                    passwordValid === true
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                      : passwordValid === false
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />

                {/* Password length indicator */}
                {formData.password && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    {passwordValid ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Password length message */}
              {formData.password && passwordValid !== null && (
                <p
                  className={`text-xs mt-1 ${
                    passwordValid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordValid
                    ? "Password length is good!"
                    : "Password must be at least 8 characters"}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-3">
              <Label
                htmlFor="password2"
                className="text-gray-700 text-sm font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password2"
                  name="password2"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-12 bg-white border-gray-300 focus:border-black focus:ring-black h-11 ${
                    passwordsMatch === true
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                      : passwordsMatch === false
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />

                {/* Password match indicator */}
                {formData.password2 && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    {passwordsMatch ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Password match message */}
              {formData.password2 && passwordsMatch !== null && (
                <p
                  className={`text-xs mt-1 ${
                    passwordsMatch ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordsMatch
                    ? "Passwords match!"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-black hover:text-gray-700 font-medium"
                >
                  Terms and Conditions
                </a>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading || !canSubmit}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <span className="text-gray-600 text-sm">
                Already have an account?{" "}
              </span>
              <Link
                href="/"
                className="text-black hover:text-gray-700 font-medium text-sm transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
