"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';
import { Doctor } from '@/utils/type';
import { Table, Spin, Alert, Divider, Dropdown, Button, Menu, Form, Input, Select, Row, Col, Checkbox, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import { DownOutlined } from '@ant-design/icons';
import NewDoctorDialog from './NewDoctorDialog';

import type { MenuInfo } from 'rc-menu/lib/interface';
import UpdateDoctorModal from './[id]/page';
import DeleteDoctorButton from './DeleteDoctorButton';

import { saveAs } from 'file-saver'; // For saving the file
import * as XLSX from 'xlsx'; // For generating Excel file
import UploadPage from './upload';

const { Option } = Select;

// Assuming this is in UpdateDoctorPage.tsx or a types file
export interface UpdateDoctorPageProps {
    open: boolean;
    doctor: Doctor | null;
    onCancel: () => void;
    onDoctorUpdated: (updatedDoctor: Doctor) => void;
  }

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        name: '',
        area: '',
        specialty: '',
    });
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // State for the selected doctor

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Token not found in localStorage");
                }

                const response = await axios.get(`${DOMAIN}/doctors/getDoctors`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (response.data && response.data.success) {
                    setDoctors(response.data.data as Doctor[]);
                    setCheckedList(columns.map((col) => col.key as string));
                } else {
                    throw new Error("Failed to fetch doctors");
                }
            } catch (error) {
                console.error("Error fetching doctors:", error);
                setError("Failed to fetch doctors. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const columns: ColumnsType<Doctor> = [
        { title: 'ID', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, sorter: (a, b) => a.id.localeCompare(b.id), defaultSortOrder: 'ascend', width: '5%' },
        { title: 'Doctor Name', dataIndex: 'name', key: 'name', width: '25%' },
        { title: 'Birth Date', dataIndex: 'birthday', key: 'birthday', render: (birthday) => new Date(birthday).toLocaleDateString(), width: '10%' },
        { title: 'Region', dataIndex: 'area', key: 'area', width: '10%', filters: [
            { text: 'Unknown', value: '' },
            { text: 'Baghdad - Karkh', value: 'Baghdad-Karkh' },
            { text: 'Baghdad - Rusafa', value: 'Baghdad-Rusafa' },
            { text: 'Karbala', value: 'Karbala' },
            { text: 'Wasit', value: 'Wasit' },
            { text: 'Babel', value: 'Babel' },
            { text: 'Basra', value: 'Basra' },
            { text: 'Erbil', value: 'Erbil' },
            { text: 'Dohuk', value: 'Dohuk' },
            { text: 'Sulaimania', value: 'Sulaimania' },
            { text: 'Dhi-Qar', value: 'Dhi-Qar' },
            { text: 'Najaf', value: 'Najaf' },
            { text: 'Semawa', value: 'Semawa' },
            { text: 'Anbar', value: 'Anbar' },
            { text: 'Mosel', value: 'Mosel' },
            { text: 'Salah-Aldeen', value: 'Salah-Aldeen' },
            { text: 'Qadisia', value: 'Qadisia' },
            { text: 'Kirkuk', value: 'Kirkuk' },
            { text: 'Diala', value: 'Diala' },
            { text: 'Missan', value: 'Missan' },
        ], onFilter: (value, record) => record.area.includes(value as string), filterSearch: true },
        { title: 'Specialty', dataIndex: 'specialty', key: 'specialty', width: '10%' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber', width: '10%' },
        { title: 'Email', dataIndex: 'email', key: 'email', width: '20%' },
        // { title: 'Photo', dataIndex: 'photoUrl', key: 'photoUrl', render: (photoUrl) => <img src={photoUrl} alt="Doctor" style={{ width: 50, height: 50, borderRadius: '50%' }} />, width: '10%' },
        { title: 'First Child', dataIndex: 'child1', key: 'child1', width: '10%' },
        { title: 'Second Child', dataIndex: 'child2', key: 'child2', width: '10%' },
        { title: 'Third Child', dataIndex: 'child3', key: 'child3', width: '10%' },
        { title: 'Close Friend 1', dataIndex: 'closeFriend1', key: 'closeFriend1', width: '10%' },
        { title: 'Close Friend 2', dataIndex: 'closeFriend2', key: 'closeFriend2', width: '10%' },
        { title: 'University (First)', dataIndex: 'university1', key: 'university1', width: '15%' },
        { title: 'University (Second)', dataIndex: 'university2', key: 'university2', width: '15%' },
        { title: 'Wife', dataIndex: 'wife', key: 'wife', width: '10%' },
        {
            title: 'Actions',
            key: 'actions',
            width: '15%', // Increased width to fit both buttons
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button onClick={() => handleEdit(record)}>Edit</Button>
                    <DeleteDoctorButton
                        doctorId={record.id}
                        onDoctorDeleted={() => {
                            setDoctors((prevDoctors) =>
                                prevDoctors.filter((doc) => doc.id !== record.id)
                            );
                        }}
                    />
                </div>
            ),
        },
        
    ];

    const options = columns.map(({ key, title }) => ({
        label: title as React.ReactNode,
        value: key as string,
    }));

    const handleMenuClick = ({ key }: MenuInfo) => {
        setCheckedList((prevList) => {
            if (prevList.includes(key)) {
                return prevList.filter((item) => item !== key);
            } else {
                return [...prevList, key];
            }
        });
    };

    const handleFilterChange = (changedFilters: Partial<typeof filters>) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...changedFilters
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            name: '',
            area: '',
            specialty: '',
        });
    };

    const handleEdit = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setModalVisible(true);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setSelectedDoctor(null);
    };

    const handleDoctorUpdated = (updatedDoctor: Doctor) => {
        setDoctors((prevDoctors) =>
            prevDoctors.map((doc) => (doc.id === updatedDoctor.id ? updatedDoctor : doc))
        );
        handleModalCancel();
    };

    const filteredDoctors = doctors.filter((doctor) => {
        return (
            (filters.name ? doctor.name.includes(filters.name) : true) &&
            (filters.area ? doctor.area.includes(filters.area) : true) &&
            (filters.specialty ? doctor.specialty.includes(filters.specialty) : true)
        );
    });

    const menu = (
        <Menu
            selectedKeys={checkedList}
            onClick={handleMenuClick}
        >
            {options.map(option => (
                <Menu.Item key={option.value}>
                    <Checkbox checked={checkedList.includes(option.value)}>
                        {option.label}
                    </Checkbox>
                </Menu.Item>
            ))}
        </Menu>
    );

    const newColumns = columns.filter((column) => checkedList.includes(column.key as string));
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
    

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredDoctors);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Doctors");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "doctors_data.xlsx");
    };

    

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Doctors List</h1>
            <Divider>Actions</Divider>
            <Row justify="space-between" align="middle">
                <Col>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button>
                            Select Columns <DownOutlined />
                        </Button>
                    </Dropdown>
                </Col>
                <Col>
                    <NewDoctorDialog />
                </Col>
                <Col>
                <UploadPage/>

                </Col>
            </Row>
            
            <Button onClick={handleResetFilters}>Reset Filters</Button>
                    <Button onClick={exportToExcel} type="primary" style={{ marginLeft: 10 }}>
                        Export to Excel
                    </Button>

                    

            <Divider>Filters</Divider>
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item label="Doctor Name">
                            <Input
                                value={filters.name}
                                onChange={(e) => handleFilterChange({ name: e.target.value })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Region">
                            <Select
                                value={filters.area}
                                onChange={(value) => handleFilterChange({ area: value })}
                            >
                                <Option value="">All</Option>
                                <Option value="Baghdad-Karkh">Baghdad - Karkh</Option>
                                <Option value="Baghdad-Rusafa">Baghdad - Rusafa</Option>
                                <Option value="Karbala">Karbala</Option>
                                <Option value="Wasit">Wasit</Option>
                                <Option value="Babel">Babel</Option>
                                <Option value="Basra">Basra</Option>
                                <Option value="Erbil">Erbil</Option>
                                <Option value="Dohuk">Dohuk</Option>
                                <Option value="Sulaimania">Sulaimania</Option>
                                <Option value="Dhi-Qar">Dhi-Qar</Option>
                                <Option value="Najaf">Najaf</Option>
                                <Option value="Semawa">Semawa</Option>
                                <Option value="Anbar">Anbar</Option>
                                <Option value="Mosel">Mosel</Option>
                                <Option value="Salah-Aldeen">Salah-Aldeen</Option>
                                <Option value="Qadisia">Qadisia</Option>
                                <Option value="Kirkuk">Kirkuk</Option>
                                <Option value="Diala">Diala</Option>
                                <Option value="Missan">Missan</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Specialty">
                            <Input
                                value={filters.specialty}
                                onChange={(e) => handleFilterChange({ specialty: e.target.value })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                        <Button type="default" onClick={handleResetFilters}>
                            Reset Filters
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table columns={newColumns} dataSource={filteredDoctors} rowKey="id" />
            {/* <UpdateDoctorModal
    visible={modalVisible}  // استبدل visible بـ open
    doctor={selectedDoctor}
    onCancel={handleModalCancel}
    onDoctorUpdated={handleDoctorUpdated}
/> */}


        </div>
    );
};

export default DoctorsPage;
