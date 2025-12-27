// 联系我们页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
    initAnimations();
});

// 初始化联系表单
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm(this);
    });

    // 实时表单验证
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '';
        });
    });
}

// 验证表单字段
function validateField(field) {
    let isValid = true;
    let errorMessage = '';

    if (field.name === 'name') {
        if (field.value.trim().length < 2) {
            isValid = false;
            errorMessage = '请输入有效的姓名';
        }
    } else if (field.name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = '请输入有效的邮箱地址';
        }
    } else if (field.name === 'phone' && field.value) {
        const phoneRegex = /^[\d\-\+\(\)\s]+$/;
        if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = '请输入有效的电话号码';
        }
    } else if (field.name === 'subject' || field.name === 'message') {
        if (field.value.trim().length === 0) {
            isValid = false;
            errorMessage = '此字段不能为空';
        }
    }

    if (!isValid) {
        field.style.borderColor = '#f44336';
        field.title = errorMessage;
    } else {
        field.style.borderColor = '';
        field.title = '';
    }

    return isValid;
}

// 提交联系表单
async function submitContactForm(form) {
    // 验证所有必填字段
    const requiredFields = form.querySelectorAll('[required]');
    let isFormValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification('请填写所有必填项', 'error');
        return;
    }

    // 获取表单数据
    const formData = new FormData(form);
    const data = {
        subject: formData.get('subject'),
        body: `姓名: ${formData.get('name')}\n邮箱: ${formData.get('email')}\n电话: ${formData.get('phone')}\n\n${formData.get('message')}`,
        tags: ['contact', formData.get('subject')]
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '发送中...';

    try {
        // 调用后端 API（不需要登录）
        const response = await fetch('http://localhost:3001/api/messages', {
            method: 'POST',
            headers: authSystem.isLoggedIn() ? authSystem.getAuthHeaders() : { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || '发送失败');
        }

        // 显示成功消息
        showNotification('感谢您的消息！我们会在24小时内回复您。', 'success');

        // 重置表单
        form.reset();
        
        // 清除所有样式
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '';
        });

        // 显示成功状态
        displayFormSuccess();
    } catch (error) {
        console.error('发送错误:', error);
        showNotification(error.message || '发送失败，请稍后重试', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// 显示表单成功状态
function displayFormSuccess() {
    const formSection = document.querySelector('.contact-form-section');
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.innerHTML = `
        <div style="
            background: #4caf50;
            color: white;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        ">
            <span style="font-size: 1.3rem;">✓</span>
            <span>消息已成功发送！</span>
        </div>
    `;

    const form = formSection.querySelector('form');
    form.parentNode.insertBefore(successMessage, form);

    // 3秒后移除成功消息
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// 初始化常见问题（FAQ）
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item, index) => {
        // 添加点击效果
        const summary = item.querySelector('summary');
        summary.addEventListener('click', function() {
            // 关闭其他打开的项
            faqItems.forEach((other, otherIndex) => {
                if (otherIndex !== index && other.hasAttribute('open')) {
                    other.removeAttribute('open');
                }
            });
        });
    });
}

// 初始化动画效果
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // 观察信息卡片
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// 显示通知消息
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
            z-index: 1000;
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
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 社交媒体链接处理
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const title = this.getAttribute('title');
        console.log('点击了社交媒体:', title);
        showNotification(`正在打开 ${title}...`, 'info');
    });
});

// 导出函数
window.showNotification = showNotification;
