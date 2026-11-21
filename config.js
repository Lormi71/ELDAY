// ============================================================
//  НАСТРОЙКИ ПРЕМИИ ELDAY — правь только этот файл
// ============================================================
//
// 1) Вставь ссылку Discord-вебхука (Канал → Интеграции → Вебхуки).
//    Голоса будут приходить туда сообщениями. Канал сделай закрытым!
// 2) Фотки номинантов лежат в папке img/.
//
window.ELDAY_CONFIG = {
  webhookUrl: "https://discord.com/api/webhooks/1573750118455185429/SzI1TVjOBYmM3JA8NQTZY4PMHfb8QfaPRtvwECNT-5YMXI1EKodzHvesdGprrDW2-FS2",

  categories: [
    {
      id: "elda-king",
      title: "ELDA KING",
      icon: "img/icons/elda-king.png",
      desc: "Главный король сервера",
      nominees: [
        { name: "Артем", sub: "marsianskiikaktus_80794", img: "img/elda-king-1.jpg" },
        { name: "Влад", sub: "lormi_1", img: "img/elda-king-2.jpg" },
        { name: "Никита", sub: "nell0578", img: "img/elda-king-3.jpg" },
        { name: "Илья", sub: "pilulochkink", img: "img/elda-king-4.jpg" },
        { name: "Эмин", sub: "333.owo.xwx.owo.333_81135", img: "img/elda-king-5.jpg" }
      ]
    },
    {
      id: "zhir",
      title: "ЖИР И СИСЬКИ ГОДА",
      icon: "img/icons/zhir.jpg",
      desc: "Самый внушительный",
      nominees: [
        { name: "Артем", sub: "marsianskiikaktus_80794", img: "img/elda-king-1.jpg" },
        { name: "Влад", sub: "lormi_1", img: "img/elda-king-2.jpg" },
        { name: "Никита", sub: "nell0578", img: "img/elda-king-3.jpg" },
        { name: "Илья", sub: "pilulochkink", img: "img/elda-king-4.jpg" },
        { name: "Эмин", sub: "333.owo.xwx.owo.333_81135", img: "img/elda-king-5.jpg" },
        { name: "Кирилл", sub: "kirilm29_95966", img: "img/zhir-1.jpg" },
        { name: "Макс", sub: "moveby148867", img: "img/zhir-2.jpg" },
        { name: "Миша", sub: "d1bz1", img: "img/zhir-3.jpg" },
        { name: "Егор", sub: "egor2438", img: "img/zhir-4.jpg" }
      ]
    },
    {
      id: "progamer",
      title: "ПРО-ГЕЙМЕР ГОДА",
      icon: "img/icons/progamer.png",
      desc: "Тащит катки и нервы",
      nominees: [
        { name: "Макс", sub: "Продай лимоны", img: "img/zhir-2.jpg" },
        { name: "Илья", sub: "ARC Raiders", img: "img/elda-king-4.jpg" },
        { name: "Миша", sub: "В поисках жетона, Fortnite", img: "img/zhir-3.jpg" }
      ]
    },
    {
      id: "mem",
      title: "МЕМ ГОДА",
      desc: "Главный мем сервера",
      nominees: [
        { name: "Жирибибис", img: "img/mem-1.jpg" },
        { name: "Эмин колобок", img: "img/mem-2.jpg" },
        { name: "Бекрумс стил лайф", img: "img/mem-3.jpg" }
      ]
    },
    {
      id: "pikchi",
      title: "ЛУЧШИЕ ПИКЧИ ГОДА",
      icon: "img/icons/pikchi.jpg",
      desc: "Кто выкладывал самые смешные фотокарточки",
      nominees: [
        { name: "Влад", sub: "lormi_1", img: "img/elda-king-2.jpg" },
        { name: "Илья", sub: "pilulochkink", img: "img/elda-king-4.jpg" },
        { name: "Артем", sub: "marsianskiikaktus_80794", img: "img/elda-king-1.jpg" },
        { name: "Никита", sub: "nell0578", img: "img/elda-king-3.jpg" }
      ]
    },
    {
      id: "zavoz",
      title: "ЗАВОЗ ГОДА",
      icon: "img/icons/zavoz.png",
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
