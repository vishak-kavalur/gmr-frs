'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, Divider, Avatar } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import moment from 'moment';

const EmployeeWiseDetail = ({ data }) => {
    // Return early if no data is available (i.e., no employee selected)
    if (!data) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">Please select an Employee ID from the filters to view details.</Typography>
                <Typography>This tab will populate once an employee is specified.</Typography>
            </Paper>
        );
    }

    const { employeeProfile, totalDaysPresent, avgHoursPerDay, dailyTimeline, anomalies } = data;

    // Format data for the line chart, converting totalHours string to a number
    const chartData = (dailyTimeline || []).map(day => ({
        date: moment(day.date).format('MMM D'),
        'Total Hours': parseFloat(day.totalHours) || 0,
    }));

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Employee Profile Section */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                                    {employeeProfile.empName.charAt(0)}
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h5" fontWeight="bold">{employeeProfile.empName}</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    ID: {employeeProfile.empId} | Department: {employeeProfile.department}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Box textAlign="center" mx={2}>
                                    <Typography variant="h6">Total Days Present</Typography>
                                    <Typography variant="h4" color="primary">{totalDaysPresent}</Typography>
                                </Box>
                            </Grid>
                             <Grid item>
                                <Box textAlign="center" mx={2}>
                                    <Typography variant="h6">Avg. Hours / Day</Typography>
                                    <Typography variant="h4" color="primary">{avgHoursPerDay}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                
                {/* Daily Total Time Line Chart */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Daily Total Time Spent (Hours)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Total Hours"
                                    stroke="#013976"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Daily Timeline and Anomalies */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                        <Typography variant="h6">Daily Timeline</Typography>
                        <List dense>
                            {(dailyTimeline || []).map((day, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${moment(day.date).format('MMMM Do, YYYY')} - Status: ${day.status}`}
                                            secondary={`In: ${day.inTime}, Out: ${day.outTime}, Total: ${day.totalHours} hrs`}
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                        <Typography variant="h6">Detected Anomalies</Typography>
                         <List dense>
                            {(anomalies && anomalies.length > 0) ? anomalies.map((anomaly, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={anomaly} />
                                </ListItem>
                            )) : (
                                <ListItem>
                                    <ListItemText primary="No anomalies detected in the selected period." />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default EmployeeWiseDetail;
