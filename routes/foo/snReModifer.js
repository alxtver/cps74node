const PKI = require('../../models/pki')

async function snReModifer(serial_number, part) {
  // проверка на гребаные сидюки
  let pki = await PKI.findOne({
    part: part,
    serial_number: serial_number.split(' ').reverse().join(' ')
  })
  if (pki) {
    return {
      SN: serial_number.split(' ').reverse().join(' '),
      pki: pki
    }
  }
  // проверка на левый серийник Gigabyte
  let regex = /SN\w*/g
  if (serial_number.match(regex)) {
    pki = await PKI.findOne({
      part: part,
      serial_number: serial_number.match(regex)[0]
    })
    if (pki) {
      return {
        SN: serial_number.match(regex)[0],
        pki: pki
      }
    }
  }
  // серийники APC удаление буквы S
  pki = await PKI.findOne({
    part: part,
    serial_number: serial_number.substr(1)
  })
  if (pki) {
    return {
      SN: serial_number.substr(1),
      pki: pki
    }
  }
  // серийники Canon
  pki = await PKI.findOne({
    part: part,
    serial_number: serial_number.substring(3, 12)
  })
  if (pki) {
    return {
      SN: serial_number.substring(3, 12),
      pki: pki
    }
  }

  // проверка на черточки в мониках DELL
  if (serial_number.length == 20) {
    let modifiedSN = ''
    for (let i = 0; i < serial_number.length; i++) {
      modifiedSN += serial_number[i]
      if (i == 1 || i == 7 || i == 12 || i == 15) {
        modifiedSN += '-'
      }
    }
    query = {
      $and: [{
          $or: [{
            serial_number: new RegExp(modifiedSN + '.*', "i")
          }]
        },
        {
          part: part
        }
      ]
    }
    pki = await PKI.findOne(query)
    if (pki) {
      return {
        SN: pki.serial_number,
        pki: pki
      }
    }
  }
  return {
    SN: serial_number,
    pki: undefined
  }
}

module.exports = snReModifer