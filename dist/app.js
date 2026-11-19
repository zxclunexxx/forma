'use strict';
const projects = [
  {id:'mori',name:'mori — matcha, made simple',category:'brand',label:'Брендинг',image:'assets/mori-hero.png',alt:'Зелёная упаковка матча mori, белая коробка и чашка на лаймовом фоне',initial:'m',color:'#dce8b9',ink:'#285230',description:'Спокойная айдентика для бренда матча. Глубокий зелёный, мягкие формы и крупный логотип объединяют упаковку, карточки и предметную съёмку. Концепт исследует, как сделать ежедневный ритуал узнаваемым.',tags:['Упаковка','Айдентика','Предметный дизайн'],keywords:'матча чай упаковка зеленый минимализм логотип брендинг brand matcha'},
  {id:'folio',name:'folio — финансы в порядке',category:'web',label:'Веб-дизайн',image:'assets/folio.svg',alt:'Светлый веб-интерфейс folio с синим графиком и финансовыми карточками',initial:'f',color:'#e1e8ff',ink:'#3156d3',description:'Концепт рабочего пространства для личных финансов. Светлая сетка и один синий акцент помогают видеть главное: баланс, динамику и последние операции. У каждого блока своя понятная роль.',tags:['Веб-приложение','Дашборд','Финансы'],keywords:'сайт дашборд финансы банк синий dashboard web ui'},
  {id:'offgrid',name:'OFF GRID — вне рамок',category:'type',label:'Типографика',image:'assets/offgrid.svg',alt:'Типографический постер OFF GRID в чёрном и оранжевом',initial:'o',color:'#ff6638',ink:'#1b1512',description:'Плакат о праве выйти за привычную сетку. Крупная типографика, насыщенный оранжевый и строгая композиция работают как самостоятельная визуальная система.',tags:['Постер','Графический дизайн','Типографика'],keywords:'плакат шрифт постер фестиваль оранжевый poster type'},
  {id:'cirrus',name:'cirrus — погода без лишнего',category:'ui',label:'Интерфейсы',image:'assets/cirrus.svg',alt:'Голубой концепт приложения погоды cirrus с крупной температурой 18 градусов',initial:'c',color:'#dcedfa',ink:'#3c688c',description:'Лёгкий интерфейс прогноза погоды. Температура становится главным элементом, а детали выстроены по времени. Воздушная палитра оставляет достаточно места для информации.',tags:['Мобильное приложение','Прогноз погоды','UI'],keywords:'приложение мобильный погода голубой mobile weather app ui'},
  {id:'still',name:'STILL — время замедлиться',category:'web',label:'Веб-дизайн',image:'assets/still.svg',alt:'Редакционный дизайн STILL с терракотовыми плоскостями и крупным заголовком',initial:'s',color:'#eddfd3',ink:'#7b4a33',description:'Редакционная концепция о пространстве и повседневной жизни. Тёплые оттенки, крупные заголовки и свободная композиция задают спокойный ритм чтения.',tags:['Редакционный дизайн','Лайфстайл','Лендинг'],keywords:'сайт журнал архитектура интерьер минимализм editorial web'},
  {id:'moss',name:'MOSS — ближе к природе',category:'brand',label:'Брендинг',image:'assets/moss.svg',alt:'Ботаническая айдентика MOSS в глубоком зелёном цвете',initial:'M',color:'#d7dfc3',ink:'#334a2e',description:'Ботаническая айдентика, построенная на контрасте крупной типографики и органических деталей. Лесная палитра и лаконичная композиция легко переходят с постера на другие носители.',tags:['Айдентика','Ботаника','Постер'],keywords:'природа растения лес зелёный айдентика logo brand branding'},
];
const $ = (selector,root=document) => root.querySelector(selector);
const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
const storageKey = 'forma-saved-v1';
let saved = new Set();
try { const value = JSON.parse(localStorage.getItem(storageKey)||'[]'); if(Array.isArray(value)) saved = new Set(value.filter(id=>projects.some(p=>p.id===id))); } catch {}
const state = {category:'all',query:'',onlySaved:false,sort:'curated'};
let detailId = null;
let toastTimer;
let heroIndex = 0;
const heroProjects = ['mori','offgrid','cirrus'];
const icon = (name,cls='') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
const normalized = value => value.toLocaleLowerCase('ru').replaceAll('ё','е').trim();
function notify(message){ $('#toast span').textContent=message;$('#toast').classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('is-visible'),2800); }
function updateSavedCount(){ $$('.saved-count,.tab-count').forEach(el=>el.textContent=saved.size);$('#briefSavedCount').textContent=`(${saved.size})`; }
function toggleSave(id){
  if(saved.has(id)){saved.delete(id);notify('Проект удалён из избранного');}else{saved.add(id);notify('Проект сохранён в избранное');}
  try{localStorage.setItem(storageKey,JSON.stringify([...saved]));}catch{notify('Сохранено на эту сессию: хранилище браузера недоступно');}
  updateSavedCount();renderProjects();if(detailId===id)updateDetailSave();
}
function filteredProjects(){
  const query=normalized(state.query);
  let result=projects.filter(p=>(state.category==='all'||state.category===p.category)&&(!state.onlySaved||saved.has(p.id))&&(!query||normalized(`${p.name} ${p.label} ${p.description} ${p.keywords} ${p.tags.join(' ')}`).includes(query)));
  if(state.sort==='name')result.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
  return result;
}
function renderProjects(){
  const result=filteredProjects();
  $('#projectGrid').innerHTML=result.map(p=>`<article class="project-card" style="--card-color:${p.color};--card-ink:${p.ink}"><div class="card-art"><button class="card-open" data-open="${p.id}" aria-label="Открыть проект ${p.name}"><img src="${p.image}" alt="${p.alt}" width="800" height="600" loading="lazy"><span class="card-open-overlay">Смотреть проект${icon('diagonal','icon-sm')}</span></button><button class="card-save ${saved.has(p.id)?'is-saved':''}" data-save="${p.id}" aria-label="${saved.has(p.id)?'Убрать из избранного':'Сохранить'}: ${p.name}" aria-pressed="${saved.has(p.id)}">${icon('bookmark')}</button></div><div class="card-info"><div class="card-title"><span class="card-dot" aria-hidden="true">${p.initial}</span><h3>${p.name}</h3></div><span class="card-category">${p.label}</span></div></article>`).join('');
  $('#emptyState').hidden=result.length>0;$('#projectGrid').hidden=result.length===0;
  const isEmptySaved=state.onlySaved&&saved.size===0;
  $('#emptyTitle').textContent=isEmptySaved?'Здесь будут ваши находки':'Пока ничего не нашлось';
  $('#emptyDescription').textContent=isEmptySaved?'Нажмите на закладку у понравившегося проекта — он останется в вашей подборке.':'Попробуйте другое слово или выберите все направления.';
  $('#resetFilters').textContent=isEmptySaved?'Посмотреть проекты':'Сбросить фильтры';
  $('#resultsStatus').textContent=`Найдено проектов: ${result.length}`;
  $('#visibleCount').textContent=state.onlySaved?`В вашей подборке: ${result.length}`:`${result.length} ${result.length===1?'проект':result.length>1&&result.length<5?'проекта':'проектов'} для вашей следующей идеи`;
  $('#randomProject').hidden=result.length===0;
}
function setView(onlySaved){
  state.onlySaved=onlySaved;
  $('#allProjects').classList.toggle('is-active',!onlySaved);$('#allProjects').setAttribute('aria-pressed',!onlySaved);
  $('#savedProjects').classList.toggle('is-active',onlySaved);$('#savedProjects').setAttribute('aria-pressed',onlySaved);
  renderProjects();
}
function resetFilters(){state.category='all';state.query='';$('#searchInput').value='';$$('[data-category]').forEach(b=>{b.classList.toggle('is-active',b.dataset.category==='all');b.setAttribute('aria-pressed',b.dataset.category==='all');});if(state.onlySaved&&saved.size===0)setView(false);else renderProjects();}
function openDialog(dialog){if(!dialog.open)dialog.showModal();document.body.style.overflow='hidden';}
function updateDetailSave(){const isSaved=saved.has(detailId);$('#detailSave').classList.toggle('is-saved',isSaved);$('#detailSave').setAttribute('aria-pressed',isSaved);$('#detailSave span').textContent=isSaved?'Сохранено':'Сохранить';}
function openProject(id){
  const p=projects.find(p=>p.id===id);if(!p)return;
  detailId=id;$('#detailTitle').textContent=p.name;$('#detailCategory').textContent=p.label;$('#detailImage').src=p.image;$('#detailImage').alt=p.alt;$('#detailDescription').textContent=p.description;$('#detailTags').innerHTML=p.tags.map(t=>`<span>${t}</span>`).join('');updateDetailSave();openDialog($('#projectDialog'));
}
function openBrief(category){
  if($('#projectDialog').open)$('#projectDialog').close();
  if(category){$('#projectType').value=category;}updateSavedCount();openDialog($('#briefDialog'));
}
function setHero(index){
  heroIndex=(index+heroProjects.length)%heroProjects.length;const p=projects.find(p=>p.id===heroProjects[heroIndex]);
  $('#heroImage').src=p.image;$('#heroImage').alt=p.alt;$('#heroProjectName').textContent=p.name.split(' — ')[0];$('#heroProjectCategory').textContent=`${p.label} · ${p.name.split(' — ')[1]}`;$('#heroMonogram').textContent=p.initial;$('#heroMonogram').style.background=p.ink;$('#heroMonogram').style.color=p.color;$('#heroPosition').textContent=`${heroIndex+1} / ${heroProjects.length}`;$('#heroOpen').setAttribute('aria-label',`Открыть проект ${p.name}`);
}
$('#projectGrid').addEventListener('click',event=>{const open=event.target.closest('[data-open]');const save=event.target.closest('[data-save]');if(open)openProject(open.dataset.open);if(save){const id=save.dataset.save;toggleSave(id);($(`[data-save="${id}"]`)||$('[data-save]')||$('#savedProjects')).focus({preventScroll:true});}});
$('#allProjects').addEventListener('click',()=>setView(false));$('#savedProjects').addEventListener('click',()=>setView(true));
$$('[data-collection]').forEach(button=>button.addEventListener('click',()=>{resetFilters();setView(true);$('#projects').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
$$('[data-category]').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.category;$$('[data-category]').forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',b===button);});renderProjects();}));
$('#searchInput').addEventListener('input',event=>{state.query=event.target.value;renderProjects();});
$('#searchForm').addEventListener('submit',event=>{event.preventDefault();state.query=$('#searchInput').value;renderProjects();});
$('#sortSelect').addEventListener('change',event=>{state.sort=event.target.value;renderProjects();});
$('#resetFilters').addEventListener('click',resetFilters);
$('#randomProject').addEventListener('click',()=>{const options=filteredProjects();if(options.length)openProject(options[Math.floor(Math.random()*options.length)].id);});
$('#detailSave').addEventListener('click',()=>toggleSave(detailId));
$('#detailBrief').addEventListener('click',()=>openBrief(projects.find(p=>p.id===detailId)?.label));
$('#heroPrevious').addEventListener('click',()=>setHero(heroIndex-1));$('#heroNext').addEventListener('click',()=>setHero(heroIndex+1));
$('#heroOpen').addEventListener('click',()=>openProject(heroProjects[heroIndex]));$('#heroInfoOpen').addEventListener('click',()=>openProject(heroProjects[heroIndex]));
$$('[data-brief]').forEach(button=>button.addEventListener('click',()=>{closeMenu();openBrief();}));
$$('.close-dialog').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$$('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{if(!$('dialog[open]'))document.body.style.overflow='';});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});});
$$('[data-about-modal]').forEach(button=>button.addEventListener('click',()=>openDialog($('#aboutDialog'))));
$('#announcement .dismiss').addEventListener('click',()=>{$('#announcement').hidden=true;});
const closeMenu=()=>{$('#mobileNav').hidden=true;$('#menuToggle').setAttribute('aria-expanded','false');$('#menuToggle').setAttribute('aria-label','Открыть меню');};
$('#menuToggle').addEventListener('click',()=>{const open=$('#mobileNav').hidden;$('#mobileNav').hidden=!open;$('#menuToggle').setAttribute('aria-expanded',open);$('#menuToggle').setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
$$('#mobileNav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('dialog[open]')){event.preventDefault();$('#searchInput').focus();}if(event.key==='Escape')closeMenu();});
$('#briefForm').addEventListener('submit',event=>{
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
  const title=$('#projectName').value.trim(),goal=$('#projectGoal').value.trim();
  if(title.length<2){$('#projectName').setCustomValidity('Введите название из двух или более символов.');$('#projectName').reportValidity();return;}
  if(goal.length<10){$('#projectGoal').setCustomValidity('Опишите задачу хотя бы в нескольких словах.');$('#projectGoal').reportValidity();return;}
  const refs=$('#includeSaved').checked?projects.filter(p=>saved.has(p.id)):[];
  const text=`БРИФ ПРОЕКТА — ${title}\n\nДата: ${new Intl.DateTimeFormat('ru-RU').format(new Date())}\nНаправление: ${$('#projectType').value}\nСрок: ${$('#projectTiming').value}\n\nЗАДАЧА\n${goal}\n\nРЕФЕРЕНСЫ\n${refs.length?refs.map(p=>`• ${p.name}\n  ${p.label}. ${p.tags.join(', ')}\n  ${location.origin}${location.pathname}#project=${p.id}`).join('\n\n'):'Пока не выбраны.'}\n\nПодготовлено в Forma. Все референсы — авторские демонстрационные концепции.\n`;
  const blob=new Blob(['\uFEFF',text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`forma-brief-${title.replace(/[^\p{L}\p{N}\s_-]/gu,'').trim().replace(/\s+/g,'-').slice(0,60)||'project'}.txt`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);notify('Бриф готов. Скачивание началось.');
});
['projectName','projectGoal'].forEach(id=>$('#'+id).addEventListener('input',()=>$('#'+id).setCustomValidity('')));
function readHash(){const match=location.hash.match(/^#project=([a-z]+)$/);if(match)openProject(match[1]);}
window.addEventListener('hashchange',readHash);
window.addEventListener('storage',event=>{if(event.key===storageKey){try{const value=JSON.parse(event.newValue||'[]');saved=new Set(Array.isArray(value)?value.filter(id=>projects.some(p=>p.id===id)):[]);updateSavedCount();renderProjects();if(detailId)updateDetailSave();}catch{}}});
updateSavedCount();renderProjects();readHash();
