'use client';

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
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


const DepartmentWiseInsights = ({ data }) => {
    // Return early if no data is available to prevent errors
    if (!data || data.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No Department-wise data available.</Typography>
                <Typography>Please apply filters to see the data. A department filter might be affecting this view.</Typography>
            </Paper>
        );
    }
    
    // --- MUIDataTable Configuration ---
    const columns = [
        { name: 'name', label: 'Department Name' },
        { name: 'totalEmployees', label: 'Total Employees' },
        { name: 'present', label: 'Present' },
        { name: 'absent', label: 'Absent' },
        { name: 'late', label: 'Late' },
        { name: 'avgHours', label: 'Avg. Hours' },
        { name: 'issues', label: 'Issues' },
    ];
    
    const options = {
        filter: true,
        selectableRows: 'none',
        responsive: 'standard',
        download: true,
        print: false,
        viewColumns: true,
        sortOrder: {
            name: 'issues',
            direction: 'desc'
        }
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Department Attendance Status Stacked Bar Chart */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Department Attendance Status
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="present" stackId="a" name="Present" fill="#4CAF50" />
                                <Bar dataKey="absent" stackId="a" name="Absent" fill="#F44336" />
                                <Bar dataKey="late" stackId="a" name="Late" fill="#FFC107" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Department Summary Table */}
                <Grid item xs={12}>
                     <ThemeProvider theme={tabletheme()}>
                        <MUIDataTable
                            title={"Department Overview"}
                            data={data}
                            columns={columns}
                            options={options}
                        />
                    </ThemeProvider>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DepartmentWiseInsights;
