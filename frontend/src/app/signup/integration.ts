export async function signupUser({
  fullName,
  email,
  password,
  role,
  avatarUrl,
  learnworldsUser,
}: {
  fullName: string;
  email: string;
  password: string;
  role: string;
  avatarUrl?: string;
  learnworldsUser?: string;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005"}/api/auth/signup`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        role,
        avatarUrl,
        learnworldsUser,
      }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      // Throw the backend error so the frontend can catch and display it
      throw new Error(data.error || "Registration failed");
    }
    console.log("Signup response:", data);
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
