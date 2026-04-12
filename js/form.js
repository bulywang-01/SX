// Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxKrdKlPPDlPiN1XxHFb27Qw6QD_ClpGVB3wNqEJWpVZHxqQXLsX7n7yk7gcAfjwcVn3w/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const btn = form.querySelector('button');
  const phone = form.querySelector('[name="guardian_phone"]');

  /* 電話格式化：0910200232 → 0910-200232 */
  phone?.addEventListener('input', () => {
    const d = phone.value.replace(/\D/g,'').slice(0,10);
    phone.value = d.length > 4 ? d.slice(0,4)+'-'+d.slice(4) : d;
  });

  /* 建立簡易訊息框 */
  const overlay = document.createElement('div');
  overlay.id = 'messageOverlay';
  overlay.innerHTML = `
    <div class="message-box">
      <h2></h2>
      <p></p>
      <button>關閉</button>
    </div>`;
  document.body.appendChild(overlay);

  const showMsg = (t,m) => {
    overlay.querySelector('h2').innerText = t;
    overlay.querySelector('p').innerText = m;
    overlay.classList.add('show');
  };
  overlay.querySelector('button').onclick = () => overlay.classList.remove('show');

  /* 表單送出 */
  form.onsubmit = async (e) => {
    e.preventDefault();
    btn.disabled = true;

    const fd = new FormData(form);
    fd.set('guardian_phone', phone.value.toString()); // 保證字串

    try {
      const r = await fetch(API_URL, { method:'POST', body:fd });
      r.ok
        ? (showMsg('✅ 報名完成','我們已收到您的報名資料，將由球隊幹部與您聯繫。'), form.reset())
        : showMsg('❌ 送出失敗','系統發生問題，請稍後再試。');
    } catch {
      showMsg('❌ 系統錯誤','目前無法送出報名，請稍後再試。');
    } finally {
      btn.disabled = false;
    }
  };
});
``
