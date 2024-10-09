// utils/type.ts

export interface Task {
  dueDate: any;
  employeeName: string;
  id: string;
  TaskTitle: string;
  employeeID: string;
  supervisorID: string;
  supervisorName: string; // تم إضافة هذا الحقل
  status: string;
  area: string;
  body: string;
  createDate: {
    toDate(): import("moment").MomentInput;
    toMillis(): number;
    _seconds: number;
    _nanoseconds: number;
  };
  updateDate: {
    toDate(): import("moment").MomentInput;
    toMillis(): number;
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface Doctor {
  id: string;
  birthday: string;
  area: string;
  specialty: string;
  wife: string;
  child1: string;
  child2: string;
  child3: string;
  university1: string;
  university2: string;
  photoUrl: string | null;
  closeFriend1: string;
  closeFriend2: string;
  phoneNumber: string;
  email: string;
  name: string;
}

// src/utils/type.ts

export interface User {
  uid: string;
  email: string;
  name: string;
  area: string;
  phoneNumber: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface Comment {
  commentText: string;
  commentDate: string; // تأكد من أن هذا هو النوع الصحيح
  userID: string;
  userName: string;
}