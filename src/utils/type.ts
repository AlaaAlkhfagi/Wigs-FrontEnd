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
  id: string; // معرف الدكتور
  name: string; // اسم الدكتور
  birthday: string; // تاريخ الميلاد
  area: string; // المنطقة
  specialty: string; // التخصص
  phoneNumber: string; // رقم الهاتف
  email?: string; // البريد الإلكتروني (اختياري)
  child1?: string; // الطفل الأول (اختياري)
  child2?: string; // الطفل الثاني (اختياري)
  child3?: string; // الطفل الثالث (اختياري)
  closeFriend1?: string; // صديق مقرب 1 (اختياري)
  closeFriend2?: string; // صديق مقرب 2 (اختياري)
  university1?: string; // الجامعة 1 (اختياري)
  university2?: string; // الجامعة 2 (اختياري)
  wife?: string; // الزوجة (اختياري)
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