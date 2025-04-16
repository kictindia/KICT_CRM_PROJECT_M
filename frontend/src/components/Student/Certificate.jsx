import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';

// Styled-components for Certificate Design
const CertificateContainer = styled.div`
  width: 80%;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 15px;
  border: 5px solid #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Arial', sans-serif;
  position: relative;

  @media (max-width: 1200px) {
    width: 85%;
  }

  @media (max-width: 992px) {
    width: 90%;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const CertificateHeader = styled.h1`
  font-size: 3rem;
  color: #007bff;
  margin-bottom: 1rem;
  text-transform: uppercase;

  @media (max-width: 1200px) {
    font-size: 2.5rem;
  }

  @media (max-width: 992px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const CertificateBody = styled.div`
  margin-top: 2rem;
`;

const StudentName = styled.h2`
  font-size: 2rem;
  color: #333;
  margin: 1rem 0;
  font-weight: bold;

  @media (max-width: 1200px) {
    font-size: 1.75rem;
  }

  @media (max-width: 992px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CourseName = styled.h3`
  font-size: 1.5rem;
  color: #666;
  margin: 1rem 0;

  @media (max-width: 1200px) {
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const MarksText = styled.p`
  font-size: 1.25rem;
  color: #333;
  margin-top: 1rem;
  font-weight: normal;

  @media (max-width: 1200px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const TotalMarks = styled.p`
  font-size: 1.5rem;
  color: #333;
  margin-top: 1.5rem;
  font-weight: bold;

  @media (max-width: 1200px) {
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CertificateFooter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  color: #007bff;
  font-style: italic;

  @media (max-width: 1200px) {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #007bff;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: red;
`;

const MainDashboard = styled.div`
  flex: 1;
  padding: 20px;
  width: -webkit-fill-available;
  background-color: #f9f9f9;
  box-sizing: border-box;
  height: calc(100vh - 60px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #cecece;
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #b3b3b3;
  }
`;

const SearchFormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const SearchHeader = styled.h2`
  font-size: 2rem;
  color: #001f3d;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const SearchInput = styled.input`
  width: 80%;
  padding: 10px;
  font-size: 1.1rem;
  border: 2px solid #001f3d;
  border-radius: 5px;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    /* width: 100%; */
    font-size: 0.9rem;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 1.1rem;
  background-color: #001f3d;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 80%;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    width: 90%;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 0.9rem;
  }
`;

const DownloadButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #001f3d;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 1200px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.7rem;
  }
`;

const Certificate = () => {
    const [certificateId, setCertificateId] = useState('');
    const [certificateData, setCertificateData] = useState(null);
    const [error, setError] = useState('');
    const [allCertificates, setAllCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const certificateRef = useRef();

    // Fetch certificate data from the API using axios
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get('http://localhost:8000/certificates/all');
                setAllCertificates(response.data); // Set the fetched data to the state
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Unable to fetch certificate data. Please try again later.');
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const handleSearch = () => {
        // Find the certificate matching the CertificateId
        const certificate = allCertificates.find(cert => cert.CertificateId === certificateId);

        if (certificate) {
            setCertificateData(certificate);
            setError('');
        } else {
            setError('Certificate not found');
            setCertificateData(null);
        }
    };

    const downloadCertificate = () => {
        if (certificateRef.current) {
            // Create a temporary link to download the certificate as PDF (or image)
            const element = certificateRef.current;
            const options = {
                margin: 1,
                filename: `${certificateData.StudentId}_certificate.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            };

            // Directly use html2pdf since it's imported at the top
            html2pdf().from(element).set(options).save();
        }
    };

    return (
        <MainDashboard>
            <SearchFormContainer>
                <SearchHeader>Search Certificate</SearchHeader>
                <SearchInput
                    type="text"
                    placeholder="Enter Certificate ID"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                />
                <SearchButton onClick={handleSearch}>Search</SearchButton>
            </SearchFormContainer>

            {/* Show error if certificate is not found */}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            {/* Show loading message if data is being fetched */}
            {loading && !certificateData && <LoadingMessage>Loading certificates...</LoadingMessage>}

            {/* Show certificate details if found */}
            {certificateData && certificateData.AdminVerified === false && (
                <ErrorMessage>The certificate is not verified by the admin.</ErrorMessage>
            )}

            {certificateData && certificateData.AdminVerified === true && (
                <CertificateContainer ref={certificateRef}>
                    <CertificateHeader>Certificate of Completion</CertificateHeader>
                    <CertificateBody>
                        <p style={{ fontSize: '1.25rem', color: '#555' }}>
                            This is to certify that
                        </p>
                        <StudentName>{certificateData.StudentId}</StudentName>
                        <p style={{ fontSize: '1.25rem', color: '#555' }}>
                            has successfully completed the course
                        </p>
                        <CourseName>{certificateData.CourseId}</CourseName>
                        <MarksText>
                            with a total of <strong>{certificateData.Percentage}%</strong> marks.
                        </MarksText>
                        <TotalMarks>Total Marks: {certificateData.Percentage}%</TotalMarks>
                    </CertificateBody>
                    <CertificateFooter>
                        <p>Issued by XYZ Institute</p>
                    </CertificateFooter>
                </CertificateContainer>
            )}

            {/* Download Button */}
            {certificateData && certificateData.AdminVerified && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                    <DownloadButton onClick={downloadCertificate}>
                        Download Certificate
                    </DownloadButton>
                </div>
            )}
        </MainDashboard>
    );
};

export default Certificate;
