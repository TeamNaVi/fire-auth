// labeling.js
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
const label_div = document.getElementById("label_names");
document.getElementById("inputfile").addEventListener("change", fileChanged);
document
  .getElementById("inputfolder")
  .addEventListener("change", folderChanged);

let annos = [];
let label_classes = [
  "0",
  "1",
  "2",
  "3",
  "4e",
  "5",
  "6",
];
let current_anno_index = 0;
let next_label_id = 0;
let isLabelNamesVisible = true;

document.getElementById("labelnametoggle").addEventListener("change", (e) => {
  isLabelNamesVisible = e.target.checked;
  redraw();
});

var textFile = null;
function makeTextFile(text) {
  var data = new Blob([text], { type: "text/plain" });
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }
  textFile = window.URL.createObjectURL(data);
  return textFile;
}

function downloadTxt(anno) {
  var link = document.createElement("a");
  link.setAttribute(
    "download",
    `${anno.imageName.split(".").slice(0, -1)}.txt`
  );
  link.href = makeTextFile(anno.getYOLOannotation());
  document.body.appendChild(link);

  window.requestAnimationFrame(function () {
    var event = new MouseEvent("click");
    link.dispatchEvent(event);
    document.body.removeChild(link);
  });
}

function getCurrentAnno() {
  return annos[current_anno_index];
}

function prevAnno() {
  if (current_anno_index == 0) return;
  getCurrentAnno().hide();
  current_anno_index--;
  redraw();
  getCurrentAnno().show();
}

function nextAnno() {
  if (current_anno_index == annos.length - 1) return;
  getCurrentAnno().hide();
  current_anno_index++;
  redraw();
  getCurrentAnno().show();
}

function folderChanged() {
  annos = [];
  current_anno_index = 0;
  for (let i = 0; i < this.files.length; i++) {
    let reader = new FileReader();
    reader.onload = (e) => {
      annos.push(new AnnoObj(e.target.result, this.files[i].name));
      if (i == 0) {
        annos[0].imageObj.onload = function () {
          redraw();
        };
        annos[0].displayImageName();
      }
    };
    reader.readAsDataURL(this.files[i]);
  }
}

function fileChanged() {
  var fr = new FileReader();
  fr.onload = function () {
    let file_content = fr.result.split("\r\n");
    if (file_content[file_content.length - 1] == "") {
      file_content = file_content.slice(0, -1);
    }
    label_classes = file_content;
  };
  fr.readAsText(this.files[0]);
}

function exportAnnotations() {
  for (let i = 0; i < annos.length; i++) {
    if (annos[i].labels.length > 0) {
      setTimeout(function () {
        downloadTxt(annos[i]);
      }, 500 * i);
    }
  }
}

function getLabelClassesAsHTML(selectedId = 0) {
  let selectionOptions = "";
  for (let index = 0; index < label_classes.length; index++) {
    selectionOptions += `<option value=${index}`;
    if (index == selectedId) selectionOptions += " selected";
    selectionOptions += `>${label_classes[index]}</option>`;
  }
  return selectionOptions;
}

class AnnoObj {
  labels;
  imageObj;
  imageName;
  selectedLabel = null;
  constructor(img, imageName) {
    this.imageObj = new Image();
    this.imageObj.src = img;
    this.labels = [];
    this.imageName = imageName;
  }

  getYOLOannotation() {
    let annoString = "";
    this.labels.forEach((element) => {
      annoString += element.getYOLOannotation() + "\n";
    });
    return annoString;
  }

  show() {
    this.addSelectionDivs();
    this.displayImageName();
  }

  hide() {
    this.deleteSelectionDivs();
    this.hideLabelResizingSquares();
  }

  draw() {
    this.displayImage();
    this.drawLabels();
  }

  hideLabelResizingSquares() {
    this.labels.forEach((element) => {
      element.setResizerSquareVisibility(false);
    });
  }

  getLabelClicked(pos) {
    function compare(a, b) {
      if (a.h * a.w < b.w * b.h) {
        return -1;
      }
      if (a.h * a.w > a.h * a.w) {
        return 1;
      }
      return 0;
    }

    let sortedLabels = this.labels.sort(compare);
    for (let i = 0; i < sortedLabels.length; i++) {
      let label = sortedLabels[i];
      if (label.isClicked(pos)) return label;
    }
    return null;
  }

  getResizingSquareIfPosInIt(pos) {
    for (let i = 0; i < this.labels.length; i++) {
      let label = this.labels[i];
      let squarePos = label.getResizingSquareIfPosInIt(pos);
      if (squarePos != null) return [label, squarePos];
    }
    return null;
  }

  displayImageName() {
    document.getElementById("imagename").innerText = this.imageName;
  }

  displayImage() {
    canvas.width = this.imageObj.naturalWidth / 4.25;
    canvas.height = this.imageObj.naturalHeight / 4.25;
    ctx.drawImage(
      this.imageObj,
      0,
      0,
      this.imageObj.naturalWidth / 4.25,
      this.imageObj.naturalHeight / 4.25
    );
  }

  drawLabels() {
    if (this.labels.length == 0) return;
    this.labels.forEach((element) => {
      if (element != this.selectedLabel) {
        element.draw();
      }
    });
    if (this.selectedLabel != null) {
      this.selectedLabel.draw();
    }
  }

  deleteSelectionDivs() {
    if (this.labels.length == 0) return;
    this.labels.forEach((element) => {
      element.deleteSelectionDiv();
    });
  }

  addSelectionDivs() {
    if (this.labels.length == 0) return;
    this.labels.forEach((element) => {
      element.addSelectionDiv();
    });
  }

  addLabel(label) {
    this.labels.push(label);
    this.setSelectedLabel(label);
    redraw();
  }

  setSelectedLabel(label) {
    if (label == this.selectedLabel) {
      return;
    }
    if (this.selectedLabel != null) {
      this.selectedLabel.deselect();
    }
    this.selectedLabel = label;
    label.select();
  }

  clearSelectedLabel() {
    if (this.selectedLabel != null) {
      this.selectedLabel.deselect();
      this.selectedLabel = null;
    }
  }

  removeLabel(label) {
    if (label == null) {
      return;
    }
    if (this.selectedLabel == label) {
      this.clearSelectedLabel();
    }
    this.labels.splice(this.labels.indexOf(label), 1);
    label.deleteSelectionDiv();
    redraw();
  }
}

class Label {
  name;
  x;
  y;
  w;
  h;
  id;
  selectionDiv;
  annoParent;
  resizerSquareOffSet = 5;
  isResizerSquaresVisible = false;
  selection;
  defaultColor = "rgba(255, 0, 0, 0.8)";
  selectColor = "rgba(255, 192, 203, 0.8)";
  color = this.defaultColor;
  rectLineWidth = "2";
  constructor(annoParent, x, y, w, h, name = 0) {
    this.annoParent = annoParent;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.changePosToTopLeft();
    if (this.isMobile()) {
      this.resizerSquareOffSet = 10;
    }
    this.name = name;
    this.id = next_label_id;
    next_label_id++;
    this.addSelectionDiv();
  }

  setColor(color) {
    this.color = color;
    redraw();
  }

  getResizerSquares() {
    return [
      [this.x, this.y],
      [this.x + this.w, this.y],
      [this.x, this.y + this.h],
      [this.x + this.w, this.y + this.h],
    ];
  }

  setResizerSquareVisibility(visible) {
    this.isResizerSquaresVisible = visible;
    redraw();
  }

  drawLabelName() {
    if (isLabelNamesVisible) {
      ctx.font = "20px Arial";
      ctx.shadowColor = "black";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      ctx.strokeText(label_classes[this.name], this.x, this.y - 5);
      ctx.fillStyle = "white";
      ctx.fillText(label_classes[this.name], this.x, this.y - 5);
    }
  }

  drawResizerSquares(color) {
    if (this.isResizerSquaresVisible) {
      this.getResizerSquares().forEach((element) => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(
          element[0],
          element[1],
          this.resizerSquareOffSet,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });
    }
  }

  getResizingSquareIfPosInIt(pos) {
    if (this.isResizerSquaresVisible) {
      for (let i = 0; i < this.getResizerSquares().length; i++) {
        let element = this.getResizerSquares()[i];
        if (
          element[0] - this.resizerSquareOffSet <= pos[0] &&
          pos[0] <= element[0] + this.resizerSquareOffSet &&
          element[1] - this.resizerSquareOffSet <= pos[1] &&
          pos[1] < element[1] + this.resizerSquareOffSet
        ) {
          return element;
        }
      }
    }
    return null;
  }

  getTopLeftCornerData(x, y, w, h) {
    let tempData = [x, y, w, h];
    if (w < 0) {
      tempData[0] = x + w;
      tempData[2] = Math.abs(w);
    }
    if (h < 0) {
      tempData[1] = y + h;
      tempData[3] = Math.abs(h);
    }
    return tempData;
  }

  changePosToTopLeft() {
    let topLeftData = this.getTopLeftCornerData(this.x, this.y, this.w, this.h);
    this.x = topLeftData[0];
    this.y = topLeftData[1];
    this.w = topLeftData[2];
    this.h = topLeftData[3];
  }

  cornerDragging(mouse_pos, corner_pos, lastResizerSquares) {
    if (
      corner_pos[0] == lastResizerSquares[0][0] &&
      corner_pos[1] == lastResizerSquares[0][1]
    ) {
      this.w = this.w + this.x - mouse_pos[0];
      this.x = mouse_pos[0];
      this.h = this.h + this.y - mouse_pos[1];
      this.y = mouse_pos[1];
    } else if (
      corner_pos[0] == lastResizerSquares[1][0] &&
      corner_pos[1] == lastResizerSquares[1][1]
    ) {
      this.w = mouse_pos[0] - this.x;
      this.h = this.h + this.y - mouse_pos[1];
      this.y = mouse_pos[1];
    } else if (
      corner_pos[0] == lastResizerSquares[2][0] &&
      corner_pos[1] == lastResizerSquares[2][1]
    ) {
      this.h = mouse_pos[1] - this.y;
      this.w = this.x + this.w - mouse_pos[0];
      this.x = mouse_pos[0];
    } else if (
      corner_pos[0] == lastResizerSquares[3][0] &&
      corner_pos[1] == lastResizerSquares[3][1]
    ) {
      this.w = mouse_pos[0] - this.x;
      this.h = mouse_pos[1] - this.y;
    }
    //this.changePosToTopLeft();
  }

  isClicked(pos) {
    if (
      this.x + this.resizerSquareOffSet < pos[0] &&
      pos[0] < this.x + this.w - this.resizerSquareOffSet &&
      this.y + this.resizerSquareOffSet < pos[1] &&
      pos[1] < this.y + this.h - this.resizerSquareOffSet
    )
      return true;
    return false;
  }

  draw(color = this.color) {
    this.drawRectangle(color);
    this.drawResizerSquares("lime");
    this.drawLabelName();
  }

  drawRectangle(color = this.color, lineWidth = this.rectLineWidth) {
    drawRectangle(
      [this.x, this.y, this.w, this.h],
      "black",
      (parseInt(lineWidth) + 1).toString()
    );
    drawRectangle([this.x, this.y, this.w, this.h], color, lineWidth);
  }

  addSelectionDiv() {
    label_div.insertAdjacentHTML(
      "beforeend",
      `<div id="div_${this.id}">
                <select id="${this.id}">
                    ${getLabelClassesAsHTML(this.name)}
                </select>
                <input type="button" class="delete" value="X" id="del_${
                  this.id
                }" tabindex="-1"><br></div>`
    );
    let delete_btn = document.getElementById(`del_${this.id}`);
    this.selection = document.getElementById(this.id);
    this.selectionDiv = document.getElementById(`div_${this.id}`);
    this.selectionFocus();
    delete_btn.addEventListener("click", (e) => {
      this.remove();
    });
    this.selection.addEventListener("focus", (e) => {
      getCurrentAnno().setSelectedLabel(this);
    });
    this.selection.addEventListener("blur", redraw);
    this.selection.addEventListener("change", (e) => {
      this.name = e.target.value;
      redraw();
    });
  }

  remove() {
    this.annoParent.removeLabel(this);
  }

  deleteSelectionDiv() {
    this.selectionDiv.remove();
  }

  select(setSelectionFocus = true) {
    this.setResizerSquareVisibility(true);
    this.setColor(this.selectColor);
    if (setSelectionFocus) {
      this.selectionFocus();
    }
    redraw();
  }

  deselect() {
    this.setResizerSquareVisibility(false);
    this.setColor(this.defaultColor);
    this.selection.blur();
    redraw();
  }

  selectionFocus() {
    if (!this.isMobile()) {
      this.selection.focus({ preventScroll: true });
    }
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  getYOLOannotation() {
    let parentImage = this.annoParent.imageObj;
    let center_xn = ((this.x + this.w / 2) / parentImage.width) * 4.25;
    let center_yn = ((this.y + this.h / 2) / parentImage.height) * 4.25;
    let wn = (this.w / parentImage.width) * 4.25;
    let hn = (this.h / parentImage.height) * 4.25;
    return `${this.name} ${center_xn.toFixed(6)} ${center_yn.toFixed(
      6
    )} ${wn.toFixed(6)} ${hn.toFixed(6)}`;
  }
}

let startPos = [];
let endPos = [];
let isMouseDown = false;
let currentPos = [];

function drawRectangle(pos, color = "black", lineWidth = "2") {
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.rect(pos[0], pos[1], pos[2], pos[3]);
  ctx.stroke();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function redraw() {
  clearCanvas();
  getCurrentAnno().draw();
}

let isResizingLabel = false;
let resizingLabelAndCorner;
let resizingOldSquares;
let isDraggingLabel = false;
let draggingOldLabel;
let draggingOffset;
let isDrawingNew = false;

canvas.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isMouseDown = true;
  startPos = [e.offsetX, e.offsetY];
  currentPos = startPos;

  let resizingLabelAndSquarePos =
    getCurrentAnno().getResizingSquareIfPosInIt(startPos);
  let clickedLabel = getCurrentAnno().getLabelClicked(startPos);

  if (resizingLabelAndSquarePos != null) {
    isResizingLabel = true;
    resizingLabelAndCorner = resizingLabelAndSquarePos;
    getCurrentAnno().setSelectedLabel(resizingLabelAndCorner[0]);
    resizingOldSquares = resizingLabelAndCorner[0].getResizerSquares();
  } else if (clickedLabel != null) {
    isDraggingLabel = true;
    draggingOldLabel = clickedLabel;
    draggingOffset = [x - clickedLabel.x, y - clickedLabel.y];
    getCurrentAnno().setSelectedLabel(draggingOldLabel);
  } else {
    isDrawingNew = true;
    getCurrentAnno().clearSelectedLabel();
  }
});
canvas.addEventListener("mousemove", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  if (isMouseDown) {
    if (isDraggingLabel) {
      draggingOldLabel.x = x - draggingOffset[0];
      draggingOldLabel.y = y - draggingOffset[1];
      redraw();
    } else if (isResizingLabel) {
      resizingLabelAndCorner[0].cornerDragging(
        [x, y],
        resizingLabelAndCorner[1],
        resizingOldSquares
      );
      redraw();
    } else if (isDrawingNew) {
      redraw();
      drawRectangle(
        [startPos[0], startPos[1], x - startPos[0], y - startPos[1]],
        "rgba(0, 0, 255, 0.6)"
      );
    }
  }
  currentPos = [x, y];
});
canvas.addEventListener("mouseup", (e) => {
  isMouseDown = false;
  endPos = currentPos;

  if (isDraggingLabel) {
    isDraggingLabel = false;
    draggingOldLabel = null;
    draggingOffset = 0;
  } else if (isResizingLabel) {
    isResizingLabel = false;
    resizingLabelAndCorner[0].changePosToTopLeft();
    resizingLabelAndCorner = [];
    resizingOldSquares = [];
  } else if (isDrawingNew) {
    isDrawingNew = false;
    if (startPos[0] != endPos[0] && startPos[1] != endPos[1]) {
      let label = new Label(
        getCurrentAnno(),
        startPos[0],
        startPos[1],
        endPos[0] - startPos[0],
        endPos[1] - startPos[1]
      );
      getCurrentAnno().addLabel(label);
    }
  }
  redraw();
});
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.pageX,
    clientY: touch.pageY,
  });
  canvas.dispatchEvent(mouseEvent);
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.pageX,
    clientY: touch.pageY,
  });
  canvas.dispatchEvent(mouseEvent);
});
canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
});
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) e.preventDefault();
});
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) e.preventDefault();
});
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) e.preventDefault();
});
document.addEventListener("keydown", (e) => {
  if (e.which == 39) {
    e.preventDefault();
    nextAnno();
  } else if (e.which == 37) {
    e.preventDefault();
    prevAnno();
  } else if (e.which == 46) {
    getCurrentAnno().removeLabel(getCurrentAnno().selectedLabel);
  }
});
