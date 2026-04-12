// ⚠️ 換成你自己的 Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxVbTv_QNXkV79qadf6QFgf3rU2lDalw-NGyNz9nrBQB8dnwp9wuiztL9TfUz042ZRA_g/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const button = form.querySelector('button');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;

    const formData = new FormData(form);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('✅ 報名成功！');
        form.reset();
      } else {
        alert('❌ 送出失敗');
      }
    } catch (err) {
      alert('❌ 系統錯誤');
    } finally {
      button.disabled = false;
    }
  });
});
