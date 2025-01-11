"use client"
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
    console.log(status)
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
        <div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
          <button
            onClick={() => signIn("google")}
            className="text-center p-4 text-xl rounded-lg bg-white hover:scale-110 hover:font-semibold transition-all hover:shadow-2xl"
          >
            <span className="bg-white px-4 py-2 rounded-lg">
              Login with Google
              <Image
                src={"/assets/g_logo.png"}
                width={30}
                height={30}
                alt="Google Logo"
                className="inline-block ml-2"
              />
            </span>
          </button>
        </div>
      ) : (router.refresh() && null)}
    </>
  );


}

export default Login;
