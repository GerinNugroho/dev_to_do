import { LoginPage, initLoginLogic } from "./LoginPage/loginpage.js";
import { RegisterPage, initRegisterLogic } from "./Register/register.js";
import { DashboardPage, initDashboardLogic } from "./Dashboard/dashboard.js";

const app = document.querySelector("#app");

function router(page, showBanner = false) {
  if (page === "dashboard") {
    document.body.style.display = "block";
    document.body.style.alignItems = "unset";
    document.body.style.justifyContent = "unset";

    app.innerHTML = DashboardPage();
    initDashboardLogic(() => {
      router("login");
    });
  } else {
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";

    if (page === "login") {
      app.innerHTML = LoginPage(showBanner);
      initLoginLogic(
        () => router("dashboard"),
        () => router("register"),
      );
    } else if (page === "register") {
      app.innerHTML = RegisterPage();
      initRegisterLogic((fromRegister) => router("login", fromRegister));
    }
  }
}

router("login");
