"use client";

import { Card, Typography, Avatar } from 'antd';
import moment from 'moment';
import Title from 'antd/es/typography/Title';
import { Comment } from '@/utils/type';

const { Text } = Typography;

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="flex items-start mb-4">
      <Avatar 
        src={'https://www.w3schools.com/w3images/avatar6.png'} 
        size={40} 
        style={{ marginRight: '10px' }}
      />
      <div className="flex-1">
        <Card 
          style={{ borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', padding: '10px' }}
          bodyStyle={{ padding: 0 }}
        >
          <Title level={5} style={{ margin: 0 }}>
            {comment.userName || "Unknown User"}
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '5px' }}>
            {moment(comment.commentDate).isValid() ? moment(comment.commentDate).format('LLL') : "Invalid date"}
          </Text>
          <Text style={{ display: 'block', color: '#1d2129' }}>
            {comment.commentText}
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default CommentItem;
