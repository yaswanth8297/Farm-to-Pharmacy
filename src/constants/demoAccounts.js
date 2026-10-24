// Demo accounts for the prototype login.
// WARNING: credentials in client code are visible to anyone who opens the app.
// Use these for demos only; replace with a real backend before going live.

export const DEMO_ACCOUNTS = [
  {
    id: 'user_farmer_1',
    role: 'farmer',
    name: 'Ramesh Kumar',
    email: 'farmer@herblink.demo',
    password: 'Farmer@123',
    location: 'Pune, Maharashtra',
    label: 'Farmer demo',
    phone: '+91 98765 43210',
    experience: '12 Years Organic Cultivation',
  },
  {
    id: 'user_buyer_1',
    role: 'buyer',
    name: 'Dr. Priya Sharma',
    email: 'pharma@herblink.demo',
    password: 'Pharma@123',
    location: 'Mumbai, Maharashtra',
    label: 'Pharma Tech demo',
    organization: 'City Ayurvedic Pharmaceuticals',
    license: 'MH-FDA-2024-AYUR-892',
  },
];

// The account whose details are pre-filled when the login screen opens.
export const DEFAULT_ACCOUNT = DEMO_ACCOUNTS[0];
