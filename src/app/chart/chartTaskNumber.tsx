"use client";

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import axios from 'axios';
import { Card, Row, Col, Spin, Alert, DatePicker, Space } from 'antd';
import 'antd/dist/reset.css'; // تأكد من استيراد أنماط Ant Design
import dayjs from 'dayjs'; // للتعامل مع التواريخ
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

const ChartTaskNumber: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

    const taskTypes = [
        'Sales Radiesse',
        'Sales Radiesse +',
        'Sales volume',
        'Sales Intense',
        'Sales Balance',
        'Sales Revive',
        'Collection',
        'CRM',
        'Delivery'
    ];

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

            filtered = filtered.filter(task => taskTypes.includes(task.TaskTitle));

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

    const taskTypeCounts = filteredTasks.reduce((acc, task) => {
        const taskType = task.TaskTitle;
        acc[taskType] = (acc[taskType] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const statusData = {
        labels: taskTypes,
        datasets: [
            {
                label: 'Number of Tasks by Type',
                data: taskTypes.map(type => taskTypeCounts[type] || 0),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', 
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(104, 132, 245, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(104, 132, 245, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
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
                    <Card title="Tasks by Type" bordered={false}>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Pie data={statusData} />
                        </div>
                    </Card>
                </Col>
                <Col span={24} md={12}>
                    <Card title="Number of Tasks by Type" bordered={false}>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Bar
                                data={statusData}
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
                                                    const type = tooltipItem.label;
                                                    const count = tooltipItem.raw;
                                                    return [
                                                        `Task Type: ${type}`,
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

export default ChartTaskNumber;
