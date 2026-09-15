/* ============================================================
   SJ ADV. — Admin Dashboard JavaScript (Supabase)
   ------------------------------------------------------------
   Modules:
     0. Config guard (SDK + credentials check)
     1. DOM references
     2. Toast notifications (success / error / warning)
     3. Authentication (login / logout / session / admin check)
     4. Image handling (upload to Storage, URL fallback, preview)
     5. Form (add / edit, validation, submit)
     6. Projects table (skeleton, render, actions)
     7. Delete confirmation modal
     8. Realtime (live table refresh)
     9. Init
   ------------------------------------------------------------
   NOTE: The admin account itself is created manually in
   Supabase Dashboard → Authentication → Users, and its UID must
   be added to the `admin_users` table (see supabase-setup.sql §6).
   No email/password is ever stored in this file.
   ============================================================ */

(() => {
  'use strict';

  /* ============== 0. Config guard ============== */
  const SB = window.SJSupabase;
  const isConfigured = !!(SB && SB.configured && SB.client);
  if (!isConfigured) {
    console.error('[SJ ADV Admin] Supabase is not configured. Paste your URL + anon key inside supabase.js');
  }
  const sb = isConfigured ? SB.client : null;
  const escapeHtml = SB ? SB.escapeHtml : (s) => String(s);
  const isSafeHttpUrl = SB ? SB.isSafeHttpUrl : () => true;
  const formatDate = SB ? SB.formatDate : (v) => String(v);

  const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
  const BUCKET = 'project-images';
  const CATEGORIES = ['تصميم هوية', 'إعلانات', 'موشن', 'تصميم مواقع', 'سوشيال ميديا', 'أخرى'];

  /* ============== 1. DOM references ============== */
  const $ = (id) => document.getElementById(id);

  const loginView      = $('loginView');
  const dashboardView  = $('dashboardView');
  const configError    = $('configError');
  const loginForm      = $('loginForm');
  const loginError     = $('loginError');
  const loginErrorMsg  = $('loginErrorMsg');
  const loginBtn       = $('loginBtn');
  const logoutBtn      = $('logoutBtn');
  const authzBanner    = $('authzBanner');

  const projectForm    = $('projectForm');
  const formPanelTitle = $('formPanelTitle');
  const submitBtn      = $('submitBtn');
  const submitLabel    = submitBtn.querySelector('.btn-admin__label');
  const cancelEditBtn  = $('cancelEditBtn');

  const fieldTitle     = $('fieldTitle');
  const fieldCategory  = $('fieldCategory');
  const fieldImage     = $('fieldImage');
  const fieldUrl       = $('fieldUrl');
  const projectTitle   = $('projectTitle');
  const projectCategory= $('projectCategory');
  const projectDesc    = $('projectDesc');
  const projectUrl     = $('projectUrl');

  const uploadBox      = $('uploadBox');
  const uploadBtn      = $('uploadBtn');
  const imageFile      = $('imageFile');
  const imageUrl       = $('imageUrl');
  const uploadPreview  = $('uploadPreview');
  const previewImg     = $('previewImg');
  const previewRemove  = $('previewRemove');
  const previewState   = $('previewState');
  const fileName       = $('fileName');

  const projectsTbody  = $('projectsTbody');
  const projectsCount  = $('projectsCount');

  const confirmModal   = $('confirmModal');
  const confirmName    = $('confirmProjectName');
  const confirmDelete  = $('confirmDeleteBtn');
  const cancelDelete   = $('cancelDeleteBtn');

  const toastContainer = $('toastContainer');

  /* ============== 2. Toast notifications ============== */
  const TOAST_ICONS = {
    success: '<path d="m5 12 4 4L19 7"/>',
    error:   '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
    warning: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>'
  };

  function showToast(type, title, msg = '', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <span class="toast__icon" aria-hidden="true">
        <svg class="icon" viewBox="0 0 24 24">${TOAST_ICONS[type] || TOAST_ICONS.success}</svg>
      </span>
      <div class="toast__body">
        <div class="toast__title">${escapeHtml(title)}</div>
        ${msg ? `<div class="toast__msg">${escapeHtml(msg)}</div>` : ''}
      </div>
      <button type="button" class="toast__close" aria-label="إغلاق التنبيه">
        <svg class="icon" viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <span class="toast__bar" aria-hidden="true"></span>`;

    const dismiss = () => {
      if (toast.classList.contains('is-leaving')) return;
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast__close').addEventListener('click', dismiss);
    toastContainer.appendChild(toast);
    setTimeout(dismiss, duration);
  }

  const toastSuccess = (t, m) => showToast('success', t, m);
  const toastError   = (t, m) => showToast('error', t, m, 6000);
  const toastWarning = (t, m) => showToast('warning', t, m, 6000);

  function arabicError(error, fallback = 'حدث خطأ غير متوقع.') {
    const message = error?.message || String(error || '');
    if (/invalid login credentials/i.test(message)) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    if (/email not confirmed/i.test(message))      return 'لم يتم تأكيد البريد الإلكتروني لهذا الحساب بعد.';
    if (/rate limit/i.test(message))               return 'محاولات كثيرة — انتظر قليلًا ثم أعد المحاولة.';
    if (/row-level security|permission denied|401|403/i.test(message))
      return 'لا تملك صلاحية تنفيذ هذا الإجراء — تأكد من إضافة معرّفك إلى جدول admin_users (راجع supabase-setup.sql).';
    if (/duplicate key/i.test(message))            return 'هذا العنصر موجود بالفعل.';
    if (/failed to fetch|network/i.test(message))  return 'تعذر الاتصال بالخادم — تحقق من اتصالك بالإنترنت.';
    return `${fallback} (${message})`;
  }

  /* ============== 3. Authentication ============== */
  let currentView = null;
  let adminChannel = null;
  let pendingDeleteId = null;

  function showView(view) {
    if (currentView === view) return;
    currentView = view;
    loginView.hidden = view !== 'login';
    dashboardView.hidden = view !== 'dashboard';
    if (view === 'dashboard') loadProjects();
    if (view === 'login') teardownRealtime();
  }

  function setButtonLoading(btn, loading) {
    btn.classList.toggle('is-loading', loading);
    btn.disabled = loading;
  }

  async function initAuth() {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      hideLoginError();
      if (!isConfigured) { showLoginError('Supabase غير مهيأ — الصق بيانات الاتصال في ملف supabase.js أولًا.'); return; }

      const email = $('loginEmail').value.trim();
      const password = $('loginPassword').value;
      if (!email || !password) { showLoginError('أدخل البريد الإلكتروني وكلمة المرور.'); return; }

      setButtonLoading(loginBtn, true);
      try {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        $('loginPassword').value = '';
        toastSuccess('تم تسجيل الدخول بنجاح', 'مرحبًا بك في لوحة إدارة نماذج الأعمال.');
      } catch (error) {
        console.error('[SJ ADV Admin] Login failed:', error);
        showLoginError(arabicError(error, 'تعذر تسجيل الدخول.'));
      } finally {
        setButtonLoading(loginBtn, false);
      }
    });

    logoutBtn.addEventListener('click', async () => {
      try {
        await sb.auth.signOut();
        toastSuccess('تم تسجيل الخروج', 'إلى اللقاء!');
      } catch (error) {
        console.error('[SJ ADV Admin] Logout failed:', error);
        toastError('حدث خطأ', arabicError(error, 'تعذر تسجيل الخروج.'));
      }
    });

    sb.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        showView('dashboard');
        if (event === 'SIGNED_IN') checkAdminAuthorization(session.user.id);
      } else {
        showView('login');
      }
    });

    try {
      const { data, error } = await sb.auth.getSession();
      if (error) throw error;
      if (data && data.session) {
        showView('dashboard');
        checkAdminAuthorization(data.session.user.id);
      } else {
        showView('login');
      }
    } catch (error) {
      console.error('[SJ ADV Admin] getSession failed:', error);
      showView('login');
    }
  }

  function showLoginError(message) {
    loginErrorMsg.textContent = message;
    loginError.hidden = false;
  }
  function hideLoginError() { loginError.hidden = true; }

  async function checkAdminAuthorization(userId) {
    authzBanner.hidden = true;
    try {
      const { data, error } = await sb
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) { console.error('[SJ ADV Admin] admin_users check failed:', error); return; }
      authzBanner.hidden = !!data;
    } catch (error) {
      console.error('[SJ ADV Admin] admin_users check crashed:', error);
    }
  }

  /* ============== 4. Image handling with Auto Compression ============== */
  let selectedFile = null;

  function initImageHandling() {
    uploadBtn.addEventListener('click', () => imageFile.click());

    imageFile.addEventListener('change', () => {
      const file = imageFile.files && imageFile.files[0];
      if (!file) return;

      const okTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!okTypes.includes(file.type)) {
        toastWarning('نوع صورة غير مدعوم', 'الصيغ المقبولة: JPG / PNG / WEBP / GIF.');
        clearImageSelection();
        return;
      }

      selectedFile = file;
      imageUrl.value = '';
      fileName.textContent = file.name;
      fileName.hidden = false;
      
      const reader = new FileReader();
      reader.onload = (e) => showPreview(e.target.result, 'جاهزة للضغط والرفع عند الحفظ', true);
      reader.onerror = () => toastError('حدث خطأ', 'تعذر قراءة الصورة من جهازك.');
      reader.readAsDataURL(file);
    });

    imageUrl.addEventListener('input', debounce(() => {
      const value = imageUrl.value.trim();
      selectedFile = null;
      imageFile.value = '';
      fileName.hidden = true;
      if (!value) { hidePreview(); clearFieldError(fieldImage); return; }
      if (!isSafeHttpUrl(value)) { showPreviewState(false); setFieldError(fieldImage, true); return; }
      setFieldError(fieldImage, false);
      showPreview(value, 'جارية المعاينة…', true);
    }, 350));

    previewRemove.addEventListener('click', clearImageSelection);
  }

  function showPreview(src, stateText, ok) {
    previewImg.src = src;
    uploadPreview.classList.add('is-visible');
    previewState.textContent = stateText || '';
    showPreviewState(ok);
  }
  function showPreviewState(ok) {
    previewState.classList.toggle('is-ok', !!ok);
    previewState.classList.toggle('is-bad', !ok);
    previewState.hidden = false;
  }
  function hidePreview() {
    previewImg.removeAttribute('src');
    uploadPreview.classList.remove('is-visible');
    previewState.textContent = '';
    uploadBox.classList.remove('has-error');
  }
  function clearImageSelection() {
    selectedFile = null;
    imageFile.value = '';
    imageUrl.value = '';
    fileName.hidden = true;
    hidePreview();
    setFieldError(fieldImage, false);
  }

  /** Compress and upload the selected file to Supabase Storage with auto-optimization. */
  async function uploadImageToStorage() {
    if (!selectedFile) return null;

    let fileToUpload = selectedFile;

    // الضغط التلقائي للصورة قبل الرفع لحماية الخادم والمساحة المجانية
    try {
      const options = {
        maxSizeMB: 0.3,          // تصغير الحجم ليصبح تحت 300 كيلوبايت كحد أقصى
        maxWidthOrHeight: 1200,  // أبعاد مثالية تناسب شاشات الويب بدقة عالية
        useWebWorker: true
      };
      fileToUpload = await imageCompression(selectedFile, options);
    } catch (compressionError) {
      console.warn('[SJ ADV Admin] Image compression skipped, using original file:', compressionError);
    }

    const safeName = fileToUpload.name ? fileToUpload.name.replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-') : 'project-image.jpg';
    const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    
    const { error } = await sb.storage
      .from(BUCKET)
      .upload(path, fileToUpload, { cacheControl: '3600', upsert: false, contentType: fileToUpload.type || selectedFile.type });
    if (error) throw error;
    
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl || null;
  }

  /* ============== 5. Form (add / edit) ============== */
  let editingId = null;
  let cachedProjects = [];

  function setFieldError(fieldEl, hasError) { fieldEl.classList.toggle('has-error', !!hasError); }
  function setEditMode(on) {
    editingId = on ? editingId : null;
    formPanelTitle.textContent = on ? 'تعديل المشروع' : 'إضافة مشروع جديد';
    submitLabel.textContent = on ? 'حفظ التعديلات' : 'إضافة المشروع';
    cancelEditBtn.hidden = !on;
  }

  function fillForm(project) {
    editingId = project.id;
    projectTitle.value = project.title || '';
    projectCategory.value = CATEGORIES.includes(project.category) ? project.category : 'أخرى';
    projectDesc.value = project.description || '';
    projectUrl.value = project.project_url || '';
    imageUrl.value = project.image_url || '';
    selectedFile = null;
    imageFile.value = '';
    fileName.hidden = true;
    if (project.image_url && isSafeHttpUrl(project.image_url)) {
      showPreview(project.image_url, 'صورة حالية', true);
    } else {
      hidePreview();
    }
    setEditMode(true);
    projectTitle.focus();
  }

  function resetForm() {
    projectForm.reset();
    clearImageSelection();
    [fieldTitle, fieldCategory, fieldImage, fieldUrl].forEach(f => setFieldError(f, false));
    setEditMode(false);
  }

  function validateForm() {
    let ok = true;
    const title = projectTitle.value.trim();
    const category = projectCategory.value;
    const imgValue = imageUrl.value.trim();
    const linkValue = projectUrl.value.trim();

    setFieldError(fieldTitle, !title); if (!title) ok = false;
    setFieldError(fieldCategory, !category); if (!category) ok = false;

    if (!selectedFile && imgValue && !isSafeHttpUrl(imgValue)) { setFieldError(fieldImage, true); ok = false; }
    else setFieldError(fieldImage, false);

    if (linkValue && !isSafeHttpUrl(linkValue)) { setFieldError(fieldUrl, true); ok = false; }
    else setFieldError(fieldUrl, false);

    if (!ok) toastWarning('بيانات ناقصة', 'يرجى تصحيح الحقول المحددة بالأحمر ثم إعادة المحاولة.');
    return ok;
  }

  function initForm() {
    initImageHandling();

    projectCategory.addEventListener('change', () => setFieldError(fieldCategory, false));
    projectTitle.addEventListener('input', () => setFieldError(fieldTitle, false));
    projectUrl.addEventListener('input', () => setFieldError(fieldUrl, false));

    cancelEditBtn.addEventListener('click', resetForm);

    projectForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!validateForm()) return;

      setButtonLoading(submitBtn, true);
      try {
        let uploadedUrl = null;
        if (selectedFile) {
          try {
            uploadedUrl = await uploadImageToStorage();
          } catch (uploadError) {
            console.error('[SJ ADV Admin] Image upload failed:', uploadError);
            toastError('فشل رفع الصورة',
              uploadError?.message?.includes('not found')
                ? `التخزين "${BUCKET}" غير موجود — نفّذ supabase-setup.sql أو أنشئ الـ Bucket يدويًا.`
                : arabicError(uploadError, 'تعذر رفع الصورة إلى التخزين.'));
            setButtonLoading(submitBtn, false);
            return;
          }
        }

        const payload = {
          title: projectTitle.value.trim(),
          category: projectCategory.value,
          description: projectDesc.value.trim() || null,
          image_url: uploadedUrl || (imageUrl.value.trim() || null),
          project_url: projectUrl.value.trim() || null
        };

        let dbError;
        if (editingId) {
          ({ error: dbError } = await sb.from('projects').update(payload).eq('id', editingId));
        } else {
          ({ error: dbError } = await sb.from('projects').insert(payload));
        }
        if (dbError) throw dbError;

        toastSuccess(
          editingId ? 'تم تعديل المشروع بنجاح' : 'تمت إضافة المشروع بنجاح',
          'ظهر التغيير مباشرة على الموقع بفضل Supabase Realtime.'
        );
        resetForm();
        await loadProjects();
      } catch (error) {
        console.error('[SJ ADV Admin] Save failed:', error);
        toastError('حدث خطأ', arabicError(error, editingId ? 'تعذر تعديل المشروع.' : 'تعذر إضافة المشروع.'));
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  /* ============== 6. Projects table ============== */
  let tableLoading = false;

  function skeletonRows(count = 4) {
    const cell = (w) => `<span class="skel" style="display:block;height:14px;width:${w}px"></span>`;
    return Array.from({ length: count }, () => `
      <tr class="skel-row">
        <td><span class="skel" style="display:block;width:74px;height:74px;border-radius:10px"></span></td>
        <td>${cell(140)}</td>
        <td>${cell(90)}</td>
        <td>${cell(200)}</td>
        <td>${cell(100)}</td>
        <td>${cell(120)}</td>
      </tr>`).join('');
  }

  function thumbCell(project) {
    if (project.image_url && isSafeHttpUrl(project.image_url)) {
      return `<div class="td-thumb"><img src="${SB.escapeAttribute(project.image_url)}" alt="${SB.escapeAttribute(project.title)}" loading="lazy"></div>`;
    }
    return `<div class="td-thumb" title="لا توجد صورة"><svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4-4-8 8"/></svg></div>`;
  }

  function renderTable(projects) {
    projectsCount.textContent = String(projects.length);

    if (!projects.length) {
      projectsTbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="table-empty">
              <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <strong>لا توجد مشاريع بعد</strong>
              أضف أول مشروع من النموذج المجاور وسيظهر مباشرة في الموقع.
            </div>
          </td>
        </tr>`;
      return;
    }

    projectsTbody.innerHTML = projects.map((p) => `
      <tr data-id="${SB.escapeAttribute(p.id)}">
        <td>${thumbCell(p)}</td>
        <td class="td-title">${escapeHtml(p.title)}</td>
        <td class="td-cat"><span class="badge">${escapeHtml(p.category)}</span></td>
        <td class="td-desc" title="${SB.escapeAttribute(p.description || '')}">${p.description ? escapeHtml(p.description) : '—'}</td>
        <td class="td-date">${escapeHtml(formatDate(new Date().toISOString()))}</td>
        <td class="td-actions">
          <button type="button" class="btn-admin btn-admin--ghost btn-admin--sm" data-action="edit" data-id="${SB.escapeAttribute(p.id)}">
            <svg class="icon" viewBox="0 0 24 24"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            تعديل
          </button>
          <button type="button" class="btn-admin btn-admin--danger-ghost btn-admin--sm" data-action="delete" data-id="${SB.escapeAttribute(p.id)}">
            <svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            حذف
          </button>
        </td>
      </tr>`).join('');
  }

  async function loadProjects() {
    if (tableLoading || !isConfigured) return;
    tableLoading = true;
    projectsTbody.innerHTML = skeletonRows();
    try {
      const { data, error } = await sb
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      cachedProjects = data || [];
      renderTable(cachedProjects);
    } catch (error) {
      console.error('[SJ ADV Admin] Loading projects failed:', error);
      cachedProjects = [];
      projectsTbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="table-empty">
              <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
              <strong>تعذر تحميل المشاريع</strong>
              ${escapeHtml(arabicError(error, 'راجع إعدادات supabase.js أو نفّذ supabase-setup.sql ثم أعد المحاولة.'))}
            </div>
          </td>
        </tr>`;
    } finally {
      tableLoading = false;
    }
  }

  function initTableActions() {
    projectsTbody.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      
      const project = cachedProjects.find(p => String(p.id) === String(id));
      if (!project) return;

      if (btn.dataset.action === 'edit') {
        fillForm(project);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (btn.dataset.action === 'delete') {
        openDeleteConfirm(project);
      }
    });

    projectsTbody.addEventListener('error', (event) => {
      const img = event.target;
      if (img.tagName !== 'IMG') return;
      const holder = img.parentElement;
      if (holder && holder.classList.contains('td-thumb')) {
        holder.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4-4-8 8"/></svg>`;
      }
    }, true);
  }

  /* ============== 7. Delete confirmation modal ============== */
  function openDeleteConfirm(project) {
    pendingDeleteId = project.id;
    confirmName.textContent = project.title || 'بدون عنوان';
    confirmModal.hidden = false;
    confirmDelete.focus();
  }
  function closeDeleteConfirm() {
    pendingDeleteId = null;
    confirmModal.hidden = true;
  }

  function initDeleteModal() {
    confirmDelete.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      const id = pendingDeleteId;
      setButtonLoading(confirmDelete, true);
      try {
        const { error } = await sb.from('projects').delete().eq('id', id);
        if (error) throw error;
        toastSuccess('تم حذف المشروع بنجاح', 'اختفي المشروع من الموقع مباشرة.');
        closeDeleteConfirm();
        await loadProjects();
      } catch (error) {
        console.error('[SJ ADV Admin] Delete failed:', error);
        toastError('حدث خطأ', arabicError(error, 'تعذر حذف المشروع.'));
      } finally {
        setButtonLoading(confirmDelete, false);
      }
    });

    cancelDelete.addEventListener('click', closeDeleteConfirm);
    confirmModal.addEventListener('click', (event) => {
      if (event.target === confirmModal) closeDeleteConfirm();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !confirmModal.hidden) closeDeleteConfirm();
    });
  }

  /* ============== 8. Realtime (live table refresh) ============== */
  function initRealtime() {
    if (!isConfigured) return;
    adminChannel = sb
      .channel('projects-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        loadProjects();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') console.info('[SJ ADV Admin] Realtime connected.');
      });
  }

  function teardownRealtime() {
    if (adminChannel && isConfigured) {
      sb.removeChannel(adminChannel);
      adminChannel = null;
    }
  }

  /* ============== 9. Init ============== */
  function debounce(fn, wait) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  function init() {
    if (!isConfigured) {
      loginView.hidden = false;
      configError.hidden = false;
      loginBtn.disabled = true;
      return;
    }
    setButtonLoading(loginBtn, false);
    initAuth();
    initForm();
    initTableActions();
    initDeleteModal();
    initRealtime();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
