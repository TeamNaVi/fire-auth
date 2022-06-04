const page_title = document.getElementById("page-title");
// const page_content = document.getElementById("page-content");

// const userName = document.getElementById("userName");
// const userMail = document.getElementById("userMail");
// const userSignUpDate = document.getElementById("userSignUpDate");
// const userLastLogin = document.getElementById("userLastLogin");

const li_Dashboard = document.getElementById("li_Dashboard");
const li_Storage = document.getElementById("li_Storage");
const li_Streaming = document.getElementById("li_Streaming");
// const li_DeepLearning = document.getElementById("li_DeepLearning");

const profile = document.getElementById("profile");
const logOut = document.getElementById("logOut");

const auth = firebase.auth();

logOut.addEventListener("click", () => {
  //signOut() is a built in firebase function responsible for signing a user out
  auth
    .signOut()
    .then(() => {
      window.location.assign("../");
    })
    .catch((error) => {
      console.error(error);
    });
});

// Just to print your current user information so you can the changes once done
auth.onAuthStateChanged((user) => {
  // console.log(user);
  // menu_title.innerText = user.displayName + "님";
  page_title.innerText = user.displayName + "님";

  // // userName.innerText = user.displayName;
  // $("#userName").text(user.displayName); // jquery 사용해봤음
  // userMail.innerText = user.email;

  // // 시간표시 개 노가다네 이거
  // const creationTimeGMT = user.metadata.creationTime;
  // const lastSignInTimeGMT = user.metadata.lastSignInTime;

  // const creationTimeKOR = new Date(creationTimeGMT);
  // const lastSignInTimeKOR = new Date(lastSignInTimeGMT);

  // // format : Thu, 05 May 2022 11:17:34 GMT
  // // foramt : Thu May 05 2022 20:17:34 GMT+0900 (한국 표준시)
  // // creationTime
  // const yearCT = creationTimeKOR.getFullYear();
  // const monthCT = creationTimeKOR.getMonth() + 1;
  // const dayCT = creationTimeKOR.getDate();
  // const weekdayCT = creationTimeKOR.getDay();
  // const hourCT = creationTimeKOR.getHours();
  // const minuteCT = creationTimeKOR.getMinutes();
  // const secondCT = creationTimeKOR.getSeconds();

  // // lastSignInTime
  // const yearLSIT = lastSignInTimeKOR.getFullYear();
  // const monthLSIT = lastSignInTimeKOR.getMonth() + 1;
  // const dayLSIT = lastSignInTimeKOR.getDate();
  // const weekdayLSIT = lastSignInTimeKOR.getDay();
  // const hourLSIT = lastSignInTimeKOR.getHours();
  // const minuteLSIT = lastSignInTimeKOR.getMinutes();
  // const secondLSIT = lastSignInTimeKOR.getSeconds();

  // // weekTable
  // const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // // 가입 시간 표시
  // userSignUpDate.innerText =
  //   yearCT +
  //   "년 " +
  //   monthCT +
  //   "월 " +
  //   dayCT +
  //   "일 " +
  //   weekdays[weekdayCT] +
  //   "요일 " +
  //   hourCT +
  //   ":" +
  //   minuteCT +
  //   ":" +
  //   secondCT +
  //   " GMT+0900";

  // // 최근 로그인 시간 표시
  // userLastLogin.innerText =
  //   yearLSIT +
  //   "년 " +
  //   monthLSIT +
  //   "월 " +
  //   dayLSIT +
  //   "일 " +
  //   weekdays[weekdayLSIT] +
  //   "요일 " +
  //   hourLSIT +
  //   ":" +
  //   minuteLSIT +
  //   ":" +
  //   secondLSIT +
  //   " GMT+0900";
});

//Go to profile page
profile.addEventListener("click", () => {
  window.location.assign("../profile");
});

//Go to Dashboard page
li_Dashboard.addEventListener("click", () => {
  const user = auth.currentUser;
  // admin@admin.admin uid
  if (user.uid == "3RS7jsw7asP6Owe5pZomy5KGwkf1") {
    window.location.assign("../dashboardAdmin");
  } else {
    window.location.assign("../dashboard");
  }
});

//Go to Storage page
li_Storage.addEventListener("click", () => {
  const user = auth.currentUser;
  // admin@admin.admin uid
  if (user.uid == "3RS7jsw7asP6Owe5pZomy5KGwkf1") {
    window.location.assign("../storageAdmin");
  } else {
    window.location.assign("../storage");
  }
});

//Go to Streaming page
li_Streaming.addEventListener("click", () => {
  const user = auth.currentUser;
  // admin@admin.admin uid
  if (user.uid == "3RS7jsw7asP6Owe5pZomy5KGwkf1") {
    window.location.assign("../streaming");
  } else {
    window.location.assign("../streaming");
  }
});

//Go to Deep Learning page
// li_DeepLearning.addEventListener("click", () => {
//   const user = auth.currentUser;
//   // admin@admin.admin uid
//   if (user.uid == "3RS7jsw7asP6Owe5pZomy5KGwkf1") {
//     window.location.assign("../deepLearning");
//   } else {
//     window.location.assign("../deepLearning");
//   }
// });

let Dashboard = (() => {
  let global = {
    tooltipOptions: {
      placement: "right",
    },
    menuClass: ".c-menu",
  };

  // 리스트 item 활성화
  // let menuChangeActive = (el) => {
  //   let hasSubmenu = $(el).hasClass("has-submenu");
  //   $(global.menuClass + " .is-active").removeClass("is-active");
  //   $(el).addClass("is-active");

  //   // 하위메뉴 있으면
  //   // if (hasSubmenu) {
  //   //   $(el).find("ul").slideDown();
  //   // }
  // };

  let sidebarChangeWidth = () => {
    let $menuItemsTitle = $("li .menu-item__title");

    $("body").toggleClass("sidebar-is-reduced sidebar-is-expanded");
    $(".hamburger-toggle").toggleClass("is-opened");

    if ($("body").hasClass("sidebar-is-expanded")) {
      $('[data-toggle="tooltip"]').tooltip("destroy");
    } else {
      $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
    }
  };

  return {
    init: () => {
      $(".js-hamburger").on("click", sidebarChangeWidth);

      // item selected
      // $(".js-menu li").on("click", (e) => {
      //   menuChangeActive(e.currentTarget);
      // });

      $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
    },
  };
})();

Dashboard.init();
