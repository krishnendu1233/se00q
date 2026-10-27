import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server'; // Adjust to your actual import
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Provide a fallback string to satisfy the TypeScript compiler
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user?.id || '')
    .single();

  const userName = profile?.first_name || "Creator";

  return <DashboardClient userName={userName} />;
}
