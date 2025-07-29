'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { AuthGuard } from '@/app/components/AuthGuard';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  duration: string;
  level: string;
  rating: number;
  reviews_count: number;
  students_count: number;
  instructor_id: string;
}

interface Progress {
  completed_lessons: number;
  total_lessons: number;
  progress_percentage: number;
  last_activity: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  completed: boolean;
}

const CourseLearningPage = () => {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseData = await apiFetch<Course>(`/api/courses/${courseId}`);
        setCourse(courseData);

        // Fetch progress
        try {
          const progressData = await apiFetch<Progress>(`/api/client/progress/${courseId}`);
          setProgress(progressData);
        } catch (progressError) {
          console.warn('Failed to fetch progress:', progressError);
        }

        // Mock lessons data (in a real app, this would come from the backend)
        const mockLessons: Lesson[] = [
          {
            id: '1',
            title: 'Introduction to the Course',
            description: 'Welcome to the course! Learn about what you\'ll be covering.',
            duration: '5 min',
            type: 'video',
            completed: false
          },
          {
            id: '2',
            title: 'Getting Started',
            description: 'Set up your development environment and tools.',
            duration: '15 min',
            type: 'video',
            completed: false
          },
          {
            id: '3',
            title: 'Basic Concepts',
            description: 'Learn the fundamental concepts and principles.',
            duration: '20 min',
            type: 'video',
            completed: false
          },
          {
            id: '4',
            title: 'Practice Exercise',
            description: 'Apply what you\'ve learned with hands-on practice.',
            duration: '30 min',
            type: 'text',
            completed: false
          },
          {
            id: '5',
            title: 'Knowledge Check',
            description: 'Test your understanding with a short quiz.',
            duration: '10 min',
            type: 'quiz',
            completed: false
          }
        ];

        // Mark lessons as completed based on progress
        if (progress) {
          const completedCount = Math.floor((progress.progress_percentage / 100) * mockLessons.length);
          mockLessons.forEach((lesson, index) => {
            lesson.completed = index < completedCount;
          });
        }

        setLessons(mockLessons);
        setCurrentLesson(mockLessons[0]);

        setError(null);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleLessonComplete = async (lessonId: string) => {
    try {
      // Update progress in backend
      const newProgress = progress ? progress.progress_percentage + 20 : 20;
      await apiFetch(`/api/client/progress/${courseId}`, {
        method: 'PATCH',
        body: JSON.stringify({ progress: newProgress })
      });

      // Update local state
      setLessons(prev => prev.map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      ));

      if (progress) {
        setProgress({
          ...progress,
          progress_percentage: newProgress,
          completed_lessons: progress.completed_lessons + 1
        });
      }

      // Move to next lesson
      const currentIndex = lessons.findIndex(l => l.id === lessonId);
      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1]);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !course) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 mb-2">Failed to load course</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Course Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={course.thumbnail_url || 'https://i.ibb.co/jJ4GHXP/img1.jpg'}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                  <p className="text-gray-600">{course.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {progress ? `${Math.round(progress.progress_percentage)}%` : '0%'}
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {currentLesson ? (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {currentLesson.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{currentLesson.description}</p>

                    {/* Lesson Content */}
                    <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
                      <div className="text-gray-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {currentLesson.type === 'video' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                          {currentLesson.type === 'text' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          )}
                          {currentLesson.type === 'quiz' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {currentLesson.type === 'video' && 'Video Lesson'}
                        {currentLesson.type === 'text' && 'Reading Material'}
                        {currentLesson.type === 'quiz' && 'Knowledge Check'}
                      </p>
                      <p className="text-gray-600">Duration: {currentLesson.duration}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
                          if (currentIndex > 0) {
                            setCurrentLesson(lessons[currentIndex - 1]);
                          }
                        }}
                        disabled={lessons.findIndex(l => l.id === currentLesson.id) === 0}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <button
                        onClick={() => handleLessonComplete(currentLesson.id)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {currentLesson.completed ? 'Completed ✓' : 'Mark as Complete'}
                      </button>

                      <button
                        onClick={() => {
                          const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
                          if (currentIndex < lessons.length - 1) {
                            setCurrentLesson(lessons[currentIndex + 1]);
                          }
                        }}
                        disabled={lessons.findIndex(l => l.id === currentLesson.id) === lessons.length - 1}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No lesson selected</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Course Outline */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Outline</h3>
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentLesson?.id === lesson.id
                          ? 'bg-blue-50 border border-blue-200'
                          : lesson.completed
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentLesson(lesson)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            lesson.completed
                              ? 'bg-green-500 text-white'
                              : currentLesson?.id === lesson.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {lesson.completed ? '✓' : index + 1}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${
                              lesson.completed ? 'text-green-800' : 'text-gray-900'
                            }`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500">{lesson.duration}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {lesson.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CourseLearningPage;
