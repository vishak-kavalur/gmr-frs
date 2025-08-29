// @ts-nocheck
"use client"
import Image from "next/image";
import { useState, useEffect, useContext, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { AADHAAR_FACE } from "@/app/utils/constants";
import { setStore, getStore } from "@/app/store";
import Notify from "@/app/components/Alert";
import Loader from "@/app/components/Loader";
import Button from '@mui/material/Button';
import TransactionTable from "./TransactionTable";
import EmployeeTable from "./EmployeeTable";
import React from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
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
    Paper,
    Card,
    CardContent
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Papa from 'papaparse';
// import { FACE_DATA } from "@/app/utils/facedata";

const theme = createTheme({
  palette: {
    primary: {
      main: "#013976",
    },
  },
});



const CustomTabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}


const Dashboard = () => {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [loadingButton, setLoadingButton] = useState(false);
    
    const [devoteeList, setDevoteeList] = useState([]);
    const [showDevotees, setShowDevotees] = useState(false);

    const [searchPh, setSearchPh] = useState("");
    const [searchBid, setSearchBid] = useState("");
    const [error, setError] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [transactions, setStransactions] = useState([]);
    const [showTransactions, setShowTransactions] = useState(false);

    const [tab, setTab] = useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
        setError(false);
    };

    useEffect(() => {
    },[])

    const getEmployeeDetails = async() => {
        setError(false);
        setDevoteeList([]);
        if(!searchPh) {
            setError(true);
            return;
        }

        setLoadingButton(true);
        try {
            const response = await fetch(`/api/gmr/employee/?empId=${searchPh}`, {
              method: 'GET', // Using GET as in the curl command
              headers: {
                'Content-Type': 'application/json', // Optional, can be omitted if not required
              },
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                if(responseData.status == 'success') {
                    setDevoteeList(responseData.data);
                    setShowDevotees(true);
                } else {
                    setShowDevotees(false);
                    showNotification("error", "Failed to fetch Employee details:", responseData.message || 'Unknown error');
                }
                
            } else {
                const errorData = await response.json();
                console.log(errorData);
                showNotification("error", "Failed to fetch Employee details:", errorData.message || 'Unknown error');
            }
            } catch (error) {
                console.error('Error fetching Employee Details:', error);
                showNotification("error", "Error", "An error occurred while fetching Employee Details");
            } finally {
                setLoadingButton(false);
            }
    }


    const getEmployeeTransactions = async() => {
        setError(false);
        // if(!startDate && !endDate && !searchPh) {
        //     setError(true);
        //     return;
        // }
        setStransactions(false);
        setLoadingButton(true);
        console.log("startDate", startDate, "endDate", endDate);
       
        try {
            const response = await fetch(`/api/gmr/transactions?startDate=${startDate}&endDate=${endDate}&empId=${searchPh}`, {
              method: 'GET', // Using GET as in the curl command
              headers: {
                'Content-Type': 'application/json', // Optional, can be omitted if not required
              },
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                if(responseData.status == 'success') {
                    setStransactions(responseData.data);
                    setShowTransactions(true);
                } else {
                    showNotification("error", "Failed to fetch transactions:", responseData.message || 'Unknown error');
                    setShowTransactions(false);
                }
                
            } else {
                const errorData = await response.json();
                console.log(errorData);
                showNotification("error", "Failed to fetch transactions:", errorData.message || 'Unknown error');
                setShowTransactions(false);
            }
            } catch (error) {
                console.error('Error fetching transaction Details:', error);
                showNotification("error", "Error", "An error occurred while fetching Transactions");
                setShowTransactions(false);
            } finally {
                setLoadingButton(false);
            }
    }

    /* Notification Alert Start */
    const [openAlert, setOpenAlert] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const showNotification = (type, title, message) => {
        setTitle(title);
        setType(type);
        setAlertMessage(message);
        setOpenAlert(true);
    }

    /* Notification Alert End */

    const uploadData = async(fileData, index=0) => {
        // setLoading(true);
        setMessage("Uploading data...");
        console.log(fileData);
        // return;
        try {
            const response = await fetch(`/api/ttd/bulk`, {
              method: 'POST', // Using GET as in the curl command
              headers: {
                'Content-Type': 'application/json', // Optional, can be omitted if not required
              },
              body: JSON.stringify(fileData)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                if(responseData.status == 'success') {
                    console.log(index, "success", "Success", "File Uploaded Successfully");
                } else {
                    console.log(index, "error", "Failed to upload file:", responseData.message || 'Unknown error');
                }
                
            } else {
                const errorData = await response.json();
                // console.log(errorData);
                console.log(index, "error", "Failed to upload file:", errorData.message || 'Unknown error');
            }
            } catch (error) {
                // console.error(index, 'Error uploading file:', error);
                console.log(index, "error", "Error", "An error occurred while uploading file");
            } finally {
                // setLoading(false);
            }
    }


    let fileData = [];
    const handleFileUpload = (event) => {
        fileData = [];
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
            const reader = new FileReader();
            reader.onload =  (e) => {
                const csvData = e.target.result;
                Papa.parse(csvData, {
                    complete: async (results) => {
                        console.log("Parsed CSV file:", results.data);
                        setLoading(true);
                        results.data.forEach(async (item, index) => {
                            if(item.devoteeName) {
                                fileData.push({
                                    _id: item.devoteeName,
                                    devoteeName: item.devoteeName,
                                    devoteeImage: item.devoteeImage,
                                    govtId: "XXX XXX XXX",
                                    phoneNumber: "XXXXXXXXXX",
                                    darshanType: "SARVA",
                                    darshanDate: moment(item.darshanDate).format('DD-MM-YYYY'),
                                    darshanTimeSlot: moment(item.darshanDate).format('h:mm a'),
                                    darshanLocationId: "XX",
                                    devoteeAge: "XX",
                                    devoteeGender: "XX",
                                });
                            }
                            // await uploadData({
                            //     devoteeName: item.devoteeName,
                            //     devoteeImage: item.devoteeImage,
                            //     govtId: "XXX XXX XXX",
                            //     phoneNumber: "XXXXXXXXXX",
                            //     darshanType: "SARVA",
                            //     darshanDate: "08-05-2025",
                            //     darshanTimeSlot: "SSD",
                            //     darshanLocationId: "XX",
                            //     devoteeAge: "XX",
                            //     devoteeGender: "XX",
                            // }, index+1);
                        });
                        setLoading(false);
                        console.log("File data to be uploaded:", fileData);
                        await uploadData(fileData, 1);
                        // console.log("Parsed CSV data:", fileData);
                        showNotification("success", "File Uploaded", "CSV file uploaded and parsed successfully.");
                    },
                    header: true // Set to true if the CSV has headers
                });
            };
            reader.readAsText(file);
        } else {
            showNotification("error", "Invalid File", "Please upload a valid CSV file.");
        }
    };

    // convert image to json body
    const bulkUpload = async (event) => {
        const files = event.target.files;

        await Array.from(files).forEach(file => {
            if (file.type === 'image/jpeg') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64Image = e.target.result.split(',')[1];
                    fileData.push({
                        _id: file.name.split('.')[0],
                        devoteeName: file.name.split('.')[0],
                        devoteeImage: base64Image,
                        govtId: "XXX XXX XXX",
                        phoneNumber: "XXXXXXXXXX",
                        darshanType: "SARVA",
                        darshanDate: "XX-XX-XXXX",
                        darshanTimeSlot: "SSD",
                        darshanLocationId: "XX",
                        devoteeAge: "XX",
                        devoteeGender: "XX",
                    });
                };
                reader.readAsDataURL(file);
            }
        });
        console.log(fileData);
    }

    return (
        <ThemeProvider theme={theme}>
        <div className="dataTable">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Employee Details" />
                    <Tab label="Transactions" />
                    {/* <Tab label="Bulk Upload" /> */}
                    </Tabs>
                </Box>

                {/* Employee Details  */}
                <CustomTabPanel value={tab} index={0}>
                    <Box className="flex lg:flex-row flex-col">
                        <TextField
                            label="Employee ID"
                            id="outlined-size-small"
                            value={searchPh}
                            size="small"
                            onChange={(e)=>setSearchPh(e.target.value)}
                            autoComplete='off'
                            style={{margin:'5px'}}
                        />
                        <LoadingButton
                            // size="small"
                            onClick={getEmployeeDetails}
                            endIcon={<SendIcon />}
                            loading={loadingButton}
                            loadingPosition="end"
                            variant="outlined"
                            style={{margin:'5px'}}
                        >
                        Fetch Details
                        </LoadingButton>
                    </Box>
                    {error  &&
                        <Typography variant="subtitle2" color="error" style={{marginTop:'5px'}} gutterBottom>
                            Please fill out all the fields!
                        </Typography>
                    }
                    {devoteeList?.length && devoteeList?.length > 0? <>
                    <EmployeeTable
                        tabledata={devoteeList}
                    /></>
                    :
                    <>
                    {showDevotees &&
                        <Typography variant="subtitle2"  sx={{background:'#fff', padding:'0px 15px 15px'}}>
                            No records present!
                        </Typography>
                     }
                    </>}
                </CustomTabPanel>

                {/* Devotee Transaction */}
                <CustomTabPanel value={tab} index={1}>
                    <Box className="flex lg:flex-row flex-col dashboardBox">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <TextField
                            label="Employee ID"
                            id="outlined-size-small"
                            value={searchPh}
                            size="small"
                            onChange={(e)=>setSearchPh(e.target.value)}
                            autoComplete='off'
                            style={{margin:'5px'}}
                        />
                        <DatePicker
                            size="small"
                            className="transDateClass"
                            label="Start Date"
                            variant="outlined"
                            name="start_date"
                            // value={startDate}
                            // defaultValue={moment().format("DD-MM-YYYY")}
                            sx={{m:'5px'}}
                            maxDate={moment(new Date())}
                            onChange={(date) => {
                                if (!isNaN(moment(date).format("x"))) {
                                    setStartDate(moment(date).format("x"));
                                } else {
                                    setStartDate('')
                                }
                            }}
                            slotProps={{ field: { clearable: true } }}
                        />

                        <DatePicker
                            size="small"
                            className="transDateClass"
                            label="End Date"
                            variant="outlined"
                            name="end_date"
                            // value={endDate}
                            // defaultValue={moment().format("DD-MM-YYYY")}
                            sx={{m:'5px'}}
                            maxDate={moment(new Date())}
                            onChange={(date) => {
                                if (!isNaN(moment(date).format("x"))) {
                                    setEndDate(moment(date).format("x"));
                                } else {
                                    setEndDate('')
                                }
                            }}
                            slotProps={{ field: { clearable: true } }}
                        />
                        <LoadingButton
                            onClick={getEmployeeTransactions}
                            endIcon={<SendIcon />}
                            loading={loadingButton}
                            loadingPosition="end"
                            variant="outlined"
                            style={{margin:'5px'}}
                        >
                        Fetch Transactions
                        </LoadingButton>
                    </LocalizationProvider>
                    </Box>
                    {error  &&
                    <Typography variant="subtitle2" color="error" style={{marginTop:'5px'}} gutterBottom>
                        Please enter atleast one field!
                    </Typography>
                    }
                    {transactions?.length && transactions?.length > 0? <>
                    <TransactionTable
                        tabledata={transactions}
                    /></>
                    :
                    <>
                    {showTransactions &&
                        <Typography variant="subtitle2"  sx={{background:'#fff', padding:'0px 15px 15px'}}>
                            No Transactions present for the guest
                        </Typography>
                     }
                    </>}
                </CustomTabPanel>

                {/* Bulk Upload */}
                <CustomTabPanel value={tab} index={2}>
                    {/* <Paper>
                        <Box className="flex lg:flex-row flex-col">
                            <Button
                                variant="contained"
                                component="label"
                                style={{margin:'5px'}}
                            >
                                Upload CSV
                                <input
                                    type="file"
                                    accept=".csv"
                                    hidden
                                    onChange={handleFileUpload}
                                />
                            </Button>
                            <input
                                type="file"
                                accept="image/jpeg"
                                multiple
                                onChange={bulkUpload}
                            />
                        </Box>
                    </Paper> */}
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Button
                                variant="contained"
                                component="label"
                                style={{margin:'5px'}}
                            >
                                Upload CSV
                                <input
                                    type="file"
                                    accept=".csv"
                                    hidden
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </CardContent>
                    </Card>
                    {/* <Divider />
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Button
                                variant="contained"
                                component="label"
                                style={{margin:'5px'}}
                            >
                                Upload Images
                                <input
                                    type="file"
                                    accept="image/jpeg"
                                    multiple
                                    hidden
                                    onChange={bulkUpload}
                                />
                            </Button>
                            <Button
                                variant="contained"
                                component="label"
                                style={{margin:'5px'}}
                            >Add Face Data</Button>
                        </CardContent>
                    </Card> */}
                    <Divider />
                </CustomTabPanel>
            </Box>
            {/* ALERT */}
            {openAlert &&
                <Notify 
                    openAlert={openAlert}
                    setOpenAlert={setOpenAlert}
                    type={type}
                    title={title}
                    alertMessage={alertMessage}
                />
            }
            {/* Backdrop / Loading */}
            <Loader
                loading={loading}
                message={message}
            />


        </div>
        </ThemeProvider>
    );
}

export default Dashboard;
