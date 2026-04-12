// ⚠️ 換成你自己的 Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycby5op8GYKiFrmzZsA7CgL_Cwrn97bKvYVa9K1wD2xIvf7vyYm8kJHSJJ2Zgv1haZJRH4w/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const button = form.querySelector('button');
  const phoneInput = document.querySelector('input[name="guardian_phone"]');

  /* =========================
     置中訊息 Overlay
  ========================= */
  const overlay = document.createElement('div');
  overlay.id = 'messageOverlay';
  overlay.innerHTML = `
    <div class="message-box">
      <h2 id="messageTitle"></h2>
      <p id="messageText"></p>
      <button id="closeMessageBtn">關閉</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const showMessage = (title, text) => {
    document.getElementById('messageTitle').innerText = title;
    document.getElementById('messageText').innerText = text;
    overlay.classList.add('show');
  };

  const closeMessage = () => {
    overlay.classList.remove('show');
  };

  document
    .getElementById('closeMessageBtn')
    .addEventListener('click', closeMessage);

  /* =========================
     監護人電話即時格式化
     0910200232 → 0910-200232
  ========================= */
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      if (digits.length > 4) {
        phoneInput.value = digits.slice(0, 4) + '-' + digits.slice(4);
      } else {
        phoneInput.value = digits;
      }
    });
  }

  /* =========================
     表單送出
  ========================= */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;

    const formData = new FormData(form);

    // ✅ 確保電話一定是字串（不被轉成數字）
    if (phoneInput) {
      formData.set('guardian_phone', phoneInput.value.toString());
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        showMessage(
          '✅ 報名完成',
          '我們已收到您的報名資料，將由球隊幹部與您聯繫，謝謝您。'
        );
        form.reset();
      } else {
        showMessage(
          '❌ 送出失敗',
          '系統發生問題，請稍後再試或聯絡球隊。'
        );
      }
    } catch (err) {
      console.error(err);
      showMessage(
        '❌ 系統錯誤',
        '目前無法送出報名，請稍後再試。'
      );
    } finally {
      button.disabled = false;
    }
  });
});
