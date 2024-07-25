import {UserButton} from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <><h1>DashBoard Page (Protected)</h1>
    <div className=""><UserButton afterSignOutUrl="/" /></div>
    </>
  )
}