import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { MainDashboard } from '../Styles/GlobalStyles';

const ViewPassword = () => {
  const [data, setData] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/user/all");
        const result = await response.json();
        setData(result.reverse()); // Assuming you want to display the data in reverse order
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Define the columns for the MUI DataTable
  const columns = [
    { name: "Id", label: "ID" },
    { name: "Password", label: "Password" },
    { name: "Role", label: "Role" },
  ];

  // MUI DataTable options
  const options = {
    responsive: "scrollMaxHeight",
    print: false,
    filterType: "select",
    selectableRows: "none",
    search: true,
    rowsPerPage: 5,
    page: 0,
    onChangePage: (page) => console.log(`Page changed to ${page}`),
    setTableBodyRowProps: () => ({
      style: { textAlign: 'center' }, // Aligning data in rows
    }),
    setTableHeadProps: () => ({
      style: { textAlign: 'center' }, // Aligning header to center
    }),
    customTableBodyCell: (value) => ({
      style: { textAlign: 'center' }, // Center align each cell
    }),
    onDownload: (buildHead, buildBody, columns, data) => {
      // Filter out the "actions" column
      const filteredColumns = columns.filter((col) => col.name !== "Action");
      const filteredData = data.map((row) => {
        const newRow = { ...row };
        delete newRow.actions; // Ensure "actions" data is excluded
        return newRow;
      });
    
      // Generate CSV content
      const csv = buildHead(filteredColumns) + buildBody(filteredData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
    
      // Set the file name with the proper date format
      const pageName = "View Passwords"; // Use the page name as a constant
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const fileName = `${pageName}_${formattedDate}.csv`;
    
      // Trigger file download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
    
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
      return false; // Prevent default download behavior
    },
  };

  return (
    <MainDashboard>
      <MUIDataTable
        data={data}
        columns={columns}
        options={options}
      />
    </MainDashboard>
  );
};

export default ViewPassword;
