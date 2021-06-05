class PKI {
  constructor(
    ean_code,
    type_pki,
    vendor,
    model,
    country,
    part,
    serial_number,
    number_machine
  ) {
    this.ean_code = ean_code;
    this.type_pki = type_pki;
    this.vendor = vendor;
    this.model = model;
    this.country = country;
    this.part = part;
    this.serial_number = serial_number;
    this.number_machine = number_machine;
  }
  async addPKIToDB() {
    return await postData("/add", this);
  }
}

class APKZI {
  constructor(
    apkzi_name,
    kont_name,
    fdsi,
    fdsiKontr,
    zav_number,
    kontr_zav_number,
    part,
    number_machine
  ) {
    this.apkzi_name = apkzi_name;
    this.kont_name = kont_name;
    this.fdsi = fdsi;
    this.fdsiKontr = fdsiKontr;
    this.zav_number = zav_number;
    this.kontr_zav_number = kontr_zav_number;
    this.part = part;
    this.number_machine = number_machine;
  }
  async addAPKZIToDB() {
    return await postData("/add/apkzi", this);
  }
}

class SystemCase {
  constructor({
    serialNumber = "0000-000-0000",
    execution = "",
    fdsi = "ФДШИ.466219.002-01",
    part = "",
    created = () => Date.now() + 3 * 60 * 60 * 1000,
    backColor = "#3d3d3d",
    pcNumber = "",
  } = {}) {
    this.serialNumber = serialNumber;
    this.execution = execution;
    this.fdsi = fdsi;
    this.part = part;
    this.creates = created();
    this.backColor = backColor;
    this.number_machine = number_machine;
  }
  async addAPKZIToDB() {
    return await postData("/add/apkzi", this);
  }
}
