import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const [isRegistering, setIsRegistering] = useState(false)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!captchaToken) {
            setError("Veuillez valider le captcha.")
            return
        }

        setLoading(true)
        setError(null)

        if (isRegistering) {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: { captchaToken }
            })
            if (signUpError) {
                setError(signUpError.message)
            } else {
                alert('Compte créé ! Veuillez vérifier vos emails (si email confirmation active) ou connectez-vous.')
                setIsRegistering(false)
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: { captchaToken }
            })

            if (error) {
                setError(error.message)
            } else {
                router.push('/admin/dashboard')
            }
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-6">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-border">
                <div className="flex justify-center mb-6 text-primary">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <Lock size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-display font-bold text-center text-text-primary mb-2">
                    {isRegistering ? 'Créer un compte' : 'Admin Login'}
                </h1>
                <p className="text-center text-text-secondary mb-8">
                    {isRegistering ? 'Rejoindre l\'espace administrateur' : 'Access the content management dashboard'}
                </p>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-colors"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex justify-center py-2">
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                            onSuccess={setCaptchaToken}
                            onError={() => setError("Erreur Captcha. Veuillez rafraîchir.")}
                            options={{ theme: 'light' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !captchaToken}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Traitement...' : (isRegistering ? "S'inscrire" : 'Se connecter')}
                    </button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-sm text-primary hover:underline hover:text-primary-dark font-medium"
                        >
                            {isRegistering ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer un compte'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
