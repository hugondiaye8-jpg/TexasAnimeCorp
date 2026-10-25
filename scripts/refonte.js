
(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-primary-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? 'Fermer' : 'Menu';
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      }
    });
    // Close the mobile navigation with Escape or an outside click.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
        toggle.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (nav.classList.contains('is-open') && !nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      }
    });
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(function (video) {
      video.pause();
      video.removeAttribute('autoplay');
      video.setAttribute('controls', '');
    });
  }
})();

/* Send the Studio forms to TAC's Gmail through FormSubmit's AJAX endpoint.
   Native HTML POST action remains a functioning fallback without JavaScript.
   Only report success when the service explicitly confirms success; a 200
   HTTP response alone may also mean that the form needs activation. */
(function () {
  document.querySelectorAll('form[data-tac-contact]').forEach(function (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var button = form.querySelector('[type="submit"]');
      var feedback = form.querySelector('.form-feedback');
      var originalLabel = button.textContent;
      feedback.textContent = 'Envoi en cours…';
      feedback.dataset.state = 'pending';
      button.disabled = true;
      button.textContent = 'Envoi…';
      try {
        var endpoint = form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
        var response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        var result = await response.json();
        var confirmed = response.ok && (result.success === true || result.success === 'true');
        if (!confirmed) {
          var details = typeof result.message === 'string' ? result.message : '';
          if (/activat/i.test(details)) {
            throw new Error('Le formulaire nécessite encore une activation depuis la boîte Gmail de TAC.');
          }
          throw new Error('Le service n’a pas confirmé la réception. Merci de réessayer plus tard.');
        }
        feedback.textContent = 'Votre message a bien été transmis. Merci pour votre proposition !';
        feedback.dataset.state = 'success';
        form.reset();
      } catch (error) {
        feedback.dataset.state = 'error';
        feedback.textContent = (error && error.message) || 'L’envoi a échoué. Merci de réessayer plus tard.';
      } finally {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    });
  });
})();
