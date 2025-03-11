import React, { lazy, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'react-qr-code';
import { MainDashboard, Section2 } from '../Styles/GlobalStyles';


// Styled Components
const CertificateContainer = styled.div`
  position: relative;
  width: 793.7px; /* A4 width in portrait (px) */
  height: 1122.5px; /* A4 height in portrait (px) */
  display: block; /* Always display */
  border: 1px solid black;
`;

const BackgroundImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const DataOverlay = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

const Text = styled.div`
  position: absolute;
  color: #000;
`;

const QRCodeWrapper = styled.div`
  position: absolute;
  text-align: center;
`;

const DownloadButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #001f3d;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 10px;
  font-weight: 700;
  background-color: white;
  margin: 8px 0;
`;

// Main Component
const BlankMarksheet = () => {
    const { certificateId } = useParams(); // Extract certificateId from URL params
    const [certificate, setCertificate] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const certificateResponse = await axios.get(
                    `https://franchiseapi.kictindia.com/certificates/get/${certificateId}`
                );
                if (certificateResponse.data) {
                    setCertificate(certificateResponse.data);
                    const studentResponse = await axios.get(
                        `https://franchiseapi.kictindia.com/student/get/${certificateResponse.data.StudentId}`
                    );
                    if (studentResponse.data) {
                        setStudent(studentResponse.data);
                    } else {
                        setError('Error fetching student data');
                    }
                } else {
                    setError('Error fetching certificate data');
                }
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [certificateId]);

    // Calculate totals
    const calculateTotals = () => {
        if (!certificate || !certificate.Marks) return { totalMarks: 0, obtainedMarks: 0 };
        const totalMarks = certificate.Marks.reduce((acc, mark) => acc + mark.totalMark, 0);
        const obtainedPracticalMark = certificate.Marks.reduce((acc, mark) => acc + mark.obtainedPracticalMark, 0);
        const obtainedTheoryMark = certificate.Marks.reduce((acc, mark) => acc + mark.obtainedTheoryMark, 0);
        return { totalMarks, obtainedPracticalMark, obtainedTheoryMark };
    };

    // PDF Download Handler
    const handleDownloadPDF = () => {
        const container = document.getElementById('containerDiv');
        html2canvas(container, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('marksheet.pdf');
        });
    };

    if (loading) {
        return <MainDashboard>Loading...</MainDashboard>;
    }

    if (error) {
        return <MainDashboard>Error: {error}</MainDashboard>;
    }

    // Get total marks and obtained marks
    // const { totalMarks, obtainedMarks } = calculateTotals();
    const { totalMarks, obtainedPracticalMark, obtainedTheoryMark } = calculateTotals();

    const printCertificate = async () => {
        const element = document.getElementById("containerDiv");
        if (!element) return;

        try {
            // Ensure that all images are loaded before proceeding
            const images = element.querySelectorAll("img");
            const imageLoadPromises = Array.from(images).map((img) => {
                return new Promise((resolve, reject) => {
                    if (img.complete) {
                        resolve(); // If the image is already loaded, resolve immediately
                    } else {
                        img.onload = resolve;
                        img.onerror = reject; // Reject if there's an error loading the image
                    }
                });
            });

            // Wait for all images to load
            await Promise.all(imageLoadPromises);

            // After all images are loaded, we can capture the screenshot
            captureCertificate();
        } catch (err) {
            console.error("Error during image loading:", err);
        }
    };

    const captureCertificate = async () => {
        const element = document.getElementById("containerDiv");
        if (!element) return;

        try {
            // Force a reflow to ensure everything is rendered properly
            element.offsetHeight; // This triggers the layout reflow

            // Wait a little longer to ensure content is fully rendered
            await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust delay if needed

            // Capture the content using html2canvas
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Ensure cross-origin support
                allowTaint: true, // Allow images from other sources
            });

            // Convert canvas to image data
            const imgData = canvas.toDataURL("image/png");

            // Open a new window for printing
            const printWindow = window.open("", "", "height=650, width=900");
            if (!printWindow) throw new Error("Failed to open print window");

            // Write content into the print window
            printWindow.document.write("<html><head><title>Print Certificate</title>");
            printWindow.document.write(`
            <style>
              @page {
                size: A4; /* A4 size */
                margin: 0;
              }
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
              }
              img {
                width: 100%;
                height: auto;
                display: block;
              }
            </style>
          `);
            printWindow.document.write(`</head><body>`);
            printWindow.document.write(`<img src="${imgData}" style="width: 100%; height: auto;" />`);
            printWindow.document.write(`</body></html>`);
            printWindow.document.close();

            // Wait for the content to load in the print window
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        } catch (err) {
            console.error("Error capturing certificate for printing:", err);
        }
    };

    // Trigger the printCertificate function
    printCertificate();

    return (
        <MainDashboard>
            <Section2>
                <DownloadButton onClick={handleDownloadPDF}>Download Marksheet</DownloadButton>
                <DownloadButton onClick={() => navigate(`/admin/blank-marksheet/${certificateId}`)}>
                    Blank Marksheet
                </DownloadButton>
                <DownloadButton onClick={printCertificate}>Print Marksheet</DownloadButton> {/* Print Certificate Button */}
            </Section2>
            <CertificateContainer id="containerDiv">
                <DataOverlay>
                    {/* Student Details */}
                    <Text style={{ top: '22.5rem', left: '12rem', fontSize: '12px', fontWeight: '700' }}>
                        {student?.Name}
                    </Text>
                    <Text style={{ top: '22.6rem', left: '30.5rem', fontSize: '12px', fontWeight: '700' }}>
                        {student?.GuardianDetails[0]?.GName}
                    </Text>
                    <Text style={{ top: '24.2rem', left: '11rem', fontSize: '12px', fontWeight: '700' }}>
                        {certificate?.Date}
                    </Text>
                    <Text style={{ top: '24.35rem', left: '23.6rem', fontSize: '10px', fontWeight: '700' }}>
                        {certificate?.CertificateId}
                    </Text>
                    <Text style={{ top: '24.4rem', left: '38.1rem', fontSize: '10px', fontWeight: '700' }}>
                        {certificate?.FranchiseId}
                    </Text>
                    <Text style={{ top: '25.7rem', left: '11rem', fontSize: '12px', fontWeight: '700' }}>
                        {student?.Course[0]?.CourseDuration}
                    </Text>

                    {/* Marks Table */}
                    {certificate?.Marks?.map((mark, index) => {
                        const rowTop = 31 + index * 2; // Adjust vertical position per row
                        return (
                            <React.Fragment key={mark._id}>
                                <Text style={{ top: `${rowTop}rem`, left: '6rem', fontSize: '12px', fontWeight: '700' }}>
                                    {index + 1}
                                </Text>
                                <Text style={{ top: `${rowTop}rem`, left: '9rem', fontSize: '12px', fontWeight: '700' }}>
                                    {mark.topic}
                                </Text>
                                <Text style={{ top: `${rowTop}rem`, left: '27rem', fontSize: '14px', fontWeight: '700' }}>
                                    {mark.totalMark}
                                </Text>
                                <Text style={{ top: `${rowTop}rem`, left: '31.3rem', fontSize: '14px', fontWeight: '700' }}>
                                    {mark.obtainedTheoryMark}
                                </Text>
                                <Text style={{ top: `${rowTop}rem`, left: '36.3rem', fontSize: '14px', fontWeight: '700' }}>
                                    {mark.obtainedPracticalMark}
                                </Text>
                                <Text style={{ top: `${rowTop}rem`, left: '41.2rem', fontSize: '14px', fontWeight: '700' }}>
                                    {mark.obtainedTheoryMark + mark.obtainedPracticalMark}
                                </Text>
                            </React.Fragment>
                        );
                    })}
                    <Text style={{ top: '48.4rem', left: '27rem', fontSize: '14px', fontWeight: '700' }}>
                        {totalMarks}
                    </Text>
                    <Text style={{ top: '48.4rem', left: '31.3rem', fontSize: '14px', fontWeight: '700' }}>
                        {obtainedTheoryMark}
                    </Text>
                    <Text style={{ top: '48.4rem', left: '36.3rem', fontSize: '14px', fontWeight: '700' }}>
                        {obtainedPracticalMark}
                    </Text>
                    <Text style={{ top: '48.4rem', left: '41.2rem', fontSize: '14px', fontWeight: '700' }}>
                        {obtainedTheoryMark + obtainedPracticalMark}
                    </Text>
                    <Text style={{ top: '51.7rem', left: '40.2rem', fontSize: '14px', fontWeight: '700' }}>
                        {certificate?.Grade}
                    </Text>
                    <Text style={{ top: '51.7rem', left: '31.8rem', fontSize: '14px', fontWeight: '700' }}>
                        {certificate?.Percentage}
                    </Text>
                    <Text style={{ top: '51.7rem', left: '23.8rem', fontSize: '14px', fontWeight: '700' }}>
                        {(certificate?.Percentage > 50) ? "Pass" : "Fail"}
                    </Text>
                    <Text style={{ top: '51.7rem', left: '8.2rem', fontSize: '14px', fontWeight: '700' }}>
                        {totalMarks}
                    </Text>
                    <Text style={{ top: '51.7rem', left: '16rem', fontSize: '14px', fontWeight: '700' }}>
                        {obtainedPracticalMark + obtainedTheoryMark}
                    </Text>


                    {/* QR Code */}
                    <QRCodeWrapper
                        style={{ top: '55.2rem', left: '10.5rem' }}>
                        <QRCode value={`https://blossobit.codifyinstitute.org/verification/${certificateId}`}
                            size={85} // Size of the QR code
                            fgColor="#000000" // Foreground color
                            bgColor="#FFFFFF" // Background color

                        />
                    </QRCodeWrapper>
                </DataOverlay>
            </CertificateContainer>
        </MainDashboard>
    );
};

export default BlankMarksheet;
