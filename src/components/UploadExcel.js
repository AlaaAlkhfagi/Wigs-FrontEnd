import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const UploadExcel = () => {
  const handleChange = async (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/doctors/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSuccess(response.data, file);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Upload customRequest={customRequest} showUploadList={false} onChange={handleChange}>
      <Button icon={<UploadOutlined />}>Upload Excel</Button>
    </Upload>
  );
};

export default UploadExcel;
