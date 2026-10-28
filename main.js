// IINA算数教室 共通スクリプト
(function(){
  // スマホメニュー
  var btn=document.querySelector('.menu-btn'), nav=document.querySelector('header nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');});});
  }

  // お問い合わせフォーム（送信先は従来と同じ Google Apps Script）
  var CONTACT_API_URL='https://script.google.com/macros/s/AKfycbyxf1iTu1qwW6YUKmMaJ3W5UqzMsobVhG7QNC3WLldG-Y_wy_689tmw1uTspNeAUj07/exec';
  var form=document.querySelector('[data-contact-form]');
  if(!form) return;
  var submit=form.querySelector('button[type="submit"]'), label=form.querySelector('[data-submit-label]');
  var box=form.querySelector('[data-form-status]'), title=form.querySelector('[data-form-status-title]'), msg=form.querySelector('[data-form-status-message]');
  function show(type,t,m){box.hidden=false;box.dataset.status=type;title.textContent=t;msg.textContent=m;}
  function hide(){box.hidden=true;box.removeAttribute('data-status');title.textContent='';msg.textContent='';}
  function validate(){
    var e=form.elements.email,c=form.elements.course,m=form.elements.message;
    var email=e.value.trim(),course=c.value.trim(),message=m.value.trim();
    if(!email){show('error','入力内容を確認してください。','メールアドレスを入力してください。');e.focus();return null;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){show('error','入力内容を確認してください。','正しい形式のメールアドレスを入力してください。');e.focus();return null;}
    if(!course){show('error','入力内容を確認してください。','ご希望のコースを選択してください。');c.focus();return null;}
    if(!message){show('error','入力内容を確認してください。','ご相談内容を入力してください。');m.focus();return null;}
    return {email:email,course:course,message:message};
  }
  form.addEventListener('submit',function(ev){
    ev.preventDefault(); if(submit.disabled) return;
    hide(); var payload=validate(); if(!payload) return;
    submit.disabled=true; label.textContent='送信中…';
    fetch(CONTACT_API_URL,{method:'POST',body:JSON.stringify(payload)})
      .then(function(r){if(!r.ok) throw new Error('status '+r.status);
        form.reset(); show('success','送信しました。','お問い合わせありがとうございます。内容を確認のうえ、ご連絡いたします。');})
      .catch(function(err){console.error(err); show('error','送信できませんでした。','時間をおいて、もう一度お試しいただくか、LINEからご連絡ください。');})
      .then(function(){submit.disabled=false; label.textContent='送信する';});
  });
})();
