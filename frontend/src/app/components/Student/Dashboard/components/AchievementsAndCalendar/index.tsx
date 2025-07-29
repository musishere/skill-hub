"use client";
import { useEffect, useState } from "react";
import Calendar from "@/app/components/Calender/studentcalender";
import { CertificatesSVGNEW, TrophySVG } from "@/app/components/svg";
import { getStudentAchievements } from "@/lib/api-client";

// Interface for achievement data
// interface Achievement {
//   id: string;
//   title: string;
//   description: string;
//   icon: string;
//   earnedDate: string;
//   category: string;
// }

interface AchievementProps {
  title: string;
  description: string;
  iconColor: string;
}

const AchievementCard: React.FC<AchievementProps> = ({ title, description, iconColor }) => (
  <div className="text-center p-4 xs:p-[20px] border-[1px]  border-[#e2e8f0] rounded-[12px] bg-[#fff] [transition:transform_.2s] relative overflow-hidden">
    {/* Icon */}
    <div className="relative w-[120px] h-[120px] mt-[0] mx-[auto] mb-[16px]">
      <span className={`w-10 h-10 ${iconColor}`}>
      <TrophySVG />
      </span>
    </div>

    {/* Achievement Title */}
    <h3 className="text-lg font-semibold text-[#262b3d]">{title}</h3>

    {/* Description */}
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// Helper function to get icon color based on category
const getIconColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'master':
      return "text-green-600";
    case 'engagement':
      return "text-blue-600";
    case 'milestone':
      return "text-yellow-600";
    case 'certificate':
      return "text-purple-600";
    case 'community':
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
};

export default function AchievementsAndCalendar() {
  const [achievements, setAchievements] = useState<{
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      earnedDate: string;
      category: string;
    }>;
  }>({ achievements: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const data = await getStudentAchievements();
        setAchievements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Transform achievements to match the component's expected format
  const transformedAchievements = (achievements.achievements || []).map(achievement => ({
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    iconColor: getIconColor(achievement.category),
    earnedDate: achievement.earnedDate,
  }));

  // Fallback data if API fails
  const fallbackAchievements = [
    {
      id: 1,
      title: "Master Learner",
      description: "Completed 10 courses with distinction",
      iconColor: "text-green-600",
    },
    {
      id: 2,
      title: "Engagement Pro",
      description: "Participated in 50+ learning activities",
      iconColor: "text-blue-600",
    },
    {
      id: 3,
      title: "Milestone Achiever",
      description: "Reached all quarterly learning goals",
      iconColor: "text-yellow-600",
    },
  ];

  const currentAchievements = error ? fallbackAchievements : transformedAchievements;

  if (loading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-10 xs:gap-6">
        <div className="xs:col-span-7 col-span-full bg-white shadow-lg rounded-xl p-6 border border-gray-200 xs:pb-15">
          <div className="flex items-center gap-3 mb-6 text-gray-900">
            <CertificatesSVGNEW />
            <h1 className="text-2xl font-bold text-[#262b3d]">Achievements & Badges</h1>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-1 md:grid-cols-3 max-xs:my-4 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="text-center p-4 xs:p-[20px] border-[1px] border-[#e2e8f0] rounded-[12px] bg-[#fff] animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3 bg-white shadow-sm max-xs:my-4 rounded-xl p-6">
          <Calendar />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-10 xs:gap-6 ">
      {/* Achievements Section (7 columns) */}
      <div className="xs:col-span-7 col-span-full bg-white shadow-lg rounded-xl p-6 border border-gray-200 xs:pb-15">
        <div className="flex items-center gap-3 mb-6 text-gray-900">
          <CertificatesSVGNEW />
          <h1 className="text-2xl font-bold text-[#262b3d]">Achievements & Badges</h1>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-1 md:grid-cols-3 max-xs:my-4 gap-4">
          {currentAchievements.slice(0,2).map((achieve) => (
            <AchievementCard
              key={achieve.id}
              title={achieve.title}
              description={achieve.description}
              iconColor={achieve.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Calendar Section (3 columns) */}
      <div className="col-span-3 bg-white shadow-sm max-xs:my-4 rounded-xl p-6">
        <Calendar />
      </div>
    </div>
  );
}
