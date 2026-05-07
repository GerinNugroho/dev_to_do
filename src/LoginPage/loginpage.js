import terminalIcon from './assets/terminal.svg';
import personIcon from './assets/person.svg';
import lockIcon from './assets/lock.svg';
import passshowIcon from './assets/passshow.svg';
import passhideIcon from './assets/passhide.svg';
import signinIcon from './assets/signin.svg';

export const LoginPage = (showSuccessBanner = false) => {
  return `
    <div class="logincointainer">
        <div class="iconheader"><img src="${terminalIcon}" /></div>
        <h2 class="signintext">Sign in to DevtoDo</h2>

        ${showSuccessBanner ? `
        <div class="successbanner" id="successbanner">
            <span>Your account was created successfully! Please sign in to continue.</span>
            <span class="successclose" id="closebanner">&#x2715;</span>
        </div>` : ''}

        <div class="formgroup">
            <label>Username</label>
            <div class="inputwrapper">
                <img src="${personIcon}" class="inputimgicon" />
                <input type="text" id="loginname" placeholder="Username" spellcheck="false" />
            </div>
            <span class="fielderror" id="loginnameError">Username cannot be blank</span>
        </div>

        <div class="formgroup">
            <label>Password</label>
            <div class="inputwrapper">
                <img src="${lockIcon}" class="inputimgicon" />
                <input type="password" id="loginpassword" placeholder="Password" />
                <img src="${passshowIcon}" class="togglepass" id="toggleloginpass" />
            </div>
            <span class="fielderror" id="loginpassError">Password cannot be blank</span>
        </div>

        <p id="loginerror" style="color: #ff6b6b; font-size: 12px; margin-bottom: 10px; display: none;">Incorrect Username or Password!</p>

        <button class="btnsignin" id="btnloginsubmit">
            Sign In
            <img src="${signinIcon}" style="width:16px;height:16px;filter:invert(1);" />
        </button>

        <p class="footertext">New to DevtoDo? <span class="linksignup" id="gotoregister">Create an account</span></p>
    </div>
  `;
};

export const initLoginLogic = (onLoginSuccess, onSwitchToRegister) => {
    const btn = document.querySelector('#btnloginsubmit');
    const toReg = document.querySelector('#gotoregister');
    const nameInput = document.querySelector('#loginname');
    const passInput = document.querySelector('#loginpassword');
    const errorMsg = document.querySelector('#loginerror');
    const toggleBtn = document.querySelector('#toggleloginpass');
    const closeBanner = document.querySelector('#closebanner');

    let passVisible = false;
    toggleBtn?.addEventListener('click', () => {
        passVisible = !passVisible;
        passInput.type = passVisible ? 'text' : 'password';
        toggleBtn.src = passVisible
            ? new URL('./assets/passhide.svg', import.meta.url).href
            : new URL('./assets/passshow.svg', import.meta.url).href;
    });

    closeBanner?.addEventListener('click', () => {
        document.querySelector('#successbanner').style.display = 'none';
    });

    nameInput?.addEventListener('blur', () => validateField(nameInput, 'loginnameError'));
    passInput?.addEventListener('blur', () => validateField(passInput, 'loginpassError'));

    nameInput?.addEventListener('focus', () => clearError(nameInput, 'loginnameError'));
    passInput?.addEventListener('focus', () => clearError(passInput, 'loginpassError'));

    btn?.addEventListener('click', () => {
        const nameOk = validateField(nameInput, 'loginnameError');
        const passOk = validateField(passInput, 'loginpassError');

        if (!nameOk || !passOk) return;

        const name = nameInput.value;
        const pass = passInput.value;
        const savedData = JSON.parse(localStorage.getItem('user_db'));

        if (savedData && name === savedData.name && pass === savedData.pass) {
            errorMsg.style.display = 'none';
            onLoginSuccess();
        } else {
            errorMsg.style.display = 'block';
        }
    });

    toReg?.addEventListener('click', onSwitchToRegister);
};

function validateField(input, errorId) {
    const errorEl = document.querySelector('#' + errorId);
    if (!input.value.trim()) {
        input.classList.add('inputerror');
        errorEl.style.display = 'block';
        return false;
    }
    input.classList.remove('inputerror');
    errorEl.style.display = 'none';
    return true;
}

function clearError(input, errorId) {
    input.classList.remove('inputerror');
    document.querySelector('#' + errorId).style.display = 'none';
}