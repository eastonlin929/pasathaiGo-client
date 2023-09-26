import React from "react";
const Alphabet = () => {
  const alphabetThai = [
    "ก",
    "ข",
    "ฃ",
    "ค",
    "ฅ",
    "ฆ",
    "ง",
    "จ",
    "ฉ",
    "ช",
    "ซ",
    "ฌ",
    "ญ",
    "ฎ",
    "ฏ",
    "ฐ",
    "ฑ",
    "ฒ",
    "ณ",
    "ด",
    "ต",
    "ถ",
    "ท",
    "ธ",
    "น",
    "บ",
    "ป",
    "ผ",
    "ฝ",
    "พ",
    "ฟ",
    "ภ",
    "ม",
    "ย",
    "ร",
    "ล",
    "ว",
    "ศ",
    "ษ",
    "ส",
    "ห",
    "ฬ",
    "อ",
    "ฮ",
  ];
  const pronunciationThai = [
    "ก ไก่",
    "ข ไข่",
    "ฃ ฃวด",
    "ค ควาย",
    "ค คน",
    "ฆ ระฆัง",
    "ง งู",
    "จ จาน",
    "ฉ ฉิ่ง",
    "ช ช้าง",
    "ซ โซ่",
    "ฌ เฌอ",
    "ญ หญิง",
    "ฎ ชฎา",
    "ฏ ปฏัก",
    "ฐ ฐาน",
    "ฑ นางมณโฑ",
    "ฒ ผู้เฒ่า",
    "ณ เณร",
    "ด เด็ก",
    "ต เต่า",
    "ถ ถุง",
    "ท ทหาร",
    "ธ ธง",
    "น หนู",
    "บ ใบไม่",
    "ป ปลา",
    "ผ ผื้ง",
    "ฝ ฝา",
    "พ พาน",
    "ฟ ฟัน",
    "ภ ส่าเภา",
    "ม มา",
    "ย ยักษ์",
    "ร เรือ",
    "ล ลิง",
    "ว เหวน",
    "ศ ศาลา",
    "ษ ฤาษี",
    "ส เสือ",
    "ห หีบ",
    "ฬ จุฬา",
    "อ อ่าง",
    "ฮ นกฮูก",
  ];
  const pronunciationInter = [
    "gho gai",
    "kho kai",
    "kho khuo（已廢用）",
    "kho kuai",
    "kho khon（已廢用）",
    "kho ra kang",
    "ngo ngu",
    "jo jaan",
    "cho ching",
    "cho chang",
    "sor so",
    "cho che",
    "yor ying",
    "dho cha da",
    "dltho patak",
    "tho taan",
    "thi nangmortho",
    "tho phu thao",
    "nho nae",
    "dho delk",
    "dltho dtao",
    "tho thoong",
    "tho tha han",
    "tho thong",
    "ngo nu",
    "bo bai mai",
    "bpo bpla",
    "pho phun",
    "fo fa",
    "pho pan",
    "fo fun",
    "pho sampao",
    "mo maa",
    "yo yak",
    "ro rue",
    "lo ling",
    "wo van",
    "so sala",
    "so reu si",
    "so sue",
    "ho hip",
    "lo zula",
    "all ang",
    "ho nok hook",
  ];
  const vowel = [
    "-ะ",
    "-า",
    "ิ",
    "ี",
    "ึ",
    "ื",
    "ุ",
    "ู",
    "เ-ะ",
    "เ-",
    "แ-ะ",
    "แ-",
    "เ-อะ",
    "เ-อ",
    "โ-ะ",
    "โ-",
    "เ-าะ",
    "-อ",
    "เียะ",
    "เีย",
    "เือะ",
    "เือ",
    "ัวะ",
    "ัว",
    "ำ",
    "ใ",
    "ไ",
    "เ-า",
    "ฤ",
    "ฤๅ",
  ];
  const vowelPronun = [
    "อะ",
    "อา",
    "อิ",
    "อี",
    "อึ",
    "อือ",
    "อุ",
    "อู",
    "เอะ",
    "เอ",
    "แอะ",
    "แอ",
    "เอะ",
    "เออ",
    "โอะ",
    "โอ",
    "เอาะ",
    "ออ",
    "เกียะ",
    "เอีย",
    "เอือะ",
    "เอือ",
    "อัวะ",
    "อัว",
    "อำ",
    "ใอ",
    "ไอ",
    "เอา",
    "ฤ",
    "รือ",
  ];

  const vowelInter = [
    "a",
    "aː",
    "i",
    "iː",
    "ɯ",
    "ɯː",
    "u",
    "uː",
    "egg",
    "eggː",
    "at",
    "airː",
    "e",
    "eː",
    "o",
    "oː",
    "orc",
    "orcː",
    "ie",
    "ieː",
    "yuːe",
    "yuːeː",
    "uo",
    "uoː",
    "arm",
    "ai",
    "ai",
    "ao",
    "ṛ",
    "ṛː",
  ];

  //語音處理
  const synth = window.speechSynthesis;

  const getVoicesPromise = () =>
    new Promise((resolve) => {
      const voices = synth.getVoices();
      resolve(voices);
    });

  const initVoices = async () => {
    try {
      await getVoicesPromise();
    } catch (e) {
      console.log(e);
    }
  };
  initVoices();

  const pronun = async (alphabet) => {
    // utterance.lang = "th-TH";
    // return window.speechSynthesis.speak(utterance);
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = alphabet;
    try {
      const voices = await getVoicesPromise();
      for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === "Narisa（提高品質）") {
          utterance.voice = voices[i];
          synth.speak(utterance);
          return;
        }
      }
      for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === "Kanya") {
          utterance.voice = voices[i];
          synth.speak(utterance);
          return;
        }
      }
      return () => {
        utterance.lang = "th-TH";
        synth.speak(utterance);
      };
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="alphabetThai">
      <section className="title">
        <h2>泰文字母表</h2>
        <br />
        <h3>子音</h3>
      </section>
      <div className="flex">
        <section className="consonant">
          {alphabetThai.map((letter, index) => (
            <div key={index} className="consonantContainer">
              <div className="consonant-cell">{letter}</div>
              <div className="consonant-cell2">{pronunciationThai[index]}</div>
              <button
                className="pronun"
                onClick={() => pronun(pronunciationThai[index])}
              >
                <i className="fa-solid fa-volume-high"></i>{" "}
              </button>
              <div className="consonant-cell3">{pronunciationInter[index]}</div>
            </div>
          ))}
        </section>
      </div>
      <section className="title">
        <h3>母音</h3>
        <h4>除了ฤ及ฤๅ，母音必須搭配一個子音才能發聲（示例與อ搭配發音）</h4>
      </section>{" "}
      <div className="flex">
        <section className="vowel">
          {vowel.map((letter, index) => (
            <div key={index} className="vowelContainer">
              <div className="vowel-cell">{letter}</div>
              <button
                className="pronun"
                onClick={() => pronun(vowelPronun[index])}
              >
                <i className="fa-solid fa-volume-high"></i>{" "}
              </button>
              <div className="vowel-cell2">{vowelInter[index]}</div>{" "}
            </div>
          ))}
        </section>{" "}
      </div>
    </div>
  );
};

export default Alphabet;
