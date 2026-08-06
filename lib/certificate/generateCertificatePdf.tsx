"use client";

import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { CertificateTemplate, CERT_WIDTH, CERT_HEIGHT, CertificateData } from "./CertificateTemplate";

/**
 * Render CertificateTemplate ke DOM tersembunyi, screenshot, lalu
 * simpan sebagai PDF satu halaman yang persis mengikuti desain template.
 */
export async function downloadCertificatePdf(data: CertificateData, filename: string) {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  document.body.appendChild(container);

  const root = createRoot(container);

  await new Promise<void>((resolve) => {
    root.render(<CertificateTemplate data={data} />);
    // Tunggu 2 frame supaya DOM & font selesai render sebelum di-capture
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  try {
    const node = container.firstElementChild as HTMLElement;
    const canvas = await html2canvas(node, {
      width: CERT_WIDTH,
      height: CERT_HEIGHT,
      scale: 2, // render 2x biar tajam
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [CERT_WIDTH, CERT_HEIGHT],
    });
    pdf.addImage(imgData, "PNG", 0, 0, CERT_WIDTH, CERT_HEIGHT);
    pdf.save(filename);
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}