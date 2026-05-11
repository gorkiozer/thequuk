"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import MapboxMap from "@/app/components/MapboxMap";
import DropMemoryModal from "@/app/components/DropMemoryModal";
import { DemoModeProvider } from "@/lib/demoMode";

export default function DropPage() {
  const router = useRouter();
  const back = () => router.push("/map");

  return (
    <DemoModeProvider>
      <div className="relative w-full min-h-screen">
        <MapboxMap onSelectDistrict={back} onSelectMemory={back} />
        <AnimatePresence>
          <DropMemoryModal onClose={back} />
        </AnimatePresence>
      </div>
    </DemoModeProvider>
  );
}
