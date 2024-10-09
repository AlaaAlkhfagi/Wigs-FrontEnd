"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ButtonSpinner from '@/components/ButtonSpinner';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import Select from 'react-select';

const CreateTaskForm = () => {
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [employeeID, setEmployeeID] = useState<string>("");
    const [supervisorName, setSupervisorName] = useState<string>("");
    const [body, setbody] = useState<string>("");
    const [area, setArea] = useState<string | null>(null); // Updated to handle null
    const [status, setStatus] = useState<string>(""); // Default status updated
    const [loading, setLoading] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState<'initial' | 'loading' | 'success' | 'error'>('initial');
    const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
    const [users, setUsers] = useState<{ uid: string; name: string }[]>([]);
    const [areas, setAreas] = useState<{ value: string; label: string }[]>([]);
    const [statusOptions] = useState([
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Failed', label: 'Failed' },
        { value: 'Done', label: 'Done' },
        { value: 'Expired', label: 'Expired' }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Token not found in localStorage");
                }

                const [doctorsRes, usersRes] = await Promise.all([
                    axios.get(`${DOMAIN}/doctors/getDoctors`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    }),
                    axios.get(`${DOMAIN}/users/getallusers`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                ]);

                setDoctors(doctorsRes.data.data.map((doctor: any) => ({
                    id: doctor.uid,
                    name: doctor.name || "Unknown"
                })));
                setUsers(usersRes.data.data.map((user: any) => ({
                    uid: user.uid,
                    name: user.name || "Unknown"
                })));

                setAreas([
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
                ]);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
                toast.error("Failed to fetch dropdown data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!taskTitle || !employeeID || !supervisorName || !area || !body) {
            toast.error('Task Title, Employee, Supervisor, area, and Description are required');
            return;
        }

        setFormStatus('loading');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found in localStorage");
            }

            const response = await axios.post(`${DOMAIN}/tasks/createTask`, {
                TaskTitle: taskTitle,
                employeeID: employeeID,
                supervisorName: supervisorName,
                status: status,
                body: body,
                area: area
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Task created:', response.data);
            toast.success('Task created successfully');

            // Reset form
            setTaskTitle("");
            setEmployeeID("");
            setbody("");
            setSupervisorName("");
            setArea(null); // Reset area to null
            setStatus(""); // Reset status to default empty string
            setFormStatus('success');

            // Hide the card after 3 seconds
            setTimeout(() => {
                setFormStatus('initial');
            }, 3000);
        } catch (error: any) {
            let errorMessage = 'An error occurred, please try again';

            if (error.response) {
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status) {
                    errorMessage = `Error: ${error.response.status}`;
                }
                console.error('Error details:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }

            toast.error(errorMessage);
            setFormStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // Convert data for react-select
    const userOptions = users.map(user => ({
        value: user.uid,
        label: user.name
    }));

    const doctorOptions = doctors.map(doctor => ({
        value: doctor.id,
        label: doctor.name
    }));

    const areaOptions = areas; // Use the areas state for the Select component

    return (
        formStatus === 'success' ? (
            <div className="text-center p-4">
                <Card className="p-4 shadow-md">
                    <CardContent>
                        <p className="text-green-500">Task created successfully!</p>
                    </CardContent>
                </Card>
            </div>
        ) : (
            <Card className="p-4 shadow-md">
                <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="taskTitle">Task Title</Label>
                            <Input
                                id="taskTitle"
                                type="text"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="body">Task Description</Label>
                            <Input
                                id="body"
                                type="text"
                                value={body}
                                onChange={(e) => setbody(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="employeeID">Employee</Label>
                            <Select
                                id="employeeID"
                                options={userOptions}
                                onChange={(selectedOption) => setEmployeeID(selectedOption?.value || "")}
                                placeholder="Select Employee"
                                className="w-full mt-1"
                                value={userOptions.find(option => option.value === employeeID) || null}
                            />
                        </div>
                        <div>
                            <Label htmlFor="supervisorName">Supervisor</Label>
                            <Select
                                id="supervisorName"
                                options={doctorOptions}
                                onChange={(selectedOption) => setSupervisorName(selectedOption?.label || "")}
                                placeholder="Select Supervisor"
                                className="w-full mt-1"
                                value={doctorOptions.find(option => option.label === supervisorName) || null}
                            />
                        </div>
                        <div>
                            <Label htmlFor="area">Region</Label>
                            <Select
                                id="area"
                                options={areaOptions}
                                onChange={(selectedOption) => setArea(selectedOption?.value || null)}
                                placeholder="Select a region"
                                className="w-full mt-1"
                                value={areaOptions.find(option => option.value === area) || null}
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                id="status"
                                options={statusOptions}
                                onChange={(selectedOption) => setStatus(selectedOption?.value || "")}
                                placeholder="Select Status"
                                className="w-full mt-1"
                                value={statusOptions.find(option => option.value === status) || null}
                            />
                        </div>
                        <CardFooter className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {loading ? <ButtonSpinner /> : 'Create Task'}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        )
    );
};

export default CreateTaskForm;
