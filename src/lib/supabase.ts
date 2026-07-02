import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Real Supabase client instance (or null if not configured)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase is not configured yet. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing in environment. " +
    "Falling back to local storage simulation for delivery check, bulk orders, and e-commerce state."
  );
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
  }
};
