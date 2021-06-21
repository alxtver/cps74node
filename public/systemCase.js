/**
 * Действия после загрузки дома
 */
document.addEventListener("DOMContentLoaded", function () {
  loadSystemCaseData();
  getSerialsNumbers();
  const copyInput = document.getElementById("inputCopy");
  copyInput.addEventListener("keyup", (e) => {
    findSerialNumber("/systemCases/findSerial", e.target.value, copyInput);
  });

  const snSelect = document.getElementById("system-case-serials");
  snSelect.addEventListener("change", (e) => {
    const snId = snSelect.value;
    const el = document.getElementById(snId);
    const offsetPosition =
      window.pageYOffset + el.getBoundingClientRect().top - 70;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});

/**
 * Получить серийные номера системных блоков
 * @returns {Promise<void>}
 */
async function getSerialsNumbers() {
  const data = await getData("/systemCases/getSerialsNumbers");
  const select = document.getElementById("system-case-serials");
  for (const item of data.serialsNumbers) {
    const option = document.createElement("option");
    option.text = item;
    option.value = item;
    select.appendChild(option);
  }
}

/**
 * Загрузка системных блоков
 */
async function loadSystemCaseData() {
  const response = await getData("/systemCases/getAll");

  const systemCases = response.systemCases;
  systemCaseList(systemCases, () => {
    painting();
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  });
}

function systemCaseList(systemCases, callback) {
  const container = document.getElementById("systemCases");
  container.innerHTML = "";
  for (const systemCase of systemCases) {
    createSystemCaseTable(systemCase, container);
  }
  callback();
}

function refreshOneTable(systemCase) {
  const container = document.getElementById(systemCase._id);
  container.innerHTML = "";
  createSystemCaseTable(systemCase, container);
}

function clkCopy() {
  document.getElementById("inputCopy").focus();
  document.getElementById("btnSubmit").disabled = true;
}

/**
 * Удалить системный блок
 */
function delBtn() {
  const id = document.getElementById("hidId").value;
  deleteData("/systemCases/delete", { id }).then((data) => {
    if (data.message === "ok") {
      document.getElementById(id).style.display = "none";
    }
  });
}

/**
 * Раскрасска
 */
function painting() {
  for (const row of document.querySelectorAll(".system-case-row")) {
    const nameCell = row.querySelector(".name");
    const snCell = row.querySelector(".serial_number");
    if (nameCell.innerHTML === "Н/Д") {
      row.style.backgroundColor = "coral";
      continue;
    }
    snCell.style.backgroundColor = snCell.innerHTML === "" ? "darkgray" : "";
  }
}
