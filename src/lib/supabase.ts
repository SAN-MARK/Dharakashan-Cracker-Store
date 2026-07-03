import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { generateUUID } from './uuid';

const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const isInvalidUrl = !url || url.includes('your-supabase') || !url.startsWith('http');
  const isInvalidKey = !key || key.startsWith('http') || key.includes('your-supabase-anon');

  if (isInvalidUrl || isInvalidKey) {
    console.warn(
      "⚠️ Supabase environment variables (VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY) are missing or misconfigured! " +
      "Database connectivity is disabled. Please verify your environment configuration."
    );
    return { url: '', key: '' };
  }

  return { url, key };
};

const { url: cleanedUrl, key: cleanedAnonKey } = getSupabaseConfig();

export const supabaseUrl = cleanedUrl;
export const supabaseAnonKey = cleanedAnonKey;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Real Supabase client instance (or null if not configured)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase is not configured yet. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing in environment. " +
    "Falling back to local storage simulation for delivery check, bulk orders, and e-commerce state."
  );
} else {
  console.log("🎯 Supabase client successfully initialized with URL:", supabaseUrl, "Key prefix:", supabaseAnonKey.substring(0, 15) + "...");
}

// Ensure local tables are initialized in localStorage if Supabase is missing
const initLocalStorageTable = (key: string, initialData: any) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialData));
  }
};

// Seeding delivery areas with some classic Tamil Nadu districts & pincode prefixes
const initialDeliveryAreas = [
  { district: 'Chennai', pincode_prefix: '600', is_serviceable: true, estimated_delivery_days: 2 },
  { district: 'Coimbatore', pincode_prefix: '641', is_serviceable: true, estimated_delivery_days: 3 },
  { district: 'Madurai', pincode_prefix: '625', is_serviceable: true, estimated_delivery_days: 3 },
  { district: 'Tiruchirappalli', pincode_prefix: '620', is_serviceable: true, estimated_delivery_days: 3 },
  { district: 'Sivakasi / Virudhunagar', pincode_prefix: '626', is_serviceable: true, estimated_delivery_days: 1 },
  { district: 'Salem', pincode_prefix: '636', is_serviceable: true, estimated_delivery_days: 3 },
  { district: 'Tirunelveli', pincode_prefix: '627', is_serviceable: true, estimated_delivery_days: 3 },
  { district: 'Thanjavur', pincode_prefix: '613', is_serviceable: true, estimated_delivery_days: 4 },
  { district: 'Kanyakumari / Nagercoil', pincode_prefix: '629', is_serviceable: true, estimated_delivery_days: 4 },
  { district: 'Erode', pincode_prefix: '638', is_serviceable: true, estimated_delivery_days: 3 },
  { district: 'Nilgiris / Ooty', pincode_prefix: '643', is_serviceable: false, estimated_delivery_days: 0 }, // Out of service example
];

initLocalStorageTable('db_delivery_areas', initialDeliveryAreas);
initLocalStorageTable('db_bulk_orders', []);
initLocalStorageTable('db_coupons', [
  { code: 'DIWALI20', discount_type: 'percentage', discount_value: 20, expiry_date: '2026-11-15' },
  { code: 'SIVAKASI500', discount_type: 'flat', discount_value: 500, expiry_date: '2026-12-31' },
]);
initLocalStorageTable('db_reviews', [
  { id: 1, product_id: 'p1', customer_name: 'Anand Kumar', rating: 5, comment: 'Sourced directly, brilliant sound and visual patterns!', created_at: new Date().toISOString() },
  { id: 2, product_id: 'p1', customer_name: 'Muthu Selvam', rating: 4, comment: 'Super sound, fast delivery to Madurai.', created_at: new Date().toISOString() },
]);

export interface DeliveryArea {
  district: string;
  pincode_prefix: string;
  is_serviceable: boolean;
  estimated_delivery_days: number;
}

export interface BulkOrderRequest {
  id?: string;
  name: string;
  org_name: string;
  contact_number: string;
  district: string;
  budget: string;
  preferred_delivery_date: string;
  message: string;
  created_at?: string;
}

// Core Database Access Helpers that respect Supabase or fall back to simulated LocalStorage
export const dbService = {
  hasFallenBack: !isSupabaseConfigured,

  /**
   * Check delivery serviceable status by pincode or district name
   */
  async checkDelivery(search: string): Promise<DeliveryArea | null> {
    const term = search.trim().toLowerCase();
    if (!term) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        // Pincode search: match prefix or exact
        const isNum = /^\d+$/.test(term);
        let query = supabase.from('delivery_areas').select('*');
        
        if (isNum) {
          // Take first 3 digits for prefix check
          const prefix = term.substring(0, 3);
          query = query.like('pincode_prefix', `${prefix}%`);
        } else {
          query = query.ilike('district', `%${term}%`);
        }
        
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data[0] as DeliveryArea;
        }
      } catch (err) {
        console.error("Supabase delivery check error, using local fallback", err);
      }
    }

    // Local Storage Fallback
    const localData: DeliveryArea[] = JSON.parse(localStorage.getItem('db_delivery_areas') || '[]');
    const isNum = /^\d+$/.test(term);
    
    if (isNum) {
      const match = localData.find(d => term.startsWith(d.pincode_prefix));
      return match || null;
    } else {
      const match = localData.find(d => d.district.toLowerCase().includes(term));
      return match || null;
    }
  },

  /**
   * Submit Temple & Community Bulk Order Form
   */
  async submitBulkOrder(req: BulkOrderRequest): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('bulk_order_requests').insert([req]);
        if (!error) return true;
        console.error("Supabase bulk order insert error", error);
      } catch (err) {
        console.error("Supabase bulk order exception", err);
      }
    }

    // Local Storage Fallback
    try {
      const localData: BulkOrderRequest[] = JSON.parse(localStorage.getItem('db_bulk_orders') || '[]');
      const newReq = { ...req, id: `bulk-${Date.now()}`, created_at: new Date().toISOString() };
      localData.push(newReq);
      localStorage.setItem('db_bulk_orders', JSON.stringify(localData));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  /**
   * Verify and fetch discount coupon
   */
  async getCoupon(code: string) {
    const cleanCode = code.trim().toUpperCase();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', cleanCode)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase coupon fetch error", err);
      }
    }

    // Local fallback
    const coupons = JSON.parse(localStorage.getItem('db_coupons') || '[]');
    return coupons.find((c: any) => c.code === cleanCode) || null;
  },

  /**
   * Fetch reviews for a specific product
   */
  async getReviews(productId: string) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase reviews fetch error", err);
      }
    }

    // Local fallback
    const reviews = JSON.parse(localStorage.getItem('db_reviews') || '[]');
    return reviews.filter((r: any) => r.product_id === productId);
  },

  /**
   * Add a review for a specific product
   */
  async addReview(review: { product_id: string; customer_name: string; rating: number; comment: string }) {
    const newReview = {
      ...review,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert([newReview])
          .select();
        if (!error && data) return data[0];
      } catch (err) {
        console.error("Supabase reviews insert error", err);
      }
    }

    // Local fallback
    const reviews = JSON.parse(localStorage.getItem('db_reviews') || '[]');
    const idReview = { ...newReview, id: Date.now() };
    reviews.unshift(idReview);
    localStorage.setItem('db_reviews', JSON.stringify(reviews));
    return idReview;
  },

  /**
   * Fetch all products from Supabase
   */
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        console.log("Fetching products from Supabase...");
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error("Supabase products fetch error:", error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log(`Successfully loaded ${data.length} products from Supabase!`);
          this.hasFallenBack = false;
          return data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            category: item.category,
            price: Number(item.price),
            originalPrice: item.original_price ? Number(item.original_price) : (item.originalPrice ? Number(item.originalPrice) : undefined),
            rating: item.rating ? Number(item.rating) : 4.5,
            reviewCount: item.review_count ? Number(item.review_count) : (item.reviewCount ? Number(item.reviewCount) : 45),
            image: item.image_url || item.image || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=500',
            description: item.description,
            isBestSeller: item.is_best_seller || item.isBestSeller || false,
            safetyRating: item.safety_rating || item.safetyRating || 'PESO Approved (Green)',
            brand: item.brand || 'Sivakasi Elite',
            soundLevel: item.sound_level || item.soundLevel || 'Low',
            stock: item.stock ? Number(item.stock) : 100
          }));
        } else {
          console.warn("Products table returned 0 rows");
        }
      } catch (err) {
        console.error("Supabase products fetch exception, using local fallback:", err);
        this.hasFallenBack = true;
        return PRODUCTS;
      }
    }

    // Default Fallback
    console.log("Using static products list fallback.");
    this.hasFallenBack = true;
    return PRODUCTS;
  },

  /**
   * Seed sample data into Supabase (products, orders, order_items)
   */
  async seedSupabase(): Promise<{ success: boolean; message: string; error?: any }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase is not configured yet.' };
    }

    try {
      console.log("Seeding products table...");
      // Define 6 sample products with exact requested attributes: name, description, price, image_url, category, stock
      const sampleProducts = [
        {
          id: 'p1',
          name: 'Imperial Golden Sparklers (10 Pcs)',
          description: 'Ultra-safe, low-smoke golden sparklers. Burns with a brilliant golden shower, perfect for kids under adult supervision. PESO safety approved.',
          price: 180,
          image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=500',
          image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=500',
          category: 'sparklers',
          stock: 120,
          original_price: 250,
          rating: 4.8,
          brand: 'Sparkle Safe'
        },
        {
          id: 'p2',
          name: 'Crackling Emerald Sparklers (10 Pcs)',
          description: 'Vibrant green sparklers that produce a series of gentle, delightful crackles. Highly engaging and completely safe.',
          price: 220,
          image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=500',
          image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=500',
          category: 'sparklers',
          stock: 95,
          original_price: 300,
          rating: 4.6,
          brand: 'Sivakasi Elite'
        },
        {
          id: 'p3',
          name: 'Royal Multi-Color Flower Pots',
          description: 'Classic festive flower pots that shoot majestic fountains of multi-color sparks up to 10 feet in the air. Smooth burning.',
          price: 350,
          image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=500',
          image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=500',
          category: 'flowerpots',
          stock: 80,
          original_price: 450,
          rating: 4.9,
          brand: 'Sivakasi Elite'
        },
        {
          id: 'p4',
          name: 'Mega Golden Shower Fountain',
          description: 'Extra tall and dense golden sparkle fountain. Emits a dense column of shimmering gold stars, lighting up the entire courtyard.',
          price: 420,
          image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=500',
          image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=500',
          category: 'flowerpots',
          stock: 150,
          original_price: 600,
          rating: 4.7,
          brand: 'Sparkle Safe'
        },
        {
          id: 'p5',
          name: 'Glittering Star Sky-Shot Rocket',
          description: 'Shoots high into the sky and explodes into a beautiful umbrella pattern of green and violet glittering stars.',
          price: 490,
          image_url: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=500',
          image: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=500',
          category: 'rockets',
          stock: 60,
          original_price: 700,
          rating: 4.5,
          brand: 'Sivakasi Elite'
        },
        {
          id: 'p6',
          name: 'Screaming Whistler Sky Rocket',
          description: 'Features high whistling noise followed by silver chrysanthemums pattern. Very popular traditional cracker.',
          price: 380,
          image_url: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=500',
          image: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=500',
          category: 'rockets',
          stock: 110,
          original_price: 500,
          rating: 4.4,
          brand: 'Sivakasi Elite'
        }
      ];

      // Upsert products to database
      const { error: prodError } = await supabase
        .from('products')
        .upsert(sampleProducts, { onConflict: 'id' });

      if (prodError) {
        console.error("Failed to insert sample products:", prodError);
        throw prodError;
      }

      console.log("Seeding orders table...");
      // Define 3 sample orders with requested attributes: customer_name, phone, address, total_amount, status
      const sampleOrders = [
        {
          id: 'ord-1001',
          customer_name: 'Rajesh Kumar',
          phone: '9840123456',
          address: '12, Gandhi Nagar First Street, Adyar, Chennai - 600020',
          total_amount: 1250,
          status: 'Delivered',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ord-1002',
          customer_name: 'Karthik Raja',
          phone: '9443210987',
          address: '45B, West Masi Street, Madurai - 625001',
          total_amount: 850,
          status: 'Confirmed',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ord-1003',
          customer_name: 'Priya Sundar',
          phone: '9566112233',
          address: '7, Bharathi Avenue, Kovaipudur, Coimbatore - 641042',
          total_amount: 3500,
          status: 'Pending',
          created_at: new Date().toISOString()
        }
      ];

      const { error: orderError } = await supabase
        .from('orders')
        .upsert(sampleOrders, { onConflict: 'id' });

      if (orderError) {
        console.error("Failed to insert sample orders:", orderError);
        throw orderError;
      }

      console.log("Seeding order_items table...");
      // Define order items referencing valid order_id and product_id
      const sampleOrderItems = [
        {
          id: 'item-1',
          order_id: 'ord-1001',
          product_id: 'p1',
          quantity: 2,
          price: 180
        },
        {
          id: 'item-2',
          order_id: 'ord-1001',
          product_id: 'p3',
          quantity: 1,
          price: 350
        },
        {
          id: 'item-3',
          order_id: 'ord-1002',
          product_id: 'p2',
          quantity: 3,
          price: 220
        },
        {
          id: 'item-4',
          order_id: 'ord-1003',
          product_id: 'p5',
          quantity: 5,
          price: 490
        }
      ];

      const { error: itemError } = await supabase
        .from('order_items')
        .upsert(sampleOrderItems, { onConflict: 'id' });

      if (itemError) {
        console.error("Failed to insert sample order items:", itemError);
        throw itemError;
      }

      console.log("Supabase seeding completed successfully!");
      return { success: true, message: 'All sample data successfully seeded to Supabase!' };
    } catch (err: any) {
      console.error("Seeding operation failed:", err);
      return { success: false, error: err, message: err.message || 'Seeding failed' };
    }
  },

  /**
   * Fetch all orders
   */
  async getOrders() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase orders fetch error", err);
      }
    }
    return JSON.parse(localStorage.getItem('sparkle_orders') || '[]');
  },

  /**
   * Fetch order items for an order
   */
  async getOrderItems(orderId: string) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase order items fetch error", err);
      }
    }
    return [];
  },

  /**
   * Save a newly placed order & order items to Supabase
   */
  async saveOrder(order: { id: string; customer_name: string; phone: string; address: string; total_amount: number; status: string }, items: any[]) {
    if (isSupabaseConfigured && supabase) {
      try {
        console.log("Saving order to Supabase...");
        const { error: orderErr } = await supabase
          .from('orders')
          .insert([{
            id: order.id,
            customer_name: order.customer_name,
            phone: order.phone,
            address: order.address,
            total_amount: order.total_amount,
            status: order.status,
            created_at: new Date().toISOString()
          }]);

        if (orderErr) {
          console.error("Supabase saveOrder error:", orderErr);
          throw orderErr;
        }

        const orderItemsPayload = items.map((item) => ({
          id: generateUUID(),
          order_id: order.id,
          product_id: item.productId || item.product?.id,
          quantity: item.quantity,
          price: Number(item.price || item.product?.price || 0)
        }));

        const { error: itemsErr } = await supabase
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsErr) {
          console.error("Supabase saveOrder items error:", itemsErr);
          throw itemsErr;
        }

        console.log("Order saved to Supabase successfully!");
        return true;
      } catch (err) {
        console.error("Exception saving order to Supabase", err);
        throw err;
      }
    } else {
      console.warn("Supabase is not configured. Falling back to local storage order tracking.");
      return true;
    }
  }
};
