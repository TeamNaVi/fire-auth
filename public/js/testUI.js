// const menu_title = document.getElementById("menu_title");
// const page_title = document.getElementById("page_title");
// const logOut = document.getElementById("logOut");

// const auth = firebase.auth();

// logOut.addEventListener("click", () => {
//   //signOut() is a built in firebase function responsible for signing a user out
//   auth
//     .signOut()
//     .then(() => {
//       window.location.assign("../");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });

// // Just to print your current user information so you can the changes once done
// auth.onAuthStateChanged((user) => {
//   console.log(user);
//   menu_title.innerHTML = user.displayName + "님";
//   page_title.innerHTML = user.displayName + "님의 Dashboard";
// });

let Dashboard = (() => {
  let global = {
    tooltipOptions: {
      placement: "right",
    },
    menuClass: ".c-menu",
  };

  let menuChangeActive = (el) => {
    let hasSubmenu = $(el).hasClass("has-submenu");
    $(global.menuClass + " .is-active").removeClass("is-active");
    $(el).addClass("is-active");

    // 하위메뉴 있으면
    if (hasSubmenu) {
      $(el).find("ul").slideDown();
    }
  };

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

      $(".js-menu li").on("click", (e) => {
        menuChangeActive(e.currentTarget);
      });

      $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
    },
  };
})();

Dashboard.init();
