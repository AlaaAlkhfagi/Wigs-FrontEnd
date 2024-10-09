"use client";

import { Button as AntButton } from 'antd'; // Import Ant Design Button
import { DOMAIN } from '@/utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

interface DeleteDoctorButtonProps {
    doctorId: string;
    onDoctorDeleted: () => void;
}

const DeleteDoctorButton = ({ doctorId, onDoctorDeleted }: DeleteDoctorButtonProps) => {

    const deleteDoctorHandler = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found in localStorage");
            }
            if (window.confirm("Do you want to delete this doctor? Are you sure?")) {
                await axios.delete(`${DOMAIN}/doctors/deleteDoctor/${doctorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                toast.success("Doctor deleted successfully");
                onDoctorDeleted();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred while deleting the doctor");
            console.log(error);
        }
    }

    return (
        <AntButton 
            onClick={deleteDoctorHandler} 
            type="default" // Use Ant Design button types
            danger // Indicates a destructive action
        >
            Delete
        </AntButton>
    );
}

export default DeleteDoctorButton;
