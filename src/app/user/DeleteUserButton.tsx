"use client";

import { Button } from "@/components/ui/button";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface DeleteTaskButtonProps {
    UserId: string;
}

const DeleteTaskButton = ({ UserId }: DeleteTaskButtonProps) => {
    const router = useRouter();

    const deleteUserHandler = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found in localStorage");
            }
            if (confirm("Are you sure you want to delete this user?")) {
                await axios.delete(`${DOMAIN}/users/deleteUser/${UserId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                window.location.reload();
                toast.success("User deleted successfully");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred while deleting the user");
            console.log(error);
        }
    }

    return (
        <Button onClick={deleteUserHandler} variant="outline" style={{ marginRight: "5px" }}>
          Delete
        </Button>
    )
}

export default DeleteTaskButton;
