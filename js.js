document.addEventListener('DOMContentLoaded', () => {
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = '#f5f5f5';
  tooltip.style.color = '#000';
  tooltip.style.padding = '5px';
  tooltip.style.border = '1px solid #111';
  tooltip.style.fontSize = '14px';
  tooltip.style.whiteSpace = 'pre-wrap';
  tooltip.style.fontFamily = 'Verdana';
  tooltip.style.textAlign = 'left';
  tooltip.style.zIndex = '1000';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  document.addEventListener('click', (event) => {
    const el = event.target;
    if (el.hasAttribute('data-title')) {
      const t = el.getAttribute('data-title');
      const x = event.pageX;
      const y = event.pageY + 5;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
      tooltip.innerHTML = t;
      tooltip.style.display = 'block';
    } else {tooltip.style.display = 'none';}
  });
});

let fileInput = document.getElementById("input-file");
let fileList = document.getElementById("file-list");
let upload = document.getElementById("upload");
let select = document.getElementById("select");
let filesArray = [];
select.addEventListener("click", function () {fileInput.click();});

fileInput.addEventListener("change", function (event) {
    let newFiles = Array.from(event.target.files);
    newFiles.forEach(file => {
        if (!filesArray.some(f => f.name === file.name && f.size === file.size)) {
            filesArray.push(file);}
    });
    fileInput.value = "";
    updateFileList();
});

function updateFileList() {
    fileList.innerHTML = "";
    filesArray.forEach((file, index) => {
        let li = document.createElement("li");
        li.textContent = file.name;
        let remove = document.createElement("button");
        remove.textContent = "x";
        remove.classList.add("remove");
        remove.addEventListener("click", function () {
            filesArray.splice(index, 1);
            updateFileList();
        });
        li.appendChild(remove);
        fileList.appendChild(li);
    });
}