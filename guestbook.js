document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('guestbook-form');
    const messagesContainer = document.getElementById('messages-container');
    const nameInput = document.getElementById('gb-name');
    const messageInput = document.getElementById('gb-message');
    const countBadge = document.getElementById('message-count');

    // Load messages from localStorage
    const loadMessages = () => {
        const messages = JSON.parse(localStorage.getItem('guestbook_messages')) || [];
        renderMessages(messages);
    };

    // Save messages to localStorage
    const saveMessage = (name, message) => {
        const messages = JSON.parse(localStorage.getItem('guestbook_messages')) || [];
        
        const newMessage = {
            id: Date.now(),
            name: name,
            message: message,
            date: new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        messages.unshift(newMessage); // Add to top
        localStorage.setItem('guestbook_messages', JSON.stringify(messages));
        return messages;
    };

    // Render messages to DOM
    const renderMessages = (messages) => {
        countBadge.textContent = messages.length;
        messagesContainer.innerHTML = '';

        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="empty-state">아직 작성된 방명록이 없습니다. 첫 번째 발자취를 남겨보세요!</div>';
            return;
        }

        messages.forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.className = 'message-card';
            
            // Convert newlines to <br> tags safely
            const safeMessage = document.createElement('div');
            safeMessage.textContent = msg.message;
            const htmlMessage = safeMessage.innerHTML.replace(/\n/g, '<br>');

            msgEl.innerHTML = `
                <div class="msg-header">
                    <span class="msg-author">${msg.name}</span>
                    <span class="msg-date">${msg.date}</span>
                </div>
                <div class="msg-body">
                    ${htmlMessage}
                </div>
            `;
            messagesContainer.appendChild(msgEl);
        });
    };

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (name && message) {
            const updatedMessages = saveMessage(name, message);
            renderMessages(updatedMessages);
            
            // Clear form
            form.reset();
            
            // Optional: nice little animation or feedback could go here
            nameInput.focus();
        }
    });

    // Initial load
    loadMessages();
});
