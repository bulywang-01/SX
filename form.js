const API_URL = 'https://script.google.com/macros/s/XXXXXX/exec';

document
  .getElementById('registrationForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('報名成功！');
      e.target.reset();
    } else {
      alert('送出失敗，請稍後再試');
    }
  });
