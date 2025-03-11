import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import { Heading, MainDashboard } from '../Styles/GlobalStyles';

const Transaction = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("Default Search Value");

    const fetchTransactions = async () => {
        try {
            const response = await axios.get("http://localhost:8000/fee/all");
            var temp = response.data.flatMap((data) => {
                return data?.Installment?.map((val) => {
                    return {
                        Name: data.StudentName,
                        Franchise: data.FranchiseName,
                        Course: data.CourseName,
                        Amount: val.Amount,
                        Date: val.Date,
                        Method: val.PaymentMethod,
                    }
                })
            })
            setData(temp);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [])

    const columns = [
        { name: "Name", label: "Name" },
        { name: "Franchise", label: "Franchise" },
        { name: "Course", label: "Course" },
        { name: "Amount", label: "Amount" },
        { name: "Date", label: "Date" },
        { name: "Method", label: "Payment Method" },
    ];

    // MUI DataTable options
    const options = {
        responsive: "scrollMaxHeight",
        print: false,
        filterType: "select",
        selectableRows: "none",
        search: true,
        rowsPerPage: 10,
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
    };

    return (
        <MainDashboard>
            <div style={{display:"flex",justifyContent:"center"}}>
                <Heading>Add New Enquiry</Heading>
            </div>
            <MUIDataTable
                data={data}
                columns={columns}
                options={options}
            />
        </MainDashboard>
    )
}

export default Transaction