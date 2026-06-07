// CRM Mock Database utilizing LocalStorage for persistence across pages

const DEFAULT_NAMES = [
  "Amanda Putri", "Syafira Bella", "Clara Wijaya", "Nadia Safira", 
  "Rania Azzahra", "Jessica Tan", "Dewi Sartika", "Manda Rose",
  "Bella Hadid", "Selena Gomez", "Kylie Jenner", "Kimberly",
  "Ariel Tatum", "Chelsea Islan", "Pevita Pearce", "Dian Sastro",
  "Maudy Ayunda", "Isyana Sarasvati", "Raisa Andriana", "Adinia Wirasti"
];

const CITIES = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Bali"];
const SOURCES = ["Instagram", "TikTok", "Referral", "Website"];
const PAYMENTS = ["Virtual Account", "Credit Card", "GoPay", "ShopeePay", "Bank Transfer"];
const TIERS = ["Gold", "Silver", "Bronze"];

const PRODUCTS = [
  { name: "Velvet Lipstick", price: 350000, category: "Lips" },
  { name: "Glow Cushion", price: 525000, category: "Face" },
  { name: "Rose Serum", price: 850000, category: "Skin" },
  { name: "Silk Blush", price: 420000, category: "Face" },
  { name: "Midnight Oud Perfume", price: 1200000, category: "Parfum" },
  { name: "Facial Roller", price: 275000, category: "Tools" },
  { name: "Cleansing Balm", price: 310000, category: "Skin" },
  { name: "Eye Palette", price: 680000, category: "Eyes" }
];

const MOCK_FEEDBACKS = [
  "Cushion-nya beneran bikin glowing banget! Tahan seharian di kulit berminyak.",
  "Serum Rose ini luar biasa, jerawat dan kemerahan berkurang drastis dalam seminggu.",
  "Warna Velvet Lipstick-nya mewah banget, sayangnya agak bikin kering bibir.",
  "Parfum Midnight Oud baunya eksklusif dan tahan lama. Rekomendasi banget!",
  "Blush-nya warnanya soft dan natural. Suka banget untuk daily makeup.",
  "Pengiriman cepat sekali, facial roller-nya dingin pas dipakai. Bikin rileks.",
  "Cleansing balm-nya efektif ngangkat makeup waterproof, wangi aromaterapi.",
  "Palet matanya pigmentasinya juara! Gampang di-blend dan warnanya universal."
];

// Helper to seed customers (800 rows)
function generateCustomers() {
  const list = [];
  for (let i = 0; i < 800; i++) {
    const name = DEFAULT_NAMES[i % DEFAULT_NAMES.length];
    const firstLower = name.split(" ")[0].toLowerCase();
    const username = `${firstLower}${i + 1}`;
    const email = `${firstLower}${i + 1}@makeupstore.com`;
    const loyalty = TIERS[i % 3];
    const city = CITIES[i % CITIES.length];
    const source = SOURCES[i % SOURCES.length];
    const payment = PAYMENTS[i % PAYMENTS.length];
    
    // Total transactions and quantity purchased based on loyalty tier
    let itemsCount = (i % 6) + 1;
    let totalPrice = loyalty === "Gold" ? (120 + (i % 150)) * 50000 : 
                     loyalty === "Silver" ? (50 + (i % 50)) * 50000 : (5 + (i % 25)) * 50000;
                     
    // Randomize date
    const day = ((i % 28) + 1).toString().padStart(2, '0');
    const month = ((i % 5) + 1).toString().padStart(2, '0'); // Jan - May
    const date = `${day}/${month}/2026`;
    
    // Choose 1-3 random products
    const pCount = (i % 3) + 1;
    const purchased = [];
    for (let p = 0; p < pCount; p++) {
      purchased.push(PRODUCTS[(i + p) % PRODUCTS.length].name);
    }

    list.push({
      id: `CUST-${(i + 1).toString().padStart(3, '0')}`,
      name,
      username,
      email,
      phone: `0812-9988-${(i + 100).toString()}`,
      gender: i % 2 === 0 ? "Perempuan" : "Laki-laki",
      dob: `199${i % 10}-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1).toString().padStart(2, '0')}`,
      city,
      joinDate: date,
      status: i % 15 === 0 ? "Inactive" : "Active",
      loyalty,
      referralCode: `CREATOR-${name.substring(0, 3).toUpperCase()}${i + 100}`,
      feedback: i % 13 === 0 ? MOCK_FEEDBACKS[i % MOCK_FEEDBACKS.length] : null,
      totalTransactions: totalPrice,
      itemsCount,
      paymentMethod: payment,
      lastTransactionDate: date,
      source,
      promoActive: i % 5 === 0
    });
  }
  return list;
}

// Helper to seed orders (from customers who have transactions)
function generateOrders(customers) {
  return customers.map((cust, idx) => {
    return {
      order_id: `ORD-2026-${(idx + 1).toString().padStart(3, '0')}`,
      customer_id: cust.id,
      customerName: cust.name,
      tier: cust.loyalty,
      totalPrice: cust.totalTransactions,
      itemsCount: cust.itemsCount,
      paymentMethod: cust.paymentMethod,
      status: idx % 10 === 0 ? "Cancelled" : idx % 7 === 0 ? "Pending" : "Completed",
      order_date: cust.lastTransactionDate,
      products: cust.productsPurchased || [
        PRODUCTS[idx % PRODUCTS.length].name,
        PRODUCTS[(idx + 1) % PRODUCTS.length].name
      ]
    };
  });
}

// Helper to seed reviews
function generateReviews(customers) {
  const reviewsList = [];
  let reviewCount = 1;
  customers.forEach((cust, idx) => {
    if (cust.feedback) {
      reviewsList.push({
        id: `REV-${reviewCount.toString().padStart(3, '0')}`,
        customer_id: cust.id,
        customerName: cust.name,
        avatar: cust.name.charAt(0),
        rating: 4 + (idx % 2), // 4 or 5 stars
        comment: cust.feedback,
        date: cust.lastTransactionDate,
        status: idx % 15 === 0 ? "Spam" : idx % 20 === 0 ? "Pending" : "Approved",
        sentiment: idx % 3 === 0 ? "Neutral" : "Positive",
        adminReply: idx % 4 === 0 ? "Terima kasih atas tanggapan positif Anda! Kami sangat senang Anda menyukainya." : null
      });
      reviewCount++;
    }
  });
  return reviewsList;
}

// Helper to seed marketing campaigns
function generateCampaigns() {
  return [
    { id: "CAMP-001", name: "Glow Summer Campaign", source: "Instagram", status: "Active", budget: 15000000, reach: 45000, conversions: 1200, startDate: "2026-05-01" },
    { id: "CAMP-002", name: "Tiktok Beauty Challenge", source: "TikTok", status: "Active", budget: 25000000, reach: 125000, conversions: 3800, startDate: "2026-05-10" },
    { id: "CAMP-003", name: "Referral Double Points", source: "Referral", status: "Active", budget: 5000000, reach: 18000, conversions: 950, startDate: "2026-05-15" },
    { id: "CAMP-004", name: "Web Launch Voucher", source: "Website", status: "Paused", budget: 8000000, reach: 24000, conversions: 620, startDate: "2026-04-20" },
    { id: "CAMP-005", name: "Email Glow Newsletter", source: "Website", status: "Completed", budget: 2000000, reach: 8000, conversions: 400, startDate: "2026-04-01" }
  ];
}

// Load or initialize DB
export function getCRMData() {
  let customers = localStorage.getItem("crm_customers");
  let orders = localStorage.getItem("crm_orders");
  let reviews = localStorage.getItem("crm_reviews");
  let campaigns = localStorage.getItem("crm_campaigns");
  let products = localStorage.getItem("crm_products");

  const defaultProducts = [
    { id: 1, title: "Velvet Lipstick", price: "Rp 350.000", tag: "Tata Rias", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600" },
    { id: 2, title: "Glow Cushion", price: "Rp 525.000", tag: "Tata Rias", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600" },
    { id: 3, title: "Rose Serum", price: "Rp 850.000", tag: "Perawatan Kulit", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600" },
    { id: 4, title: "Silk Blush", price: "Rp 420.000", tag: "Tata Rias", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800" },
    { id: 5, title: "Midnight Oud", price: "Rp 1.200.000", tag: "Parfum", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600" },
    { id: 6, title: "Facial Roller", price: "Rp 275.000", tag: "Alat Kecantikan", img: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=600" },
    { id: 7, title: "Cleansing Balm", price: "Rp 310.000", tag: "Perawatan Kulit", img: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=600" },
    { id: 8, title: "Eye Palette", price: "Rp 680.000", tag: "Tata Rias", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600" }
  ];

  if (!products) {
    localStorage.setItem("crm_products", JSON.stringify(defaultProducts));
    products = JSON.stringify(defaultProducts);
  }

  if (!customers) {
    const seededCust = generateCustomers();
    const seededOrd = generateOrders(seededCust);
    const seededRev = generateReviews(seededCust);
    const seededCamp = generateCampaigns();
    
    localStorage.setItem("crm_customers", JSON.stringify(seededCust));
    localStorage.setItem("crm_orders", JSON.stringify(seededOrd));
    localStorage.setItem("crm_reviews", JSON.stringify(seededRev));
    localStorage.setItem("crm_campaigns", JSON.stringify(seededCamp));

    return {
      customers: seededCust,
      orders: seededOrd,
      reviews: seededRev,
      campaigns: seededCamp,
      products: JSON.parse(products)
    };
  }

  return {
    customers: JSON.parse(customers),
    orders: JSON.parse(orders),
    reviews: JSON.parse(reviews),
    campaigns: JSON.parse(campaigns),
    products: JSON.parse(products)
  };
}

export function saveCRMData(data) {
  if (data.customers) localStorage.setItem("crm_customers", JSON.stringify(data.customers));
  if (data.orders) localStorage.setItem("crm_orders", JSON.stringify(data.orders));
  if (data.reviews) localStorage.setItem("crm_reviews", JSON.stringify(data.reviews));
  if (data.campaigns) localStorage.setItem("crm_campaigns", JSON.stringify(data.campaigns));
  if (data.products) localStorage.setItem("crm_products", JSON.stringify(data.products));
}
