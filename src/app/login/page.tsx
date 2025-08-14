'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Lock, Mail, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (email === 'grupoarmandogomes@gmail.com' && password === '@252980Hol') {
      setTimeout(() => {
        setIsLoading(false)
        router.push('/dashboard')
      }, 1000)
    } else {
      setIsLoading(false)
      setError('Credenciais inválidas. Verifique seu email e senha.')
    }
  }

  return (
    <div className="min-h-screen holding-gradient flex items-center justify-center p-4">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-holding-highlight/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-holding-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-holding-highlight/5 rounded-full blur-3xl"></div>
      </div>

      {/* Card de Login */}
      <Card className="w-full max-w-md glass-effect border-holding-highlight/30 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-holding-highlight rounded-2xl flex items-center justify-center neon-glow">
              <Building2 className="w-8 h-8 text-holding-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-holding-white">
              Holding Promotora
            </CardTitle>
            <CardDescription className="text-holding-accent-light">
              Sistema de Crédito Consignado
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-holding-white">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-holding-accent-light" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-holding-accent/20 border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light focus:border-holding-highlight focus:ring-holding-highlight/20"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-holding-white">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-holding-accent-light" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-holding-accent/20 border-holding-accent/30 text-holding-white placeholder:text-holding-accent-light focus:border-holding-highlight focus:ring-holding-highlight/20"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-holding-accent/20 text-holding-accent-light hover:text-holding-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full button-primary neon-glow"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-holding-white/30 border-t-holding-white rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-holding-accent-light text-sm">
              Acesso restrito aos usuários autorizados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
