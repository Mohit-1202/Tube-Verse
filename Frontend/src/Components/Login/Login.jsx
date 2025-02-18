import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Login() {
    const history = useNavigate()
    const [credentials, setCredentials] = useState({email:"", password:""})

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        const backendUrl= import.meta.env.VITE_BACKEND_URL
        e.preventDefault()
        const response = await fetch(`${backendUrl}/users/login`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            credentials:"include",
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        })
        const json = await response.json()
        console.log(json)
        if(json.success){
            history("/allvideos")
        }
        else{
            console.log("Failed")
        }
    }
  return (
    <div>
       <form onSubmit={handleSubmit}>
            <input type="text" id="email" value={credentials.email} name="email" onChange={onChange} placeholder="email" />
            <input type="text" id="password" value={credentials.password} onChange={onChange} name="password" placeholder="password" />
            <button type="submit">Login</button>
        </form> 
    </div>
  )
}