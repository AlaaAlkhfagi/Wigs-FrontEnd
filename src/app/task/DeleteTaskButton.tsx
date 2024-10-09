import React from 'react';
import { Button, Modal } from 'antd';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';

interface DeleteTaskButtonProps {
    taskId: string;
    onTaskDeleted: (taskId: string) => void;
}

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({ taskId, onTaskDeleted }) => {
    const handleDelete = async () => {
        Modal.confirm({
            title: 'Are you sure you want to delete this task?',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error("Token not found in localStorage");
                    }

                    console.log(`Deleting task with ID: ${taskId}`);
                    
                    const response = await axios.delete(`${DOMAIN}/tasks/deleteTask/${taskId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    console.log('Response:', response);

                    if (response.data.success) {
                        onTaskDeleted(taskId);
                    } else {
                        throw new Error(response.data.message);
                    }
                } catch (error) {
                    console.error("Error deleting task:");
                    Modal.error({
                        title: 'Deletion Failed',
                        content: 'There was an issue deleting the task. Please try again later.',
                    });
                }
            },
        });
    };

    return (
        <Button type="link" danger onClick={handleDelete}>
            Delete
        </Button>
    );
};

export default DeleteTaskButton;
