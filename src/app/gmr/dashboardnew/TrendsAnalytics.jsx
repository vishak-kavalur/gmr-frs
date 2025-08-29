'use client';

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import {
    BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Theme for MUIDataTable to match the GMR primary color scheme
const tabletheme = () => createTheme({
    components: {
        MUIDataTableToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#eaeaea',
                    color: '#013976',
                },
            }
        },
        MUIDataTableHeadCell: {
             styleOverrides: {
                root: {
                    backgroundColor: '#013976',
                    color: '#ffffff',
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                footer: {
                    backgroundColor: '#eaeaea',
                    color: '#013976',
                }
            }
        },
        MuiTablePagination: {
             styleOverrides: {
                root: {
                    color: '#013976',
                }
            }
        }
    }
});


const TrendsAnalytics = ({ data }) => {
    // Return early if no data is available
    if (!data || !data.weekdayVsWeekend) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No Trends & Analytics data available.</Typography>
                <Typography>Please apply filters to generate trend data.</Typography>
            </Paper>
        );
    }

    const { weekdayVsWeekend, mostPunctualEmployees, missingOutScansEmployees, correlationData } = data;

    // --- Data for Charts ---
    const barChartData = [
        { 
            name: 'Avg Attendance (%)', 
            Weekday: weekdayVsWeekend.weekdayAvgAttendance?.toFixed(1) || 0, 
            Weekend: weekdayVsWeekend.weekendAvgAttendance?.toFixed(1) || 0 
        },
        { 
            name: 'Avg Hours', 
            Weekday: weekdayVsWeekend.weekdayAvgHours?.toFixed(1) || 0, 
            Weekend: weekdayVsWeekend.weekendAvgHours?.toFixed(1) || 0
        },
    ];

    // --- MUIDataTable Configurations ---
    const punctualColumns = [
        { name: 'empName', label: 'Employee Name' },
        { name: 'punctualityScore', label: 'Punctuality Score (Lower is Better)' },
    ];
    
    const missingScansColumns = [
        { name: 'empName', label: 'Employee Name' },
        { name: 'empId', label: 'Employee ID' },
        { name: 'missingCount', label: 'Missing Count' },
    ];

    const tableOptions = {
        filter: false,
        selectableRows: 'none',
        responsive: 'standard',
        download: true,
        print: false,
        viewColumns: false,
        search: false,
        pagination: false,
        sort: false,
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Weekday vs Weekend Bar Chart */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Weekday vs. Weekend Patterns
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Weekday" fill="#013976" />
                                <Bar dataKey="Weekend" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Time Spent vs. Arrival Time Scatter Plot */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Time Spent vs. Avg. Arrival Time
                        </Typography>
                         <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="avgArrivalTime" name="Avg Arrival Time (hour)" unit=":00" domain={[7, 12]} />
                                <YAxis type="number" dataKey="avgDailyHours" name="Avg Daily Hours" unit=" hrs" />
                                <ZAxis dataKey="empName" name="Employee" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="Employees" data={correlationData || []} fill="#FF5722" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Punctual Employees Table */}
                <Grid item xs={12} md={6}>
                    <ThemeProvider theme={tabletheme()}>
                        <MUIDataTable
                            title={"Top 10 Most Punctual Employees"}
                            data={mostPunctualEmployees || []}
                            columns={punctualColumns}
                            options={tableOptions}
                        />
                    </ThemeProvider>
                </Grid>

                {/* Missing Out Scans Table */}
                <Grid item xs={12} md={6}>
                    <ThemeProvider theme={tabletheme()}>
                        <MUIDataTable
                            title={"Employees with Missing Out Scans"}
                            data={missingOutScansEmployees || []}
                            columns={missingScansColumns}
                            options={{ ...tableOptions, sortOrder: { name: 'missingCount', direction: 'desc'}}}
                        />
                    </ThemeProvider>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TrendsAnalytics;
