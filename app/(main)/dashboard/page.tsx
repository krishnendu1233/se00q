import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase'; 
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  // 1. Authenticate the user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // 2. Fetch the first name from your profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single();

  // 3. Fallback to "Creator" if first_name is empty or missing
  const userName = profile?.first_name || "Creator";

  return <DashboardClient userName={userName} />;
}
