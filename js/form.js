const API_URL = 'https://script.google.com/macros/s/AKfycbzjJ-daxmA1cktVq2cR7muxIF879IRZGTbCo7KM6dhyISXiNbuzRfdLytquWX5_3jr0DQ/exec';

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registrationForm');
  const btn = form.querySelector('button');
  const phone = form.querySelector('[name="guardian_phone"]');
  const email = document.getElementById('guardianEmail');
  const trialDateInput = document.getElementById('trialDate');

  /* =========================
     ✅ 中文欄位對照
  ========================= */
  const labelMap = {
    name: '球員姓名',
    trial_date: '希望體驗日期',
    gender: '性別',
    birthday: '出生年月日',
    grade: '年級',
    school: '就讀學校',
    batting_hand: '打擊慣用手',
    pitching_hand: '投球慣用手',
    height_cm: '身高',
    weight_kg: '體重',
    guardian_name: '監護人姓名',
    guardian_phone: '監護人電話',
    guardian_email: '監護人 Email',
    other_team_status: '是否曾加入其他球隊',
    siblings_joined: '是否有兄弟姊妹',
    siblings_names: '兄弟姊妹姓名',
    parent_support: '家長協助',
    baseball_level: '棒球接觸程度',
    source: '招生來源'
  };

  /* =========================
     ✅ 必填控制
  ========================= */
  const applyRequired = () => {
    document.querySelectorAll('[data-required]').forEach(el => {
      if (el.dataset.required === 'true') {
        el.setAttribute('required', 'required');
      }
    });
  };
  applyRequired();

  /* =========================
     ✅ 錯誤標記
  ========================= */
  const markError = (el) => {
    el.classList.add('input-error');
    const wrap = el.closest('label, .highlight-wrapper, div');
    wrap?.classList.add('error');
    wrap?.classList.add('shake');

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => wrap?.classList.remove('shake'), 400);
  };

  const clearError = (el) => {
    el.classList.remove('input-error');
    el.closest('label, .highlight-wrapper, div')?.classList.remove('error');
  };

  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  /* =========================
     ✅ 取得未填欄位（🔥核心）
  ========================= */
  const getMissingFields = () => {

    const missing = new Set();

    // ===== 一般欄位 =====
    form.querySelectorAll('[data-required="true"]').forEach(el => {

      if (el.dataset.group) return;

      if (!el.value) {

        const label =
          labelMap[el.name] ||
          el.dataset.label ||
          el.name;

        missing.add(label);
        markError(el);
      }
    });

    // ===== 群組欄位 =====
    const groups = {};

    document.querySelectorAll('[data-group]').forEach(el => {
      const g = el.dataset.group;
      if (!groups[g]) groups[g] = [];
      groups[g].push(el);
    });

    for (const groupName in groups) {
      const items = groups[groupName];

      const required = items.some(i => i.dataset.required === 'true');
      if (!required) continue;

      const hasChecked = items.some(i => i.checked);

      if (!hasChecked) {

        const first = items[0];

        const label =
          first.dataset.label ||
          labelMap[groupName] ||
          groupName;

        missing.add(label);
        markError(first);
      }
    }

    return [...missing];
  };

  /* =========================
     ✅ 日期限制＋顯示星期
  ========================= */
  if (trialDateInput) {
    const today = new Date();
    const firstSaturday = new Date(today);

    let diff = 6 - firstSaturday.getDay();
    if (diff <= 0) diff += 7;

    firstSaturday.setDate(firstSaturday.getDate() + diff);

    const yyyy = firstSaturday.getFullYear();
    const mm = String(firstSaturday.getMonth() + 1).padStart(2, '0');
    const dd = String(firstSaturday.getDate()).padStart(2, '0');

    trialDateInput.min = `${yyyy}-${mm}-${dd}`;
    trialDateInput.step = 7;

    trialDateInput.addEventListener('change', () => {
      const d = new Date(trialDateInput.value);

      if (!trialDateInput.value || d.getDay() !== 6) {
        markError(trialDateInput);
        showMsg('日期錯誤', '請選擇星期六');
        trialDateInput.value = '';
        return;
      }

      const text = `${d.getMonth() + 1}月${d.getDate()}日（星期六）`;
      const hint = trialDateInput.parentElement.querySelector('.hint');
      if (hint) hint.innerHTML = `✅ 已選：${text}`;
    });
  }

  /* =========================
     ✅ Email 驗證
  ========================= */
  email?.addEventListener('input', () => {
    if (email.value && !email.checkValidity()) {
      markError(email);
    }
  });

  /* =========================
     ✅ 電話格式
  ========================= */
  phone?.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '').slice(0, 10);
    phone.value = d.length > 4 ? d.slice(0, 4) + '-' + d.slice(4) : d;
  });

  /* =========================
     ✅ Modal
  ========================= */
  const overlay = document.createElement('div');
  overlay.id = 'messageOverlay';
  overlay.innerHTML = `
    <div class="message-box">
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
     ✅ 送出（🔥完整 UX）
  ========================= */
  btn.addEventListener('click', async () => {

    const missingFields = getMissingFields();

    if (missingFields.length > 0) {

      const listHtml = missingFields
        .map(f => `・${f}`)
        .join('<br>');

      showMsg(
        '資料未填',
        `請補以下欄位：<br><br>${listHtml}`
      );

      return;
    }

    btn.disabled = true;
    btn.innerText = '送出中...';

    const fd = new FormData(form);

    try {
      const r = await fetch(API_URL, {
        method: 'POST',
        body: fd
      });

      if (r.ok) 
      {
        showMsg(
          '報名完成',
          `
          <div style="text-align:left; line-height:1.7;">
        
            <p>✅ 歡迎加入三峽社區棒球隊！</p>
        
            <p>
              請務必加入本隊官方 Line，並告知「已填寫完成報名體驗表」，以便後續通知球隊相關事務
            </p>
        
            <p>
              <strong>📣 官方 Line ID：</strong><span style="font-size:16px; font-weight:bold;">@406gxvsm</span>
            </p>
        
            <hr style="margin:16px 0; border:none; border-top:1px solid #eee;">
        
            <p><strong>⚾ 體驗當天請務必留意以下事項：</strong></p>
        
            <p><strong>【裝備與準備】</strong></p>
            <ul style="padding-left:18px; margin-top:6px;">
              <li>請穿著運動服裝與長褲，並配戴帽子</li>
              <li>請自備：
                <ul style="padding-left:16px;">
                  <li>棒球手套</li>
                  <li>足夠的飲水或運動飲料（建議至少 4000 c.c.）</li>
                </ul>
              </li>
            </ul>
        
            <p><strong>【報到方式】</strong></p>
            <p>　　請於早上 <strong>8:30</strong> 抵達球場，向現場幹部報到即可</p>
        
            <p><strong>【體驗費用】</strong></p>
            <p>　　當天僅需負擔午餐費用 <strong>100 元</strong></p>
        
            <p><strong>【練習地點】</strong></p>
            <p>　　土城媽祖田河濱公園棒球場</p>
        
            <p><strong>【雨天備案】</strong></p>
            <p>　　若遇雨天，將於當日早上 <strong>7:00</strong> 前以 Line 方式通知備用場地，請留意訊息</p>
          </div>
          `
        );
        form.reset();
      }
      else {
        showMsg('送出失敗', '系統錯誤');
      }

    } catch {
      showMsg('系統錯誤', '請稍後再試');
    }

    btn.disabled = false;
    btn.innerText = '送出報名';
  });

});
