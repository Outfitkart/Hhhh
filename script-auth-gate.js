'use strict';
/* ================================================================
   SCRIPT-AUTH-GATE.JS — OutfitKart Luxury Auth
   ================================================================
   1. Site open → user not logged in → luxury signup/login gate
   2. Signup karo → auto login, curtain transition, store open
   3. Admin 3sec hold → sirf authorised mobiles ke liye kaam kare
   ================================================================
   index.html mein SABSE LAST script ke baad add karo:
     <script src="script-auth-gate.js"></script>
   ================================================================ */

(function () {

  /* ──────────────────────────────────────────────────────────────
     CSS — Luxury theme (admin-luxury-anim se match)
     ────────────────────────────────────────────────────────────── */
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

:root {
  --g1: #C9A84C;
  --g2: #F5E6C0;
  --g3: #B8860B;
}

#ok-auth-gate {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 20px; overflow-y: auto;
  animation: gateOverlayIn 0.5s ease both;
}
@keyframes gateOverlayIn { from{opacity:0} to{opacity:1} }
#ok-auth-gate.gate-closing {
  animation: gateOverlayOut 0.4s ease both;
  pointer-events: none;
}
@keyframes gateOverlayOut { from{opacity:1} to{opacity:0} }

.gate-card {
  position: relative; background: linear-gradient(160deg,#0e0900 0%,#160d00 40%,#100800 70%,#0a0600 100%);
  border-radius: 0; overflow: hidden;
  padding: 44px 38px 34px;
  width: 100%; max-width: 420px;
  box-shadow:
    0 0 0 1px rgba(201,168,76,0.28),
    0 0 0 2px rgba(201,168,76,0.06),
    0 50px 140px rgba(0,0,0,0.98),
    inset 0 0 100px rgba(201,168,76,0.025);
  animation: cardReveal 0.65s cubic-bezier(0.16,1,0.3,1) 0.1s both;
}
@keyframes cardReveal {
  0%   { opacity:0; transform:translateY(52px) scale(0.95); }
  100% { opacity:1; transform:translateY(0)    scale(1); }
}
.gate-card::before {
  content:''; position:absolute; top:0; left:-100%; right:0; height:1.5px;
  background:linear-gradient(90deg,transparent,var(--g1),var(--g2),var(--g1),transparent);
  animation: goldLine 0.85s cubic-bezier(0.4,0,0.2,1) 0.5s forwards; z-index:10;
}
@keyframes goldLine { 0%{left:-100%} 100%{left:0} }
.gate-card::after {
  content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,0.25),transparent);
}

.gate-corner {
  position:absolute; width:18px; height:18px;
  opacity:0; animation:cornerIn 0.45s ease 0.72s forwards;
}
.gate-corner-tl{top:10px;left:10px;border-top:1.5px solid var(--g1);border-left:1.5px solid var(--g1);}
.gate-corner-tr{top:10px;right:10px;border-top:1.5px solid var(--g1);border-right:1.5px solid var(--g1);}
.gate-corner-bl{bottom:10px;left:10px;border-bottom:1.5px solid var(--g1);border-left:1.5px solid var(--g1);}
.gate-corner-br{bottom:10px;right:10px;border-bottom:1.5px solid var(--g1);border-right:1.5px solid var(--g1);}
@keyframes cornerIn { 0%{opacity:0;transform:scale(0.4)} 100%{opacity:1;transform:scale(1)} }

.gate-dust {
  position:absolute; border-radius:50%;
  background:var(--g1); pointer-events:none;
  animation:dustFloat linear infinite;
}
@keyframes dustFloat {
  0%  {opacity:0;  transform:translateY(100%) translateX(0);}
  8%  {opacity:0.5;}
  92% {opacity:0.15;}
  100%{opacity:0;  transform:translateY(-90px) translateX(15px);}
}

.gate-crest {
  display:flex; flex-direction:column; align-items:center;
  margin-bottom:26px;
  opacity:0; animation:crestIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s forwards;
}
@keyframes crestIn{0%{opacity:0;transform:translateY(-14px)}100%{opacity:1;transform:translateY(0)}}

.gate-crest-ring {
  width:80px; height:80px; border-radius:50%;
  border:1.5px solid rgba(201,168,76,0.45);
  background:radial-gradient(circle at 38% 38%,rgba(201,168,76,0.22) 0%,rgba(201,168,76,0.05) 50%,transparent 70%);
  display:flex; align-items:center; justify-content:center;
  margin-bottom:14px; position:relative;
  box-shadow:0 0 0 4px rgba(201,168,76,0.07),0 0 0 10px rgba(201,168,76,0.03),0 0 40px rgba(201,168,76,0.18),inset 0 0 20px rgba(201,168,76,0.06);
  animation:ringBreath 3s ease infinite;
}
.gate-crest-ring::before {
  content:''; position:absolute; inset:-8px; border-radius:50%;
  border:1px solid rgba(201,168,76,0.13);
  animation:ringBreath 3s ease 0.5s infinite;
}
.gate-crest-ring::after {
  content:''; position:absolute; inset:-16px; border-radius:50%;
  border:1px dashed rgba(201,168,76,0.07);
  animation:ringRotate 12s linear infinite;
}
@keyframes ringBreath{0%,100%{opacity:0.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
@keyframes ringRotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.gate-crest-img{width:44px;height:44px;object-fit:contain;filter:drop-shadow(0 0 14px rgba(201,168,76,0.65)) drop-shadow(0 0 6px rgba(201,168,76,0.4));animation:logoGlow 3s ease infinite;}
@keyframes logoGlow{0%,100%{filter:drop-shadow(0 0 10px rgba(201,168,76,0.5)) drop-shadow(0 0 5px rgba(201,168,76,0.3))}50%{filter:drop-shadow(0 0 20px rgba(201,168,76,0.85)) drop-shadow(0 0 10px rgba(245,230,192,0.4))}}
.gate-crest-wordmark{
  font-family:'Cinzel',serif;font-size:20px;font-weight:700;
  letter-spacing:0.32em;text-transform:uppercase;
  background:linear-gradient(135deg,var(--g3) 0%,var(--g1) 35%,var(--g2) 55%,var(--g1) 75%,var(--g3) 100%);
  background-size:200% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;
  animation:wordmarkShimmer 4s linear infinite;
}
@keyframes wordmarkShimmer{0%{background-position:0% center}100%{background-position:200% center}}
.gate-divider{display:flex;align-items:center;gap:8px;margin-top:8px;}
.gate-divider-line{height:1px;width:32px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.45));}
.gate-divider-line.r{background:linear-gradient(90deg,rgba(201,168,76,0.45),transparent);}
.gate-divider-gem{width:5px;height:5px;border-radius:50%;background:var(--g1);box-shadow:0 0 7px rgba(201,168,76,0.7);}
.gate-crest-tagline{
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:11px;color:rgba(201,168,76,0.42);letter-spacing:0.22em;margin-top:6px;
}

.gate-tabs{
  display:flex; margin-bottom:24px;
  border-bottom:1px solid rgba(201,168,76,0.15);
  opacity:0; animation:fadeUp 0.4s ease 0.5s forwards;
}
@keyframes fadeUp{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
.gate-tab-btn{
  flex:1; padding:10px 0;
  font-family:'Cinzel',serif; font-size:9px; font-weight:600;
  letter-spacing:0.22em; text-transform:uppercase;
  color:rgba(201,168,76,0.38); background:none; border:none;
  border-bottom:1.5px solid transparent; margin-bottom:-1px;
  cursor:pointer; transition:all 0.25s;
}
.gate-tab-btn.active{color:var(--g1);border-bottom-color:var(--g1);}
.gate-tab-btn:hover:not(.active){color:rgba(201,168,76,0.6);}

.gate-form{display:flex;flex-direction:column;gap:16px;}
.gate-form.gate-hidden{display:none;}

.gate-field{opacity:0;animation:fieldSlide 0.42s ease forwards;}
.gate-field:nth-child(1){animation-delay:0.54s;}
.gate-field:nth-child(2){animation-delay:0.62s;}
.gate-field:nth-child(3){animation-delay:0.70s;}
.gate-field:nth-child(4){animation-delay:0.78s;}
@keyframes fieldSlide{0%{opacity:0;transform:translateX(-12px)}100%{opacity:1;transform:translateX(0)}}

.gate-lbl{
  display:block; font-family:'Cinzel',serif; font-size:8px;
  font-weight:600; letter-spacing:0.32em; text-transform:uppercase;
  color:rgba(201,168,76,0.55); margin-bottom:8px;
}
.gate-input-wrap{
  display:flex; border:1px solid rgba(201,168,76,0.18);
  background:rgba(255,255,255,0.025);
  transition:border-color 0.3s,background 0.3s,box-shadow 0.3s;
}
.gate-input-wrap:focus-within{
  border-color:rgba(201,168,76,0.55);
  background:rgba(201,168,76,0.04);
  box-shadow:0 0 0 3px rgba(201,168,76,0.06);
}
.gate-prefix{
  display:flex;align-items:center;padding:0 12px;
  font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.05em;
  color:rgba(201,168,76,0.45);border-right:1px solid rgba(201,168,76,0.13);
  background:rgba(201,168,76,0.035);white-space:nowrap;
}
.gate-input{
  flex:1;background:transparent!important;
  border:none!important;outline:none!important;
  padding:13px 15px;
  font-family:'Cormorant Garamond',serif;
  font-size:15px;color:rgba(245,230,192,0.88)!important;
  letter-spacing:0.04em;box-shadow:none!important;
}
.gate-input::placeholder{color:rgba(201,168,76,0.22);font-style:italic;}

.gate-btn{
  width:100%;padding:15px;margin-top:6px;
  background:linear-gradient(135deg,rgba(45,31,0,0.9) 0%,rgba(201,168,76,0.07) 50%,rgba(45,31,0,0.9) 100%);
  border:1px solid rgba(201,168,76,0.38);
  color:var(--g1);font-family:'Cinzel',serif;
  font-size:10px;font-weight:600;letter-spacing:0.38em;text-transform:uppercase;
  cursor:pointer;position:relative;overflow:hidden;transition:all 0.4s;
  opacity:0;animation:btnIn 0.4s ease 0.86s forwards;
}
@keyframes btnIn{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
.gate-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,0.12),transparent);
  transform:translateX(-100%);transition:transform 0.55s ease;
}
.gate-btn:hover{
  border-color:rgba(201,168,76,0.75);color:var(--g2);
  box-shadow:0 0 28px rgba(201,168,76,0.14);
  background:linear-gradient(135deg,rgba(201,168,76,0.07) 0%,rgba(201,168,76,0.14) 50%,rgba(201,168,76,0.07) 100%);
}
.gate-btn:hover::before{transform:translateX(100%);}
.gate-btn:active{transform:scale(0.978);}
.gate-btn.loading{pointer-events:none;color:transparent;}
.gate-btn.loading::after{
  content:'';position:absolute;inset:0;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='16' fill='none' stroke='%23C9A84C' stroke-width='2' stroke-dasharray='60 20' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 20 20' to='360 20 20' dur='0.9s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/svg%3E") center/22px no-repeat;
}

.gate-err{
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:12px;color:rgba(220,90,90,0.9);text-align:center;
  letter-spacing:0.07em;display:none;
  animation:errIn 0.3s ease both;
}
.gate-err.visible{display:block;}
@keyframes errIn{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}

.gate-shake{animation:gShk 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both!important;}
@keyframes gShk{
  0%,100%{transform:translateX(0)}
  14%{transform:translateX(-9px) rotate(-0.5deg)}
  28%{transform:translateX(8px)  rotate( 0.5deg)}
  42%{transform:translateX(-7px) rotate(-0.3deg)}
  57%{transform:translateX(5px)  rotate( 0.3deg)}
  71%{transform:translateX(-3px)} 85%{transform:translateX(2px)}
}
.gate-flash{
  position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at center,rgba(201,168,76,0.35) 0%,rgba(201,168,76,0.12) 40%,transparent 70%);
  animation:gFlash 0.7s ease forwards;
}
@keyframes gFlash{0%{opacity:0}25%{opacity:1}100%{opacity:0}}

.gate-switch{
  display:block;text-align:center;margin-top:14px;
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:12px;color:rgba(201,168,76,0.32);cursor:pointer;
  letter-spacing:0.12em;transition:color 0.3s;
  opacity:0;animation:fadeUp 0.4s ease 0.95s forwards;
}
.gate-switch:hover{color:rgba(201,168,76,0.65);}
.gate-guest{
  margin-top:14px;text-align:center;
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:11px;color:rgba(201,168,76,0.2);cursor:pointer;
  letter-spacing:0.12em;transition:color 0.3s;
  opacity:0;animation:fadeUp 0.4s ease 1.05s forwards;
}
.gate-guest:hover{color:rgba(201,168,76,0.48);}

/* ── CURTAIN ── */
#ok-gate-curtain{position:fixed;inset:0;z-index:99998;display:none;overflow:hidden;}
#ok-gate-curtain.visible{display:block;}
.gc-left,.gc-right{
  position:absolute;top:0;bottom:0;width:50%;
  background:linear-gradient(160deg,#0d0800 0%,#1a0e00 60%,#0d0800 100%);
  animation:gcClose 0.55s cubic-bezier(0.76,0,0.24,1) both;
}
.gc-left{left:0;transform-origin:left;}
.gc-right{right:0;transform-origin:right;}
.gc-left.open {animation:gcOpenL 0.65s cubic-bezier(0.76,0,0.24,1) both;}
.gc-right.open{animation:gcOpenR 0.65s cubic-bezier(0.76,0,0.24,1) both;}
@keyframes gcClose{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes gcOpenL{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes gcOpenR{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
.gc-seam{
  position:absolute;top:0;bottom:0;left:50%;
  width:2px;transform:translateX(-50%);
  background:linear-gradient(180deg,transparent 0%,var(--g1) 20%,var(--g2) 50%,var(--g1) 80%,transparent 100%);
  box-shadow:0 0 22px rgba(201,168,76,0.65),0 0 55px rgba(201,168,76,0.2);
  animation:seamIn 0.5s ease both;z-index:2;
}
@keyframes seamIn{0%{opacity:0;transform:translateX(-50%) scaleY(0)}100%{opacity:1;transform:translateX(-50%) scaleY(1)}}
.gc-seam.out{animation:seamOut 0.35s ease both;}
@keyframes seamOut{0%{opacity:1}100%{opacity:0}}
.gc-scan{
  position:absolute;left:0;right:0;height:2px;z-index:3;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,0.7) 50%,transparent);
  box-shadow:0 0 12px rgba(201,168,76,0.35);
  animation:scanDown 1.05s cubic-bezier(0.4,0,0.6,1) 0.18s both;
}
@keyframes scanDown{0%{top:0;opacity:0}4%{opacity:1}96%{opacity:1}100%{top:100%;opacity:0}}
.gc-center{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  display:flex;flex-direction:column;align-items:center;gap:12px;
  z-index:4;animation:ccIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both;
}
@keyframes ccIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.65)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
@keyframes ccOut{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.18)}}
.gc-center.exit{animation:ccOut 0.35s ease both;}
.gc-ring{
  width:80px;height:80px;border-radius:50%;
  border:1px solid rgba(201,168,76,0.38);
  display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle at 40% 40%,rgba(201,168,76,0.14) 0%,transparent 60%);
  box-shadow:0 0 40px rgba(201,168,76,0.12);
}
.gc-ring-img{width:40px;height:40px;object-fit:contain;filter:drop-shadow(0 0 10px rgba(201,168,76,0.55));}
.gc-wordmark{
  font-family:'Cinzel',serif;font-size:14px;font-weight:700;
  letter-spacing:0.42em;text-transform:uppercase;
  background:linear-gradient(135deg,var(--g3),var(--g1),var(--g2),var(--g3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.gc-status{
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:12px;color:rgba(201,168,76,0.48);letter-spacing:0.18em;
  animation:stPulse 1.1s ease infinite;
}
@keyframes stPulse{0%,100%{opacity:0.48}50%{opacity:0.9}}
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

  function spawnDust(host, n) {
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'gate-dust';
      d.style.cssText = `left:${Math.random()*100}%;bottom:0;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;animation-duration:${2.8+Math.random()*3.5}s;animation-delay:${Math.random()*4}s;`;
      host.appendChild(d);
    }
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
        <div class="gate-corner gate-corner-tl"></div>
        <div class="gate-corner gate-corner-tr"></div>
        <div class="gate-corner gate-corner-bl"></div>
        <div class="gate-corner gate-corner-br"></div>
        <div id="gate-dust-host" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>

        <div class="gate-crest">
          <div class="gate-crest-ring">
            <img class="gate-crest-img" src="https://i.ibb.co/5gXg0WTr/1774263119958.png" alt="OutfitKart" onerror="this.style.display='none'">
          </div>
          <div class="gate-crest-wordmark">OutfitKart</div>
          <div class="gate-divider">
            <div class="gate-divider-line"></div>
            <div class="gate-divider-gem"></div>
            <div class="gate-divider-line r"></div>
          </div>
          <div class="gate-crest-tagline">Premium Fashion Store</div>
        </div>

        <div class="gate-tabs">
          <button class="gate-tab-btn active" id="gate-tab-login"  onclick="_gateTab('login')">Login</button>
          <button class="gate-tab-btn"        id="gate-tab-signup" onclick="_gateTab('signup')">New Account</button>
        </div>

        <div class="gate-err" id="gate-err"></div>

        <!-- LOGIN -->
        <div class="gate-form" id="gate-form-login">
          <div class="gate-field">
            <label class="gate-lbl">Mobile Number</label>
            <div class="gate-input-wrap">
              <div class="gate-prefix">+91</div>
              <input type="tel" id="gate-mob-login" maxlength="10" class="gate-input" placeholder="Registered number"
                onkeydown="if(event.key==='Enter') document.getElementById('gate-pass-login').focus()">
            </div>
          </div>
          <div class="gate-field">
            <label class="gate-lbl">Password</label>
            <div class="gate-input-wrap">
              <input type="password" id="gate-pass-login" class="gate-input" placeholder="Aapka password" style="padding-left:16px;"
                onkeydown="if(event.key==='Enter') _gateLogin()">
            </div>
          </div>
          <button class="gate-btn" id="gate-btn-login" onclick="_gateLogin()">Enter the Store</button>
          <div class="gate-switch" onclick="_gateTab('signup')">New here? Create your account →</div>
        </div>

        <!-- SIGNUP -->
        <div class="gate-form gate-hidden" id="gate-form-signup">
          <div class="gate-field">
            <label class="gate-lbl">Full Name</label>
            <div class="gate-input-wrap">
              <input type="text" id="gate-name" class="gate-input" placeholder="Aapka poora naam" style="padding-left:16px;">
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
            <label class="gate-lbl">Email <span style="opacity:0.4;font-size:7px;">(Optional)</span></label>
            <div class="gate-input-wrap">
              <input type="email" id="gate-email" class="gate-input" placeholder="email@example.com" style="padding-left:16px;">
            </div>
          </div>
          <div class="gate-field">
            <label class="gate-lbl">Password</label>
            <div class="gate-input-wrap">
              <input type="password" id="gate-pass-signup" class="gate-input" placeholder="Min 6 characters" style="padding-left:16px;"
                onkeydown="if(event.key==='Enter') _gateSignup()">
            </div>
          </div>
          <button class="gate-btn" id="gate-btn-signup" onclick="_gateSignup()">Create Account</button>
          <div class="gate-switch" onclick="_gateTab('login')">Already a member? Login →</div>
        </div>

        <div class="gate-guest" onclick="_gateClose()">Browse as Guest</div>
      </div>
    `;
    document.body.appendChild(gate);
    spawnDust(document.getElementById('gate-dust-host'), 14);
    setTimeout(() => document.getElementById('gate-mob-login')?.focus(), 460);
  }

  /* ──────────────────────────────────────────────────────────────
     TAB SWITCH
     ────────────────────────────────────────────────────────────── */
  function _gateTab(tab) {
    ['login','signup'].forEach(t => {
      document.getElementById(`gate-tab-${t}`)?.classList.toggle('active', t === tab);
      document.getElementById(`gate-form-${t}`)?.classList.toggle('gate-hidden', t !== tab);
    });
    document.getElementById('gate-err')?.classList.remove('visible');

    // Re-trigger field animations
    const fields = document.querySelectorAll(`#gate-form-${tab} .gate-field`);
    fields.forEach((f, i) => {
      f.style.animation = 'none'; f.style.opacity = '0';
      requestAnimationFrame(() => {
        f.style.animation = `fieldSlide 0.42s ease ${0.05 + i * 0.08}s forwards`;
      });
    });
    const btn = document.getElementById(`gate-btn-${tab}`);
    if (btn) {
      btn.style.animation = 'none'; btn.style.opacity = '0';
      requestAnimationFrame(() => { btn.style.animation = 'btnIn 0.4s ease 0.4s forwards'; });
    }
    setTimeout(() => {
      document.getElementById(tab === 'login' ? 'gate-mob-login' : 'gate-name')?.focus();
    }, 200);
  }

  /* ──────────────────────────────────────────────────────────────
     ERROR DISPLAY
     ────────────────────────────────────────────────────────────── */
  function _gateError(msg) {
    const errEl = document.getElementById('gate-err');
    const card  = document.getElementById('gate-card');
    if (errEl) { errEl.textContent = '⚠ ' + msg; errEl.classList.add('visible'); setTimeout(() => errEl.classList.remove('visible'), 4500); }
    if (card)  { card.classList.add('gate-shake'); setTimeout(() => card.classList.remove('gate-shake'), 600); }
  }

  /* ──────────────────────────────────────────────────────────────
     SUCCESS → AUTO LOGIN → CURTAIN → STORE
     ────────────────────────────────────────────────────────────── */
  async function _gateSuccess(user, isNew) {
    // Flash
    const card = document.getElementById('gate-card');
    if (card) { const f = document.createElement('div'); f.className = 'gate-flash'; card.appendChild(f); setTimeout(() => f.remove(), 800); }

    // Set session
    localStorage.setItem('outfitkart_session', JSON.stringify(user));
    if (typeof window.currentUser  !== 'undefined') window.currentUser  = user;
    if (typeof window.walletBalance !== 'undefined') window.walletBalance = user.wallet || 0;

    await sleep(500);

    // Hide gate immediately (curtain takes over)
    const gate = document.getElementById('ok-auth-gate');
    if (gate) gate.style.display = 'none';

    // Curtain
    await _runCurtain(user.name || 'Welcome', isNew);

    // Update app
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
     SIGNUP → AUTO LOGIN (same _gateSuccess flow)
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

      // Duplicate check
      const { data: existing } = await client
        .from('users').select('mobile').eq('mobile', mobile).maybeSingle();
      if (existing) {
        btn?.classList.remove('loading');
        return _gateError('Yeh number already registered hai — Login karo');
      }

      // Referral code
      const refCode = name.replace(/\s+/g,'').toUpperCase().slice(0,4)
        + Math.random().toString(36).toUpperCase().slice(2,6);

      const payload = { name, mobile, password, wallet: 0, email: email || null, referral_code: refCode };

      // Pending referral from URL
      const urlRef = new URLSearchParams(window.location.search).get('ref')
        || localStorage.getItem('ok_pending_ref');
      if (urlRef && urlRef.toUpperCase() !== refCode) payload.referred_by = urlRef.toUpperCase();

      const { data: user, error } = await client
        .from('users').insert([payload]).select().single();
      if (error) throw error;

      localStorage.removeItem('ok_pending_ref');

      // ── AUTO LOGIN — exact same flow as login ──
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
    setTimeout(() => gate.remove(), 400);
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
    await sleep(320);

    if (status) status.textContent = `Welcome, ${userName}`;
    await sleep(480);
    if (status) status.textContent = isNew ? 'Setting up your account...' : 'Opening your store...';
    await sleep(380);

    seam?.classList.add('out');
    center?.classList.add('exit');
    await sleep(100);
    [left, right].forEach(el => el.classList.add('open'));
    await sleep(800);

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
    if (!_isAdminUser()) return; // silently ignore for non-admins
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

    // Global exposure
    window._gateTab    = _gateTab;
    window._gateLogin  = _gateLogin;
    window._gateSignup = _gateSignup;
    window._gateClose  = _gateClose;

    // Secure admin timer override
    window.startAdminTimer  = _secureStartAdminTimer;
    window.cancelAdminTimer = _secureCancelAdminTimer;

    // Show gate if not logged in
    if (!isUserLoggedIn()) {
      setTimeout(buildGate, 380);
    }

    // Re-show on logout → home
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
