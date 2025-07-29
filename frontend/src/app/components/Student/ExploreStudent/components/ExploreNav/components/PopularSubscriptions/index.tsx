import React, { useState, useEffect } from "react";
import Image from "next/image";
import c1 from "@/assets/explore/c1.jpg";
import c2 from "@/assets/explore/c2.jpg";
import c3 from "@/assets/explore/c3.jpg";
import c4 from "@/assets/explore/c4.jpg";
import {
  StarSvg,
  UserSVG,
  SubscriptionSvg,
} from "@/app/components/svg";
import { useIsMobile } from "@/hooks/use-mobile";
// import { Info, X } from "lucide-react";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/app/components/ui/drawer";
// import { Button } from "@/app/components/ui/button";
import { getExploreSubscriptions } from "@/lib/api-client";

// Fallback data if API fails
const fallbackSubscriptions = [
  {
    title: "Premium Learning Subscription",
    img: c1,
    instructorimg: c1,
    instructor: "Premium Content",
    content: "Access to all premium courses, live sessions, and exclusive content. Monthly subscription with unlimited access...",
    rating: "4.8",
    reviews: "2.3k",
    students: "28k",
    duration: "Monthly",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      subscriptionSvg: <SubscriptionSvg className="w-4 h-4 text-purple-500" />,
    },
  },
  {
    title: "Pro Developer Bundle",
    img: c2,
    instructorimg: c2,
    instructor: "Pro Content",
    content: "Complete developer toolkit with advanced courses, mentorship, and career guidance...",
    rating: "4.7",
    reviews: "1.9k",
    students: "35k",
    duration: "Annual",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      subscriptionSvg: <SubscriptionSvg className="w-4 h-4 text-purple-500" />,
    },
  },
  {
    title: "Business Mastery Program",
    img: c3,
    instructorimg: c3,
    instructor: "Business Content",
    content: "Comprehensive business education with leadership training, strategy, and entrepreneurship...",
    rating: "4.9",
    reviews: "3.1k",
    students: "28k",
    duration: "Quarterly",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      subscriptionSvg: <SubscriptionSvg className="w-4 h-4 text-purple-500" />,
    },
  },
  {
    title: "Creative Design Studio",
    img: c4,
    instructorimg: c4,
    instructor: "Creative Content",
    content: "Unlimited access to design courses, tools, and creative workshops for designers...",
    rating: "4.6",
    reviews: "1.2k",
    students: "35k",
    duration: "Monthly",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      subscriptionSvg: <SubscriptionSvg className="w-4 h-4 text-purple-500" />,
    },
  },
];

export const PopularSubscriptions = () => {
  // const isMobile = useIsMobile();
  // const [isOpen, setIsOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Array<{
    id: string;
    title: string;
    instructor: string;
    rating: string;
    reviews: string;
    students: string;
    duration: string;
    image: string;
    instructorImage: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const data = await getExploreSubscriptions();
        // Transform backend data to match component structure
        const transformedSubscriptions = data.map((subscription, index) => {
          const fallbackImages = [c1, c2, c3, c4];
          return {
            title: subscription.title,
            img: subscription.image || fallbackImages[index % fallbackImages.length],
            instructorimg: subscription.image || fallbackImages[index % fallbackImages.length],
            instructor: subscription.author || "Premium Content",
            content: subscription.points?.[0]?.text || "Access to premium content...",
            rating: subscription.rating?.toString() || "4.5",
            reviews: subscription.reviews?.toString() || "1k",
            students: subscription.students || "10k",
            duration: "Monthly",
            icon: {
              studentSvg: <UserSVG />,
              starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
              subscriptionSvg: <SubscriptionSvg className="w-4 h-4 text-purple-500" />,
            },
          };
        });
        setSubscriptions(transformedSubscriptions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
        console.error('Error fetching subscriptions:', err);
        setSubscriptions(fallbackSubscriptions);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <div className="mb-4 bg-white px-5 py-6 rounded-2xl">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
              <SubscriptionSvg className="w-6 h-6" fill="#1c4ed8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Popular Subscriptions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentSubscriptions = error ? fallbackSubscriptions : subscriptions;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="flex items-center flex-col md:flex-row gap-4 justify-between mb-4">
        <h1 className="text-[22px] font-bold">Popular Instructors</h1>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {currentSubscriptions.map((subscription, index) => (

          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]"
          >
            {/* Card Header */}
            <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">
                <SubscriptionSvg className="w-4 h-4" fill="#9333ea" />
                <span className="capitalize">subscription</span>
              </div>
            </div>

            {/* Card Main Content */}
            <div className="group relative">
              {/* Subscription Image */}
              <div className="p-3">
                <div className="relative w-full h-[180px]">
                  <Image
                    src={subscription.img || "/placeholder.svg?height=180&width=320"}
                    alt={subscription.title}
                    fill
                    className="object-cover rounded-3xl"
                  />
                </div>
              </div>

              {/* Subscription Content */}
              <div className="p-4">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[42px]">
                  {subscription.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 italic">
                  {subscription.instructor}
                </p>

                {/* Subscription Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                    <UserSVG className="w-4 h-4 text-gray-700" />
                    <span>{subscription.students}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                    <SubscriptionSvg className="w-4 h-4 text-gray-700" />
                    <span>{subscription.duration}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-semibold text-purple-500">
                    {subscription.rating}
                  </span>
                  <span className="text-sm text-gray-500 font-semibold">
                    Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-gray-50 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <SubscriptionSvg className="w-4 h-4" />
                <span>Subscription</span>
              </div>

              <div className="flex items-center gap-1">
                <StarSvg />
                <span className="text-xs font-semibold text-gray-900">
                  {subscription.rating}
                </span>
                <span className="text-xs text-gray-500">
                  ({subscription.reviews})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
