import { createClient } from '@supabase/supabase-js';

// Dohvatite vaše Supabase URL i anon (publishable) ključ
// IZ SIGURNOSNIH RAZLOGA: OVE VRIJEDNOSTI NIKADA NE STAVLJAJTE DIREKTNO U JAVNI REPO!
// U produkciji ih spremate u .env datoteku.
// Za sada, za testiranje, možete ih direktno staviti ovdje,
// ali POBRINITE SE DA IH UKLONITE PRIJE SLANJA KODA!
// Pravilno je koristiti varijable okoline (Environment Variables)
// Vite ih podržava preko .env datoteka (npr. VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
