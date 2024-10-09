// 'use client';

// import React, { useState } from 'react';
// import axios from 'axios';
// import { DOMAIN } from '@/utils/constants'; // Make sure DOMAIN is correctly imported
// import { UploadOutlined } from '@ant-design/icons';
// import { Upload, Button, message } from 'antd';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const UploadPage: React.FC = () => {
//   const [uploading, setUploading] = useState(false);

//   const handleUpload = async (file: File) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append('file', file);

//     // Retrieve token from localStorage
//     const token = localStorage.getItem('token');

//     try {
//       const response = await axios.post(`${DOMAIN}/doctors/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 201) {
//         toast.success('File uploaded successfully!');
//         console.log('File uploaded successfully:', response.data);
//       } else {
//         toast.error(`Upload failed with status code: ${response.status}`);
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         toast.error(`File upload failed: ${error.response.data.message || error.message}`);
//       } else {
//         toast.error('An error occurred while uploading the file.');
//       }
//       console.error('File upload failed:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const uploadProps = {
//     name: 'file',
//     accept: '.xlsx, .xls',
//     customRequest: async ({ file, onSuccess, onError }) => {
//       try {
//         await handleUpload(file as File);
//         onSuccess?.("ok");
//       } catch (err) {
//         onError?.(err);
//       }
//     },
//     onChange(info: { file: { status: string; name: any; }; }) {
//       if (info.file.status === 'done') {
//         message.success(`${info.file.name} file uploaded successfully`);
//       } else if (info.file.status === 'error') {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//   };

//   return (
//     <div style={{ padding: '20px' }}>
    
//       <Upload {...uploadProps} disabled={uploading}>
//         <Button 
//           icon={<UploadOutlined />} 
//           loading={uploading}
//           style={{ 
//             backgroundColor: uploading ? '#ccc' : '#007bff', 
//             color: '#fff', 
//             borderRadius: '5px',
//           }}
//         >
//           {uploading ? 'Uploading...' : 'Upload File'}
//         </Button>
//       </Upload>
//       <ToastContainer />
//     </div>
//   );
// };

// export default UploadPage;




import React from 'react'

const upload = () => {
  return (
    <div>upload</div>
  )
}

export default upload