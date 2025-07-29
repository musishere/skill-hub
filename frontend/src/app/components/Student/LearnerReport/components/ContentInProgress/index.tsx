"use client";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import {
  Book,
  Calendar,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  Video,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { getContentInProgress } from "@/lib/api-client";

// Define proper interfaces instead of using 'any'
interface Avatar {
  img: string;
  progress: number;
  tooltip: string;
}

interface Author {
  name: string;
  avatar: string;
}

interface BaseLearningItem {
  id: number;
  type: "course" | "session" | "community" | "certificate";
  title: string;
  image: string;
  author: Author;
  progress: number;
  avatars: Avatar[];
  duration?: string;
}

interface CourseItem extends BaseLearningItem {
  type: "course";
  enrollmentDate?: string;
  completionDate?: string;
  unitsCompleted: number;
  totalUnits: number;
}

interface SessionItem extends BaseLearningItem {
  type: "session";
  sessionDate: string;
  daysRemaining: number;
}

interface CommunityItem extends BaseLearningItem {
  type: "community";
  activeDate: string;
  lastActive: string;
  contributions: number;
}

interface CertificateItem extends BaseLearningItem {
  type: "certificate";
  issueDate: string;
}

type LearningItem = CourseItem | SessionItem | CommunityItem | CertificateItem;

interface LearningData {
  inProgress: LearningItem[];
  completed: LearningItem[];
  certificates: LearningItem[];
}

interface TypeConfig {
  label: string;
  bgColor: string;
  textColor: string;
  icon: JSX.Element | null;
}

// Type label component
const TypeLabel = ({ type }: { type: string }) => {
  const getTypeConfig = (): TypeConfig => {
    switch (type) {
      case "course":
        return {
          label: "Course",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: <Book className="w-3.5 h-3.5" />,
        };
      case "session":
        return {
          label: "1:1 Session",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <Video className="w-3.5 h-3.5" />,
        };
      case "community":
        return {
          label: "Community",
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          icon: <MessageSquare className="w-3.5 h-3.5" />,
        };
      case "certificate":
        return {
          label: "Certificate",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <FileText className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: type,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: null,
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}
    >
      {config.icon}
      {config.label}
    </div>
  );
};

// Progress widget component
const ProgressWidget = ({ item }: { item: LearningItem }) => {
  let headerText = "";

  if (item.type === "course") {
    headerText = `${item.progress}% PROGRESS`;
  } else if (item.type === "session") {
    headerText = `${(item as SessionItem).daysRemaining} DAYS REMAINING`;
  } else if (item.type === "community") {
    headerText = `${(item as CommunityItem).contributions} CONTRIBUTIONS`;
  } else if (item.type === "certificate") {
    headerText = "CLAIMED";
  }

  return (
    <div className="w-[260px] h-[120px] flex flex-col justify-between bg-[rgba(19,196,204,0.1)] p-3 rounded-lg ">
      <div className="flex justify-between items-center">
        <div className="text-xs font-semibold text-gray-800">
          {headerText !== "CLAIMED" && (
            <span className="font-bold mr-2">{headerText.split(" ")[0]}</span>
          )}
          {headerText.split(" ").slice(1).join(" ")}
        </div>
        <div className="w-8 h-8 bg-[#11b3bb] rounded-full p-2 cursor-pointer transition-all hover:bg-[#13C4CC] hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center shadow">
          <Eye className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="h-1.5 bg-[rgba(19,196,204,0.2)] rounded-sm overflow-hidden">
        <div
          className="h-full bg-[#13C4CC] rounded-sm transition-all duration-300"
          style={{ width: `${item.progress}%` }}
        ></div>
      </div>

      <div className="flex gap-2 mt-2">
  {item.avatars.map((avatar, index) => (
    <div
      key={index}
      className={`w-6 h-6 rounded-full border-2 ${
        avatar.img.includes("Citra-Gunasiwi")
          ? "border-[#13C4CC]"
          : "border-white"
      } relative group`}
    >
      <Image
        src={avatar.img || "/placeholder.svg"}
        alt="User"
        width={24}
        height={24}
        className="rounded-full object-cover"
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity mb-2 z-10 pointer-events-none">
        {avatar.tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

// Product card component
const ProductCard = ({ item }: { item: LearningItem }) => {
  return (
    <Card className="mb-4 border border-slate-200 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 hover:shadow-sm">
      <div className="flex max-sm:flex-col p-4 gap-4">
        <div className="w-full sm:w-[260px] h-[120px] flex-shrink-0">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            width={200}
            height={120}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>

        <div className="flex-1 min-w-0 h-[120px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <TypeLabel type={item.type} />

              <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                <Image
                  src={item.author.avatar || "/placeholder.svg"}
                  alt={item.author.name}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-gray-800">
                  {item.author.name}
                </span>
              </div>
            </div>

            <h3 className="sm:text-base text-xs font-semibold text-gray-900 mt-2 line-clamp-2">
              {item.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 ">
            {item.duration && (
              <div className="flex items-center gap-1.5 text-gray-700 relative group">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{item.duration}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity mb-2 z-10 pointer-events-none">
                  Course Duration
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-gray-700 relative group">
              <Calendar className="w-4.5 h-4.5" />
              <span className="text-sm">
                {item.type === "course" &&
                  (item as CourseItem).enrollmentDate &&
                  `Enrolled ${(item as CourseItem).enrollmentDate}`}
                {item.type === "course" &&
                  (item as CourseItem).completionDate &&
                  `Completed ${(item as CourseItem).completionDate}`}
                {item.type === "session" &&
                  (item as SessionItem).sessionDate &&
                  `Session Date: ${(item as SessionItem).sessionDate}`}
                {item.type === "community" &&
                  (item as CommunityItem).activeDate &&
                  `Active since ${(item as CommunityItem).activeDate}`}
                {item.type === "community" &&
                  (item as CommunityItem).lastActive &&
                  `Last Active: ${(item as CommunityItem).lastActive}`}
                {item.type === "certificate" &&
                  (item as CertificateItem).issueDate &&
                  `Issued on ${(item as CertificateItem).issueDate}`}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity mb-2 z-10 pointer-events-none">
                {item.type === "course" &&
                  (item as CourseItem).enrollmentDate &&
                  "Enrollment Date"}
                {item.type === "course" &&
                  (item as CourseItem).completionDate &&
                  "Completion Date"}
                {item.type === "session" &&
                  (item as SessionItem).sessionDate &&
                  "Scheduled Session Date"}
                {item.type === "community" &&
                  (item as CommunityItem).activeDate &&
                  "Community Age"}
                {item.type === "community" &&
                  (item as CommunityItem).lastActive &&
                  "Last Community Activity"}
                {item.type === "certificate" &&
                  (item as CertificateItem).issueDate &&
                  "Certificate Issue Date"}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
              </div>
            </div>

            {item.type === "course" && (
              <div className="flex items-center gap-1.5 text-gray-700 relative group">
                <Book className="w-4.5 h-4.5" />
                <span className="text-sm">
                  {(item as CourseItem).unitsCompleted}/
                  <strong>{(item as CourseItem).totalUnits}</strong>
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity mb-2 z-10 pointer-events-none">
                  {(item as CourseItem).unitsCompleted} out of{" "}
                  {(item as CourseItem).totalUnits} Learning Units Completed
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ProgressWidget item={item} />
      </div>
    </Card>
  );
};

export default function ContentInProgress() {
  const [learningData, setLearningData] = useState<LearningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getContentInProgress();
        setLearningData(data);
      } catch (err) {
        setError("Failed to fetch content in progress data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto bg-white rounded-xl shadow-sm  p-4 md:p-6">
        <div className="bg-[#F0F7FF] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="https://i.ibb.co/nqYsqgSv/your-learning.webp"
              alt="Learning"
              width={24}
              height={24}
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Learning in <span className="text-gray-500">December</span>
            </h2>
          </div>

          <div className=" mx-auto">
            <div className="content-header text-base font-semibold text-gray-700 mt-6 mb-4">
              Content In Progress
            </div>
            <p className="text-center text-gray-500">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto bg-white rounded-xl shadow-sm  p-4 md:p-6">
        <div className="bg-[#F0F7FF] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="https://i.ibb.co/nqYsqgSv/your-learning.webp"
              alt="Learning"
              width={24}
              height={24}
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Learning in <span className="text-gray-500">December</span>
            </h2>
          </div>

          <div className=" mx-auto">
            <div className="content-header text-base font-semibold text-gray-700 mt-6 mb-4">
              Content In Progress
            </div>
            <p className="text-center text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!learningData) {
    return (
      <div className="mx-auto bg-white rounded-xl shadow-sm  p-4 md:p-6">
        <div className="bg-[#F0F7FF] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="https://i.ibb.co/nqYsqgSv/your-learning.webp"
              alt="Learning"
              width={24}
              height={24}
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Learning in <span className="text-gray-500">December</span>
            </h2>
          </div>

          <div className=" mx-auto">
            <div className="content-header text-base font-semibold text-gray-700 mt-6 mb-4">
              Content In Progress
            </div>
            <p className="text-center text-gray-500">No learning content available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-white rounded-xl shadow-sm  p-4 md:p-6">
      <div className="bg-[#F0F7FF] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Image
            src="https://i.ibb.co/nqYsqgSv/your-learning.webp"
            alt="Learning"
            width={24}
            height={24}
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            Your Learning in <span className="text-gray-500">December</span>
          </h2>
        </div>

        <div className=" mx-auto">
          <div className="content-header text-base font-semibold text-gray-700 mt-6 mb-4">
            Content In Progress
          </div>

          {learningData.inProgress.length > 0 ? (
            learningData.inProgress.map((item) => (
            <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No courses in progress</p>
          )}

          <div className="content-header text-base font-semibold text-gray-700 mt-6 mb-4">
            You Completed
          </div>

          {learningData.completed.length > 0 ? (
            learningData.completed.map((item) => (
            <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No completed courses</p>
          )}

          <div className="content-header text-base font-semibold text-gray-700 mt-6 mb-4">
            Certificates You Claimed
          </div>

          {learningData.certificates.length > 0 ? (
            learningData.certificates.map((item) => (
            <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No certificates claimed</p>
          )}
        </div>
      </div>
    </div>
  );
}
