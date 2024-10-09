import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';
import moment from 'moment';

// Importing the Task interface
import { Task } from '@/utils/type'; // Adjust the path according to your structure

const { Option } = Select;

interface UpdateTaskPageProps {
    visible: boolean;
    task: Task | null; // Ensure task matches the updated interface
    onCancel: () => void;
    onTaskUpdated: (updatedTask: Task) => void; // Ensure this takes the updated Task
}

const UpdateTaskPage: React.FC<UpdateTaskPageProps> = ({ visible, task, onCancel, onTaskUpdated }) => {
    const [form] = Form.useForm();
    const [areas, setAreas] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
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
    }, []);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const updatedTask: Task = { 
                ...task!,
                ...values,
                dueDate: values.dueDate ? values.dueDate.toISOString() : null, // Convert to ISO format
                // Include additional properties as needed
            };
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Token not found in localStorage');
            }

            const response = await axios.put(
                `${DOMAIN}/tasks/updateTask/${updatedTask.id}`,
                updatedTask,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                onTaskUpdated(updatedTask); // Ensure this calls with the correct updatedTask
                form.resetFields();
            } else {
                console.error('Failed to update task:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            title="Update Task"
            okText="Update"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={handleOk}
        >
            <Form form={form} initialValues={task ? { ...task, dueDate: task.dueDate ? moment(task.dueDate) : null } : undefined}>
                <Form.Item
                    name="TaskTitle"
                    label="Task Title"
                    rules={[{ required: true, message: 'Please enter the task title' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="area"
                    label="Region"
                    rules={[{ required: true, message: 'Please select the region' }]}
                >
                    <Select placeholder="Select Region">
                        {areas.map(area => (
                            <Option key={area.value} value={area.value}>
                                {area.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select the task status' }]}
                >
                    <Select placeholder="Select Status">
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Failed">Failed</Option>
                        <Option value="Done">Done</Option>
                        <Option value="Complete">Complete</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="dueDate"
                    label="Due Date"
                    rules={[{ required: true, message: 'Please select the due date' }]}
                >
                    <DatePicker />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateTaskPage;
