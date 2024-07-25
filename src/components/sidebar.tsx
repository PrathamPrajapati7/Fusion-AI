"use client";

import { Sidebar as SidebarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import img1 from "../../public/logo.png";

const Sidebar = () => {
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-30 h-30 mr-4">
                        <Image src={img1} alt="Logo" />
                    </div>
                    
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
