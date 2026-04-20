let currentViewDate = new Date(2026, 3); // 2026年4月
let currentMode = 'status';

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// カレンダー描画（曜日対応版）
function renderCalendar() {
    const body = document.getElementById('calendar-body');
    const monthDisplay = document.getElementById('current-month-display');
    if(!body || !monthDisplay) return;

    body.innerHTML = '';

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    monthDisplay.innerText = `${year}年 ${month + 1}月`;

    // その月の「1日」が何曜日か取得 (0:日, 1:月...)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // その月が何日まであるか取得
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 1. 月初めの空白を埋める
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day empty-day';
        body.appendChild(emptyDiv);
    }

    // 2. 日付を生成
    for (let i = 1; i <= lastDate; i++) {
        const div = document.createElement('div');
        div.className = 'day';
        div.onclick = () => openBookingModal(`${month + 1}月${i}日`);

        // 土日の色付け判断
        const currentDayOfWeek = new Date(year, month, i).getDay();
        let dateColor = '#333';
        if(currentDayOfWeek === 0) dateColor = 'var(--accent-red)'; // 日曜
        if(currentDayOfWeek === 6) dateColor = 'var(--main-blue)'; // 土曜

        if (currentMode === 'status') {
            div.innerHTML = `<strong style="color:${dateColor}">${i}</strong><span style="color:#007bff; font-size:0.8rem; margin-top:5px;">予約可</span>`;
        } else {
            const status = ['空き', '普通', '混雑'];
            const res = status[Math.floor(Math.random() * 3)];
            const color = res === '混雑' ? 'red' : (res === '空き' ? 'green' : 'orange');
            div.innerHTML = `<strong style="color:${dateColor}">${i}</strong><span style="color:${color}; font-size:0.8rem; margin-top:5px;">${res}</span>`;
        }
        body.appendChild(div);
    }
}

function switchCalendarMode(mode) {
    currentMode = mode;
    document.getElementById('tab-status').classList.toggle('active', mode === 'status');
    document.getElementById('tab-forecast').classList.toggle('active', mode === 'forecast');
    renderCalendar();
}

function changeMonth(diff) {
    currentViewDate.setMonth(currentViewDate.getMonth() + diff);
    renderCalendar();
}

function showModal(html) {
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    content.innerHTML = html;
    modal.style.display = 'block';
}

function closeModal() { document.getElementById('modal-overlay').style.display = 'none'; }

function openSlider(name) {
    showModal(`
        <h2 style="color:#007bff">${name} 案内</h2>
        <div style="background:#eee; height:200px; border-radius:15px; margin-bottom:20px; display:flex; align-items:center; justify-content:center; font-size:14px;">[ ${name} の写真 ]</div>
        <p>スタッフが巡回しているので、安心してお使いいただけます。</p>
        <button style="background:#007bff; color:white; border:none; padding:15px 30px; border-radius:10px; width:100%; cursor:pointer; font-weight:bold;" onclick="openBookingModal('${name}')">この施設を予約する</button>
        <button onclick="closeModal()" style="margin-top:15px; background:none; border:none; color:#999; cursor:pointer;">閉じる</button>
    `);
}

function openPhoto(type) {
    const data = {
        reception: { t: "受付", txt: "スタッフが常駐。案内や予約の相談もお気軽に。" },
        seats: { t: "観覧席", txt: "お子様の練習を高い位置からゆっくり見守れます。" },
        toilet: { t: "お手洗い", txt: "バリアフリー対応、おむつ替えシート完備。" },
        water: { t: "給水ポイント", txt: "マイボトルへの補充も可能な冷水機を設置。" }
    };
    const item = data[type];
    showModal(`<h2>${item.t}</h2><div style="background:#eef; height:200px; border-radius:15px; margin-bottom:20px;"></div><p>${item.txt}</p><button style="background:#007bff; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="closeModal()">閉じる</button>`);
}

function openBookingModal(target) {
    showModal(`
        <h2 style="color:#007bff">予約：${target}</h2>
        <div style="text-align:left; background:#f8f9fa; padding:20px; border-radius:15px; margin:20px 0;">
            <p><strong>利用形態</strong></p>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px; background:white;">個人</button>
                <button style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px; background:white;">団体</button>
            </div>
            <p><strong>人数</strong></p>
            <input type="number" value="1" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
        </div>
        <button style="background:#007bff; color:white; border:none; padding:15px 30px; border-radius:10px; width:100%; cursor:pointer; font-weight:bold;" onclick="alert('予約を承りました！'); closeModal();">予約を確定する</button>
    `);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('open');
        });
    });
    renderCalendar();
});

// --- スクロール監視 ---
window.addEventListener('scroll', () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (window.scrollY > 300) { // 300px以上スクロールしたら表示
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// --- ヌルッとトップに戻る ---
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/* ※ renderCalendar や openBookingModal など、
  これまでの完璧なロジックはすべてそのまま維持してください。
*/