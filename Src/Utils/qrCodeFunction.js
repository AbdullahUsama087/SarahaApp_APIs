import QRCode from "qrcode";

const generateQrCode = ({ data = "" } = {}) => {
  const qrcode = QRCode.toDataURL(JSON.stringify(data), {
    errorCorrectionLevel: "H",
  });
  return qrcode;
};

export default generateQrCode; 