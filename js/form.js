// ⚠️ 換成你自己的 Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwOw1WMxUDMJoK0-gDfeHyPZeSSZelJgG2DSAQvQRs0oEXm52_b7cV2r_d2hE_xDHe1nw/exec';

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
