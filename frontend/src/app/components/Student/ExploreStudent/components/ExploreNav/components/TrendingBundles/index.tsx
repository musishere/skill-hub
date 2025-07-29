"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import c1 from "@/assets/explore/c1.jpg";
import c2 from "@/assets/explore/c2.jpg";
import c3 from "@/assets/explore/c3.jpg";
import c4 from "@/assets/explore/c4.jpg";
import {
  StarSvg,
  UserSVG,
  BundleSvg1,
  VideoSvg,
  CartSvg,
} from "@/app/components/svg";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info, X, ChevronDown } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/button";
import { getExploreBundles } from "@/lib/api-client";

// Fallback data if API fails
const fallbackBundles = [
  {
    title: "Complete Web Development Bundle",
    img: c1,
    instructorimg: c1,
    instructor: "Bundle Content",
    content: "Complete web development journey from HTML/CSS to advanced React and Node.js. 20+ courses included...",
    rating: "4.8",
    reviews: "2.3k",
    students: "28k",
    duration: "Lifetime",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      bundleSvg: <BundleSvg1 className="w-4 h-4 text-green-500" />,
      courseSvg: <VideoSvg className="w-4 h-4 text-blue-500" />,
    },
  },
  {
    title: "Data Science Master Bundle",
    img: c2,
    instructorimg: c2,
    instructor: "Bundle Content",
    content: "Comprehensive data science bundle covering Python, ML, AI, and data visualization. 15+ courses...",
    rating: "4.7",
    reviews: "1.9k",
    students: "35k",
    duration: "Lifetime",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      bundleSvg: <BundleSvg1 className="w-4 h-4 text-green-500" />,
      courseSvg: <VideoSvg className="w-4 h-4 text-blue-500" />,
    },
  },
  {
    title: "Design & Creative Bundle",
    img: c3,
    instructorimg: c3,
    instructor: "Bundle Content",
    content: "Complete design bundle with UI/UX, graphic design, and creative tools. 12+ courses included...",
    rating: "4.9",
    reviews: "3.1k",
    students: "28k",
    duration: "Lifetime",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      bundleSvg: <BundleSvg1 className="w-4 h-4 text-green-500" />,
      courseSvg: <VideoSvg className="w-4 h-4 text-blue-500" />,
    },
  },
  {
    title: "Business & Leadership Bundle",
    img: c4,
    instructorimg: c4,
    instructor: "Bundle Content",
    content: "Complete business education with leadership, entrepreneurship, and management. 18+ courses...",
    rating: "4.6",
    reviews: "1.2k",
    students: "35k",
    duration: "Lifetime",
    icon: {
      studentSvg: <UserSVG />,
      starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
      bundleSvg: <BundleSvg1 className="w-4 h-4 text-green-500" />,
      courseSvg: <VideoSvg className="w-4 h-4 text-blue-500" />,
    },
  },
];

export const TrendingBundles = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setLoading(true);
        console.log('🔄 TrendingBundles: Starting API call to /api/client/explore/bundles');
        const data = await getExploreBundles();
        console.log('✅ TrendingBundles: API Response received:', data);
        console.log('📊 TrendingBundles: Data length:', data?.length || 0);

        // Transform backend data to match component structure
        const transformedBundles = data.map((bundle, index) => {
          const fallbackImages = [c1, c2, c3, c4];
          return {
            title: bundle.title,
            img: bundle.image || fallbackImages[index % fallbackImages.length],
            instructorimg: bundle.image || fallbackImages[index % fallbackImages.length],
            instructor: bundle.author || "Bundle Content",
            content: bundle.points?.[0]?.text || "Complete bundle with multiple courses...",
            rating: bundle.rating?.toString() || "4.5",
            reviews: bundle.reviews?.toString() || "1k",
            students: bundle.students || "10k",
            duration: "Lifetime",
            icon: {
              studentSvg: <UserSVG />,
              starSvg: <StarSvg className="w-4 h-4 text-yellow-500" />,
              bundleSvg: <BundleSvg1 className="w-4 h-4 text-green-500" />,
              courseSvg: <VideoSvg className="w-4 h-4 text-blue-500" />,
            },
          };
        });
        console.log('🔄 TrendingBundles: Transformed data:', transformedBundles);
        setBundles(transformedBundles);
      } catch (err) {
        console.error('❌ TrendingBundles: API Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch bundles');
        console.log('🔄 TrendingBundles: Using fallback data due to error');
        setBundles(fallbackBundles);
      } finally {
        setLoading(false);
      }
    };

    fetchBundles();
  }, []);

  if (loading) {
    return (
      <div className="mb-4 bg-white px-5 py-6 rounded-2xl">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
              <BundleSvg1 className="w-6 h-6" fill="#1c4ed8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Trending Bundles
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

  const currentBundles = error ? fallbackBundles : bundles;

  return (
    <div className="mb-4 bg-white px-5 py-6 rounded-2xl mt-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        <h1 className="text-2xl font-bold">Trending Bundles</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {currentBundles.map((bundle, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md transition-all duration-300"
          >
            <div className="relative">
              <Image
                alt={bundle.title}
                className="w-full h-48 object-cover"
                src={bundle.img}
                width={400}
                height={200}
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2 leading-snug line-clamp-2">
                {bundle.title}
              </h3>
              <h3 className="text-sm mb-2 text-gray-500">{bundle.content}</h3>

              {/* <div className="bg-gray-50 mb-4 w-full rounded-lg">
                <div className="flex  overflow-x-auto gap-2 p-1">
                  <div className="relative w-10 h-10 cursor-pointer group">
                    <Image
                      alt={course.title}
                      className="w-full h-full object-cover rounded-md"
                      src={course.img}
                      width={50}
                      height={50}
                    />
                    <div className="w-[250px] z-[999] absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      The Complete Web Development Bootcamp
                    </div>
                  </div>
                  <div className="relative w-10 h-10 cursor-pointer group">
                    <Image
                      alt={course.title}
                      className="w-full h-full object-cover rounded-md"
                      src={course.img}
                      width={40}
                      height={50}
                    />
                    <div className=" w-[250px] z-[999] absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      The Complete Web Development Bootcamp
                    </div>
                  </div>
                  <div className="relative w-10 h-10 cursor-pointer group">
                    <Image
                      alt={course.title}
                      className="w-full h-full object-cover rounded-md"
                      src={course.img}
                      width={50}
                      height={50}
                    />
                    <div className=" w-[250px] z-[999] absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      The Complete Web Development Bootcamp
                    </div>
                  </div>
                  <div className="relative w-10 h-10 cursor-pointer group">
                    <Image
                      alt={course.title}
                      className="w-full h-full object-cover rounded-md"
                      src={course.img}
                      width={50}
                      height={50}
                    />
                    <div className="w-[250px] z-[999] absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      The Complete Web Development Bootcamp
                    </div>
                  </div>
                  <div className="relative w-10 h-10 cursor-pointer group">
                    <Image
                      alt={course.title}
                      className="w-full h-full object-cover rounded-md"
                      src={course.img}
                      width={50}
                      height={50}
                    />
                    <div className="w-[250px] z-[999] absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      The Complete Web Development Bootcamp
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="bg-gray-50 mb-3 w-full rounded-lg p-2">
  <div className="flex gap-2 no-scrollbar overflow-x-auto pb-2">
    {[1, 2, 3, 4, 5,6].map((item) => (
      <div key={item} className="relative flex-shrink-0 w-10 h-10">
        <Image
          alt={bundle.title}
          className="w-full h-full object-cover rounded-md"
          src={bundle.img}
          width={40}
          height={40}
        />

        <div className="hidden md:block absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
          The Complete Web Development Bootcamp
        </div>
      </div>
    ))}
  </div>
</div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-semibold text-cyan-500">
                  $499.99
                </span>
                <span className="text-sm text-gray-500 line-through">
                  $899.99
                </span>
              </div>

              <div className="flex rounded-md overflow-hidden bg-[#13C4CC] text-white shadow-md">
                <button className="flex justify-center items-center p-2 font-semibold w-full hover:bg-teal-500 transition-colors">
                  <CartSvg className="size-4 mr-1" /> Buy Now{" "}
                  <ChevronDown className="size-4" />
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

              <div className="flex justify-between items-center text-sm bg-gray-100 p-2 mt-3">
                <div className="flex items-center gap-1">
                  <div className="text-[#4287C4]">{bundle.icon.courseSvg}</div>
                  <span>{bundle.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-[#4287C4] w-4 h-4">
                    {bundle.icon.studentSvg}
                  </div>
                  <span>{bundle.students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-[#4287C4] w-4 h-4">
                    {bundle.icon.starSvg}
                  </div>
                  <span>{bundle.reviews}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && isMobile && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader className="flex justify-between items-center border-b px-6 py-4">
              <DrawerTitle>Payment Plans</DrawerTitle>
              <Button onClick={() => setIsOpen(false)} variant="secondary">
                <X className="size-4" />
              </Button>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
