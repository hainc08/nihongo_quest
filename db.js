import { createClient } from '@supabase/supabase-js';

// Trong Vite, biến môi trường (environment variables) phải bắt đầu bằng VITE_
// và được truy cập thông qua import.meta.env thay vì process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test kết nối
supabase
    .from('users')
    .select('*')
    .limit(1)
    .then(({ data, error }) => {
        if (error) console.error('Connection error:', error);
        else console.log('Connected:', data);
    });

export default supabase;