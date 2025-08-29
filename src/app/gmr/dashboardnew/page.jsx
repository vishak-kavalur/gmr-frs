'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Paper,
    Typography,
    Grid,
    TextField,
    Autocomplete,
    Box,
    Tabs,
    Tab,
    ThemeProvider,
    createTheme,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import moment from 'moment';

// Custom components
import Loader from '@/app/components/Loader';
import Notify from '@/app/components/Alert';

// Data processing utility and dummy data
import { processAttendanceData } from './attendanceUtils';
import dummyEmployeesData from '@/app/utils/dummy_employees.js';
import dummyTransactionsData from '@/app/utils/dummy_transactions.js';

// --- Dashboard Section Components ---
import DailyOverview from './DailyOverview';
import MonthlyOverview from './MonthlyOverview';
import DepartmentWiseInsights from './DepartmentWiseInsights';
import EmployeeWiseDetail from './EmployeeWiseDetail';
import TrendsAnalytics from './TrendsAnalytics';

// --- Placeholder Section Components ---
// These will be replaced with actual implementations later.
// const DailyOverview = ({ data }) => (
//     <Box><Typography variant="h5">Daily Overview</Typography>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No data available.</p>}</Box>
// );
// const MonthlyOverview = ({ data }) => (
//     <Box><Typography variant="h5">Monthly Overview</Typography>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No data available.</p>}</Box>
// );
// const DepartmentWiseInsights = ({ data }) => (
//     <Box><Typography variant="h5">Department-wise Insights</Typography>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No data available.</p>}</Box>
// );
// const EmployeeWiseDetail = ({ data }) => (
//     <Box><Typography variant="h5">Employee-wise Detail</Typography>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No data available.</p>}</Box>
// );
// const TrendsAnalytics = ({ data }) => (
//     <Box><Typography variant="h5">Trends & Analytics</Typography>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No data available.</p>}</Box>
// );
// --- End Placeholder Components ---


// Constants
const DEPARTMENTS = ["HR", "IT", "Finance", "Operations", "Marketing", "Sales", "Engineering"];
const OFFICE_HOURS_START = 9;
const OFFICE_HOURS_END = 17;
const LATE_THRESHOLD_MINUTES = 15;
const EARLY_LEAVE_THRESHOLD_MINUTES = 15;


// MUI Theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#013976',
        },
    },
});

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Dashboard = () => {
    // State Management
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [loadingButton, setLoadingButton] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showData, setShowData] = useState(false);
    const [searchEmpId, setSearchEmpId] = useState('');
    const [searchDepartment, setSearchDepartment] = useState(null);
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
    const [endDate, setEndDate] = useState(moment());
    const [tab, setTab] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState('info');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [useDummyData, setUseDummyData] = useState(true);
    const [processedChartData, setProcessedChartData] = useState({});

    // Notification handler
    const showNotification = (type, title, message) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setOpenAlert(true);
    };

    // Data fetching and processing logic
    const fetchData = useCallback(async () => {
        setLoadingButton(true);
        setLoading(true);
        setMessage('Loading attendance data...');
        setShowData(false);
        setProcessedChartData({});

        try {
            let employees = [];
            let allTransactions = [];

            if (useDummyData) {
                employees = dummyEmployeesData;
                allTransactions = dummyTransactionsData;
                showNotification('success', 'Dummy Data Loaded', 'Displaying statically loaded dummy data.');
            } else {
                setMessage('Fetching live data from API...');
                // Fetch employees
                const empRes = await fetch('/api/gmr/employee');
                if (!empRes.ok) throw new Error(`Failed to fetch employees: ${empRes.statusText}`);
                employees = await empRes.json();
                
                // Fetch transactions
                const transRes = await fetch(`/api/gmr/transactions?startDate=${startDate.valueOf()}&endDate=${endDate.valueOf()}`);
                if (!transRes.ok) throw new Error(`Failed to fetch transactions: ${transRes.statusText}`);
                allTransactions = await transRes.json();
                
                showNotification('success', 'Live Data Loaded', 'Successfully fetched live data from the server.');
            }
            
            setEmployeeList(employees);
            setTransactions(allTransactions);
            
            setMessage('Processing data for dashboard...');
            const processedData = processAttendanceData(
                employees,
                allTransactions,
                { startDate, endDate, searchEmpId, searchDepartment: searchDepartment },
                OFFICE_HOURS_START,
                OFFICE_HOURS_END,
                LATE_THRESHOLD_MINUTES,
                EARLY_LEAVE_THRESHOLD_MINUTES
            );

            setProcessedChartData(processedData);
            setShowData(true);

        } catch (error) {
            console.error('Data fetching or processing error:', error);
            showNotification('error', 'Error', error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
            setLoadingButton(false);
            setMessage('');
        }
    }, [startDate, endDate, searchEmpId, searchDepartment, useDummyData]);
    
    // Initial data load on mount
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to run only on mount. Subsequent fetches are manual via button.


    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
                    <Loader open={loading} message={message} />
                    <Notify
                        open={openAlert}
                        onClose={() => setOpenAlert(false)}
                        type={alertType}
                        title={alertTitle}
                        message={alertMessage}
                    />
                    <Typography variant="h6" gutterBottom>
                        Attendance Dashboard
                    </Typography>

                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Employee ID"
                                    value={searchEmpId}
                                    onChange={(e) => setSearchEmpId(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Autocomplete
                                    options={DEPARTMENTS}
                                    value={searchDepartment}
                                    onChange={(event, newValue) => {
                                        setSearchDepartment(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Department" />}
                                />
                            </Grid>
                             <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={useDummyData}
                                            onChange={(e) => setUseDummyData(e.target.checked)}
                                            name="useDummyData"
                                            color="primary"
                                        />
                                    }
                                    label="Use Dummy Data"
                                />
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                                <LoadingButton
                                    variant="contained"
                                    onClick={fetchData}
                                    loading={loadingButton}
                                    size="large"
                                >
                                    Apply Filters
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tab} onChange={handleTabChange} aria-label="dashboard sections">
                                <Tab label="Daily Overview" />
                                <Tab label="Monthly Summary" />
                                <Tab label="Department Insights" />
                                <Tab label="Employee Detail" />
                                <Tab label="Trends & Analytics" />
                            </Tabs>
                        </Box>

                        {!showData && !loading && (
                             <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6">Apply filters to load attendance data!</Typography>
                            </Box>
                        )}

                        {showData && (
                            <>
                                <CustomTabPanel value={tab} index={0}>
                                    <DailyOverview data={processedChartData.dailySummary} />
                                </CustomTabPanel>
                                <CustomTabPanel value={tab} index={1}>
                                    <MonthlyOverview data={processedChartData.monthlySummary} />
                                </CustomTabPanel>
                                <CustomTabPanel value={tab} index={2}>
                                    <DepartmentWiseInsights data={processedChartData.departmentInsights} />
                                </CustomTabPanel>
                                <CustomTabPanel value={tab} index={3}>
                                    <EmployeeWiseDetail data={processedChartData.employeeDetail} />
                                </CustomTabPanel>
                                <CustomTabPanel value={tab} index={4}>
                                    <TrendsAnalytics data={processedChartData.trendsAnalytics} />
                                </CustomTabPanel>
                            </>
                        )}

                    </Box>
                </Container>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default Dashboard;

