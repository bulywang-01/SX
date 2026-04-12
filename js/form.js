// Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbyYI-2tTxo2SeSh13edptjcVUY7PsYXOek5gHVj7pcuT3aEw6yfQwJj6lanpFVo-H-utQ/exec';

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registrationForm');
  const btn  = form.querySelector('button');
  const phone = form.querySelector('[name="guardian_phone"]');
  const email = document.getElementById('guardianEmail');


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
  // form.addEventListener('submit', async (e) => {
  btn.addEventListener('click', async () => {
  //  e.preventDefault();

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

＊請務必加入本隊官方 Line，告知已填完報名表體驗，以便通知球隊事務
＊Line ID：@406gxvsm`
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
