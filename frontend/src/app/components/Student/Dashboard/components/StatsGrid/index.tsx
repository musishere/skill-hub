/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import {
  CommunitySvg,
  CourseSvg,
  PayoutSvg,
  StudentSvg,
  TimeDollarSvg,
  CertificateSvg,
  BadgesSvg,
  StarLineSvg,
} from "@/app/components/svg";
import { getStudentStats } from "@/lib/api-client";

// Stats Data Interface
interface StudentStats {
  inProgress: number;
  completed: number;
  reviewsLeft: number;
  badges: number;
  minutesWatched: number;
  comments: number;
  certificates: number;
  totalSpent: number;
  totalCourses: number;
  totalCompleted: number;
  totalReviews: number;
  totalBadges: number;
  totalMinutes: number;
  totalComments: number;
  totalCertificates: number;
  totalBudget: number;
}

const StatsGrid = () => {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStudentStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        console.error('Error fetching student stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Default stats data (fallback)
  const defaultStats = {
    inProgressCount: 18,
    inProgressPercent: 12.5,
    inProgressTotal: 18,
    completedCount: 37,
    completedPercent: 28,
    completedTotal: 37,
    reviewsLeft: 35,
    reviewsPercent: -26.7,
    reviewsTotal: 75,
    badgesCount: 3,
    badgesPercent: 15,
    badgesTotal: 3,
    minutesWatched: 8897,
    minutesPercent: 33.3,
    minutesTotal: 8897,
    commentsCount: 67,
    commentsPercent: 33.3,
    commentsTotal: 1595,
    certificatesCount: 5,
    certificatesPercent: 0,
    certificatesTotal: 5,
    spent: 407,
    spentPercent: 37,
    spentTotal: 2450,
  };

  const currentStats = stats || defaultStats;

  // Dynamic Stats Data based on backend response
  const statsData = [
    {
      icon: <CourseSvg className="size-5 " fill="#2e90fa" />,
      iconBg: "#d7e9ff",
      name: "In Progress",
      value: currentStats.inProgressCount.toString(),
      percent: currentStats.inProgressPercent,
      content: (
        <>
          <CourseSvg className="size-4" fill="#16a9b1" /> {currentStats.inProgressTotal} Total
        </>
      ),
    },
    {
      icon: <StudentSvg className="size-5  " fill="#10b368" />,
      iconBg: "#e5fef0",
      name: "Completed",
      value: currentStats.completedCount.toString(),
      percent: currentStats.completedPercent,
      content: (
        <>
          <StudentSvg className="size-4" fill="#16a9b1" />
          {currentStats.completedTotal} Total
        </>
      ),
    },
    {
      icon: <StarLineSvg className="size-5" fill="#906bd6" />,
      iconBg: "#e9e3ff",
      name: "Reviews Left",
      value: currentStats.reviewsLeft.toString(),
      percent: currentStats.reviewsPercent,
      content: (
        <>
          <StarLineSvg className="size-4" fill="#16a9b1" />
          {currentStats.reviewsTotal} Total
        </>
      ),
    },
    {
      icon: <BadgesSvg className="size-5" fill="#df820e" />,
      iconBg: "#fff3d7",
      name: "Badges",
      value: currentStats.badgesCount.toString(),
      percent: currentStats.badgesPercent,
      content: (
        <>
          <BadgesSvg className="size-4" fill="#16a9b1" />
          {currentStats.badgesTotal} Total
        </>
      ),
    },
    {
      icon: <TimeDollarSvg className="size-5 fill-[#f04438]" />,
      iconBg: "#ffe4e8",
      name: "Minutes Watched",
      value: currentStats.minutesWatched.toLocaleString(),
      percent: currentStats.minutesPercent,
      content: (
        <>
          <TimeDollarSvg className="size-4" fill="#16a9b1" />
          {currentStats.minutesTotal.toLocaleString()} Total
        </>
      ),
    },
    {
      icon: <CommunitySvg className="size-4" fill="#f8672d" />,
      iconBg: "#ffe4d5",
      name: "Comments",
      value: currentStats.commentsCount.toString(),
      percent: currentStats.commentsPercent,
      content: (
        <>
          <CommunitySvg className="size-4" fill="#16a9b1" />
          {currentStats.commentsTotal.toLocaleString()} Total
        </>
      ),
    },
    {
      icon: <CertificateSvg className="size-5 fill-[#344054]" />,
      iconBg: "#f3f3f3",
      name: "Certificates",
      value: currentStats.certificatesCount.toString(),
      percent: currentStats.certificatesPercent,
      content: (
        <>
          <CertificateSvg className="size-4" fill="#16a9b1" />
          {currentStats.certificatesTotal} Total
        </>
      ),
    },
    {
      icon: <PayoutSvg className="size-5 fill-[#2e90fa]" />,
      iconBg: "#eff8ff",
      name: "Spent",
      value: `$${currentStats.spent}`,
      percent: currentStats.spentPercent,
      content: (
        <>
          <PayoutSvg className="size-4" fill="#16a9b1" />
          ${currentStats.spentTotal.toLocaleString()} Total
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-[12px] justify-center xl:grid-cols-4 xl:gap-[24px] lg:grid-cols-3 lg:gap-[20px] md:grid-cols-3 md:gap-[15px] sm:grid-cols-2 sm:gap-[15px] xs:grid-cols-2 xs:gap-[12px]">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading stats: {error}</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      {/* Mobile View */}
      <div className="min-xs:hidden p-0 flex flex-col gap-5 w-full bg-white">
        {/** Render Mobile Cards in 2 Rows **/}

        <div className="flex w-full p-4">
          <StatCard.Mobile />
        </div>
      </div>

      {/* Desktop View */}
      <div className="max-xs:hidden grid grid-cols-1 gap-[12px] justify-center xl:grid-cols-4 xl:gap-[24px] lg:grid-cols-3 lg:gap-[20px] md:grid-cols-3 md:gap-[15px] sm:grid-cols-2 sm:gap-[15px] xs:grid-cols-2 xs:gap-[12px]">
        {statsData.map((stat, index) => (
          <StatCard.Desktop key={index} {...stat} />
        ))}
      </div>
    </React.Fragment>
  );
};

export default StatsGrid;
