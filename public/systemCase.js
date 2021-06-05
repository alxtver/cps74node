/**
 * Загрузка системных блоков
 */
async function loadSystemCaseData() {
    const systemCases = await getData('/systemCases/getAll')
    const overlay = document.getElementById('overlay')
    overlay.style.display = 'none'
}
