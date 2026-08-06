export type Knowledge = {
    keywords: string[];
    answer: string;
};

export const knowledge: Knowledge[] = [
    {
        keywords: ["mrv", "measurement", "verification", "reporting"],
        answer: `
MRV (Measurement, Reporting, and Verification) adalah proses untuk mengukur,
melaporkan, dan memverifikasi cadangan karbon pada suatu proyek.

Di CarbonTide, fitur MRV membantu pengguna mencatat data lapangan,
menghasilkan laporan, serta mempersiapkan dokumen untuk proses verifikasi.
        `.trim(),
    },

    {
        keywords: [
            "carbon estimation",
            "estimasi karbon",
            "perhitungan karbon",
            "carbon calculation",
        ],
        answer: `
Carbon Estimation digunakan untuk menghitung estimasi cadangan karbon
berdasarkan data vegetasi seperti jumlah pohon, DBH, tinggi pohon,
dan luas area menggunakan metode yang sesuai.
        `.trim(),
    },

    {
        keywords: [
            "marketplace",
            "carbon marketplace",
            "jual kredit karbon",
        ],
        answer: `
Carbon Marketplace merupakan tempat untuk membeli,
menjual,
dan mengelola carbon credit hasil proyek karbon yang telah diverifikasi.
        `.trim(),
    },

    {
        keywords: [
            "remote sensing",
            "satelit",
            "sentinel",
            "gfw",
        ],
        answer: `
Remote Sensing memanfaatkan citra satelit untuk membantu memonitor
perubahan tutupan lahan, kondisi mangrove,
dan aktivitas yang memengaruhi proyek karbon.
        `.trim(),
    },

    {
        keywords: [
            "certificate",
            "retirement",
            "certificate of retirement",
        ],
        answer: `
Certificate of Retirement merupakan sertifikat digital
yang menunjukkan bahwa sejumlah carbon credit telah dipensiunkan
(retired) sehingga tidak dapat diperjualbelikan kembali.
        `.trim(),
    },
];