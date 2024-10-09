"use client";

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import axios from 'axios';
import { Card, Row, Col, Spin, Alert } from 'antd';
import 'antd/dist/reset.css'; // تأكد من استيراد الأنماط الخاصة بـ Ant Design
import { DOMAIN } from '@/utils/constants';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export interface Doctor {
    id: string;
    birthday: string;
    area: string;
    specialty: string;
    wife: string;
    child1: string;
    child2: string;
    child3: string;
    university1: string;
    university2: string;
    photoUrl: string | null;
    closeFriend1: string;
    closeFriend2: string;
    phoneNumber: string;
    email: string;
    name: string;
}

const DoctorChartArea: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${DOMAIN}/doctors/getDoctors`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    console.log('Fetched doctors data:', response.data.data);
                    setDoctors(response.data.data);
                } else {
                    setError('Failed to fetch doctors.');
                }
            } catch (err) {
                setError('An error occurred while fetching doctors.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
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
    
    if (!doctors || doctors.length === 0) return <Alert message="No doctors available to display." type="info" />;

    // عدد الأطباء في كل منطقة
    const areaCounts = doctors.reduce((acc, doctor) => {
        acc[doctor.area] = (acc[doctor.area] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    // تعريف المناطق
    const areas = [
        'Baghdad-Karkh', 'Baghdad-Rusafa', 'Karbala', 'Wasit', 'Babel', 'Basra', 'Erbil',
        'Dohuk', 'Sulaimania', 'Dhi-Qar', 'Najaf', 'Semawa', 'Anbar', 'Mosel', 'Salah-Aldeen',
        'Qadisia', 'Kirkuk', 'Diala', 'Missan'
    ];

    // البيانات للمخطط
    const areaData = {
        labels: areas,
        datasets: [
            {
                label: 'Number of Doctors by Area',
                data: areas.map(area => areaCounts[area] || 0),
                backgroundColor: areas.map((_, index) =>
                    `rgba(${[75, 255, 255, 153, 255, 54, 75, 255, 255, 153, 255, 54][index % 12]}, ${[192, 99, 159, 102, 205, 162, 192, 99, 159, 102, 205, 162][index % 12]}, ${[192, 132, 64, 255, 86, 235, 192, 132, 64, 255, 86, 235][index % 12]}, 0.2)`
                ),
                borderColor: areas.map((_, index) =>
                    `rgba(${[75, 255, 255, 153, 255, 54, 75, 255, 255, 153, 255, 54][index % 12]}, ${[192, 99, 159, 102, 205, 162, 192, 99, 159, 102, 205, 162][index % 12]}, ${[192, 132, 64, 255, 86, 235, 192, 132, 64, 255, 86, 235][index % 12]}, 1)`
                ),
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ padding: '16px' }}>
            <Row gutter={24}>
                <Col span={24} md={12}>
                    <Card title="Doctors by Area" bordered={false}>
                        <div style={{ height: '350px', position: 'relative' }}>
                            <Pie data={areaData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            }} />
                        </div>
                    </Card>
                </Col>
                <Col span={24} md={12}>
                    <Card title="Number of Doctors by Area" bordered={false}>
                        <div style={{ height: '350px', position: 'relative' }}>
                            <Bar
                                data={areaData}
                                options={{
                                    indexAxis: 'x',
                                    elements: {
                                        bar: {
                                            borderWidth: 2,
                                        },
                                    },
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                    const area = tooltipItem.label;
                                                    const count = tooltipItem.raw;
                                                    return [
                                                        `Area: ${area}`,
                                                        `Number of Doctors: ${count}`,
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

export default DoctorChartArea;
