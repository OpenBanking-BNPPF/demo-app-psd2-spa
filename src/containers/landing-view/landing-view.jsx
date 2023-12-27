import React,{useState,useEffect} from 'react'

import { authService } from "../../services/auth/auth-service"
import Spinner from "../../components/spinner/spinner"
import { useNavigate, useSearchParams } from 'react-router-dom'

const LandingView = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const authorizationCode = searchParams.get('code')
        authService.getToken(authorizationCode).subscribe(
            () => {
                setIsLoading(false)
                navigate('/accounts')
            }
        )
    }, [])

    return isLoading && <Spinner text="Requesting Token..."/>
}

export default LandingView