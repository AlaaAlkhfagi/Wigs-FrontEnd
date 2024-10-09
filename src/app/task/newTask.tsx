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
    const [body, setBody] = useState<string>("");
    const [area, setArea] = useState<string | null>(null);
    const [status, setStatus] = useState<string>(""); 
    const [dueDate, setDueDate] = useState<string>("");  // New state for due date
    const [loading, setLoading] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState<'initial' | 'loading' | 'success' | 'error'>('initial');
    const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
    const [users, setUsers] = useState<{ uid: string; name: string }[]>([]);
    const [areas, setAreas] = useState<{ value: string; label: string }[]>([]);
    const [statusOptions] = useState([
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Failed', label: 'Failed' },
        { value: 'Done', label: 'Done' },
        { value: 'Complete', label: 'Complete' }
    ]);

    const taskTitleOptions = [
        { value: 'Sales Radiesse', label: 'Sales Radiesse' },
        { value: 'Sales Radiesse +', label: 'Sales Radiesse +' },
        { value: 'Sales volume', label: 'Sales volume' },
        { value: 'Sales Intense', label: 'Sales Intense' },
        { value: 'Sales Balance', label: 'Sales Balance' },
        { value: 'Sales Revive', label: 'Sales Revive' },
        { value: 'Collection', label: 'Collection' },
        { value: 'CRM', label: 'CRM' },
        { value: 'Delivery', label: 'Delivery' },
    ];

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
    
        // Validate fields
        if (!taskTitle) {
            toast.error('Task Title is required');
            return;
        }
        if (!employeeID) {
            toast.error('Employee Name is required');
            return;
        }
        if (!supervisorName) {
            toast.error('Supervisor Name is required');
            return;
        }
        if (!area) {
            toast.error('Area is required');
            return;
        }
        if (!body) {
            toast.error('Task Description is required');
            return;
        }
        if (!dueDate) {
            toast.error('Due Date is required');
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
                area: area,
                dueDate: dueDate // Include due date in request
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            toast.success('Task created successfully');
    
            // Reset form
            setTaskTitle("");
            setEmployeeID("");
            setBody("");
            setSupervisorName("");
            setArea(null);
            setStatus(""); 
            setDueDate(""); 
            setFormStatus('success');
    
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
    
    const userOptions = users.map(user => ({
        value: user.uid,
        label: user.name
    }));

    const doctorOptions = doctors.map(doctor => ({
        value: doctor.id,
        label: doctor.name
    }));

    const areaOptions = areas;

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
                            <Select
                                id="taskTitle"
                                options={taskTitleOptions}
                                onChange={(selectedOption) => setTaskTitle(selectedOption?.value || "")}
                                placeholder="Select Task Title"
                                className="w-full mt-1"
                                value={taskTitleOptions.find(option => option.value === taskTitle) || null}
                            />
                        </div>
                        <div>
                            <Label htmlFor="body">Task Description</Label>
                            <Input
                                id="body"
                                type="text"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Enter Task Description"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="employeeID">Employee Name</Label>
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
                            <Label htmlFor="supervisorName">Supervisor Name</Label>
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
                            <Label htmlFor="area">Area</Label>
                            <Select
                                id="area"
                                options={areaOptions}
                                onChange={(selectedOption) => setArea(selectedOption?.value || "")}
                                placeholder="Select Area"
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
                        <div>
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                placeholder="Select Due Date"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? <ButtonSpinner /> : "Create Task"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-gray-500 text-sm">Fill all required fields to create a task.</p>
                </CardFooter>
            </Card>
        )
    );
};

export default CreateTaskForm;
