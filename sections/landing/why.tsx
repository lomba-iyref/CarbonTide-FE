import Image from "next/image";
import { Card } from "@/components/ui/card";
import { TrendingUp, ChartColumn } from "lucide-react";

export default function Why() {
  return (
    <div className="flex flex-col items-center w-full max-w-342 px-5 sm:px-8 lg:px-0 gap-6 sm:gap-8 lg:gap-10">
      <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-3 text-h4 sm:text-h2 lg:text-h1 font-bold text-center">
        <p>Mengapa</p>
        <Image
          src="/images/logo.png"
          width={200}
          height={175}
          alt="Logo CarbonTide"
          className="h-8 sm:h-12 lg:h-auto w-auto transition-all"
        />
        <p>Hadir?</p>
      </div>

      <p className="w-full max-w-270.5 text-center text-sh-s sm:text-sh-m lg:text-sh-l">
        Indonesia memiliki 17% cadangan blue carbon global (3,0 Pg C),
        namun realisasinya di pasar karbon masih kurang dari 3%.
        Kesenjangan ini disebabkan oleh hambatan struktural MRV yang kompleks.
      </p>

      <div className="flex flex-col md:flex-row w-full items-center md:items-stretch justify-center gap-5">
        <Card className="flex flex-col bg-white shadow-2xl items-center justify-center w-full md:w-1/3 lg:w-107.5 max-w-107.5 py-8 sm:py-10 lg:py-13 gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-5 sm:gap-6 lg:gap-8 w-full max-w-92 px-6">
            <div className="flex size-16 sm:size-18 lg:size-20 bg-[#FFE4E6] items-center justify-center rounded-[16px]">
              <TrendingUp className="size-8 sm:size-9 lg:size-10" color="#D74A6A" />
            </div>
            <p className="text-h4 sm:text-h3 font-bold text-center">MRV Eksisting Mahal</p>
            <p className="text-sh-s sm:text-sh-m text-center">
              Proses pemantauan saat ini didominasi satelit dan
              AI yang butuh biaya besar,
              menutup akses bagi pengembang proyek skala kecil.
            </p>
          </div>
        </Card>

        <Card className="flex flex-col bg-white shadow-2xl items-center justify-center w-full md:w-1/3 lg:w-107.5 max-w-107.5 py-8 sm:py-10 lg:py-13 gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-5 sm:gap-6 lg:gap-8 w-full max-w-92 px-6">
            <div className="flex size-16 sm:size-18 lg:size-20 bg-[#FEF3C7] items-center justify-center rounded-[16px]">
              <ChartColumn className="size-8 sm:size-9 lg:size-10" color="#DA7C0E" />
            </div>
            <p className="text-h4 sm:text-h3 font-bold text-center">Kalkulasi Terfragmentasi</p>
            <p className="text-sh-s sm:text-sh-m text-center">
              Perhitungan karbon sering tidak terstandarisasi.
              CarbonTide menggunakan sistem rule-based transparan
              berstandar Verra.
            </p>
          </div>
        </Card>

        <Card className="flex flex-col bg-white shadow-2xl items-center justify-center w-full md:w-1/3 lg:w-107.5 max-w-107.5 py-8 sm:py-10 lg:py-13 gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-5 sm:gap-6 lg:gap-8 w-full max-w-92 px-6">
            <div className="flex size-16 sm:size-18 lg:size-20 bg-[#EFF6FF] items-center justify-center rounded-[16px]">
              <TrendingUp className="size-8 sm:size-9 lg:size-10" color="#3C73EE" />
            </div>
            <p className="text-h4 sm:text-h3 font-bold text-center">Akses Pasar Terbatas</p>
            <p className="text-sh-s sm:text-sh-m text-center">
              Belum ada marketplace terintegrasi end-to-end.
              Kami menghubungkan suplai komunitas langsung dengan
              demand ESG perusahaan.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}