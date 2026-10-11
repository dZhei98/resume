import { getLinkedInUrl } from "@/lib/links";

import QrPageVariant from "../QrPageVariant";

export default function LinkedInQrPage() {
  return (
    <QrPageVariant
      destinationHref={getLinkedInUrl()}
      qrImagePath="/assets/qr_linkedin.jpeg"
      qrAlt="QR code linking to Joshua Nee LinkedIn"
      qrAriaLabel="Open Joshua Nee LinkedIn profile"
      activeVariant="linkedin"
    />
  );
}
