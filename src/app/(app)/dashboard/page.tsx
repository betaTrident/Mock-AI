import { DashboardClient } from "@/components/dashboard/DashboardClient"
import { fetchDashboardData } from "@/lib/dashboard-data"
import { requireServerAuth } from "@/lib/auth-server"

export default async function DashboardPage() {
  const user = await requireServerAuth()
  const data = await fetchDashboardData(user.uid)

  return <DashboardClient data={data} userName={user.name ?? "User"} />
}
