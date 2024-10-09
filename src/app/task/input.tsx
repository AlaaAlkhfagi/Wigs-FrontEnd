import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';
import { toast } from 'react-toastify';
import ButtonSpinner from '@/components/ButtonSpinner';
import { Button } from '@/components/ui/button';

const UploadExcelPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState<'initial' | 'loading' | 'success' | 'error'>('initial');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error('Please upload a file first');
            return;
        }

        setFormStatus('loading');
        setLoading(true);

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

                // Assume first row is headers
                const headers = jsonData[0];
                const rows = jsonData.slice(1) as (string | undefined)[][]; // Explicitly define type

                // Transform rows to match backend expectations
                const tasks = rows.map((row) => ({
                    TaskTitle: row[0] || '',
                    employeeID: row[1] || '',
                    supervisorName: row[2] || '',
                    body: row[3] || '',
                    area: row[4] || '',
                    status: row[5] || '',
                }));

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Token not found in localStorage");
                }

                // Post tasks data to the server
                await axios.post(`${DOMAIN}/upload`, { tasks }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                toast.success('Tasks uploaded successfully');
                setFormStatus('success');
                setFile(null);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error uploading tasks:', error);
            toast.error('Failed to upload tasks. Please try again later.');
            setFormStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {formStatus === 'success' ? (
                <div className="text-center">
                    <p className="text-green-500">Tasks uploaded successfully!</p>
                </div>
            ) : (
                <div>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? <ButtonSpinner /> : 'Upload Tasks'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UploadExcelPage;
