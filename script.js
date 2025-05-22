// Mobile navigation toggles functionality and interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // Function to toggle the navigation menu's visibility
    function toggleMenu() {
        // Toggle active class on navigation
        mainNav.classList.toggle('active');

        // Toggle active class on the menu button for animation
        menuToggle.classList.toggle('active');

        // Update aria-expanded attribute for accessibility
        const isExpanded = menuToggle.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);

        // Prevent scrolling when a menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    }

    if (menuToggle && mainNav) {
        // Add click event listener to menu toggle button
        menuToggle.addEventListener('click', toggleMenu);

        // Implement smooth scrolling for navigation links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Get the target section id from the href attribute
                const targetId = this.getAttribute('href');

                // Only apply smooth scrolling for links to sections within the page
                if (targetId.startsWith('#')) {
                    e.preventDefault();

                    // Get the target element
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        // Close the mobile menu if it's open
                        if (mainNav.classList.contains('active')) {
                            toggleMenu();
                        }

                        // Scroll smoothly to the target section
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Project filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Function to filter projects by category
    function filterProjects(category) {
        // Update the active state of filter buttons
        filterButtons.forEach(button => {
            if (button.dataset.category === category) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });

        // Show/hide projects based on category
        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                // Add a small delay before showing to enable transition
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.style.opacity = '0';
                // Add a small delay before hiding to enable transition
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Add click event listeners to filter buttons
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                filterProjects(category);
            });
        });
    }

    // Lightbox functionality for project images
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const projectImages = document.querySelectorAll('.project-image');

    let currentImageIndex = 0;
    const visibleImages = [];

    // Function to open the lightbox
    function openLightbox(image, index) {
        // Update a visible images array based on currently displayed projects
        updateVisibleImages();

        // Set current image index
        currentImageIndex = visibleImages.indexOf(image);

        // Set image source and alt text
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        // Set the title from the project's h3
        lightboxTitle.textContent = image.closest('figure').querySelector('h3').textContent;

        // Show the modal
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');

        // Prevent scrolling of the background
        document.body.style.overflow = 'hidden';

        // Focus on the close button for accessibility
        lightboxClose.focus();
    }

    // Function to close the lightbox
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Function to navigate to the previous image
    function showPreviousImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
        } else {
            currentImageIndex = visibleImages.length - 1;
        }
        updateLightboxImage();
    }

    // Function to navigate to the next image
    function showNextImage() {
        if (currentImageIndex < visibleImages.length - 1) {
            currentImageIndex++;
        } else {
            currentImageIndex = 0;
        }
        updateLightboxImage();
    }

    // Function to update the lightbox image and title
    function updateLightboxImage() {
        const image = visibleImages[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;


        lightboxTitle.textContent = image.closest('figure').querySelector('h3').textContent;
    }

    // Function to update the array of visible images
    function updateVisibleImages() {
        visibleImages.length = 0; // Clear the array
        projectCards.forEach(card => {
            if (card.style.display !== 'none') {
                const image = card.querySelector('.project-image');
                if (image) {
                    visibleImages.push(image);
                }
            }
        });
    }

    // Add click event listeners to project images
    if (projectImages.length > 0 && lightboxModal) {
        projectImages.forEach((image, index) => {
            image.addEventListener('click', function() {
                openLightbox(this, index);
            });

            // Make images focusable for accessibility
            image.setAttribute('tabindex', '0');

            // Add keyboard support for opening lightbox
            image.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(this, index);
                }
            });
        });

        // Add event listeners for lightbox controls
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPreviousImage);
        lightboxNext.addEventListener('click', showNextImage);

        // Add keyboard navigation for the lightbox
        lightboxModal.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });

        // Close the lightbox when clicking outside the content
        lightboxModal.addEventListener('click', function(e) {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Contact form validation and feedback
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    // Input elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Error message elements
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    // Validation functions
    function validateName() {
        if (nameInput.value.trim() === '') {
            nameInput.classList.add('invalid');
            nameInput.classList.remove('valid');
            nameError.textContent = 'Please enter your name';
            nameError.classList.add('visible');
            return false;
        } else {
            nameInput.classList.remove('invalid');
            nameInput.classList.add('valid');
            nameError.textContent = '';
            nameError.classList.remove('visible');
            return true;
        }
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            emailInput.classList.add('invalid');
            emailInput.classList.remove('valid');
            emailError.textContent = 'Please enter your email address';
            emailError.classList.add('visible');
            return false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add('invalid');
            emailInput.classList.remove('valid');
            emailError.textContent = 'Please enter a valid email address';
            emailError.classList.add('visible');
            return false;
        } else {
            emailInput.classList.remove('invalid');
            emailInput.classList.add('valid');
            emailError.textContent = '';
            emailError.classList.remove('visible');
            return true;
        }
    }

    function validateSubject() {
        // Subject is optional, but if provided, should not be too short
        if (subjectInput.value.trim() !== '' && subjectInput.value.trim().length < 3) {
            subjectInput.classList.add('invalid');
            subjectInput.classList.remove('valid');
            subjectError.textContent = 'Subject should be at least 3 characters';
            subjectError.classList.add('visible');
            return false;
        } else {
            if (subjectInput.value.trim() !== '') {
                subjectInput.classList.add('valid');
            } else {
                subjectInput.classList.remove('valid');
            }
            subjectInput.classList.remove('invalid');
            subjectError.textContent = '';
            subjectError.classList.remove('visible');
            return true;
        }
    }

    function validateMessage() {
        if (messageInput.value.trim() === '') {
            messageInput.classList.add('invalid');
            messageInput.classList.remove('valid');
            messageError.textContent = 'Please enter your message';
            messageError.classList.add('visible');
            return false;
        } else if (messageInput.value.trim().length < 10) {
            messageInput.classList.add('invalid');
            messageInput.classList.remove('valid');
            messageError.textContent = 'Message should be at least 10 characters';
            messageError.classList.add('visible');
            return false;
        } else {
            messageInput.classList.remove('invalid');
            messageInput.classList.add('valid');
            messageError.textContent = '';
            messageError.classList.remove('visible');
            return true;
        }
    }

    // Function to validate the entire form
    function validateForm() {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        return isNameValid && isEmailValid && isSubjectValid && isMessageValid;
    }

    // Add event listeners for real-time validation
    if (contactForm) {
        // Input event listeners for real-time feedback
        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', validateEmail);
        subjectInput.addEventListener('input', validateSubject);
        messageInput.addEventListener('input', validateMessage);

        // Blur event listeners for validation when focus leaves the field
        nameInput.addEventListener('blur', validateName);
        emailInput.addEventListener('blur', validateEmail);
        subjectInput.addEventListener('blur', validateSubject);
        messageInput.addEventListener('blur', validateMessage);

        // Form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear any previous form feedback
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            // Validate all fields
            if (validateForm()) {
                // Simulate form submission (in a real app, you would send data to a server)
                formFeedback.textContent = 'Thank you for your message! I will get back to you soon.';
                formFeedback.className = 'form-feedback success';

                // Reset the form after successful submission
                contactForm.reset();

                // Remove validation classes
                nameInput.classList.remove('valid');
                emailInput.classList.remove('valid');
                subjectInput.classList.remove('valid');
                messageInput.classList.remove('valid');

                // Scroll to the feedback message
                formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Show an error message if validation fails
                formFeedback.textContent = 'Please correct the errors in the form before submitting.';
                formFeedback.className = 'form-feedback error';

                // Focus on the first invalid field
                if (!validateName()) {
                    nameInput.focus();
                } else if (!validateEmail()) {
                    emailInput.focus();
                } else if (!validateSubject()) {
                    subjectInput.focus();
                } else if (!validateMessage()) {
                    messageInput.focus();
                }
            }
        });
    }
});
