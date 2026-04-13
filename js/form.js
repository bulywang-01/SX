// Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxxghJHHtbF59PSnJ6moqCe2kjEb1P9-2uCZUFJwqLE4TodP4iJGxzkUXHvNqYrmD6iCw/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const btn  = form.querySelector('button');
  const phone = form.querySelector('[name="guardian_phone"]');
  const email = document.getElementById('guardianEmail');

  /* =========================
     體驗日期限制：僅限今天之後的星期六
     （台灣時區安全版）
  ========================= */
  const trialDateInput = document.getElementById('trialDate');
  
  if (trialDateInput) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // 找到「今天之後」的第一個星期六
    const firstSaturday = new Date(today);
    const day = firstSaturday.getDay(); // 0=日, 6=六
    let diff = 6 - day;
    if (diff <= 0) diff += 7; // 一定是「之後」的星期六
    firstSaturday.setDate(firstSaturday.getDate() + diff);
  
    // 轉成本地 YYYY-MM-DD（避免 UTC 問題）
    const yyyy = firstSaturday.getFullYear();
    const mm = String(firstSaturday.getMonth() + 1).padStart(2, '0');
    const dd = String(firstSaturday.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
  
    // ✅ 核心三件事
    trialDateInput.min = minDateStr;
    trialDateInput.step = 7; // 每 7 天只能跳星期六
  
    // ✅ 防止手動輸入作弊
    trialDateInput.addEventListener('change', () => {
      const selected = new Date(trialDateInput.value);
      selected.setHours(0, 0, 0, 0);
  
      if (selected < firstSaturday || selected.getDay() !== 6) {
        alert('體驗日期僅開放「今天之後的星期六」，請重新選擇。');
        trialDateInput.value = '';
      }
    });
  }
  
  /* ===== Email 驗證（HTML5 原生） ===== */
  if (email) {
    email.addEventListener('input', () => {
      if (email.value && !email.checkValidity()) {
        email.setCustomValidity('請輸入正確的 Email，例如：example@gmail.com');
      } else {
        email.setCustomValidity('');
      }
    });
  }

  /* ===== 電話格式化 ===== */
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '').slice(0, 10);
    phone.value = d.length > 4 ? d.slice(0, 4) + '-' + d.slice(4) : d;
  });

  /* ===== 訊息 Overlay ===== */
  const overlay = document.createElement('div');
  overlay.id = 'messageOverlay';
  overlay.innerHTML = `
    <div class="message-box">
      <div class="icon">✅</div>
      <h2 id="msgTitle"></h2>
      <p id="msgText"></p>
      <button id="msgClose">關閉</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const showMsg = (title, text) => {
    document.getElementById('msgTitle').innerText = title;
    document.getElementById('msgText').innerText = text;
    overlay.classList.add('show');
  };
  document.getElementById('msgClose').onclick = () => overlay.classList.remove('show');

  /* ===== 表單送出 ===== */
  btn.addEventListener('click', async () => {

    // ✅ Email：有填就一定要合法
    if (email && email.value && !email.checkValidity()) {
      showMsg(
        'Email 格式錯誤',
        '請確認您輸入的 Email 需要包含 @ 與網域，例如：example@gmail.com'
      );
      email.focus();
      return;
    }

    btn.disabled = true;
    const fd = new FormData(form);
    fd.set('guardian_phone', phone.value.toString());

    try {
      const r = await fetch(API_URL, { method: 'POST', body: fd });

      if (r.ok) {
        showMsg(
          '✅ 報名完成',
        `感謝您完成報名，歡迎加入我們的球隊行列！
        
        請務必加入本隊官方Line
        並告知「已填寫完成報名體驗表」
        以便後續通知球隊相關事務
        官方Line ID：@406gxvsm
        
        體驗當天請務必留意以下事項：
        
        【裝備與準備】
       　 1. 請穿著運動服裝與長褲，並配戴帽子。
      　  2. 請自備：
     　      棒球手套
        　   足夠的飲水 或 運動飲料（建議至少 4000 c.c.）
        
        【報到方式】
      　  抵達球場後，請向現場的家長或幹部任一位報到即可。
        
        【體驗費用】
       　 當天僅需負擔午餐費用 100 元。
        
        【練習地點】
       　 土城媽祖田河濱公園棒球場
        
        【雨天備案】
       　 若遇雨天，將於當日早上 7:00 前以Line方式通知備用場地，請留意訊息。`
        );

        // ✅ 清空表單
        form.reset();

        // ✅ 還原兄弟姊妹區塊
        const sibBlock = document.getElementById('siblingsNameBlock');
        const sibNo = document.getElementById('sib_n');
        if (sibBlock && sibNo) {
          sibNo.checked = true;
          sibBlock.style.display = 'none';
        }
      } else {
        showMsg('送出失敗', '系統發生問題，請稍後再試。');
      }
    } catch {
      showMsg('系統錯誤', '目前無法送出，請稍後再試。');
    } finally {
      btn.disabled = false;
    }
  });
});
