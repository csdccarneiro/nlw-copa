import { useState } from "react"
import { Heading, useToast, VStack } from "native-base"
import { useNavigation } from "@react-navigation/native"
import { Header } from "../components/Header"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { api } from "../services/api"

export default function Find() {

    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState('')

    const toast = useToast();

    const navigation = useNavigation();

    function showMessage(title: string, bgColor: string) {

        toast.show({ title, placement: 'top', bgColor })

    }

    async function handleJoinPool() {

        try {

            setIsLoading(true)        

            if(!code.trim()) {

                return showMessage('Informe um código', 'red.500')

            }

            await api.post('/pools/join', { code })

            showMessage('Você entrou no bolão com sucesso', 'green.500')

            navigation.navigate('pools')
                

        } catch (error) {
            
            console.log(error)

            setIsLoading(false)

            if (error.response?.data?.message) {

                return showMessage(error.response.data.message, 'red.500')

            }

            showMessage('Não foi possível encontrar o bolão', 'red.500')

        } 

    }

    return (
        <VStack flex={1} bgColor={"gray.900"}>
            <Header title={"Buscar por código"} showBackButton />
            <VStack mt={8} mx={5} alignItems={"center"}>
                <Heading fontFamily={"heading"} color={"white"} fontSize={"xl"} mb={8} textAlign={"center"}>
                    Encontrar um bolão através de {'\n'} seu código único
                </Heading>

                <Input mb={2} placeholder={"Qual o código do bolão?"} onChangeText={setCode} autoCapitalize={'characters'} />

                <Button title={"Buscar bolão"} mt={4} isLoading={isLoading} onPress={handleJoinPool} />

            </VStack>
        </VStack>
    )

}