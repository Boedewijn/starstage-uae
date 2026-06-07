// ==============================================
// Stagely Auth Module
// Drop-in voor alle pagina's
// Vereist: Supabase JS v2 via CDN
// ==============================================


// Init Supabase client (vereist @supabase/supabase-js v2 geladen vóór dit script)
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Modal HTML injecteren ──────────────────────
function injectAuthModal() {
  if (document.getElementById('auth-modal')) return;
  const el = document.createElement('div');
  el.innerHTML = `
<div id="auth-modal" style="display:none;position:fixed;inset:0;z-index:99999;background:rgba(4,30,66,0.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:16px">
  <div style="background:#fff;border-radius:16px;width:100%;max-width:420px;box-shadow:0 24px 64px rgba(4,30,66,0.22);overflow:hidden;position:relative">

    <!-- Close -->
    <button onclick="closeAuthModal()" style="position:absolute;top:14px;right:14px;background:none;border:none;font-size:20px;cursor:pointer;color:#6b7280;line-height:1">✕</button>

    <!-- Step 1: keuze -->
    <div id="auth-step-role" style="padding:36px 32px 28px">
      <div style="text-align:center;margin-bottom:28px">
        <svg style="height:28px;width:auto;margin-bottom:16px" viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg"><g transform="translate(100,50)"><rect x="8" y="0" width="44" height="72" rx="22" fill="#041E42"/><rect x="8" y="0" width="44" height="24" rx="22" fill="#00A3E0"/><rect x="8" y="12" width="44" height="12" fill="#00A3E0"/><path d="M0,58 Q0,100 30,100 Q60,100 60,58" fill="none" stroke="#041E42" stroke-width="4.5" stroke-linecap="round"/><line x1="30" y1="100" x2="30" y2="125" stroke="#041E42" stroke-width="4.5" stroke-linecap="round"/><rect x="4" y="124" width="52" height="8" rx="4" fill="#E40046"/></g><g transform="translate(200,62)"><text font-family="Inter,Arial,sans-serif" font-size="86" font-weight="700" letter-spacing="-4" fill="#041E42" x="0" y="78">stagely</text><circle cx="364" cy="22" r="10" fill="#E40046"/><rect x="1" y="88" width="362" height="5" rx="2.5" fill="#00A3E0"/></g></svg>
        <div style="font-size:18px;font-weight:800;color:#041E42">Welcome — who are you?</div>
        <div style="font-size:13px;color:#6b7280;margin-top:4px">Choose how you want to continue</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <button onclick="selectRole('client')" style="background:#eaf6fd;border:2px solid #e5e7eb;border-radius:12px;padding:20px 12px;cursor:pointer;font-family:inherit;transition:all .15s;text-align:center">
          <div style="font-size:28px;margin-bottom:8px">🎟️</div>
          <div style="font-size:14px;font-weight:700;color:#041E42">I'm looking<br>for an act</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">Browse & book artists</div>
        </button>
        <button onclick="selectRole('artist')" style="background:#fff0f3;border:2px solid #e5e7eb;border-radius:12px;padding:20px 12px;cursor:pointer;font-family:inherit;transition:all .15s;text-align:center">
          <div style="font-size:28px;margin-bottom:8px">🎤</div>
          <div style="font-size:14px;font-weight:700;color:#041E42">I'm an<br>artist</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">Manage acts & bookings</div>
        </button>
      </div>
    </div>

    <!-- Step 2: login/register form -->
    <div id="auth-step-form" style="display:none;padding:28px 32px 32px">
      <button onclick="backToRole()" style="background:none;border:none;cursor:pointer;font-size:13px;color:#6b7280;padding:0;margin-bottom:20px;display:flex;align-items:center;gap:4px;font-family:inherit">← Back</button>
      <div style="margin-bottom:20px">
        <div id="auth-role-badge" style="display:inline-flex;align-items:center;gap:6px;background:#eaf6fd;border-radius:50px;padding:4px 12px;font-size:12px;font-weight:700;color:#041E42;margin-bottom:12px"></div>
        <div id="auth-form-title" style="font-size:18px;font-weight:800;color:#041E42"></div>
      </div>

      <!-- Tab: login / register -->
      <div style="display:flex;background:#f2f4f7;border-radius:8px;padding:3px;margin-bottom:20px">
        <button id="tab-login" onclick="switchTab('login')" style="flex:1;padding:8px;border:none;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;background:#fff;color:#041E42;box-shadow:0 1px 4px rgba(0,0,0,0.08)">Log in</button>
        <button id="tab-register" onclick="switchTab('register')" style="flex:1;padding:8px;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;background:transparent;color:#6b7280">Register</button>
      </div>

      <!-- Register extra veld -->
      <div id="register-name-row" style="display:none;margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:#041E42;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px">Full name</label>
        <input id="auth-name" type="text" placeholder="Your name" style="width:100%;padding:11px 14px;border:2px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#00A3E0'" onblur="this.style.borderColor='#e5e7eb'"/>
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:#041E42;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px">Email address</label>
        <input id="auth-email" type="email" placeholder="you@example.com" style="width:100%;padding:11px 14px;border:2px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#00A3E0'" onblur="this.style.borderColor='#e5e7eb'"/>
      </div>

      <div style="margin-bottom:6px">
        <label style="display:block;font-size:11px;font-weight:700;color:#041E42;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px">Password</label>
        <div style="position:relative">
          <input id="auth-password" type="password" placeholder="Min. 8 characters" style="width:100%;padding:11px 44px 11px 14px;border:2px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#00A3E0'" onblur="this.style.borderColor='#e5e7eb'" onkeydown="if(event.key==='Enter')submitAuth()"/>
          <button onclick="togglePw()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:14px;color:#6b7280" id="pw-toggle">👁</button>
        </div>
      </div>

      <div id="forgot-link" style="text-align:right;margin-bottom:16px">
        <button onclick="forgotPassword()" style="background:none;border:none;cursor:pointer;font-size:12px;color:#00A3E0;font-family:inherit">Forgot password?</button>
      </div>

      <div id="auth-error" style="display:none;background:#fff0f3;border-radius:8px;padding:10px 14px;font-size:13px;color:#E40046;margin-bottom:14px;font-weight:500"></div>

      <button id="auth-submit-btn" onclick="submitAuth()" style="width:100%;background:#041E42;color:#fff;border:none;border-radius:50px;padding:13px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;transition:background .2s">Log in</button>

      <div style="text-align:center;margin-top:14px;font-size:12px;color:#6b7280" id="auth-switch-hint">
        No account yet? <button onclick="switchTab('register')" style="background:none;border:none;cursor:pointer;color:#00A3E0;font-weight:700;font-family:inherit;font-size:12px">Register free</button>
      </div>
    </div>

    <!-- Step 3: succes -->
    <div id="auth-step-success" style="display:none;padding:48px 32px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">✅</div>
      <div style="font-size:18px;font-weight:800;color:#041E42;margin-bottom:6px" id="auth-success-title">Welcome!</div>
      <div style="font-size:13px;color:#6b7280" id="auth-success-sub">Redirecting...</div>
    </div>

  </div>
</div>`;
  document.body.appendChild(el);

  // Klik buiten modal = sluiten
  document.getElementById('auth-modal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
  });
}

// ── State ──────────────────────────────────────
let _currentRole = null;
let _currentTab = 'login';

// ── Publieke functies ──────────────────────────
function openAuthModal() {
  injectAuthModal();
  document.getElementById('auth-modal').style.display = 'flex';
  document.getElementById('auth-step-role').style.display = 'block';
  document.getElementById('auth-step-form').style.display = 'none';
  document.getElementById('auth-step-success').style.display = 'none';
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const m = document.getElementById('auth-modal');
  if (m) m.style.display = 'none';
  document.body.style.overflow = '';
}

function selectRole(role) {
  _currentRole = role;
  document.getElementById('auth-step-role').style.display = 'none';
  document.getElementById('auth-step-form').style.display = 'block';

  const badge = document.getElementById('auth-role-badge');
  const title = document.getElementById('auth-form-title');
  if (role === 'client') {
    badge.innerHTML = '🎟️ Looking for an act';
    badge.style.background = '#eaf6fd';
    title.textContent = 'Log in or create your account';
  } else {
    badge.innerHTML = '🎤 Artist';
    badge.style.background = '#fff0f3';
    title.textContent = 'Artist login';
  }
  switchTab('login');
  setTimeout(() => document.getElementById('auth-email').focus(), 50);
}

function backToRole() {
  document.getElementById('auth-step-form').style.display = 'none';
  document.getElementById('auth-step-role').style.display = 'block';
  document.getElementById('auth-error').style.display = 'none';
}

function switchTab(tab) {
  _currentTab = tab;
  const isLogin = tab === 'login';
  document.getElementById('tab-login').style.background = isLogin ? '#fff' : 'transparent';
  document.getElementById('tab-login').style.color = isLogin ? '#041E42' : '#6b7280';
  document.getElementById('tab-login').style.fontWeight = isLogin ? '700' : '600';
  document.getElementById('tab-login').style.boxShadow = isLogin ? '0 1px 4px rgba(0,0,0,0.08)' : 'none';
  document.getElementById('tab-register').style.background = !isLogin ? '#fff' : 'transparent';
  document.getElementById('tab-register').style.color = !isLogin ? '#041E42' : '#6b7280';
  document.getElementById('tab-register').style.fontWeight = !isLogin ? '700' : '600';
  document.getElementById('tab-register').style.boxShadow = !isLogin ? '0 1px 4px rgba(0,0,0,0.08)' : 'none';

  document.getElementById('register-name-row').style.display = isLogin ? 'none' : 'block';
  document.getElementById('forgot-link').style.display = isLogin ? 'block' : 'none';
  document.getElementById('auth-submit-btn').textContent = isLogin ? 'Log in' : 'Create account';
  document.getElementById('auth-switch-hint').innerHTML = isLogin
    ? 'No account yet? <button onclick="switchTab(\'register\')" style="background:none;border:none;cursor:pointer;color:#00A3E0;font-weight:700;font-family:inherit;font-size:12px">Register free</button>'
    : 'Already have an account? <button onclick="switchTab(\'login\')" style="background:none;border:none;cursor:pointer;color:#00A3E0;font-weight:700;font-family:inherit;font-size:12px">Log in</button>';
  document.getElementById('auth-error').style.display = 'none';
}

function togglePw() {
  const input = document.getElementById('auth-password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.display = 'block';
}

async function submitAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const name = document.getElementById('auth-name').value.trim();
  const btn = document.getElementById('auth-submit-btn');

  if (!email || !password) { showAuthError('Please fill in email and password.'); return; }
  if (_currentTab === 'register' && password.length < 8) { showAuthError('Password must be at least 8 characters.'); return; }

  btn.textContent = '⏳ Please wait...';
  btn.disabled = true;
  document.getElementById('auth-error').style.display = 'none';

  try {
    let result;
    if (_currentTab === 'login') {
      result = await _sb.auth.signInWithPassword({ email, password });
    } else {
      const nameParts = name.split(' ');
      result = await _sb.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: _currentRole,
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
          }
        }
      });
    }

    if (result.error) {
      const msg = result.error.message;
      if (msg.includes('Invalid login')) showAuthError('Incorrect email or password.');
      else if (msg.includes('already registered')) showAuthError('This email is already registered. Try logging in.');
      else showAuthError(msg);
      btn.textContent = _currentTab === 'login' ? 'Log in' : 'Create account';
      btn.disabled = false;
      return;
    }

    // Succes — redirect op basis van rol
    const user = result.data.user;
    const role = user?.user_metadata?.role || _currentRole;

    document.getElementById('auth-step-form').style.display = 'none';
    document.getElementById('auth-step-success').style.display = 'block';

    if (_currentTab === 'register') {
      document.getElementById('auth-success-title').textContent = 'Account created!';
      document.getElementById('auth-success-sub').textContent = 'Redirecting to your dashboard...';
    } else {
      document.getElementById('auth-success-title').textContent = 'Welcome back!';
      document.getElementById('auth-success-sub').textContent = 'Redirecting...';
    }

    setTimeout(() => {
      closeAuthModal();
      if (role === 'artist') {
        window.location.href = '/artist-login.html';
      } else {
        window.location.href = '/client-portal.html';
      }
    }, 1200);

  } catch(e) {
    showAuthError('Something went wrong. Please try again.');
    btn.textContent = _currentTab === 'login' ? 'Log in' : 'Create account';
    btn.disabled = false;
  }
}

async function forgotPassword() {
  const email = document.getElementById('auth-email').value.trim();
  if (!email) { showAuthError('Enter your email address first.'); return; }
  const { error } = await _sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password.html'
  });
  if (error) { showAuthError(error.message); return; }
  document.getElementById('auth-error').style.display = 'none';
  const btn = document.getElementById('auth-submit-btn');
  btn.textContent = '✅ Reset email sent!';
  btn.style.background = '#10b981';
  setTimeout(() => { btn.textContent = 'Log in'; btn.style.background = '#041E42'; }, 3000);
}

// ── Nav knop updaten na login ──────────────────
async function updateNavAuth() {
  const { data: { session } } = await _sb.auth.getSession();
  const loginBtn = document.getElementById('nav-login-btn');
  if (!loginBtn) return;

  if (session) {
    const role = session.user.user_metadata?.role || 'client';
    const name = session.user.user_metadata?.first_name || session.user.email.split('@')[0];
    loginBtn.textContent = '👤 ' + name;
    loginBtn.onclick = () => {
      if (role === 'artist') window.location.href = '/artist-login.html';
      else window.location.href = '/client-portal.html';
    };
  } else {
    loginBtn.textContent = '👤 Login';
    loginBtn.onclick = openAuthModal;
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  injectAuthModal();
  updateNavAuth();
});
