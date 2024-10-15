// "use client"
// import React, { useEffect, useState } from 'react';
// import { Modal, Form, Input, Select, DatePicker, notification } from 'antd';
// import axios from 'axios';
// import { DOMAIN } from '@/utils/constants';
// import moment from 'moment';
// import { Doctor } from '@/utils/type';

// const { Option } = Select;

// interface UpdateDoctorPageProps {
//     visible: boolean;
//     doctor: Doctor | null;
//     onCancel: () => void;
//     onDoctorUpdated: (updatedDoctor: Doctor) => void;
// }

// const UpdateDoctorPage: React.FC<UpdateDoctorPageProps> = ({ visible, doctor, onCancel, onDoctorUpdated }) => {
//     const [form] = Form.useForm();
//     const [areas, setAreas] = useState<{ value: string; label: string }[]>([]);

//     useEffect(() => {
//         setAreas([
//             { value: '', label: 'Unknown' },
//             { value: 'Baghdad-Karkh', label: 'Baghdad-Karkh' },
//             { value: 'Baghdad-Rusafa', label: 'Baghdad-Rusafa' },
//             { value: 'Karbala', label: 'Karbala' },
//             { value: 'Wasit', label: 'Wasit' },
//             { value: 'Babel', label: 'Babel' },
//             { value: 'Basra', label: 'Basra' },
//             { value: 'Erbil', label: 'Erbil' },
//             { value: 'Dohuk', label: 'Dohuk' },
//             { value: 'Sulaimania', label: 'Sulaimania' },
//             { value: 'Dhi-Qar', label: 'Dhi-Qar' },
//             { value: 'Najaf', label: 'Najaf' },
//             { value: 'Semawa', label: 'Semawa' },
//             { value: 'Anbar', label: 'Anbar' },
//             { value: 'Mosel', label: 'Mosel' },
//             { value: 'Salah-Aldeen', label: 'Salah-Aldeen' },
//             { value: 'Qadisia', label: 'Qadisia' },
//             { value: 'Kirkuk', label: 'Kirkuk' },
//             { value: 'Diala', label: 'Diala' },
//             { value: 'Missan', label: 'Missan' },
//         ]);
//     }, []);

//     const handleOk = async () => {
//         try {
//             const values = await form.validateFields();
//             const updatedDoctor: Doctor = { 
//                 ...doctor!,
//                 ...values,
//                 birthday: values.birthday ? values.birthday.toISOString() : null,
//             };
//             const token = localStorage.getItem('token');

//             if (!token) {
//                 throw new Error('Token not found in localStorage');
//             }

//             const response = await axios.put(
//                 `${DOMAIN}/doctors/updateDoctor/${updatedDoctor.id}`,
//                 updatedDoctor,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             if (response.data.success) {
//                 onDoctorUpdated(updatedDoctor);
//                 form.resetFields();
//                 onCancel(); // إغلاق المودال بعد النجاح
//                 notification.success({ message: 'Doctor updated successfully!' }); // إعلام النجاح
//             } else {
//                 notification.error({ message: 'Failed to update doctor: ' + response.data.message });
//             }
//         } catch (error) {
//             console.error('Error updating doctor:', error);
//             const errorMessage = (error as Error).message;
//             notification.error({ message: 'Error updating doctor: ' + errorMessage });
//         }
//     };

//     return (
//         <Modal
//             visible={visible}
//             title="Update Doctor"
//             okText="Update"
//             cancelText="Cancel"
//             onCancel={onCancel}
//             onOk={handleOk}
//         >
//             <Form form={form} initialValues={doctor ? { ...doctor, birthday: doctor.birthday ? moment(doctor.birthday) : null } : undefined}>
//                 <Form.Item
//                     name="name"
//                     label="Doctor Name"
//                     rules={[{ required: true, message: 'Please enter the doctor name' }]}
//                 >
//                     <Input />
//                 </Form.Item>
//                 <Form.Item
//                     name="area"
//                     label="Region"
//                     rules={[{ required: true, message: 'Please select the region' }]}
//                 >
//                     <Select placeholder="Select Region">
//                         {areas.map(area => (
//                             <Option key={area.value} value={area.value}>
//                                 {area.label}
//                             </Option>
//                         ))}
//                     </Select>
//                 </Form.Item>
//                 <Form.Item
//                     name="specialty"
//                     label="Specialty"
//                 >
//                     <Input />
//                 </Form.Item>
//                 <Form.Item
//                     name="phoneNumber"
//                     label="Phone Number"
//                     rules={[{ required: true, message: 'Please enter the phone number' }]}
//                 >
//                     <Input />
//                 </Form.Item>
//                 <Form.Item
//                     name="birthday"
//                     label="Birth Date"
//                 >
//                     <DatePicker />
//                 </Form.Item>
//             </Form>
//         </Modal>
//     );
// };

// export default UpdateDoctorPage;
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page