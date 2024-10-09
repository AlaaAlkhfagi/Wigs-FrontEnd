import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';
import { User } from '@/utils/type';
import { Table, Space, Button, notification, Input, Alert, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import NewUserDialog from './NewUserDialog';
import DeleteTaskButton from './DeleteUserButton';
import ChangePasswordDialog from './ChangePassword';
import { saveAs } from 'file-saver'; // For saving the file
import * as XLSX from 'xlsx'; // For generating Excel file

const UsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Token not found in localStorage");
                }

                const response = await axios.get(`${DOMAIN}/users/getallusers`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data && response.data.success) {
                    setUsers(response.data.data as User[]);
                } else {
                    throw new Error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter users based on the search text
        const lowercasedSearchText = searchText.toLowerCase();
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(lowercasedSearchText) ||
            user.email.toLowerCase().includes(lowercasedSearchText) ||
            user.area.toLowerCase().includes(lowercasedSearchText) ||
            user.phoneNumber.toLowerCase().includes(lowercasedSearchText)
        );
        setFilteredUsers(filtered);
    }, [searchText, users]);

    const handleOpenChangePasswordDialog = (user: User) => {
        setSelectedUser(user);
        setIsDialogVisible(true);
    };

    const handleCloseChangePasswordDialog = () => {
        setIsDialogVisible(false);
        setSelectedUser(null);
    };

    const handlePasswordChanged = () => {
        notification.success({
            message: 'Success',
            description: 'Password has been changed successfully.',
        });
        handleCloseChangePasswordDialog();
    };

    const columns: ColumnsType<User> = [
        {
            title: 'ID',
            dataIndex: 'uid',
            key: 'uid',
            render: (_text, record, index) => index + 1,
            sorter: (a, b) => (a.uid && b.uid ? a.uid.localeCompare(b.uid) : 0),
            defaultSortOrder: 'ascend',
            width: '5%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
        },
        {
            title: 'Area',
            dataIndex: 'area',
            key: 'area',
            filters: [
                { text: 'Unknown', value: '' },
                { text: 'Baghdad-Karkh', value: 'Baghdad-Karkh' },
                { text: 'Baghdad-Rusafa', value: 'Baghdad-Rusafa' },
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
            ],
            onFilter: (value, record) => record.area.includes(value as string),
            filterSearch: true,
            width: '20%',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '15%',
        },
        {
            title: 'Creation Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => {
                if (a.createdAt && a.createdAt._seconds && b.createdAt && b.createdAt._seconds) {
                    return a.createdAt._seconds - b.createdAt._seconds;
                }
                return 0;
            },
            render: (text, record) => {
                if (record.createdAt && record.createdAt._seconds) {
                    return new Date(record.createdAt._seconds * 1000).toLocaleString();
                }
                return 'N/A';
            },
            defaultSortOrder: 'ascend',
            width: '15%',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleOpenChangePasswordDialog(record)}>
                        Change Password
                    </Button>
                    <DeleteTaskButton UserId={record.uid} />
                </Space>
            ),
            width: '10%',
        },
    ];

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
        const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "User");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "users_data.xlsx");
    };


    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Clients List</h1>
            <NewUserDialog />
            {selectedUser && (
                <ChangePasswordDialog
                    visible={isDialogVisible}
                    onCancel={handleCloseChangePasswordDialog}
                    onPasswordChanged={handlePasswordChanged}
                    userId={selectedUser.uid}
                />
            )}
                        <Button onClick={exportToExcel} type="primary" style={{ marginLeft: 10 }}>
    Export to Excel
  </Button>
            <div className="mb-4">
                <Input
                    placeholder="Search by name, email, area, or phone number"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <Table columns={columns} dataSource={filteredUsers} rowKey="uid" />
            </div>
            {filteredUsers.length === 0 && <p className="text-center mt-4">No users to display.</p>}
        </div>
    );
};

export default UsersTable;
