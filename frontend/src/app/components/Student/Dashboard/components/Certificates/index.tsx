"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import img1 from "@/assets/img-3.webp";
import img2 from "@/assets/img2.jpg";
import img3 from "@/assets/img5.jpg";
import { CertificateSvg, Certificate2 } from "@/app/components/svg";
import { getStudentCertificates } from "@/lib/api-client";

// Interface for certificate data
// interface Certificate {
//   id: string;
//   courseId: string;
//   courseTitle: string;
//   certificateUrl: string;
//   issuedDate: string;
//   grade: string;
//   instructor: string;
// }

export default function Certificates() {
  const [certificates, setCertificates] = useState<{
    certificates: Array<{
      id: string;
      courseId: string;
      courseTitle: string;
      certificateUrl: string;
      issuedDate: string;
      grade: string;
      instructor: string;
    }>;
  }>({ certificates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const data = await getStudentCertificates();
        setCertificates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch certificates');
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Transform certificates to match the component's expected format
  const transformedCertificates = (certificates.certificates || []).map((cert, index) => {
    const images = [img1, img2, img3];
    const svgs = [
      <CertificateSvg key="cert1" className="w-6 h-6" fill="#10b368" />,
      <Certificate2 key="cert2" className="w-6 h-6 text-green-600" fill="#10b368" />,
      <CertificateSvg key="cert3" className="w-6 h-6 text-orange-600" fill="#10b368" />
    ];

    return {
      id: cert.id,
      title: cert.courseTitle,
      issuedDate: new Date(cert.issuedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      image: images[index % images.length], // Fallback to default images
      svg: svgs[index % svgs.length],
      bgColor: "bg-[#e5fef0]",
      textColor: "text-blue-600",
      grade: cert.grade,
      instructor: cert.instructor,
    };
  });

  // Fallback data if API fails
  const fallbackCertificates = [
    {
      id: 1,
      title: "Web Development Mastery",
      issuedDate: "Oct 15, 2024",
      image: img1,
      svg: <CertificateSvg className="w-6 h-6" fill="#10b368" />,
      bgColor: "bg-[#e5fef0]",
      textColor: "text-blue-600",
    },
    {
      id: 2,
      title: "UX Design Fundamentals",
      issuedDate: "Sep 30, 2024",
      image: img2,
      svg: <Certificate2 className="w-6 h-6 text-green-600" fill="#10b368" />,
      bgColor: "bg-[#e5fef0]",
      textColor: "text-green-600",
    },
    {
      id: 3,
      title: "Digital Marketing Pro",
      issuedDate: "Aug 22, 2024",
      image: img3,
      svg: <CertificateSvg className="w-6 h-6 text-orange-600" fill="#10b368" />,
      bgColor: "bg-[#e5fef0]",
      textColor: "text-orange-600",
    },
  ];

  const currentCertificates = error ? fallbackCertificates : transformedCertificates;

  if (loading) {
    return (
      <div className="bg-white rounded-xl max-xs:border p-4 xs:p-6 xs:shadow-md">
        <div className="flex max-xs:flex-col xs:items-center gap-1 xs:gap-3 xs:mb-6 text-gray-900">
          <h1 className="text-2xl font-semibold text-[#262b3d]">Certificates</h1>
          <p className="text-[14px] text-[#4f4f4f] font-semibold xs:mt-1">
            Your Claimed Certificates
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-300 rounded-xl p-5 flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl max-xs:border p-4 xs:p-6 xs:shadow-md">
      <div className="flex max-xs:flex-col xs:items-center gap-1 xs:gap-3 xs:mb-6 text-gray-900">
        <h1 className="text-2xl font-semibold text-[#262b3d]">Certificates</h1>
        <p className="text-[14px] text-[#4f4f4f] font-semibold  xs:mt-1">
          Your Claimed Certificates ({currentCertificates.length})
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {currentCertificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border border-gray-300 rounded-xl p-5 flex items-center gap-4 transition-transform duration-200 hover:shadow-md hover:scale-102"
          >
            {/* SVG Container */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${cert.bgColor}`}
            >
              {cert.svg}
            </div>

            {/* Certificate Image */}
            <Image
              src={cert.image}
              alt={cert.title}
              width={50}
              height={50}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />

            {/* Certificate Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-semibold text-[#262b3d] mb-1 truncate">
                {cert.title}
              </h3>
              <p className="text-[13px] text-[#4f4f4f]">
                {cert.issuedDate}
              </p>
              {'grade' in cert && (
                <p className="text-[12px] text-[#666]">
                  Grade: {cert.grade}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
