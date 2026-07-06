import { createClient } from '@supabase/supabase-js';

// ===============================================
// KONFIGURASI SUPABASE
// ===============================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let initializationError = null;

// Validasi environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  initializationError = 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env';
  console.error('❌ [Supabase] Configuration error:', initializationError);
}

// Buat instance Supabase client
export const supabase = !initializationError 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ===============================================
// CUSTOM ERROR HANDLER
// ===============================================
class SupabaseError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'SupabaseError';
    this.code = code;
    this.details = details;
  }
}

const handleSupabaseError = (error, context = 'Unknown operation') => {
  console.error(`❌ [Supabase] ${context}:`, error);
  return new SupabaseError(
    error.message || `${context} failed`,
    error.code || 'UNKNOWN_ERROR',
    error
  );
};

// ===============================================
// TEST KONEKSI & PENGUJIAN
// ===============================================
export const testConnection = async () => {
  if (initializationError) {
    return {
      success: false,
      error: initializationError
    };
  }

  try {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ===============================================
// API LAYER - AUTH (CUSTOM)
// ===============================================
export const authAPI = {
  // Login manual ke tabel login
  async signInWithEmail({ email, password }) {
    try {
      const { data, error } = await supabase
        .from('login')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) throw handleSupabaseError(error, 'Sign in');
      
      if (!data) {
        throw new SupabaseError('Invalid credentials', 'INVALID_CREDENTIALS', null);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Register manual ke tabel login
  async signUpWithEmail({ email, password, role }) {
    try {
      const { data, error } = await supabase
        .from('login')
        .insert([{
          email,
          password,
          role: role || 'customer',
          name: email.split('@')[0]
        }])
        .select();

      if (error) throw handleSupabaseError(error, 'Sign up');
      return data[0];
    } catch (error) {
      throw error;
    }
  },

  signOut() {
    return { success: true };
  }
};

// ===============================================
// API LAYER - PRODUCTS
// ===============================================
export const productsAPI = {
  async getAllProducts(filters = {}) {
    try {
      let query = supabase.from('products').select('*');

      if (filters.tag) {
        query = query.eq('tag', filters.tag);
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw handleSupabaseError(error, 'Get products');
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw handleSupabaseError(error, 'Get product');
      return data;
    } catch (error) {
      throw error;
    }
  },

  async createProduct(product) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      if (error) throw handleSupabaseError(error, 'Create product');
      return data[0];
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw handleSupabaseError(error, 'Update product');
      return data[0];
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw handleSupabaseError(error, 'Delete product');
      return true;
    } catch (error) {
      throw error;
    }
  }
};

// ===============================================
// API LAYER - PROMO ITEMS
// ===============================================
export const promoAPI = {
  async getAllPromoItems(filters = {}) {
    try {
      let query = supabase.from('promo_items').select('*');

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw handleSupabaseError(error, 'Get promo items');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// ===============================================
// API LAYER - CUSTOMERS
// ===============================================
export const customersAPI = {
  async getAllCustomers(filters = {}) {
    try {
      let query = supabase.from('customers').select('*');

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,username.ilike.%${filters.search}%`);
      }

      if (filters.loyaltyTier) {
        query = query.eq('loyalty_tier', filters.loyaltyTier);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw handleSupabaseError(error, 'Get customers');
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getCustomerById(id) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw handleSupabaseError(error, 'Get customer');
      return data;
    } catch (error) {
      throw error;
    }
  },

  async createCustomer(customer) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select();
      if (error) throw handleSupabaseError(error, 'Create customer');
      return data[0];
    } catch (error) {
      throw error;
    }
  }
};

// ===============================================
// API LAYER - ORDERS
// ===============================================
export const ordersAPI = {
  supabase, // expose client for direct use
  async getAllOrders(filters = {}) {
    try {
      let query = supabase.from('orders').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw handleSupabaseError(error, 'Get orders');
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getOrderById(id) {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (orderError) throw handleSupabaseError(orderError, 'Get order');

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw handleSupabaseError(itemsError, 'Get order items');

      return { ...order, items };
    } catch (error) {
      throw error;
    }
  },

  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();
      if (error) throw handleSupabaseError(error, 'Create order');
      return data[0];
    } catch (error) {
      throw error;
    }
  },

  async createOrderWithItems(orderData, itemsData) {
    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (orderError) throw handleSupabaseError(orderError, 'Create order');

      // 2. Create order items with the order ID
      const itemsWithOrderId = itemsData.map(item => ({
        ...item,
        order_id: order[0].id
      }));

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithOrderId)
        .select();

      if (itemsError) throw handleSupabaseError(itemsError, 'Create order items');

      return { order: order[0], items };
    } catch (error) {
      throw error;
    }
  }
};

// ===============================================
// API LAYER - ORDER ITEMS
// ===============================================
export const orderItemsAPI = {
  async createOrderItems(itemsData) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .insert(itemsData)
        .select();
      if (error) throw handleSupabaseError(error, 'Create order items');
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getOrderItemsByOrderId(orderId) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
      if (error) throw handleSupabaseError(error, 'Get order items');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// ===============================================
// API LAYER - FEEDBACK
// ===============================================
export const feedbackAPI = {
  async getAllFeedback(filters = {}) {
    try {
      let query = supabase.from('feedback').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw handleSupabaseError(error, 'Get feedback');
      return data;
    } catch (error) {
      throw error;
    }
  },

  async submitFeedback(feedback) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([feedback])
        .select();
      if (error) throw handleSupabaseError(error, 'Submit feedback');
      return data[0];
    } catch (error) {
      throw error;
    }
  }
};

// ===============================================
// EXPORT SEMUA API
// ===============================================
export default {
  supabase,
  testConnection,
  authAPI,
  productsAPI,
  promoAPI,
  customersAPI,
  ordersAPI,
  orderItemsAPI,
  feedbackAPI,
  SupabaseError
};
