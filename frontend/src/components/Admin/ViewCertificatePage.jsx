import React, { useEffect, useState } from "react";
import styled from "styled-components";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import bgimage from "../../assets/certificate-1.png";
import { MainDashboard, Section, Section2 } from "../Styles/GlobalStyles";
import QRCode from 'react-qr-code';
import { useLocation, useNavigate } from "react-router-dom";

const ViewCertificatePage = () => {
  const location = useLocation();
  const certificateId = location.pathname.split("/").pop();
  const [certificate, setCertificate] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);  // Track screen size for mobile responsiveness
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificateResponse = await fetch(
          `https://franchiseapi.kictindia.com/certificates/get/${certificateId}`
        );
        const certificateData = await certificateResponse.json();
        setCertificate(certificateData);

        const studentResponse = await fetch(
          `https://franchiseapi.kictindia.com/student/get/${certificateData.StudentId}`
        );
        const studentData = await studentResponse.json();
        setStudent(studentData);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [certificateId]);

  // Handle resizing and check if the screen width is less than 1024px
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const downloadCertificate = async () => {
    const element = document.getElementById("certificate-container");
    if (!element) return;

    // Ensure that the images are fully loaded
    const images = element.querySelectorAll("img");
    const loadImagePromises = Array.from(images).map((img) => {
      return new Promise((resolve, reject) => {
        if (img.complete) {
          resolve(); // If already loaded, resolve immediately
        } else {
          img.onload = resolve;
          img.onerror = reject; // Handle image loading errors
        }
      });
    });

    try {
      // Wait for all images to load
      await Promise.all(loadImagePromises);

      // Force a reflow to ensure all styles and elements are rendered
      element.offsetHeight; // Triggers layout reflow

      // Adding a small delay before capturing the content to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Now we capture the content of the certificate container
      const canvas = await html2canvas(element, {
        scale: 2, // Use higher scale for better quality
        useCORS: true, // Enable CORS for cross-origin images
        allowTaint: true, // Allow tainted images
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 paper size in pixels (portrait)
      const pdfWidth = 793.7;  // A4 width in portrait (px)
      const pdfHeight = 1122.5; // A4 height in portrait (px)

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "px", [pdfWidth, pdfHeight]); // "p" for portrait orientation

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Get student's name (assuming it's available in the `student` object)
      const studentName = student ? student.Name : "Certificate";  // Default to "Certificate" if name is not available

      // Save the PDF with the student's name as the file name
      pdf.save(`${studentName}_Certificate.pdf`);
    } catch (err) {
      console.error("Error loading images:", err);
    }
  };
  
  const printCertificate = async () => {
    const element = document.getElementById("certificate-container");
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
    const element = document.getElementById("certificate-container");
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



  if (loading) return <LoadingMessage>Loading Certificate...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!certificate || !student) return <ErrorMessage>No data found</ErrorMessage>;

  return (
    <MainDashboard>
      <Section2>
        <DownloadButton onClick={downloadCertificate}>Download Certificate</DownloadButton>
        <DownloadButton onClick={() => navigate(`/admin/blank-certificate/${certificateId}`)}>
          Blank Certificate
        </DownloadButton>
        <DownloadButton onClick={printCertificate}>Print Certificate</DownloadButton> {/* Print Certificate Button */}
      </Section2>

      <CertificateContainer id="certificate-container">
        <BackgroundImage src={bgimage} alt="Certificate Background" />
        <DataOverlay>
          <Text style={{ top: "25.6rem", left: "9.5rem", fontSize: "22px", fontWeight: "700" }}>
            {student.Name}
          </Text>

          <Text style={{ top: "23.5rem", left: "37.65rem", fontSize: "22px", fontWeight: "700" }}>
            <img src={`https://franchiseapi.kictindia.com/uploads/${student.Image}`} alt="" width={"105px"} height={"125px"} />
          </Text>

          <Text style={{ top: "28rem", left: "11rem", fontSize: "22px", fontWeight: "700" }}>
            {student?.GuardianDetails[0]?.GName}
          </Text>

          <Text style={{ top: "30.4rem", left: "23rem", fontSize: "22px", fontWeight: "700" }}>
            {student.RegistrationNumber}
          </Text>

          <Text style={{ top: "35rem", left: "4.6rem", fontSize: "22px", fontWeight: "700" }}>
            {student.Course[0]?.CourseName}
          </Text>

          <Text style={{ top: "37.4rem", left: "37.45rem", fontSize: "20px", fontWeight: "700" }}>
            Grade: {certificate.Grade}
          </Text>

          <Text style={{ top: "37.35rem", left: "19.5rem", fontSize: "20px", fontWeight: "700" }}>
            {student.Course[0]?.CourseDuration}
          </Text>

          <Text style={{ top: "48rem", left: "15.5rem", fontSize: "22px", fontWeight: "700" }}>
            {certificate.Date}
          </Text>

          <Text style={{ top: "46rem", left: "15.5rem", fontSize: "22px", fontWeight: "700" }}>
            {certificate.CertificateId}
          </Text>

          <Text style={{ top: "43.8rem", left: "15.5rem", fontSize: "22px", fontWeight: "700" }}>
            {certificate.FranchiseId}
          </Text>
        </DataOverlay>

        <QRCodeWrapper style={{ top: "52.8rem", left: "8.5rem" }}>
          <QRCode
            value={certificateId ? `https://blossobit.codifyinstitute.org/verification/${certificateId}` : "https://example.com"}
            size={92}  // Increased size
          />
        </QRCodeWrapper>
      </CertificateContainer>
    </MainDashboard>
  );
};

const CertificateContainer = styled.div`
  position: relative;
  width: 793.7px;  // A4 width in portrait (px)
  height: 1122.5px;  // A4 height in portrait (px)
  display: block;  // Always display
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

const DownloadButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #001f3d;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 10px;
  font-weight: 700;
  background-color: white;
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #555;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: red;
`;

const QRCodeWrapper = styled.div`
  position: absolute;
  text-align: center;
`;

export default ViewCertificatePage;
