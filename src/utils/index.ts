export function createPageUrl(page: string): string {
  const routes: Record<string, string> = {
    'Home': '/',
    'Dashboard': '/dashboard',
    'BookAppointment': '/book-appointment',
    'MyAppointments': '/my-appointments',
    'MyRecords': '/my-records',
    'MyInvoices': '/my-invoices',
    'HealthChat': '/health-chat',
  };
  return routes[page] || '/';
}

