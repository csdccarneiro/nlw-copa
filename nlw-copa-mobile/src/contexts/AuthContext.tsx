import { createContext, ReactNode, useState, useEffect } from "react"
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { api } from '../services/api'

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
    name: string,
    avatar_url: string
}

export interface AuthContextDataProps {
    user: UserProps,
    isUserLoading: boolean,
    signIn: () => Promise<void> 
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps);


export function AuthContextProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>({} as UserProps)

    const [isUserLoading, setIsUserLoading] = useState(false) 

    const redirectURI = AuthSession.makeRedirectUri({ useProxy: true })

    const [ request, response, promptAsync ] = Google.useAuthRequest({
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: redirectURI,
        scopes: ['profile', 'email']
    })

    async function signIn() {

        try {
            
            setIsUserLoading(true)

            await promptAsync();

        } catch (error) {
            
            throw error

        }
        finally {

            setIsUserLoading(false)

        }

    }

    async function signInWithGoogle(access_token: string) {

        try {
            
            setIsUserLoading(true)

            const tokenResponse =  await api.post('/users', { access_token })

            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

            const userInfoResponse = await api.get('/users/me')

            setUser(userInfoResponse.data)

        } catch (error) {

            console.log(error)

            throw error;

        }
        finally {

            setIsUserLoading(false)

        }


    }

    useEffect(() => {

        if (response?.type === 'success' && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken)
        }

    }, [response])

    return (
        <AuthContext.Provider value={{ signIn: signIn, isUserLoading, user: user }}>
            { children }
        </AuthContext.Provider>
    )

}