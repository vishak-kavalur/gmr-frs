"use client";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import { digiUrl } from "./utils/constants";
import Loader from "./components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { setStore, getStore } from "@/app/store";


const Home = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const handleProceed = () => {
    // setLoading(true);
    // setMessage("Please wait while we fetch details!");
    window.open(digiUrl, "_self");
    // window.location.href="/generate?code=123";
  };

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(()=>{
    let phone = searchParams.get("ph");
    let bookingID = searchParams.get("bid");
    if(phone && bookingID) {
      setStore("phone", phone);
      setStore("booking", bookingID);
    } else {
      setError(true);
    }
  },[]);


  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center items-start">
          <Image
            src="/biometrik.png"
            alt="Biometric logo"
            width={300}
            height={38}
            priority
          />
          <Typography variant="overline" gutterBottom>
            Streamlined Identity Solutions for a Smarter World.
          </Typography>
        </main>
        {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <p>Copyright © 2025 Biometrik®. All rights reserved.</p>
        </footer> */}
      </div>
      {/* Backdrop / Loading */}
      <Loader loading={loading} message={message} />
    </>
  );
};

export default Home;