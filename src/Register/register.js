import terminalIcon from './assets/terminal.svg';
import personIcon from './assets/person.svg';
import lockIcon from './assets/lock.svg';
import arrowIcon from './assets/arrow-right.svg';
import passshowIcon from './assets/passshow.svg';
import passhideIcon from './assets/passhide.svg';
import atIcon from './assets/at.svg';
import signinIcon from './assets/signin.svg';

export const RegisterPage = () => {
  return `
    <div class="logincointainer">
        <div class="iconheader"><img src="${terminalIcon}" /></div>
        <h2 class="signintext">Sign up for DevtoDo</h2>

        <div class="formgroup">
            <label>Full Name</label>
            <div class="inputwrapper">
                <img src="${personIcon}" class="inputimgicon" />
                <input type="text" id="regfullname" placeholder="Enter your full name" />
            </div>
            <span class="fielderror" id="regfullnameError">Full name cannot be blank</span>
        </div>

        <div class="formgroup">
            <label>Username</label>
            <div class="inputwrapper">
                <img src="${atIcon}" class="inputimgicon" />
                <input type="text" id="regname" placeholder="Enter your username" />
            </div>
            <span class="fielderror" id="regnameError">Username cannot be blank</span>
        </div>

        <div class="formgroup">
            <label>Password</label>
            <div class="inputwrapper">
                <img src="${lockIcon}" class="inputimgicon" />
                <input type="password" id="regpassword" placeholder="Min. 8 characters" />
                <img src="${passshowIcon}" class="togglepass" id="toggleregpass" />
            </div>
            <span class="fielderror" id="regpassError">Password cannot be blank</span>
        </div>

        <div class="formgroup">
            <label>Confirm Password</label>
            <div class="inputwrapper">
                <img src="${lockIcon}" class="inputimgicon" />
                <input type="password" id="regpasswordconfirm" placeholder="Re-enter your password" />
                <img src="${passshowIcon}" class="togglepass" id="toggleregpassconfirm" />
            </div>
            <span class="fielderror" id="regpassconfirmError">Please confirm your password!</span>
        </div>

        <button class="btnsignin" id="btnregsubmit">
            Register
            <img src="${signinIcon}" style="width:16px;height:16px;filter:invert(1);" />
        </button>
        <p class="footertext">Already have an account? <span class="linksignup" id="gotologin">Sign In</span></p>
    </div>
  `;
};

export const initRegisterLogic = (onSwitchToLogin) => {
    const fullnameInput = document.querySelector('#regfullname');
    const nameInput = document.querySelector('#regname');
    const passInput = document.querySelector('#regpassword');
    const passConfirmInput = document.querySelector('#regpasswordconfirm');
    const togglepass = document.querySelector('#toggleregpass');
    const togglepassconfirm = document.querySelector('#toggleregpassconfirm');

    let passVisible = false;
    togglepass?.addEventListener('click', () => {
        passVisible = !passVisible;
        passInput.type = passVisible ? 'text' : 'password';
        togglepass.src = passVisible
            ? new URL('./assets/passhide.svg', import.meta.url).href
            : new URL('./assets/passshow.svg', import.meta.url).href;
    });

    let passConfirmVisible = false;
    togglepassconfirm?.addEventListener('click', () => {
        passConfirmVisible = !passConfirmVisible;
        passConfirmInput.type = passConfirmVisible ? 'text' : 'password';
        togglepassconfirm.src = passConfirmVisible
            ? new URL('./assets/passhide.svg', import.meta.url).href
            : new URL('./assets/passshow.svg', import.meta.url).href;
    });

    fullnameInput?.addEventListener('blur', () => validateField(fullnameInput, 'regfullnameError', 'Full name cannot be blank'));
    nameInput?.addEventListener('blur', () => validateField(nameInput, 'regnameError', 'Please fill in your username!'));
    passInput?.addEventListener('blur', () => validatePass(passInput, 'regpassError'));
    passConfirmInput?.addEventListener('blur', () => validateConfirm());

    fullnameInput?.addEventListener('focus', () => clearError(fullnameInput, 'regfullnameError'));
    nameInput?.addEventListener('focus', () => clearError(nameInput, 'regnameError'));
    passInput?.addEventListener('focus', () => clearError(passInput, 'regpassError'));
    passConfirmInput?.addEventListener('focus', () => clearError(passConfirmInput, 'regpassconfirmError'));

    document.querySelector('#btnregsubmit')?.addEventListener('click', () => {
        const fullnameOk = validateField(fullnameInput, 'regfullnameError', 'Full name cannot be blank');
        const nameOk = validateField(nameInput, 'regnameError', 'Please fill in your username!');
        const passOk = validatePass(passInput, 'regpassError');
        const confirmOk = validateConfirm();

        if (!fullnameOk || !nameOk || !passOk || !confirmOk) return;

        const fullname = fullnameInput.value.trim();
        const name = nameInput.value.trim();
        const pass = passInput.value.trim();

        localStorage.setItem('user_db', JSON.stringify({ fullname, name, pass }));
        localStorage.setItem('just_registered', 'true');

        onSwitchToLogin(true);
    });

    document.querySelector('#gotologin')?.addEventListener('click', () => onSwitchToLogin(false));
};

function validateField(input, errorId, message) {
    const errorEl = document.querySelector('#' + errorId);
    if (!input.value.trim()) {
        input.classList.add('inputerror');
        errorEl.innerText = message;
        errorEl.style.display = 'block';
        return false;
    }
    clearError(input, errorId);
    return true;
}

function validatePass(input, errorId) {
    const errorEl = document.querySelector('#' + errorId);
    if (!input.value.trim()) {
        input.classList.add('inputerror');
        errorEl.innerText = 'Please fill in your password';
        errorEl.style.display = 'block';
        return false;
    }
    else if (input.value.length < 8) {
        input.classList.add('inputerror');
        errorEl.innerText = 'Password must be at least 8 characters';
        errorEl.style.display = 'block';
        return false;
    }
    clearError(input, errorId);
    return true;
}

function validateConfirm() {
    const passInput = document.querySelector('#regpassword');
    const confirmInput = document.querySelector('#regpasswordconfirm');
    const errorEl = document.querySelector('#regpassconfirmError');

    if (!confirmInput.value.trim()) {
        confirmInput.classList.add('inputerror');
        errorEl.innerText = 'Please confirm your password!';
        errorEl.style.display = 'block';
        return false;
    }
    else if (confirmInput.value !== passInput.value) {
        confirmInput.classList.add('inputerror');
        errorEl.innerText = 'Passwords do not match';
        errorEl.style.display = 'block';
        return false;
    }
    clearError(confirmInput, 'regpassconfirmError');
    return true;
}

function clearError(input, errorId) {
    input.classList.remove('inputerror');
    document.querySelector('#' + errorId).style.display = 'none';
}