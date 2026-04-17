document.addEventListener('DOMContentLoaded', () => {
    // Supabase Initialization
    const supabaseUrl = 'https://ulkdsgqjmjjbhdmtgymu.supabase.co';
    const supabaseKey = 'sb_publishable_BYZ64O6IkYJZYhH0jvAsew_FPRh7FkZ';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const form = document.getElementById('guestbook-form');
    const messagesContainer = document.getElementById('messages-container');
    const nameInput = document.getElementById('gb-name');
    const messageInput = document.getElementById('gb-message');
    const countBadge = document.getElementById('message-count');

    // Load messages from Supabase
    const loadMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('guestbook')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            renderMessages(data || []);
        } catch (error) {
            console.error('방명록을 불러오는 데 실패했습니다:', error);
            messagesContainer.innerHTML = '<div class="empty-state" style="color:red;">데이터를 불러오는 중 오류가 발생했습니다.</div>';
        }
    };

    // Save message to Supabase
    const saveMessage = async (name, message) => {
        try {
            const { error } = await supabase
                .from('guestbook')
                .insert([
                    { name: name, message: message }
                ]);

            if (error) throw error;
            
            // Reload all messages after successful insert
            await loadMessages();
        } catch (error) {
            console.error('방명록을 저장하는 데 실패했습니다:', error);
            alert('방명록을 저장하는 데 실패했습니다.');
        }
    };

    // Format date string safely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    <span class="msg-date">${formatDate(msg.created_at)}</span>
                </div>
                <div class="msg-body">
                    ${htmlMessage}
                </div>
            `;
            messagesContainer.appendChild(msgEl);
        });
    };

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        const submitBtn = form.querySelector('.submit-btn');

        if (name && message) {
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = '등록 중...';

            await saveMessage(name, message);
            
            // Clear form
            form.reset();
            
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            nameInput.focus();
        }
    });

    // Initial load
    loadMessages();
});
