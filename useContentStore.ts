import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { db } from './firebase';
import { PrepData, Lesson } from './types';
import { PREP_LEVELS_DATA } from './constants';

const DB_PATH = 'platform_content';

export function useContentStore() {
    const [levels, setLevels] = useState<PrepData[]>(PREP_LEVELS_DATA);
    const [isLoading, setIsLoading] = useState(true);

    // Listen for real-time updates from Firebase
    useEffect(() => {
        // Failsafe: stop loading after 5 seconds even if Firebase hangs
        const timer = setTimeout(() => {
            console.warn('useContentStore: Loading timed out after 5s');
            setIsLoading(false);
        }, 5000);

        console.log('useContentStore: Starting Firebase listener for path:', DB_PATH);
        const dbRef = ref(db, DB_PATH);

        const unsubscribe = onValue(dbRef, (snapshot) => {
            console.log('useContentStore: Received snapshot, exists:', snapshot.exists());
            if (snapshot.exists()) {
                const data = snapshot.val() as PrepData[];
                const rawLevels = (Array.isArray(data) ? data : Object.values(data)) as PrepData[];
                const validated = rawLevels.map(level => ({
                    ...level,
                    lessons: level.lessons || []
                }));
                setLevels(validated);
            } else {
                console.log('useContentStore: No data found, seeding defaults...');
                set(dbRef, PREP_LEVELS_DATA);
                setLevels(PREP_LEVELS_DATA);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('useContentStore: Firebase read error:', error);
            setLevels(PREP_LEVELS_DATA);
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const addLesson = useCallback((levelId: string, lesson: Lesson) => {
        const updated = levels.map(level =>
            level.id === levelId
                ? { ...level, lessons: [...level.lessons, lesson] }
                : level
        );
        set(ref(db, DB_PATH), updated);
    }, [levels]);

    const removeLesson = useCallback((levelId: string, lessonId: string) => {
        const updated = levels.map(level =>
            level.id === levelId
                ? { ...level, lessons: level.lessons.filter(l => l.id !== lessonId) }
                : level
        );
        set(ref(db, DB_PATH), updated);
    }, [levels]);

    const updateLesson = useCallback((levelId: string, lessonId: string, data: Partial<Lesson>) => {
        const updated = levels.map(level =>
            level.id === levelId
                ? {
                    ...level,
                    lessons: level.lessons.map(l =>
                        l.id === lessonId ? { ...l, ...data } : l
                    ),
                }
                : level
        );
        set(ref(db, DB_PATH), updated);
    }, [levels]);

    const resetToDefaults = useCallback(() => {
        set(ref(db, DB_PATH), PREP_LEVELS_DATA);
    }, []);

    return { levels, isLoading, addLesson, removeLesson, updateLesson, resetToDefaults };
}
