"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';  // Importing DOMAIN
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

function LoginForm() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const formSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form fields
        if (!userName || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            // Using DOMAIN instead of a fixed URL
            const response = await axios.post(`${DOMAIN}/auth/login`, { userName, password });
            
            // Handle successful login
            const token = response.data.token; // Assuming the API response returns a token
            localStorage.setItem('token', token); // Save token to localStorage
            
            // Navigate to home page or any other route
            window.location.replace('/');
            // router.replace('/');
            router.refresh();
        
        } catch (error: any) {
            // Handle API error
            toast.error(error?.response?.data?.message || "Something went wrong, please try again");
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md bg-gray-100 p-4 mx-auto my-8 rounded-lg text-center">
            <CardHeader>
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription className="text-lg">
                    Enter your username and password to log into your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form onSubmit={formSubmitHandler} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="userName" className="text-lg">Username</Label>
                        <Input
                            id="userName"
                            type="text" 
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
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
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full py-2 px-6 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? <ButtonSpinner /> : "Login"}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}

export default LoginForm;
