/* ==========================================================================
   YARI MODULAR — Multipage Interactive Script & Controls
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header Scroll Controller ---
  const header = document.getElementById('siteHeader');
  
  const handleScroll = () => {
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // --- Active Page Navigation Link Highlight ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- Mobile Drawer Menu Toggle ---
  const mobileTrigger = document.getElementById('mobileMenuTrigger');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    if (!mobileNavDrawer || !mobileTrigger) return;
    const isOpen = mobileNavDrawer.classList.toggle('is-open');
    mobileTrigger.classList.toggle('is-active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', toggleMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
      if (!mobileNavDrawer.contains(e.target) && !mobileTrigger.contains(e.target)) {
        toggleMobileMenu();
      }
    }
  });

  // --- Portfolio Filtering (projects.html & index.html) ---
  const filterBtns = document.querySelectorAll('.filter-btn, .portfolio-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Project Lightbox Modal ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');

  if (projectCards.length > 0 && lightboxModal) {
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent lightbox if clicking direct link button
        if (e.target.tagName === 'A' || e.target.closest('a')) return;

        const img = card.querySelector('img');
        const title = card.querySelector('.project-name, h3, .project-title');
        const category = card.querySelector('.project-category, .subtitle-badge');

        if (img && lightboxImg) lightboxImg.src = img.src;
        if (title && lightboxTitle) lightboxTitle.innerText = title.innerText;
        if (category && lightboxCategory) lightboxCategory.innerText = category.innerText;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // --- Auto-Select Project Type from URL query params on contact.html ---
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service') || urlParams.get('kitchen') || urlParams.get('furniture');
  const projectTypeSelect = document.getElementById('projectType');

  if (serviceParam && projectTypeSelect) {
    const paramLower = serviceParam.toLowerCase();
    for (let option of projectTypeSelect.options) {
      if (option.value.toLowerCase().includes(paramLower) || paramLower.includes(option.value.toLowerCase().split(' ')[0])) {
        option.selected = true;
        break;
      }
    }
  }

  // --- ENQUIRY FORM → WHATSAPP DYNAMIC REDIRECT ---
  const enquiryForm = document.getElementById('enquiryForm');
  const toastNotification = document.getElementById('toastNotification');

  const showToast = (message, isError = false) => {
    if (!toastNotification) return;
    toastNotification.innerText = message;
    if (isError) {
      toastNotification.style.backgroundColor = '#2C1814';
      toastNotification.style.borderColor = '#E57373';
      toastNotification.style.color = '#FFD2D2';
    } else {
      toastNotification.style.backgroundColor = '#1C1917';
      toastNotification.style.borderColor = '#C5A059';
      toastNotification.style.color = '#FFFFFF';
    }
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 4500);
  };

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('fullName');
      const phoneInput = document.getElementById('phoneNumber');
      const emailInput = document.getElementById('emailAddress');
      const projectTypeInput = document.getElementById('projectType');
      const messageInput = document.getElementById('projectMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const projectType = projectTypeInput ? projectTypeInput.value : '';
      const message = messageInput && messageInput.value.trim() !== '' ? messageInput.value.trim() : 'I would like to consult on my space requirements.';

      // Validation
      if (!name) {
        showToast('⚠️ Please enter your Name.', true);
        if (nameInput) nameInput.focus();
        return;
      }
      if (!phone) {
        showToast('⚠️ Please enter your Phone Number.', true);
        if (phoneInput) phoneInput.focus();
        return;
      }
      if (!email) {
        showToast('⚠️ Please enter your Email Address.', true);
        if (emailInput) emailInput.focus();
        return;
      }
      if (!projectType) {
        showToast('⚠️ Please select a Project Type.', true);
        if (projectTypeInput) projectTypeInput.focus();
        return;
      }

      // Format WhatsApp Message exactly as specified
      const whatsappText = `Hello YARI MODULAR,\n\nI would like to discuss an interior design project.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nProject Type: ${projectType}\nMessage: ${message}\n\nPlease get in touch with me.`;

      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/918971521619?text=${encodedText}`;

      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Enquiry';

      if (submitBtn) {
        submitBtn.innerHTML = 'Opening WhatsApp...';
        submitBtn.disabled = true;
      }

      showToast('✓ Opening WhatsApp with your enquiry details...');

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }

  // --- Intersection Observer Scroll Animations ---
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .project-card, .why-card, .process-step, .service-detail-item, .editorial-card, .kitchen-layout-card').forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });

  // --- FIRST VISIT POPUP LOGIC ---
  const firstVisitPopup = document.getElementById('firstVisitPopup');
  const popupEnquiryForm = document.getElementById('popupEnquiryForm');
  const popupFormView = document.getElementById('popupFormView');
  const popupThankYouView = document.getElementById('popupThankYouView');
  const popupState = document.getElementById('popupState');
  const popupCity = document.getElementById('popupCity');

  // India State -> City Data
  const stateCityData = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
    "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Ara", "Begusarai", "Katihar", "Bihar Sharif"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Bharuch"],
    "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Rohtak", "Hisar", "Karnal"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Mandi", "Solan", "Kullu"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davangere", "Ballari", "Tumakuru"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Kolhapur", "Solapur", "Amravati", "Navi Mumbai"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
    "Meghalaya": ["Shillong", "Tura", "Jowai"],
    "Mizoram": ["Aizawl", "Lunglei", "Saiha"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar"],
    "Sikkim": ["Gangtok", "Namchi", "Pelling"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam"],
    "Tripura": ["Agartala", "Dharmanagar", "Udaipur"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Noida"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Rishikesh"],
    "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Kharagpur"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
    "Chandigarh": ["Chandigarh"],
    "Puducherry": ["Pondicherry", "Ozhukarai"]
  };

  if (firstVisitPopup && popupEnquiryForm) {
    const hasSeenPopup = sessionStorage.getItem('yariPopupShown');
    
    // Show popup if not seen in this session
    if (hasSeenPopup !== 'true') {
      setTimeout(() => {
        firstVisitPopup.classList.add('active');
        sessionStorage.setItem('yariPopupShown', 'true');
      }, 1500);
    }

    // Populate States
    if (popupState) {
      Object.keys(stateCityData).sort().forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        popupState.appendChild(option);
      });

      // Handle State Change
      popupState.addEventListener('change', (e) => {
        const selectedState = e.target.value;
        popupCity.innerHTML = '<option value="" disabled selected>Select City</option>';
        
        if (selectedState && stateCityData[selectedState]) {
          popupCity.disabled = false;
          stateCityData[selectedState].sort().forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            popupCity.appendChild(option);
          });
        } else {
          popupCity.innerHTML = '<option value="" disabled selected>Select State First</option>';
          popupCity.disabled = true;
        }
      });
    }

    const closePopupFn = () => {
      firstVisitPopup.classList.remove('active');
    };

    // Note: Popup closing by clicking outside or pressing close button is removed. It's mandatory.

    popupEnquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('popupFullName');
      const phoneInput = document.getElementById('popupPhoneNumber');
      const stateInput = document.getElementById('popupState');
      const cityInput = document.getElementById('popupCity');

      // Validation
      if (!nameInput.value.trim()) {
        showToast('⚠️ Please enter your name.', true);
        return;
      }
      if (!phoneInput.value.trim()) {
        showToast('⚠️ Please enter your mobile number.', true);
        return;
      }
      if (!stateInput.value) {
        showToast('⚠️ Please select your state.', true);
        return;
      }
      if (!cityInput.value) {
        showToast('⚠️ Please select your city.', true);
        return;
      }

      const submitBtn = popupEnquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Opening WhatsApp...';
      submitBtn.disabled = true;

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const state = stateInput.value;
      const city = cityInput.value;

      const whatsappText = `Hello YARI MODULAR,\n\nI have a new enquiry from your website.\n\nName: ${name}\nMobile Number: ${phone}\nState: ${state}\nCity: ${city}\n\nI would like to discuss my interior design project.\n\nPlease get in touch with me.`;
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/918971521619?text=${encodedText}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Show Thank You state
      popupFormView.style.display = 'none';
      popupThankYouView.style.display = 'block';

      // Close after 1.5 - 2 seconds
      setTimeout(() => {
        closePopupFn();
        // Reset form for next time (though session prevents reshowing)
        setTimeout(() => {
          popupFormView.style.display = 'block';
          popupThankYouView.style.display = 'none';
          popupEnquiryForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 500);
      }, 1800);
    });
  }

});
