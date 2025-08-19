import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

import BackgroundMusic from "../components/BackgroundMusic";
import ClickOverlay from '@/components/ClickOverlay';
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>

    {/* <ClickOverlay />
    <BackgroundMusic /> */}

    <Navbar />

    </>
  );
}
