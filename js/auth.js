// 认证系统 - 用户注册、登录、登出功能

// 用户数据存储（使用localStorage模拟数据库）
class AuthSystem {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        this.updateUI();
        this.bindEvents();
    }

    // 获取当前登录用户
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    // 设置当前用户
    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
        this.updateUI();
    }

    // 检查用户是否已登录
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // 获取所有用户（从localStorage）
    getAllUsers() {
        const usersStr = localStorage.getItem('users');
        return usersStr ? JSON.parse(usersStr) : [];
    }

    // 保存所有用户
    saveAllUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // 注册新用户
    register(username, email, password) {
        const users = this.getAllUsers();

        // 检查用户名是否已存在
        if (users.find(u => u.username === username)) {
            return { success: false, message: '用户名已存在' };
        }

        // 检查邮箱是否已存在
        if (users.find(u => u.email === email)) {
            return { success: false, message: '邮箱已被注册' };
        }

        // 创建新用户
        const newUser = {
            id: Date.now(),
            username,
            email,
            password, // 实际应用中应该加密
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveAllUsers(users);

        return { success: true, message: '注册成功！' };
    }

    // 用户登录
    login(usernameOrEmail, password) {
        const users = this.getAllUsers();

        // 查找用户
        const user = users.find(u => 
            (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
            u.password === password
        );

        if (!user) {
            return { success: false, message: '用户名/邮箱或密码错误' };
        }

        // 设置当前用户（不包含密码）
        const { password: _, ...userWithoutPassword } = user;
        this.setCurrentUser(userWithoutPassword);

        return { success: true, message: '登录成功！', user: userWithoutPassword };
    }

    // 用户登出
    logout() {
        this.setCurrentUser(null);
        this.updateUI();
        showNotification('已成功登出', 'success');
    }

    // 更新UI显示
    updateUI() {
        const userSection = document.querySelector('.user-section');
        if (!userSection) return;

        if (this.isLoggedIn()) {
            // 显示用户信息
            const firstLetter = this.currentUser.username.charAt(0).toUpperCase();
            userSection.innerHTML = `
                <div class="user-dropdown">
                    <div class="user-info">
                        <div class="user-avatar">${firstLetter}</div>
                        <span class="user-name">${this.currentUser.username}</span>
                    </div>
                    <div class="dropdown-menu">
                        <a href="#" id="profileLink">个人资料</a>
                        <a href="#" id="settingsLink">账号设置</a>
                        <a href="#" id="logoutBtn">退出登录</a>
                    </div>
                </div>
            `;

            // 绑定登出按钮
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }

            // 绑定其他链接（可选）
            const profileLink = document.getElementById('profileLink');
            if (profileLink) {
                profileLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    showNotification('个人资料功能开发中...', 'info');
                });
            }

            const settingsLink = document.getElementById('settingsLink');
            if (settingsLink) {
                settingsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    showNotification('账号设置功能开发中...', 'info');
                });
            }
        } else {
            // 显示登录按钮
            userSection.innerHTML = `
                <button class="auth-btn" id="openAuthModal">登录 / 注册</button>
            `;

            // 绑定打开模态框按钮
            const openAuthBtn = document.getElementById('openAuthModal');
            if (openAuthBtn) {
                openAuthBtn.addEventListener('click', () => {
                    openAuthModal();
                });
            }
        }
    }

    // 绑定事件
    bindEvents() {
        // 监听存储变化（多标签页同步）
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser') {
                this.currentUser = this.getCurrentUser();
                this.updateUI();
            }
        });
    }

    // 检查登录状态（供表单提交使用）
    requireLogin(callback) {
        if (this.isLoggedIn()) {
            callback();
        } else {
            showLoginRequiredModal(callback);
        }
    }
}

// 创建全局认证系统实例
const authSystem = new AuthSystem();

// 打开认证模态框
function openAuthModal(defaultTab = 'login') {
    let modal = document.getElementById('authModal');
    
    if (!modal) {
        // 创建模态框
        modal = createAuthModal();
        document.body.appendChild(modal);
    }

    modal.classList.add('active');
    switchAuthTab(defaultTab);
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭认证模态框
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 创建认证模态框
function createAuthModal() {
    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>欢迎</h2>
                <button class="modal-close" onclick="closeAuthModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">登录</button>
                    <button class="auth-tab" data-tab="register">注册</button>
                </div>

                <!-- 登录表单 -->
                <form id="loginForm" class="auth-form active">
                    <div class="form-group">
                        <label for="loginUsername">用户名或邮箱</label>
                        <input type="text" id="loginUsername" name="username" required>
                        <span class="error-message" id="loginUsernameError"></span>
                    </div>
                    <div class="form-group password-toggle">
                        <label for="loginPassword">密码</label>
                        <input type="password" id="loginPassword" name="password" required>
                        <button type="button" class="toggle-password-btn" onclick="togglePassword('loginPassword')">👁️</button>
                        <span class="error-message" id="loginPasswordError"></span>
                    </div>
                    <div class="form-footer">
                        <label>
                            <input type="checkbox" name="remember">
                            记住我
                        </label>
                        <a href="#" onclick="showNotification('找回密码功能开发中...', 'info'); return false;">忘记密码？</a>
                    </div>
                    <button type="submit" class="submit-btn">登录</button>
                </form>

                <!-- 注册表单 -->
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="registerUsername">用户名</label>
                        <input type="text" id="registerUsername" name="username" required minlength="3">
                        <span class="error-message" id="registerUsernameError"></span>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">邮箱</label>
                        <input type="email" id="registerEmail" name="email" required>
                        <span class="error-message" id="registerEmailError"></span>
                    </div>
                    <div class="form-group password-toggle">
                        <label for="registerPassword">密码</label>
                        <input type="password" id="registerPassword" name="password" required minlength="6">
                        <button type="button" class="toggle-password-btn" onclick="togglePassword('registerPassword')">👁️</button>
                        <span class="error-message" id="registerPasswordError"></span>
                    </div>
                    <div class="form-group password-toggle">
                        <label for="registerConfirmPassword">确认密码</label>
                        <input type="password" id="registerConfirmPassword" name="confirmPassword" required>
                        <button type="button" class="toggle-password-btn" onclick="togglePassword('registerConfirmPassword')">👁️</button>
                        <span class="error-message" id="registerConfirmPasswordError"></span>
                    </div>
                    <div class="form-footer">
                        <label>
                            <input type="checkbox" name="agree" required>
                            同意<a href="#" onclick="showNotification('用户协议功能开发中...', 'info'); return false;">用户协议</a>
                        </label>
                    </div>
                    <button type="submit" class="submit-btn">注册</button>
                </form>
            </div>
        </div>
    `;

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAuthModal();
        }
    });

    // 绑定标签切换
    const tabs = modal.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });

    // 绑定表单提交
    bindAuthForms(modal);

    return modal;
}

// 切换认证标签
function switchAuthTab(tabName) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    forms.forEach(form => {
        if (form.id === `${tabName}Form`) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
}

// 绑定认证表单
function bindAuthForms(modal) {
    // 登录表单
    const loginForm = modal.querySelector('#loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(loginForm);
    });

    // 注册表单
    const registerForm = modal.querySelector('#registerForm');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister(registerForm);
    });
}

// 处理登录
function handleLogin(form) {
    const username = form.querySelector('#loginUsername').value.trim();
    const password = form.querySelector('#loginPassword').value;

    if (!username || !password) {
        showNotification('请填写所有字段', 'error');
        return;
    }

    const result = authSystem.login(username, password);

    if (result.success) {
        showNotification(result.message, 'success');
        closeAuthModal();
        form.reset();
    } else {
        showNotification(result.message, 'error');
    }
}

// 处理注册
function handleRegister(form) {
    const username = form.querySelector('#registerUsername').value.trim();
    const email = form.querySelector('#registerEmail').value.trim();
    const password = form.querySelector('#registerPassword').value;
    const confirmPassword = form.querySelector('#registerConfirmPassword').value;
    const agree = form.querySelector('input[name="agree"]').checked;

    // 验证
    if (!username || !email || !password || !confirmPassword) {
        showNotification('请填写所有字段', 'error');
        return;
    }

    if (username.length < 3) {
        showNotification('用户名至少3个字符', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('密码至少6个字符', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('两次密码不一致', 'error');
        return;
    }

    if (!agree) {
        showNotification('请同意用户协议', 'error');
        return;
    }

    const result = authSystem.register(username, email, password);

    if (result.success) {
        showNotification(result.message + ' 请登录', 'success');
        form.reset();
        switchAuthTab('login');
    } else {
        showNotification(result.message, 'error');
    }
}

// 切换密码可见性
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const btn = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

// 显示登录要求模态框
function showLoginRequiredModal(callback) {
    let modal = document.getElementById('loginRequiredModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loginRequiredModal';
        modal.className = 'login-required-modal';
        modal.innerHTML = `
            <div class="login-required-content">
                <div class="login-required-icon">🔒</div>
                <h3>需要登录</h3>
                <p>此操作需要登录后才能继续，请先登录您的账号</p>
                <div class="login-required-actions">
                    <button class="btn-cancel" onclick="closeLoginRequiredModal()">取消</button>
                    <button class="btn-go-login" onclick="goToLogin()">去登录</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeLoginRequiredModal();
            }
        });
    }

    // 保存回调函数
    modal.dataset.callback = callback ? 'pending' : '';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭登录要求模态框
function closeLoginRequiredModal() {
    const modal = document.getElementById('loginRequiredModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 去登录
function goToLogin() {
    closeLoginRequiredModal();
    openAuthModal('login');
}

// 通知函数（如果不存在则创建）
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10002;
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-success {
                background: #4caf50;
                color: white;
            }
            
            .notification-error {
                background: #f44336;
                color: white;
            }
            
            .notification-info {
                background: #2196f3;
                color: white;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        if (!document.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 导出全局变量和函数
window.authSystem = authSystem;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.togglePassword = togglePassword;
window.closeLoginRequiredModal = closeLoginRequiredModal;
window.goToLogin = goToLogin;
