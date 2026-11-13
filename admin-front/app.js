/* Babyland admin panel — plain JS, no build step.
 * Talks to the same backend under /admin/* (same origin, so no CORS/base URL config). */
(function () {
  'use strict';

  const API_BASE = '/admin';
  const TOKEN_KEY = 'babyland_admin_token';
  const EXPIRES_KEY = 'babyland_admin_expires';
  const PAGE_SIZE = 10;

  const STATUS_LABELS = { ACTIVE: 'Faol', INACTIVE: 'Nofaol', DELETED: "O'chirilgan" };
  const CONTENT_TYPES = {
    TEXT: 'Matn (TEXT)',
    PARAGRAPH: 'Paragraf (PARAGRAPH)',
    IMAGE: 'Rasm (IMAGE)',
  };
  const IMAGE_ACCEPT = '.gif,.jpeg,.jpg,.png,.svg';

  const app = document.getElementById('app');

  /* ================= helpers ================= */

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    return isNaN(d) ? '—' : d.toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
  }

  let toastTimer;
  function toast(message, type) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.className = 'toast' + (type ? ' ' + type : '');
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 3500);
  }

  function navigate(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function parseHash() {
    const raw = location.hash.replace(/^#/, '') || '/articles';
    const [path, query = ''] = raw.split('?');
    return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(query) };
  }

  /* ================= auth ================= */

  const auth = {
    get token() {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const expires = localStorage.getItem(EXPIRES_KEY);
        if (!token) return null;
        if (expires && new Date(expires) <= new Date()) {
          auth.clear();
          return null;
        }
        return token;
      } catch (e) {
        return null;
      }
    },
    save(token, expiresAt) {
      try {
        localStorage.setItem(TOKEN_KEY, token);
        if (expiresAt) localStorage.setItem(EXPIRES_KEY, expiresAt);
      } catch (e) { /* storage unavailable */ }
    },
    clear() {
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRES_KEY);
      } catch (e) { /* storage unavailable */ }
    },
  };

  function logout(message) {
    auth.clear();
    if (message) toast(message, 'error');
    navigate('#/login');
  }

  /* ================= API ================= */

  async function api(method, path, { body, form, query } = {}) {
    let url = API_BASE + path;
    if (query) {
      const qs = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.set(k, v);
      });
      const s = qs.toString();
      if (s) url += '?' + s;
    }

    const headers = { 'Content-Language': 'uz' };
    const token = auth.token;
    if (token) headers.Authorization = 'Bearer ' + token;

    let payload;
    if (form) {
      payload = form; // browser sets multipart boundary itself
    } else if (body) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    let res;
    try {
      res = await fetch(url, { method, headers, body: payload });
    } catch (e) {
      throw new Error("Server bilan bog'lanib bo'lmadi");
    }

    let json = null;
    try {
      json = await res.json();
    } catch (e) { /* non-JSON response */ }

    if (res.status === 401 && path !== '/login') {
      logout('Sessiya tugadi, qaytadan kiring');
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      throw new Error((json && json.message) || 'Xatolik: ' + res.status);
    }
    return json ? json.data : null;
  }

  /** Append {uz, ru} object to FormData as field[uz] / field[ru] (multer parses brackets). */
  function appendTranslates(fd, name, uz, ru) {
    fd.append(name + '[uz]', uz);
    fd.append(name + '[ru]', ru);
  }

  /* ================= layout ================= */

  function shell(inner) {
    return `
      <header class="topbar">
        <a class="brand" href="#/articles">Babyland Admin</a>
        <button class="btn btn-sm" id="logout-btn">Chiqish</button>
      </header>
      <main class="container">${inner}</main>`;
  }

  function bindShell() {
    const btn = document.getElementById('logout-btn');
    if (btn) btn.onclick = () => logout();
  }

  function loading() {
    app.innerHTML = shell('<div class="empty">Yuklanmoqda…</div>');
    bindShell();
  }

  function errorView(message) {
    app.innerHTML = shell(`
      <div class="card empty">
        <p>${esc(message)}</p>
        <a class="btn" href="#/articles">← Maqolalar ro'yxati</a>
      </div>`);
    bindShell();
  }

  /* ================= views ================= */

  function renderLogin() {
    app.innerHTML = `
      <div class="login-wrap">
        <form class="card login-card" id="login-form">
          <h1>Babyland Admin</h1>
          <p class="hint">Davom etish uchun tizimga kiring</p>
          <label for="login">Login</label>
          <input id="login" name="login" type="text" autocomplete="username" required maxlength="50" />
          <label for="password">Parol</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required maxlength="50" />
          <div class="form-actions">
            <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Kirish</button>
          </div>
        </form>
      </div>`;

    const form = document.getElementById('login-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      btn.disabled = true;
      try {
        const data = await api('POST', '/login', {
          body: { login: form.login.value.trim(), password: form.password.value },
        });
        auth.save(data.accessToken, data.expiresAt);
        navigate('#/articles');
      } catch (err) {
        toast(err.message, 'error');
      } finally {
        btn.disabled = false;
      }
    };
  }

  async function renderArticleList(query) {
    const status = query.get('status') || '';
    const page = Math.max(1, parseInt(query.get('page'), 10) || 1);
    loading();

    let data;
    try {
      data = await api('GET', '/article/list', { query: { page, size: PAGE_SIZE, status } });
    } catch (err) {
      return errorView(err.message);
    }

    const items = data.items || [];
    const meta = data.meta || {};
    const pages = meta.pages || 0;

    const rows = items
      .map(
        (a) => `
        <tr>
          <td>${a.imagePath ? `<img class="thumb" src="${esc(a.imagePath)}" alt="" />` : '<div class="thumb"></div>'}</td>
          <td>
            <a href="#/articles/${esc(a.id)}"><strong>${esc(a.title && a.title.uz)}</strong></a>
            <div class="hint">${esc(a.title && a.title.ru)}</div>
          </td>
          <td><span class="badge badge-${esc(a.status)}">${esc(STATUS_LABELS[a.status] || a.status)}</span></td>
          <td>${esc(formatDate(a.createdAt))}</td>
          <td class="actions">
            <a class="btn btn-sm" href="#/articles/${esc(a.id)}">Kontent</a>
            <a class="btn btn-sm" href="#/articles/${esc(a.id)}/edit">Tahrirlash</a>
            ${
              a.status === 'ACTIVE'
                ? `<button class="btn btn-sm" data-status="INACTIVE" data-id="${esc(a.id)}">Nofaol qilish</button>`
                : `<button class="btn btn-sm" data-status="ACTIVE" data-id="${esc(a.id)}">Faollashtirish</button>`
            }
            <button class="btn btn-sm btn-danger" data-status="DELETED" data-id="${esc(a.id)}">O'chirish</button>
          </td>
        </tr>`,
      )
      .join('');

    const pageLink = (p) => {
      const q = new URLSearchParams();
      if (status) q.set('status', status);
      q.set('page', p);
      return '#/articles?' + q.toString();
    };

    app.innerHTML = shell(`
      <div class="page-head">
        <h1>Maqolalar <span class="hint">(${meta.count || 0})</span></h1>
        <div class="filters">
          <select id="status-filter">
            <option value="">Barcha holatlar</option>
            <option value="ACTIVE"${status === 'ACTIVE' ? ' selected' : ''}>Faol</option>
            <option value="INACTIVE"${status === 'INACTIVE' ? ' selected' : ''}>Nofaol</option>
          </select>
          <a class="btn btn-primary" href="#/articles/new">+ Yangi maqola</a>
        </div>
      </div>
      <div class="card" style="padding:0">
        ${
          items.length
            ? `<div class="table-wrap"><table>
                <thead><tr><th></th><th>Sarlavha</th><th>Holat</th><th>Yaratilgan</th><th></th></tr></thead>
                <tbody>${rows}</tbody>
              </table></div>`
            : '<div class="empty">Maqolalar topilmadi</div>'
        }
      </div>
      ${
        pages > 1
          ? `<div class="pagination">
              ${page > 1 ? `<a class="btn btn-sm" href="${pageLink(page - 1)}">← Oldingi</a>` : ''}
              <span>${page} / ${pages}</span>
              ${page < pages ? `<a class="btn btn-sm" href="${pageLink(page + 1)}">Keyingi →</a>` : ''}
            </div>`
          : ''
      }`);
    bindShell();

    document.getElementById('status-filter').onchange = (e) => {
      navigate(e.target.value ? '#/articles?status=' + e.target.value : '#/articles');
    };

    app.querySelectorAll('button[data-status]').forEach((btn) => {
      btn.onclick = () => changeStatus(btn.dataset.id, btn.dataset.status, () => render());
    });
  }

  async function changeStatus(id, status, onDone) {
    if (status === 'DELETED' && !confirm("Maqolani o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api('PUT', '/article/change-status/' + id, { body: { status } });
      toast('Holat yangilandi', 'success');
      onDone && onDone();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function renderArticleForm(id) {
    const isEdit = Boolean(id);
    let article = null;

    if (isEdit) {
      loading();
      try {
        article = await api('GET', '/article/' + id);
      } catch (err) {
        return errorView(err.message);
      }
    }

    const v = (field, lang) => esc(article && article[field] ? article[field][lang] : '');

    app.innerHTML = shell(`
      <div class="page-head">
        <h1>${isEdit ? 'Maqolani tahrirlash' : 'Yangi maqola'}</h1>
        <a class="btn" href="${isEdit ? '#/articles/' + esc(id) : '#/articles'}">← Orqaga</a>
      </div>
      <form class="card" id="article-form">
        <div class="grid-2">
          <div>
            <label>Sarlavha (UZ)</label>
            <input name="title_uz" type="text" required minlength="${isEdit ? 1 : 6}" value="${v('title', 'uz')}" />
          </div>
          <div>
            <label>Sarlavha (RU)</label>
            <input name="title_ru" type="text" required minlength="${isEdit ? 1 : 6}" value="${v('title', 'ru')}" />
          </div>
          <div>
            <label>Tavsif (UZ)</label>
            <textarea name="description_uz" required>${v('description', 'uz')}</textarea>
          </div>
          <div>
            <label>Tavsif (RU)</label>
            <textarea name="description_ru" required>${v('description', 'ru')}</textarea>
          </div>
          ${
            isEdit
              ? ''
              : `<div>
                  <label>Slug (UZ) <span class="hint">ixtiyoriy</span></label>
                  <input name="slug_uz" type="text" minlength="5" maxlength="70" />
                </div>
                <div>
                  <label>Slug (RU) <span class="hint">ixtiyoriy</span></label>
                  <input name="slug_ru" type="text" minlength="5" maxlength="70" />
                  <div class="hint">Bo'sh qoldirilsa sarlavhadan avtomatik yaratiladi</div>
                </div>`
          }
        </div>
        <label>Rasm ${isEdit ? '<span class="hint">(o\'zgartirish uchun yangisini tanlang)</span>' : ''}</label>
        <input name="file" type="file" accept="${IMAGE_ACCEPT}" ${isEdit ? '' : 'required'} />
        <div class="hint">gif, jpeg, jpg, png, svg — 20MB gacha</div>
        <img id="preview" class="image-preview" ${article && article.imagePath ? `src="${esc(article.imagePath)}"` : 'hidden'} alt="" />
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">${isEdit ? 'Saqlash' : 'Yaratish'}</button>
        </div>
      </form>`);
    bindShell();

    const form = document.getElementById('article-form');
    const preview = document.getElementById('preview');
    form.file.onchange = () => {
      const f = form.file.files[0];
      if (f) {
        preview.src = URL.createObjectURL(f);
        preview.hidden = false;
      }
    };

    form.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData();
      appendTranslates(fd, 'title', form.title_uz.value.trim(), form.title_ru.value.trim());
      appendTranslates(fd, 'description', form.description_uz.value.trim(), form.description_ru.value.trim());
      if (!isEdit) {
        const su = form.slug_uz.value.trim();
        const sr = form.slug_ru.value.trim();
        if (su || sr) {
          if (!su || !sr) return toast("Slug ikkala til uchun ham to'ldirilishi kerak", 'error');
          appendTranslates(fd, 'slug', su, sr);
        }
      }
      if (form.file.files[0]) fd.append('file', form.file.files[0]);

      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      try {
        const saved = isEdit
          ? await api('PUT', '/article/' + id, { form: fd })
          : await api('POST', '/article', { form: fd });
        toast(isEdit ? 'Saqlandi' : 'Maqola yaratildi (nofaol holatda)', 'success');
        navigate('#/articles/' + saved.id);
      } catch (err) {
        toast(err.message, 'error');
      } finally {
        btn.disabled = false;
      }
    };
  }

  async function renderArticleDetail(id) {
    loading();
    let article, contents;
    try {
      [article, contents] = await Promise.all([
        api('GET', '/article/' + id),
        api('GET', '/article-content/list', { query: { articleId: id, page: 1, size: 1000 } }),
      ]);
    } catch (err) {
      return errorView(err.message);
    }

    const blocks = (contents.items || []).slice().sort((a, b) => a.order - b.order);
    const nextOrder = blocks.length ? Math.min(1000, Math.max(...blocks.map((b) => b.order)) + 1) : 0;

    const translatesHtml = (t) =>
      t ? `<p><span class="lang-tag">UZ</span>${esc(t.uz)}</p><p><span class="lang-tag">RU</span>${esc(t.ru)}</p>` : '';

    const blocksHtml = blocks
      .map(
        (b) => `
        <div class="content-block">
          <div class="order-num">#${esc(b.order)}</div>
          <div class="body">
            <span class="badge badge-type">${esc(b.type)}</span>
            ${b.type === 'IMAGE' && b.imagePath ? `<div><img src="${esc(b.imagePath)}" alt="" /></div>` : ''}
            ${b.type === 'TEXT' ? translatesHtml(b.text) : ''}
            ${b.type === 'PARAGRAPH' ? translatesHtml(b.paragraph) : ''}
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <button class="btn btn-sm" data-edit="${esc(b.id)}">Tahrirlash</button>
            <button class="btn btn-sm btn-danger" data-delete="${esc(b.id)}">O'chirish</button>
          </div>
        </div>`,
      )
      .join('');

    const isDeleted = article.status === 'DELETED';

    app.innerHTML = shell(`
      <div class="page-head">
        <h1>Maqola</h1>
        <div class="filters">
          <a class="btn" href="#/articles">← Ro'yxat</a>
          ${isDeleted ? '' : `<a class="btn" href="#/articles/${esc(id)}/edit">Tahrirlash</a>`}
          ${
            isDeleted
              ? ''
              : article.status === 'ACTIVE'
              ? '<button class="btn" data-status="INACTIVE">Nofaol qilish</button>'
              : '<button class="btn btn-primary" data-status="ACTIVE">Faollashtirish</button>'
          }
          ${isDeleted ? '' : '<button class="btn btn-danger" data-status="DELETED">O\'chirish</button>'}
        </div>
      </div>

      <div class="card">
        <div class="article-head">
          ${article.imagePath ? `<img src="${esc(article.imagePath)}" alt="" />` : ''}
          <div class="meta">
            <span class="badge badge-${esc(article.status)}">${esc(STATUS_LABELS[article.status] || article.status)}</span>
            <h2 style="margin-top:8px">${esc(article.title && article.title.uz)}</h2>
            <div class="hint">${esc(article.title && article.title.ru)}</div>
            <div style="margin-top:12px">${translatesHtml(article.description)}</div>
            <div class="hint">Yaratilgan: ${esc(formatDate(article.createdAt))} · ID: ${esc(article.id)}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Kontent bloklari (${blocks.length})</h2>
        ${blocksHtml || '<div class="empty">Hali kontent qo\'shilmagan</div>'}
      </div>

      ${
        isDeleted
          ? ''
          : `<form class="card" id="content-form">
              <h2>Blok qo'shish</h2>
              <div class="grid-2">
                <div>
                  <label>Turi</label>
                  <select name="type">
                    ${Object.entries(CONTENT_TYPES).map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label>Tartib raqami (order)</label>
                  <input name="order" type="number" min="0" max="1000" required value="${nextOrder}" />
                </div>
              </div>
              <div id="content-fields"></div>
              <div class="form-actions">
                <button class="btn btn-primary" type="submit">Qo'shish</button>
              </div>
            </form>`
      }`);
    bindShell();

    app.querySelectorAll('button[data-status]').forEach((btn) => {
      btn.onclick = () =>
        changeStatus(id, btn.dataset.status, () =>
          btn.dataset.status === 'DELETED' ? navigate('#/articles') : render(),
        );
    });

    app.querySelectorAll('button[data-delete]').forEach((btn) => {
      btn.onclick = async () => {
        if (!confirm("Blokni o'chirishni tasdiqlaysizmi?")) return;
        try {
          await api('DELETE', '/article-content/' + btn.dataset.delete);
          toast("Blok o'chirildi", 'success');
          render();
        } catch (err) {
          toast(err.message, 'error');
        }
      };
    });

    app.querySelectorAll('button[data-edit]').forEach((btn) => {
      btn.onclick = () => {
        const block = blocks.find((b) => b.id === btn.dataset.edit);
        if (block) openBlockEditor(btn.closest('.content-block'), block);
      };
    });

    const form = document.getElementById('content-form');
    if (!form) return;
    const fields = document.getElementById('content-fields');

    const renderFields = () => {
      const type = form.type.value;
      if (type === 'IMAGE') {
        fields.innerHTML = `
          <label>Rasm</label>
          <input name="file" type="file" accept="${IMAGE_ACCEPT}" required />
          <div class="hint">gif, jpeg, jpg, png, svg — 20MB gacha</div>`;
      } else {
        fields.innerHTML = `
          <div class="grid-2">
            <div><label>UZ</label><textarea name="val_uz" required rows="5"></textarea></div>
            <div><label>RU</label><textarea name="val_ru" required rows="5"></textarea></div>
          </div>`;
      }
    };
    form.type.onchange = renderFields;
    renderFields();

    form.onsubmit = async (e) => {
      e.preventDefault();
      const type = form.type.value;
      const fd = new FormData();
      fd.append('type', type);
      fd.append('order', form.order.value);
      if (type === 'IMAGE') {
        fd.append('file', form.file.files[0]);
      } else {
        appendTranslates(fd, type === 'TEXT' ? 'text' : 'paragraph', form.val_uz.value.trim(), form.val_ru.value.trim());
      }

      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      try {
        await api('POST', '/article-content/' + id, { form: fd });
        toast("Blok qo'shildi", 'success');
        render();
      } catch (err) {
        toast(err.message, 'error');
        btn.disabled = false;
      }
    };
  }

  /** Replace a content block card with an inline edit form (PUT /article-content/:id). */
  function openBlockEditor(container, block) {
    const isImage = block.type === 'IMAGE';
    const value = block.type === 'TEXT' ? block.text : block.paragraph;

    container.outerHTML = `
      <form class="content-block" id="edit-block-form" style="flex-direction:column;gap:0;border-color:var(--primary)">
        <div><span class="badge badge-type">${esc(block.type)}</span></div>
        <div class="grid-2">
          <div>
            <label>Tartib raqami (order)</label>
            <input name="order" type="number" min="0" max="1000" required value="${esc(block.order)}" />
          </div>
        </div>
        ${
          isImage
            ? `<label>Rasm <span class="hint">(o'zgartirish uchun yangisini tanlang)</span></label>
               <input name="file" type="file" accept="${IMAGE_ACCEPT}" />
               <img id="edit-preview" class="image-preview" ${block.imagePath ? `src="${esc(block.imagePath)}"` : 'hidden'} alt="" />`
            : `<div class="grid-2">
                 <div><label>UZ</label><textarea name="val_uz" required rows="6">${esc(value && value.uz)}</textarea></div>
                 <div><label>RU</label><textarea name="val_ru" required rows="6">${esc(value && value.ru)}</textarea></div>
               </div>`
        }
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">Saqlash</button>
          <button class="btn" type="button" id="edit-cancel">Bekor qilish</button>
        </div>
      </form>`;

    const form = document.getElementById('edit-block-form');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('edit-cancel').onclick = () => render();

    if (isImage) {
      const preview = document.getElementById('edit-preview');
      form.file.onchange = () => {
        const f = form.file.files[0];
        if (f) {
          preview.src = URL.createObjectURL(f);
          preview.hidden = false;
        }
      };
    }

    form.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData();
      fd.append('order', form.order.value);
      if (isImage) {
        if (form.file.files[0]) fd.append('file', form.file.files[0]);
      } else {
        appendTranslates(fd, block.type === 'TEXT' ? 'text' : 'paragraph', form.val_uz.value.trim(), form.val_ru.value.trim());
      }

      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      try {
        await api('PUT', '/article-content/' + block.id, { form: fd });
        toast('Blok saqlandi', 'success');
        render();
      } catch (err) {
        toast(err.message, 'error');
        btn.disabled = false;
      }
    };
  }

  /* ================= router ================= */

  function render() {
    const { parts, query } = parseHash();

    if (parts[0] === 'login') {
      if (auth.token) return navigate('#/articles');
      return renderLogin();
    }
    if (!auth.token) return navigate('#/login');

    if (parts[0] === 'articles') {
      if (parts.length === 1) return renderArticleList(query);
      if (parts[1] === 'new') return renderArticleForm(null);
      if (parts.length === 2) return renderArticleDetail(parts[1]);
      if (parts[2] === 'edit') return renderArticleForm(parts[1]);
    }
    navigate('#/articles');
  }

  window.addEventListener('hashchange', render);
  render();
})();
