class AIAssistantModule {
    constructor() {
        this.container = null;
        this.intents = [
            { id: 'SHOW_PENDING_ORDERS', keywords: ['pending', 'orders', 'waiting'] },
            { id: 'SHOW_LOW_STOCK', keywords: ['low stock', 'stock', 'inventory', 'running out'] },
            { id: 'TODAYS_DELIVERIES', keywords: ['today', 'delivery', 'deliveries'] },
            { id: 'OUTSTANDING_PAYMENTS', keywords: ['outstanding', 'unpaid', 'balance', 'owe'] },
            { id: 'FIND_CUSTOMER', keywords: ['find customer', 'search customer', 'customer with phone', 'customer'] },
            { id: 'FIND_ORDER', keywords: ['find order', 'order number', 'search order'] },
            { id: 'MONTHLY_SUMMARY', keywords: ['summary', 'month', 'monthly', 'sales'] },
            { id: 'TOP_CUSTOMERS', keywords: ['top customers', 'best customers', 'highest spending'] },
            { id: 'SUGGEST_REORDER', keywords: ['reorder', 'order materials', 'low inventory'] },
            { id: 'OVERDUE_ORDERS', keywords: ['overdue', 'late', 'delayed'] },
            { id: 'FIND_INVOICE', keywords: ['invoice', 'find invoice'] },
            { id: 'RECENT_ORDERS', keywords: ['recent orders', 'latest orders', 'new orders'] }
        ];
    }

    render() {
        this.container = document.createElement('div');
        this.container.className = 'ai-assistant-page';
        this.container.innerHTML = `
            <div class="chat-container" style="display:flex; flex-direction:column; height:80vh; max-width:800px; margin:0 auto; border:1px solid #ccc; border-radius:8px; overflow:hidden;">
                <div class="chat-header" style="background:#007bff; color:#fff; padding:15px; display:flex; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div class="assistant-avatar" style="width:30px; height:30px; background:#fff; color:#007bff; border-radius:50%; text-align:center; line-height:30px; font-weight:bold;">AG</div>
                        <h3 style="margin:0;">ALUGRADE AI Assistant</h3>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-light" id="ai-clear-btn">Clear</button>
                        <button class="btn btn-sm btn-light" id="ai-export-btn">Export</button>
                    </div>
                </div>
                
                <div class="chat-window" id="ai-chat-window" style="flex:1; padding:20px; overflow-y:auto; background:#f9f9f9; display:flex; flex-direction:column; gap:15px;">
                    <!-- Messages will appear here -->
                    <div class="message ai-message" style="align-self:flex-start; background:#fff; padding:10px 15px; border-radius:15px; border:1px solid #ddd; max-width:80%;">
                        Hello! I am your ALUGRADE AI Assistant. How can I help you today?
                    </div>
                </div>
                
                <div class="quick-questions" style="padding:10px; background:#fff; border-top:1px solid #eee; display:flex; gap:10px; overflow-x:auto; white-space:nowrap;">
                    <button class="pill-btn">Show pending orders</button>
                    <button class="pill-btn">Low stock items</button>
                    <button class="pill-btn">Today's deliveries</button>
                    <button class="pill-btn">Outstanding payments</button>
                    <button class="pill-btn">Top customers this month</button>
                    <button class="pill-btn">Monthly profit</button>
                </div>
                
                <div class="chat-input-bar" style="padding:15px; background:#fff; border-top:1px solid #ccc; display:flex; gap:10px;">
                    <button class="mic-btn" style="background:none; border:none; font-size:20px; cursor:pointer;">🎤</button>
                    <input type="text" id="ai-chat-input" placeholder="Type your question..." style="flex:1; padding:10px; border:1px solid #ccc; border-radius:20px; outline:none;">
                    <button id="ai-send-btn" class="btn btn-primary" style="border-radius:20px; padding:0 20px;">Send</button>
                </div>
            </div>
        `;
        
        this.attachEvents();
        return this.container;
    }

    attachEvents() {
        const sendBtn = this.container.querySelector('#ai-send-btn');
        const input = this.container.querySelector('#ai-chat-input');
        const clearBtn = this.container.querySelector('#ai-clear-btn');
        const exportBtn = this.container.querySelector('#ai-export-btn');
        const pills = this.container.querySelectorAll('.pill-btn');

        const sendMessage = () => {
            const text = input.value.trim();
            if (text) {
                this.renderMessage('user', text);
                input.value = '';
                this.processQuery(text);
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                input.value = pill.innerText;
                sendMessage();
            });
        });

        clearBtn.addEventListener('click', () => this.clearChat());
        exportBtn.addEventListener('click', () => this.exportChat());
    }

    async processQuery(userMessage) {
        this.addTypingIndicator();
        
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        
        this.removeTypingIndicator();
        
        const text = userMessage.toLowerCase();
        let matchedIntent = null;
        let highestMatchScore = 0;

        for (const intent of this.intents) {
            let score = 0;
            intent.keywords.forEach(kw => {
                if (text.includes(kw.toLowerCase())) {
                    score++;
                }
            });
            if (score > highestMatchScore) {
                highestMatchScore = score;
                matchedIntent = intent.id;
            }
        }

        if (!matchedIntent) {
            this.renderMessage('ai', "I'm not sure how to answer that. Try asking about orders, inventory, customers, or payments.");
            return;
        }

        // Mock data fetch based on intent
        let data = null;
        try {
            data = await this.fetchMockData(matchedIntent, text);
            const responseHtml = this.formatResponse(matchedIntent, data);
            this.renderMessage('ai', responseHtml, data);
        } catch (err) {
            this.renderMessage('ai', "I encountered an error fetching the data.");
        }
    }

    async fetchMockData(intent, query) {
        // In a real scenario, this queries the DB.
        const mockResponse = {
            SHOW_PENDING_ORDERS: [{ id: 'ORD-001', customer: 'John Doe', status: 'Pending', amount: 50000 }],
            SHOW_LOW_STOCK: [{ item: 'Aluminum Profile 2x4', qty: 5, min: 10 }],
            TODAYS_DELIVERIES: [{ order: 'ORD-005', customer: 'Jane Smith', address: 'Colombo 7' }],
            OUTSTANDING_PAYMENTS: [{ customer: 'ABC Corp', balance: 150000 }],
            FIND_CUSTOMER: { name: 'Test Customer', phone: '0771234567', orders: 3 },
            FIND_ORDER: { id: 'ORD-999', status: 'Completed', total: 10000 },
            MONTHLY_SUMMARY: { sales: 2500000, expenses: 1800000, profit: 700000 },
            TOP_CUSTOMERS: [{ name: 'VIP Builders', spent: 5000000 }],
            SUGGEST_REORDER: [{ item: 'Glass Sheet 5mm', current: 2, suggest: 20 }],
            OVERDUE_ORDERS: [{ id: 'ORD-010', daysLate: 5 }],
            FIND_INVOICE: { id: 'INV-100', status: 'Paid', amount: 45000 },
            RECENT_ORDERS: [{ id: 'ORD-101', date: 'Today' }]
        };
        return mockResponse[intent] || null;
    }

    formatResponse(intent, data) {
        if (!data) return "No data found for your request.";
        
        switch (intent) {
            case 'SHOW_PENDING_ORDERS':
                return `Here are the pending orders:<br><table border="1" width="100%"><tr><th>Order</th><th>Customer</th><th>Amount</th></tr>${data.map(d => `<tr><td>${d.id}</td><td>${d.customer}</td><td>${d.amount}</td></tr>`).join('')}</table>`;
            case 'MONTHLY_SUMMARY':
                return `<b>Monthly Summary:</b><br>Sales: Rs. ${data.sales}<br>Expenses: Rs. ${data.expenses}<br>Profit: Rs. ${data.profit}`;
            // Simplify others for demonstration
            default:
                return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
    }

    renderMessage(role, content, data = null) {
        const window = this.container.querySelector('#ai-chat-window');
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}-message`;
        
        if (role === 'user') {
            msgDiv.style = 'align-self:flex-end; background:#007bff; color:#fff; padding:10px 15px; border-radius:15px; max-width:80%;';
        } else {
            msgDiv.style = 'align-self:flex-start; background:#fff; color:#333; padding:10px 15px; border-radius:15px; border:1px solid #ddd; max-width:80%;';
        }
        
        msgDiv.innerHTML = content;
        window.appendChild(msgDiv);
        this.scrollToBottom();
    }

    addTypingIndicator() {
        const window = this.container.querySelector('#ai-chat-window');
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'message ai-message';
        indicator.style = 'align-self:flex-start; background:#fff; padding:10px 15px; border-radius:15px; border:1px solid #ddd; color:#999;';
        indicator.innerHTML = '<i>Processing...</i>';
        window.appendChild(indicator);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const ind = this.container.querySelector('#typing-indicator');
        if (ind) ind.remove();
    }

    scrollToBottom() {
        const window = this.container.querySelector('#ai-chat-window');
        if (window) window.scrollTop = window.scrollHeight;
    }

    clearChat() {
        const window = this.container.querySelector('#ai-chat-window');
        if (window) {
            window.innerHTML = `
                <div class="message ai-message" style="align-self:flex-start; background:#fff; padding:10px 15px; border-radius:15px; border:1px solid #ddd; max-width:80%;">
                    Conversation cleared. How can I help you today?
                </div>
            `;
        }
    }

    exportChat() {
        const window = this.container.querySelector('#ai-chat-window');
        if (!window) return;
        const messages = Array.from(window.querySelectorAll('.message')).map(m => {
            const role = m.classList.contains('user-message') ? 'User' : 'Assistant';
            return `${role}: ${m.innerText}`;
        }).join('\n\n');
        
        const blob = new Blob([messages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chat_Export_${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
    }
}

window.AIAssistantModule = AIAssistantModule;

