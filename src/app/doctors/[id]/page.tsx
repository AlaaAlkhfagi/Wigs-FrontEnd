// "use client";

// import React, { useEffect } from "react";
// import { Modal, Form, Input, Select, Row, Col } from "antd";
// import axios from "axios";
// import { DOMAIN } from "@/utils/constants";
// import { Doctor } from "@/utils/type";

// // Define the props interface with proper types
// interface UpdateDoctorModalProps {
//   open: boolean;  // Replace 'visible' with 'open' as per new requirements
//   doctor: Doctor | null;  // Doctor type should be properly defined
//   onCancel: () => void;
//   onDoctorUpdated: (updatedDoctor: Doctor) => void;
// }

// const { Option } = Select;

// const UpdateDoctorModal: React.FC<UpdateDoctorModalProps> = ({ open, doctor, onCancel, onDoctorUpdated }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (open && doctor) {
//       form.setFieldsValue(doctor);
//     }
//   }, [open, doctor, form]);

//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       if (doctor) {
//         const updatedDoctor = { ...doctor, ...values };
//         const token = localStorage.getItem("token");

//         if (!token) {
//           throw new Error("Token not found in localStorage");
//         }

//         const response = await axios.put(
//           `${DOMAIN}/doctors/updateDoctor/${updatedDoctor.id}`,
//           updatedDoctor,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           onDoctorUpdated(updatedDoctor);
//           form.resetFields();
//         } else {
//           console.error("Failed to update doctor:", response.data.message);
//         }
//       }
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//     }
//   };

//   return (
//     <Modal
//       open={open}  // Replace 'visible' with 'open'
//       title="Update Doctor"
//       okText="Update"
//       cancelText="Cancel"
//       onCancel={onCancel}
//       onOk={handleOk}
//     >
//       <Form form={form} layout="vertical">
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="name"
//               label="Doctor Name"
//               rules={[{ required: true, message: "Please enter the doctor name" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="birthday"
//               label="Birth Date"
//               rules={[{ required: true, message: "Please enter the birth date" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="area"
//               label="Region"
//               rules={[{ required: true, message: "Please select the region" }]}
//             >
//               <Select placeholder="Select Region">
//                 <Option value="Baghdad-Karkh">Baghdad - Karkh</Option>
//                 <Option value="Baghdad-Rusafa">Baghdad - Rusafa</Option>
//                 <Option value="Karbala">Karbala</Option>
//                 <Option value="Wasit">Wasit</Option>
//                 <Option value="Babel">Babel</Option>
//                 <Option value="Basra">Basra</Option>
//                 <Option value="Erbil">Erbil</Option>
//                 <Option value="Dohuk">Dohuk</Option>
//                 <Option value="Sulaimania">Sulaimania</Option>
//                 <Option value="Dhi-Qar">Dhi-Qar</Option>
//                 <Option value="Najaf">Najaf</Option>
//                 <Option value="Semawa">Semawa</Option>
//                 <Option value="Anbar">Anbar</Option>
//                 <Option value="Mosel">Mosel</Option>
//                 <Option value="Salah-Aldeen">Salah-Aldeen</Option>
//                 <Option value="Qadisia">Qadisia</Option>
//                 <Option value="Kirkuk">Kirkuk</Option>
//                 <Option value="Diala">Diala</Option>
//                 <Option value="Missan">Missan</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item
//               name="specialty"
//               label="Specialty"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="phoneNumber"
//               label="Phone Number"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[{ type: "email", message: "Please enter a valid email" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="photoUrl"
//               label="Photo URL"
//             >
//               <Input />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="child1"
//               label="First Child"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="child2"
//               label="Second Child"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="child3"
//               label="Third Child"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="closeFriend1"
//               label="Close Friend 1"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="closeFriend2"
//               label="Close Friend 2"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="university1"
//               label="University (First)"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="university2"
//               label="University (Second)"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="wife"
//               label="Wife"
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//         </Row>
//       </Form>
//     </Modal>
//   );
// };

// export default UpdateDoctorModal;



import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page