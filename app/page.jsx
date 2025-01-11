"use client";
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Login = () => {
  const { status } = useSession();
  const router = useRouter();
  const [statusState, setStatusState] = useState(null);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    setStatusState(status);
    // Ensure that the effect only runs once the session status is resolved
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <>
      {statusState === "loading" ? (
        <div>Loading...</div>
      ) : statusState === "unauthenticated" ? (
        <div className="bg-gray-900 w-screen h-screen flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full sm:w-96 text-center">
            <h2 className="text-3xl font-semibold text-gray-100 mb-6">Welcome to the Admin Panel</h2>
            <p className="text-gray-400 mb-6">Please log in to continue</p>
            <button
              onClick={() => signIn("google")}
              className="w-full text-xl p-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-100 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center"
            >
              <span className="px-4 py-2 rounded-lg flex items-center justify-center">
                <Image
                  src={"/assets/g_logo.png"}
                  width={30}
                  height={30}
                  alt="Google Logo"
                  className="inline-block mr-2"
                />
                Login with Google
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default Login;
