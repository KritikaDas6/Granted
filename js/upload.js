(function (global) {
  'use strict';

  const STORAGE_KEY = 'granted_uploads';
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPT = '.pdf,application/pdf';

  var uploadState = {
    resume: null,
    publications: []
  };

  function getStoredUploads() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function setStoredUploads() {
    try {
      var data = {
        resume: uploadState.resume ? {
          name: uploadState.resume.name,
          size: uploadState.resume.size,
          status: uploadState.resume.status
        } : null,
        publications: uploadState.publications.map(function (p) {
          return { name: p.name, size: p.size, status: p.status };
        })
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function validateFile(file) {
    if (!file) return false;
    if (file.type !== 'application/pdf') return false;
    if (file.size > MAX_SIZE) return false;
    return true;
  }

  function formatFileSize(bytes) {
    return global.Granted && global.Granted.utils
      ? global.Granted.utils.formatFileSize(bytes)
      : (bytes / 1024).toFixed(1) + ' KB';
  }

  function renderFilePreview(container, doc, onRemove) {
    if (!container) return;
    container.innerHTML = '';
    if (!doc) return;
    var row = document.createElement('div');
    row.className = 'file-preview-row';
    row.innerHTML =
      '<div class="file-info">' +
      '<span>📄 ' + (doc.name || 'file.pdf') + '</span>' +
      '<span>' + formatFileSize(doc.size) + '</span>' +
      '<span class="file-status">' + (doc.status === 'uploaded' ? '✓ Uploaded' : '…') + '</span>' +
      '</div>' +
      '<button type="button" class="file-remove" aria-label="Remove">Remove</button>';
    var removeBtn = row.querySelector('.file-remove');
    if (removeBtn && onRemove) removeBtn.addEventListener('click', onRemove);
    container.appendChild(row);
  }

  function handleFileSelect(file, type) {
    if (!validateFile(file)) {
      if (global.Granted && global.Granted.utils) {
        global.Granted.utils.showToast('Only PDF files under 10MB are accepted.', 'error');
      }
      var dropzone = type === 'resume' ? document.getElementById('resume-dropzone') : document.getElementById('pub-dropzone');
      if (dropzone) dropzone.classList.add('dropzone-error');
      setTimeout(function () {
        if (dropzone) dropzone.classList.remove('dropzone-error');
      }, 2000);
      return;
    }

    var doc = {
      id: (global.Granted && global.Granted.utils ? global.Granted.utils.genId() : 'd' + Date.now()),
      type: type,
      name: file.name,
      size: file.size,
      status: 'uploading',
      data: null
    };

    if (type === 'resume') {
      uploadState.resume = doc;
    } else {
      uploadState.publications.push(doc);
    }

    renderUploadSection();

    setTimeout(function () {
      doc.status = 'uploaded';
      doc.data = 'mock_stored';
      setStoredUploads();
      renderUploadSection();
    }, 500);
  }

  function renderUploadSection() {
    var resumeDropzone = document.getElementById('resume-dropzone');
    var resumePreview = document.getElementById('resume-preview');
    var pubDropzone = document.getElementById('pub-dropzone');
    var pubPreviews = document.getElementById('pub-previews');

    if (uploadState.resume) {
      if (resumeDropzone) resumeDropzone.classList.add('dropzone-secondary');
      if (resumeDropzone) resumeDropzone.style.display = 'none';
      if (resumePreview) {
        resumePreview.classList.remove('file-preview-hidden');
        renderFilePreview(resumePreview, uploadState.resume, function () {
          uploadState.resume = null;
          setStoredUploads();
          renderUploadSection();
        });
      }
    } else {
      if (resumeDropzone) {
        resumeDropzone.classList.remove('dropzone-secondary');
        resumeDropzone.style.display = '';
      }
      if (resumePreview) {
        resumePreview.classList.add('file-preview-hidden');
        resumePreview.innerHTML = '';
      }
    }

    if (pubPreviews) {
      pubPreviews.innerHTML = '';
      uploadState.publications.forEach(function (doc, idx) {
        var wrap = document.createElement('div');
        wrap.className = 'file-preview-row';
        wrap.style.marginBottom = '0.5rem';
        wrap.innerHTML =
          '<div class="file-info">' +
          '<span>📄 ' + (doc.name || 'file.pdf') + '</span>' +
          '<span>' + formatFileSize(doc.size) + '</span>' +
          '<span class="file-status">' + (doc.status === 'uploaded' ? '✓' : '…') + '</span>' +
          '</div>' +
          '<button type="button" class="file-remove" aria-label="Remove">Remove</button>';
        var removeBtn = wrap.querySelector('.file-remove');
        removeBtn.addEventListener('click', function () {
          uploadState.publications.splice(idx, 1);
          setStoredUploads();
          renderUploadSection();
        });
        pubPreviews.appendChild(wrap);
      });
    }
  }

  function setupDropzone(dropzoneId, inputId, type) {
    var dropzone = document.getElementById(dropzoneId);
    var input = document.getElementById(inputId);
    if (!dropzone || !input) return;

    function handleFiles(files) {
      if (!files || !files.length) return;
      var file = files[0];
      handleFileSelect(file, type);
    }

    dropzone.addEventListener('click', function () {
      input.click();
    });
    dropzone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });
    dropzone.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
      handleFiles(e.dataTransfer && e.dataTransfer.files);
    });
    input.addEventListener('change', function () {
      handleFiles(input.files);
      input.value = '';
    });
  }

  function initUpload() {
    setupDropzone('resume-dropzone', 'resume-input', 'resume');
    setupDropzone('pub-dropzone', 'pub-input', 'publication');

    var backBtn = document.getElementById('upload-back');
    var form = document.getElementById('upload-form');
    var submitBtn = document.getElementById('upload-submit');

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (global.Granted && global.Granted.app) global.Granted.app.goTo('profile');
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!uploadState.resume || uploadState.resume.status !== 'uploaded') {
          if (global.Granted && global.Granted.utils) {
            global.Granted.utils.showToast('Please upload your resume (PDF).', 'error');
          }
          return;
        }

        if (submitBtn) {
          var btnText = submitBtn.querySelector('.btn-text');
          var btnSpinner = submitBtn.querySelector('.btn-spinner');
          submitBtn.disabled = true;
          if (btnText) btnText.hidden = true;
          if (btnSpinner) btnSpinner.hidden = false;
        }

        setStoredUploads();

        setTimeout(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            var bt = submitBtn.querySelector('.btn-text');
            var bs = submitBtn.querySelector('.btn-spinner');
            if (bt) bt.hidden = false;
            if (bs) bs.hidden = true;
          }
          if (global.Granted && global.Granted.app) global.Granted.app.goTo('matches');
        }, 800);
      });
    }

    var stored = getStoredUploads();
    if (stored && stored.resume) {
      uploadState.resume = Object.assign({}, stored.resume, { data: 'mock_stored' });
    }
    if (stored && stored.publications && Array.isArray(stored.publications)) {
      uploadState.publications = stored.publications.map(function (p) {
        return Object.assign({}, p, { data: 'mock_stored' });
      });
    }
    renderUploadSection();
  }

  global.Granted = global.Granted || {};
  global.Granted.upload = {
    init: initUpload,
    getState: function () { return uploadState; }
  };
})(typeof window !== 'undefined' ? window : this);
