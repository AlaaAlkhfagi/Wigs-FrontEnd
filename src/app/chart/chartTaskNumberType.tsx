"use client";

import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/charts';
import axios from 'axios';
import { Card, Row, Col, Spin, Alert, DatePicker, Space } from 'antd';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import { DOMAIN } from '@/utils/constants';

interface Task {
    id: string;
    TaskTitle: string;
    employeeName: string;
    supervisorName: string;
    status: string;
    createDate: { _seconds: number; _nanoseconds: number };
    updateDate: { _seconds: number; _nanoseconds: number };
}

const ChartTaskNumberType: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
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

    const taskStatuses = ['In Progress', 'Failed', 'Done', 'Complete'];
    const totalTasksCount = tasks.length;

    const taskCounts = taskTypes.map(taskType => {
        const counts = taskStatuses.map(status => {
            const count = tasks.filter(task => task.TaskTitle === taskType && task.status === status).length;
            return {
                status,
                count,
                percentage: totalTasksCount ? ((count / totalTasksCount) * 100).toFixed(2) : 0,
            };
        });

        const totalCount = counts.reduce((sum, { count }) => sum + count, 0);
        return {
            taskType,
            totalCount,
            taskData: counts,
        };
    });

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Task Analysis</h1>
            <Space direction="vertical" style={{ marginBottom: '20px', display: 'block', textAlign: 'center' }}>
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
                {taskCounts.map(({ taskType, totalCount, taskData }, index) => (
                    <Col span={8} key={taskType}>
                        <Card title={taskType} bordered={false} style={{ marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                            <Column
                                data={taskData}
                                xField="status"
                                yField="count"
                                label={{
                                    content: ({ count }: { count: number }) => `${count}`,
                                    style: {
                                        fill: '#fff',
                                        fontWeight: 600,
                                    },
                                }}
                                color={['status', ['#00c1de', '#ff4d4f', '#4caf50', '#ffa500']]} // ألوان واضحة
                            />
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <strong>Total Tasks: {totalCount} ({((totalCount / totalTasksCount) * 100).toFixed(2)}%)</strong>
                                <div>
                                    {taskData.map(({ status, count, percentage }) => (
                                        <div key={status}>
                                            {status}: {count} ({percentage}%)
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ChartTaskNumberType;
