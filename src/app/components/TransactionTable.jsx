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
		main: '#05B7A5',
		}
	},
	components: {
        MuiToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: '#F0EADC',
			  color: '#ad8b3a',
			  minHeight: '48px !important',
			  // If you're using IconButton and want to target icons inside them
			  '& .MuiIconButton-root .MuiSvgIcon-root': {
				color: '#ad8b3a', // Desired icon color for IconButtons
			  },
            },
          },
        },
        MuiTableFooter: {
          styleOverrides: {
            root: {
                backgroundColor: '#F0EADC',
				color: '#ad8b3a'
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
			name: "entry_time",
			label: "Entry Date",
			options: {
				setCellProps: () => ({ style: { minWidth: "114px"}}),
				customBodyRender: renderDate
			}
		},
		{
			name: "entry_time",
			label: "Entry Time",
			options: {
				customBodyRender: renderTime
			}
		},
		{
			name: "exit_time",
			label: "Exit Date",
			options: {
				setCellProps: () => ({ style: { minWidth: "114px"}}),
				customBodyRender: renderDate
			}
		},
		{
			name: "exit_time",
			label: "Exit Date",
			options: {
				setCellProps: () => ({ style: { minWidth: "114px"}}),
				customBodyRender: renderDate
			}
		}
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
					title={`Transactions for ${tabledata[0].user_id}`}
					data={tabledata}
					columns={columns}
					options={options}
				/>
			</ThemeProvider>
	// </CacheProvider>
	);
}

export default TransactionTable;

