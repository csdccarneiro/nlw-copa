import { NavigationContainer } from '@react-navigation/native'
import { Box } from 'native-base'
import { userAuth } from '../hooks/useAuth'
import { SignIn } from '../screens/SignIn'
import { AppRoutes } from './app.routes'

export function Routes() {

    const { user } = userAuth()

    return (
        <Box flex={1} bg={'gray.900'}>
            <NavigationContainer>
                { user.name ? <AppRoutes /> : <SignIn  /> }
            </NavigationContainer>
        </Box>
    )

}