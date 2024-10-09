"use client";
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { DOMAIN } from '@/utils/constants';  // Calling the DOMAIN
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ButtonSpinner from '@/components/ButtonSpinner';

const RegisterForm = () => {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const formSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName || !name || !password || !phoneNumber) {
            toast.error("Please fill in all the fields");
            return;
        }

        try {
            setLoading(true);
            // Using the dynamic DOMAIN
            const response = await axios.post(`${DOMAIN}/auth/register`, { name, userName, password, phoneNumber });
            
            // Storing the token in localStorage
            localStorage.setItem('token', response.data.token);

            toast.success("Registration successful!");
            window.location.replace('/');
            router.refresh();
        } catch (error) {
            const axiosError = error as AxiosError;
            toast.error("Something went wrong, please try again");
            console.error(axiosError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md bg-gray-100 p-4 mx-auto my-8 rounded-lg text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">New Registration</CardTitle>
                <CardDescription className="text-lg">
                    Enter your details to create a new account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form onSubmit={formSubmitHandler} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-lg">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-lg">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phoneNumber" className="text-lg">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            type="text"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-lg">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        />
                    </div>
                    <CardFooter className="mt-4">
                        <Button
                            type="submit"
                            className="w-full py-2 px-6 text-lg font-bold rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? <ButtonSpinner /> : "Register"}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}

export default RegisterForm;
