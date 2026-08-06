"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero()
{
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Card className="relative flex flex-col items-center justify-center gap-10 xl:gap-20 bg-linear-to-r w-full xl:w-342 py-10 xl:py-15 from-[#0C2B67] to-[#082F77] text-white overflow-hidden">
            <style>{`
                @keyframes hero-float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(0, 24px); }
                }
            `}</style>
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 size-72 xl:size-96 rounded-full bg-[#8EC1EF]/20 blur-3xl"
                style={{ animation: "hero-float 8s ease-in-out infinite" }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-32 -left-20 size-72 xl:size-96 rounded-full bg-[#445F9A]/20 blur-3xl"
                style={{ animation: "hero-float 10s ease-in-out infinite reverse" }}
            />

            <CardHeader
                className="relative flex flex-col gap-10 w-2xs md:w-xl lg:w-4xl xl:w-306 justify-center"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(24px)",
                    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                }}
            >
                <div className="flex flex-row gap-2.5 items-center justify-center bg-[#3D5188] px-2 py-2 rounded-sm w-fit transition-transform duration-300 hover:scale-105">
                    <Globe color="#8EC1EF"/>
                    <p className="text-sh-m lg:text-sh-l font-bold text-[#8EC1EF]">SOLUSI END-TO-END BLUE CARBON</p>
                </div>
                <CardTitle className="font-bold text-3xl md:text-4xl lg:text-5xl xl:text-[64px]">
                    Menjembatani Potensi{" "}
                    <span className="bg-linear-to-b from-primary to-[#445F9A] bg-clip-text text-transparent">Mangrove</span>{" "}
                    ke Pasar Karbon Global
                </CardTitle>
            </CardHeader>
            <CardContent
                className="relative flex flex-col items-start w-2xs md:w-xl lg:w-4xl xl:w-306"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(24px)",
                    transition: "opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s",
                }}
            >
                <div className="flex flex-col gap-15 w-3xs md:w-full lg:w-182.5">
                    <p className="text-sh-m lg:text-sh-l">
                        Platform all-in-one yang menggabungkan perhitungan MRV manual transparan, 
                        generasi laporan otomatis, dan marketplace terintegrasi. 
                        Membuka akses pendanaan bagi komunitas pesisir secara mudah dan kredibel.
                    </p>
                    <div className="flex flex-col lg:flex-row gap-5 xl:gap-10 w-full text-sh-m xl:text-sh-l">
                        <Link href="/marketplace">
                            <Button className="group flex flex-row items-center justify-center gap-1 w-full lg:w-82.5 h-14.5 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0">
                                <p>Jelajahi Proyek</p>
                                <ArrowRight className="size-7 xl:size-9.5 font-bold transition-transform duration-300 group-hover:translate-x-1.5"/>
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="group flex flex-row gap-4 bg-[#1E293B] border-[#94A3B8] border w-full lg:w-91 h-14.5 font-bold transition-all duration-300 hover:bg-[#283449] hover:-translate-y-0.5 active:translate-y-0">
                                <FileText className="size-6 xl:size-7 transition-transform duration-300 group-hover:rotate-6"/>
                                <p>Daftar Proyek (MRV)</p>
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}