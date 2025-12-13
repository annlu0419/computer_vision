// GSAT English Mock Exam - Complete Data Structure
const examData = {
  title: "115學年度學科能力測驗模擬試題 - 英文考科",
  timeLimit: 6000, // 100 minutes in seconds
  totalPoints: 100,
  
  sections: [
    {
      id: "vocab",
      title: "一、詞彙題",
      points: 10,
      questions: [
        {id: 1, type: "single", points: 1, question: "The continuous construction in the area led to the ______ of the natural habitat, forcing numerous wildlife species to seek shelter elsewhere.", options: ["acquisition", "disruption", "assurance", "calculation"], answer: "B", explanation: "disruption (破壞) 符合語境，指建設導致棲息地被破壞。"},
        {id: 2, type: "single", points: 1, question: "Experts believe that the key to maintaining mental sharpness in old age is continuous cognitive ______ through learning new skills and solving puzzles.", options: ["stimulation", "prevention", "regulation", "tolerance"], answer: "A", explanation: "stimulation (刺激) 指透過學習新技能來刺激認知功能。"},
        {id: 3, type: "single", points: 1, question: "The new manager is famous for her ability to handle workplace conflicts with great ______, ensuring fair outcomes for all employees involved.", options: ["sincerity", "elegance", "diplomacy", "liability"], answer: "C", explanation: "diplomacy (外交手腕) 指處理衝突的圓融能力。"},
        {id: 4, type: "single", points: 1, question: "The museum announced that its newest exhibition on ancient Roman artifacts will be ______ starting next Monday and will last for three months.", options: ["permanent", "accessible", "temporary", "subsequent"], answer: "B", explanation: "accessible (可參觀的) 表示展覽開放參觀。"},
        {id: 5, type: "single", points: 1, question: "Despite the initial failures, the team's ______ efforts eventually led to a major scientific breakthrough that revolutionized the medical field.", options: ["arbitrary", "persistent", "moderate", "fictional"], answer: "B", explanation: "persistent (堅持不懈的) 描述團隊持續努力。"},
        {id: 6, type: "single", points: 1, question: "To avoid the risk of food poisoning, raw meat must be stored at a low temperature to ______ the growth of harmful bacteria.", options: ["suppress", "fulfill", "circulate", "attribute"], answer: "A", explanation: "suppress (抑制) 指抑制細菌生長。"},
        {id: 7, type: "single", points: 1, question: "The company issued a statement to ______ its commitment to environmental protection and promised to reduce its carbon footprint by half next year.", options: ["conceal", "retrieve", "manifest", "enforce"], answer: "C", explanation: "manifest (表明) 指公開表明承諾。"},
        {id: 8, type: "single", points: 1, question: "The increasing reliance on social media often creates a strong need for external ______, making young users overly anxious about their online presence and likes.", options: ["validation", "compensation", "interference", "obligation"], answer: "A", explanation: "validation (認可) 指尋求外界肯定。"},
        {id: 9, type: "single", points: 1, question: "Since the chemical substance is highly ______ and toxic, it must be handled only by experienced professionals wearing protective gear.", options: ["luminous", "voluntary", "volatile", "glorious"], answer: "C", explanation: "volatile (易揮發的) 描述化學物質的危險性質。"},
        {id: 10, type: "single", points: 1, question: "The sudden drop in oil prices had a significant ______ effect on the global economy, impacting stock markets and trade balances worldwide.", options: ["domestic", "prevailing", "abundant", "ripple"], answer: "D", explanation: "ripple effect (連鎖效應) 指油價下跌造成的連鎖影響。"}
      ]
    },
    {
      id: "cloze",
      title: "二、綜合測驗",
      points: 10,
      questions: [
        {id: 11, type: "single", points: 1, passage: "The four-day work week has recently gained significant attention as a potential model for modern labor. Proponents argue that reducing the working days to four, 11. keeping the same salary, can drastically improve employee well-being and productivity.", question: "11.", options: ["while", "despite", "therefore", "unless"], answer: "A", explanation: "while 表示對比，符合語境。"},
        {id: 12, type: "single", points: 1, question: "12.", options: ["but", "where", "which", "than"], answer: "C", explanation: "which 引導非限定關係子句，修飾前面整句話。"},
        {id: 13, type: "single", points: 1, question: "13.", options: ["at the same time", "on the other hand", "in advance", "in comparison"], answer: "A", explanation: "at the same time 表示同時，連接兩個並列的結果。"},
        {id: 14, type: "single", points: 1, question: "14.", options: ["Accordingly", "Nevertheless", "Moreover", "Otherwise"], answer: "C", explanation: "Moreover 表示遞進，補充說明四日工作制的意義。"},
        {id: 15, type: "single", points: 1, question: "15.", options: ["mission", "regulation", "negotiation", "fantasy"], answer: "D", explanation: "fantasy (幻想) 與 viable option 形成對比。"},
        {id: 16, type: "single", points: 1, passage: "Bioluminescence, the natural ability of living organisms to produce light, is one of the most mesmerizing spectacles of the deep sea. This light is created through a chemical reaction within the organism's body. 16., scientists believe that this phenomenon serves various crucial functions.", question: "16.", options: ["Unlike", "Instead", "Primarily", "Given"], answer: "C", explanation: "Primarily (主要地) 引出科學家的主要觀點。"},
        {id: 17, type: "single", points: 1, question: "17.", options: ["make", "to make", "making", "makes"], answer: "C", explanation: "making 作分詞構句，表示結果。"},
        {id: 18, type: "single", points: 1, question: "18.", options: ["In conclusion", "On the contrary", "Additionally", "Such as"], answer: "C", explanation: "Additionally 表示補充說明另一種功能。"},
        {id: 19, type: "single", points: 1, question: "19.", options: ["By no means", "In other words", "At any rate", "As a result"], answer: "D", explanation: "As a result 表示因果關係，總結前文。"},
        {id: 20, type: "single", points: 1, question: "20.", options: ["which", "where", "that", "what"], answer: "B", explanation: "where 引導關係副詞子句，修飾 environments。"}
      ]
    }
  ]
};
