// @ts-nocheck
"use client"
import createCache from "@emotion/cache";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button,
	Chip, Grid2 as Grid, IconButton,
	List,
	ListItem,
	ListItemText,
	TableCell,
	TableRow,
	Tooltip,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	DialogActions,
	Typography,
	Avatar
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { setStore, getStore } from "@/app/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import React from "react";
import { useState, useMemo, useEffect } from "react";
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import Transactions from "./Transactions";



const tabletheme = () => createTheme({
	palette: {
		primary: {
		main: '#013976',
		}
	},
	components: {
        MuiToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: '#eaeaea',
			  color: '#013976',
			  minHeight: '40px !important',
			  // If you're using IconButton and want to target icons inside them
			  '& .MuiIconButton-root .MuiSvgIcon-root': {
				color: '#013976', // Desired icon color for IconButtons
			  },
            },
          },
        },
        MuiTableFooter: {
          styleOverrides: {
            root: {
                backgroundColor: '#eaeaea',
				color: '#013976'
            },
          },
        },
      },
});

const style = {
  p: 0,
  width: '100%',
  maxWidth: 360,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};
const TransactionTable = ({tabledata}) => {

	const [responsive, setResponsive] = useState("standard");
	const [tableBodyHeight, setTableBodyHeight] = useState("100%");
	const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("100%");
	const [searchBtn, setSearchBtn] = useState(true);
	const [downloadBtn, setDownloadBtn] = useState(true);
	const [printBtn, setPrintBtn] = useState(false);
	const [viewColumnBtn, setViewColumnBtn] = useState(true);
	const [filterBtn, setFilterBtn] = useState(true);

	const [open, setOpen] = useState(false);
	const [devoteeImage, setDevoteeImage] = useState('');

	const handleClickOpen = (image) => {
		setDevoteeImage(image);
		setOpen(true);
	};

	const handleClose = () => {
		setDevoteeImage('');
		setOpen(false);
	};


	const renderDate = (value) => {
		if (value && moment(value).isValid() && value != "0") {
			return moment(value).format('DD-MM-YYYY');
		}
		// console.warn(`Invalid date encountered: ${value}`);
		return 'NA';
	};

	const renderTime = (value) => {
		if (value && moment(value).isValid()) {
			return moment(value).format('HH:mm:ss');
		}
		// console.warn(`Invalid date encountered: ${value}`);
		return 'NA';
	};

	const columns = [
		{
			name: "empName",
			label: "Name",
			options: {
				customBodyRenderLite: (dataIndex) => {
            		let image = `${tabledata[dataIndex].empImage}`;
					let name = `${tabledata[dataIndex].empName}`;
            		return (
					<>
						<div style={{display:'flex', alignItems:'center', gap:'10px'}}>
						<Avatar
							alt="Guest image"
							variant="square"
							src={'data:image/jpeg;base64,'+image}
							sx={{ width: 50, height: 50, cursor:'pointer' }}
							onClick={() => handleClickOpen(image)}
						/>
						{name}

						</div>
					</>)
          		}
			}
		},
		{
			name: "empId",
			label: "Employee ID",
		},
		{
			name: "phNo",
			label: "Phone Number",
		},
		{
			name: "email",
			label: "Email",
		},
		{
			name: "entityName",
			label: "Entity",
		},
		{
			name: "department",
			label: "Department",
		},
		{
			name: "isActive",
			label: "Status",
			options: {
				customBodyRenderLite: (dataIndex) => {
					let status = `${tabledata[dataIndex].isActive}`;
					return (
						<Chip
							label={status ? "Active" : "Disabled"}
							color={status ? "success" : "error"}
							variant="outlined"
							size="small"
							style={{minWidth:"70px", textAlign: "center"}}
						/>
					);
				}
			}
		},
		
	];

	const options = {
		search: searchBtn,
		download: downloadBtn,
		print: printBtn,
		viewColumns: viewColumnBtn,
		filter: filterBtn,
		filterType: "dropdown",
		responsive,
		tableBodyHeight,
		tableBodyMaxHeight,
		selectableRows: 'none',
		tableFooter:'none',
		onTableChange: (action, state) => {
			// console.log(action);
			// console.dir(state);
		},
		setTableProps: () => {
			return {
				padding: 'default',
				size:  'small',
			};
		},
	}


	return (
	//  <CacheProvider value={muiCache}>
	
			<ThemeProvider theme={tabletheme()}>
				<MUIDataTable
					// title={`Transactions for ${tabledata[0].user_id}`}
					data={tabledata}
					columns={columns}
					options={options}
				/>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="image-dialog"
					maxWidth="md"
					style={{ zIndex: 9999 }}
				>
					<DialogContent>
					<img
						src={'data:image/jpeg;base64,' + devoteeImage}
						alt="Larger guest image"
						style={{ width: 'auto', height: '500px' }}
					/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</ThemeProvider>
	// </CacheProvider>
	);
}

export default TransactionTable;

