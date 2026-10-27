import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server'; 
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  // Use the new server client that reads cookies
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single();

  const userName = profile?.first_name || "Creator";

  return <DashboardClient userName={userName} />;
}
