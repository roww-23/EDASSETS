document.addEventListener('DOMContentLoaded', () => {
    // --- Routing ---
    function navigate() {
        const hash = window.location.hash.substring(1) || 'home';
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const target = document.getElementById(hash);
        if (target) {
            target.classList.add('active');
        }
        updateAuthUI();

        if (hash === 'assets') loadAssets();
        if (hash === 'dashboard') loadDashboard();
    }

    window.addEventListener('hashchange', navigate);
    // Initial load
    navigate();

    // --- Auth UI Management ---
    function updateAuthUI() {
        const user = localStorage.getItem('user');
        if (user) {
            document.querySelectorAll('.auth-hidden').forEach(el => el.classList.remove('hidden'));
            document.querySelectorAll('.guest-only').forEach(el => el.classList.add('hidden'));
        } else {
            document.querySelectorAll('.auth-hidden').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.guest-only').forEach(el => el.classList.remove('hidden'));
        }

        // Block restricted pages
        const hash = window.location.hash.substring(1);
        if (!user && (hash === 'upload' || hash === 'dashboard')) {
            window.location.hash = 'login';
        }
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        API.logout();
        window.location.hash = 'home';
        updateAuthUI();
    });

    // --- Login ---
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;

        try {
            await API.login(user, pass);
            window.location.hash = 'dashboard';
        } catch (err) {
            const errEl = document.getElementById('login-error');
            errEl.innerText = "Login failed: " + err.message;
            errEl.style.display = 'block';
        }
    });

    // --- Register ---
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        // Similar to login logic... 
        // For brevity, auto-login after register logic usually requires re-sending creds or backend support.
        // We'll just redirect to login.
        const user = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;

        try {
            await API.register(user, email, pass);
            alert('Registration successful! Please login.');
            window.location.hash = 'login';
        } catch (err) {
            alert('Error: ' + err.message);
        }
    });

    // --- Upload ---
    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('asset-title').value;
        const category = document.getElementById('asset-category').value;
        const file = document.getElementById('asset-file').files[0];

        if (!title || !file) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('file', file);

        try {
            document.getElementById('upload-msg').innerText = 'Uploading...';
            await API.uploadAsset(formData);
            document.getElementById('upload-msg').innerText = 'Upload Successful!';
            setTimeout(() => {
                document.getElementById('upload-form').reset();
                document.getElementById('upload-msg').innerText = '';
                window.location.hash = 'dashboard';
            }, 1000);
        } catch (err) {
            document.getElementById('upload-msg').innerText = 'Error: ' + err.message;
        }
    });

    // --- Assets ---
    async function loadAssets() {
        const grid = document.getElementById('assets-grid');
        grid.innerHTML = '<p>Loading...</p>';
        try {
            const assets = await API.getAssets();
            renderAssets(assets);

            // Filters
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const cat = btn.dataset.category;
                    if (cat === 'all') renderAssets(assets);
                    else renderAssets(assets.filter(a => a.category === cat));
                }
            });

        } catch (err) {
            grid.innerHTML = '<p>Error loading assets.</p>';
        }
    }

    function renderAssets(list) {
        const grid = document.getElementById('assets-grid');
        if (list.length === 0) {
            grid.innerHTML = '<p>No assets found.</p>';
            return;
        }
        grid.innerHTML = list.map(asset => `
            <div class="asset-card">
                <div class="asset-preview">
                    ${getFileIcon(asset.category)}
                </div>
                <div class="asset-info">
                    <h4 class="asset-title">${asset.title}</h4>
                    <div class="asset-meta">
                        <span>${asset.category}</span>
                        <span>by ${asset.uploader.username}</span>
                    </div>
                    <button class="btn btn-primary full-width" onclick="downloadAsset(${asset.id})">Download</button>
                </div>
            </div>
        `).join('');
    }

    window.downloadAsset = async (id) => {
        if (!localStorage.getItem('auth_token')) {
            window.location.hash = 'login';
            return;
        }
        try {
            const res = await API.downloadAsset(id);
            // res.file_url is the relative path e.g. /media/assets/file.png
            // We need to prepend backend URL if it's relative
            const url = 'http://127.0.0.1:8000' + res.file_url;

            // Trigger download
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            alert('Download failed');
        }
    }

    function getFileIcon(cat) {
        if (cat === 'transition') return '⚡';
        if (cat === 'overlay') return '🔳';
        if (cat === 'effect') return '✨';
        return '📁';
    }

    // --- Dashboard ---
    async function loadDashboard() {
        try {
            const data = await API.getDashboard();

            const uploadsList = document.getElementById('my-uploads-list');
            uploadsList.innerHTML = data.uploads.map(a => `
                <div class="dash-list-item">
                    <span>${a.title}</span>
                    <span class="text-muted">${new Date(a.upload_date).toLocaleDateString()}</span>
                </div>
            `).join('') || '<p>No uploads yet.</p>';

            const downloadsList = document.getElementById('download-history-list');
            downloadsList.innerHTML = data.downloads.map(d => `
                <div class="dash-list-item">
                    <span>${d.asset.title}</span>
                    <span class="text-muted">${new Date(d.timestamp).toLocaleDateString()}</span>
                </div>
            `).join('') || '<p>No downloads yet.</p>';

        } catch (err) {
            console.error(err);
        }
    }
});
