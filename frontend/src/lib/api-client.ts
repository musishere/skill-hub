// Simple API client for backend requests
// Uses NEXT_PUBLIC_API_URL from .env.local (e.g., http://localhost:3005)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

// Token management
let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  // Store in localStorage for persistence
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
    console.log("Token stored:", token.substring(0, 20) + "...");
  }
}

export function getAuthToken(): string | null {
  if (!authToken && typeof window !== "undefined") {
    authToken = localStorage.getItem("authToken");
    console.log(
      "Token retrieved:",
      authToken ? authToken.substring(0, 20) + "..." : "null"
    );
  }
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

export function redirectToLogin() {
  if (typeof window !== "undefined") {
    // Store current path to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== "/login" && currentPath !== "/signup") {
      sessionStorage.setItem("redirectAfterLogin", currentPath);
    }
    window.location.href = "/login";
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // If url is absolute, use as is; otherwise, prepend API_BASE_URL
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  console.log("🌐 API Call:", fullUrl);

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add Authorization header if token exists
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("🔑 Token included in request");
  } else {
    console.log("⚠️ No token found - user needs to log in");
  }

  console.log("📤 Request headers:", headers);

  const res = await fetch(fullUrl, {
    ...options,
    credentials: "include", // send cookies for auth
    headers,
  });

  console.log("📥 Response status:", res.status);

  if (!res.ok) {
    let errorMsg = "Unknown error";
    try {
      const err = await res.json();
      errorMsg = err.error || err.message || JSON.stringify(err);
      console.log("❌ API Error response:", err);
    } catch {}

    // Handle 401 Unauthorized - clear token and redirect to login
    if (res.status === 401) {
      console.log("🚫 401 Unauthorized - redirecting to login");
      clearAuthToken();
      redirectToLogin();
      throw new Error("Please log in to continue");
    }

    throw new Error(errorMsg);
  }

  const data = await res.json();
  console.log("✅ API Response data:", data);
  return data;
}

// Auth-specific functions
export async function login(email: string, password: string) {
  const response = await apiFetch<{ token: string; user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string;
    learnworldsUser_?: string;
    isActive: boolean;
    createdAt: string;
  } }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );

  if (response.token) {
    setAuthToken(response.token);
  }

  return response;
}

export async function signup(userData: {
  email: string;
  password: string;
  fullName: string;
  role: string;
}) {
  const response = await apiFetch<{ token: string; user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string;
    learnworldsUser_?: string;
    isActive: boolean;
    createdAt: string;
  } }>(
    "/api/auth/signup",
    {
      method: "POST",
      body: JSON.stringify(userData),
    }
  );

  if (response.token) {
    setAuthToken(response.token);
  }

  return response;
}

export function logout() {
  clearAuthToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Student Dashboard API functions - Updated to use correct backend endpoints
export async function getStudentStats() {
  return await apiFetch<{
    inProgressCount: number;
    inProgressPercent: number;
    inProgressTotal: number;
    completedCount: number;
    completedPercent: number;
    completedTotal: number;
    reviewsLeft: number;
    reviewsPercent: number;
    reviewsTotal: number;
    badgesCount: number;
    badgesPercent: number;
    badgesTotal: number;
    minutesWatched: number;
    minutesPercent: number;
    minutesTotal: number;
    commentsCount: number;
    commentsPercent: number;
    commentsTotal: number;
    certificatesCount: number;
    certificatesPercent: number;
    certificatesTotal: number;
    spent: number;
    spentPercent: number;
    spentTotal: number;
  }>("/api/client/dashboard");
}

export async function getStudentEnrollments() {
  return await apiFetch<{
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
  }>("/api/client/in-progress");
}

export async function getStudentCertificates() {
  return await apiFetch<{
    certificates: Array<{
      id: string;
      courseId: string;
      courseTitle: string;
      certificateUrl: string;
      issuedDate: string;
      grade: string;
      instructor: string;
    }>;
  }>("/api/client/certificates");
}

export async function getStudentAchievements() {
  return await apiFetch<{
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      earnedDate: string;
      category: string;
    }>;
  }>("/api/client/achievements");
}

export async function getStudentReminders() {
  return await apiFetch<{
    reminders: {
      M: { active: boolean; time: string };
      T: { active: boolean; time: string };
      W: { active: boolean; time: string };
      Th: { active: boolean; time: string };
      F: { active: boolean; time: string };
      S: { active: boolean; time: string };
      Su: { active: boolean; time: string };
    };
  }>("/api/client/reminders");
}

// Explore API functions
export async function getExploreCourses() {
  console.log(
    "🌐 API Client: Calling getExploreCourses() - /api/client/explore/courses"
  );
  try {
    const response = await apiFetch<
      Array<{
        id: string;
        title: string;
        author: string;
        image: string;
        type: string;
        students: string;
        duration: string;
        units: number;
        level: string;
        currentPrice: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        points: Array<{ text: string }>;
      }>
    >("/api/client/explore/courses");
    console.log("✅ API Client: getExploreCourses response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getExploreCourses error:", error);
    throw error;
  }
}

export async function getExploreSessions() {
  console.log(
    "🌐 API Client: Calling getExploreSessions() - /api/client/explore/sessions"
  );
  try {
    const response = await apiFetch<
      Array<{
        id: string;
        title: string;
        author: string;
        image: string;
        type: string;
        students: string;
        duration: string;
        units: number;
        level: string;
        currentPrice: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        points: Array<{ text: string }>;
      }>
    >("/api/client/explore/sessions");
    console.log("✅ API Client: getExploreSessions response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getExploreSessions error:", error);
    throw error;
  }
}

export async function getExploreCommunities() {
  console.log(
    "🌐 API Client: Calling getExploreCommunities() - /api/client/explore/communities"
  );
  try {
    const response = await apiFetch<
      Array<{
        id: string;
        title: string;
        author: string;
        image: string;
        type: string;
        students: string;
        duration: string;
        units: number;
        level: string;
        currentPrice: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        points: Array<{ text: string }>;
      }>
    >("/api/client/explore/communities");
    console.log("✅ API Client: getExploreCommunities response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getExploreCommunities error:", error);
    throw error;
  }
}

export async function getExploreInstructors() {
  console.log(
    "🌐 API Client: Calling getExploreInstructors() - /api/client/explore/instructors"
  );
  try {
    const response = await apiFetch<
      Array<{
        id: string;
        name: string;
        avatar: string;
        specialty: string;
        rating: number;
        students: number;
        courses: number;
        bio: string;
      }>
    >("/api/client/explore/instructors");
    console.log("✅ API Client: getExploreInstructors response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getExploreInstructors error:", error);
    throw error;
  }
}

export async function getExploreSubscriptions() {
  console.log(
    "🌐 API Client: Calling getExploreSubscriptions() - /api/client/explore/subscriptions"
  );
  try {
    const response = await apiFetch<
      Array<{
        id: string;
        title: string;
        author: string;
        image: string;
        type: string;
        students: string;
        duration: string;
        units: number;
        level: string;
        currentPrice: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        points: Array<{ text: string }>;
      }>
    >("/api/client/explore/subscriptions");
    console.log("✅ API Client: getExploreSubscriptions response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getExploreSubscriptions error:", error);
    throw error;
  }
}

export async function getExploreBundles() {
  console.log(
    "🌐 API Client: Calling getExploreBundles() - /api/client/explore/bundles"
  );
  try {
    const response = await apiFetch<
      Array<{
        id: string;
        title: string;
        author: string;
        image: string;
        type: string;
        students: string;
        duration: string;
        units: number;
        level: string;
        currentPrice: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        points: Array<{ text: string }>;
      }>
    >("/api/client/explore/bundles");
    console.log("✅ API Client: getExploreBundles response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getExploreBundles error:", error);
    throw error;
  }
}

// My Learning API functions
export async function getMyLearningProducts() {
  console.log(
    "🌐 API Client: Calling getMyLearningProducts() - /api/client/my-learning/products"
  );
  try {
    const response = await apiFetch<
      Array<{
        id: string;
        image: string;
        type: string;
        status: string;
        title: string;
        price: string;
        students: string;
        lastActivity: string;
        enrolled: number;
        action: string;
        createdAt: string;
        updatedAt: string;
        members?: string;
        posts?: string;
        spaces?: string;
        certificates?: string;
        subscribers?: string;
        products?: string;
      }>
    >("/api/client/my-learning/products");
    console.log("✅ API Client: getMyLearningProducts response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getMyLearningProducts error:", error);
    throw error;
  }
}

export async function getMyLearningOrders() {
  console.log(
    "🌐 API Client: Calling getMyLearningOrders() - /api/client/my-learning/orders"
  );
  try {
    const response = await apiFetch<
      Array<{
        id: string;
        orderNumber: string;
        date: string;
        total: string;
        billing: {
          name: string;
          address: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
          };
        };
        products: Array<{
          id: string;
          type: string;
          title: string;
          image: string;
          stats: {
            [key: string]: {
              value: string | number;
              icon: string;
            };
          };
          labels: Array<{
            text: string;
            color: string;
          }>;
          actions: {
            primary: {
              text: string;
              href: string;
            };
          };
          progress?: number;
        }>;
        actions: Array<{
          text: string;
          icon: string;
        }>;
        footerLinks: Array<{
          icon: string;
          linkedTo: string;
          title: string;
          count?: string;
          href: string;
        }>;
      }>
    >("/api/client/my-learning/orders");
    console.log("✅ API Client: getMyLearningOrders response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getMyLearningOrders error:", error);
    throw error;
  }
}

export async function getMyLearningStats() {
  console.log(
    "🌐 API Client: Calling getMyLearningStats() - /api/client/my-learning/stats"
  );
  try {
    const response = await apiFetch<{
      totalProducts: number;
      totalOrders: number;
      completedCourses: number;
      inProgressCourses: number;
    }>("/api/client/my-learning/stats");
    console.log("✅ API Client: getMyLearningStats response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getMyLearningStats error:", error);
    throw error;
  }
}

// Learner Report API functions
export async function getLearnerReport() {
  console.log(
    "🌐 API Client: Calling getLearnerReport() - /api/client/learner-report"
  );
  try {
    const response = await apiFetch<{
      daysLearned: number[];
      bestLearningDay: number;
      minutesPerDay: { [key: number]: number };
      weeklyAverage: {
        MON: number;
        TUE: number;
        WED: number;
        THU: number;
        FRI: number;
        SAT: number;
        SUN: number;
      };
      totalTimeLearning: string;
      bestLearningDayInfo: string;
      learningDaysThisMonth: number;
      daysMoreThanLastMonth: number;
      bestDayOfWeek: string;
      leastStudyDay: string;
      badges: {
        gold: number;
        silver: number;
        bronze: number;
      };
      achievements: {
        coursesCompleted: number;
        certificatesClaimed: number;
        coursesInProgress: number;
        averageAssessmentScore: number;
      };
    }>("/api/client/learner-report");
    console.log("✅ API Client: getLearnerReport response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getLearnerReport error:", error);
    throw error;
  }
}

export async function getContentInProgress() {
  console.log(
    "🌐 API Client: Calling getContentInProgress() - /api/client/learner-report/content"
  );
  try {
    const response = await apiFetch<{
      inProgress: Array<{
        id: number;
        type: "course" | "session" | "community" | "certificate";
        title: string;
        image: string;
        author: {
          name: string;
          avatar: string;
        };
        progress: number;
        avatars: Array<{
          img: string;
          progress: number;
          tooltip: string;
        }>;
        duration?: string;
        enrollmentDate?: string;
        unitsCompleted?: number;
        totalUnits?: number;
      }>;
      completed: Array<{
        id: number;
        type: "course" | "session" | "community" | "certificate";
        title: string;
        image: string;
        author: {
          name: string;
          avatar: string;
        };
        progress: number;
        avatars: Array<{
          img: string;
          progress: number;
          tooltip: string;
        }>;
        duration?: string;
        enrollmentDate?: string;
        unitsCompleted?: number;
        totalUnits?: number;
      }>;
      certificates: Array<{
        id: number;
        type: "course" | "session" | "community" | "certificate";
        title: string;
        image: string;
        author: {
          name: string;
          avatar: string;
        };
        progress: number;
        avatars: Array<{
          img: string;
          progress: number;
          tooltip: string;
        }>;
      }>;
    }>("/api/client/learner-report/content");
    console.log("✅ API Client: getContentInProgress response:", response);
    return response;
  } catch (error) {
    console.error("❌ API Client: getContentInProgress error:", error);
    throw error;
  }
}
