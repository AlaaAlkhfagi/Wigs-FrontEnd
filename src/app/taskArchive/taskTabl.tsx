"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button, Table, notification, Checkbox } from 'antd';
import axios from 'axios';
import { Task } from '@/utils/type';
import { DOMAIN } from '@/utils/constants';

const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const getAuthToken = () => {
        return localStorage.getItem('token') || ''; 
    };

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const authToken = getAuthToken(); 
            const response = await axios.get(`${DOMAIN}/tasks/getalltasks`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Filter tasks based on status
            const tasksData = response.data.data.filter((task: Task) => 
                task.status === 'Complete' || task.status === 'Failed'
            );

            // Set the tasks data
            setTasks(tasksData);
        } catch (error: any) {
            notification.error({ 
                message: 'Failed to fetch tasks', 
                description: error?.message || 'An error occurred'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks(); // Call the fetchTasks function when the component mounts
    }, [fetchTasks]); // Ensure fetchTasks is in the dependency array

    const handleSendToArchive = async () => {
        try {
            const authToken = getAuthToken(); 
            await axios.post(`${DOMAIN}/tasks/archiveTasks`, { taskIds: selectedRowKeys }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            notification.success({ message: 'Tasks sent to archive successfully' });
            fetchTasks();
        } catch (error: any) {
            notification.error({ 
                message: 'Failed to send tasks to archive', 
                description: error?.message || 'An error occurred'
            });
        }
    };

    const handleCheckboxChange = (selectedKeys: React.Key[]) => {
        setSelectedRowKeys(selectedKeys);
    };

    // View task details by sending request to the API and then opening a new tab
    const handleViewClick = async (taskId: string) => {
        try {
            const authToken = getAuthToken(); 
            await axios.get(`${DOMAIN}/tasks/getsingleTask/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Open a new tab with the task details
            window.open(`/task/${taskId}`, '_blank');
        } catch (error: any) {
            notification.error({ 
                message: 'Failed to fetch task details', 
                description: error?.message || 'An error occurred'
            });
        }
    };

    const columns = [
        {
            title: 'Select',
            key: 'select',
            render: (_: any, record: Task) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id)}
                    onChange={(e) => {
                        const newSelectedRowKeys = e.target.checked
                            ? [...selectedRowKeys, record.id]
                            : selectedRowKeys.filter(key => key !== record.id);
                        handleCheckboxChange(newSelectedRowKeys);
                    }}
                />
            ),
        },
        {
            title: 'Task Title',
            dataIndex: 'TaskTitle',
            key: 'TaskTitle',
            width: '20%',
            render: (_: any, record: Task) => (
                <a onClick={() => handleViewClick(record.id)}>
                    {record.TaskTitle}
                </a>
            ),
        },
        { title: 'Employee Name', dataIndex: 'employeeName', key: 'employeeName' },
        { title: 'Supervisor Name', dataIndex: 'supervisorName', key: 'supervisorName' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Area', dataIndex: 'area', key: 'area' },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Button 
                onClick={handleSendToArchive} 
                type="default" 
                disabled={selectedRowKeys.length === 0}
                style={{ marginBottom: '16px' }}
            >
                Send to Archive
            </Button>
            <Table
                columns={columns}
                dataSource={tasks}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                style={{ margin: '0 auto' }}
                rowSelection={{
                    selectedRowKeys,
                    onChange: handleCheckboxChange,
                }}
            />
        </div>
    );
};

export default TaskPage;
