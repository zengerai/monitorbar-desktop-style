/* Browser-only demonstration. No device, network, filesystem or OS actions.
   Visual parameters and icons derived from MonitorBar; see upstream MIT license. */
(() => {
  'use strict';
  const $ = (q) => document.querySelector(q);
  const root = $('#monitorbar'), content = $('#page-content');
  const initialTheme = new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light';
  const state = { theme:initialTheme, tab:'overview', platform:'mac', connection:'connected', input:'HDMI1', brightness:100, volume:80, warmth:0, scene:null, rate:160, resolution:'1920 × 1080', hidpi:true, auto:false, dayTime:'07:00', nightTime:'19:00', dayScene:'日间', nightScene:'夜间', startup:false };
  const tabs = [ ['overview','概览','display'],['picture','画面','sliders'],['modes','分辨率','aspect'],['activity','屏幕时间','chart'] ];
  const scenes = [['日间','sun',80,0],['阅读','book',55,25],['观影','film',100,5],['夜间','moon',30,55]];
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${window.MB_ICONS[name] || ''}</svg>`;
  const announce = message => { $('#demo-live').textContent = message; };
  const unavailable = () => state.connection !== 'connected';
  const chip = (label, selected, attrs='', extra='') => `<button type="button" class="mb-chip ${extra}" aria-pressed="${selected}" ${attrs}>${label}</button>`;
  const title = (text, name, note='') => `<div class="mb-title">${icon(name)}<span>${text}</span>${note ? `<span class="mb-trailing">${note}</span>` : ''}</div>`;
  const card = html => `<section class="mb-card">${html}</section>`;
  const slider = (key,label,caption,name,step=true) => card(`<div class="mb-row"><span class="mb-control-icon">${icon(name)}</span><div><strong>${label}</strong>${caption?`<div class="mb-subtitle">${caption}</div>`:''}</div><output class="mb-value" data-output="${key}" for="range-${key}">${key==='warmth' && !state[key]?'标准':state[key]}</output></div><div class="mb-row">${step?`<button type="button" class="mb-chip mb-step" data-step="${key}" data-delta="-5" aria-label="减小${label}">${icon('minus')}</button>`:''}<input class="mb-range" id="range-${key}" data-range="${key}" type="range" min="${key==='brightness'?20:0}" max="100" step="1" value="${state[key]}" aria-label="${label}" ${key==='volume' && unavailable()?'disabled':''}>${step?`<button type="button" class="mb-chip mb-step" data-step="${key}" data-delta="5" aria-label="增大${label}">${icon('plus')}</button>`:''}</div>`);
  const sceneCard = () => card(title('场景','sparkles','亮度 + 色温') + `<div class="mb-grid">${scenes.map(([name,ic])=>chip(icon(ic)+`<span>${name}</span>`,state.scene===name,`data-scene="${name}"`,'mb-scene')).join('')}</div>`);
  function hero() {
    return `<div><div class="mb-device"><div class="mb-screen"><div class="mb-screen-inner"><div class="mb-resolution">${state.resolution}</div><div class="mb-render">${state.hidpi?'HiDPI · 渲染 '+pixels(state.resolution)+' · ':''}${state.rate} Hz</div></div></div><div class="mb-stand"></div><div class="mb-foot"></div></div><div class="mb-current"><span>当前画面</span><span>${state.input.startsWith('HDMI')?'HDMI':state.input}</span></div></div>`;
  }
  function pixels(res) { return res.split(' × ').map(x=>Number(x)*2).join('×'); }
  function overview() {
    const hardware = state.connection !== 'unsupported';
    return hero() + (hardware?card(title('输入源','plug','局域网')+`<div class="mb-grid">${['HDMI1','HDMI2','DP','USB-C'].map(name=>chip(name,state.input===name,`data-source="${name}" ${unavailable()?'disabled':''}`)).join('')}</div>`):'') + slider('brightness','亮度','软件调光 · Gamma','sun') + (hardware?slider('volume','显示器音量','','volume',false):'') + sceneCard();
  }
  function autoRow(period, label) {
    return `<label>${label}<input type="time" aria-label="${label}开始时间" data-time="${period}" value="${state[period+'Time']}"><select aria-label="${label}场景" data-period="${period}">${scenes.map(([name])=>`<option ${state[period+'Scene']===name?'selected':''}>${name}</option>`).join('')}</select></label>`;
  }
  function picture() {
    return `<h3 class="mb-section">画面</h3>`+sceneCard()+card(`<label class="mb-title">${icon('clock')}<span>自动切换</span><input class="mb-switch" type="checkbox" role="switch" id="auto" aria-label="启用自动切换" ${state.auto?'checked':''}></label>${state.auto?`<div class="mb-auto-fields">${autoRow('day','白天')}${autoRow('night','夜晚')}</div><p class="mb-help">时段交替时切换，中途手动调整会保留。</p>`:'<p class="mb-help">按时间在白天和夜晚的场景之间切换</p>'}`)+slider('brightness','软件调光','在硬件亮度基础上再压暗，适合夜间','contrast')+slider('warmth','色温','向右更暖，减少蓝光','thermometer')+`<button type="button" class="mb-chip" id="reset">${icon('rotate')}<span>恢复软件调整</span></button>`;
  }
  function resolutionGroup(label, ic, values, hidpi) {
    return card(title(label,ic,`${values.length} 种`)+`<div class="mb-list">${values.map(res=>`<button type="button" data-resolution="${res}" data-hidpi="${hidpi}" aria-pressed="${state.resolution===res && state.hidpi===hidpi}"><span>${res}</span><small>${hidpi?'渲染 '+pixels(res):state.rate+' Hz'}</small>${icon('check')}</button>`).join('')}</div>`);
  }
  function modes() {
    return `<h3 class="mb-section">分辨率</h3>`+card(title('刷新率','gauge',state.resolution)+`<div class="mb-grid">${[160,144,120,60].map(n=>chip(n+' Hz',state.rate===n,`data-rate="${n}"`)).join('')}</div>`)+(state.platform==='mac'?resolutionGroup('HiDPI（清晰）','zoom',['3360 × 1890','3200 × 1800','2560 × 1440','1920 × 1080','1600 × 900','1280 × 720'],true):'')+resolutionGroup('标准','layers',['3840 × 2160','2560 × 1440','1920 × 1080'],false);
  }
  function activity() {
    const rows=[['周四',5,3],['周五',8,6],['周六',2,.83],['周日',0,0],['周一',6,4],['周二',9,7],['周三',3,2]];
    return `<h3 class="mb-section">屏幕时间</h3><div class="mb-stats">${card('<div class="mb-stat-label">今日亮屏</div><div class="mb-stat-value">3 小时 0 分</div>')}${card('<div class="mb-stat-label">今日使用</div><div class="mb-stat-value">2 小时 0 分</div>')}</div>`+card(title('最近 7 天','calendar','日均 5 小时 30 分')+`<div class="mb-chart" role="img" aria-label="示例一周亮屏时长依次为 5、8、2、0、6、9、3 小时；操作时长为 3、6、0.83、0、4、7、2 小时">${rows.map(([day,awake,active])=>`<div class="mb-day" title="${day}：亮屏 ${awake} 小时，操作 ${active} 小时"><div class="mb-track"><span style="height:${awake/9*100}%"></span><span style="height:${active/9*100}%"></span></div>${day}</div>`).join('')}</div><div class="mb-legend"><span><i></i>亮屏</span><span><i></i>有键鼠操作</span></div>`)+`<p class="mb-help">亮屏：显示器点亮的时长；使用：两分钟内有键盘或鼠标操作的时长。MonitorBar 运行时才会记录。</p>`;
  }
  function syncValues() {
    content.querySelectorAll('[data-range]').forEach(el=>{ el.value=state[el.dataset.range]; el.style.setProperty('--fill',((Number(el.value)-Number(el.min))/(Number(el.max)-Number(el.min))*100)+'%'); });
    content.querySelectorAll('[data-output]').forEach(el=>{ const key=el.dataset.output; el.textContent=key==='warmth' && !state[key]?'标准':state[key]; });
    content.querySelectorAll('[data-scene]').forEach(el=>el.setAttribute('aria-pressed',String(state.scene===el.dataset.scene)));
    root.style.setProperty('--glow',.1+.26*state.brightness/100);
    root.style.setProperty('--screen-glow',.05+.3*state.brightness/100);
  }
  function applyTheme() {
    const light=state.theme==='light';
    root.dataset.theme=state.theme;
    $('#theme').value=state.theme;
    $('#lab-heading').textContent=light?'MonitorBar 的浅色表达':'MonitorBar 的状态栏语言';
    $('#lab-intro').textContent=light?'银白表面、石墨文字与克制的蓝色。沿用紧凑结构，贴近苹果系统面板的视觉习惯。':'炭黑底与橙色强调。复用原作的紧凑比例、组件与交互。';
    $('#sample-heading').textContent=light?'银白 · 系统蓝':'炭黑 · 橙色';
    $('#theme-rule').textContent=light?'中性银白，蓝色点缀':'一个橙色，三种选中态';
    $('#theme-description').textContent=light?'白色卡片、浅灰控件和白色选中分页。蓝色用于当前选择与操作反馈。':'分页 20% 底；选项 18% 底 + 55% 边；列表 14% 底 + 勾选。';
    $('#swatch-surface').style.background=light?'#f5f5f7':'#121315';
    $('#swatch-card').style.background=light?'#fff':'#242426';
    $('#swatch-accent').style.background=light?'#007AFF':'#ff6900';
    $('#swatch-code').textContent=light?'#007AFF':'#FF6900';
    document.title=light?'MonitorBar · 苹果风银白':'MonitorBar · 深色橙';
  }
  function render() {
    const active=document.activeElement;
    const focusKey=active && content.contains(active)?(active.id?`#${active.id}`:active.dataset.scene?`[data-scene="${active.dataset.scene}"]`:active.dataset.rate?`[data-rate="${active.dataset.rate}"]`:active.dataset.resolution?`[data-resolution="${active.dataset.resolution}"][data-hidpi="${active.dataset.hidpi}"]`:active.dataset.source?`[data-source="${active.dataset.source}"]`:null):null;
    root.dataset.platform=state.platform;
    applyTheme();
    $('.mb-tabs').innerHTML=tabs.map(([id,name,ic])=>`<button type="button" id="tab-${id}" role="tab" aria-controls="page-content" aria-selected="${state.tab===id}" tabindex="${state.tab===id?0:-1}" title="${name}" aria-label="${name}" data-tab="${id}">${icon(ic)}</button>`).join('');
    content.setAttribute('aria-labelledby','tab-'+state.tab);
    content.innerHTML=({overview,picture,modes,activity})[state.tab]();
    if(state.connection==='error') content.insertAdjacentHTML('beforeend','<div class="mb-notice" role="alert"><span>设备连接失败，请重试。</span><button class="mb-chip" data-retry>重试</button></div>');
    const messages={connected:'已通过局域网连接 · 澎湃 OS 遥控',detecting:'正在检测显示器…',unsupported:'仅显示可用的本地功能',error:'设备暂时离线'};
    $('#status').innerHTML=state.connection==='unsupported'?'<span></span>':`<span class="mb-dot" data-state="${state.connection}"></span><span>${messages[state.connection]}</span>`;
    $('#platform-note').textContent=state.platform==='mac'?'顶部箭头关联菜单栏入口；圆角 16，主体保持不透明。':'省略顶部箭头；原生窗口保持不透明，圆角与轮廓由 Windows 11 提供。';
    const descriptions={overview:['概览：高频控制直接可用','设备状态、输入源、亮度、音量、场景。试着拖动滑杆或选择场景。'],picture:['画面：逐步展开详细设置','复用同一控制卡片；自动切换开关决定是否展开时段配置。'],modes:['分辨率：列表承担密集选择','主值在左、解释在右，末尾保留勾选位。Windows 样板省略 HiDPI 分组。'],activity:['屏幕时间：同色表达两个量',state.theme==='light'?'浅蓝是亮屏时长，蓝色是操作时长；重叠比较，不相加堆叠。':'淡橙是亮屏时长，实橙是操作时长；重叠比较，不相加堆叠。']};
    [$('#page-rule').textContent,$('#page-description').textContent]=descriptions[state.tab];
    const shot=state.platform==='windows'?'windows':state.tab;
    const path='screenshots/'+shot+'.png';
    $('#original').src=path; $('#original-link').href=path;
    const label=state.platform==='windows'?'Windows 11 · 仓库只提供概览截图':tabs.find(t=>t[0]===state.tab)[1]+' · macOS 2× 快照';
    $('#original-label').textContent=label; $('#original').alt='MonitorBar 原仓库截图：'+label;
    $('#source-note').textContent=state.tab==='picture' && state.platform==='mac'?'此图早于当前源码：缺少自动切换卡片，并包含已移除的能力说明。':state.theme==='light'?'浅色为本次设计的可选扩展；右侧保留原仓库深色图，便于比较层次。':'仓库原图用于校准外观，固定示例数据不代表本机设备。';
    syncValues();
    if(focusKey) content.querySelector(focusKey)?.focus({preventScroll:true});
  }
  function setTab(tab, focus=false) { state.tab=tab; render(); content.scrollTop=0; if(focus) $('#tab-'+tab).focus(); }
  $('.mb-tabs').addEventListener('click', e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab,true);});
  $('.mb-tabs').addEventListener('keydown', e=>{const current=tabs.findIndex(t=>t[0]===state.tab);let next;if(e.key==='ArrowRight')next=(current+1)%4;else if(e.key==='ArrowLeft')next=(current+3)%4;else if(e.key==='Home')next=0;else if(e.key==='End')next=3;else return;e.preventDefault();setTab(tabs[next][0],true);});
  content.addEventListener('input',e=>{const key=e.target.dataset.range;if(!key)return;state[key]=Number(e.target.value);state.scene=null;syncValues();});
  content.addEventListener('change',e=>{
    if(e.target.id==='auto'){state.auto=e.target.checked;render();announce(state.auto?'已开启自动切换演示。':'已关闭自动切换演示。');}
    if(e.target.dataset.time)state[e.target.dataset.time+'Time']=e.target.value;
    if(e.target.dataset.period)state[e.target.dataset.period+'Scene']=e.target.value;
    if(e.target.dataset.range)announce('示例数值已更新为 '+e.target.value+'。');
  });
  content.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b || b.disabled)return;
    if(b.dataset.step){const k=b.dataset.step;state[k]=Math.max(k==='brightness'?20:0,Math.min(100,state[k]+Number(b.dataset.delta)));state.scene=null;syncValues();announce('示例数值已更新为 '+state[k]+'。');return;}
    if(b.dataset.source){state.input=b.dataset.source;announce('已在样板中切换到 '+state.input+'。');}
    else if(b.dataset.scene){const sc=scenes.find(s=>s[0]===b.dataset.scene);state.scene=sc[0];state.brightness=sc[2];state.warmth=sc[3];announce('已应用「'+sc[0]+'」演示场景。');}
    else if(b.dataset.rate){state.rate=Number(b.dataset.rate);announce('示例刷新率：'+state.rate+' Hz。');}
    else if(b.dataset.resolution){state.resolution=b.dataset.resolution;state.hidpi=b.dataset.hidpi==='true';announce('示例分辨率：'+state.resolution+'。');}
    else if(b.id==='reset'){state.brightness=100;state.warmth=0;state.scene=null;announce('软件调整已恢复为演示初始值。');}
    else if(b.hasAttribute('data-retry')){state.connection='connected';$('#connection').value='connected';announce('重试演示完成，已恢复连接状态。');}
    else return;
    render();
  });
  $('#theme').addEventListener('change',e=>{state.theme=e.target.value;const scroll=content.scrollTop;render();content.scrollTop=scroll;const url=new URL(location.href);url.searchParams.set('theme',state.theme);history.replaceState(null,'',url);announce(state.theme==='light'?'已切换到苹果风银白。':'已切换到原版深色橙。');});
  $('#platform').addEventListener('change', e=>{state.platform=e.target.value;if(state.platform==='windows')state.hidpi=false;render();});
  $('#connection').addEventListener('change', e=>{state.connection=e.target.value;render();announce('当前状态示例：'+e.target.selectedOptions[0].textContent+'。');});
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  const menu=$('#menu');
  function closeMenu(focus=false){menu.hidden=true;$('#more').setAttribute('aria-expanded','false');if(focus)$('#more').focus();}
  $('#more').addEventListener('click',()=>{menu.hidden=!menu.hidden;$('#more').setAttribute('aria-expanded',String(!menu.hidden));if(!menu.hidden)menu.querySelector('button').focus();});
  menu.addEventListener('click',e=>{const action=e.target.dataset.menu;if(!action)return;if(action==='detect'){state.connection='connected';$('#connection').value='connected';render();announce('重新检测演示完成。');}if(action==='settings')announce('这是样板操作：实际应用在此打开系统显示设置。');if(action==='startup'){state.startup=!state.startup;e.target.textContent='登录时启动：'+(state.startup?'开启':'关闭');announce('已改变样板中的开机启动选择。');}closeMenu(true);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !menu.hidden){closeMenu(true);e.preventDefault();}});
  document.addEventListener('click',e=>{if(!menu.hidden && !menu.contains(e.target) && !$('#more').contains(e.target))closeMenu();});
  $('#power').addEventListener('click',()=>announce('熄屏动作仅作演示，实际屏幕没有改变。'));
  render();
})();
