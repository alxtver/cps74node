function barcodeCountry(code) {
    code = parseInt(code.substr(0, 3), 10);
    if ((0 <= code && code <= 19)) {
        return 'США, Канада';
    }
    /*else if ((20 <= code && code <= 29)) {
       return 'Restricted distribution (MO defined)';
     }*/
    else if ((30 <= code && code <= 39)) {
        return 'США';
    }
    /*else if ((40 <= code && code <= 49)) {
       return 'Restricted distribution (MO defined)';
     } else if ((50 <= code && code <= 59)) {
       return 'Coupons';
     }*/
    else if ((60 <= code && code <= 99)) {
        return 'США, Канада';
    } else if ((100 <= code && code <= 139)) {
        return 'США';
    }
    /*else if ((200 <= code && code <= 299)) {
       return 'Restricted distribution (MO defined)';
     }*/
    else if ((300 <= code && code <= 379)) {
        return 'Франция';
    } else if (code === 380) {
        return 'Болгария';
    } else if (code === 383) {
        return 'Словения';
    } else if (code === 385) {
        return 'Хорватия';
    } else if (code === 387) {
        return 'Босния и Герцеговина';
    } else if (code === 389) {
        return 'ME';
    } else if ((400 <= code && code <= 440)) {
        return 'Германия';
    } else if ((450 <= code && code <= 459)) {
        return 'Япония';
    } else if ((460 <= code && code <= 469)) {
        return 'Россия';
    } else if (code === 470) {
        return 'Киргизия';
    } else if (code === 471) {
        return 'Тайвань';
    } else if (code === 474) {
        return 'Эстония';
    } else if (code === 475) {
        return 'Латвия';
    } else if (code === 476) {
        return 'Азербайджан';
    } else if (code === 477) {
        return 'Литва';
    } else if (code === 478) {
        return 'Узбекистан';
    } else if (code === 479) {
        return 'Шри-Ланка';
    } else if (code === 480) {
        return 'Филиппины';
    } else if (code === 481) {
        return 'Беларусь';
    } else if (code === 482) {
        return 'Украина';
    } else if (code === 484) {
        return 'Молдова';
    } else if (code === 485) {
        return 'Армения';
    } else if (code === 486) {
        return 'Грузия';
    } else if (code === 487) {
        return 'Казахстан';
    } else if (code === 488) {
        return 'Таджикистан';
    } else if (code === 489) {
        return 'Гонконг';
    } else if ((490 <= code && code <= 499)) {
        return 'Япония';
    } else if ((500 <= code && code <= 509)) {
        return 'Великобритания';
    } else if ((520 <= code && code <= 521)) {
        return 'Греция';
    } else if (code === 528) {
        return 'Ливан';
    } else if (code === 529) {
        return 'Кипр';
    } else if (code === 530) {
        return 'Албания';
    } else if (code === 531) {
        return 'Македония';
    } else if (code === 535) {
        return 'Мальта';
    } else if (code === 539) {
        return 'Ирландия';
    } else if ((540 <= code && code <= 549)) {
        return 'Бельгия, Люксембург';
    } else if (code === 560) {
        return 'Португалия';
    } else if (code === 569) {
        return 'Исландия';
    } else if ((570 <= code && code <= 579)) {
        return 'Дания';
    } else if (code === 590) {
        return 'Польша';
    } else if (code === 594) {
        return 'Румыния';
    } else if (code === 599) {
        return 'Венгрия';
    } else if ((600 <= code && code <= 601)) {
        return 'Южная Африка';
    } else if (code === 603) {
        return 'Гана';
    } else if (code === 604) {
        return 'Сенегал';
    } else if (code === 608) {
        return 'Бахрейн';
    } else if (code === 609) {
        return 'Маврикий';
    } else if (code === 611) {
        return 'Марокко';
    } else if (code === 613) {
        return 'Алжир';
    } else if (code === 615) {
        return 'Нигерия';
    } else if (code === 616) {
        return 'Кения';
    } else if (code === 618) {
        return 'Кот-д’Ивуар';
    } else if (code === 619) {
        return 'Тунис';
    } else if (code === 621) {
        return 'Сирия';
    } else if (code === 622) {
        return 'Египет';
    } else if (code === 624) {
        return 'Ливия';
    } else if (code === 625) {
        return 'Иордания';
    } else if (code === 626) {
        return 'Иран';
    } else if (code === 627) {
        return 'Кувейт';
    } else if (code === 628) {
        return 'Саудовская Аравия';
    } else if (code === 629) {
        return 'Объединенные Арабские Эмираты';
    } else if ((640 <= code && code <= 649)) {
        return 'Финляндия';
    } else if ((690 <= code && code <= 695)) {
        return 'Китай';
    } else if ((700 <= code && code <= 709)) {
        return 'Норвегия';
    } else if (code === 729) {
        return 'Израиль';
    } else if ((730 <= code && code <= 739)) {
        return 'Швеция';
    } else if (code === 740) {
        return 'Гватемала';
    } else if (code === 741) {
        return 'Сальвадор';
    } else if (code === 742) {
        return 'Гондурас';
    } else if (code === 743) {
        return 'Никарагуа';
    } else if (code === 744) {
        return 'Коста-Рика';
    } else if (code === 745) {
        return 'Панама';
    } else if (code === 746) {
        return 'Доминиканская Республика';
    } else if (code === 750) {
        return 'Мексика';
    } else if ((754 <= code && code <= 755)) {
        return 'Канада';
    } else if (code === 759) {
        return 'Венесуэла';
    } else if ((760 <= code && code <= 769)) {
        return 'Швейцария';
    } else if ((770 <= code && code <= 771)) {
        return 'Колумбия';
    } else if (code === 773) {
        return 'Уругвай';
    } else if (code === 775) {
        return 'Перу';
    } else if (code === 777) {
        return 'Боливия';
    } else if (code === 779) {
        return 'Аргентина';
    } else if (code === 780) {
        return 'Чили';
    } else if (code === 784) {
        return 'Парагвай';
    } else if (code === 785) {
        return 'Перу';
    } else if (code === 786) {
        return 'Эквадор';
    } else if ((789 <= code && code <= 790)) {
        return 'Бразилия';
    } else if ((800 <= code && code <= 839)) {
        return 'Италия';
    } else if ((840 <= code && code <= 849)) {
        return 'Испания';
    } else if (code === 850) {
        return 'Куба';
    } else if (code === 858) {
        return 'Словакия';
    } else if (code === 859) {
        return 'Чехия';
    } else if (code === 860) {
        return 'Югославия';
    } else if (code === 865) {
        return 'Монголия';
    } else if (code === 867) {
        return 'Северная Корея';
    } else if ((868 <= code && code <= 869)) {
        return 'Турция';
    } else if ((870 <= code && code <= 879)) {
        return 'Нидерланды';
    } else if (code === 880) {
        return 'Южная Корея';
    } else if (code === 884) {
        return 'Камбоджа';
    } else if (code === 885) {
        return 'Таиланд';
    } else if (code === 888) {
        return 'Сингапур';
    } else if (code === 890) {
        return 'Индия';
    } else if (code === 893) {
        return 'Вьетнам';
    } else if (code === 896) {
        return 'Пакистан';
    } else if (code === 899) {
        return 'Индонезия';
    } else if ((900 <= code && code <= 919)) {
        return 'Австрия';
    } else if ((930 <= code && code <= 939)) {
        return 'Австралия';
    } else if ((940 <= code && code <= 949)) {
        return 'Новая Зеландия';
    }
    /*else if (code === 950) {
       return 'GS1 Global Office: Special applications';
     } else if (code === 951) {
       return 'EPCglobal: Special applications';
     }*/
    else if (code === 955) {
        return 'Малайзия';
    } else if (code === 958) {
        return 'Макао';
    }
    /*else if ((960 <= code && code <= 969)) {
       return 'GS1 Global Office: GTIN-8 allocations';
     } else if (code === 977) {
       return 'Serial publications (ISSN)';
     } else if ((978 <= code && code <= 979)) {
       return 'Bookland (ISBN) - 979-0 used for sheet music';
     } else if (code === 980) {
       return 'Refund receipts';
     } else if ((981 <= code && code <= 983)) {
       return 'Common Currency Coupons';
     } else if ((990 <= code && code <= 999)) {
       return 'Coupons';
     }*/
    else {
        return '';
    }
}

module.exports = barcodeCountry