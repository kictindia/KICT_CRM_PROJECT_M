import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelToJsonConverter = () => {
    const [jsonOutput, setJsonOutput] = useState(null);

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        // Once the file is read
        reader.onload = (e) => {
            const binaryStr = e.target.result;

            // Parse the Excel file using the xlsx library
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            // Get the first sheet (You can modify this if you want to handle multiple sheets)
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert the worksheet data to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 0,  // Use first row as keys
                raw: false, // This will allow us to manually process dates
            });

            // Manually process each row to ensure dates and times are kept as strings
            const processedData = jsonData.map((row) => {
                const processedRow = {};
                for (const key in row) {
                    if (row.hasOwnProperty(key)) {
                        const value = row[key];

                        // Check if the value is a date or time format, and treat it as a string
                        if (value instanceof Date) {
                            processedRow[key] = value.toISOString(); // You can format this as needed
                        } else {
                            processedRow[key] = value; // Leave the rest of the values as they are
                        }
                    }
                }
                return processedRow;
            });

            setJsonOutput(processedData);
        };

        // Read the file as binary string
        reader.readAsBinaryString(file);
    };

    // Download the JSON data as a file
    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.json';
        link.click();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Excel to JSON Converter</h2>

            {/* File Upload */}
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
            />

            {/* Displaying JSON Output */}
            {jsonOutput && (
                <div style={{ marginTop: '20px' }}>
                    <h3>JSON Output</h3>
                    <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
                    <button onClick={downloadJson}>Download JSON</button>
                </div>
            )}
        </div>
    );
};

export default ExcelToJsonConverter;
