// ⚠️ 換成你自己的 Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxVbTv_QNXkV79qadf6QFgf3rU2lDalw-NGyNz9nrBQB8dnwp9wuiztL9TfUz042ZRA_g/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const button = form.querySelector('button');

  // 建立置中訊息框
  const overlay = document.createElement('div');
  overlay.id = 'messageOverlay';
  overlay.innerHTML = `
    <div class="message-box">
      <h2 id="messageTitle"></h2>
      <p id="messageText"></p>
      <button onclick="closeMessage()">關閉</button>
    </div>
  `;
  document.body.appendChild(overlay);

  window.showMessage = (title, text) => {
    document.getElementById('messageTitle').innerText = title;
    document.getElementById('messageText').innerText = text;
    overlay.style.display = 'flex';
  };

  window.closeMessage = () => {
    overlay.style.display = 'none';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;

    // ✅ 關鍵：只用 FormData（不加 headers、不 JSON）
    const formData = new FormData(form);

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

// ✅ 監護人電話即時格式化：09xxxxxxxx → 09xx-xxxxxx
const phoneInput = document.querySelector('input[name="guardian_phone"]');

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
    } finally {
      button.disabled = false;
    }
