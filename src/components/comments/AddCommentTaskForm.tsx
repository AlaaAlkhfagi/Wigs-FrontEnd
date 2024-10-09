"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DOMAIN } from '@/utils/constants';
import { Comment } from "@/utils/type";

interface AddCommentFormProps {
    taskId: string;
    onCommentAdded: (newComment: Comment) => void; // إضافة الخاصية هنا
}

const AddCommentForm = ({ taskId, onCommentAdded }: AddCommentFormProps) => {
    const router = useRouter();
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const formSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate the comment text
        if (text.trim() === "") {
            toast.error("Please write something");
            return;
        }

        setLoading(true); // Set loading state to true

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication token not found");
                return;
            }

            const userid = "Admin"; // Ensure the userId is a string

            // Post comment to the server
            const response = await axios.post(
                `${DOMAIN}/tasks/${taskId}/comments`,
                { commentText: text, userid: userid },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            if (response.data.success) {
                const newComment: Comment = {
                    commentText: text,
                    userID: userid,
                    userName: "Admin" // تأكد من تعديل هذا حسب البيانات المتاحة
                    ,
                    commentDate: ''
                };
                onCommentAdded(newComment); // استدعاء onCommentAdded هنا
                toast.success("Comment added successfully");
                router.refresh(); // Refresh the page to see the new comment
                setText(""); // Clear the text input after successful submission
            } else {
                toast.error(response.data.message || "Failed to post comment");
            }
        } catch (error: any) {
            console.error("Error details:", error);
            toast.error(error?.response?.data?.message || "Failed to post comment");
        } finally {
            setLoading(false); // Set loading state to false after completion
        }
    };

    return (
        <div className="flex justify-center mt-5">
            <form onSubmit={formSubmitHandler} className="w-full max-w-[65vw] bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <textarea
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                    rows={4}
                    placeholder="What's happening?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading} // Disable input while loading
                />
                <button
                    type="submit"
                    className={`bg-blue-500 text-white mt-2 p-2 rounded-lg hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Comment'}
                </button>
            </form>
        </div>
    );
};

export default AddCommentForm;
