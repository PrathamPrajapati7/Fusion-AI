"use client";

import { Code, ImageIcon, LayoutDashboard, MessageSquare , Music, Settings, VideoIcon} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import img1 from "../../public/logo.png";
import {cn} from "@/lib/utils";

const routes =[
    {
        label : "Dashbaord",
        icon : LayoutDashboard,
        href: "/dashbaord",
        color:"text-sky-500"
    },
    {
        label : "Conversation",
        icon : MessageSquare,
        href: "/convseration",
        color:"text-sky-500"
    },
    {
        label : "Image Generation",
        icon : ImageIcon,
        href: "/image",
        color:"text-sky-500"
    },
    {
        label : "Video Generation",
        icon : VideoIcon,
        href: "/video",
        color:"text-sky-500"
    },
    {
        label : "Code Generation",
        icon : Code,
        href: "/code",
        color:"text-sky-500"
    },
    {
        label : "Music Generation",
        icon : Music,
        href: "/music",
        color:"text-sky-500"
    },
    {
        label : "Settings",
        icon : Settings,
        href: "/setting",
        
    },
];


const Sidebar = () => {
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-30 h-30 mr-4">
                        <Image src={img1} alt="Logo" />
                    </div>
                </Link>
                <div className="space-y-1">
                    {routes.map((routes) =>(
                        <Link
                        href={routes.href}
                        key={routes.href}
                        className="tex-sm group flex p-3 w-full justify-start font font-medium cursor-pointer
                        hover:text-white hover:bg-white/10 rounded-lg transition"
                        >
                            <div className="flex items-center flex-1">
                                <routes.icon className={cn("h-5 w-5 mr-3", routes.color)}/>
                               {routes.label}
                            </div>
                        </Link>
                    )
                )}
                    
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
