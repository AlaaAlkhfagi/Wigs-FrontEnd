"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';
import { Task } from '@/utils/type';
import { Table, Space, Tag, Select, DatePicker, Button, message, Alert, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import NewTaskDialog from './NewTaskDialog';
import DeleteTaskButton from './DeleteTaskButton';
import UpdateTaskPage from './[id]/page2';
import moment from 'moment';
import router from 'next/router';
import { useRouter } from 'next/navigation';
import { saveAs } from 'file-saver'; // For saving the file
import * as XLSX from 'xlsx'; // For generating Excel file
import UploadPage from './upload';
const { Option } = Select;
const { RangePicker } = DatePicker;




const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<{ uid: string; name: string }[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
    const [filterEmployee, setFilterEmployee] = useState<string | undefined>(undefined);
    const [filterSupervisor, setFilterSupervisor] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

    const router = useRouter(); // Use router for navigation
    // Fetch users data
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found in localStorage");
            }

            const response = await axios.get(`${DOMAIN}/users/getallusers`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data && response.data.success) {
                const fetchedUsers = response.data.data.map((user: any) => ({
                    uid: user.uid,
                    name: user.name || "Unknown"
                }));
                setUsers(fetchedUsers);
            } else {
                throw new Error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users. Please try again later.");
        }
    };

 // Fetch tasks data
const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Token not found in localStorage");
        }

        const response = await axios.get(`${DOMAIN}/tasks/getalltasks`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data && response.data.success) {
            const tasksData = response.data.data as Task[];
            const updatedTasks = tasksData.map(task => {
                const employee = users.find(user => user.uid === task.employeeID);
                return {
                    ...task,
                    employeeName: employee ? employee.name : 'Unknown',
                    supervisorName: task.supervisorName || 'Unknown', // Use supervisorName directly
                    dueDate: task.dueDate ? moment(task.dueDate, 'YYYY-MM-DD') : null,
                    dueDateFormatted: task.dueDate ? moment(task.dueDate, 'YYYY-MM-DD').format('MM/DD/YYYY') : 'Unknown',

                };
            });
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks); // Initialize filtered tasks
        } else {
            throw new Error("Failed to fetch tasks");
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again later."); // Notify the user of the error
    } finally {
        setLoading(false); // Always set loading to false after trying
    }
};


    // Fetch users and tasks on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length) {
            fetchTasks();
        }
    }, [users]);

    // Handle task deletion
    const handleTaskDeleted = () => {
        fetchTasks();
    };

    // Open edit dialog
    const handleEditClick = (taskId: string) => {
        const taskToEdit = tasks.find(task => task.id === taskId);
        if (taskToEdit) {
            setEditTask(taskToEdit);
            setIsEditDialogOpen(true);
        }
    };

    // Close edit dialog
    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false);
        setEditTask(null);
    };

    // Handle task update
    const handleTaskUpdated = (updatedTask: Task) => {
        fetchTasks();
        setIsEditDialogOpen(false);
        setEditTask(null);
    };
     // View task details
     const handleViewClick = (taskId: string) => {
        router.push(`/task/${taskId}`);
    };
     
 // Table columns configuration
const columns: ColumnsType<Task> = [
    {
        title: '#',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => index + 1,
        sorter: (a, b) => a.id.localeCompare(b.id),
        defaultSortOrder: 'ascend',
        width: '5%',
    },
    {
        title: 'Task Title',
        dataIndex: 'TaskTitle',
        key: 'TaskTitle',
        width: '20%',
        render: (text, record) => (
            <a onClick={() => handleViewClick(record.id)}>
                {text}
            </a>
        ),
    },
    {
        title: 'Employee Name',
        dataIndex: 'employeeName',
        key: 'employeeName',
        width: '15%',
    },
    {
        title: 'Doctor Name',
        dataIndex: 'supervisorName',
        key: 'supervisorName',
        width: '15%',
    },
    {
        title: 'Location',
        dataIndex: 'area',
        key: 'area',
        width: '10%',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: [
            { text: 'In Progress', value: 'In Progress' },
            { text: 'Failed', value: 'Failed' },
            { text: 'Done', value: 'Done' },
            { text: 'Complete', value: 'Complete' }
        ],
        onFilter: (value, record) => record.status === value,
        render: (status) => {
            let color: string;
            switch (status) {
                case 'Done':
                    color = 'green';
                    break;
                case 'Failed':
                    color = 'red';
                    break;
                case 'Complete':
                    color = 'gray';
                    break;
                default:
                    color = 'blue';
            }
            return <Tag color={color}>{status}</Tag>;
        },
        width: '10%',
    },
    {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (dueDate) => {
            return dueDate ? dueDate.format('YYYY-MM-DD') : 'Unknown Date';
        },
        width: '15%',
    },
    {
        title: 'Days Remaining',
        key: 'daysRemaining',
        render: (record) => {
            const today = moment(); // الحصول على تاريخ اليوم
            const dueDate = moment(record.dueDate); // تحويل dueDate إلى كائن moment
    
            const diffDays = dueDate.diff(today, 'days'); // حساب الفرق بالأيام
    
            // إذا كان التاريخ قد مضى أو كان 0
            if (diffDays <= 0) {
                return (
                    <span style={{ backgroundColor: 'red', color: 'white', padding: '0.5em', borderRadius: '4px' }}>
                        0 day(s) remaining (Overdue)
                    </span>
                ); // عرض بتضليل أحمر
            }
    
            return <span>{`${diffDays} day(s) remaining`}</span>; // عرض عدد الأيام المتبقية
        },
        width: '15%',
    },
    
    
    
    
   
    {
        title: 'Update Date',
        dataIndex: 'updateDate',
        key: 'updateDate',
        sorter: (a, b) => (a.updateDate?._seconds || 0) - (b.updateDate?._seconds || 0),
        render: (updateDate) => (
            <span>
                {updateDate ? new Date(updateDate._seconds * 1000).toLocaleString() : 'Unknown Date'}
            </span>
        ),
        width: '15%',
    },
 
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle">
                <a onClick={() => handleEditClick(record.id)}>Edit</a>
                <DeleteTaskButton taskId={record.id} onTaskDeleted={handleTaskDeleted} />
            </Space>
        ),
        width: '15%',
    },
];

const handleStatusFilterChange = (value: string) => {
    setFilterStatus(value);
    applyFilters(value, filterEmployee, filterSupervisor, dateRange);
};

const handleEmployeeFilterChange = (value: string) => {
    setFilterEmployee(value);
    applyFilters(filterStatus, value, filterSupervisor, dateRange);
};

const handleSupervisorFilterChange = (value: string) => {
    setFilterSupervisor(value);
    applyFilters(filterStatus, filterEmployee, value, dateRange);
};

const handleDateRangeChange = (dates: [moment.Moment, moment.Moment] | null) => {
    setDateRange(dates);
    applyFilters(filterStatus, filterEmployee, filterSupervisor, dates);
};

const applyFilters = (status?: string, employee?: string, supervisor?: string, dateRange?: [moment.Moment, moment.Moment] | null) => {
    let filtered = tasks;

    if (status) {
        filtered = filtered.filter(task => task.status === status);
    }

    if (employee) {
        filtered = filtered.filter(task => task.employeeName === employee);
    }

    if (supervisor) {
        filtered = filtered.filter(task => task.supervisorName === supervisor);
    }

    if (dateRange) {
        const [start, end] = dateRange;
        filtered = filtered.filter(task => {
            const createDate = task.createDate ? new Date(task.createDate._seconds * 1000) : null;
            return createDate && createDate >= start.toDate() && createDate <= end.toDate();
        });
    }

    setFilteredTasks(filtered);
};

const clearFilters = () => {
    setFilterStatus(undefined);
    setFilterEmployee(undefined);
    setFilterSupervisor(undefined);
    setDateRange(null);
    setFilteredTasks(tasks);
};




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
        const worksheet = XLSX.utils.json_to_sheet(filteredTasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Task");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "tasks_data.xlsx");
    };


    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Task List</h1>

            <div className="mb-4">
                <Select
                    placeholder="Select Employee"
                    onChange={handleEmployeeFilterChange}
                    showSearch
                    style={{ width: 200, marginRight: 16 }}
                >
                    {users.map(user => (
                        <Option key={user.uid} value={user.name}>{user.name}</Option>
                    ))}
                </Select>
                <Select
                    placeholder="Select Supervisor"
                    onChange={handleSupervisorFilterChange}
                    showSearch
                    style={{ width: 200, marginRight: 16 }}
                >
                    {Array.from(new Set(tasks.map(task => task.supervisorName))).map(name => (
                        <Option key={name} value={name}>{name}</Option>
                    ))}
                </Select>
                {/* <RangePicker onChange={handleDateRangeChange} style={{ marginRight: 16 }} /> */}
                <Select placeholder="Select Status" onChange={handleStatusFilterChange} style={{ width: 200 }}>
                    <Option value="">All</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Failed">Failed</Option>
                    <Option value="Completed">Completed</Option>
                    <Option value="Expired">Expired</Option>
                </Select>
                <Button onClick={clearFilters} type="default" style={{ marginLeft: 16 }}>
                    Clear Filters
                </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
  <UploadPage />
  <Button onClick={exportToExcel} type="primary" style={{ marginLeft: 10 }}>
    Export to Excel
  </Button>
</div>


                   

            <div className="overflow-x-auto">
                <NewTaskDialog />
                <Table columns={columns} dataSource={filteredTasks} rowKey="id" />
                {isEditDialogOpen && (
                    <UpdateTaskPage
                        visible={isEditDialogOpen}
                        task={editTask}
                        onCancel={handleEditDialogClose}
                        onTaskUpdated={handleTaskUpdated}
                    />
                )}
            </div>
            {filteredTasks.length === 0 && <p className="text-center mt-4">No tasks available to display.</p>}
        </div>
    );
};

export default TaskPage;
