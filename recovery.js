// Recuperación de contraseña de Proyecto Villa San Marcos
(async function () {
  const layer = document.getElementById('recoveryLayer');
  if (!layer) return;
  const form = document.getElementById('recoveryForm');
  const msg = document.getElementById('recoveryMessage');
  const btn = document.getElementById('savePassword');
  const show = () => { layer.style.display = 'flex'; };
  try {
    if (!window.SUPABASE_URL || !window.SUPABASE_KEY || !window.supabase) return;
    const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
    db.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) show();
    });
    const { data } = await db.auth.getSession();
    if (data.session && location.hash.includes('type=recovery')) show();

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
  }
})();