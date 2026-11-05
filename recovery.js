// Recuperación de contraseña de Proyecto Villa San Marcos.
// Reutiliza el mismo cliente Supabase que usa la galería para evitar conflictos de sesión.
(async function () {
  const layer = document.getElementById('recoveryLayer');
  if (!layer) return;
  const form = document.getElementById('recoveryForm');
  const msg = document.getElementById('recoveryMessage');
  const btn = document.getElementById('savePassword');
  const show = () => { layer.style.display = 'flex'; };

  try {
    const db = window.villaSanMarcosSupabase;
    if (!db) {
      msg.className = 'error';
      msg.textContent = 'No se pudo conectar con el servicio de autenticación. Recarga la página.';
      return;
    }

    // Supabase procesa el token del enlace y emite PASSWORD_RECOVERY.
    db.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) show();
    });

    // También cubre el caso en que la sesión ya fue procesada antes de registrar el evento.
    const { data, error: sessionError } = await db.auth.getSession();
    if (sessionError) throw sessionError;
    const recoveryHash = location.hash.includes('type=recovery') ||
      location.hash.includes('access_token=') ||
      location.hash.includes('token_hash=');
    if (data.session && recoveryHash) show();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.className = '';
      msg.textContent = '';
      const password = document.getElementById('newPassword').value;
      const confirm = document.getElementById('confirmPassword').value;

      if (password.length < 8) {
        msg.className = 'error';
        msg.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        return;
      }
      if (password !== confirm) {
        msg.className = 'error';
        msg.textContent = 'Las contraseñas no coinciden. Revísalas.';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Guardando...';
      const { error } = await db.auth.updateUser({ password });
      if (error) {
        msg.className = 'error';
        msg.textContent = 'No se pudo actualizar la contraseña: ' + error.message;
        btn.disabled = false;
        btn.textContent = 'Guardar nueva contraseña';
        return;
      }

      msg.className = 'success';
      msg.textContent = '¡Contraseña actualizada correctamente! Ya puedes ingresar al administrador.';
      form.style.display = 'none';
      document.getElementById('goAdmin').style.display = 'block';
      history.replaceState(null, document.title, location.pathname + location.search);
    });
  } catch (error) {
    console.error('No se pudo iniciar la recuperación de contraseña.', error);
    msg.className = 'error';
    msg.textContent = 'No se pudo preparar la recuperación. Recarga la página e inténtalo nuevamente.';
  }
})();
