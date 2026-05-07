import QrPageVariant from "../QrPageVariant";

const RESUME_PATH = "/assets/Resume_Joshua Nee.pdf";

export default function ResumeQrPage() {
  return (
    <QrPageVariant
      destinationHref={RESUME_PATH}
      qrImagePath="/assets/qr_resume.jpeg"
      qrAlt="QR code linking to Joshua Nee resume"
      qrAriaLabel="Open Joshua Nee resume PDF"
      activeVariant="resume"
    />
  );
}
