import axios from 'axios'

const API_URL = "https://kxhxoltfjedlzqtljkfs.supabase.co/rest/v1/login"
const API_KEY = "sb_publishable_AbEQ5p5obbAPGWaFtaJ-7Q_wYqPROX_"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

// 1. Kebutuhan manajemen data notes/tabel utama
export const notesAPI = {
    async fetchNotes() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },
    async createNote(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    }
} 

// 2. Khusus untuk pendaftaran user baru
export const authAPI = {
    async registerUser(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    }
}

// 3. Fitur CRUD Admin User
export const userAPI = {
    async fetchUsers() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },
    async createUser(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },
    async deleteUser(id) {
        const response = await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
        return response.data
    }
}

// ==========================================
// PENGAMAN CRASH: Export default objek tiruan
// ==========================================
const supabase = {
    auth: {
        signInWithPassword: async ({ email, password }) => {
            const response = await axios.get(API_URL, { headers });
            const user = response.data.find(u => u.email === email && u.password === password);
            if (!user) throw new Error("Atelier Identity atau Secret Key salah!");
            return { data: { user }, error: null };
        }
    }
};

export default supabase;