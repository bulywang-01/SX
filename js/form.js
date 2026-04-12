// ⚠️ 換成你自己的 Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxR6dRquKi0s26gNifqE-gnGhTbKKpeaFxmQ-hU6VpT5bPRHLQZ8puS7FYvX7AO856V-A/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ✅ 關鍵：直接用 FormData
    const formData = new FormData(form);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData   // ❌ 不要加 headers
      });

      if (res.ok) {
        alert('✅ 報名成功！');
        form.reset();
      } else {
        alert('❌ 送出失敗');
      }
    } catch (err) {
      console.error(err);
      alert('❌ 系統錯誤，請聯絡管理員');
    }
  });
});
