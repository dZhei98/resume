const QR_BASE_URL = "https://api.qrserver.com/v1/create-qr-code/";

export const getQrImageUrl = (value: string, size = 360) => {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: value,
    format: "png",
    margin: "0",
  });

  return `${QR_BASE_URL}?${params.toString()}`;
};
