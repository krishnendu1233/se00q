import { createClient } from '@/lib/supabase'; // Adjust to your actual Supabase server setup path
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createClient();
  
  // Fetch user data server-side
  const { data: { user } } = await supabase.auth.getUser();
  
  // Extract first name or fallback to "Creator"
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const userName = fullName ? fullName.split(' ')[0] : "Creator";

  return <DashboardClient userName={userName} />;
}
