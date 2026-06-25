import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Anon Key dari environment variables
// Penting: Jangan pernah menaruh key rahasia (service_role) di sisi client.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi bahwa environment variables sudah diatur
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env file");
}

// Inisialisasi Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * CONTOH PENGGUNAAN (Nantinya akan menggantikan logika di Login.jsx, dll)
 *
 * Ini adalah contoh API Layer yang bisa Anda bangun di atas Supabase client.
 * Memisahkan logika query dari komponen UI adalah praktik yang sangat baik.
 */

// Contoh fungsi untuk login
export const authAPI = {
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChanged(callback);
  }
};

// Contoh fungsi untuk mengambil data profil
export const profileAPI = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(); // .single() untuk mengambil satu baris data

    if (error) throw error;
    return data;
  }
};

// ... Anda bisa menambahkan API untuk products, orders, dll. di sini