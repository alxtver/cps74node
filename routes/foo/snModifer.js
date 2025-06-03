function snModifer(serialNumber, vendor, eanCode, typePKI) {
  //Проверка на русские символы в серийнике
  for (const letter of serialNumber) {
    let codeOfLetter = letter.charCodeAt(0)
    if (codeOfLetter > 122) {
      let ruToEnSN = ''
      const ruLet = 'ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ'
      const engLet = 'QWERTYUIOPASDFGHJKLZXCVBNM'
      for (const l of serialNumber.toUpperCase()) {
        ind = ruLet.indexOf(l)
        if (ind >= 0) {
          ruToEnSN += engLet[ind]
        } else {
          ruToEnSN += l
        }
      }
      serialNumber = ruToEnSN
      break
    }
  }
  // приводы i-Has
  if (eanCode == '4718390028172') {
    let modifiedSN = serialNumber.split(' ').reverse().join(' ')
    return {
      SN: modifiedSN,
      flash: false
    }
  }
  // серийники Gigabite
  if (vendor == 'Gigabyte' || vendor == 'GIGABYTE') {
    let regex = /SN\w*/g
    if (serialNumber.match(regex)) {
      let modifiedSN = serialNumber.match(regex)[0]
      return {
        SN: modifiedSN,
        flash: false
      }
    }
  }
  // серийники APC  удаление буквы S
  if ((vendor == 'APC' || vendor == 'APC Back-UPS') && serialNumber[0] == 'S') {
    let modifiedSN = serialNumber.substring(1)
    return {
      SN: modifiedSN,
      flash: false
    }
  }
  // серийники Canon
  if (eanCode == '4549292119855') {
    if (serialNumber.substring(0, 3) == ']C1' && serialNumber.substring(serialNumber.length - 1)) {
      const modifiedSN = serialNumber.substring(3, 12)
      return {
        SN: modifiedSN,
        flash: false
      }
    }
  }
  // мониторы DELL
  if ((vendor == 'Dell' || vendor == 'DELL') && typePKI == 'Монитор') {
    let modifiedSN = ''
    flashErr = 'Не забудь потом внести ревизию в серийные номера этих мониторов!!!'
    for (let i = 0; i < serialNumber.length; i++) {
      modifiedSN += serialNumber[i]
      if (i == 1 || i == 7 || i == 12 || i == 15) {
        modifiedSN += '-'
      }
    }
      return {
      SN: modifiedSN,
      flash: flashErr
    }
  }
    // серийники kraftway
  if (vendor == 'kraftway' || vendor == 'Kraftway') {
    let regex = /\d+/g
    if (serialNumber.match(regex)) {
      let modifiedSN = serialNumber.match(regex)[0]
      return {
        SN: modifiedSN,
        flash: false
      }
    }
  // серийники БП Exegate
  if (eanCode == '4895205102958') {
    if (serialNumber.substring(0, 3) == ']C1' && serialNumber.substring(serialNumber.length - 1)) {
      const modifiedSN = serialNumber.substring(3, 21)
      return {
        SN: modifiedSN,
        flash: false
      }
    }
  return {
    SN: serialNumber,
    flash: false
  }
}

module.exports = snModifer
