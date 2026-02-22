import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, push, get, child } from 'firebase/database';
import { db } from './firebase';
import { Exam, ExamResult } from './types';

const EXAMS_PATH = 'exams';
const EXAM_RESULTS_PATH = 'exam_results';

export function useExamStore() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Failsafe: stop loading after 5 seconds even if Firebase hangs
    const timer = setTimeout(() => {
      console.warn('useExamStore: Loading timed out after 5s');
      setIsLoading(false);
    }, 5000);

    console.log('useExamStore: Starting Firebase listener for path:', EXAMS_PATH);
    const dbRef = ref(db, EXAMS_PATH);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      console.log('useExamStore: Received snapshot, exists:', snapshot.exists());
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: Exam[] = Array.isArray(val) ? val : Object.keys(val).map(k => ({
          ...val[k],
          questions: val[k].questions || []
        }));
        setExams(list);
      } else {
        console.log('useExamStore: No exams found.');
        setExams([]);
      }
      setIsLoading(false);
    }, (err) => {
      console.error('useExamStore: Failed to read exams:', err);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const createExam = useCallback(async (exam: Omit<Exam, 'id' | 'createdAt'>) => {
    const newRef = push(ref(db, EXAMS_PATH));
    const id = newRef.key as string;
    const payload: Exam = { ...exam as Exam, id, createdAt: Date.now() };
    await set(newRef, payload);
    return id;
  }, []);

  const updateExam = useCallback(async (examId: string, data: Partial<Exam>) => {
    const examRef = child(ref(db), `${EXAMS_PATH}/${examId}`);
    const snapshot = await get(examRef);
    if (!snapshot.exists()) throw new Error('Exam not found');
    const existing = snapshot.val();
    await set(examRef, { ...existing, ...data });
  }, []);

  const deleteExam = useCallback(async (examId: string) => {
    const examRef = child(ref(db), `${EXAMS_PATH}/${examId}`);
    await set(examRef, null);
  }, []);

  const listExams = useCallback(() => exams, [exams]);

  const submitResult = useCallback(async (result: Omit<ExamResult, 'id' | 'submittedAt'>) => {
    const newRef = push(ref(db, EXAM_RESULTS_PATH));
    const id = newRef.key as string;
    const payload: ExamResult = { ...result as ExamResult, id, submittedAt: Date.now() };
    await set(newRef, payload);
    return id;
  }, []);

  const getResultsForExam = useCallback(async (examId: string) => {
    const resRef = ref(db, EXAM_RESULTS_PATH);
    const snapshot = await get(resRef);
    if (!snapshot.exists()) return [] as ExamResult[];
    const val = snapshot.val();
    const list: ExamResult[] = Array.isArray(val) ? val : Object.keys(val).map(k => val[k]);
    return list.filter(r => r.examId === examId);
  }, []);

  return {
    exams,
    isLoading,
    createExam,
    updateExam,
    deleteExam,
    listExams,
    submitResult,
    getResultsForExam,
  };
}
