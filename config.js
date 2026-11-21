// ============================================================
//  НАСТРОЙКИ ПРЕМИИ ELDAY — правь только этот файл
// ============================================================
//
// 1) Вставь ссылку Discord-вебхука (Канал → Интеграции → Вебхуки).
//    Голоса будут приходить туда сообщениями. Канал сделай закрытым!
// 2) Положи фотки номинантов в папку img/ и впиши имена файлов ниже.
// 3) Впиши ники номинантов вместо "Номинант N".
//
window.ELDAY_CONFIG = {
  webhookUrl: "",

  categories: [
    {
      id: "elda-king",
      title: "ELDA KING",
      desc: "Главный король сервера",
      nominees: [
        { name: "Номинант 1", img: "img/elda-king-1.jpg" },
        { name: "Номинант 2", img: "img/elda-king-2.jpg" },
        { name: "Номинант 3", img: "img/elda-king-3.jpg" }
      ]
    },
    {
      id: "zhir",
      title: "ЖИР И СИСЬКИ ГОДА",
      desc: "Самый внушительный",
      nominees: [
        { name: "Номинант 1", img: "img/zhir-1.jpg" },
        { name: "Номинант 2", img: "img/zhir-2.jpg" },
        { name: "Номинант 3", img: "img/zhir-3.jpg" }
      ]
    },
    {
      id: "progamer",
      title: "ПРО-ГЕЙМЕР ГОДА",
      desc: "Тащит катки и нервы",
      nominees: [
        { name: "Номинант 1", img: "img/progamer-1.jpg" },
        { name: "Номинант 2", img: "img/progamer-2.jpg" },
        { name: "Номинант 3", img: "img/progamer-3.jpg" }
      ]
    },
    {
      id: "mem",
      title: "ЧЕЛОВЕК-МЕМ ГОДА",
      desc: "Сам стал мемом",
      nominees: [
        { name: "Номинант 1", img: "img/mem-1.jpg" },
        { name: "Номинант 2", img: "img/mem-2.jpg" },
        { name: "Номинант 3", img: "img/mem-3.jpg" }
      ]
    },
    {
      id: "pikchi",
      title: "ЛУЧШИЕ ПИКЧИ ГОДА",
      desc: "Кто выкладывал самые смешные фотокарточки",
      nominees: [
        { name: "Номинант 1", img: "img/pikchi-1.jpg" },
        { name: "Номинант 2", img: "img/pikchi-2.jpg" },
        { name: "Номинант 3", img: "img/pikchi-3.jpg" }
      ]
    },
    {
      id: "zavoz",
      title: "ЗАВОЗ ГОДА",
      desc: "Главный завоз этого года",
      textOnly: true,
      nominees: [
        { name: "Концерт Эмина" },
        { name: "Бананчик Артура" },
        { name: "Чат-рулетка Никиты" }
      ]
    }
  ]
};
