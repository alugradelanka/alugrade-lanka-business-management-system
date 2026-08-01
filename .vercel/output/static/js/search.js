class SearchService {
    constructor(db) {
        this.db = db;
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    }

    async search(query) {
        query = query.toLowerCase();
        this._addRecentSearch(query);
        
        // Mock data search logic
        const results = {
            customers: [],
            orders: [],
            inventory: []
        };
        
        return results;
    }

    _addRecentSearch(query) {
        const index = this.recentSearches.indexOf(query);
        if (index > -1) this.recentSearches.splice(index, 1);
        this.recentSearches.unshift(query);
        if (this.recentSearches.length > 5) this.recentSearches.pop();
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }

    renderResults(results) {
        let html = '<div class="search-results-list">';
        
        let hasResults = false;
        
        for (const [entityType, items] of Object.entries(results)) {
            if (items.length > 0) {
                hasResults = true;
                html += `
                    <div class="search-category">
                        <h4>${entityType.toUpperCase()}</h4>
                        <ul>
                            ${items.map(item => `
                                <li class="search-result-item" onclick="window.app.router.navigate('#/${entityType}/${item.id}')">
                                    <div class="search-result-title">${item.title}</div>
                                    <div class="search-result-desc">${item.desc}</div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }
        }
        
        if (!hasResults) {
            html += '<div class="p-3 text-center text-muted">No results found</div>';
        }
        
        html += '</div>';
        return html;
    }
}

window.SearchService = SearchService;
