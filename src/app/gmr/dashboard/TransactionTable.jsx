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
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
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
	const [empImage, setEmpImage] = useState('');
	const [open, setOpen] = useState(false);

	const handleClickOpen = (image) => {
		setEmpImage(image);
		setOpen(true);
	};

	const handleClose = () => {
		setEmpImage('');
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

	const renderDateTime = (value) => {
		if (value && moment(value).isValid()) {
			return moment(value).format('DD-MM-YYYY | HH:mm:ss');
		}
		console.warn(`Invalid date encountered: ${value}`);
		return 'NA';
	};

	const handleDelete = () => {
		return;
	}

	const columns = [
		{
			name: "empName",
			label: "Name",
			
		},
		{
			name: "empId",
			label: "Employee ID",
		},
		{
			name: "entityName",
			label: "Entity",
		},
		{
			name: "createdAt",
			label: "Date Time",
			options: {
				setCellProps: () => ({ style: { minWidth: "114px"}}),
				customBodyRender: renderDateTime
			}
		},
		{
			name: "touchPoint",
			label: "Touch Point",
			// options: {
			// 	setCellProps: () => ({ style: { minWidth: "114px"}}),
			// }
		},
		{
			name: "entryType",
			label: "Entry Type",
			options: {
				customBodyRenderLite: (dataIndex) => {
					const entryType = tabledata[dataIndex].entryType;
					const status = entryType === "IN";
					return (
						<Chip
							label={entryType}
							color={status  ? "success" : "warning"}
							variant="outlined"
							size="small"
							style={{minWidth:"75px"}}
							deleteIcon={status ? <LoginIcon />: <LogoutIcon />}
							onDelete={handleDelete} 
						/>
					);
				}
			}
			// options: {
			// 	setCellProps: () => ({ style: { minWidth: "114px"}}),
			// }
		},
		{
			name: "livePhoto",
			label: "Live Photo",
			options: {
				customBodyRenderLite: (dataIndex) => {
            		let image = `${tabledata[dataIndex].livePhoto}`;
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

						</div>
					</>)
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
		jumpToPage: true,
		rowsPerPage: 50,
		rowsPerPageOptions: [25, 50, 100],
		selectableRows: 'none',
		tableFooter:'none',
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
						src={'data:image/jpeg;base64,' + empImage}
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

