/** @format */

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import img2 from "@/assets/img2.jpg";
import img3 from "@/assets/explore/c3.jpg";
// import img4 from "@/assets/img-3.webp";
// import img5 from "@/assets/img5.jpg";

import { CommunitySvg, CourseSvg } from "@/app/components/svg";
import { useIsMobile } from "@/hooks/use-mobile";
import { getStudentEnrollments } from "@/lib/api-client";

// Interface for enrollment data
// interface Enrollment {
//   id: string;
//   courseId: string;
//   title: string;
//   type: string;
//   image: string;
//   author: {
//     name: string;
//     avatar: string;
//   };
//   duration: string;
//   enrollmentDate: string;
//   unitsCompleted: number;
//   totalUnits: number;
//   progress: number;
//   lastAccessed: string;
// }

// Helper function to get SVG icon based on type
// const getTypeIcon = (type: string) => {
//   switch (type.toLowerCase()) {
//     case 'course':
//       return <CourseSvg className="size-4" fill="#0d6efd" />;
//     case 'community':
//       return <CommunitySvg className="size-4" fill="#db7302" />;
//     case 'event':
//       return <EventSvg className="size-4" fill="#ff0200" />;
//     default:
//       return <CourseSvg className="size-4" fill="#0d6efd" />;
//   }
// };

// Helper function to get color classes based on type
// const getTypeColors = (type: string) => {
//   switch (type.toLowerCase()) {
//     case 'course':
//       return { textColor: "text-blue-600", bgColor: "bg-blue-100" };
//     case 'community':
//       return { textColor: "text-orange-600", bgColor: "bg-orange-100" };
//     case 'event':
//       return { textColor: "text-red-700", bgColor: "bg-red-100" };
//     default:
//       return { textColor: "text-blue-600", bgColor: "bg-blue-100" };
//   }
// };

// Helper function to format date
// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffTime = Math.abs(now.getTime() - date.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   if (diffDays === 1) return "Yesterday";
//   if (diffDays < 7) return `${diffDays} days ago`;
//   return date.toLocaleDateString();
// };

export default function ContentInProgress() {
  const isMobile = useIsMobile();
  const [enrollments, setEnrollments] = useState<{
    inProgress: Array<{
      id: string;
      category: string;
      title: string;
      progress: number;
      lastActivity: string;
      image: string;
      svg: string;
      textColor: string;
      bgColor: string;
    }>;
    completed: Array<{
      id: string;
      category: string;
      title: string;
      progress: number;
      lastActivity: string;
      image: string;
      svg: string;
      textColor: string;
      bgColor: string;
    }>;
  }>({ inProgress: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const data = await getStudentEnrollments();
        setEnrollments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch enrollments');
        console.error('Error fetching enrollments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Transform enrollments to match the component's expected format
  const contentData = enrollments.inProgress || [];
  const completedContentData = enrollments.completed || [];

  // Fallback data if API fails
  const fallbackData = [
    {
      id: 1,
      category: "Course",
      title: "Creating Engaging Learning Journeys: UI/UX Best Practices",
      progress: 45,
      lastActivity: "Yesterday",
      image: img2,
      svg: <CourseSvg className="size-4" fill="#0d6efd" />,
      textColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 2,
      category: "Community",
      title: "UI/UX Design Community Discussion: Best Practices and Trends",
      progress: 80,
      lastActivity: "Yesterday",
      image: img3,
      svg: <CommunitySvg className="size-4" fill="#db7302" />,
      textColor: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const fallbackCompletedData = [
    {
      id: 1,
      category: "Course",
      title: "Advanced User Experience Design: Creating Intuitive Interfaces",
      progress: 100,
      lastActivity: "Yesterday",
      image: img2,
      svg: <CourseSvg className="size-4" fill="#0d6efd" />,
      textColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  const currentContentData = error ? fallbackData : contentData;
  const currentCompletedData = error ? fallbackCompletedData : completedContentData;

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="text-lg font-semibold">
            Content In Progress ({currentContentData.length})
          </h2>

          <button className="text-blue-500 font-semibold">View All</button>
        </div>
        <div className="space-y-4 p-4">
          {currentContentData.map((content) => (
            <div
              key={content.id}
              className="p-4 flex items-center border gap-2 bg-white rounded-md"
            >
              <div className="self-start w-20 h-20">
                <Image
                  src={content.image}
                  alt={content.title}
                  width={80}
                  height={80}
                  className="object-cover rounded-xl w-full h-full"
                />
              </div>
              <div className="ml-4 flex-1">
                <p
                  className={` p-2 rounded-md flex items-center gap-1 text-xs font-semibold ${content.textColor} ${content.bgColor}`}
                >
                  {content.svg}
                  {content.category}
                </p>
                <h3 className="text-md font-semibold my-2 line-clamp-2">
                  {content.title}
                </h3>
                <div className="flex ">
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-1 items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Progress: <b>{content.progress}%</b>
                      </p>
                      <p className="text-sm text-gray-500">
                        Last:
                        <b>{content.lastActivity}</b>
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-teal-500"
                        style={{ width: `${content.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center my-2 px-4">
          <h2 className="text-lg font-semibold">
            Completed Content ({currentCompletedData.length})
          </h2>

          <button className="text-blue-500 font-semibold">View All</button>
        </div>
        <div className="space-y-4 p-4">
          {currentCompletedData.map((content) => (
            <div
              key={content.id}
              className="p-4 flex items-center border gap-2 bg-white rounded-md"
            >
              <div className="self-start w-20 h-20">
                <Image
                  src={content.image}
                  alt={content.title}
                  width={80}
                  height={80}
                  className="object-cover rounded-xl w-full h-full"
                />
              </div>
              <div className="ml-4 flex-1">
                <p
                  className={` p-2 rounded-md flex items-center gap-1 text-xs font-semibold ${content.textColor} ${content.bgColor}`}
                >
                  {content.svg}
                  {content.category}
                </p>
                <h3 className="text-md font-semibold my-2 line-clamp-2">
                  {content.title}
                </h3>
                <div className="flex ">
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-1 items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Progress: <b>{content.progress}%</b>
                      </p>
                      <p className="text-sm text-gray-500">
                        Last:
                        <b>{content.lastActivity}</b>
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-teal-500"
                        style={{ width: `${content.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="bg-white border rounded-lg overflow-hidden min-md:mr-1">
          <h2 className="text-lg font-bold mb-4 p-4 pb-0">
            Content In Progress ({currentContentData.length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 ">
            {currentContentData.map((content) => (
              <div
                key={content.id}
                className="p-4 flex flex-col md:flex-row items-center border  gap-3 bg-gray-50"
              >
                <Image
                  src={content.image}
                  alt={content.title}
                  width={115}
                  height={150}
                  className="h-[150px] w-[115px] object-cover rounded-[4px]"
                />
                <div className="ml-4 flex-1">
                  <p
                    className={`w-fit px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold ${content.textColor} ${content.bgColor}`}
                  >
                    {content.svg}
                    {content.category}
                  </p>
                  <h3 className="text-md font-semibold my-2">
                    {content.title}
                  </h3>
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col gap-2 w-[80%]">
                      <p className="text-sm text-gray-500">
                        Progress: <b>{content.progress}%</b> - Last Activity:{" "}
                        <b>{content.lastActivity}</b>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-teal-500"
                          style={{ width: `${content.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="px-3 py-2 rounded-md border text-sm bg-[#f8f9fa] shadow-md hover:bg-[#d3d4d5] hover:text-black">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Content Sections */}
        <div className="grid grid-cols-2  border rounded-md  bg-gray-50 mt-4">
          {/* Content In Progress */}
          <div className="border-r ">
            <h3 className="text-lg font-semibold p-4">
              Content In Progress ({currentContentData.length})
            </h3>
            {currentContentData.slice(0, 1).map((content) => (
              <div
                key={content.id}
                className="p-4 flex flex-col md:flex-row items-center border  gap-3 bg-gray-50"
              >
                <Image
                  src={content.image}
                  alt={content.title}
                  width={115}
                  height={150}
                  className="h-[150px] w-[115px] object-cover rounded-[4px]"
                />
                <div className="ml-4 flex-1">
                  <p
                    className={`w-fit px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold ${content.textColor} ${content.bgColor}`}
                  >
                    {content.svg}
                    {content.category}
                  </p>
                  <h3 className="text-md font-semibold my-2">
                    {content.title}
                  </h3>
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col gap-2 w-[80%]">
                      <p className="text-sm text-gray-500">
                        Progress: <b>{content.progress}%</b> - Last Activity:{" "}
                        <b>{content.lastActivity}</b>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-teal-500"
                          style={{ width: `${content.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="px-3 py-2 rounded-md border text-sm bg-[#f8f9fa] shadow-md hover:bg-[#d3d4d5] hover:text-black">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Similar Content */}
          <div className="">
            <h3 className="text-lg font-semibold  p-4">
              Similar Content ({currentCompletedData.length})
            </h3>
            {currentCompletedData.slice(0, 1).map((content) => (
              <div
                key={content.id}
                className="p-4 flex flex-col md:flex-row items-center border  gap-3 bg-gray-50"
              >
                <Image
                  src={content.image}
                  alt={content.title}
                  width={115}
                  height={150}
                  className="h-[150px] w-[115px] object-cover rounded-[4px]"
                />
                <div className="ml-4 flex-1">
                  <p
                    className={`w-fit px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold ${content.textColor} ${content.bgColor}`}
                  >
                    {content.svg}
                    {content.category}
                  </p>
                  <h3 className="text-md font-semibold my-2">
                    {content.title}
                  </h3>
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col gap-2 w-[80%]">
                      <p className="text-sm text-gray-500">
                        Progress: <b>{content.progress}%</b> - Last Activity:{" "}
                        <b>{content.lastActivity}</b>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-teal-500"
                          style={{ width: `${content.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="px-3 py-2 rounded-md border text-sm bg-[#f8f9fa] shadow-md hover:bg-[#d3d4d5] hover:text-black">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}
