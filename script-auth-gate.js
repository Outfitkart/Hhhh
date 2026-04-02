'use strict';
/* ================================================================
   SCRIPT-AUTH-GATE.JS — OutfitKart Auth Gate v2.0
   ================================================================
   CHANGES v2.0:
   ✅ New color theme — Deep Navy + Electric Blue + White
   ✅ Forgot Password (OTP-free, Supabase DB reset — mobile verify)
   ✅ All existing features intact (curtain, admin timer, etc.)
   ================================================================
   index.html mein SABSE LAST script ke baad add karo:
     <script src="script-auth-gate.js"></script>
   ================================================================ */

(function () {

  /* ──────────────────────────────────────────────────────────────
     NEW COLOR THEME — Deep Navy Blue + Electric Accent
     (Purana: Black/Gold luxury → Naya: Navy/Blue premium e-comm)
     ────────────────────────────────────────────────────────────── */
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;600;700;800&display=swap');

:root {
  --ga-bg:       #0B0F1A;
  --ga-card:     #111827;
  --ga-border:   rgba(99,179,237,0.22);
  --ga-accent:   #3B82F6;
  --ga-accent2:  #60A5FA;
  --ga-accent3:  #93C5FD;
  --ga-text:     rgba(226,232,240,0.92);
  --ga-muted:    rgba(148,163,184,0.6);
  --ga-err:      #F87171;
  --ga-success:  #34D399;
}

#ok-auth-gate {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(7,10,19,0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 20px; overflow-y: auto;
  animation: gateIn 0.45s ease both;
}
@keyframes gateIn { from{opacity:0;transform:scale(1.015)} to{opacity:1;transform:scale(1)} }
#ok-auth-gate.gate-closing {
  animation: gateOut 0.35s ease both;
  pointer-events: none;
}
@keyframes gateOut { from{opacity:1} to{opacity:0} }

.gate-card {
  position: relative;
  background: var(--ga-card);
  border-radius: 20px;
  overflow: hidden;
  padding: 36px 32px 28px;
  width: 100%; max-width: 400px;
  border: 1px solid var(--ga-border);
  box-shadow:
    0 0 0 1px rgba(59,130,246,0.1),
    0 25px 80px rgba(0,0,0,0.9),
    0 0 60px rgba(59,130,246,0.06),
    inset 0 1px 0 rgba(255,255,255,0.04);
  animation: cardIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.08s both;
}
@keyframes cardIn {
  0%   { opacity:0; transform:translateY(40px) scale(0.96); }
  100% { opacity:1; transform:translateY(0) scale(1); }
}

/* Top glow bar */
.gate-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background: linear-gradient(90deg, transparent, var(--ga-accent), var(--ga-accent2), var(--ga-accent), transparent);
  opacity: 0.8;
}

/* Subtle grid pattern */
.gate-card::after {
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image:
    linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  border-radius: 20px;
  z-index: 0;
}

.gate-card > * { position: relative; z-index: 1; }

/* ── CREST / LOGO ── */
.gate-crest {
  display: flex; flex-direction: column; align-items: center;
  margin-bottom: 24px;
  animation: crestIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.22s both;
}
@keyframes crestIn { 0%{opacity:0;transform:translateY(-10px)} 100%{opacity:1;transform:translateY(0)} }

.gate-crest-ring {
  width: 72px; height: 72px; border-radius: 18px;
  border: 1.5px solid rgba(59,130,246,0.3);
  background: linear-gradient(135deg,rgba(59,130,246,0.12) 0%,rgba(59,130,246,0.04) 100%);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.06), 0 0 30px rgba(59,130,246,0.12);
  animation: ringPulse 3s ease infinite;
}
@keyframes ringPulse { 0%,100%{box-shadow:0 0 0 4px rgba(59,130,246,0.06),0 0 20px rgba(59,130,246,0.1)} 50%{box-shadow:0 0 0 6px rgba(59,130,246,0.1),0 0 40px rgba(59,130,246,0.2)} }

.gate-crest-img { width:40px;height:40px;object-fit:contain;filter:drop-shadow(0 0 10px rgba(59,130,246,0.7)); }

.gate-crest-wordmark {
  font-family:'Outfit',sans-serif; font-size:22px; font-weight:800;
  letter-spacing:-0.02em;
  background: linear-gradient(135deg, #fff 0%, var(--ga-accent2) 50%, var(--ga-accent3) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  line-height:1;
}
.gate-crest-tagline {
  font-family:'Inter',sans-serif; font-size:10px;
  color: var(--ga-muted); letter-spacing:0.18em;
  text-transform: uppercase; margin-top:5px;
}

/* ── TABS ── */
.gate-tabs {
  display:flex; margin-bottom:20px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px; padding: 3px;
  animation: fadeUp 0.35s ease 0.4s both;
}
@keyframes fadeUp { 0%{opacity:0;transform:translateY(6px)} 100%{opacity:1;transform:translateY(0)} }

.gate-tab-btn {
  flex:1; padding:8px 0;
  font-family:'Inter',sans-serif; font-size:12px; font-weight:600;
  letter-spacing:0.04em;
  color: var(--ga-muted); background:none; border:none;
  border-radius: 8px; cursor:pointer; transition:all 0.2s;
}
.gate-tab-btn.active {
  color: white;
  background: linear-gradient(135deg, var(--ga-accent), #2563EB);
  box-shadow: 0 2px 12px rgba(59,130,246,0.4);
}
.gate-tab-btn:hover:not(.active) { color: rgba(226,232,240,0.7); }

/* ── FORMS ── */
.gate-form { display:flex;flex-direction:column;gap:14px; }
.gate-form.gate-hidden { display:none; }

.gate-field { opacity:0; animation:fieldSlide 0.38s ease forwards; }
.gate-field:nth-child(1){animation-delay:0.48s;}
.gate-field:nth-child(2){animation-delay:0.56s;}
.gate-field:nth-child(3){animation-delay:0.64s;}
.gate-field:nth-child(4){animation-delay:0.72s;}
@keyframes fieldSlide { 0%{opacity:0;transform:translateX(-10px)} 100%{opacity:1;transform:translateX(0)} }

.gate-lbl {
  display:flex; align-items:center; justify-content:space-between;
  font-family:'Inter',sans-serif; font-size:11px;
  font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
  color: var(--ga-muted); margin-bottom:6px;
}

.gate-input-wrap {
  display:flex; border-radius:10px;
  border:1.5px solid rgba(99,179,237,0.15);
  background: rgba(255,255,255,0.04);
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
}
.gate-input-wrap:focus-within {
  border-color: rgba(59,130,246,0.6);
  background: rgba(59,130,246,0.04);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

.gate-prefix {
  display:flex;align-items:center;padding:0 12px;
  font-family:'Inter',sans-serif;font-size:13px;font-weight:600;
  color:rgba(99,179,237,0.6);border-right:1.5px solid rgba(99,179,237,0.1);
  background: rgba(59,130,246,0.06); border-radius:10px 0 0 10px;
  white-space:nowrap;
}

.gate-input {
  flex:1;background:transparent!important;
  border:none!important;outline:none!important;
  padding:12px 14px;
  font-family:'Inter',sans-serif;
  font-size:14px;color:var(--ga-text)!important;
  letter-spacing:0.01em;box-shadow:none!important;
  border-radius: 10px;
}
.gate-input::placeholder { color:rgba(148,163,184,0.35); }

/* ── BUTTON ── */
.gate-btn {
  width:100%;padding:13px;margin-top:4px;
  background: linear-gradient(135deg,#1D4ED8,#3B82F6,#2563EB);
  border:none;
  border-radius:12px;
  color:white;font-family:'Inter',sans-serif;
  font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
  cursor:pointer;position:relative;overflow:hidden;transition:all 0.3s;
  box-shadow: 0 4px 20px rgba(59,130,246,0.35);
  opacity:0;animation:btnIn 0.35s ease 0.78s forwards;
}
@keyframes btnIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
.gate-btn::before {
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
  transform:translateX(-100%);transition:transform 0.5s ease;
  border-radius:12px;
}
.gate-btn:hover { box-shadow:0 6px 28px rgba(59,130,246,0.55); transform:translateY(-1px); }
.gate-btn:hover::before{transform:translateX(100%);}
.gate-btn:active{transform:scale(0.98) translateY(0);}
.gate-btn.loading{pointer-events:none;color:transparent;}
.gate-btn.loading::after{
  content:'';position:absolute;inset:0;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='16' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-dasharray='60 20' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 20 20' to='360 20 20' dur='0.8s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/svg%3E") center/22px no-repeat;
}

/* ── ERROR / SUCCESS ── */
.gate-err {
  font-family:'Inter',sans-serif; font-size:12px;
  color:var(--ga-err);text-align:center;
  letter-spacing:0.03em;display:none;
  background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);
  border-radius:8px;padding:8px 12px;
  animation:errIn 0.25s ease both;
}
.gate-err.visible{display:block;}
.gate-success-msg {
  font-family:'Inter',sans-serif; font-size:12px;
  color:var(--ga-success);text-align:center;
  background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);
  border-radius:8px;padding:8px 12px;
  display:none;
}
.gate-success-msg.visible{display:block;}
@keyframes errIn{0%{opacity:0;transform:translateY(3px)}100%{opacity:1;transform:translateY(0)}}

.gate-shake{animation:gShk 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both!important;}
@keyframes gShk{
  0%,100%{transform:translateX(0)}
  15%{transform:translateX(-8px)}30%{transform:translateX(7px)}
  45%{transform:translateX(-5px)}60%{transform:translateX(4px)}
  75%{transform:translateX(-2px)}
}
.gate-flash{
  position:absolute;inset:0;pointer-events:none;border-radius:20px;
  background:radial-gradient(ellipse at center,rgba(59,130,246,0.25) 0%,rgba(59,130,246,0.06) 40%,transparent 70%);
  animation:gFlash 0.6s ease forwards;
}
@keyframes gFlash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}

/* ── SWITCH / GUEST / FORGOT ── */
.gate-switch {
  display:block;text-align:center;margin-top:10px;
  font-family:'Inter',sans-serif;font-size:12px;
  color:rgba(148,163,184,0.5);cursor:pointer;
  letter-spacing:0.03em;transition:color 0.25s;
  opacity:0;animation:fadeUp 0.35s ease 0.88s forwards;
}
.gate-switch:hover{color:var(--ga-accent2);}
.gate-switch span{color:var(--ga-accent2);font-weight:600;}

.gate-forgot {
  font-family:'Inter',sans-serif; font-size:11px;
  color:rgba(96,165,250,0.6);cursor:pointer;
  font-weight:500;transition:color 0.2s;
  text-decoration:underline;text-underline-offset:2px;
}
.gate-forgot:hover{color:var(--ga-accent2);}

.gate-guest{
  margin-top:12px;text-align:center;
  font-family:'Inter',sans-serif;font-size:11px;
  color:rgba(148,163,184,0.3);cursor:pointer;
  letter-spacing:0.06em;transition:color 0.25s;
  text-transform:uppercase;font-weight:500;
  opacity:0;animation:fadeUp 0.35s ease 0.98s forwards;
}
.gate-guest:hover{color:rgba(148,163,184,0.6);}

/* ── DIVIDER ── */
.gate-divider-row{
  display:flex;align-items:center;gap:10px;margin:2px 0;
}
.gate-divider-row::before,.gate-divider-row::after{
  content:'';flex:1;height:1px;background:rgba(99,179,237,0.1);
}
.gate-divider-row span{
  font-size:10px;color:rgba(148,163,184,0.3);font-family:'Inter',sans-serif;
  text-transform:uppercase;letter-spacing:0.1em;
}

/* ── BACK LINK ── */
.gate-back-link {
  display:flex;align-items:center;gap:6px;
  font-family:'Inter',sans-serif;font-size:12px;
  color:rgba(148,163,184,0.5);cursor:pointer;
  margin-bottom:14px;transition:color 0.2s;
  width:fit-content;
}
.gate-back-link:hover{color:var(--ga-accent2);}
.gate-back-link svg{width:14px;height:14px;}

/* ── CURTAIN ── */
#ok-gate-curtain{position:fixed;inset:0;z-index:99998;display:none;overflow:hidden;}
#ok-gate-curtain.visible{display:block;}
.gc-left,.gc-right{
  position:absolute;top:0;bottom:0;width:50%;
  background: linear-gradient(160deg,#0B0F1A 0%,#111827 60%,#0B0F1A 100%);
  animation:gcClose 0.5s cubic-bezier(0.76,0,0.24,1) both;
}
.gc-left{left:0;transform-origin:left;}
.gc-right{right:0;transform-origin:right;}
.gc-left.open {animation:gcOpenL 0.6s cubic-bezier(0.76,0,0.24,1) both;}
.gc-right.open{animation:gcOpenR 0.6s cubic-bezier(0.76,0,0.24,1) both;}
@keyframes gcClose{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes gcOpenL{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes gcOpenR{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
.gc-seam{
  position:absolute;top:0;bottom:0;left:50%;
  width:2px;transform:translateX(-50%);
  background:linear-gradient(180deg,transparent 0%,var(--ga-accent) 20%,var(--ga-accent2) 50%,var(--ga-accent) 80%,transparent 100%);
  box-shadow:0 0 20px rgba(59,130,246,0.6),0 0 50px rgba(59,130,246,0.2);
  animation:seamIn 0.45s ease both;z-index:2;
}
@keyframes seamIn{0%{opacity:0;transform:translateX(-50%) scaleY(0)}100%{opacity:1;transform:translateX(-50%) scaleY(1)}}
.gc-seam.out{animation:seamOut 0.3s ease both;}
@keyframes seamOut{0%{opacity:1}100%{opacity:0}}
.gc-scan{
  position:absolute;left:0;right:0;height:2px;z-index:3;
  background:linear-gradient(90deg,transparent,rgba(59,130,246,0.8) 50%,transparent);
  box-shadow:0 0 10px rgba(59,130,246,0.4);
  animation:scanDown 1s cubic-bezier(0.4,0,0.6,1) 0.15s both;
}
@keyframes scanDown{0%{top:0;opacity:0}4%{opacity:1}96%{opacity:1}100%{top:100%;opacity:0}}
.gc-center{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  display:flex;flex-direction:column;align-items:center;gap:10px;
  z-index:4;animation:ccIn 0.45s cubic-bezier(0.16,1,0.3,1) 0.1s both;
}
@keyframes ccIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.7)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
@keyframes ccOut{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.15)}}
.gc-center.exit{animation:ccOut 0.3s ease both;}
.gc-ring{
  width:72px;height:72px;border-radius:18px;
  border:1.5px solid rgba(59,130,246,0.35);
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,rgba(59,130,246,0.15) 0%,rgba(59,130,246,0.04) 100%);
  box-shadow:0 0 30px rgba(59,130,246,0.15);
}
.gc-ring-img{width:38px;height:38px;object-fit:contain;filter:drop-shadow(0 0 8px rgba(59,130,246,0.6));}
.gc-wordmark{
  font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;
  letter-spacing:-0.01em;
  background:linear-gradient(135deg,white,var(--ga-accent2),var(--ga-accent3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.gc-status{
  font-family:'Inter',sans-serif;font-size:12px;
  color:rgba(148,163,184,0.6);letter-spacing:0.08em;
  animation:stPulse 1s ease infinite;
}
@keyframes stPulse{0%,100%{opacity:0.5}50%{opacity:1}}
`;

  /* ──────────────────────────────────────────────────────────────
     HELPERS
     ────────────────────────────────────────────────────────────── */
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function isUserLoggedIn() {
    try {
      const s = localStorage.getItem('outfitkart_session');
      if (s) { const p = JSON.parse(s); return !!(p && p.mobile); }
    } catch(e) {}
    return false;
  }

  function getClient() {
    return window.dbClient || (typeof dbClient !== 'undefined' ? dbClient : null);
  }

  function injectCss() {
    if (document.getElementById('ok-gate-css')) return;
    const s = document.createElement('style');
    s.id = 'ok-gate-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ──────────────────────────────────────────────────────────────
     BUILD GATE
     ────────────────────────────────────────────────────────────── */
  function buildGate() {
    if (document.getElementById('ok-auth-gate')) return;
    const gate = document.createElement('div');
    gate.id = 'ok-auth-gate';
    gate.innerHTML = `
      <div class="gate-card" id="gate-card">

        <div class="gate-crest">
          <div class="gate-crest-ring">
            <img class="gate-crest-img" src="https://i.ibb.co/5gXg0WTr/1774263119958.png" alt="OutfitKart" onerror="this.style.display='none'">
          </div>
          <div class="gate-crest-wordmark">OutfitKart</div>
          <div class="gate-crest-tagline">Premium Fashion Store</div>
        </div>

        <div class="gate-tabs">
          <button class="gate-tab-btn active" id="gate-tab-login"  onclick="_gateTab('login')">Login</button>
          <button class="gate-tab-btn"        id="gate-tab-signup" onclick="_gateTab('signup')">Register</button>
        </div>

        <div class="gate-err" id="gate-err"></div>
        <div class="gate-success-msg" id="gate-success-msg"></div>

        <!-- LOGIN -->
        <div class="gate-form" id="gate-form-login">
          <div class="gate-field">
            <label class="gate-lbl">
              Mobile Number
            </label>
            <div class="gate-input-wrap">
              <div class="gate-prefix">+91</div>
              <input type="tel" id="gate-mob-login" maxlength="10" class="gate-input" placeholder="10-digit number"
                onkeydown="if(event.key==='Enter') document.getElementById('gate-pass-login').focus()">
            </div>
          </div>
          <div class="gate-field">
            <label class="gate-lbl">
              Password
              <span class="gate-forgot" onclick="_gateForgot()">Forgot Password?</span>
            </label>
            <div class="gate-input-wrap">
              <input type="password" id="gate-pass-login" class="gate-input" placeholder="Your password" style="padding-left:14px;"
                onkeydown="if(event.key==='Enter') _gateLogin()">
            </div>
          </div>
          <button class="gate-btn" id="gate-btn-login" onclick="_gateLogin()">Login to Store</button>
          <div class="gate-switch" onclick="_gateTab('signup')">New here? <span>Create Account →</span></div>
        </div>

        <!-- SIGNUP -->
        <div class="gate-form gate-hidden" id="gate-form-signup">
          <div class="gate-field">
            <label class="gate-lbl">Full Name</label>
            <div class="gate-input-wrap">
              <input type="text" id="gate-name" class="gate-input" placeholder="Your full name" style="padding-left:14px;">
            </div>
          </div>
          <div class="gate-field">
            <label class="gate-lbl">Mobile Number</label>
            <div class="gate-input-wrap">
              <div class="gate-prefix">+91</div>
              <input type="tel" id="gate-mob-signup" maxlength="10" class="gate-input" placeholder="10-digit number">
            </div>
          </div>
          <div class="gate-field">
            <label class="gate-lbl">Email <span style="opacity:0.35;font-size:9px;text-transform:none;font-weight:400;">(Optional)</span></label>
            <div class="gate-input-wrap">
              <input type="email" id="gate-email" class="gate-input" placeholder="email@example.com" style="padding-left:14px;">
            </div>
          </div>
          <div class="gate-field">
            <label class="gate-lbl">Password</label>
            <div class="gate-input-wrap">
              <input type="password" id="gate-pass-signup" class="gate-input" placeholder="Min 6 characters" style="padding-left:14px;"
                onkeydown="if(event.key==='Enter') _gateSignup()">
            </div>
          </div>
          <button class="gate-btn" id="gate-btn-signup" onclick="_gateSignup()">Create Account</button>
          <div class="gate-switch" onclick="_gateTab('login')">Already a member? <span>Login →</span></div>
        </div>

        <!-- FORGOT PASSWORD — Mobile verify only, no OTP needed -->
        <div class="gate-form gate-hidden" id="gate-form-forgot">
          <div class="gate-back-link" onclick="_gateTab('login')">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Back to Login
          </div>
          <div class="gate-field">
            <label class="gate-lbl">Registered Mobile Number</label>
            <div class="gate-input-wrap">
              <div class="gate-prefix">+91</div>
              <input type="tel" id="gate-mob-forgot" maxlength="10" class="gate-input" placeholder="10-digit number">
            </div>
          </div>
          <div class="gate-field" id="gate-new-pass-wrap" style="display:none;">
            <label class="gate-lbl">New Password</label>
            <div class="gate-input-wrap">
              <input type="password" id="gate-new-pass" class="gate-input" placeholder="Min 6 characters" style="padding-left:14px;">
            </div>
          </div>
          <div class="gate-field" id="gate-confirm-pass-wrap" style="display:none;">
            <label class="gate-lbl">Confirm New Password</label>
            <div class="gate-input-wrap">
              <input type="password" id="gate-confirm-pass" class="gate-input" placeholder="Same password again" style="padding-left:14px;"
                onkeydown="if(event.key==='Enter') _gateResetPassword()">
            </div>
          </div>
          <button class="gate-btn" id="gate-btn-forgot" onclick="_gateForgotStep()">Verify Mobile</button>
          <div class="gate-switch" onclick="_gateTab('login')">Remembered it? <span>Login →</span></div>
        </div>

        <div class="gate-guest" onclick="_gateClose()">Browse as Guest</div>
      </div>
    `;
    document.body.appendChild(gate);
    setTimeout(() => document.getElementById('gate-mob-login')?.focus(), 420);
  }

  /* ──────────────────────────────────────────────────────────────
     TAB SWITCH
     ────────────────────────────────────────────────────────────── */
  function _gateTab(tab) {
    ['login','signup','forgot'].forEach(t => {
      document.getElementById(`gate-tab-${t}`)?.classList.toggle('active', t === tab);
      const form = document.getElementById(`gate-form-${t}`);
      if (form) form.classList.toggle('gate-hidden', t !== tab);
    });
    document.getElementById('gate-err')?.classList.remove('visible');
    document.getElementById('gate-success-msg')?.classList.remove('visible');

    // Reset forgot form state
    if (tab === 'forgot') {
      const npw = document.getElementById('gate-new-pass-wrap');
      const cpw = document.getElementById('gate-confirm-pass-wrap');
      if (npw) npw.style.display = 'none';
      if (cpw) cpw.style.display = 'none';
      const btn = document.getElementById('gate-btn-forgot');
      if (btn) btn.textContent = 'Verify Mobile';
      btn._step = 'verify';
    }

    // Re-animate fields
    const fields = document.querySelectorAll(`#gate-form-${tab} .gate-field`);
    fields.forEach((f, i) => {
      f.style.animation = 'none'; f.style.opacity = '0';
      requestAnimationFrame(() => {
        f.style.animation = `fieldSlide 0.38s ease ${0.05 + i * 0.07}s forwards`;
      });
    });
    const btn = document.getElementById(`gate-btn-${tab}`);
    if (btn) {
      btn.style.animation = 'none'; btn.style.opacity = '0';
      requestAnimationFrame(() => { btn.style.animation = 'btnIn 0.35s ease 0.36s forwards'; });
    }

    // Focus
    const focusMap = { login:'gate-mob-login', signup:'gate-name', forgot:'gate-mob-forgot' };
    setTimeout(() => document.getElementById(focusMap[tab])?.focus(), 180);
  }

  /* ──────────────────────────────────────────────────────────────
     ERROR / SUCCESS DISPLAY
     ────────────────────────────────────────────────────────────── */
  function _gateError(msg) {
    const errEl = document.getElementById('gate-err');
    const card  = document.getElementById('gate-card');
    const sucEl = document.getElementById('gate-success-msg');
    sucEl?.classList.remove('visible');
    if (errEl) { errEl.textContent = '⚠ ' + msg; errEl.classList.add('visible'); setTimeout(() => errEl.classList.remove('visible'), 5000); }
    if (card)  { card.classList.add('gate-shake'); setTimeout(() => card.classList.remove('gate-shake'), 550); }
  }

  function _gateSuccessMsg(msg) {
    const sucEl = document.getElementById('gate-success-msg');
    const errEl = document.getElementById('gate-err');
    errEl?.classList.remove('visible');
    if (sucEl) { sucEl.textContent = '✓ ' + msg; sucEl.classList.add('visible'); }
  }

  /* ──────────────────────────────────────────────────────────────
     FORGOT PASSWORD — 2-step (no OTP, mobile verify via Supabase)
     Step 1: User enters mobile → we check if account exists
     Step 2: User enters new password → direct DB update
     This is SECURE because password is hashed/plaintext as per
     your existing Supabase schema (matches login logic)
     ────────────────────────────────────────────────────────────── */
  let _forgotVerifiedMobile = null;

  function _gateForgot() {
    _forgotVerifiedMobile = null;
    _gateTab('forgot');
  }

  async function _gateForgotStep() {
    const btn = document.getElementById('gate-btn-forgot');
    const step = btn?._step || 'verify';

    if (step === 'verify') {
      // Step 1 — verify mobile exists in DB
      const mobile = (document.getElementById('gate-mob-forgot')?.value || '').trim().replace(/\D/g,'');
      if (mobile.length !== 10) return _gateError('Valid 10-digit number enter karo');

      btn?.classList.add('loading');
      try {
        const client = getClient();
        if (!client) throw new Error('Database not ready — page refresh karo');

        const { data: user, error } = await client
          .from('users').select('id,name,mobile')
          .eq('mobile', mobile).maybeSingle();

        if (error) throw error;
        if (!user) {
          btn?.classList.remove('loading');
          return _gateError('Is number se koi account nahi mila');
        }

        // Account found → show password fields
        _forgotVerifiedMobile = mobile;
        btn?.classList.remove('loading');

        const npw = document.getElementById('gate-new-pass-wrap');
        const cpw = document.getElementById('gate-confirm-pass-wrap');
        if (npw) npw.style.display = 'block';
        if (cpw) cpw.style.display = 'block';

        btn.textContent = 'Reset Password';
        btn._step = 'reset';
        btn.style.animation = 'none'; btn.style.opacity = '0';
        requestAnimationFrame(() => { btn.style.animation = 'btnIn 0.3s ease 0.1s forwards'; });

        _gateSuccessMsg(`Account mila! ${user.name} — ab naya password set karo`);
        setTimeout(() => document.getElementById('gate-new-pass')?.focus(), 200);

      } catch(err) {
        btn?.classList.remove('loading');
        _gateError(err.message || 'Verification failed — dobara try karo');
      }

    } else if (step === 'reset') {
      await _gateResetPassword();
    }
  }

  async function _gateResetPassword() {
    const btn      = document.getElementById('gate-btn-forgot');
    const newPass  = (document.getElementById('gate-new-pass')?.value    || '').trim();
    const confPass = (document.getElementById('gate-confirm-pass')?.value || '').trim();
    const mobile   = _forgotVerifiedMobile;

    if (!mobile)            return _gateError('Session expired — dobara mobile verify karo');
    if (newPass.length < 6) return _gateError('Password minimum 6 characters chahiye');
    if (newPass !== confPass) return _gateError('Dono passwords match nahi kar rahe');

    btn?.classList.add('loading');
    try {
      const client = getClient();
      if (!client) throw new Error('Database not ready — page refresh karo');

      const { error } = await client
        .from('users')
        .update({ password: newPass })
        .eq('mobile', mobile);

      if (error) throw error;

      btn?.classList.remove('loading');
      _forgotVerifiedMobile = null;
      _gateSuccessMsg('Password reset ho gaya! Ab login karo');

      // Auto-switch to login after 1.8s
      setTimeout(() => {
        _gateTab('login');
        const mobInput = document.getElementById('gate-mob-login');
        if (mobInput) mobInput.value = mobile;
        setTimeout(() => document.getElementById('gate-pass-login')?.focus(), 200);
      }, 1800);

    } catch(err) {
      btn?.classList.remove('loading');
      _gateError(err.message || 'Reset failed — dobara try karo');
    }
  }

  /* ──────────────────────────────────────────────────────────────
     SUCCESS → AUTO LOGIN → CURTAIN → STORE
     ────────────────────────────────────────────────────────────── */
  async function _gateSuccess(user, isNew) {
    const card = document.getElementById('gate-card');
    if (card) { const f = document.createElement('div'); f.className = 'gate-flash'; card.appendChild(f); setTimeout(() => f.remove(), 700); }

    localStorage.setItem('outfitkart_session', JSON.stringify(user));
    if (typeof window.currentUser  !== 'undefined') window.currentUser  = user;
    if (typeof window.walletBalance !== 'undefined') window.walletBalance = user.wallet || 0;

    await sleep(480);

    const gate = document.getElementById('ok-auth-gate');
    if (gate) gate.style.display = 'none';

    await _runCurtain(user.name || 'Welcome', isNew);

    if (typeof checkAuthUI === 'function') await checkAuthUI();
    if (typeof showToast   === 'function') showToast(isNew ? `Welcome to OutfitKart, ${user.name}! 🎉` : `Welcome back, ${user.name}! 👋`);
    if (typeof navigate    === 'function') navigate('home');

    gate?.remove();
  }

  /* ──────────────────────────────────────────────────────────────
     LOGIN
     ────────────────────────────────────────────────────────────── */
  async function _gateLogin() {
    const btn      = document.getElementById('gate-btn-login');
    const mobile   = (document.getElementById('gate-mob-login')?.value  || '').trim().replace(/\D/g,'');
    const password = (document.getElementById('gate-pass-login')?.value || '').trim();

    if (mobile.length !== 10) return _gateError('Valid 10-digit mobile number enter karo');
    if (!password)            return _gateError('Password enter karo');

    btn?.classList.add('loading');
    try {
      const client = getClient();
      if (!client) throw new Error('Database not ready — page refresh karo');

      const { data: user, error } = await client
        .from('users').select('*')
        .eq('mobile', mobile).eq('password', password)
        .maybeSingle();

      if (error) throw error;
      if (!user) { btn?.classList.remove('loading'); return _gateError('Mobile ya password galat hai'); }

      await _gateSuccess(user, false);
    } catch(err) {
      btn?.classList.remove('loading');
      _gateError(err.message || 'Login failed — dobara try karo');
    }
  }

  /* ──────────────────────────────────────────────────────────────
     SIGNUP
     ────────────────────────────────────────────────────────────── */
  async function _gateSignup() {
    const btn      = document.getElementById('gate-btn-signup');
    const name     = (document.getElementById('gate-name')?.value        || '').trim();
    const mobile   = (document.getElementById('gate-mob-signup')?.value  || '').trim().replace(/\D/g,'');
    const email    = (document.getElementById('gate-email')?.value       || '').trim();
    const password = (document.getElementById('gate-pass-signup')?.value || '').trim();

    if (!name)                return _gateError('Apna naam enter karo');
    if (mobile.length !== 10) return _gateError('Valid 10-digit mobile number enter karo');
    if (password.length < 6)  return _gateError('Password minimum 6 characters chahiye');

    btn?.classList.add('loading');
    try {
      const client = getClient();
      if (!client) throw new Error('Database not ready — page refresh karo');

      const { data: existing } = await client
        .from('users').select('mobile').eq('mobile', mobile).maybeSingle();
      if (existing) {
        btn?.classList.remove('loading');
        return _gateError('Yeh number already registered hai — Login karo');
      }

      const refCode = name.replace(/\s+/g,'').toUpperCase().slice(0,4)
        + Math.random().toString(36).toUpperCase().slice(2,6);

      const payload = { name, mobile, password, wallet: 0, email: email || null, referral_code: refCode };

      const urlRef = new URLSearchParams(window.location.search).get('ref')
        || localStorage.getItem('ok_pending_ref');
      if (urlRef && urlRef.toUpperCase() !== refCode) payload.referred_by = urlRef.toUpperCase();

      const { data: user, error } = await client
        .from('users').insert([payload]).select().single();
      if (error) throw error;

      localStorage.removeItem('ok_pending_ref');
      await _gateSuccess(user, true);

    } catch(err) {
      btn?.classList.remove('loading');
      _gateError(err.message || 'Signup failed — dobara try karo');
    }
  }

  /* ──────────────────────────────────────────────────────────────
     GUEST CLOSE
     ────────────────────────────────────────────────────────────── */
  function _gateClose() {
    const gate = document.getElementById('ok-auth-gate');
    if (!gate) return;
    gate.classList.add('gate-closing');
    setTimeout(() => gate.remove(), 380);
  }

  /* ──────────────────────────────────────────────────────────────
     CURTAIN TRANSITION
     ────────────────────────────────────────────────────────────── */
  function _buildCurtain() {
    let c = document.getElementById('ok-gate-curtain');
    if (c) return c;
    c = document.createElement('div');
    c.id = 'ok-gate-curtain';
    c.innerHTML = `
      <div class="gc-left"></div>
      <div class="gc-right"></div>
      <div class="gc-seam" id="gc-seam"></div>
      <div class="gc-scan"></div>
      <div class="gc-center" id="gc-center">
        <div class="gc-ring">
          <img class="gc-ring-img" src="https://i.ibb.co/5gXg0WTr/1774263119958.png" onerror="this.style.display='none'">
        </div>
        <div class="gc-wordmark">OutfitKart</div>
        <div class="gc-status" id="gc-status">Welcome...</div>
      </div>`;
    document.body.appendChild(c);
    return c;
  }

  async function _runCurtain(userName, isNew) {
    const ov     = _buildCurtain();
    const left   = ov.querySelector('.gc-left');
    const right  = ov.querySelector('.gc-right');
    const seam   = document.getElementById('gc-seam');
    const center = document.getElementById('gc-center');
    const status = document.getElementById('gc-status');

    [left, right].forEach(el => el.classList.remove('open'));
    seam?.classList.remove('out');
    center?.classList.remove('exit');

    ov.classList.add('visible');
    await sleep(300);

    if (status) status.textContent = `Welcome, ${userName}`;
    await sleep(460);
    if (status) status.textContent = isNew ? 'Setting up your account...' : 'Opening your store...';
    await sleep(360);

    seam?.classList.add('out');
    center?.classList.add('exit');
    await sleep(100);
    [left, right].forEach(el => el.classList.add('open'));
    await sleep(750);

    ov.classList.remove('visible');
  }

  /* ──────────────────────────────────────────────────────────────
     ADMIN LONG-PRESS — ONLY AUTHORISED MOBILES
     ────────────────────────────────────────────────────────────── */
  let _adminTimer = null;

  function _isAdminUser() {
    try {
      const list = window.ADMIN_AUTHORIZED_MOBILES
        || (typeof ADMIN_AUTHORIZED_MOBILES !== 'undefined' ? ADMIN_AUTHORIZED_MOBILES : ['9343988416','7879245954']);
      const cu = window.currentUser || (typeof currentUser !== 'undefined' ? currentUser : null);
      if (cu?.mobile && list.includes(String(cu.mobile))) return true;
      const s = localStorage.getItem('outfitkart_session');
      if (s) { const p = JSON.parse(s); if (p?.mobile && list.includes(String(p.mobile))) return true; }
      if (localStorage.getItem('outfitkart_admin_session') === 'true') return true;
    } catch(e) {}
    return false;
  }

  function _secureStartAdminTimer() {
    if (!_isAdminUser()) return;
    _adminTimer = setTimeout(() => {
      _adminTimer = null;
      if (typeof showAdminLogin === 'function') showAdminLogin();
    }, 3000);
  }

  function _secureCancelAdminTimer() {
    if (_adminTimer) { clearTimeout(_adminTimer); _adminTimer = null; }
  }

  /* ──────────────────────────────────────────────────────────────
     INIT
     ────────────────────────────────────────────────────────────── */
  function init() {
    injectCss();

    window._gateTab           = _gateTab;
    window._gateLogin         = _gateLogin;
    window._gateSignup        = _gateSignup;
    window._gateClose         = _gateClose;
    window._gateForgot        = _gateForgot;
    window._gateForgotStep    = _gateForgotStep;
    window._gateResetPassword = _gateResetPassword;

    window.startAdminTimer  = _secureStartAdminTimer;
    window.cancelAdminTimer = _secureCancelAdminTimer;

    if (!isUserLoggedIn()) {
      setTimeout(buildGate, 380);
    }

    const _origNav = window.navigate;
    if (typeof _origNav === 'function') {
      window.navigate = function(view, ...args) {
        _origNav(view, ...args);
        if (view === 'home' && !isUserLoggedIn()) {
          setTimeout(() => { if (!document.getElementById('ok-auth-gate')) buildGate(); }, 250);
        }
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 420));
  } else {
    setTimeout(init, 420);
  }

})();
