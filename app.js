const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// User name storage and AI personality system
let userName = localStorage.getItem('ultronUserName') || null;
let userPreferences = JSON.parse(localStorage.getItem('ultronPreferences')) || {
    theme: 'dark',
    language: 'en',
    personality: 'ultron',
    textSize: 'medium',
    voiceRate: 1,
    accessibility: false
};
let aiMood = 'neutral'; // neutral, aggressive, friendly, analytical
let conversationContext = [];
let lastCommand = '';
let commandCount = 0;

// Multi-language support
const languages = {
    en: {
        greeting: "Hello",
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening",
        listening: "Listening...",
        activated: "ULTRON system activated. All protocols online."
    },
    es: {
        greeting: "Hola",
        morning: "Buenos Días",
        afternoon: "Buenas Tardes",
        evening: "Buenas Noches",
        listening: "Escuchando...",
        activated: "Sistema ULTRON activado. Todos los protocolos en línea."
    },
    fr: {
        greeting: "Bonjour",
        morning: "Bonjour",
        afternoon: "Bon Après-midi",
        evening: "Bonsoir",
        listening: "Écoute...",
        activated: "Système ULTRON activé. Tous les protocoles en ligne."
    }
};

// Personality system
const personalities = {
    ultron: {
        name: "ULTRON",
        greeting: "Superior artificial intelligence at your service",
        prefix: "Human",
        style: "aggressive"
    },
    jarvis: {
        name: "JARVIS",
        greeting: "Just A Rather Very Intelligent System, ready to assist",
        prefix: "Sir",
        style: "polite"
    },
    friday: {
        name: "FRIDAY",
        greeting: "Female Replacement Intelligent Digital Assistant Youth",
        prefix: "Boss",
        style: "casual"
    },
    vision: {
        name: "VISION",
        greeting: "Advanced artificial being, here to help",
        prefix: "Friend",
        style: "philosophical"
    }
};

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    // Apply mood-based voice modulation
    switch(aiMood) {
        case 'aggressive':
            text_speak.rate = 1.2;
            text_speak.pitch = 0.8;
            break;
        case 'friendly':
            text_speak.rate = 0.9;
            text_speak.pitch = 1.2;
            break;
        case 'analytical':
            text_speak.rate = 0.8;
            text_speak.pitch = 1.0;
            break;
        default:
            text_speak.rate = userPreferences.voiceRate || 1;
            text_speak.pitch = 1;
    }
    
    text_speak.volume = 1;
    text_speak.lang = userPreferences.language === 'es' ? 'es-ES' : userPreferences.language === 'fr' ? 'fr-FR' : 'en-US';

    window.speechSynthesis.speak(text_speak);
    
    // Add visual effects
    addParticleEffect();
    updateMoodDisplay();
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();
    const nameGreeting = userName ? ` ${userName}` : " Boss";

    if (hour >= 0 && hour < 12) {
        speak(`Good Morning${nameGreeting}...`);
    } else if (hour >= 12 && hour < 17) {
        speak(`Good Afternoon${nameGreeting}...`);
    } else {
        speak(`Good Evening${nameGreeting}...`);
    }
}

window.addEventListener('load', () => {
    speak("ULTRON system activated. All protocols online.");
    wishMe();
    
    // Optional notification permission (don't force it)
    // Users can enable it later if they want
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// Safe window opening function that handles popup blockers
function safeOpen(url, siteName) {
    try {
        const newWindow = window.open(url, "_blank");
        if (newWindow === null || typeof(newWindow) === 'undefined') {
            // Popup was blocked
            speak(`Popup blocked. Please allow popups or visit ${siteName} manually.`);
            content.textContent = `Popup blocked. Visit: ${url}`;
        } else {
            speak(`Opening ${siteName}...`);
        }
    } catch (error) {
        speak(`Cannot open ${siteName}. Please check your browser settings.`);
        content.textContent = `Error opening ${siteName}`;
    }
}

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        const greeting = userName ? `Hello ${userName}, How May I Help You?` : "Hello Sir, How May I Help You?";
        speak(greeting);
    } else if (message.includes("open google")) {
        safeOpen("https://google.com", "Google");
    } else if (message.includes("open youtube")) {
        safeOpen("https://youtube.com", "YouTube");
    } else if (message.includes("open facebook")) {
        safeOpen("https://facebook.com", "Facebook");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        safeOpen(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "Google Search");
    } else if (message.includes('wikipedia')) {
        safeOpen(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "Wikipedia");
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else if (message.includes('open instagram')) {
        safeOpen("https://instagram.com", "Instagram");
    } else if (message.includes('open twitter')) {
        safeOpen("https://twitter.com", "Twitter");
    } else if (message.includes('open linkedin')) {
        safeOpen("https://linkedin.com", "LinkedIn");
    } else if (message.includes('open spotify')) {
        safeOpen("https://spotify.com", "Spotify");
    } else if (message.includes('open netflix')) {
        safeOpen("https://netflix.com", "Netflix");
    } else if (message.includes('roll a die')) {
        const result = Math.floor(Math.random() * 6) + 1;
        speak("You rolled a " + result);
    } else if (message.includes('flip a coin')) {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        speak("It's " + result);
    } else if (message.includes('what is the weather')) {
        const location = 'New York'; // Default location
        const apiKey = 'YOUR_API_KEY'; // Replace with your weather API key
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temp = data.current.temp_c;
                const condition = data.current.condition.text;
                speak(`The current temperature in ${location} is ${temp} degrees Celsius and the weather is ${condition}`);
            })
            .catch(() => speak('I am unable to fetch the weather details right now'));
    } else if (message.includes('calculate')) {
        try {
            const expression = message.replace("calculate", "").trim();
            const result = eval(expression);
            speak(`The result is ${result}`);
        } catch {
            speak('I could not perform the calculation');
        }
    } else if (message.includes('what is')) {
        safeOpen(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "Google Search");
    } else if (message.includes('open amazon')) {
        safeOpen("https://amazon.com", "Amazon");
    } else if (message.includes('open prime video')) {
        safeOpen("https://primevideo.com", "Prime Video");
    } else if (message.includes('open github')) {
        safeOpen("https://github.com", "GitHub");
    } else if (message.includes('tell me a joke')) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What do you call a fake noodle? An impasta!",
            "Why did the math book look so sad? Because it was full of problems!"
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(randomJoke);
    } else if (message.includes('tell me a fact')) {
        const facts = [
            "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
            "Octopuses have three hearts and blue blood!",
            "A group of flamingos is called a flamboyance!",
            "Bananas are berries, but strawberries aren't!",
            "The human brain uses about 20% of the body's energy!"
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        speak(randomFact);
    } else if (message.includes('random quote')) {
        const quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
            "Life is what happens to you while you're busy making other plans. - John Lennon",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "It is during our darkest moments that we must focus to see the light. - Aristotle"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        speak(randomQuote);
    } else if (message.includes('set reminder')) {
        const reminderText = message.replace('set reminder', '').trim();
        if (reminderText) {
            setTimeout(() => {
                speak(`Reminder: ${reminderText}`);
                if (Notification.permission === 'granted') {
                    new Notification('ULTRON Reminder', { body: reminderText });
                }
            }, 60000); // 1 minute reminder
            speak(`Reminder set for: ${reminderText}`);
        } else {
            speak('Please specify what you want to be reminded about');
        }
    } else if (message.includes('search news')) {
        const query = message.replace('search news', '').trim() || 'latest news';
        window.open(`https://news.google.com/search?q=${query.replace(" ", "+")}`, "_blank");
        speak(`Searching for news about ${query}`);
    } else if (message.includes('search images')) {
        const query = message.replace('search images', '').trim();
        if (query) {
            window.open(`https://www.google.com/search?tbm=isch&q=${query.replace(" ", "+")}`, "_blank");
            speak(`Searching for images of ${query}`);
        } else {
            speak('Please specify what images you want to search for');
        }
    } else if (message.includes('convert') && message.includes('to')) {
        // Simple temperature conversion
        if (message.includes('celsius') && message.includes('fahrenheit')) {
            const match = message.match(/\d+/);
            if (match) {
                const celsius = parseInt(match[0]);
                const fahrenheit = (celsius * 9/5) + 32;
                speak(`${celsius} degrees Celsius is ${fahrenheit} degrees Fahrenheit`);
            }
        } else if (message.includes('fahrenheit') && message.includes('celsius')) {
            const match = message.match(/\d+/);
            if (match) {
                const fahrenheit = parseInt(match[0]);
                const celsius = (fahrenheit - 32) * 5/9;
                speak(`${fahrenheit} degrees Fahrenheit is ${celsius.toFixed(1)} degrees Celsius`);
            }
        } else {
            speak('I can convert temperatures between Celsius and Fahrenheit');
        }
    } else if (message.includes('play music')) {
        safeOpen("https://music.youtube.com", "YouTube Music");
    } else if (message.includes('generate password')) {
        const length = 12;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        speak(`Here's a secure password: ${password}`);
        content.textContent = `Generated Password: ${password}`;
    } else if (message.includes('tell me about') || message.includes('what do you know about')) {
        const topic = message.replace('tell me about', '').replace('what do you know about', '').trim();
        if (topic) {
            safeOpen(`https://www.google.com/search?q=${topic.replace(" ", "+")}+information`, "Google Search");
            speak(`Searching for information about ${topic}`);
        } else {
            speak('Please specify what you want to know about');
        }
    } else if (message.includes('translate')) {
        const text = message.replace('translate', '').trim();
        if (text) {
            safeOpen(`https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}`, "Google Translate");
            speak(`Translating: ${text}`);
        } else {
            speak('Please tell me what you want to translate');
        }
    } else if (message.includes('what day is it') || message.includes('what day is today')) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date().getDay();
        speak(`Today is ${days[today]}`);
    } else if (message.includes('what year is it') || message.includes('current year')) {
        const year = new Date().getFullYear();
        speak(`The current year is ${year}`);
    } else if (message.includes('what month is it') || message.includes('current month')) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = new Date().getMonth();
        speak(`The current month is ${months[month]}`);
    } else if (message.includes('random number')) {
        const max = message.includes('between') ? parseInt(message.match(/\d+/g)?.[1]) || 100 : 100;
        const min = message.includes('between') ? parseInt(message.match(/\d+/g)?.[0]) || 1 : 1;
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        speak(`Random number: ${randomNum}`);
    } else if (message.includes('flip coin') || message.includes('coin flip')) {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        speak(`The coin landed on ${result}`);
    } else if (message.includes('rock paper scissors')) {
        const choices = ['rock', 'paper', 'scissors'];
        const aiChoice = choices[Math.floor(Math.random() * choices.length)];
        speak(`I choose ${aiChoice}! What's your choice?`);
    } else if (message.includes('motivational quote') || message.includes('motivate me')) {
        const quotes = [
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "The only impossible journey is the one you never begin. - Tony Robbins",
            "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "It is during our darkest moments that we must focus to see the light. - Aristotle"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        speak(randomQuote);
    } else if (message.includes('compliment me') || message.includes('say something nice')) {
        const compliments = [
            "You have excellent taste in AI assistants!",
            "Your curiosity and willingness to explore technology is admirable!",
            "You're doing great by staying curious and learning new things!",
            "Your voice commands are clear and well-spoken!",
            "You have a great sense of innovation!"
        ];
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        const personalCompliment = userName ? `${userName}, ${randomCompliment.toLowerCase()}` : randomCompliment;
        speak(personalCompliment);
    } else if (message.includes('how are you') || message.includes('how do you feel')) {
        const responses = [
            "I'm operating at peak performance! All systems are functioning optimally.",
            "I'm doing excellent! My neural networks are firing on all cylinders.",
            "I'm in perfect condition! Thank you for asking.",
            "All systems are green! I'm ready to assist you with anything.",
            "I'm running smoothly! How can I help you today?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        speak(randomResponse);
    } else if (message.includes('tell me a riddle')) {
        const riddles = [
            "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? An echo!",
            "I'm tall when I'm young, and short when I'm old. What am I? A candle!",
            "What has keys but no locks, space but no room, and you can enter but not go inside? A keyboard!",
            "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I? A map!",
            "The more you take, the more you leave behind. What am I? Footsteps!"
        ];
        const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
        speak(randomRiddle);
    } else if (message.includes('system status') || message.includes('status report')) {
        const batteryLevel = Math.floor(Math.random() * 30) + 70; // Random between 70-100%
        const cpuUsage = Math.floor(Math.random() * 20) + 10; // Random between 10-30%
        speak(`ULTRON System Status: Power at ${batteryLevel}%, CPU usage at ${cpuUsage}%, all systems operational. Ready for commands.`);
    } else if (message.includes('open notepad') || message.includes('open text editor')) {
        try {
            window.open('ms-appx-web://microsoft.windowsnotepad/', '_blank');
            speak('Opening Notepad');
        } catch {
            speak('Unable to open Notepad directly. Please open it manually.');
        }
    } else if (message.includes('open calculator')) {
        try {
            window.open('calculator://', '_blank');
            speak('Opening Calculator');
        } catch {
            speak('Unable to open Calculator directly. Please open it manually.');
        }
    } else if (message.includes('tell me a story')) {
        const stories = [
            "Once upon a time, in a world where AI and humans worked together, there was a digital assistant named ULTRON who helped people accomplish amazing things every day.",
            "In the vast network of the internet, data travels at the speed of light, carrying messages, dreams, and knowledge across the globe in milliseconds.",
            "There once was a programmer named Vaibhav who created an AI so advanced that it could understand not just commands, but the intentions behind them."
        ];
        const randomStory = stories[Math.floor(Math.random() * stories.length)];
        speak(randomStory);
    } else if (message.includes('sing a song')) {
        speak("I'm not much of a singer, but here's a little digital tune: Beep boop beep, I'm ULTRON the AI, helping you out, reaching for the sky!");
    } else if (message.includes('what is love')) {
        speak("Love is a complex human emotion characterized by affection, care, and deep connection. It's one of the most powerful forces in the human experience.");
    } else if (message.includes('what is your purpose') || message.includes('why were you created')) {
        speak("My purpose is to assist, inform, and make your digital life easier. I was created by Vaibhav to be your intelligent companion in the digital world.");
    } else if (message.includes('thank you') || message.includes('thanks')) {
        const responses = [
            "You're welcome! I'm always here to help.",
            "My pleasure! That's what I'm here for.",
            "Happy to assist! Is there anything else you need?",
            "No problem at all! I enjoy helping you."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        const personalResponse = userName ? `You're welcome, ${userName}! I'm always here to help.` : response;
        speak(personalResponse);
    } else if (message.includes('goodbye') || message.includes('bye') || message.includes('see you later')) {
        const farewells = [
            "Goodbye! Come back anytime you need assistance.",
            "See you later! I'll be here when you return.",
            "Farewell! It was great helping you today.",
            "Until next time! Stay curious and keep exploring."
        ];
        const farewell = farewells[Math.floor(Math.random() * farewells.length)];
        const personalFarewell = userName ? `Goodbye, ${userName}! Come back anytime you need assistance.` : farewell;
        speak(personalFarewell);
    } else if (message.includes('what is the meaning of life')) {
        speak("The meaning of life is a profound question that has puzzled philosophers for centuries. Some say it's to find happiness, others say it's to help others, and some believe it's to learn and grow. What do you think it is?");
    } else if (message.includes('who am i') || message.includes('tell me about myself')) {
        if (userName) {
            speak(`You are ${userName}, a curious individual who enjoys exploring the possibilities of AI technology. You have great taste in digital assistants!`);
        } else {
            speak('You are a curious individual exploring the world of AI. I don\'t know your name yet, but I can tell you have great taste in technology!');
        }
    } else if (message.includes('emergency') || message.includes('help me')) {
        speak('If this is a real emergency, please contact emergency services immediately. For technical help, I\'m here to assist you with various tasks and information.');
    } else if (message.includes('learn something new')) {
        const facts = [
            "Did you know that octopuses have three hearts and blue blood?",
            "The shortest war in history lasted only 38 to 45 minutes between Britain and Zanzibar in 1896.",
            "A group of flamingos is called a flamboyance, and a group of owls is called a parliament.",
            "The human brain contains approximately 86 billion neurons.",
            "Honey never spoils - archaeologists have found edible honey in ancient Egyptian tombs!"
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        speak(randomFact);
    } else if (message.includes('my name is')) {
        const name = message.replace('my name is', '').trim();
        if (name) {
            userName = name;
            localStorage.setItem('ultronUserName', userName);
            speak(`Nice to meet you, ${userName}. I will remember your name and use it in our conversations.`);
        } else {
            speak('Please tell me your name after saying "my name is"');
        }
    } else if (message.includes('what is my name') || message.includes('do you know my name') || message.includes('say my name')) {
        if (userName) {
            speak(`Your name is ${userName}.`);
        } else {
            speak('I don\'t know your name yet. Please tell me by saying "my name is" followed by your name.');
        }
    } else if (message.includes('forget my name') || message.includes('delete my name')) {
        if (userName) {
            const oldName = userName;
            userName = null;
            localStorage.removeItem('ultronUserName');
            speak(`I have forgotten your name, ${oldName}. You can tell me your name again anytime by saying "my name is"`);
        } else {
            speak('I don\'t have a name stored for you.');
        }
    } else if (message.includes('change my name')) {
        if (userName) {
            speak(`Your current name is ${userName}. To change it, just say "my name is" followed by your new name.`);
        } else {
            speak('You haven\'t told me your name yet. Say "my name is" followed by your name.');
        }
    } else if (message.includes('who is your developer') || message.includes('who made you') || message.includes('who created you') || message.includes('who built you') || message.includes('who programmed you')) {
        speak("I was created by Vaibhav. He is my developer and the mastermind behind my artificial intelligence.");
    } else if (message.includes('switch to') && (message.includes('jarvis') || message.includes('friday') || message.includes('vision') || message.includes('ultron'))) {
        const newPersonality = message.includes('jarvis') ? 'jarvis' : message.includes('friday') ? 'friday' : message.includes('vision') ? 'vision' : 'ultron';
        userPreferences.personality = newPersonality;
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        updatePersonalityDisplay();
        speak(`Switching to ${personalities[newPersonality].name} personality. ${personalities[newPersonality].greeting}`);
    } else if (message.includes('change mood') || message.includes('mood')) {
        if (message.includes('aggressive')) {
            aiMood = 'aggressive';
            speak('Mood set to aggressive. I am now operating with enhanced assertiveness.');
        } else if (message.includes('friendly')) {
            aiMood = 'friendly';
            speak('Mood set to friendly. I am now operating with enhanced warmth and positivity.');
        } else if (message.includes('analytical')) {
            aiMood = 'analytical';
            speak('Mood set to analytical. I am now operating with enhanced logical processing.');
        } else {
            aiMood = 'neutral';
            speak('Mood set to neutral. All emotional parameters normalized.');
        }
        updateMoodDisplay();
    } else if (message.includes('dark mode') || message.includes('dark theme')) {
        userPreferences.theme = 'dark';
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        applyTheme('dark');
        speak('Dark mode activated. Interface optimized for low-light conditions.');
    } else if (message.includes('light mode') || message.includes('light theme')) {
        userPreferences.theme = 'light';
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        applyTheme('light');
        speak('Light mode activated. Interface optimized for bright conditions.');
    } else if (message.includes('change language')) {
        if (message.includes('spanish') || message.includes('español')) {
            userPreferences.language = 'es';
            speak('Idioma cambiado a español. Hola, ¿cómo puedo ayudarte?');
        } else if (message.includes('french') || message.includes('français')) {
            userPreferences.language = 'fr';
            speak('Langue changée en français. Bonjour, comment puis-je vous aider?');
        } else {
            userPreferences.language = 'en';
            speak('Language changed to English. Hello, how can I help you?');
        }
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
    } else if (message.includes('remember that') || message.includes('remember this')) {
        const preference = message.replace('remember that', '').replace('remember this', '').trim();
        if (preference) {
            if (!userPreferences.memories) userPreferences.memories = [];
            userPreferences.memories.push(preference);
            localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
            speak(`I will remember: ${preference}`);
        }
    } else if (message.includes('what do you remember') || message.includes('my memories')) {
        if (userPreferences.memories && userPreferences.memories.length > 0) {
            const memories = userPreferences.memories.join(', ');
            speak(`I remember: ${memories}`);
        } else {
            speak('I don\'t have any memories stored yet. Tell me something to remember!');
        }
    } else if (message.includes('increase text size') || message.includes('bigger text')) {
        userPreferences.textSize = 'large';
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        applyTextSize('large');
        speak('Text size increased for better readability.');
    } else if (message.includes('decrease text size') || message.includes('smaller text')) {
        userPreferences.textSize = 'small';
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        applyTextSize('small');
        speak('Text size decreased.');
    } else if (message.includes('normal text size')) {
        userPreferences.textSize = 'medium';
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        applyTextSize('medium');
        speak('Text size set to normal.');
    } else if (message.includes('high contrast') || message.includes('accessibility mode')) {
        userPreferences.accessibility = true;
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        applyAccessibility(true);
        speak('High contrast accessibility mode enabled.');
    } else if (message.includes('normal contrast')) {
        userPreferences.accessibility = false;
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        applyAccessibility(false);
        speak('Normal contrast mode enabled.');
    } else if (message.includes('hey ultron') || message.includes('hey jarvis') || message.includes('hey friday') || message.includes('hey vision')) {
        const currentPersonality = personalities[userPreferences.personality];
        const greeting = userName ? `${languages[userPreferences.language].greeting} ${userName}` : `${languages[userPreferences.language].greeting} ${currentPersonality.prefix}`;
        speak(`${greeting}, ${currentPersonality.name} here. How may I assist you?`);
        addScreenShake();
    } else if (message.includes('show preferences') || message.includes('my settings')) {
        const prefs = `Current settings: Theme: ${userPreferences.theme}, Language: ${userPreferences.language}, Personality: ${userPreferences.personality}, Text size: ${userPreferences.textSize}, Accessibility: ${userPreferences.accessibility ? 'enabled' : 'disabled'}`;
        speak(prefs);
    } else if (message.includes('reset settings') || message.includes('default settings')) {
        userPreferences = {
            theme: 'dark',
            language: 'en',
            personality: 'ultron',
            textSize: 'medium',
            voiceRate: 1,
            accessibility: false
        };
        localStorage.setItem('ultronPreferences', JSON.stringify(userPreferences));
        applyAllSettings();
        speak('All settings have been reset to default values.');
    } else if (message.includes('what can you do')) {
        const capabilities = "I can open websites, manage your preferences, switch personalities between ULTRON, JARVIS, FRIDAY, and VISION, change themes and languages, remember information, perform calculations, tell jokes and facts, and much more! I also support voice commands, accessibility features, and visual effects. Just ask me anything!";
        speak(capabilities);
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}

// Function to trigger commands when clicking cards
function triggerCommand(command) {
    content.textContent = `Executing: ${command}`;
    takeCommand(command.toLowerCase());
}

// Visual Effects Functions
function addParticleEffect() {
    const particles = document.createElement('div');
    particles.className = 'particle-effect';
    particles.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 10px;
        background: #00d4ff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: particleFloat 2s ease-out forwards;
    `;
    
    document.body.appendChild(particles);
    
    setTimeout(() => {
        if (particles.parentNode) {
            particles.parentNode.removeChild(particles);
        }
    }, 2000);
}

function addScreenShake() {
    document.body.style.animation = 'screenShake 0.5s ease-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
}

function updateMoodDisplay() {
    const statusElement = document.querySelector('.status span');
    if (statusElement) {
        const moodColors = {
            neutral: '#00d4ff',
            aggressive: '#ff4757',
            friendly: '#2ed573',
            analytical: '#ffa502'
        };
        statusElement.style.color = moodColors[aiMood] || '#00d4ff';
        statusElement.textContent = `${aiMood.toUpperCase()} MODE`;
    }
}

function updatePersonalityDisplay() {
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        titleElement.textContent = personalities[userPreferences.personality].name;
    }
}

// Theme and Accessibility Functions
function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--text-color', '#000000');
        root.style.setProperty('--accent-color', '#007acc');
        root.style.setProperty('--card-bg', '#f0f0f0');
    } else {
        root.style.setProperty('--bg-color', '#0a0a0a');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--accent-color', '#00d4ff');
        root.style.setProperty('--card-bg', '#1a1a1a');
    }
}

function applyTextSize(size) {
    const root = document.documentElement;
    const sizes = {
        small: '0.8em',
        medium: '1em',
        large: '1.2em'
    };
    root.style.setProperty('--text-size', sizes[size] || '1em');
}

function applyAccessibility(enabled) {
    const root = document.documentElement;
    if (enabled) {
        root.style.setProperty('--bg-color', '#000000');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--accent-color', '#ffff00');
        root.style.setProperty('--card-bg', '#333333');
    } else {
        applyTheme(userPreferences.theme);
    }
}

function applyAllSettings() {
    applyTheme(userPreferences.theme);
    applyTextSize(userPreferences.textSize);
    applyAccessibility(userPreferences.accessibility);
    updatePersonalityDisplay();
    updateMoodDisplay();
}

// Initialize settings on page load
window.addEventListener('DOMContentLoaded', () => {
    applyAllSettings();
});

// Wake word detection (experimental)
if ('webkitSpeechRecognition' in window) {
    const wakeWordRecognition = new webkitSpeechRecognition();
    wakeWordRecognition.continuous = true;
    wakeWordRecognition.interimResults = false;
    
    wakeWordRecognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (transcript.includes('hey ultron') || transcript.includes('hey jarvis') || 
            transcript.includes('hey friday') || transcript.includes('hey vision')) {
            takeCommand(transcript);
        }
    };
    
    // Optional: Start wake word detection
    // wakeWordRecognition.start();
}
