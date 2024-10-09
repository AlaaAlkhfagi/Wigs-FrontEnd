"use client";

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import axios from 'axios';
import { Card, Row, Col, Spin, Alert, DatePicker, Space } from 'antd';
import 'antd/dist/reset.css'; // تأكد من استيراد الأنماط الخاصة بـ Ant Design
import dayjs from 'dayjs'; // لمساعدتك في التعامل مع التواريخ
import { DOMAIN } from '@/utils/constants';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

interface Task {
    id: string;
    TaskTitle: string;
    employeeName: string;
    supervisorName: string;
    status: string;
    createDate: { _seconds: number; _nanoseconds: number };
    updateDate: { _seconds: number; _nanoseconds: number };
}

const TaskChartStatus: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${DOMAIN}/tasks/getalltasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setTasks(response.data.data);
                } else {
                    setError('Failed to fetch tasks.');
                }
            } catch (err) {
                setError('An error occurred while fetching tasks.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            let filtered = tasks;
            if (startDate && endDate) {
                filtered = tasks.filter(task => {
                    const taskDate = new Date(task.createDate._seconds * 1000);
                    return taskDate >= startDate.toDate() && taskDate <= endDate.toDate();
                });
            }

            // فقط الحالات المحددة
            const allowedStatuses = ['In Progress', 'Failed', 'Done', 'Complete'];
            filtered = filtered.filter(task => allowedStatuses.includes(task.status));
            
            setFilteredTasks(filtered);
        }
    }, [tasks, startDate, endDate]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }
    
    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Alert message={error} type="error" style={{ width: '80%' }} />
            </div>
        );
    }
    
    if (!tasks || tasks.length === 0) return <Alert message="No tasks available to display." type="info" />;

    const statusCounts = filteredTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const statusData = {
        labels: ['In Progress', 'Failed', 'Done', 'Complete'],
        datasets: [
            {
                label: 'Tasks by Status',
                data: ['In Progress', 'Failed', 'Done', 'Complete'].map(status => statusCounts[status] || 0),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', // In Progress
                    'rgba(255, 99, 132, 0.2)', // Failed
                    'rgba(255, 159, 64, 0.2)', // Done
                    'rgba(153, 102, 255, 0.2)', // Complete
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', // In Progress
                    'rgba(255, 99, 132, 1)', // Failed
                    'rgba(255, 159, 64, 1)', // Done
                    'rgba(153, 102, 255, 1)', // Complete
                ],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: ['In Progress', 'Failed', 'Done', 'Complete'],
        datasets: [
            {
                label: 'Number of Tasks by Status',
                data: ['In Progress', 'Failed', 'Done', 'Complete'].map(status => statusCounts[status] || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" style={{ marginBottom: '20px' }}>
                <DatePicker
                    placeholder="Start Date"
                    onChange={date => setStartDate(date)}
                    value={startDate}
                />
                <DatePicker
                    placeholder="End Date"
                    onChange={date => setEndDate(date)}
                    value={endDate}
                />
            </Space>

            <Row gutter={16}>
                <Col span={24} md={12}>
                    <Card title="Tasks by Status" bordered={false}>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Pie data={statusData} />
                        </div>
                    </Card>
                </Col>
                <Col span={24} md={12}>
                    <Card title="Number of Tasks by Status" bordered={false}>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Bar
                                data={barData}
                                options={{
                                    indexAxis: 'x',
                                    elements: {
                                        bar: {
                                            borderWidth: 2,
                                        },
                                    },
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                    const status = tooltipItem.label;
                                                    const count = tooltipItem.raw;
                                                    return [
                                                        `Status: ${status}`,
                                                        `Number of Tasks: ${count}`,
                                                    ];
                                                },
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TaskChartStatus;
