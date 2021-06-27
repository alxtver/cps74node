document.addEventListener("DOMContentLoaded", function () {
  load_data();
  // создаем элементы для селекта компании
  const companySelect = document.getElementById("company");
  for (const [key, value] of Object.entries(companyEnum)) {
    const option = document.createElement("option");
    option.value = key;
    option.text = value.toString();
    companySelect.add(option);
  }
  companySelect.addEventListener("change", (e) => {
    load_data();
  });

  const snSelect = document.getElementById("serials");
  snSelect.addEventListener("change", (e) => {
    let snId = snSelect.value;
    const el = document.getElementById(snId);
    const offsetPosition =
      window.pageYOffset + el.getBoundingClientRect().top - 70;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});

const companyEnum = Object.freeze({
  cps: "АО НИИ ЦПС",
  avk: "ООО НПО АВК",
});

function load_data(q) {
  const data = {
    q: q,
  };
  postData("/pcPa/search", data).then((data) => {
    CreateTableFromJSON(data);
    let select = document.getElementById("serials");
    for (const d of data) {
      let option = document.createElement("option");
      option.value = d.serial_number;
      option.text = d.serial_number;
      select.add(option);
    }
    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  });
}

function CreateTableFromJSON(data) {
  let divContainer = document.getElementById("PC");
  divContainer.innerHTML = "";

  for (let elem of data) {
    const table = tablePC(
      elem,
      "all",
      false,
      "fdsi",
      "type",
      "name",
      "quantity",
      "serial_number",
      "notes"
    );
    let divContainer = document.getElementById("PC");
    let divCont = document.createElement("div");
    divCont.id = elem._id;
    divCont.style.cssText =
      "-webkit-box-shadow: 0 30px 60px 0" +
      elem.back_color +
      ";box-shadow: 0 30px 60px 0" +
      elem.back_color;
    divCont.className = "pcCard mb-3";
    divContainer.appendChild(divCont);
    divCont.innerHTML = "";
    divCont.appendChild(table);

    const company = document.getElementById("company").value;
    // Кнопка генерации паспорта
    const button_passport = document.createElement("input");
    button_passport.type = "button";
    button_passport.className =
      "btn btn-outline-primary me-1 mb-2 ms-3 copyBtn";
    button_passport.value = "Паспорт Word";
    button_passport.setAttribute(
      "onclick",
      `location.href='/projects/${elem._id}/passportDocx?company=${company}'`
    );
    button_passport.dataset.id = elem._id;
    divCont.appendChild(button_passport);

    // Кнопка генерации этикетки на системный блок
    const button_sbZipE = document.createElement("input");
    button_sbZipE.type = "button";
    button_sbZipE.className = "btn btn-outline-primary me-1 mb-2 ms-1 copyBtn";
    button_sbZipE.value = "СБ Зип";
    button_sbZipE.setAttribute(
      "onclick",
      `location.href='/projects/${elem._id}/zipPCEDocx?company=${company}'`
    );
    button_sbZipE.dataset.id = elem._id;
    divCont.appendChild(button_sbZipE);

    // Кнопка генерации зип этикетки
    const button_ZIP = document.createElement("input");
    button_ZIP.type = "button";
    button_ZIP.className = "btn btn-outline-primary me-1 mb-2 ms-1 copyBtn";
    button_ZIP.value = "Зип этикетка";
    button_ZIP.setAttribute(
      "onclick",
      `location.href='/projects/${elem._id}/zipDocx?company=${company}'`
    );
    button_ZIP.dataset.id = elem._id;
    divCont.appendChild(button_ZIP);
  }
}
