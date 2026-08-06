"use client";

import { forwardRef } from "react";
import { Award } from "lucide-react";

export interface CertificateData {
  buyerName: string;
  projectName: string;
  quantityTons: number;
  serialNumber: string;
  retiredAt: string; // sudah diformat, mis. "12 Okt 2025"
}

// Ukuran canvas tetap (px) — proporsi kira-kira sama seperti desain di gambar.
export const CERT_WIDTH = 700;
export const CERT_HEIGHT = 880;

export const CertificateTemplate = forwardRef<HTMLDivElement, { data: CertificateData }>(
  ({ data }, ref) => {
    const { buyerName, projectName, quantityTons, serialNumber, retiredAt } = data;

    return (
      <div
        ref={ref}
        style={{ width: CERT_WIDTH, height: CERT_HEIGHT }}
        className="relative bg-white flex flex-col items-center px-14 py-16"
      >
        {/* Icon */}
        <div className="flex items-center justify-center size-16 rounded-full border-[3px] border-primary text-primary mb-6">
          <Award size={30} strokeWidth={2} />
        </div>

        {/* Title */}
        <h1
          className="text-center text-text-primary font-bold"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 28,
            letterSpacing: 6,
          }}
        >
          CERTIFICATE OF RETIREMENT
        </h1>
        <p className="text-text-secondary text-sm mt-2 mb-10" style={{ letterSpacing: 4 }}>
          OFFICIAL CARBON OFFSET RECORD
        </p>

        {/* Recipient */}
        <p className="text-text-secondary text-sm mb-2">Diberikan secara resmi kepada:</p>
        <p className="text-text-primary font-bold text-2xl mb-4 text-center">{buyerName}</p>
        <div className="w-64 border-t border-border mb-10" />

        {/* Amount */}
        <p className="font-bold mb-1 leading-none" style={{ color: "#00A083", fontSize: 52 }}>
          {quantityTons.toLocaleString("id-ID")} tCO
          <span style={{ fontSize: 30, verticalAlign: "sub" }}>2</span>e
        </p>
        <p className="text-text-secondary text-sm mb-10">Serial: {serialNumber}</p>

        {/* Description */}
        <p className="text-center text-text-secondary text-[15px] leading-relaxed max-w-[420px] mb-auto">
          Melalui pendanaan langsung pada proyek pelestarian{" "}
          <span className="font-bold text-text-primary">{projectName}</span>. Sertifikat ini
          menjamin bahwa kredit karbon telah ditarik secara permanen dari peredaran (Retired) dan
          tidak dapat diperjualbelikan kembali.
        </p>

        {/* Footer */}
        <div className="w-full border-t border-border pt-6 flex items-end justify-between">
          <div>
            <div className="w-36 border-t border-text-secondary mb-2" />
            <p className="text-text-secondary text-xs tracking-widest">CARBONTIDE REGISTRY</p>
          </div>
          <div className="text-right">
            <p className="text-text-primary font-bold">{retiredAt}</p>
            <p className="text-text-secondary text-xs">Date of Retirement</p>
          </div>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = "CertificateTemplate";