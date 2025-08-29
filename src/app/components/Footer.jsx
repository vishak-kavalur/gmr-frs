"use client";
import React, { useEffect, useState } from "react";
import { setStore, getStore } from "@/app/store";

const Footer = () => {
    const [isNSE, setIsNSE] = useState(false);

    useEffect(() => {
        if (getStore("companyName") == 'NSEIT') {
            setIsNSE(true);
        }
    },[]);

    return (
        <>
        <div className="footer">
           <p>Powered by Biometrik®. All rights reserved.</p>
        </div>
        {/* <img src="/tajicon.png" className="tajicon"/> */}
        </>
    );
}

export default Footer;