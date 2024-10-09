import React from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { DOMAIN } from '@/utils/constants';

interface ChangePasswordDialogProps {
    visible: boolean;
    onCancel: () => void;
    onPasswordChanged: () => void;
    userId?: string; // إضافة userId كمعامل اختياري
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
    visible,
    onCancel,
    onPasswordChanged,
    userId
}) => {
    const [form] = Form.useForm();

    const handlePasswordChange = async (values: { newPassword: string; confirmPassword: string }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                notification.error({
                    message: 'Authentication Error',
                    description: 'No authentication token found. Please log in again.',
                });
                return;
            }

            const response = await axios.post(
                `${DOMAIN}/users/changepassword`,
                { userId, newPassword: values.newPassword },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                notification.success({
                    message: 'Success',
                    description: 'Password changed successfully.',
                });
                onPasswordChanged();
                form.resetFields(); // Reset form fields after success
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.data.message || 'Failed to change password.',
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            notification.error({
                message: 'Error',
                description: 'An error occurred while changing the password. Please try again.',
            });
        }
    };

    return (
        <Modal
            visible={visible}
            title="Change Password"
            okText="Change"
            cancelText="Cancel"
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handlePasswordChange}
            >
                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[{ required: true, message: 'Please enter the new password' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[
                        { required: true, message: 'Please confirm the new password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordDialog;
