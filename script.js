// 获取页面相关DOM元素
const watchAdsBtn = document.getElementById('watch-ads-btn');
const balanceElement = document.getElementById('balance');
const withdrawBtn = document.getElementById('withdraw-btn');
const historyBtn = document.getElementById('history-btn');
const settingsBtn = document.getElementById('settings-btn');
const withdrawModal = document.getElementById('withdraw-modal');
const historyModal = document.getElementById('history-modal');
const settingsModal = document.getElementById('settings-modal');
const closeWithdrawModalBtn = document.getElementById('close-withdraw-modal-btn');
const closeHistoryModalBtn = document.getElementById('close-history-modal-btn');
const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
const confirmWithdrawBtn = document.getElementById('confirm-withdraw-btn');
const withdrawAmountInput = document.getElementById('withdraw-amount');
const transactionIdElement = document.getElementById('transaction-id');
const historyList = document.getElementById('history-list');
const payeerAccountInput = document.getElementById('payeer-account');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// 用于存储余额数据的键名
const BALANCE_KEY = 'balance';
// 用于存储提现历史记录数据的键名
const WITHDRAW_HISTORY_KEY = 'withdrawHistory';
// 用于存储Payeer账户数据的键名
const PAYEER_ACCOUNT_KEY = 'payeerAccount';

// 初始化数据
let balance = 0;
let withdrawHistory = [];
let payeerAccount = '';

// 页面加载时读取本地存储数据并初始化相关变量和界面显示
window.addEventListener('load', () => {
    // 读取余额数据
    const savedBalance = localStorage.getItem(BALANCE_KEY);
    balance = savedBalance? parseFloat(savedBalance) : 0;
    updateBalanceDisplay();

    // 读取提现历史记录数据
    const savedWithdrawHistory = localStorage.getItem(WITHDRAW_HISTORY_KEY);
    if (savedWithdrawHistory) {
        try {
            withdrawHistory = JSON.parse(savedWithdrawHistory);
            displayHistory();
        } catch (error) {
            console.error('解析提现历史记录数据出错:', error);
            withdrawHistory = [];
        }
    }

    // 读取Payeer账户数据
    const savedPayeerAccount = localStorage.getItem(PAYEER_ACCOUNT_KEY);
    payeerAccount = savedPayeerAccount || '';
});

// 更新余额显示在页面上的函数
function updateBalanceDisplay() {
    balanceElement.textContent = `$${balance.toFixed(2)}`;
}

// 处理提现按钮点击事件，先验证Payeer账户和余额是否足够
withdrawBtn.addEventListener('click', () => {
    if (payeerAccount === '') {
        alert('请先设置您的Payeer账户。');
        return;
    }
    if (balance <= 0) {
        alert('余额不足，无法提现。');
        return;
    }
    withdrawModal.style.display = 'flex';
});

// 关闭提现弹窗
closeWithdrawModalBtn.addEventListener('click', () => {
    withdrawModal.style.display = 'none';
});

// 显示历史记录弹窗并加载提现记录
historyBtn.addEventListener('click', () => {
    historyModal.style.display = 'flex';
    displayHistory();
});

// 关闭历史记录弹窗
closeHistoryModalBtn.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

// 打开设置弹窗
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
});

// 关闭设置弹窗
closeSettingsModalBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// 保存Payeer账户设置到本地存储
saveSettingsBtn.addEventListener('click', () => {
    payeerAccount = payeerAccountInput.value.trim();
    localStorage.setItem(PAYEER_ACCOUNT_KEY, payeerAccount);
    alert('Payeer账户保存成功！');
    settingsModal.style.display = 'none';
});

// 点击“确认提现”按钮执行提现操作并更新相关数据和显示
confirmWithdrawBtn.addEventListener('click', () => {
    const withdrawAmount = parseFloat(withdrawAmountInput.value);
    if (withdrawAmount <= balance && withdrawAmount > 0) {
        balance -= withdrawAmount;
        updateBalanceDisplay();
        saveBalanceToLocalStorage();

        const transactionId = generateTransactionId();
        transactionIdElement.textContent = `交易ID: ${transactionId}`;

        const transaction = {
            id: transactionId,
            amount: withdrawAmount,
            date: new Date().toLocaleString(),
            account: payeerAccount,
            status: 'unpaid'
        };

        withdrawHistory.push(transaction);
        withdrawAmountInput.value = '';
        saveWithdrawHistoryToLocalStorage();

        alert('提现成功！');
    } else {
        alert('提现金额无效，请重新输入。');
    }
});

// 生成随机交易ID的函数
function generateTransactionId() {
    return Math.random().toString(36).substring(2, 15);
}

// 将提现历史记录数据保存到本地存储的函数
function saveWithdrawHistoryToLocalStorage() {
    localStorage.setItem(WITHDRAW_HISTORY_KEY, JSON.stringify(withdrawHistory));
}

// 显示提现记录列表的函数
function displayHistory() {
    historyList.innerHTML = '';
    if (withdrawHistory.length === 0) {
        historyList.innerHTML = '<p>暂无提现记录。</p>';
    } else {
        withdrawHistory.forEach(transaction => {
            const recordDiv = createHistoryRecordDiv(transaction);
            historyList.appendChild(recordDiv);
        });
    }
}

// 创建单个提现记录DOM元素的函数
function createHistoryRecordDiv(transaction) {
    const recordDiv = document.createElement('div');
    recordDiv.classList.add('history-record-card');
    recordDiv.innerHTML = `
        <div class="history-record">
            <p><strong>金额:</strong> $${transaction.amount.toFixed(2)}</p>
            <p><strong>日期:</strong> ${transaction.date}</p>
            <p><strong>交易ID:</strong> ${transaction.id}</p>
            <p><strong>Payeer账户:</strong> ${transaction.account}</p>
            <span class="payment-status" style="background-color: ${transaction.status === 'paid'? 'green' : 'red'};"></span>
        </div>
    `;
    return recordDiv;
}

// 点击看广告按钮增加余额（优化后的逻辑，通过标志位控制只有广告展示完成后才增加余额）
watchAdsBtn.addEventListener('click', () => {
    const showAd = () => {
        show_8619727().then(() => {
            // 广告展示成功后，增加余额
            balance += 1;
            // 更新页面上的余额显示
            updateBalanceDisplay();
            // 将更新后的余额数据保存到本地存储
            saveBalanceToLocalStorage();
            console.log('观看广告成功，余额已增加，当前余额为：', balance);
        }).catch((error) => {
            // 如果广告展示出现错误，进行相应的错误处理，比如提示用户稍后再试等
            console.error('观看广告出现错误：', error);
        });
    };
    showAd();
});

// 将余额数据保存到本地存储的函数
function saveBalanceToLocalStorage() {
    localStorage.setItem(BALANCE_KEY, balance.toFixed(2));
}