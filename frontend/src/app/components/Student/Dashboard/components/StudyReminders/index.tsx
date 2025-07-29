/** @format */

'use client';
import { useEffect, useState } from 'react';
import {CheckSVG, RemainderCalendarSvg} from '@/app/components/svg/';
import {useIsMobile} from '@/hooks/use-mobile';
import { getStudentReminders } from '@/lib/api-client';
import TimeDrawer from './components/TimeDrawer';

// Interface for reminder data
interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  courseId: string;
  courseTitle: string;
}

export default function StudyReminders() {
	const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<keyof typeof reminders | null>(null);
  const [reminders, setReminders] = useState({
    M: { active: true, time: "7:15 PM" },
    T: { active: false, time: "" },
    W: { active: true, time: "3:30 PM" },
    Th: { active: false, time: "" },
    F: { active: true, time: "2:00 PM" },
    S: { active: false, time: "" },
    Su: { active: true, time: "7:15 PM" },
  });

  const [backendReminders, setBackendReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const data = await getStudentReminders();
        setBackendReminders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reminders');
        console.error('Error fetching reminders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // Open drawer for a specific day
  const openDrawer = (day: keyof typeof reminders) => {
    setActiveDay(day);
    setIsDrawerOpen(true);
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setActiveDay(null);
  };

  // Save reminder time
  const saveReminder = (time: string, amPm: string) => {
    if (activeDay) {
      setReminders((prev) => ({
        ...prev,
        [activeDay]: { active: true, time: `${time} ${amPm}` },
      }));
      closeDrawer();
    }
  };

  // Remove reminder
  const removeReminder = () => {
    if (activeDay) {
      setReminders((prev) => ({
        ...prev,
        [activeDay]: { active: false, time: "" },
      }));
      closeDrawer();
    }
  };

  // Transform backend reminders to weekly schedule format
  const transformRemindersToWeekly = () => {
    const weeklySchedule = {
      M: { active: false, time: "" },
      T: { active: false, time: "" },
      W: { active: false, time: "" },
      Th: { active: false, time: "" },
      F: { active: false, time: "" },
      S: { active: false, time: "" },
      Su: { active: false, time: "" },
    };

    // Handle the case where backendReminders is an object with a reminders property
    if (backendReminders && typeof backendReminders === 'object' && 'reminders' in backendReminders) {
      // Use the reminders object directly
      return backendReminders.reminders || weeklySchedule;
    }

    // Handle the case where backendReminders is an array (fallback)
    if (Array.isArray(backendReminders)) {
      // Group reminders by day of week
      backendReminders.forEach(reminder => {
        const dueDate = new Date(reminder.dueDate);
        const dayOfWeek = dueDate.getDay();
        const dayMap = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];
        const dayKey = dayMap[dayOfWeek] as keyof typeof weeklySchedule;

        if (dayKey) {
          weeklySchedule[dayKey] = {
            active: true,
            time: dueDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })
          };
        }
      });
    }

    return weeklySchedule;
  };

  const currentReminders = error ? reminders : transformRemindersToWeekly();

  const reminder = [
    {day: 'Mon', time: currentReminders.M.time, active: currentReminders.M.active},
    {day: 'Tue', time: currentReminders.T.time, active: currentReminders.T.active},
    {day: 'Wed', time: currentReminders.W.time, active: currentReminders.W.active},
    {day: 'Thu', time: currentReminders.Th.time, active: currentReminders.Th.active},
    {day: 'Fri', time: currentReminders.F.time, active: currentReminders.F.active},
    {day: 'Sat', time: currentReminders.S.time, active: currentReminders.S.active},
    {day: 'Sun', time: currentReminders.Su.time, active: currentReminders.Su.active},
  ];

  // Get next reminder
  const getNextReminder = () => {
    const now = new Date();
    const today = now.getDay();
    const dayMap = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];

    for (let i = 0; i < 7; i++) {
      const checkDay = (today + i) % 7;
      const dayKey = dayMap[checkDay] as keyof typeof currentReminders;
      if (currentReminders[dayKey].active) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${dayNames[checkDay]} ${currentReminders[dayKey].time}`;
      }
    }
    return 'No upcoming reminders';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4 animate-pulse">
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex justify-between px-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

	if (isMobile) {
		return (
			<section className='bg-white rounded-xl p-4 shadow-sm mb-4'>
				<div className='mb-4'>
					<h2 className='text-xl font-semibold'>Study Reminders</h2>
					<p className='text-sm text-gray-500'>
						Set your weekly study schedule
					</p>
				</div>

				<div className='flex justify-between px-2'>
					{Object.entries(currentReminders).map(([day, {active, time}]) => (
						<div key={day} className='flex flex-col items-center gap-1'>
							<div
								className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs relative cursor-pointer
                  ${
										active
											? 'font-semibold border-teal-500'
											: 'text-gray-500 border-gray-200'
									}`}
								onClick={() => openDrawer(day as keyof typeof reminders)}
							>
								{day}
								{active && (
									<div className='absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center'>
										<svg
											className='w-2.5 h-2.5 text-white'
											viewBox='0 0 24 24'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M5 13l4 4L19 7'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
									</div>
								)}
							</div>
							<span className='text-[11px] text-gray-500 h-4'>
								{active ? time : ''}
							</span>
						</div>
					))}
				</div>

        <TimeDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onSave={saveReminder}
        onRemove={removeReminder}
        initialTime={activeDay && currentReminders[activeDay].active ? currentReminders[activeDay].time.split(" ")[0] : "07:15"}
        initialAmPm={activeDay && currentReminders[activeDay].active ? currentReminders[activeDay].time.split(" ")[1] : "PM"}
      />
			</section>
		);
	} else {
		return (
			<div className='flex gap-12 items-start bg-white rounded-lg p-6 shadow-md'>
				{/* Header */}
				<div className='flex-[0_0_30%] pr-6 border-r border-gray-300'>
					<div className='flex items-center gap-3'>
						<RemainderCalendarSvg className='w-6 h-6 text-gray-700' />
						<h2 className='text-lg font-semibold text-gray-800'>
							Study Reminders
						</h2>
					</div>
					<p className='text-sm text-gray-600 mt-2'>
						Next reminder on{' '}
						<span className='font-semibold'>{getNextReminder()}</span>
					</p>
				</div>

				{/* Reminder Days */}
				<div className='grid grid-cols-7 gap-9'>
					{reminder.map((reminder) => (
						<div key={reminder.day} className='flex flex-col items-center px-4'>
							<div
								className={`relative flex items-center justify-center w-14 h-14 rounded-full border border-gray-300 text-sm font-semibold cursor-pointer transition-all duration-200 ${
									reminder.active
										? 'font-bold text-gray-800 bg-gray-100'
										: 'text-gray-500'
								}`}
							>
								{reminder.day}
								{reminder.active && (
									<div className='absolute top-0 right-0 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center'>
										<CheckSVG />
									</div>
								)}
							</div>
							<span className='text-xs text-gray-600 font-semibold mt-1'>
								{reminder.time || ''}
							</span>
						</div>
					))}
				</div>
			</div>
		);
	}
}
