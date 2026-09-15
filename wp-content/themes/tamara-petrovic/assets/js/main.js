(function () {
	'use strict';

	const header = document.getElementById('site-header');
	const navToggle = document.getElementById('nav-toggle');
	const siteNav = document.getElementById('site-nav');

	// Sticky header
	if (header) {
		window.addEventListener('scroll', function () {
			header.classList.toggle('scrolled', window.scrollY > 20);
		});
	}

	// Mobile nav
	if (navToggle && siteNav) {
		navToggle.addEventListener('click', function () {
			const isOpen = siteNav.classList.toggle('open');
			navToggle.setAttribute('aria-expanded', isOpen);
		});

		siteNav.querySelectorAll('a').forEach(function (link) {
			link.addEventListener('click', function () {
				siteNav.classList.remove('open');
				navToggle.setAttribute('aria-expanded', 'false');
			});
		});
	}

	// FAQ accordion
	document.querySelectorAll('.faq-question').forEach(function (btn) {
		btn.addEventListener('click', function () {
			const item = btn.closest('.faq-item');
			const answer = item.querySelector('.faq-answer');
			const isOpen = item.classList.contains('open');

			document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
				openItem.classList.remove('open');
				openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
				openItem.querySelector('.faq-answer').hidden = true;
			});

			if (!isOpen) {
				item.classList.add('open');
				btn.setAttribute('aria-expanded', 'true');
				answer.hidden = false;
			}
		});
	});

	// Testimonials slider
	const slider = document.getElementById('testimonials-slider');
	if (slider) {
		const cards = slider.querySelectorAll('.testimonial-card');
		const dotsContainer = slider.querySelector('.testimonials-dots');
		let current = 0;

		cards.forEach(function (_, i) {
			const dot = document.createElement('button');
			dot.setAttribute('aria-label', 'Utisak ' + (i + 1));
			if (i === 0) dot.classList.add('active');
			dot.addEventListener('click', function () { goTo(i); });
			dotsContainer.appendChild(dot);
		});

		const dots = dotsContainer.querySelectorAll('button');

		function goTo(index) {
			cards[current].classList.remove('active');
			dots[current].classList.remove('active');
			current = index;
			cards[current].classList.add('active');
			dots[current].classList.add('active');
		}

		slider.querySelector('.testimonial-prev').addEventListener('click', function () {
			goTo((current - 1 + cards.length) % cards.length);
		});

		slider.querySelector('.testimonial-next').addEventListener('click', function () {
			goTo((current + 1) % cards.length);
		});
	}

	// About photo lightbox
	const photoGrid = document.getElementById('about-photo-grid');
	const lightbox = document.getElementById('about-lightbox');
	if (photoGrid && lightbox) {
		const thumbs = Array.from(photoGrid.querySelectorAll('.about-photo-thumb'));
		const lightboxImg = document.getElementById('lightbox-image');
		let current = 0;

		function openLightbox(index) {
			current = index;
			const thumb = thumbs[current];
			lightboxImg.src = thumb.dataset.full;
			lightboxImg.alt = thumb.dataset.alt || '';
			lightbox.hidden = false;
			lightbox.setAttribute('aria-hidden', 'false');
			document.body.style.overflow = 'hidden';
		}

		function closeLightbox() {
			lightbox.hidden = true;
			lightbox.setAttribute('aria-hidden', 'true');
			lightboxImg.src = '';
			document.body.style.overflow = '';
		}

		function goTo(index) {
			openLightbox((index + thumbs.length) % thumbs.length);
		}

		thumbs.forEach(function (thumb, index) {
			thumb.addEventListener('click', function () {
				openLightbox(index);
			});
		});

		lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
		lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
			goTo(current - 1);
		});
		lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
			goTo(current + 1);
		});

		lightbox.addEventListener('click', function (e) {
			if (e.target === lightbox) {
				closeLightbox();
			}
		});

		document.addEventListener('keydown', function (e) {
			if (lightbox.hidden) return;
			if (e.key === 'Escape') closeLightbox();
			if (e.key === 'ArrowLeft') goTo(current - 1);
			if (e.key === 'ArrowRight') goTo(current + 1);
		});
	}

	// Self-assessment quiz
	const quiz = document.getElementById('self-assessment-quiz');
	if (quiz) {
		const steps = quiz.querySelectorAll('.quiz-step');
		const progressBar = document.getElementById('quiz-progress-bar');
		const resultEl = document.getElementById('quiz-result');
		const resultTitle = document.getElementById('quiz-result-title');
		const resultText = document.getElementById('quiz-result-text');
		const restartBtn = document.getElementById('quiz-restart');
		let currentStep = 0;
		let score = 0;
		const totalSteps = steps.length;

		function updateProgress() {
			if (progressBar) {
				progressBar.style.width = ((currentStep / totalSteps) * 100) + '%';
			}
		}

		function showStep(index) {
			steps.forEach(function (step, i) {
				step.classList.toggle('active', i === index);
			});
			updateProgress();
		}

		quiz.querySelectorAll('.quiz-options button').forEach(function (btn) {
			btn.addEventListener('click', function () {
				score += parseInt(btn.dataset.value, 10);
				currentStep++;

				if (currentStep < totalSteps) {
					showStep(currentStep);
				} else {
					showResult();
				}
			});
		});

		function showResult() {
			steps.forEach(function (step) { step.classList.remove('active'); });
			if (progressBar) progressBar.style.width = '100%';
			resultEl.hidden = false;

			if (score <= 4) {
				resultTitle.textContent = 'Verovatno vam dobro ide';
				resultText.textContent = 'Vaši odgovori ukazuju da trenutno nemate hitnu potrebu za terapijom. Ipak, ako želite dublji uvid u sebe, razgovor je uvek dobrodošao.';
			} else if (score <= 8) {
				resultTitle.textContent = 'Možda je vreme za razgovor';
				resultText.textContent = 'Prepoznajete neke obrasce koji bi mogli da se istraže u terapiji. Prvi besplatan razgovor može vam pomoći da odlučite da li vam psihoanaliza odgovara.';
			} else if (score <= 12) {
				resultTitle.textContent = 'Terapija bi vam mogla pomoći';
				resultText.textContent = 'Vaši odgovori sugerišu da nosite značajan emocionalni teret. Psihoanaliza može biti prostor u kom to istražite — bez žurbe i bez osuđivanja.';
			} else {
				resultTitle.textContent = 'Preporučujem da nas kontaktirate';
				resultText.textContent = 'Vaši odgovori ukazuju na značajan unutrašnji pritisak. Razgovor sa terapeutom može biti važan prvi korak. Tu sam za vas.';
			}
		}

		if (restartBtn) {
			restartBtn.addEventListener('click', function () {
				currentStep = 0;
				score = 0;
				resultEl.hidden = true;
				showStep(0);
			});
		}

		updateProgress();
	}

	// Form submission
	function handleForm(form) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();

			const feedback = form.querySelector('.form-feedback');
			const submitBtn = form.querySelector('[type="submit"]');
			const formData = new FormData(form);

			formData.append('action', 'tamara_contact');
			formData.append('nonce', tamaraData.nonce);

			submitBtn.disabled = true;
			feedback.textContent = '';
			feedback.className = 'form-feedback';

			fetch(tamaraData.ajaxUrl, {
				method: 'POST',
				body: formData,
			})
				.then(function (res) { return res.json(); })
				.then(function (data) {
					if (data.success) {
						const isBooking = form.id === 'booking-form';
						feedback.textContent = isBooking
							? tamaraData.strings.bookingSuccess
							: tamaraData.strings.formSuccess;
						feedback.classList.add('success');
						form.reset();
					} else {
						feedback.textContent = data.data?.message || tamaraData.strings.formError;
						feedback.classList.add('error');
					}
				})
				.catch(function () {
					feedback.textContent = tamaraData.strings.formError;
					feedback.classList.add('error');
				})
				.finally(function () {
					submitBtn.disabled = false;
				});
		});
	}

	const contactForm = document.getElementById('contact-form');
	const bookingForm = document.getElementById('booking-form');

	if (contactForm) handleForm(contactForm);
	if (bookingForm) handleForm(bookingForm);

	// Therapy services — expand extra cards
	const therapyToggle = document.getElementById('therapy-more-toggle');
	const therapyPanel = document.getElementById('therapy-more-panel');

	if (therapyToggle && therapyPanel) {
		const showLabel = therapyToggle.querySelector('.therapy-more-label-show');
		const hideLabel = therapyToggle.querySelector('.therapy-more-label-hide');

		therapyToggle.addEventListener('click', function () {
			const isOpen = therapyToggle.getAttribute('aria-expanded') === 'true';
			therapyToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
			therapyPanel.hidden = isOpen;

			if (showLabel && hideLabel) {
				showLabel.hidden = !isOpen;
				hideLabel.hidden = isOpen;
			}
		});
	}

	// Smooth scroll offset for fixed header
	document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
		anchor.addEventListener('click', function (e) {
			const targetId = this.getAttribute('href');
			if (targetId === '#') return;

			const target = document.querySelector(targetId);
			if (!target) return;

			e.preventDefault();
			const headerHeight = header ? header.offsetHeight : 0;
			const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

			window.scrollTo({ top: top, behavior: 'smooth' });
		});
	});
})();
