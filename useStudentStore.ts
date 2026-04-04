import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, push, remove, get, update, query, orderByChild, equalTo } from 'firebase/database';
import { db } from './firebase';

export interface Student {
    id: string;
    name: string;
    phone: string;
    level: string;
    loginDate: string;
    lastSeen: string;
}

const DB_PATH = 'students';

export function useStudentStore(options: { autoListen?: boolean } = {}) {
    const { autoListen = false } = options;
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(autoListen);

    // Listen for real-time updates only if autoListen is true
    useEffect(() => {
        if (!autoListen) return;

        const dbRef = ref(db, DB_PATH);
        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const studentList: Student[] = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key,
                }));
                // Sort newest first
                studentList.sort((a, b) => new Date(b.loginDate).getTime() - new Date(a.loginDate).getTime());
                setStudents(studentList);
            } else {
                setStudents([]);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Firebase student read error:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginByPhone = useCallback(async (phone: string): Promise<Student | null> => {
        console.log('useStudentStore: loginByPhone called for:', phone);
        const dbRef = ref(db, DB_PATH);
        const phoneQuery = query(dbRef, orderByChild('phone'), equalTo(phone));

        try {
            // Add a 5s timeout for the fetch
            const fetchPromise = get(phoneQuery);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firebase connection timeout')), 5000)
            );

            const snapshot = await Promise.race([fetchPromise, timeoutPromise]) as any;
            console.log('useStudentStore: Received snapshot, exists:', snapshot.exists());

            if (snapshot.exists()) {
                const data = snapshot.val();
                // Even with equalTo, it returns an object { key: value }
                const entry = Object.entries(data)[0];
                if (entry) {
                    const [key, student] = entry;
                    console.log('useStudentStore: Student found, updating lastSeen');
                    await set(ref(db, `${DB_PATH}/${key}/lastSeen`), new Date().toISOString());
                    return { ...(student as any), id: key };
                }
            }
            console.log('useStudentStore: Student not found in database');
        } catch (err) {
            console.error('useStudentStore: Login error:', err);
            throw err;
        }
        return null;
    }, []);

    const registerStudent = useCallback(async (name: string, phone: string, level: string): Promise<string> => {
        // Check if student already exists with this phone
        const existing = await loginByPhone(phone);
        if (existing) {
            throw new Error('رقم الهاتف مسجل بالفعل');
        }

        // Create new student
        const newStudentRef = push(ref(db, DB_PATH));
        const now = new Date().toISOString();
        await set(newStudentRef, {
            name: name.trim(),
            phone: phone.trim(),
            level: level,
            loginDate: now,
            lastSeen: now,
        });
        return newStudentRef.key || '';
    }, [loginByPhone]);

    const removeStudent = useCallback(async (studentId: string) => {
        await remove(ref(db, `${DB_PATH}/${studentId}`));
    }, []);

    const updateStudent = useCallback(async (studentId: string, data: Partial<Student>) => {
        if (!studentId) throw new Error('studentId required');
        await update(ref(db, `${DB_PATH}/${studentId}`), data as any);
    }, []);

    return { students, isLoading, registerStudent, removeStudent, loginByPhone, updateStudent };
}
