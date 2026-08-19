export type LocationStatus = "live" | "syncing" | "needs_attention" | "offline";

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  status: LocationStatus;
  rating: number;
  reviewCount: number;
  listingsSynced: number;
  listingsTotal: number;
  weeklyVisits: number;
  weeklyCalls: number;
  weeklyOrders: number;
  hours: string;
  category: string;
}

export interface Review {
  id: string;
  locationId: string;
  locationName: string;
  author: string;
  rating: number;
  platform: "Google" | "Facebook" | "Justdial" | "Apple Maps";
  text: string;
  date: string;
  replied: boolean;
  sentiment: "positive" | "neutral" | "negative";
}

export interface Engagement {
  id: string;
  locationId: string;
  locationName: string;
  channel: "Q&A" | "Message" | "Chat" | "Social";
  customer: string;
  preview: string;
  status: "open" | "replied" | "escalated";
  priority: "low" | "medium" | "high";
  time: string;
}

export interface Campaign {
  id: string;
  name: string;
  locationCount: number;
  status: "active" | "paused" | "draft" | "completed";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpl: number;
  type: "Search" | "Display" | "Social" | "Offers";
}

export interface CallLead {
  id: string;
  locationId: string;
  locationName: string;
  caller: string;
  duration: string;
  intent: "Purchase" | "Inquiry" | "Support" | "Appointment" | "Spam";
  sentiment: "positive" | "neutral" | "negative";
  transcribed: boolean;
  time: string;
  status: "new" | "qualified" | "converted" | "missed";
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  locationId: string;
  locationName: string;
  status: "in_stock" | "low" | "out";
}

export interface AudienceSegment {
  id: string;
  name: string;
  size: number;
  growth: number;
  traits: string[];
  locations: number;
  conversionRate: number;
}

export const locations: Location[] = [
  {
    id: "loc-001",
    name: "NearReach Flagship — Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    address: "A-12, Inner Circle, Connaught Place",
    phone: "+91 11 4567 8901",
    status: "live",
    rating: 4.7,
    reviewCount: 842,
    listingsSynced: 12,
    listingsTotal: 12,
    weeklyVisits: 1840,
    weeklyCalls: 312,
    weeklyOrders: 96,
    hours: "10:00 AM – 9:00 PM",
    category: "Retail",
  },
  {
    id: "loc-002",
    name: "NearReach Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    address: "45 Linking Road, Bandra West",
    phone: "+91 22 2654 3310",
    status: "live",
    rating: 4.5,
    reviewCount: 621,
    listingsSynced: 11,
    listingsTotal: 12,
    weeklyVisits: 1520,
    weeklyCalls: 278,
    weeklyOrders: 84,
    hours: "11:00 AM – 10:00 PM",
    category: "Retail",
  },
  {
    id: "loc-003",
    name: "NearReach Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    address: "80 Feet Rd, 5th Block, Koramangala",
    phone: "+91 80 4123 7788",
    status: "needs_attention",
    rating: 4.2,
    reviewCount: 394,
    listingsSynced: 9,
    listingsTotal: 12,
    weeklyVisits: 980,
    weeklyCalls: 201,
    weeklyOrders: 51,
    hours: "10:30 AM – 9:30 PM",
    category: "Retail",
  },
  {
    id: "loc-004",
    name: "NearReach Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    address: "Road No. 36, Jubilee Hills",
    phone: "+91 40 2355 4412",
    status: "syncing",
    rating: 4.6,
    reviewCount: 518,
    listingsSynced: 10,
    listingsTotal: 12,
    weeklyVisits: 1210,
    weeklyCalls: 244,
    weeklyOrders: 67,
    hours: "10:00 AM – 9:00 PM",
    category: "Retail",
  },
  {
    id: "loc-005",
    name: "NearReach Park Street",
    city: "Kolkata",
    state: "West Bengal",
    address: "22 Park Street, Near Metro",
    phone: "+91 33 2287 6654",
    status: "live",
    rating: 4.4,
    reviewCount: 287,
    listingsSynced: 12,
    listingsTotal: 12,
    weeklyVisits: 760,
    weeklyCalls: 156,
    weeklyOrders: 38,
    hours: "11:00 AM – 8:30 PM",
    category: "Retail",
  },
  {
    id: "loc-006",
    name: "NearReach Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "2nd Avenue, Anna Nagar West",
    phone: "+91 44 2615 9021",
    status: "offline",
    rating: 3.9,
    reviewCount: 176,
    listingsSynced: 6,
    listingsTotal: 12,
    weeklyVisits: 420,
    weeklyCalls: 89,
    weeklyOrders: 19,
    hours: "Closed for renovation",
    category: "Retail",
  },
];

export const publishers = [
  { name: "Google Business Profile", synced: 5, total: 6, health: 92 },
  { name: "Apple Maps", synced: 5, total: 6, health: 88 },
  { name: "Facebook", synced: 4, total: 6, health: 81 },
  { name: "Justdial", synced: 6, total: 6, health: 95 },
  { name: "Bing Places", synced: 4, total: 6, health: 76 },
  { name: "Instagram Location", synced: 3, total: 6, health: 70 },
  { name: "Yelp", synced: 2, total: 6, health: 64 },
  { name: "Sulekha", synced: 5, total: 6, health: 85 },
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    locationId: "loc-001",
    locationName: "Connaught Place",
    author: "Priya Sharma",
    rating: 5,
    platform: "Google",
    text: "Excellent service and the store team helped me find exactly what I needed. Clean store and quick billing.",
    date: "2 hours ago",
    replied: false,
    sentiment: "positive",
  },
  {
    id: "rev-2",
    locationId: "loc-002",
    locationName: "Bandra West",
    author: "Rahul Mehta",
    rating: 2,
    platform: "Google",
    text: "Waited 25 minutes at billing. Staff seemed understaffed during evening rush.",
    date: "5 hours ago",
    replied: false,
    sentiment: "negative",
  },
  {
    id: "rev-3",
    locationId: "loc-003",
    locationName: "Koramangala",
    author: "Ananya Iyer",
    rating: 4,
    platform: "Facebook",
    text: "Good product range. Parking is a bit tight but overall a solid experience.",
    date: "Yesterday",
    replied: true,
    sentiment: "positive",
  },
  {
    id: "rev-4",
    locationId: "loc-004",
    locationName: "Jubilee Hills",
    author: "Vikram Reddy",
    rating: 5,
    platform: "Apple Maps",
    text: "Best outlet in the city. Location page had accurate hours and offers.",
    date: "Yesterday",
    replied: true,
    sentiment: "positive",
  },
  {
    id: "rev-5",
    locationId: "loc-005",
    locationName: "Park Street",
    author: "Sneha Das",
    rating: 3,
    platform: "Justdial",
    text: "Average experience. Some SKUs shown online were out of stock in-store.",
    date: "2 days ago",
    replied: false,
    sentiment: "neutral",
  },
  {
    id: "rev-6",
    locationId: "loc-001",
    locationName: "Connaught Place",
    author: "Amit Khanna",
    rating: 1,
    platform: "Google",
    text: "Wrong phone number listed on Google. Could not reach the store.",
    date: "3 days ago",
    replied: false,
    sentiment: "negative",
  },
];

export const engagements: Engagement[] = [
  {
    id: "eng-1",
    locationId: "loc-001",
    locationName: "Connaught Place",
    channel: "Q&A",
    customer: "Neha Kapoor",
    preview: "Do you offer same-day home delivery within 5km?",
    status: "open",
    priority: "high",
    time: "12 min ago",
  },
  {
    id: "eng-2",
    locationId: "loc-002",
    locationName: "Bandra West",
    channel: "Message",
    customer: "Farhan Qureshi",
    preview: "Is the weekend festival offer valid at this store?",
    status: "open",
    priority: "medium",
    time: "34 min ago",
  },
  {
    id: "eng-3",
    locationId: "loc-003",
    locationName: "Koramangala",
    channel: "Chat",
    customer: "Meera Nair",
    preview: "Can I reserve an item for pickup tomorrow morning?",
    status: "replied",
    priority: "medium",
    time: "1 hour ago",
  },
  {
    id: "eng-4",
    locationId: "loc-004",
    locationName: "Jubilee Hills",
    channel: "Social",
    customer: "@hydfoodie",
    preview: "Tagged your store — asking about evening parking availability.",
    status: "escalated",
    priority: "high",
    time: "2 hours ago",
  },
  {
    id: "eng-5",
    locationId: "loc-005",
    locationName: "Park Street",
    channel: "Q&A",
    customer: "Arjun Banerjee",
    preview: "Are UPI and credit cards both accepted?",
    status: "replied",
    priority: "low",
    time: "4 hours ago",
  },
];

export const campaigns: Campaign[] = [
  {
    id: "cmp-1",
    name: "Near Me — Festive Discovery",
    locationCount: 6,
    status: "active",
    spend: 184500,
    impressions: 1240000,
    clicks: 38420,
    conversions: 2140,
    cpl: 86,
    type: "Search",
  },
  {
    id: "cmp-2",
    name: "Bandra & CP Weekend Offers",
    locationCount: 2,
    status: "active",
    spend: 62400,
    impressions: 410000,
    clicks: 12880,
    conversions: 890,
    cpl: 70,
    type: "Offers",
  },
  {
    id: "cmp-3",
    name: "South India Brand Lift",
    locationCount: 2,
    status: "paused",
    spend: 41200,
    impressions: 290000,
    clicks: 7200,
    conversions: 310,
    cpl: 133,
    type: "Display",
  },
  {
    id: "cmp-4",
    name: "Instagram Local Stories",
    locationCount: 4,
    status: "draft",
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    cpl: 0,
    type: "Social",
  },
];

export const callLeads: CallLead[] = [
  {
    id: "call-1",
    locationId: "loc-001",
    locationName: "Connaught Place",
    caller: "+91 98*** *214",
    duration: "3:42",
    intent: "Purchase",
    sentiment: "positive",
    transcribed: true,
    time: "10 min ago",
    status: "qualified",
  },
  {
    id: "call-2",
    locationId: "loc-002",
    locationName: "Bandra West",
    caller: "+91 97*** *881",
    duration: "1:15",
    intent: "Inquiry",
    sentiment: "neutral",
    transcribed: true,
    time: "28 min ago",
    status: "new",
  },
  {
    id: "call-3",
    locationId: "loc-003",
    locationName: "Koramangala",
    caller: "+91 90*** *033",
    duration: "0:00",
    intent: "Appointment",
    sentiment: "neutral",
    transcribed: false,
    time: "45 min ago",
    status: "missed",
  },
  {
    id: "call-4",
    locationId: "loc-004",
    locationName: "Jubilee Hills",
    caller: "+91 88*** *556",
    duration: "5:08",
    intent: "Purchase",
    sentiment: "positive",
    transcribed: true,
    time: "1 hour ago",
    status: "converted",
  },
  {
    id: "call-5",
    locationId: "loc-001",
    locationName: "Connaught Place",
    caller: "+91 99*** *772",
    duration: "0:48",
    intent: "Spam",
    sentiment: "negative",
    transcribed: true,
    time: "2 hours ago",
    status: "new",
  },
  {
    id: "call-6",
    locationId: "loc-005",
    locationName: "Park Street",
    caller: "+91 86*** *419",
    duration: "2:21",
    intent: "Support",
    sentiment: "neutral",
    transcribed: true,
    time: "3 hours ago",
    status: "qualified",
  },
];

export const products: Product[] = [
  {
    id: "prd-1",
    name: "Classic Leather Wallet",
    sku: "NR-WL-100",
    category: "Accessories",
    price: 2499,
    stock: 42,
    locationId: "loc-001",
    locationName: "Connaught Place",
    status: "in_stock",
  },
  {
    id: "prd-2",
    name: "Urban Runner Sneakers",
    sku: "NR-SN-220",
    category: "Footwear",
    price: 4999,
    stock: 8,
    locationId: "loc-002",
    locationName: "Bandra West",
    status: "low",
  },
  {
    id: "prd-3",
    name: "Linen Summer Shirt",
    sku: "NR-AP-310",
    category: "Apparel",
    price: 1899,
    stock: 0,
    locationId: "loc-003",
    locationName: "Koramangala",
    status: "out",
  },
  {
    id: "prd-4",
    name: "Smart Analog Watch",
    sku: "NR-WT-150",
    category: "Accessories",
    price: 7999,
    stock: 15,
    locationId: "loc-004",
    locationName: "Jubilee Hills",
    status: "in_stock",
  },
  {
    id: "prd-5",
    name: "Canvas Tote Bag",
    sku: "NR-BG-080",
    category: "Bags",
    price: 1299,
    stock: 63,
    locationId: "loc-005",
    locationName: "Park Street",
    status: "in_stock",
  },
  {
    id: "prd-6",
    name: "Denim Jacket",
    sku: "NR-AP-440",
    category: "Apparel",
    price: 3499,
    stock: 5,
    locationId: "loc-001",
    locationName: "Connaught Place",
    status: "low",
  },
];

export const segments: AudienceSegment[] = [
  {
    id: "seg-1",
    name: "High-intent local shoppers",
    size: 128400,
    growth: 18,
    traits: ["Visited store page 2+", "Called in 7 days", "Within 5km"],
    locations: 6,
    conversionRate: 12.4,
  },
  {
    id: "seg-2",
    name: "Weekend browsers",
    size: 84200,
    growth: 9,
    traits: ["Fri–Sun active", "Offer clickers", "Social engagers"],
    locations: 5,
    conversionRate: 6.1,
  },
  {
    id: "seg-3",
    name: "Review responders",
    size: 22100,
    growth: 24,
    traits: ["Left review", "Replied to Q&A", "Loyalty likely"],
    locations: 6,
    conversionRate: 19.8,
  },
  {
    id: "seg-4",
    name: "Cart abandoners (local)",
    size: 15600,
    growth: -4,
    traits: ["Started checkout", "No purchase", "Inventory viewed"],
    locations: 4,
    conversionRate: 8.7,
  },
];

export const dashboardStats = {
  totalLocations: locations.length,
  liveLocations: locations.filter((l) => l.status === "live").length,
  avgRating: 4.4,
  weeklyStoreVisits: locations.reduce((s, l) => s + l.weeklyVisits, 0),
  weeklyCalls: locations.reduce((s, l) => s + l.weeklyCalls, 0),
  weeklyOrders: locations.reduce((s, l) => s + l.weeklyOrders, 0),
  listingHealth: 86,
  openReviews: reviews.filter((r) => !r.replied).length,
  openEngagements: engagements.filter((e) => e.status === "open").length,
  activeCampaigns: campaigns.filter((c) => c.status === "active").length,
  marketingRoi: "42X",
};

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}
