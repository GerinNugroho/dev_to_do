import logoutIcon from './assets/signout.svg';

export const DashboardPage = () => {
  return `
    <div class="dashboardcontainer">

        <aside class="sidebar">
            <div class="brand">DevToDo</div>
            <nav>
                <div class="navitem active">Dashboard</div>
                <div class="navitem">Activity Analytics</div>
                <div class="navitem">Settings</div>
            </nav>

            <div class="logoutbtn" id="logoutbtn">
                <img src="${logoutIcon}" style="width:16px;height:16px;filter:invert(1);" />
                Logout
            </div>
        </aside>

        <main class="maincontent">

            <header class="dashboardheader">
                <div>
                    <h1>Hello, <span id="usernamedisplay"></span>!</h1>
                    <p>You have 0 tasks remaining</p>
                </div>
                <div class="gitstatus">● GIT NOT CONNECTED</div>
            </header>

            <div class="inputsection">
                <input type="text" id="taskinput" placeholder="Input task..." />
                <input type="date" id="taskdeadline" class="dateinput" />
                <button id="addtaskbtn">+ Add Task</button>
            </div>

        </main>
    </div>
  `;
};

export const initDashboardLogic = (onLogout) => {

    const logoutBtn = document.querySelector('#logoutbtn');
    const usernameDisplay = document.querySelector('#usernamedisplay');

    const savedUser = JSON.parse(localStorage.getItem('user_db'));
    if (savedUser && usernameDisplay) {
        usernameDisplay.innerText = savedUser.fullname || savedUser.name;
    }

    logoutBtn.onclick = onLogout;
};