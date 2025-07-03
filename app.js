const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("ULTRON system activated. All protocols online.");
    wishMe();
    
    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
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

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
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
        window.open("https://instagram.com", "_blank");
        speak("Opening Instagram...");
    } else if (message.includes('open twitter')) {
        window.open("https://twitter.com", "_blank");
        speak("Opening Twitter...");
    } else if (message.includes('open linkedin')) {
        window.open("https://linkedin.com", "_blank");
        speak("Opening LinkedIn...");
    } else if (message.includes('open spotify')) {
        window.open("https://spotify.com", "_blank");
        speak("Opening Spotify...");
    } else if (message.includes('open netflix')) {
        window.open("https://netflix.com", "_blank");
        speak("Opening Netflix...");
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
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('open amazon')) {
        window.open("https://amazon.com", "_blank");
        speak("Opening Amazon...");
    } else if (message.includes('open prime video')) {
        window.open("https://primevideo.com", "_blank");
        speak("Opening Prime Video...");
    } else if (message.includes('open github')) {
        window.open("https://github.com", "_blank");
        speak("Opening GitHub...");
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
        window.open("https://music.youtube.com", "_blank");
        speak("Opening YouTube Music...");
    } else if (message.includes('what can you do')) {
        const capabilities = "I can open websites like Google, YouTube, Facebook, Instagram, Twitter, LinkedIn, Spotify, Netflix, and Amazon. I can tell you the time and date, perform calculations, tell jokes and facts, share quotes, flip coins, roll dice, search for news and images, convert temperatures, and set reminders. Just ask me anything!";
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
