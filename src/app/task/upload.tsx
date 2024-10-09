'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants'; // تأكد من استيراد DOMAIN بشكل صحيح
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message, UploadFile, UploadProps } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    // استرجاع التوكن من localStorage
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${DOMAIN}/Tasks/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      // افترض أن حالة الاستجابة 200 تعني النجاح
      if (response.status === 200 && response.data.success) {
        toast.success('File uploaded successfully!', {
          position: "top-right",
          autoClose: 10000, // 10 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(`Upload failed with status code: ${response.status}`, {
          position: "top-right",
          autoClose: 10000, // 10 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`File upload failed: ${error.response.data.message || error.message}`, {
          position: "top-right",
          autoClose: 10000, // 10 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error('An error occurred while uploading the file.', {
          position: "top-right",
          autoClose: 10000, // 10 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xlsx, .xls',
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await handleUpload(file as File); // يجب التأكد من أن file هو من نوع File
        onSuccess?.("ok");
      } catch (err) {
        // onError?.(err);
      }
    },
    onChange(info) {
      // لا تظهر رسائل النجاح/الفشل هنا؛ عالجها في handleUpload بدلاً من ذلك
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <Upload {...uploadProps} disabled={uploading}>
        <Button 
          icon={<UploadOutlined />} 
          loading={uploading}
          style={{ 
            backgroundColor: uploading ? '#ccc' : '#007bff', 
            color: '#fff', 
            borderRadius: '5px',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </Upload>
      <ToastContainer />
    </div>
  );
};

export default UploadPage;
