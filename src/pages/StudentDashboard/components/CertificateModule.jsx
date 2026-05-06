import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { FaDownload, FaCertificate } from 'react-icons/fa';
import './CertificateModule.css';
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';


const CertificateModule = ({
  studentName = "MOHANA KRISHNA",
  courseName = "React Masterclass",
  issueDate = "January 5, 2025",
  certificateId = "IC-CERT-12345"
}) => {
  const certificateRef = useRef(null);

  const downloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 3, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // A4 Portrait dimensions are 210mm x 297mm
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`Certificate_${studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const verificationUrl = `https://infycode.com/verify/${certificateId}`;

  return (
    <div className="certificate-module-container">
      {/* 🔷 CERTIFICATE CONTENT (CAPTURED) */}
      <div className="certificate-card-wrapper" ref={certificateRef}>
        <div className="certificate-inner-frame">
          {/* Anti-tampering Watermark */}
          <div className="cert-watermark-overlay">
            {studentName}
          </div>

          <div className="cert-header">
            <div className="cert-brand">
              <img src={icLogo} alt="InfyCode Logo" className="cert-brand-logo" />
              <div className="cert-brand-text">
                <img src={bannerLogo} alt="InfyCode" className="cert-brand-banner" />
              </div>
            </div>
          </div>

          <div className="cert-body">
            <h1 className="cert-main-title">CERTIFICATE OF COMPLETION</h1>
            <p className="cert-intro-text">This is to certify that</p>

            <h2 className="cert-recipient-name">{studentName}</h2>

            <p className="cert-praise-text">
              has successfully completed the comprehensive requirements for the <strong>{courseName}</strong> with dedication and excellence at InfyCode.
            </p>
          </div>

          <div className="cert-footer">
            <div className="cert-footer-grid">
              {/* Authority */}
              <div className="cert-authority-box">
                <p className="cert-signature-text">Charani</p>
                <div className="cert-sig-line"></div>
                <p className="cert-signer-name">CHARANI</p>
                <p className="cert-signer-role">CERTIFICATION AUTHORITY</p>
              </div>

              {/* Certificate Details */}
              <div className="cert-details-box">
                <p className="cert-data-label">Date:</p>
                <p className="cert-data-point">{issueDate}</p>
                <br />
                <p className="cert-data-label">Certificate ID:</p>
                <p className="cert-data-point">{certificateId}</p>
              </div>

              {/* QR Verification */}
              <div className="cert-qr-box">
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={70}
                    level={"H"}
                    includeMargin={false}
                  />
                </div>
                <p className="qr-verify-label">Scan to Verify</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔷 ACTION BUTTON */}
      <button className="cert-download-btn" onClick={downloadPDF}>
        <FaDownload /> Download Certificate
      </button>
    </div>
  );
};

export default CertificateModule;