"use client"
import React,{ useState, useContext } from "react";
import {
  Avatar,
  TextField,
  Fab,
  Typography,
  IconButton,
  Grid2 as Grid,
  AlertTitle,
  Alert,
  Snackbar
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Delete';

const Notify = ({openAlert, setOpenAlert ,type, title, alertMessage}) => {

    

    const handleClose = () => {
        setOpenAlert(false);
    }
   
    return (
        <div className="">
            <Snackbar 
                open={openAlert}
                onClose={handleClose}
                // autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                style={{ minWidth: "300px", zIndex: '9999' }}
            >
                <Alert
                    severity={type || "error"}
                    sx={{ width: '100%' }}
                     onClose={handleClose}
                >
                   <AlertTitle>{title}</AlertTitle>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Notify;