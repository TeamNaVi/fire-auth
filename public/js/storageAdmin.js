var firestore = firebase.firestore()
var storage = firebase.storage()

// DOM element
const addFileBtn = document.querySelector('.addBtn')
const addForm = document.querySelector('.addForm')
const closeAddFormBtn = document.querySelector('.fa-times')
const browseBtn = document.querySelector('#upload-file')
const labelBrowse = document.querySelector('label')
const checkBtn = document.querySelector('.fa-check-circle')
const fileTable1 = document.querySelector('#fileTable1')
const fileTable2 = document.querySelector('#fileTable2')
const fileTable3 = document.querySelector('#fileTable3')
const loader = document.querySelector('.loader')

const auth = firebase.auth();
// var global
let fileBrowse = null
let urlDownload = null
let userUid = null
let userEmail = null
// sidebar
// Requires jQuery
$(document).on('click', '.js-menu_toggle.closed', function (e) {
  e.preventDefault()
  $('.list_load, .list_item').stop()
  $(this).removeClass('closed').addClass('opened')

  $('.side_menu').css({ left: '0px' })

  var count = $('.list_item').length
  $('.list_load').slideDown(count * 0.6 * 100)
  $('.list_item').each(function (i) {
    var thisLI = $(this)
    timeOut = 100 * i
    setTimeout(function () {
      thisLI.css({
        opacity: '1',
        'margin-left': '0',
      })
    }, 100 * i)
  })
})

$(document).on('click', '.js-menu_toggle.opened', function (e) {
  e.preventDefault()
  $('.list_load, .list_item').stop()
  $(this).removeClass('opened').addClass('closed')

  $('.side_menu').css({ left: '-250px' })

  var count = $('.list_item').length
  $('.list_item').css({
    opacity: '0',
    'margin-left': '-20px',
  })
  $('.list_load').slideUp(300)
})

// upload.js
getAllUsers = function () {
  showHeaderTableU()
  firestore //데이터베이스
      .collection('users') //데이터베이스 저장소
      .get()
      .then((data) => {
        let counter = 0
        data.forEach((element) => {
          counter += 1
          showListUser(
              counter,
              element.data().email,
              element.data().uid
          )
        })
      })
}




getAllFiles = function () {

  showHeaderTableW()
  firestore //데이터베이스
      .collection('weightsfile'+userUid) //데이터베이스 저장소
      .get()
      .then((data) => {
        let counter = 0
        data.forEach((element) => {
          counter += 1
          showListData(
              counter,
              element.data().fileName,
              element.data().fileLocation
          )
        })
      })
  showHeaderTableI()
  firestore //데이터베이스
      .collection('images'+userUid) //데이터베이스 저장소
      .get()
      .then((data) => {
        let counter = 0
        data.forEach((element) => {
          //if(element.data().uploader !== userEmail){
          //  return; //continue랑 비슷한 역할을 foreach문에서 수행
          //}  해당 유저의 파일 필터링하는 기능이지만 컬렉션을 나눔으로서 불필요해짐
          counter += 1
          showListImage(
              counter,
              element.data().fileName,
              element.data().fileLocation
          )
        })
      })
}



// function init input condition
inputInit = function () {
  fileBrowse = null
  urlDownload = null
  labelBrowse.innerHTML = '업로드할 파일 선택...'
}

// function add header table static
showHeaderTableU = function () {

  html = `
    <tr>
        <th>No</th>
        <th>사용자 이메일</th>
        <th>선택</th>
    </tr>
    `
  fileTable1.insertAdjacentHTML('beforeend', html)

}

showHeaderTableW = function () {

  html = `
    <tr>
        <th>No</th>
        <th>가중치파일 이름</th>
        <th>다운로드 / 삭제</th>
    </tr>
    `
  fileTable2.insertAdjacentHTML('beforeend', html)

}

showHeaderTableI = function () {
  html = `
    <tr>
        <th>No</th>
        <th>이미지파일 이름</th>
        <th>다운로드 / 삭제</th>
    </tr>
    `
  fileTable3.insertAdjacentHTML('beforeend', html)

}

// function show list of files
showListUser = function (no,listEmail, listUid) {
  html = `
    <tr id="id-%id%">
        <td>%no%</td>
        <td>%listEmail%</td>
        <td>
            <input type='radio' name='selectedUser' value=%listUid% >선택</input>
            
        </td>
    </tr>
    `
  newHtml = html.replace('%id%', listEmail)
  newHtml = newHtml.replace('%no%', no)
  newHtml = newHtml.replace('%listUid%', listUid)
  newHtml = newHtml.replace('%listEmail%', listEmail)

  fileTable1.insertAdjacentHTML('beforeend', newHtml)
  //radio 버튼 클릭 이벤트
  $("input:radio[name=selectedUser]").click(function(){
    userUid = $('input[name="selectedUser"]:checked').val();
    fileTable3.innerHTML = ''
    fileTable2.innerHTML = ''
    getAllFiles()
    inputInit()

  });
}


showListData = function (no, fileName, fileLoc) {
  html = `
    <tr id="id-%id%">
        <td>%no%</td>
        <td>%fileName%</td>
        <td>
            <a href="%url%" target="blank" download>
                <i class="fas fa-file-download"></i>
            </a>
            <i class="fas fa-trash-alt"></i>
        </td>
    </tr>
    `
  newHtml = html.replace('%id%', fileName)
  newHtml = newHtml.replace('%no%', no)
  newHtml = newHtml.replace('%url%', fileLoc)
  newHtml = newHtml.replace('%fileName%', fileName)

  fileTable2.insertAdjacentHTML('beforeend', newHtml)
}

showListImage = function (no, fileName, fileLoc) {
  html = `
    <tr id="id-%id%">
        <td>%no%</td>
        <td>%fileName%</td>
        <td>
            <a href="%url%" target="blank" download>
                <i class="fas fa-file-download"></i>
            </a>
            <i class="fas fa-trash-alt"></i>
        </td>
    </tr>
    `
  newHtml = html.replace('%id%', fileName)
  newHtml = newHtml.replace('%no%', no)
  newHtml = newHtml.replace('%url%', fileLoc)
  newHtml = newHtml.replace('%fileName%', fileName)

  fileTable3.insertAdjacentHTML('beforeend', newHtml)
}





// init system
//auth.onAuthStateChanged((user) => {
//  userUid = user.uid
//  userEmail = user.email
//  getAllFiles() //유저 정보가 들어왔을 때 리스팅(안 그러면 아무것도 안 뜸)
//}); 일반 사용자용

getAllFiles()
getAllUsers()

// handle add file btn
addFileBtn.addEventListener('click', () => {
  addForm.style.display = 'block'
})

// handle close btn in addForm
closeAddFormBtn.addEventListener('click', () => {
  addForm.style.display = 'none'
  inputInit()
})

// handle browse file
browseBtn.addEventListener('change', (e) => {
  if (e.target.files.length != 0) {
    fileBrowse = e.target.files[0]
    let lenValInput = parseInt(fileBrowse.name.length)
    if (lenValInput > 35) {
      labelBrowse.innerHTML = fileBrowse.name.substring(0, 35) + '...'
    } else {
      labelBrowse.innerHTML = fileBrowse.name.substring(0, 35)
    }
  }
})

// handle check btn (업로드 버튼 클릭시)
checkBtn.addEventListener('click', () => {
  if (fileBrowse != null) {
    loader.style.display = 'block'
    closeAddFormBtn.style.display = 'none'
    checkBtn.style.visibility = 'hidden'
    let storageRef = storage.ref('weightsfile/' + userUid +'/' + fileBrowse.name) //스토리지 firebase.auth().currentUser.uid
    storageRef.put(fileBrowse).then(() => {
      let fileLink = storage.ref(`weightsfile/${userUid}/${fileBrowse.name}`)
      urlDownload = fileLink
          .getDownloadURL()
          .then((url) => {
            urlDownload = url.toString()
          })
          .then(() => {
            let docRef = firestore.collection('weightsfile'+userUid) //데이터베이스 저장소
            let query = docRef.where('fileName', '==', fileBrowse.name)

            //쿼리
            query.get().then((data) => {
              if (data.size == 0) {
                docRef.add({
                  fileName: fileBrowse.name, //파일 이름
                  fileLocation: urlDownload, //파이어베이스 다운로드 URL
                  uploader: userEmail,   //파일 올린 사람
                })
                loader.style.display = 'none'
                closeAddFormBtn.style.display = 'block'
                checkBtn.style.visibility = 'visible'
                fileTable2.innerHTML = ''
                getAllFiles()
                inputInit()
              } else {
                alert('파일 이름이 중복됩니다.')
              }
            })
          })
    })
  } else {
    alert('파일을 선택해주세요')
  }
})

// handle delete
fileTable.addEventListener('click', (e) => {
  let targetId = e.target.parentNode.parentNode.id
  if (targetId.match('id-')) {
    let sureDel = confirm('정말로 이 파일을 삭제하실겁니까?')
    if (sureDel) {
      let idFile = targetId.substring(3, targetId.length)
      firestore //데이터베이스
          .collection('weightsfile'+userUid)
          .where('fileName', '==', idFile)
          .get()
          .then((data) => {
            data.forEach((element) => {
              element.ref.delete().then(() => {
                let storageRef = storage.ref('weightsfile/' + userUid +'/' + idFile) //스토리지
                storageRef.delete().then(() => {
                  fileTable2.innerHTML = ''
                  getAllFiles()
                  inputInit()
                })
              })
            })
          })
      firestore //데이터베이스
          .collection('images'+userUid)
          .where('fileName', '==', idFile)
          .get()
          .then((data) => {
            data.forEach((element) => {
              element.ref.delete().then(() => {
                let storageRef = storage.ref('images/' + userUid +'/' + idFile) //스토리지
                storageRef.delete().then(() => {
                  fileTable3.innerHTML = ''
                  getAllFiles()
                  inputInit()
                })
              })
            })
          })
    }
  }
})
