import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ButtonSpinner from '@/components/ButtonSpinner';
import { DOMAIN } from '@/utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const { Option } = Select;

const AddDoctorForm = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form] = Form.useForm(); // Create form instance

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found in localStorage");
            }

            const response = await axios.post(`${DOMAIN}/doctors/createDoctor`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Doctor created:', response.data);
            toast.success('Doctor added successfully');

            setSubmitted(true);

        } catch (error: any) {
            toast.error('Failed to add doctor. Please try again.');
            console.error('Error adding doctor:', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Card className="w-full max-w-full bg-gray-100 p-6 mx-auto my-8 rounded-lg text-center">
                <CardHeader>
                    <CardTitle className="text-xl">Doctor Added Successfully</CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                    <p>Doctor has been successfully added!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-screen-xl bg-gray-100 p-6 mx-auto my-8 rounded-lg">
            <CardHeader>
                <CardTitle className="text-xl">Add New Doctor</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {/* Doctor Name */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Doctor Name</label>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Please input the doctor name!' }]}
                        >
                            <Input
                                type="text"
                                placeholder="Doctor Name"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Birthday */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Birthday</label>
                        <Form.Item
                            name="birthday"
                            rules={[{ required: true, message: 'Please select the birthday!' }]}
                        >
                            <Input
                                type="date"
                                placeholder="Birthday"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Region */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Region</label>
                        <Form.Item
                            name="area"
                            rules={[{ required: true, message: 'Please select a region!' }]}
                        >
                            <Select
                                placeholder="Select a region"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                style={{ width: '100%' }} // Ensure the Select takes full width
                            >
                                <Option value="">Unknown</Option>
                                <Option value="Baghdad-Karkh">Baghdad-Karkh</Option>
                                <Option value="Baghdad-Rusafa">Baghdad-Rusafa</Option>
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
                    </div>

                    {/* Specialty */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Specialty</label>
                        <Form.Item
                            name="specialty"
                        >
                            <Input
                                type="text"
                                placeholder="Specialty"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Phone Number</label>
                        <Form.Item
                            name="phoneNumber"
                        >
                            <Input
                                type="text"
                                placeholder="Phone Number"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Child 1 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Child 1</label>
                        <Form.Item
                            name="child1"
                        >
                            <Input
                                type="text"
                                placeholder="Child 1"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Child 2 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Child 2</label>
                        <Form.Item
                            name="child2"
                        >
                            <Input
                                type="text"
                                placeholder="Child 2"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Child 3 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Child 3</label>
                        <Form.Item
                            name="child3"
                        >
                            <Input
                                type="text"
                                placeholder="Child 3"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Close Friend 1 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Close Friend 1</label>
                        <Form.Item
                            name="closeFriend1"
                        >
                            <Input
                                type="text"
                                placeholder="Close Friend 1"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Close Friend 2 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Close Friend 2</label>
                        <Form.Item
                            name="closeFriend2"
                        >
                            <Input
                                type="text"
                                placeholder="Close Friend 2"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* University (1) */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">University (1)</label>
                        <Form.Item
                            name="university1"
                        >
                            <Input
                                type="text"
                                placeholder="University (1)"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* University (2) */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">University (2)</label>
                        <Form.Item
                            name="university2"
                        >
                            <Input
                                type="text"
                                placeholder="University (2)"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    {/* Spouse */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Spouse</label>
                        <Form.Item
                            name="wife"
                        >
                            <Input
                                type="text"
                                placeholder="Spouse"
                                className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                            />
                        </Form.Item>
                    </div>

                    <CardFooter className="col-span-2 mt-4">
                        <Button
                            type="submit"
                            className="w-full py-2 px-6 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? <ButtonSpinner /> : "Add Doctor"}
                        </Button>
                    </CardFooter>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AddDoctorForm;
