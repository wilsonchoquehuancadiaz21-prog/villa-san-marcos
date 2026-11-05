// Cliente único de Supabase para toda la página.
(function () {
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_KEY) {
    console.error('Falta cargar Supabase o su configuración.');
    return;
  }
  if (!window.villaSanMarcosSupabase) {
    window.villaSanMarcosSupabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_KEY,
      { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: 'implicit' } }
    );
  }
})();
