// 文章发表页面的交互功能
document.addEventListener('DOMContentLoaded', function() {
    initPublicationsMenu();
    initForms();
    initFileUpload();
});

// 初始化菜单切换
function initPublicationsMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标section的id
            const targetSection = this.getAttribute('data-section');
            
            // 移除所有active类
            menuItems.forEach(m => m.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // 添加active类到当前项
            this.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // 平滑滚动到顶部
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// 初始化表单提交
function initForms() {
    // 论文投稿表单
    const submissionForm = document.querySelector('.submission-form');
    if (submissionForm) {
        submissionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSubmissionForm(this);
        });
    }

    // 意见反馈表单
    const feedbackForm = document.querySelector('.feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFeedbackForm(this);
        });
    }
}

// 处理论文投稿表单
function handleSubmissionForm(form) {
    const formData = new FormData(form);
    
    // 验证表单
    if (!formData.get('paper-type') || !formData.get('publisher') || !formData.get('paper-file')) {
        alert('请填写所有必填项');
        return;
    }

    // 这里可以添加实际的提交逻辑（发送到服务器）
    console.log('投稿数据:', {
        paperType: formData.get('paper-type'),
        publisher: formData.get('publisher'),
        file: formData.get('paper-file').name
    });

    // 显示成功消息
    showNotification('感谢您的投稿！我们会在5个工作日内审核您的论文。', 'success');
    
    // 重置表单
    form.reset();
    document.querySelector('.file-upload').classList.remove('has-file');
}

// 处理意见反馈表单
function handleFeedbackForm(form) {
    const formData = new FormData(form);
    
    // 验证表单
    if (!formData.get('feedback-publisher') || !formData.get('feedback-content')) {
        alert('请填写所有必填项');
        return;
    }

    // 这里可以添加实际的提交逻辑
    console.log('反馈数据:', {
        publisher: formData.get('feedback-publisher'),
        feedback: formData.get('feedback-content'),
        contact: formData.get('contact-agree') ? '同意' : '不同意'
    });

    showNotification('感谢您的反馈！我们将认真考虑您的建议。', 'success');
    form.reset();
}

// 初始化文件上传
function initFileUpload() {
    const fileUpload = document.querySelector('.file-upload');
    const fileInput = document.querySelector('#paper-file');

    if (!fileUpload || !fileInput) return;

    // 点击上传区域触发文件选择
    fileUpload.addEventListener('click', function() {
        fileInput.click();
    });

    // 拖拽上传
    fileUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.background = '#f0f4ff';
        this.style.borderColor = '#764ba2';
    });

    fileUpload.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.background = '#f9f9f9';
        this.style.borderColor = '#667eea';
    });

    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.background = '#f9f9f9';
        this.style.borderColor = '#667eea';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateFileUploadUI(files[0]);
        }
    });

    // 文件选择变化
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            updateFileUploadUI(this.files[0]);
        }
    });
}

// 更新文件上传UI
function updateFileUploadUI(file) {
    const fileUpload = document.querySelector('.file-upload');
    const uploadHint = document.querySelector('.upload-hint');

    // 检查文件类型
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        alert('请上传PDF或Word文档');
        return;
    }

    // 检查文件大小 (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('文件过大，请上传不超过50MB的文件');
        return;
    }

    // 更新UI
    uploadHint.innerHTML = `
        <p style="color: var(--secondary-color); font-weight: 600;">✓ 已选择文件</p>
        <p style="margin: 0.5rem 0; font-size: 0.9rem;">${file.name}</p>
        <p style="margin: 0; font-size: 0.85rem; color: #999;">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
    `;
    fileUpload.classList.add('has-file');
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

// 下载按钮功能
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const fileName = this.closest('.download-item').querySelector('h4').textContent;
        showNotification(`开始下载: ${fileName}`, 'info');
        // 实际的下载逻辑应该在这里实现
    });
});
