// 일반 사용자 전용

var firestore = firebase.firestore();
var storage = firebase.storage();

// DOM element
const addFileBtn = document.querySelector(".addBtn");
const addForm = document.querySelector(".addForm");
const closeAddFormBtn = document.querySelector(".fa-times");
const browseBtn = document.querySelector("#upload-file");
const labelBrowse = document.querySelector("label");
const checkBtn = document.querySelector(".fa-check-circle");
const fileTable1 = document.querySelector("#fileTable1"); //이미지
const fileTable2 = document.querySelector("#fileTable2"); //가중치
const loader = document.querySelector(".loader");
const targetTable = document.querySelector("#targetTable"); //대상 물체


// html element
const page_title = document.getElementById("page-title");
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

// var global
let fileBrowse = null;
let urlDownload = null;
let userUid = null;
let userEmail = null;
let target = null;

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

// upload.js
getAllTargets = function () {
  showHeaderTableT();
  firestore //데이터베이스
      .collection("targets") //데이터베이스 저장소
      .get()
      .then((data) => {
        data.forEach((element) => {
          showListTarget(element.data().name);
        });
      });
};
getAllFiles = function () {
  showHeaderTableW();
  firestore //데이터베이스
    .collection("weightsfile" + userUid) //데이터베이스 저장소
    .get()
    .then((data) => {
      let counter = 0;
      data.forEach((element) => {
        counter += 1;
        showListData(
          counter,
          element.data().fileName,
          element.data().fileLocation
        );
      });
    });
  showHeaderTableI();
  firestore //데이터베이스
    .collection("images" + userUid) //데이터베이스 저장소
    .get()
    .then((data) => {
      let counter = 0;
      data.forEach((element) => {
        //if(element.data().uploader !== userEmail){
        //  return; //continue랑 비슷한 역할을 foreach문에서 수행
        //}  해당 유저의 파일 필터링하는 기능이지만 컬렉션을 나눔으로서 불필요해짐
        counter += 1;
        showListImage(
          counter,
          element.data().fileName,
          element.data().fileLocation
        );
      });
    });
};

// function init input condition
inputInit = function () {
  fileBrowse = null;
  urlDownload = null;
  labelBrowse.innerHTML = "업로드할 파일 선택...";
};

// function add header table static
showHeaderTableW = function () {
  html = `
    <tr>
        <th class="tableVerySmall">No</th>
        <th>가중치파일 이름</th>
        <th class="tableSmall">다운로드 / 삭제</th>
    </tr>
    `;
  fileTable2.insertAdjacentHTML("beforeend", html);
};

showHeaderTableI = function () {
  html = `
    <tr>
        <th class="tableVerySmall">No</th>
        <th>이미지파일 이름</th>
        <th class="tableSmall">다운로드 / 삭제</th>
    </tr>
    `;
  fileTable1.insertAdjacentHTML("beforeend", html);
};

showHeaderTableT = function () {
  html = `
    <tr>
        <th>학습 대상 물체</th>
    </tr>
    `;
  targetTable.insertAdjacentHTML("beforeend", html);
};
// function show list of files
showListData = function (no, fileName, fileLoc) {
  html = `
    <tr id="id-%id%">
        <td class="tableVerySmall">%no%</td>
        <td>%fileName%</td>
        <td class="tableSmall">
            <a href="%url%" target="blank" download>
                <i class="fas fa-file-download"></i>
            </a>
            <i class="fas fa-trash-alt"></i>
        </td>
    </tr>
    `;
  newHtml = html.replace("%id%", fileName);
  newHtml = newHtml.replace("%no%", no);
  newHtml = newHtml.replace("%url%", fileLoc);
  newHtml = newHtml.replace("%fileName%", fileName);

  fileTable2.insertAdjacentHTML("beforeend", newHtml);
};
showListTarget = function (targetName) {
  html = `
    <tr id="id-%id%">
        <td>%fileName%</td>
    </tr>
    `;
  newHtml = html.replace("%id%", targetName);
  newHtml = newHtml.replace("%fileName%", targetName);

  targetTable.insertAdjacentHTML("beforeend", newHtml);
};



showListImage = function (no, fileName, fileLoc) {
  html = `
    <tr id="id-%id%">
        <td class="tableVerySmall">%no%</td>
        <td>%fileName%</td>
        <td class="tableSmall">
            <a href="%url%" target="blank" download>
                <i class="fas fa-file-download"></i>
            </a>
            <i class="fas fa-trash-alt"></i>
        </td>
    </tr>
    `;
  newHtml = html.replace("%id%", fileName);
  newHtml = newHtml.replace("%no%", no);
  newHtml = newHtml.replace("%url%", fileLoc);
  newHtml = newHtml.replace("%fileName%", fileName);

  fileTable1.insertAdjacentHTML("beforeend", newHtml);
};

// init system
auth.onAuthStateChanged((user) => {
  page_title.innerHTML = user.displayName + "님의 저장소";

  userUid = user.uid;
  userEmail = user.email;
  getAllFiles(); //유저 정보가 들어왔을 때 리스팅(안 그러면 아무것도 안 뜸)
  getAllTargets();
});

// handle add file btn
addFileBtn.addEventListener("click", () => {
  addForm.style.display = "block";
});

// handle close btn in addForm
closeAddFormBtn.addEventListener("click", () => {
  addForm.style.display = "none";
  inputInit();
});

// handle browse file
browseBtn.addEventListener("change", (e) => {
  if (e.target.files.length != 0) {
    fileBrowse = e.target.files[0];
    let lenValInput = parseInt(fileBrowse.name.length);
    if (lenValInput > 35) {
      labelBrowse.innerHTML = fileBrowse.name.substring(0, 35) + "...";
    } else {
      labelBrowse.innerHTML = fileBrowse.name.substring(0, 35);
    }
  }
});

// handle check btn (업로드 버튼 클릭시)
checkBtn.addEventListener("click", () => {
  if (fileBrowse != null) {
    loader.style.display = "block";
    closeAddFormBtn.style.display = "none";
    checkBtn.style.visibility = "hidden";
    let storageRef = storage.ref("images/" + userUid + "/" + fileBrowse.name); //스토리지 firebase.auth().currentUser.uid
    storageRef.put(fileBrowse).then(() => {
      let fileLink = storage.ref(`images/${userUid}/${fileBrowse.name}`);
      urlDownload = fileLink
        .getDownloadURL()
        .then((url) => {
          urlDownload = url.toString();
        })
        .then(() => {
          let docRef = firestore.collection("images" + userUid); //데이터베이스 저장소
          let query = docRef.where("fileName", "==", fileBrowse.name);

          //쿼리
          query.get().then((data) => {
            if (data.size == 0) {
              docRef.add({
                fileName: fileBrowse.name, //파일 이름
                fileLocation: urlDownload, //파이어베이스 다운로드 URL
                uploader: userEmail, //파일 올린 사람
              });
              loader.style.display = "none";
              closeAddFormBtn.style.display = "block";
              checkBtn.style.visibility = "visible";
              fileTable1.innerHTML = "";
              fileTable2.innerHTML = "";
              getAllFiles();
              inputInit();
            } else {
              alert("파일 이름이 중복됩니다.");
            }
          });
        });
    });
  } else {
    alert("파일을 선택해주세요");
  }
});

// handle delete
fileTable1.addEventListener("click", (e) => {
  let targetId = e.target.parentNode.parentNode.id;
  if (targetId.match("id-")) {
    let sureDel = confirm("정말로 이 파일을 삭제하시겠습니까?");
    if (sureDel) {
      let idFile = targetId.substring(3, targetId.length);
      firestore //데이터베이스
        .collection("images" + userUid)
        .where("fileName", "==", idFile)
        .get()
        .then((data) => {
          data.forEach((element) => {
            element.ref.delete().then(() => {
              let storageRef = storage.ref("images/" + userUid + "/" + idFile); //스토리지
              storageRef.delete().then(() => {
                fileTable1.innerHTML = "";
                fileTable2.innerHTML = "";
                getAllFiles();
                inputInit();
              });
            });
          });
        });
    }
  }
});
fileTable2.addEventListener("click", (e) => {
  let targetId = e.target.parentNode.parentNode.id;
  if (targetId.match("id-")) {
    let sureDel = confirm("정말로 이 파일을 삭제하실겁니까?");
    if (sureDel) {
      let idFile = targetId.substring(3, targetId.length);
      firestore //데이터베이스
        .collection("weightsfile" + userUid)
        .where("fileName", "==", idFile)
        .get()
        .then((data) => {
          data.forEach((element) => {
            element.ref.delete().then(() => {
              let storageRef = storage.ref(
                "weightsfile/" + userUid + "/" + idFile
              ); //스토리지
              storageRef.delete().then(() => {
                fileTable1.innerHTML = "";
                fileTable2.innerHTML = "";
                getAllFiles();
                inputInit();
              });
            });
          });
        });
    }
  }
});

// UI
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
