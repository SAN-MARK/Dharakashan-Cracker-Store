import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkfjssptlnniltguwojh.supabase.co';
const supabaseAnonKey = 'sb_publishable_NdIT74bjP6w4DpLhLFBoKA_K5yZDBs5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing Order with UUID...");
  
  const testOrder = {
    id: 'f7c5e2d1-2f71-49fa-9481-9bdf01a234f9', // valid UUID
    customer_name: 'Rajesh Kumar',
    phone: '9840123456',
    address: '12, Gandhi Nagar First Street, Adyar, Chennai - 600020',
    total_amount: 1250,
    status: 'Confirmed'
  };

  const { error: orderError } = await supabase
    .from('orders')
    .upsert([testOrder]);

  if (orderError) {
    console.error("INSERT ORDER ERROR:", orderError);
  } else {
    console.log("INSERT ORDER SUCCESS with UUID ID!");
  }
}

test();
