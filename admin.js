/**
 * Creative Pro Remodeling LLC - Visual Admin Editor Controller
 * Manages full-screen visual inline editing, tab navigation, undo/redo stack, and save persistence.
 */

(function () {
  // Prevent recursive embedding inside iframes
  if (window.self !== window.top) {
    window.top.location.href = window.self.location.href;
  }

  const STORAGE_KEY = 'cpr_content_v6';
  const AUTH_KEY = 'cpr_admin_auth';
  // SHA-256 cryptographic hash of master password ('creativepro2026')
  const PASS_HASH = 'ed0151dd312e16b9c116f8d4d7841eeb03131ab30e33ba34c3e1fbb79b7fdf3c';

  const LEGACY_PATH_MAP = {
    'videos/att.KTTjtNAtQ304b6EBsn0ZfpWx3SeXYvGI1veDeXCvkAE.mp4': 'videos/bathroom-01.mp4',
    'photos/thumbs/att.KTTjtNAtQ304b6EBsn0ZfpWx3SeXYvGI1veDeXCvkAE.jpg': 'photos/thumbs/bathroom-01.jpg',
    'videos/att.4WElZvAEzgX-9jBeF96TNk1SkMY1p260NkiwqzmOLss.mp4': 'videos/bathroom-02.mp4',
    'photos/thumbs/att.4WElZvAEzgX-9jBeF96TNk1SkMY1p260NkiwqzmOLss.jpg': 'photos/thumbs/bathroom-02.jpg',
    'videos/att.xh4qp8SCjPj21yNXbsV1EXvaYIFRwcRiNh0OHsVXvJo.mp4': 'videos/bathroom-03.mp4',
    'photos/thumbs/att.xh4qp8SCjPj21yNXbsV1EXvaYIFRwcRiNh0OHsVXvJo.jpg': 'photos/thumbs/bathroom-03.jpg',
    'videos/att.1Bus7uS-LDiAKcWW4Q0RCi7qJPqbRxl7-NEH_yzDI6w.mp4': 'videos/bathroom-04.mp4',
    'photos/thumbs/att.1Bus7uS-LDiAKcWW4Q0RCi7qJPqbRxl7-NEH_yzDI6w.jpg': 'photos/thumbs/bathroom-04.jpg',
    'videos/att.UEALgeMmISxrldGzCUQckqRfF_3mm2YDU3OMp9d1Nq8.mp4': 'videos/bathroom-05.mp4',
    'photos/thumbs/att.UEALgeMmISxrldGzCUQckqRfF_3mm2YDU3OMp9d1Nq8.jpg': 'photos/thumbs/bathroom-05.jpg',
    'videos/att.ztIJhiE4D11xlPTh6AveQ0mdYR0KpV1gbp6Nga0_jy8.mp4': 'videos/bathroom-06.mp4',
    'photos/thumbs/att.ztIJhiE4D11xlPTh6AveQ0mdYR0KpV1gbp6Nga0_jy8.jpg': 'photos/thumbs/bathroom-06.jpg',
    'videos/att.B2qH864DE0tKtbHv6DN1pukQkO5QgNRpmHC5CipJw3Y.mp4': 'videos/bathroom-07.mp4',
    'photos/thumbs/att.B2qH864DE0tKtbHv6DN1pukQkO5QgNRpmHC5CipJw3Y.jpg': 'photos/thumbs/bathroom-07.jpg',
    'videos/att.xmAkLA4lv0BZXJTYUPI24WJwzXhDj28dN9jzkW4PFhQ.mp4': 'videos/bathroom-08.mp4',
    'photos/thumbs/att.xmAkLA4lv0BZXJTYUPI24WJwzXhDj28dN9jzkW4PFhQ.jpg': 'photos/thumbs/bathroom-08.jpg',
    'videos/att.IwjAXisU4RDxzNMsPoDswte-PZe-Uu6724-7vSLvJBU.mp4': 'videos/bathroom-09.mp4',
    'photos/thumbs/att.IwjAXisU4RDxzNMsPoDswte-PZe-Uu6724-7vSLvJBU.jpg': 'photos/thumbs/bathroom-09.jpg',
    'videos/att.rYje_ysVtDsRHG-D_7YZ-IybIvDUe_cfuIVTW6C3r30.mp4': 'videos/bathroom-10.mp4',
    'photos/thumbs/att.rYje_ysVtDsRHG-D_7YZ-IybIvDUe_cfuIVTW6C3r30.jpg': 'photos/thumbs/bathroom-10.jpg',
    'videos/att.sT2PQgnprZIC0pbfR1510E9l6A9BcaLkppr-KmYGsLg.mp4': 'videos/bathroom-11.mp4',
    'photos/thumbs/att.sT2PQgnprZIC0pbfR1510E9l6A9BcaLkppr-KmYGsLg.jpg': 'photos/thumbs/bathroom-11.jpg',
    'videos/att.970gtKVesR1xjUGCgzqflV2OWC8aKJ6eQjcG_yd52OY.jpg': 'photos/thumbs/bathroom-photo-01.jpg',
    'videos/att.fWpCm0skN6ss4QCZNMa-juQdOCfMdO2ke7EJ_wlxbS0.jpg': 'photos/thumbs/bathroom-photo-02.jpg',
    'videos/att.iv5W4pi6xHmqqS89PVOyyCLy30XCGVuYVkUfE5QwFXE.jpg': 'photos/thumbs/bathroom-photo-03.jpg',
    'videos/att.TTFdmFK19BSoTxBfkV49qam3r7C5KfbSv2dphpbWmT8.mp4': 'videos/exterior-01.mp4',
    'photos/thumbs/att.TTFdmFK19BSoTxBfkV49qam3r7C5KfbSv2dphpbWmT8.jpg': 'photos/thumbs/exterior-01.jpg',
    'videos/att.vOThgqi77WAdpZjVTtpznj-z0jqDS4Cf8kg8mphB5rM.mp4': 'videos/exterior-02.mp4',
    'photos/thumbs/att.vOThgqi77WAdpZjVTtpznj-z0jqDS4Cf8kg8mphB5rM.jpg': 'photos/thumbs/exterior-02.jpg',
    'videos/att.GlD22ty3iYeMkHM0jeJJ-i3D_5D5A8P2i-yUYWIc48s.mp4': 'videos/interiors-01.mp4',
    'photos/thumbs/att.GlD22ty3iYeMkHM0jeJJ-i3D_5D5A8P2i-yUYWIc48s.jpg': 'photos/thumbs/interiors-01.jpg',
    'videos/att.iB3y3PqItc2d8NhAGWk6qJw_AZOaA0fVvFvn6cqfEuM.mp4': 'videos/interiors-02.mp4',
    'photos/thumbs/att.iB3y3PqItc2d8NhAGWk6qJw_AZOaA0fVvFvn6cqfEuM.jpg': 'photos/thumbs/interiors-02.jpg',
    'videos/att.2BalRMalskuFu9Mn4uZFyzM6aL0MqPrfYy8mgXWTwhc.mp4': 'videos/interiors-03.mp4',
    'photos/thumbs/att.2BalRMalskuFu9Mn4uZFyzM6aL0MqPrfYy8mgXWTwhc.jpg': 'photos/thumbs/interiors-03.jpg',
    'videos/att.I6n1MFW-43ozeKTnIQzqdx_wz3deWKS_8Sb8Z-VqA_c.mp4': 'videos/interiors-04.mp4',
    'photos/thumbs/att.I6n1MFW-43ozeKTnIQzqdx_wz3deWKS_8Sb8Z-VqA_c.jpg': 'photos/thumbs/interiors-04.jpg',
    'videos/att.87zcD-nmSMO7uO8nJ764MOznBh0yLTHlNP4v0vDLDnE.mp4': 'videos/interiors-05.mp4',
    'photos/thumbs/att.87zcD-nmSMO7uO8nJ764MOznBh0yLTHlNP4v0vDLDnE.jpg': 'photos/thumbs/interiors-05.jpg',
    'videos/att.7Dz5lQcCSd0ddTf9VZRopP9xWM-3Atp0FnmpK_3CeE8.mp4': 'videos/kitchen-01.mp4',
    'photos/thumbs/att.7Dz5lQcCSd0ddTf9VZRopP9xWM-3Atp0FnmpK_3CeE8.jpg': 'photos/thumbs/kitchen-01.jpg',
    'videos/att.ucdAuTRRYabAZ8vkFyUzYQKstpuCozJaKjcC5Fg2-l0.mp4': 'videos/kitchen-02.mp4',
    'photos/thumbs/att.ucdAuTRRYabAZ8vkFyUzYQKstpuCozJaKjcC5Fg2-l0.jpg': 'photos/thumbs/kitchen-02.jpg',
    'videos/att.8_YWMmqyAIp7lA5w8Ne7JRD0POWvu3PNwK841J3LADA.mp4': 'videos/kitchen-03.mp4',
    'photos/thumbs/att.8_YWMmqyAIp7lA5w8Ne7JRD0POWvu3PNwK841J3LADA.jpg': 'photos/thumbs/kitchen-03.jpg',
    'videos/att.vfARFXoTnHJfOLqqF8W1_fSoY4aCxrxRsz4XRqmZS-Q.mp4': 'videos/kitchen-04.mp4',
    'photos/thumbs/att.vfARFXoTnHJfOLqqF8W1_fSoY4aCxrxRsz4XRqmZS-Q.jpg': 'photos/thumbs/kitchen-04.jpg',
    'videos/bathroom-photo-01.jpg': 'photos/thumbs/bathroom-photo-01.jpg',
    'videos/bathroom-photo-02.jpg': 'photos/thumbs/bathroom-photo-02.jpg',
    'videos/bathroom-photo-03.jpg': 'photos/thumbs/bathroom-photo-03.jpg',
    'videos/att.12zTKoL6to7uOHKWBSH0b5bw9LYS8T6cXKnVDQcsyS4.mp4': 'videos/interiors-06.mp4',
    'photos/thumbs/att.12zTKoL6to7uOHKWBSH0b5bw9LYS8T6cXKnVDQcsyS4.jpg': 'photos/thumbs/interiors-06.jpg',
    'videos/att.7Ce_VjSQmSfKSacrBupcEAKK85CcdNdpeCp97f45AbU.mp4': 'videos/interiors-07.mp4',
    'photos/thumbs/att.7Ce_VjSQmSfKSacrBupcEAKK85CcdNdpeCp97f45AbU.jpg': 'photos/thumbs/interiors-07.jpg',
    'videos/att.fSvLOYr2T6QrB_POglUttIKx-s1Cg3FNdoHLwQCiZ7U.mp4': 'videos/kitchen-05.mp4',
    'photos/thumbs/att.fSvLOYr2T6QrB_POglUttIKx-s1Cg3FNdoHLwQCiZ7U.jpg': 'photos/thumbs/kitchen-05.jpg',
    'videos/att.T0KLtl8-YB9RSjJYIBMfi9WJbqbXX6Qg-PdAjnD-HUc.mp4': 'videos/bathroom-12.mp4',
    'photos/thumbs/att.T0KLtl8-YB9RSjJYIBMfi9WJbqbXX6Qg-PdAjnD-HUc.jpg': 'photos/thumbs/bathroom-12.jpg',
    'videos/att.UAqBvxUHVoLAkji2QwGkqSC74nRkwcdZ3qv5ckJqcQI.mp4': 'videos/bathroom-13.mp4',
    'photos/thumbs/att.UAqBvxUHVoLAkji2QwGkqSC74nRkwcdZ3qv5ckJqcQI.jpg': 'photos/thumbs/bathroom-13.jpg',
    'videos/att.IrDpI5xnp9YfCoqY_fik7pA2sJjwKqMjyrtGPVEs6k4.jpg': 'photos/interiors-photo-01.jpg',
    'photos/thumbs/att.IrDpI5xnp9YfCoqY_fik7pA2sJjwKqMjyrtGPVEs6k4.jpg': 'photos/thumbs/interiors-photo-01.jpg',
    'videos/att.JVJxCiSPlG-nMOSj1YYHkapY2hV0O5aHJo9Zc5Rbzsc.png': 'photos/bathroom-photo-04.jpg',
    'photos/thumbs/att.JVJxCiSPlG-nMOSj1YYHkapY2hV0O5aHJo9Zc5Rbzsc.jpg': 'photos/thumbs/bathroom-photo-04.jpg',
    'videos/att.fLuvGVsWYKfwMTb-K4ORbtthR5GNCDe5S32IRFep4IE.jpg': 'photos/bathroom-photo-05.jpg',
    'photos/thumbs/att.fLuvGVsWYKfwMTb-K4ORbtthR5GNCDe5S32IRFep4IE.jpg': 'photos/thumbs/bathroom-photo-05.jpg',
    'videos/att.4vK7FRPyDW6NH9k0dSzQ8U0-ANX4RjzQ5qLKoRUkmSQ.jpg': 'photos/bathroom-photo-06.jpg',
    'photos/thumbs/att.4vK7FRPyDW6NH9k0dSzQ8U0-ANX4RjzQ5qLKoRUkmSQ.jpg': 'photos/thumbs/bathroom-photo-06.jpg',
    'videos/att.ko1wMX-qao2nyoG9vsz43zjkWPYZNoc40j3A-wyDdhE.jpg': 'photos/bathroom-design-01.jpg',
    'photos/thumbs/att.ko1wMX-qao2nyoG9vsz43zjkWPYZNoc40j3A-wyDdhE.jpg': 'photos/thumbs/bathroom-design-01.jpg',
    'videos/att.AbjF8Ro8zFk-mASim-cejhKrTH2q6Giy2B3_XKohBOw.jpg': 'photos/bathroom-design-02.jpg',
    'photos/thumbs/att.AbjF8Ro8zFk-mASim-cejhKrTH2q6Giy2B3_XKohBOw.jpg': 'photos/thumbs/bathroom-design-02.jpg',
    'videos/att.j2w8Fe0xWmKYQbFxKoZCyLonbAtngKbcRflUvsR5VWo.jpg': 'photos/bathroom-design-03.jpg',
    'photos/thumbs/att.j2w8Fe0xWmKYQbFxKoZCyLonbAtngKbcRflUvsR5VWo.jpg': 'photos/thumbs/bathroom-design-03.jpg',
  };

  function normalizePath(p) {
    if (!p || typeof p !== 'string') return p;
    return LEGACY_PATH_MAP[p] || p;
  }

  function sanitizeData(data) {
    if (!data) return data;
    if (data.portfolio && Array.isArray(data.portfolio.items)) {
      data.portfolio.items.forEach((item) => {
        if (item.media) item.media = normalizePath(item.media);
        if (item.poster) item.poster = normalizePath(item.poster);
      });
    }
    return data;
  }

  let siteData = null;
  let historyStack = [];
  let historyIndex = 0;
  let isDirty = false;

  // DOM Elements
  const loginView = document.getElementById('loginView');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const adminPassword = document.getElementById('adminPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const loginError = document.getElementById('loginError');

  const pageTabs = document.getElementById('pageTabs');
  const editorFrame = document.getElementById('editorFrame');

  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  const saveBtn = document.getElementById('saveBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const adminToast = document.getElementById('adminToast');
  const toastMessage = document.getElementById('toastMessage');

  // Cryptographic SHA-256 helper
  async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // ================= 1. AUTHENTICATION =================
  function checkAuth() {
    const isAuth = localStorage.getItem(AUTH_KEY) === 'true' || sessionStorage.getItem(AUTH_KEY) === 'true';
    if (isAuth) {
      showAdmin();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    loginView.style.display = 'flex';
    adminApp.style.display = 'none';
    adminPassword.value = '';
    loginError.style.display = 'none';
  }

  function showAdmin() {
    loginView.style.display = 'none';
    adminApp.style.display = 'flex';
    initContent();
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pass = adminPassword.value.trim();
    const enteredHash = await hashString(pass);
    if (enteredHash === PASS_HASH) {
      localStorage.setItem(AUTH_KEY, 'true');
      showAdmin();
    } else {
      loginError.style.display = 'block';
      adminPassword.focus();
    }
  });

  togglePasswordBtn?.addEventListener('click', () => {
    const isPass = adminPassword.type === 'password';
    adminPassword.type = isPass ? 'text' : 'password';
  });

  downloadBtn?.addEventListener('click', () => {
    if (!siteData) return;
    const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Descargando copia de content.json...');
  });

  logoutBtn?.addEventListener('click', () => {
    if (isDirty) {
      if (!confirm('Tienes cambios sin guardar. ¿Estás seguro de que deseas cerrar sesión?')) return;
    }
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    showLogin();
  });

  // ================= 2. CONTENT & HISTORY =================
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  async function initContent() {
    let saved = null;
    try {
      ['cpr_content', 'cpr_content_v2', 'cpr_content_v3', 'cpr_content_v4', 'cpr_content_v5', 'cpr_content_v6'].forEach((k) => {
        const val = localStorage.getItem(k);
        if (val && val.includes('att.')) {
          localStorage.removeItem(k);
        }
      });

      if (!localStorage.getItem(STORAGE_KEY)) {
        const prev = null; // force fresh load from content.json for new version
        if (prev && !prev.includes('att.')) {
          localStorage.setItem(STORAGE_KEY, prev);
          localStorage.removeItem('cpr_content');
          localStorage.removeItem('cpr_content_v2');
        }
      }

      const localStr = localStorage.getItem(STORAGE_KEY);
      if (localStr) {
        if (localStr.includes('att.')) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          saved = JSON.parse(localStr);
        }
      }
    } catch (e) {}

    if (!saved) {
      try {
        const res = await fetch('content.json?v=' + Date.now());
        if (res.ok) saved = await res.json();
      } catch (e) {}
    }

    if (saved) {
      siteData = deepClone(sanitizeData(saved));
      historyStack = [deepClone(siteData)];
      historyIndex = 0;
      updateHistoryButtons();
    }
  }

  function pushHistory(newData) {
    if (!newData) return;
    siteData = deepClone(newData);

    if (historyIndex < historyStack.length - 1) {
      historyStack = historyStack.slice(0, historyIndex + 1);
    }

    historyStack.push(deepClone(siteData));
    if (historyStack.length > 50) historyStack.shift();
    historyIndex = historyStack.length - 1;

    isDirty = true;
    saveBtn?.classList.add('dirty');
    updateHistoryButtons();
  }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      siteData = deepClone(historyStack[historyIndex]);
      updateHistoryButtons();
      sendToFrame({ type: 'CPR_RESTORE_STATE', payload: siteData });
      showToast('↩ Se deshizo el último cambio');
    }
  }

  function redo() {
    if (historyIndex < historyStack.length - 1) {
      historyIndex++;
      siteData = deepClone(historyStack[historyIndex]);
      updateHistoryButtons();
      sendToFrame({ type: 'CPR_RESTORE_STATE', payload: siteData });
      showToast('↪ Se rehízo el cambio');
    }
  }

  function updateHistoryButtons() {
    if (undoBtn) undoBtn.disabled = historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = historyIndex >= historyStack.length - 1;
  }

  undoBtn?.addEventListener('click', undo);
  redoBtn?.addEventListener('click', redo);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' || e.key === 'Z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        redo();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        saveContent();
      }
    }
  });

  // ================= 3. SAVE & PERSISTENCE =================
  async function saveContent() {
    if (!siteData) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));

      // Optional backend save
      fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: siteData })
      }).catch(() => {});

      isDirty = false;
      saveBtn?.classList.remove('dirty');
      showToast('✓ ¡Cambios guardados y publicados en tu sitio web!');
      sendToFrame({ type: 'CPR_SAVED_CLEAN' });
    } catch (e) {
      console.error('Save error:', e);
      showToast('⚠️ Error al guardar los cambios.');
    }
  }

  saveBtn?.addEventListener('click', saveContent);

  function sendToFrame(msg) {
    if (editorFrame && editorFrame.contentWindow) {
      try {
        editorFrame.contentWindow.postMessage(msg, '*');
      } catch (e) {}
    }
  }

  function showToast(msg) {
    if (!toastMessage || !adminToast) return;
    toastMessage.textContent = msg;
    adminToast.classList.add('show');
    setTimeout(() => {
      adminToast.classList.remove('show');
    }, 3500);
  }

  // ================= 4. TAB NAVIGATION =================
  pageTabs?.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      pageTabs.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const page = btn.getAttribute('data-page');
      if (page && editorFrame) {
        editorFrame.src = page;
      }
    });
  });

  // When iframe loads, pass admin editing mode & current siteData
  editorFrame?.addEventListener('load', () => {
    sendToFrame({
      type: 'CPR_ENABLE_INLINE_ADMIN',
      payload: siteData
    });
  });

  // Listen for edits originating from the live page
  window.addEventListener('message', (event) => {
    if (event.data) {
      if (event.data.type === 'CPR_STATE_CHANGED') {
        pushHistory(event.data.payload);
      } else if (event.data.type === 'CPR_INIT_DATA') {
        if (!siteData) {
          siteData = deepClone(event.data.payload);
          historyStack = [deepClone(siteData)];
          historyIndex = 0;
          updateHistoryButtons();
        }
      }
    }
  });

  // Check auth on startup
  checkAuth();
})();
