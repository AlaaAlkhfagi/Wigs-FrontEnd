"use client";

import React, { useEffect, useState } from 'react';
import { Spin, message, Divider, Select, Button } from 'antd';
import { Comment } from "@/utils/type";
import { DOMAIN } from "@/utils/constants";
import CommentItem from '@/components/comments/CommentItem';
import AddCommentForm from '@/components/comments/AddCommentTaskForm';
import axios from 'axios';

interface SingleTaskPageProps {
    params: { id: string }
}

const SingleTaskPage = ({ params }: SingleTaskPageProps) => {
    const [task, setTask] = useState<any | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchTaskAndComments = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token not found");
                }

                const response = await axios.get(`${DOMAIN}/tasks/${params.id}/comments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { task, comments } = response.data.data;

                const formattedComments: Comment[] = comments.map((comment: any) => ({
                    commentText: comment.text || "No comment text available",
                    userID: comment.userID || "Unknown",
                    userName: comment.userName || "Unknown User",
                })).sort((a: { userName: any; }, b: { userName: string; }) => b.userName.localeCompare(a.userName));

                setTask(task);
                setStatus(task.status || "No status specified");
                setComments(formattedComments);
            } catch (error) {
                console.error("Error fetching task and comments:", error);
                setError("Failed to fetch task and comments. Please try again later.");
                message.error("Failed to fetch task and comments. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTaskAndComments();
    }, [params.id]);

    const handleSaveStatus = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token not found");
            }

            const response = await axios.put(`${DOMAIN}/tasks/updateTask/${params.id}`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                message.success("Status updated successfully");
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error: any) {
            console.error("Error updating status:", error.response?.data || error.message);
            message.error(`Failed to update status: ${error.response?.data?.message || error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCommentAdded = (newComment: Comment) => {
        setComments((prevComments) => [newComment, ...prevComments].sort((a, b) => b.userName.localeCompare(a.userName)));
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!task) {
        return <p>Task not found</p>;
    }

    return (
        <section className="container mx-auto p-5 md:w-[65vw]">
            <div className="bg-white p-5 rounded-lg shadow-md mb-7 border border-gray-200">
                <div className="flex items-center">
                    <img
                        src="https://www.w3schools.com/w3images/avatar6.png"
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-gray-800">{task.TaskTitle}</h1>
                        <p className="text-gray-800 mt-2">{task.body || "No body specified"}</p>
                    </div>
                </div>
                <Divider />
                <div className="mt-4">
                    <p className="text-gray-600 mb-2"><strong>Area:</strong> {task.area || "No area specified"}</p>
                    <div className="flex items-center mb-2">
                        <p className="text-gray-600"><strong>Status:</strong></p>
                        <Select 
                            value={status} 
                            onChange={value => setStatus(value)}
                            className="ml-2"
                            options={[
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Failed', label: 'Failed' },
                                { value: 'Done', label: 'Done' },
                                { value: 'Complete', label: 'Complete' },
                            ]}
                        />
                        <Button 
                            type="primary" 
                            className="ml-2"
                            onClick={handleSaveStatus}
                            loading={saving}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-7">
                <AddCommentForm taskId={params.id} onCommentAdded={handleCommentAdded} />
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md mb-7 border border-gray-200 mt-7">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Previous Comments</h4>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentItem 
                            key={comment.userID} 
                            comment={{
                                ...comment
                            }}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-600">No comments yet</p>
                )}
            </div>
        </section>
    );
};

export default SingleTaskPage;
