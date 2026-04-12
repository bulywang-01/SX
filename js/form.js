// ⚠️ 換成你自己的 Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxR6dRquKi0s26gNifqE-gnGhTbKKpeaFxmQ-hU6VpT5bPRHLQZ8puS7FYvX7AO856V-A/exec';

document
  .getElementById('registrationForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    data.created_at = new Date().toISOString();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        alert('✅ 報名成功！我們將盡快與您聯絡。');
        e.target.reset();
      } else {
        alert('❌ 送出失敗，請稍後再試');
      }
    } catch (err) {
      console.error(err);
      alert('❌ 系統錯誤，請聯絡管理員');
    }
  });
