// Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwLNWm8ykKTjpmYpN4YBSPj_sUlIGG3TZLY05hFqGpUZO_Op8FNYQ_HYOVSQQK_MlDeYg/exec';

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
      <div class="icon">✅</div>
      <h2 id="messageTitle"></h2>
      <p id="messageText"></p>
      <button id="closeMessageBtn">關閉</button>
    </div>
  `;
  document.body.appendChild(overlay);


  const showMsg = (t,m) => {
    overlay.querySelector('h2').innerText = t;
    overlay.querySelector('p').innerText = m;
    overlay.classList.add('show');
  };
  overlay.querySelector('button').onclick = () => overlay.classList.remove('show');

/* =========================
   體驗日期限制（台灣時區版）
   - 只能選今天之後的星期六
========================= */
const trialDateInput = document.getElementById('trialDate');

if (trialDateInput) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 找到「今天之後」的第一個星期六
  const firstSaturday = new Date(today);
  const day = firstSaturday.getDay(); // 0=日, 6=六
  let diff = 6 - day;
  if (diff <= 0) diff += 7; // 確保是「之後的週六」
  firstSaturday.setDate(firstSaturday.getDate() + diff);

  // ✅ 用「本地年月日」自己組字串（避免 UTC 問題）
  const yyyy = firstSaturday.getFullYear();
  const mm = String(firstSaturday.getMonth() + 1).padStart(2, '0');
  const dd = String(firstSaturday.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  trialDateInput.min = minDateStr;
  trialDateInput.step = 7;

  // 防止手動輸入非法日期
  trialDateInput.addEventListener('change', () => {
    const selected = new Date(trialDateInput.value);
    selected.setHours(0, 0, 0, 0);

    if (selected.getDay() !== 6 || selected < firstSaturday) {
      trialDateInput.value = '';
      alert('體驗日期僅開放「今天之後的星期六」，請重新選擇。');
    }
  });
}

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

