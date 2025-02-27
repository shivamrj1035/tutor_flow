// shivamjayswal1003  FiyoIYZzzgXdR6dc
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "../features/apis/authApi"
import exp from "constants"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import {useLocation, useNavigate} from "react-router-dom"
import { toast } from "sonner"

const Login = () => {
    const navigate = useNavigate();
    const [registerUser, {
        data: registerData,
        error: registerError,
        isLoading: registerIsLoading,
        isSuccess: registerIsSuccess,
    }] = useRegisterUserMutation();
    const [loginUser, {
        data: loginData,
        error: loginError,
        isLoading: loginIsLoading,
        isSuccess: loginIsSuccess,
    }] = useLoginUserMutation();
    const [loginInput, setLoginInput] = useState({
        email: "",
        password: "",
    })
    const [SignupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: "",
    })
    const location = useLocation();
    const path = location.pathname.split('/').pop();

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'signup') {
            setSignupInput({ ...SignupInput, [name]: value })
        } else {
            setLoginInput({ ...loginInput, [name]: value })
        }
    }

    const handleSubmit = async (type) => {
        const inputData = type === 'signup' ? SignupInput : loginInput;
        const action = type === 'signup' ? registerUser : loginUser;
        await action(inputData);
    }

    useEffect(() => {
        if (registerIsSuccess && registerData) {
            toast.dismiss();
            toast.success(registerData.message || "Sign up successfully");
        }
        if (loginIsSuccess && loginData) {
            toast.dismiss();
            toast.success(loginData.message || "Login successfully");
            navigate("/");
        }
        if (registerError) {
            toast.dismiss();
            toast.error(registerError?.data?.message || "Signup failed");
        }
        if (loginError) {
            toast.dismiss();
            toast.error(loginError?.data?.message || "Login failed");
        }
    }, [registerIsSuccess, registerData, registerError, loginIsSuccess, loginData, loginError]);
    

    return (
        <div className="flex items-center justify-center w-full mt-20">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                    <TabsTrigger value="login">Lgin</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Create a new account and click on Sign up When you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input placeholder="eg. John" required="true" name="name" value={SignupInput.name} onChange={(e) => handleInputChange(e, 'signup')} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input placeholder="eg. john1035@gmail.com" required="true" name="email" value={SignupInput.email} onChange={(e) => handleInputChange(e, 'signup')} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input required="true" type="password" name="password" value={SignupInput.password} onChange={(e) => handleInputChange(e, 'signup')} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled= {registerIsLoading} onClick={() => handleSubmit('signup')} >
                                {
                                    registerIsLoading ?
                                    (
                                        <>
                                        <Loader2 className="mr-2 w-4 h-4"/> Please wait
                                        </>
                                    )
                                    : "Sign up"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Log in here with your credentials.
                                <br />If not having account must sign up first.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Email</Label>
                                <Input type="email" placeholder="eg. abc@gmail.com" required="true" name="email" value={loginInput.email} onChange={(e) => handleInputChange(e, 'login')} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">password</Label>
                                <Input type="password" required="true" name="password" value={loginInput.password} onChange={(e) => handleInputChange(e, 'login')} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginIsLoading} onClick={() => handleSubmit('login')} >
                                {
                                    loginIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                        </>
                                    )
                                        :
                                        "Login"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Login;