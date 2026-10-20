import type { Metadata } from 'next';
import LoginScreen from '@/components/admin/LoginScreen';

export const metadata: Metadata = { title: 'Connexion — Admin' };

export default function AdminLoginPage() {
  return <LoginScreen />;
}
