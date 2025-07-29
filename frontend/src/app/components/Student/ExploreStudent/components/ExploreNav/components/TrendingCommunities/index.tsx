import React, { useState, useEffect } from "react";
import Image from "next/image";
import c1 from "@/assets/explore/c1.jpg";
import c2 from "@/assets/explore/c2.jpg";
import c3 from "@/assets/explore/c3.jpg";
import c4 from "@/assets/explore/c4.jpg";
import {
  StarSvg,
  UserSVG,
  CommunitySvg,
} from "@/app/components/svg";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/button";
import { getExploreCommunities } from "@/lib/api-client";

// Fallback data if API fails
const fallbackCommunities = [
  {
    title: "Web Development Community",
    img: c1,
    instructorimg: c1,
    instructor: "Community Lead",
    position: "Community Lead",
    content: "Join our vibrant community of web developers. Share knowledge, ask questions, and collaborate on projects...",
    rating: "4.8",
    reviews: "2.3k",
    students: "28k",
    duration: "Active",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      communitySvg: <CommunitySvg className="w-4 h-4 text-blue-500" />,
    },
  },
  {
    title: "Data Science Network",
    img: c2,
    instructorimg: c2,
    instructor: "Community Lead",
    position: "Community Lead",
    content: "Connect with data scientists, analysts, and ML engineers. Discuss latest trends and share insights...",
    rating: "4.7",
    reviews: "1.9k",
    students: "35k",
    duration: "Active",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      communitySvg: <CommunitySvg className="w-4 h-4 text-blue-500" />,
    },
  },
  {
    title: "Design Community",
    img: c3,
    instructorimg: c3,
    instructor: "Community Lead",
    position: "Community Lead",
    content: "A creative space for designers to share work, get feedback, and learn from each other...",
    rating: "4.9",
    reviews: "3.1k",
    students: "28k",
    duration: "Active",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      communitySvg: <CommunitySvg className="w-4 h-4 text-blue-500" />,
    },
  },
  {
    title: "Business Network",
    img: c4,
    instructorimg: c4,
    instructor: "Community Lead",
    position: "Community Lead",
    content: "Network with entrepreneurs, business leaders, and professionals. Share insights and opportunities...",
    rating: "4.6",
    reviews: "1.2k",
    students: "35k",
    duration: "Active",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      communitySvg: <CommunitySvg className="w-4 h-4 text-blue-500" />,
    },
  },
];

export const TrendingCommunities = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [communities, setCommunities] = useState<Array<{
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
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        console.log('🔄 TrendingCommunities: Starting API call to /api/client/explore/communities');
        const data = await getExploreCommunities();
        console.log('✅ TrendingCommunities: API Response received:', data);
        console.log('📊 TrendingCommunities: Data length:', data?.length || 0);

        // Transform backend data to match component structure
        const transformedCommunities = data.map((community, index) => {
          const fallbackImages = [c1, c2, c3, c4];
          return {
            title: community.title,
            img: community.image || fallbackImages[index % fallbackImages.length],
            instructorimg: community.image || fallbackImages[index % fallbackImages.length],
            instructor: community.author || "Community Lead",
            position: "Community Lead",
            content: community.points?.[0]?.text || "Join our vibrant community...",
            rating: community.rating?.toString() || "4.5",
            reviews: community.reviews?.toString() || "1k",
            students: community.students || "10k",
            duration: "Active",
            icon: {
              studentSvg: <UserSVG />,
              starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
              communitySvg: <CommunitySvg className="w-4 h-4 text-blue-500" />,
            },
          };
        });
        console.log('🔄 TrendingCommunities: Transformed data:', transformedCommunities);
        setCommunities(transformedCommunities);
      } catch (err) {
        console.error('❌ TrendingCommunities: API Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch communities');
        console.log('🔄 TrendingCommunities: Using fallback data due to error');
        setCommunities(fallbackCommunities);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <div className="mb-4 bg-white px-5 py-6 rounded-2xl">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
              <CommunitySvg className="w-6 h-6" fill="#1c4ed8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Trending Communities
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

  const currentCommunities = error ? fallbackCommunities : communities;

  return (
    <div className="mb-4 bg-white px-5 py-6 rounded-2xl">
      {/* Header Section */}
      <div className="flex items-center flex-col md:flex-row gap-3 mb-4">
        <CommunitySvg className="size-6" />
        <h1 className="text-2xl font-bold">Trending Communities</h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {currentCommunities.map((community, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md  transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]"
          >
            {/* Community Image */}
            <div className="relative">
              <Image
                alt={community.title}
                className="w-full h-48 object-cover rounded-md"
                src={community.img}
                width={400}
                height={200}
              />
              {isMobile && (
                <div className="absolute right-3 top-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer">
                  <span className="text-[#1A1D1F] text-[20px] leading-none">
                    ⋯
                  </span>
                </div>
              )}
            </div>

            {/* Community Details */}
            <div className="pt-4 pl-4 pr-4">
              <h3 className="text-lg font-semibold mb-1">{community.title}</h3>

              <div className="flex items-center gap-2 mb-2 ">
                <Image
                  alt={community.instructor}
                  className="w-6 h-6 rounded-full object-cover"
                  src={community.instructorimg}
                  width={24}
                  height={24}
                />
                <div>
                  <p className="text-sm font-semibold">{community.instructor}</p>
                  <p className="text-xs text-gray-500">{community.position}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {community.content}
              </p>

              {/* Join Now Button */}
              <div className="flex rounded-md overflow-hidden bg-[#13C4CC] text-white  shadow-md">
                <button className="p-2 flex-grow text-center text-lg font-semibold hover:bg-teal-500 transition-colors">
                  Join Now
                </button>
                {isMobile && (
                  <>
                    <div className="w-px bg-teal-300"></div>
                    <button
                      className="p-2 hover:bg-teal-500 transition-colors"
                      onClick={() => setIsOpen(true)}
                    >
                      <Info size={24} />
                    </button>
                  </>
                )}
              </div>
              {isOpen && isMobile && (
                <Drawer open={isOpen} onOpenChange={setIsOpen}>
                  <DrawerContent className="mb-4">
                    <DrawerHeader className="flex-row items-center justify-between border-b px-6 py-4">
                      <DrawerTitle>Community Information</DrawerTitle>
                      <Button
                        onClick={() => setIsOpen(false)}
                        variant="secondary"
                      >
                        <X className="size-4" />
                      </Button>
                    </DrawerHeader>

                    <section className="px-6 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          About the Community
                        </h3>
                        <p className="text-gray-700 text-sm">
                          A vibrant community of UI/UX designers focused on
                          sharing knowledge, getting feedback, and staying
                          updated with the latest design trends and best
                          practices. Join us to connect with fellow designers
                          and grow together.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          What You'll Get
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          • Access to exclusive design resources
                          <br />
                          • Weekly live design critiques
                          <br />
                          • Networking opportunities
                          <br />
                          • Monthly expert workshops
                          <br />• Portfolio reviews
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          Community Guidelines
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          • Be respectful and supportive
                          <br />
                          • Share constructive feedback
                          <br />
                          • No self-promotion without permission
                          <br />
                          • Keep discussions design-focused
                          <br />• Follow our code of conduct
                        </p>
                      </div>
                    </section>
                  </DrawerContent>
                </Drawer>
              )}
            </div>

            <div className="flex items-center justify-between text-sm bg-[rgb(248,_249,_251)] p-[10px] flex justify-between">
              <div className="relative group flex items-center gap-1">
                <div className="text-[#4287C4] w-4 h-4">
                  {community.icon.clockSvg}
                </div>
                <span className="text-[14px] font-semibold text-[rgb(0, 0, 0)]">
                  {community.duration}
                </span>

                <div className="absolute -top-10 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1.5 px-3 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                  Price
                  <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                </div>
              </div>

              <div className="relative group flex items-center gap-1">
                <div className="text-[#4287C4] w-4 h-4">
                  {community.icon.memberSvg}
                </div>
                <span className="text-[14px] font-semibold text-[rgb(0, 0, 0)]">
                  {community.members}
                </span>

                <div className="absolute -top-10 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1.5 px-3 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                  Member Count
                  <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                </div>
              </div>

              <div className="relative group flex items-center gap-1">
                <div className="text-[#4287C4] w-4 h-4  flex items-center">
                  {community.icon.likeSvg}
                </div>
                <span className="text-[14px] font-semibold text-[rgb(0, 0, 0)]">
                  {community.likes}
                </span>

                <div className="absolute -top-10 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1.5 px-3 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                  Post Count
                  <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
