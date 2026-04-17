// --- Theme Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggleBtn.querySelector('i');

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// --- Mobile Navigation ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile nav when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// --- Update Copyright Year ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Scroll Animations ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles and observe
document.querySelectorAll('.card, .section-header, .skill-category, .service-card, .project-card, .contact-big-action').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// --- Voice Assistant ---
const voiceBtn = document.getElementById('voice-btn');
const voiceTooltip = document.querySelector('.voice-tooltip');

// Check browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

if (SpeechRecognition && voiceBtn) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    let isListening = false;

    function speak(text) {
        // Stop any current speech
        synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Try to use a natural sounding voice if available
        const voices = synth.getVoices();
        const preferredVoice = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('Female'));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        synth.speak(utterance);
    }

    voiceBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            // Give user feedback that we are listening
            speak("I am listening. How can I help?");
            setTimeout(() => {
                recognition.start();
            }, 1500);
        }
    });

    recognition.onstart = () => {
        isListening = true;
        voiceBtn.classList.add('listening');
        voiceTooltip.textContent = "Listening...";
        voiceTooltip.style.opacity = '1';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Heard:", transcript);
        handleVoiceCommand(transcript);
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onend = () => {
        isListening = false;
        voiceBtn.classList.remove('listening');
        voiceTooltip.textContent = "AI Assistant";
        setTimeout(() => {
            voiceTooltip.style.opacity = '';
        }, 2000);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        speak("Sorry, I didn't catch that. Please try again.");
    };

    function handleVoiceCommand(command) {
        if (command.includes('hello') || command.includes('hi')) {
            speak("Hello! I am Umar Farooq's AI assistant. How can I help you today?");
        } 
        else if (command.includes('who') || command.includes('about')) {
            speak("Umar Farooq is an Artificial Intelligence student at City University of Science and Information Technology, passionate about Machine Learning and NLP.");
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        }
        else if (command.includes('skill')) {
            speak("Umar is highly skilled in Python, C, C++, Machine Learning, and Natural Language Processing.");
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
        }
        else if (command.includes('project')) {
            speak("Umar has worked on an NLP text preprocessing pipeline, a Naive Bayes classification model, and a multithreaded counter in C.");
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
        else if (command.includes('contact') || command.includes('hire') || command.includes('whatsapp')) {
            speak("You can contact Umar directly on WhatsApp. I will scroll you to the contact section now.");
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
        else if (command.includes('service') || command.includes('do')) {
            speak("Umar offers services in Machine Learning projects, NLP applications, Python development, and data analysis.");
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        }
        else if (command.includes('top') || command.includes('up')) {
            speak("Going to the top of the page.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        else {
            speak("I'm not sure how to respond to that. You can ask me about Umar's skills, projects, or how to contact him.");
        }
    }
} else if (voiceBtn) {
    // Hide button if speech recognition is not supported
    voiceBtn.style.display = 'none';
    console.log("Speech Recognition API is not supported in this browser.");
}

// Ensure voices are loaded (Chrome sometimes needs this)
speechSynthesis.onvoiceschanged = () => {
    // Voices are loaded
};
