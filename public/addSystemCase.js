/**
 * Действия при загрузке DOM
 */
document.addEventListener("DOMContentLoaded", function () {
  createSystemCaseTable();
  //     CreateTableSystemCase()
  //     submitFormAddPc()
  //     const serialInput = document.getElementById('serial_number')
  //     serialInput.addEventListener('keyup', () => {
  //         const sn = serialInput.value
  //         const numbers = document.getElementsByClassName('number_mashine')
  //         for (const number of numbers) {
  //             number.innerHTML = sn
  //         }
  //     })
});

function createSystemCaseTable() {
  const tableContainer = document.getElementById("systemCaseTable");
  tableContainer.innerHTML = "";
  // создаем таблицу
  const table = document.createElement("table");
  table.className = "table table-sm table-bordered table-hover";
  table.id = "systemCase";
  // создаем заголовок
  const tr = table.insertRow(-1);
  const thead = table.createTHead();
  thead.className = "table-dark";
  const columnNames = [
    "",
    "Обозначение изделия",
    "Наименование изделия",
    "Характеристика",
    "Количество",
    "Заводской номер",
    "Примечания",
  ];
  for (const column of columnNames) {
    const th = document.createElement("th");
    th.innerHTML = column;
    tr.appendChild(th);
    thead.appendChild(tr);
  }
  tableContainer.appendChild(table);

  // тело таблицы
  const tableBody = document.querySelector('tbody')
  const defaultEquipment = [
    'Корпус',
    'Процессор',
    'Вентилятор процессора',
    'Блок питания',
    'Оперативная память',
    'Оперативная память',
    'Системная плата',
    'Видеокарта',
    'Накопитель на жестком магнитном диске',
    'Корзина для НЖМД',
    'Оптический привод'
  ]
  createTableBody(defaultEquipment, tableBody)
  createSZIRow(tableBody)
}
