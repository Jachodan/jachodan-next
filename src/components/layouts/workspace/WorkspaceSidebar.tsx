"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BadgeAlert, CalendarCheck, Clipboard, Home, Settings, ShoppingBasket, User } from "lucide-react";

const navItems = [
    { title: "대시보드", url: "/", icon: Home },
    { title: "상품관리", url: "/items", icon: ShoppingBasket },
    { title: "요청관리", url: "/request", icon: BadgeAlert },
    { title: "게시판", url: "/board", icon: Clipboard },
    { title: "알바관리", url: "/alba", icon: User },
    { title: "스케줄관리", url: "/schedule", icon: CalendarCheck },
    { title: "설정", url: "/settings", icon: Settings },

];

export default function WorkspaceSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/home">{state === "expanded" ? <span className="font-bold text-lg">Logo</span> : <span className="font-bold text-lg">L</span>}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* Footer content goes here */}</SidebarFooter>
    </Sidebar>
  );
}
