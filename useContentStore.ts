import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from './firebase';
import { DB_PATH_SETTINGS } from './constants';
import { PrepData, Lesson, SiteSettings, PrepLevel } from './types';
import { PREP_LEVELS_DATA, DEFAULT_SITE_SETTINGS } from './constants';

const DB_PATH = 'platform_content';

export function useContentStore() {
    const [levels, setLevels] = useState<PrepData[]>(PREP_LEVELS_DATA);
    const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
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

        // Listen for site settings
        const settingsRef = ref(db, DB_PATH_SETTINGS);
        const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
                setSiteSettings(snapshot.val());
            } else {
                set(settingsRef, DEFAULT_SITE_SETTINGS);
                setSiteSettings(DEFAULT_SITE_SETTINGS);
            }
        });

        return () => {
            unsubscribe();
            unsubscribeSettings();
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
        set(ref(db, DB_PATH_SETTINGS), DEFAULT_SITE_SETTINGS);
    }, []);

    const updateLevelImage = useCallback((levelId: PrepLevel, imageUrl: string) => {
        const updated = levels.map(level =>
            level.id === levelId ? { ...level, image: imageUrl } : level
        );
        set(ref(db, DB_PATH), updated);
    }, [levels]);

    const updateSiteSettings = useCallback((settings: Partial<SiteSettings>) => {
        const updated = { ...siteSettings, ...settings };
        set(ref(db, DB_PATH_SETTINGS), updated);
    }, [siteSettings]);

    return {
        levels,
        siteSettings,
        isLoading,
        addLesson,
        removeLesson,
        updateLesson,
        resetToDefaults,
        updateLevelImage,
        updateSiteSettings
    };
}
