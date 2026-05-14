// Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycby9KLXCqnZNOKHCxkWOX3vuIhC2NpwX8wCEmfXkkepZrhzg225FtHFq05q2ssU48GRWrA/exec';

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registrationForm');
  const btn = form.querySelector('button');
  const phone = form.querySelector('[name="guardian_phone"]');
  const email = document.getElementById('guardianEmail');

  /* =========================
     ✅ 必填控制（data-required）
  ========================= */
  const applyRequired = () => {
    document.querySelectorAll('[data-required]').forEach(el => {
      if (el.dataset.required === 'true') {
        el.setAttribute('required', 'required');
      } else {
        el.removeAttribute('required');
      }
    });
  };

  applyRequired();

  /* =========================
     ✅ 群組驗證（checkbox / radio）
  ========================= */
  const checkGroupRequired = () => {

    const groups = {};

    document.querySelectorAll('[data-required="true"][data-group]')
      .forEach(el => {
        const g = el.dataset.group;
        if (!groups[g]) groups[g] = [];
        groups[g].push(el);
      });

    for (const groupName in groups) {
      const items = groups[groupName];
      const hasChecked = items.some(i => i.checked);

      if (!hasChecked) {
        const first = items[0];
        const label = first.dataset.label || groupName;

        showMsg('資料未填', `請至少選擇一項：「${label}」`);
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
    }

    return true;
  };

  /* =========================
     ✅ 體驗日期限制：只能選週六
  ========================= */
  const trialDateInput = document.getElementById('trialDate');

  if (trialDateInput) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstSaturday = new Date(today);
    const day = firstSaturday.getDay();
    let diff = 6 - day;
    if (diff <= 0) diff += 7;

    firstSaturday.setDate(firstSaturday.getDate() + diff);

    const yyyy = firstSaturday.getFullYear();
    const mm = String(firstSaturday.getMonth() + 1).padStart(2, '0');
    const dd = String(firstSaturday.getDate()).padStart(2, '0');

    const minDateStr = `${yyyy}-${mm}-${dd}`;

    trialDateInput.min = minDateStr;
    trialDateInput.step = 7;

    trialDateInput.addEventListener('change', () => {
      const selected = new Date(trialDateInput.value);
      selected.setHours(0, 0, 0, 0);

      if (selected < firstSaturday || selected.getDay() !== 6) {
        showMsg('日期錯誤', '體驗日期僅限「未來的星期六」');
        trialDateInput.value = '';
      }
    });
  }

  /* =========================
     ✅ Email 驗證
  ========================= */
  if (email) {
    email.addEventListener('input', () => {
      if (email.value && !email.checkValidity()) {
        email.setCustomValidity('請輸入正確的 Email，例如：example@gmail.com');
      } else {
        email.setCustomValidity('');
      }
    });
  }

  /* =========================
     ✅ 電話格式
  ========================= */
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '').slice(0, 10);
    phone.value = d.length > 4 ? d.slice(0, 4) + '-' + d.slice(4) : d;
  });

  /* =========================
     ✅ Message Modal
  ========================= */
  const overlay = document.createElement('div');
  overlay.id = 'messageOverlay';
  overlay.innerHTML = `
    <div class="message-box">
      <div class="icon">✅</div>
      <h2 id="msgTitle"></h2>
      <div id="msgText"></div>
      <button id="msgClose">關閉</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const showMsg = (title, html) => {
    document.getElementById('msgTitle').innerText = title;
    document.getElementById('msgText').innerHTML = html;
    overlay.classList.add('show');
  };

  document.getElementById('msgClose').onclick = () => {
    overlay.classList.remove('show');
  };

  /* =========================
     ✅ 表單送出（完整驗證整合）
  ========================= */
  btn.addEventListener('click', async () => {

    // ✅ group 檢查（checkbox / radio）
    if (!checkGroupRequired()) return;

    // ✅ HTML5 驗證
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // ✅ Email 再檢查
    if (email && email.value && !email.checkValidity()) {
      showMsg(
        'Email 格式錯誤',
        '請輸入正確 Email，例如 example@gmail.com'
      );
      email.focus();
      return;
    }

    btn.disabled = true;

    const fd = new FormData(form);
    fd.set('guardian_phone', phone.value.toString());

    try {
      const r = await fetch(API_URL, {
        method: 'POST',
        body: fd
      });

      if (r.ok) {
        showMsg(
          '報名完成',
          `
          <p>歡迎加入三峽社區棒球隊！</p>

          <p><strong>Line ID：@406gxvsm</strong></p>

          <h4>體驗提醒</h4>
          <ul>
            <li>運動服裝＋長褲＋帽子</li>
            <li>棒球手套</li>
            <li>飲水（建議 4000 c.c.）</li>
          </ul>

          <p><strong>時間：</strong>上午 8:30 到場</p>
          <p><strong>費用：</strong>100 元（午餐）</p>
          `
        );

        form.reset();

        const sibBlock = document.getElementById('siblingsNameBlock');
        const sibNo = document.getElementById('sib_n');

        if (sibBlock && sibNo) {
          sibNo.checked = true;
          sibBlock.style.display = 'none';
        }

      } else {
        showMsg('送出失敗', '系統發生問題，請稍後再試');
      }

    } catch {
      showMsg('系統錯誤', '目前無法送出，請稍後再試');
    }

    btn.disabled = false;
  });

});
