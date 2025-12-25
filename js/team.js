// 团队成员页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    initTeamCards();
    initAnimations();
});

// 初始化团队卡片交互
function initTeamCards() {
    const cards = document.querySelectorAll('.team-member-card');
    
    cards.forEach(card => {
        // 添加点击事件（可以展开成员详细信息）
        card.addEventListener('click', function() {
            const memberName = this.querySelector('.member-name').textContent;
            const memberTitle = this.querySelector('.member-title').textContent;
            console.log('点击了成员:', memberName, '-', memberTitle);
        });

        // 添加悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
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

    // 观察统计部分
    const statsSection = document.querySelector('.team-stats');
    if (statsSection) {
        const stats = statsSection.querySelectorAll('.stat-item');
        stats.forEach(stat => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(stat);
        });
    }
}

// 成员邮件链接处理
document.querySelectorAll('.contact-icon[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // 如果需要自定义邮件功能，可以在这里处理
        console.log('点击了邮件联系', this.href);
    });
});

// 成员详情模态框（可选功能）
function showMemberModal(memberName, memberTitle, memberBio) {
    console.log(`显示成员详情: ${memberName}`);
    // 这里可以实现一个模态框来显示更多成员信息
}

// 导出函数供外部调用
window.showMemberModal = showMemberModal;
