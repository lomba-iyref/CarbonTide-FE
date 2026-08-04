import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck, Calculator, ArrowRight } from 'lucide-react';


function CalculatorSection() {
    return (
        <div className="relative lg:-translate-y-10 flex flex-col items-center gap-4 w-full lg:w-130 xl:w-156.5">
            <div className="flex justify-end w-full py-2 border-b-[#94A3B8] border-b">
                <Calculator className="items-end" color="#8EC1EF" />
            </div>
            <Card className="flex flex-col items-center gap-7 w-full bg-[#1E293B] border-[#283346] border-2 px-4 sm:px-6 lg:px-0">
                <div className="flex flex-col justify-center w-full lg:w-100 xl:w-130 gap-5 sm:gap-7 py-2 lg:py-0">
                    <div className="flex flex-col justify-center w-full min-h-20 sm:h-23 text-c-l gap-2 sm:gap-3 pl-4 sm:pl-5 py-3 bg-tertiary border-[#566A87] border rounded-[8px]">
                        <p className="text-text-secondary">Input DBH & Tinggi</p>
                        <p className="text-[#8EC1EF] wrap-break-word">AGB = 0.0673 × (ρD²H)⁰.⁹⁷⁶</p>
                    </div>
                    <div className="flex flex-col justify-center w-full min-h-20 sm:h-23 text-c-l gap-2 sm:gap-3 pl-4 sm:pl-5 py-3 bg-tertiary border-[#566A87] border rounded-[8px]">
                        <p className="text-text-secondary">Konversi Karbon</p>
                        <p className="text-secondary wrap-break-word">AGB = 0.0673 × (ρD²H)⁰.⁹⁷⁶</p>
                    </div>
                    <Button className="flex flex-row items-center justify-center gap-2 w-full lg:w-100 xl:w-130 h-12 sm:h-14.5">
                        <p className="text-sh-s sm:text-sh-l font-bold">Coba Calculator MRV</p>
                        <ArrowRight className="size-6 sm:size-8" />
                    </Button>
                </div>

            </Card>
        </div>
    )
}


export default function Solution() {
    return (
        <Card className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full max-w-342 bg-tertiary py-8 sm:py-10 lg:py-15 px-5 sm:px-6 lg:px-10 justify-center text-white mx-5 sm:mx-8 lg:mx-0">
            <CardHeader className="p-0">
                <CardTitle className="font-bold text-2xl sm:text-3xl lg:text-4xl">
                    Solusi Terintegrasi (All-in-One)
                </CardTitle>
            </CardHeader>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col gap-6 sm:gap-7">
                    <div className="flex flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <CircleCheck className="relative size-9 sm:size-10 lg:size-12 shrink-0" color="#8EC1EF" />
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <p className="font-bold text-sh-m sm:text-sh-l">1. Input Lapangan Berbasis Plot</p>
                            <p className="text-[#94A3B8] text-sh-s sm:text-sh-m w-full lg:w-100 xl:w-140">
                                Menggunakan data real seperti DBH dan tinggi pohon
                                (tanpa ketergantungan AI) untuk mengestimasi biomassa
                                via persamaan alometrik.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <CircleCheck className="relative size-9 sm:size-10 lg:size-12 shrink-0" color="#8EC1EF" />
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <p className="font-bold text-sh-m sm:text-sh-l">2. Auto-MRV Report Generator</p>
                            <p className="text-[#94A3B8] text-sh-s sm:text-sh-m w-full lg:w-100 xl:w-140">
                                Sistem mengubah input mentah secara otomatis menjadi
                                laporan karbon tervalidasi yang siap diaudit
                                (Verification Layer).
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <CircleCheck className="relative size-9 sm:size-10 lg:size-12 shrink-0" color="#8EC1EF" />
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <p className="font-bold text-sh-m sm:text-sh-l">3. Marketplace Terhubung</p>
                            <p className="text-[#94A3B8] text-sh-s sm:text-sh-m w-full lg:w-100 xl:w-140">
                                Kredit yang tervalidasi langsung terbit di inventory
                                penjual dan siap dibeli oleh perusahaan untuk komitmen ESG mereka.
                            </p>
                        </div>
                    </div>
                </div>
                <CalculatorSection />
            </div>
        </Card>
    )
}