// Create floating hearts
const heartsContainer = document.getElementById('hearts');
const heartSymbols = ['💖', '💕', '💗', '💓', '💞', '🌸', '✨'];

for (let i = 0; i < 25; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (12 + Math.random() * 10) + 's';
    heart.style.animationDelay = Math.random() * 15 + 's';
    heart.style.fontSize = (16 + Math.random() * 20) + 'px';
    heartsContainer.appendChild(heart);
}

// Expected Morse (Russian)
const expectedMorse = `.. --.. .- -... . .-.. .-.. .- --..--  - .-- --- .  .. -- .-.-  ... .--. . -.-. .. .- .-.. -..- -. --- .-.-.-
.--. .- -- .-.- - -..-  ---  -. . --  .--. .-. .. .... --- -.. .. -  -- . -.. .-.. . -. -. ---  ..  --- ... - .- . - ... .-.-  .--  -- --- . .---  .--. .- -- .-.- - .. .-.-.-
.. -. --- --. -.. .-  -- -. .  -. .  -. ..- ...- -. ---  ... .-.. -.-- ---- .- - -..-  - .-- --- .---  --. --- .-.. --- ... .-.-.-`;

function normalizeMorse(str) {
    return str
        .replace(/\s+/g, ' ')
        .replace(/\n/g, ' ')
        .trim()
        .toLowerCase();
}

function checkMorse() {
    const input = document.getElementById('morseInput').value;
    const errorMsg = document.getElementById('errorMsg');
    
    const cleanInput = normalizeMorse(input);
    const cleanExpected = normalizeMorse(expectedMorse);

    const isMatch = cleanInput === cleanExpected || 
                    (cleanInput.includes('.. --.. .- -... . .-.. .-.. .-') &&
                     cleanInput.includes('... .-.. -.-- ---- .- - -..-') &&
                     cleanInput.length > 100);

    if (isMatch) {
        document.getElementById('inputScreen').classList.add('hidden');
        setTimeout(() => {
            document.getElementById('declaration').classList.add('active');
            createSparkles();
        }, 400);
    } else {
        errorMsg.classList.add('show');
        setTimeout(() => errorMsg.classList.remove('show'), 3000);
    }
}

function createSparkles() {
    const container = document.getElementById('declaration');
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(sparkle);
    }
}

// Morse dictionary (International - works for Portuguese)
const morseCode = {
    'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
    'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
    'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
    'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
    'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
    ' ': '/',     '-': '-....-', '/': '-..-.', '@': '.--.-.',
    'Á': '.-',    'À': '.-',    'Â': '.-',    'Ã': '.-',
    'É': '.',     'È': '.',     'Ê': '.',
    'Í': '..',    'Ó': '---',   'Ô': '---',   'Õ': '---',
    'Ú': '..-',   'Ç': '-.-.'
};

function convertToMorse() {
    const text = document.getElementById('textToConvert').value.toUpperCase();
    let result = [];

    for (let char of text) {
        if (morseCode[char]) {
            result.push(morseCode[char]);
        } else if (char === '\n') {
            result.push('\n');
        } else {
            result.push(char);
        }
    }

    let final = '';
    for (let i = 0; i < result.length; i++) {
        if (result[i] === '/') {
            final += '   ';
        } else if (result[i] === '\n') {
            final += '\n';
        } else {
            final += result[i];
            if (i < result.length - 1 && result[i+1] !== '/' && result[i+1] !== '\n') {
                final += ' ';
            }
        }
    }

    document.getElementById('morseResult').value = final.trim();
}

function clearConverter() {
    document.getElementById('textToConvert').value = '';
    document.getElementById('morseResult').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('copyMsg').classList.remove('show');
}

function copyMorse() {
    const output = document.getElementById('morseResult');
    if (!output.value) return;

    output.select();
    navigator.clipboard.writeText(output.value).then(() => {
        const msg = document.getElementById('copyMsg');
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 2500);
    });
}

function openConverter() {
    document.getElementById('converter').classList.add('active');
}

function closeConverter() {
    document.getElementById('converter').classList.remove('active');
}

// ===== NEW: Sharing functions =====

function sendWhatsApp() {
    const morse = document.getElementById('morseResult').value;
    const phone = document.getElementById('phoneNumber').value.trim().replace(/\D/g, '');

    if (!morse) {
        alert('Primeiro converta uma mensagem para Morse 💕');
        return;
    }

    if (!phone || phone.length < 10) {
        alert('Digite um número válido com DDI.\nExemplo: 5511999999999');
        return;
    }

    const message = encodeURIComponent(
        `💕 Código Morse especial pra você:\n\n${morse}\n\n— Enviado com carinho`
    );

    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
}

function sendInstagram() {
    const morse = document.getElementById('morseResult').value;

    if (!morse) {
        alert('Primeiro converta uma mensagem para Morse 💕');
        return;
    }

    // Copy to clipboard first
    navigator.clipboard.writeText(morse).then(() => {
        // Show feedback
        const msg = document.getElementById('copyMsg');
        msg.textContent = 'Código copiado! Abrindo Instagram... 💖';
        msg.classList.add('show');

        // Try to open Instagram app / website
        // On mobile it opens the app, on desktop opens the website
        setTimeout(() => {
            window.open('https://www.instagram.com/direct/inbox/', '_blank');
            
            setTimeout(() => {
                msg.classList.remove('show');
                msg.textContent = 'Código copiado com sucesso! 💖';
            }, 3000);
        }, 600);
    }).catch(() => {
        alert('Não foi possível copiar automaticamente. Copie o código manualmente e cole no Direct do Instagram.');
    });
}

// Ctrl+Enter support
document.addEventListener('DOMContentLoaded', () => {
    const textArea = document.getElementById('textToConvert');
    if (textArea) {
        textArea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                convertToMorse();
            }
        });
    }
});
