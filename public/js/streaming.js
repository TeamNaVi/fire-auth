const li_Dashboard = document.getElementById("li_Dashboard");
const li_Storage = document.getElementById("li_Storage");
const li_Streaming = document.getElementById("li_Streaming");
const li_DeepLearning = document.getElementById("li_DeepLearning");

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
  // menu_title.innerHTML = user.displayName + "님";
  // page_title.innerHTML = user.displayName + "님의 Dashboard";
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
li_DeepLearning.addEventListener("click", () => {
  const user = auth.currentUser;
  // admin@admin.admin uid
  if (user.uid == "3RS7jsw7asP6Owe5pZomy5KGwkf1") {
    window.location.assign("../deepLearning");
  } else {
    window.location.assign("../deepLearning");
  }
});

let Dashboard = (() => {
  let global = {
    tooltipOptions: {
      placement: "right",
    },
    tooltipOptionsBottom: {
      placement: "bottom",
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
      $('[data-toggle="tooltipB"]').tooltip(global.tooltipOptionsBottom);
    },
  };
})();

Dashboard.init();
