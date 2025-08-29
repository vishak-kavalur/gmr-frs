"use client";
import Image from "next/image";
// import { clearStore, getStore } from "@/app/store";
import { useState, useEffect, useContext, } from "react";
import { usePathname } from 'next/navigation'
import { setStore, getStore } from "@/app/store";
import {
  Avatar,
  TextField,
  Fab,
  Typography,
  Button,
  Grid2 as Grid,
  Box,
  Alert,
  AlertTitle,
  Stack
} from "@mui/material";
import React from "react";

const Header = () => {

    const [companyName, setCompanyName] = useState('');
    const pathname = usePathname()

    useEffect(() => {
        console.log(pathname)
        // if (getStore("companyName")) {
        //     setCompanyName(getStore("companyName"))
        // } else 
        if (pathname.includes("/ihcl")) {
            setCompanyName("IHCL");
            setStore("companyName", "IHCL")
            setStore("themeColor", "#ad8b3a")
        } else if (pathname.includes("/protean")) {
            setCompanyName("PROTEAN");
            setStore("companyName", "PROTEAN");
            setStore("themeColor", "#5d5fef")
        } else if (pathname.includes("/nseit")) {
            setCompanyName("NSEIT");
            setStore("companyName", "NSEIT");
            setStore("themeColor", "#392e7f")
        } else if (pathname.includes("/upprpb")) {
            setCompanyName("UPPRPB");
            setStore("companyName", "UPPRPB");
            setStore("themeColor", "#392e7f")
        } else if (pathname.includes("/mhvb")) {
            setCompanyName("MHVB");
            setStore("companyName", "MHVB");
            setStore("themeColor", "#f36b30")
        } else if (pathname.includes("/ttd")) {
            setCompanyName("TTD");
            setStore("companyName", "TTD");
            setStore("themeColor", "#7b0406");
        } else if (pathname.includes("/idtech")) {
            setCompanyName("IDTECH");
            setStore("companyName", "IDTECH");
            setStore("themeColor", "#007cc3");
        } else if (pathname.includes("/gmr")) {
            setCompanyName("GMR");
            setStore("companyName", "GMR");
            setStore("themeColor", "#013976");
        } else if (pathname.includes("/csc")) {
            setCompanyName("CSC");
            setStore("companyName", "CSC");
            setStore("themeColor", "#1063ae");
        } else if (pathname.includes("/ipts")) {
            setCompanyName("IPTS");
            setStore("companyName", "IPTS");
            setStore("themeColor", "#00529c");
        } else if (getStore("companyName")) {
            setCompanyName(getStore("companyName"))
        } else{
            setCompanyName("BIOMETRIK")
        }
    },[])

    


    return (
        <>
        <Grid container spacing={1}  className="header">
            <Grid size={4} className="flex justify-start">
                {companyName === "IHCL" && (
                    <Image
                        src="/ihcl_logo.png"
                        alt="IHCL logo"
                        width={75}
                        height={38}
                        priority
                        className="ihclLogo"
                    />
                )}
                {companyName === "PROTEAN" && (
                    <Image
                        src="/protean_logo.png"
                        alt="Protean logo"
                        width={75}
                        height={38}
                        priority
                        className="proteanLogo"
                    />
                )}
                {companyName === "NSEIT" && (
                    <img
                        src="/nseit_logo.png"
                        alt="NSEIT logo"
                        width={75}
                        height={38}
                        priority
                        className="nseitLogo"
                    />
                )}
                {companyName === "IDTECH" && (
                    <img
                        src="/idtech.jpg"
                        alt="IDTECH logo"
                        width={75}
                        height={38}
                        priority
                        className="nseitLogo"
                    />
                )}
                {companyName === "UPPRPB" && (
                    <img
                        src="/upprpb.jpg"
                        alt="UPPRPB logo"
                        width={75}
                        height={38}
                        priority
                        className="upprpbLogo"
                    />
                )}
                {companyName === "MHVB" && (
                    <img
                        src="/mhvb_logo.png"
                        alt="MHVB logo"
                        width={75}
                        height={38}
                        priority
                        className="mhvbLogo"
                    />
                )}
                {companyName === "TTD" && (
                    <img
                        src="/ttd_logo.png"
                        alt="TTD logo"
                        priority
                        className="ttdLogo"
                    />
                )}
                {companyName === "GMR" && (
                    <img
                        src="/gmr.svg"
                        alt="GMR logo"
                        priority
                        className="gmrLogo"
                    />
                )}
                {companyName === "CSC" && (
                    <>
                    <img
                        src="/csc_logo.png"
                        alt="CSC logo"
                        priority
                        className="cscLogo"
                    />
                    </>
                )}
                {companyName === "IPTS" && (
                    <img
                        src="/dk_logo.png"
                        alt="ITS logo"
                        priority
                        className="iptsLogo"
                    />
                )}
            </Grid>
            <Grid size={4} className="flex justify-center">
                {companyName === "TTD" && (
                    <img
                        src="/ttd_center.png"
                        alt="TTD logo"
                        priority
                        style={{height:'60px', width:'auto'}}
                    />
                )}

                {companyName === "CSC" && (
                    <img
                        src="/csc_center.png"
                        alt="CSC logo"
                        priority
                        style={{height:'55px',
                                width:'auto',
                                position: 'relative',
                                top: '3px',
                            }}
                    />
                )}
            </Grid>
            <Grid size={4} className="flex justify-end">
                    {companyName == "UPPRPB" && (
                        <img
                            src="/sabhiv2.png"
                            alt="Biometrik logo"
                            width={75}
                            height={38}
                            priority
                            className="sabhivLogo"
                        />
                    )}
                    <img
                        src="/biometrik.png"
                        alt="Biometrik logo"
                        width={75}
                        height={38}
                        priority
                        className="biometrikLogo"
                    />
                    
            </Grid>
       </Grid>
       {/* <b>Booking ID: 009</b> */}
       </>
    );
}

export default Header;

