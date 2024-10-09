import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ButtonSpinner from '@/components/ButtonSpinner';
import { DOMAIN } from '@/utils/constants'; // Assuming you have constants defined

const CreateUserForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
    const [name, setName] = useState("");
    const [area, setArea] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const governorates = [
        { value: '', label: 'Unknown' },
        { value: 'Baghdad-Karkh', label: 'Baghdad-Karkh' },
        { value: 'Baghdad-Rusafa', label: 'Baghdad-Rusafa' },
        { value: 'Karbala', label: 'Karbala' },
        { value: 'Wasit', label: 'Wasit' },
        { value: 'Babel', label: 'Babel' },
        { value: 'Basra', label: 'Basra' },
        { value: 'Erbil', label: 'Erbil' },
        { value: 'Dohuk', label: 'Dohuk' },
        { value: 'Sulaimania', label: 'Sulaimania' },
        { value: 'Dhi-Qar', label: 'Dhi-Qar' },
        { value: 'Najaf', label: 'Najaf' },
        { value: 'Semawa', label: 'Semawa' },
        { value: 'Anbar', label: 'Anbar' },
        { value: 'Mosel', label: 'Mosel' },
        { value: 'Salah-Aldeen', label: 'Salah-Aldeen' },
        { value: 'Qadisia', label: 'Qadisia' },
        { value: 'Kirkuk', label: 'Kirkuk' },
        { value: 'Diala', label: 'Diala' },
        { value: 'Missan', label: 'Missan' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found in localStorage");
            }

            // Make API request with token in headers
            const response = await axios.post(`${DOMAIN}/users/createUser`, {
                email,
                password,
                name,
                area,
                phoneNumber
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Handle successful user creation
            console.log('User created:', response.data);
            toast.success('User created successfully');

            // Reset form fields
            setEmail("");
            setPassword("");
            setConfirmPassword(""); // Clear confirm password field
            setName("");
            setArea("");
            setPhoneNumber("");

            // Set submitted to true
            setSubmitted(true);

        } catch (error: any) {
            // Handle API error
            if (error.response && error.response.status === 400 && error.response.data.error === "Error in user creating: The email address is already in use by another account.") {
                toast.error("This email address is already in use");
            } else {
                toast.error("An error occurred, please try again");
            }
            console.error('Error creating user:', error);
        } finally {
            setLoading(false);
        }
    };

    // Display success message if submitted is true
    if (submitted) {
        return (
            <Card className="w-full max-w-md bg-gray-100 p-4 mx-auto my-8 rounded-lg text-center">
                <CardHeader>
                    <CardTitle className="text-xl">Account Successfully Created</CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                    <p>The user account has been created successfully!</p>
                </CardContent>
            </Card>
        );
    }

    // Otherwise, display the form
    return (
        <Card className="w-full max-w-md bg-gray-100 p-4 mx-auto my-8 rounded-lg text-center">
            <CardHeader>
                <CardTitle className="text-xl">Create a New Account</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-lg">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-lg">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword" className="text-lg">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-lg">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="User name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="area" className="text-lg">Area</Label>
                        <select
                            id="area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required
                            className="w-full py-2 px-4 text-lg rounded-md border-gray-300"
                        >
                            <option value="" disabled>Select The Area</option>
                            {governorates.map((gov) => (
                                <option key={gov.value} value={gov.value}>{gov.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phoneNumber" className="text-lg">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            type="text"
                            placeholder="Phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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
                            {loading ? <ButtonSpinner /> : "Create Account"}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateUserForm;
