'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import {
    PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
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


const DailyOverview = ({ data }) => {
    // Return early if no data is available to prevent errors
    if (!data) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No Daily Overview data available.</Typography>
                <Typography>Please apply filters to see the data.</Typography>
            </Paper>
        );
    }

    // --- Data for Charts ---
    const pieChartData = [
        { name: 'Present', value: data.present || 0 },
        { name: 'Absent', value: data.absent || 0 },
        { name: 'Late', value: data.late || 0 },
        { name: 'Early Leave', value: data.earlyLeave || 0 },
    ];
    const PIE_COLORS = ['#4CAF50', '#F44336', '#FFC107', '#2196F3']; // Green, Red, Amber, Blue

    // Process dailyEmployeeStatus to create check-in distribution by hour
    const checkInHourDistribution = (data.dailyEmployeeStatus || []).reduce((acc, curr) => {
        if (curr.inTime && curr.inTime !== 'N/A') {
            const hour = curr.inTime.split(':')[0]; // '09:30' -> '09'
            const hourLabel = `${hour}:00`;
            const existing = acc.find(item => item.hour === hourLabel);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ hour: hourLabel, count: 1 });
            }
        }
        return acc;
    }, []).sort((a,b) => a.hour.localeCompare(b.hour));


    // --- MUIDataTable Configuration ---
    const columns = [
        { name: 'empName', label: 'Name' },
        { name: 'department', label: 'Department' },
        { name: 'inTime', label: 'In Time' },
        { name: 'outTime', label: 'Out Time' },
        { name: 'totalHours', label: 'Total Time (Hrs)' },
        { name: 'status', label: 'Status' },
    ];

    const options = {
        filter: true,
        selectableRows: 'none',
        responsive: 'standard',
        download: true,
        print: false,
        viewColumns: true,
    };

    return (
        <Box>
            <Grid container spacing={3}>
                 {/* Top Summary Cards */}
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Total Employees</Typography>
                        <Typography variant="h4" color="primary">{data.totalEmployees}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Present</Typography>
                        <Typography variant="h4" color="success.main">{data.present}</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} sm={6} md={2.4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Absent</Typography>
                        <Typography variant="h4" color="error.main">{data.absent}</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} sm={6} md={2.4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Late</Typography>
                        <Typography variant="h4" color="warning.main">{data.late}</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} sm={6} md={2.4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Currently In</Typography>
                        <Typography variant="h4" color="info.main">{data.whoIsInNow?.length || 0}</Typography>
                    </Paper>
                </Grid>

                {/* Charts */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Attendance Status</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Check-in Time Distribution</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={checkInHourDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#013976" name="Check-ins" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                 {/* Top Performers Lists */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6">Top 5 Early Birds</Typography>
                        <List dense>
                            {(data.topEarlyBirds || []).map((emp, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={emp.empName} secondary={`Checked in at ${emp.inTime}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6">Top 5 Late Comers</Typography>
                        <List dense>
                            {(data.topLateComers || []).map((emp, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={emp.empName} secondary={`Checked in at ${emp.inTime}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Employee Daily Status Table */}
                <Grid item xs={12}>
                     <ThemeProvider theme={tabletheme()}>
                        <MUIDataTable
                            title={"Today's Employee Status"}
                            data={data.dailyEmployeeStatus || []}
                            columns={columns}
                            options={options}
                        />
                    </ThemeProvider>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DailyOverview;

