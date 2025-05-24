"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  onClose: () => void
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        await signIn(email, password)
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
      } else {
        await signUp(email, password, displayName)
        toast({
          title: "Account created!",
          description: "Welcome to GitHub Auto Committer!",
        })
      }
      onClose()
    } catch (error: any) {
      setError(error.message)
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white border-4 border-red-500">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/devil-logo.png" alt="GitHub Auto Committer" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-black text-black">{isLogin ? "SIGN IN" : "CREATE ACCOUNT"}</CardTitle>
          <CardDescription className="text-black font-bold">
            {isLogin
              ? "Access your automation dashboard and saved configurations"
              : "Join the dark side and start automating your GitHub commits"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="bg-red-500 text-white border-2 border-red-500">
              <AlertDescription className="text-white font-bold">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-black font-black">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                  className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-black">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent text-red-500 hover:text-red-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black text-lg py-3"
              >
                {loading ? (
                  "Processing..."
                ) : isLogin ? (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    SIGN IN
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    CREATE ACCOUNT
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="w-full text-black hover:bg-gray-100 font-bold"
              >
                Continue without account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
