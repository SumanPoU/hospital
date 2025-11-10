import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { generateToken, generateRefreshToken } from "@/lib/jwt"

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const options = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${baseUrl}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials),
                    })

                    const data = await res.json()

                    if (!res.ok || !data.user) {
                        throw new Error(data?.error || "Invalid credentials")
                    }

                    return {
                        ...data.user,
                        accessToken: data.tokens.accessToken,
                        refreshToken: data.tokens.refreshToken,
                    }
                } catch (error) {
                    console.error("❌ Error in credentials authorize:", error)
                    throw new Error(error.message)
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    pages: {
        signIn: "/auth",
    },

    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (account && profile) {
                const providerId = profile.sub || profile.id
                const email = profile.email
                const name = profile.name || "User"
                const avatar = profile.picture
                const provider = account.provider

                try {
                    const loginRes = await fetch(`${baseUrl}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, providerId, provider }),
                    })

                    let userData
                    let tokens

                    if (loginRes.ok) {
                        const data = await loginRes.json()
                        userData = data.user
                        tokens = data.tokens
                    } else {
                        const registerRes = await fetch(`${baseUrl}/user/register`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name,
                                email,
                                password: "",
                                avatar,
                                role: "USER",
                                provider,
                                providerId,
                            }),
                        })

                        const regData = await registerRes.json()
                        userData = regData.user

                        if (userData) {
                            const accessTokenPayload = {
                                id: userData.id,
                                email: userData.email,
                                role: userData.role,
                                name: userData.name,
                            }

                            const refreshTokenPayload = {
                                id: userData.id,
                            }

                            tokens = {
                                accessToken: generateToken(accessTokenPayload),
                                refreshToken: generateRefreshToken(refreshTokenPayload),
                            }
                        }
                    }

                    if (userData && tokens) {
                        token.id = userData.id
                        token.name = userData.name
                        token.email = userData.email
                        token.role = userData.role
                        token.avatar = userData.avatar
                        token.accessToken = tokens.accessToken
                        token.refreshToken = tokens.refreshToken
                    }
                } catch (err) {
                    console.error("❌ OAuth error:", err)
                }
            }

            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.role = user.role
                token.avatar = user.avatar
                if (user.accessToken) {
                    token.accessToken = user.accessToken
                    token.refreshToken = user.refreshToken
                }
            }

            return token
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name,
                email: token.email,
                role: token.role,
                avatar: token.avatar,
            }

            session.accessToken = token.accessToken
            session.refreshToken = token.refreshToken

            return session
        },
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
}
