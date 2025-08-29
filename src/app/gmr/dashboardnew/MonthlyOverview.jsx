'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import moment from 'moment';

const MonthlyOverview = ({ data }) => {
    // Return early if no data is available to prevent errors
    if (!data) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No Monthly Overview data available.</Typography>
                <Typography>Please apply filters to see the data.</Typography>
            </Paper>
        );
    }
    
    // Format data for charts
    const formattedAttendanceTrend = (data.dailyAttendanceTrend || []).map(d => ({
        ...d,
        date: moment(d.date).format('MMM D'), // Format date for display
        attendancePercentage: parseFloat(d.attendancePercentage.toFixed(1))
    }));

    // Data for the Late/Early bar chart. The utility provides totals, which we'll display here.
    const lateEarlyData = [
        { name: 'Incidents', 'Late Arrivals': data.monthlyLateEarlyPatterns?.late || 0, 'Early Departures': data.monthlyLateEarlyPatterns?.early || 0 }
    ];

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Key Metrics Cards */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Average Time in Office
                        </Typography>
                        <Typography variant="h4">{data.averageTimeAtOffice || '0.00'} Hours</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Average across all present employees in the selected date range.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Days with Lowest Attendance
                        </Typography>
                        <List dense>
                            {(data.daysWithLowestAttendance || []).map((day, index) => (
                                <ListItem key={index} disableGutters>
                                    <ListItemText
                                        primary={moment(day.date).format('MMMM Do, YYYY')}
                                        secondary={`Attendance: ${day.attendancePercentage.toFixed(1)}%`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Daily Attendance Trend Line Chart */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Daily Attendance Trend (%)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={formattedAttendanceTrend}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="attendancePercentage"
                                    name="Attendance %"
                                    stroke="#013976"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Monthly Late vs. Early Out Bar Chart */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Late Ins vs. Early Outs
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={lateEarlyData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Late Arrivals" fill="#FFC107" />
                                <Bar dataKey="Early Departures" fill="#2196F3" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default MonthlyOverview;
