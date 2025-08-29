// @ts-nocheck
"use client"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    Autocomplete,
    Typography,
    Grid2 as Grid,
    Avatar,
    Divider,
    Container,
} from "@mui/material";

import { setStore, getStore } from "@/app/store";
import React, { useEffect, useState } from "react";

const Loader = ({bookingId, name, phone, gender, address, dob, image, showBooking = true}) => {
    const [companyName, setCompanyName] = useState('');
    useEffect(() => {
        if (getStore("companyName")) {
            setCompanyName(getStore("companyName"))
        }
    },[])
    return (
        <Container maxWidth="md" className="flex justify-center" style={{marginTop:'25px', padding:'0'}}>
          <div className="w-full  p-4 border shadow-xs rounded-lg bg-white">
            <Grid container spacing={2} style={{marginTop:'10px'}}>
              <Grid size={{ xs: 12, md: 3 }} className="flex justify-center">
                <Avatar
                  alt="Aadhaar photo"
                  variant="square"
                  src={'data:image/jpeg;base64,'+image}
                  sx={{ width: 150, height: 150 }}
                />
              </Grid>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Grid size={{ xs: 12, md: 8 }} container rowSpacing={{ xs: 1, sm: 0, md: 0 }} direction>
                {showBooking && companyName === "IHCL" &&
                <Grid size={{ xs: 6, md: 12 }} container rowSpacing={0}>
                    <Grid size={{ xs: 12, md: 3 }}>Booking ID</Grid>
                    <Grid size={{ xs: 12, md: 8 }} className="font500">{bookingId}</Grid>
                </Grid>
                }

                <Grid size={{ xs: 6, md: 12 }} container rowSpacing={0}>
                    <Grid size={{ xs: 12, md: 3 }}>Name</Grid>
                    <Grid size={{ xs: 12, md: 8 }} className="font500">{name}</Grid>
                </Grid>

                <Grid size={{ xs: 6, md: 12 }} container rowSpacing={0}>
                    <Grid size={{ xs: 12, md: 3 }}>Phone</Grid>
                    <Grid size={{ xs: 12, md: 8 }} className="font500">{phone}</Grid>
                </Grid>

                <Grid size={{ xs: 6, md: 12 }} container rowSpacing={0}>
                    <Grid size={{ xs: 12, md: 3 }}>DOB</Grid>
                    <Grid size={{ xs: 12, md: 8 }} className="font500">{dob}</Grid>
                </Grid>

                <Grid size={{ xs: 6, md: 12 }} container rowSpacing={0}>
                    <Grid size={{ xs: 12, md: 3 }}>Gender</Grid>
                    <Grid size={{ xs: 12, md: 8 }} className="font500">{gender}</Grid>
                </Grid>

                <Grid size={{ xs: 12, md: 12 }} container rowSpacing={0}>
                    <Grid size={{ xs: 12, md: 3 }}>Address</Grid>
                    <Grid size={{ xs: 12, md: 8 }} className="font500">{address}</Grid>
                </Grid>
              </Grid>
            </Grid>
            </div>
            </Container>
    );
}

export default Loader;