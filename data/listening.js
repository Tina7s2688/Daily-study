// 多益聽力題庫（原創題目，模擬 Part 3 對話與 Part 4 獨白）
// sp: W = 女聲, M = 男聲, N = 旁白／單人說話
// a: 正確答案的索引（從 0 開始）
// type: 主旨 / 細節 / 推論 / 下一步 / 說話者意圖
window.LISTENING_SETS = [
  {
    id: "c1", part: 3, title: "延遲的影印紙",
    lines: [
      { sp: "W", t: "Hi Daniel, I'm calling about the printer paper we ordered last week. It was supposed to arrive on Monday, but we still haven't received it." },
      { sp: "M", t: "I'm sorry about that, Ms. Chen. Our warehouse had a shipping problem, and several orders were delayed. Let me check yours. Yes, it's leaving the warehouse this afternoon." },
      { sp: "W", t: "That's a relief. We're printing the annual reports on Thursday, so we really need it by Wednesday." },
      { sp: "M", t: "It should reach you tomorrow morning. And since it was late, I'll take ten percent off your invoice." }
    ],
    qs: [
      { q: "What is the woman calling about?", o: ["A billing error", "A late delivery", "A broken printer", "A new product"], a: 1, type: "主旨", ex: "女生一開口就說紙「應該週一到，但還沒收到」，所以是延遲送貨。" },
      { q: "Why does the woman need the item by Wednesday?", o: ["Her office is moving", "She is meeting a client", "She is printing reports on Thursday", "The warehouse closes on Thursday"], a: 2, type: "細節", ex: "她說 We're printing the annual reports on Thursday。" },
      { q: "What does the man offer?", o: ["A discount", "Free shipping", "A replacement printer", "A full refund"], a: 0, type: "細節", ex: "take ten percent off your invoice = 打九折，是折扣。" }
    ]
  },
  {
    id: "c2", part: 3, title: "找會議室",
    lines: [
      { sp: "M", t: "Kelly, have you booked a room for the client presentation next Tuesday?" },
      { sp: "W", t: "I tried, but the large conference room is already reserved for the board meeting all day." },
      { sp: "M", t: "Hmm. The clients are bringing five people, so the small meeting rooms won't work." },
      { sp: "W", t: "What about the training center on the third floor? It has a projector, and it seats twenty." },
      { sp: "M", t: "Good idea. Could you call the facilities office and reserve it for ten a.m.?" },
      { sp: "W", t: "Sure, I'll do that right after lunch." }
    ],
    qs: [
      { q: "What are the speakers mainly discussing?", o: ["Preparing presentation slides", "Hiring new trainers", "Finding a room for a presentation", "Planning a team lunch"], a: 2, type: "主旨", ex: "整段都在討論客戶簡報要用哪間會議室。" },
      { q: "Why can't they use the large conference room?", o: ["It is reserved for another meeting", "It is being repaired", "It is too small", "Its projector is broken"], a: 0, type: "細節", ex: "already reserved for the board meeting = 已被董事會預訂。" },
      { q: "What will the woman do after lunch?", o: ["Meet the clients", "Call the facilities office", "Set up the projector", "Email the board members"], a: 1, type: "下一步", ex: "男生請她打給 facilities office，她說午餐後就打。" }
    ]
  },
  {
    id: "c3", part: 3, title: "第二次面試",
    lines: [
      { sp: "W", t: "Hello, this is Amy from Brightline Marketing. I'm calling to invite you to a second interview for the analyst position." },
      { sp: "M", t: "Oh, that's great news. Thank you!" },
      { sp: "W", t: "Would Friday at two o'clock work for you? You'll meet our head of data and complete a short Excel task." },
      { sp: "M", t: "Friday afternoon is fine. Should I bring my own laptop?" },
      { sp: "W", t: "No need. We'll provide one. Just bring a copy of your resume and some ID for the front desk." }
    ],
    qs: [
      { q: "Why is the woman calling?", o: ["To offer the man a job", "To schedule an interview", "To cancel a meeting", "To ask for references"], a: 1, type: "主旨", ex: "invite you to a second interview = 邀請第二次面試。" },
      { q: "What will the man do during the interview?", o: ["Give a presentation", "Write an essay", "Meet some clients", "Complete an Excel task"], a: 3, type: "細節", ex: "complete a short Excel task。" },
      { q: "What should the man bring?", o: ["His own laptop", "His resume and ID", "A work portfolio", "A training certificate"], a: 1, type: "細節", ex: "筆電公司會提供，要帶的是 resume 和 ID。這題的陷阱是 laptop。" }
    ]
  },
  {
    id: "c4", part: 3, title: "訂團隊午餐",
    lines: [
      { sp: "M", t: "Hi, I'd like to order lunch for our team meeting on the fifteenth. About thirty people." },
      { sp: "W", t: "Certainly. Our most popular option is the sandwich platter, but we also offer hot meals." },
      { sp: "M", t: "Several people on our team don't eat meat, so we'll need some vegetarian dishes as well." },
      { sp: "W", t: "No problem. I'd suggest the mixed platter. It's half vegetarian. I can email you the menu and prices this afternoon." },
      { sp: "M", t: "Perfect. Please send it to the address on our account." }
    ],
    qs: [
      { q: "Who most likely is the woman?", o: ["A team manager", "A delivery driver", "A catering employee", "A conference organizer"], a: 2, type: "推論", ex: "她介紹餐點選項、提供菜單和價格，最可能是外燴公司員工。" },
      { q: "What does the man mention about his team?", o: ["Some members don't eat meat", "The meeting was canceled", "They prefer hot meals", "Their budget is small"], a: 0, type: "細節", ex: "Several people on our team don't eat meat。" },
      { q: "What will the woman send?", o: ["An invoice", "A contract", "A menu with prices", "Sample dishes"], a: 2, type: "下一步", ex: "email you the menu and prices this afternoon。" }
    ]
  },
  {
    id: "c5", part: 3, title: "業務軟體當機",
    lines: [
      { sp: "W", t: "Tom, the new sales software keeps freezing when I try to export reports." },
      { sp: "M", t: "Are you using the latest version? There was an update on Monday." },
      { sp: "W", t: "I think so. Actually, it says version three point one." },
      { sp: "M", t: "That's the old one. The update fixed exactly that problem. Restart your computer, and it should install automatically." },
      { sp: "W", t: "Oh, I didn't realize that. I'll do it now, before the sales meeting." }
    ],
    qs: [
      { q: "What problem does the woman have?", o: ["She can't log in", "The software keeps freezing", "A report is missing", "Her computer won't start"], a: 1, type: "細節", ex: "keeps freezing = 一直當掉。" },
      { q: "Why does the man say, “That's the old one”?", o: ["To recommend a new computer", "To complain about the software", "To explain the cause of the problem", "To ask her to buy an upgrade"], a: 2, type: "說話者意圖", ex: "他接著說更新版修好了這個問題，所以是在解釋她遇到問題的原因：版本太舊。" },
      { q: "What will the woman probably do next?", o: ["Restart her computer", "Attend the sales meeting", "Call the IT department", "Write a report"], a: 0, type: "下一步", ex: "她說 I'll do it now，it 指重開電腦。開會是之後的事。" }
    ]
  },
  {
    id: "c6", part: 3, title: "馬德里商展改期",
    lines: [
      { sp: "M", t: "Lisa, I just got an email. The trade fair in Madrid has been moved to the following week." },
      { sp: "W", t: "Really? Then we need to change our flights and the hotel booking." },
      { sp: "M", t: "The flights are flexible, so that's easy. But the hotel near the exhibition center might be full that week." },
      { sp: "W", t: "I'll check now. If it's full, there's another hotel by the train station, only fifteen minutes away by metro." }
    ],
    qs: [
      { q: "What has changed?", o: ["The location of a trade fair", "The date of a trade fair", "A flight number", "A hotel's address"], a: 1, type: "細節", ex: "moved to the following week = 延到下一週，是日期改了。" },
      { q: "What is the man concerned about?", o: ["Flight prices", "Train delays", "Hotel availability", "Exhibition costs"], a: 2, type: "推論", ex: "他擔心 the hotel ... might be full = 飯店可能客滿。" },
      { q: "What does the woman say about the other hotel?", o: ["It is cheaper", "It is near a train station", "It has meeting rooms", "It includes breakfast"], a: 1, type: "細節", ex: "another hotel by the train station。" }
    ]
  },
  {
    id: "t1", part: 4, title: "供應商的語音留言",
    lines: [
      { sp: "N", t: "Hello, this message is for Mr. Patel at Greenway Cafe. This is Rosa from Fresh Valley Farms. I'm calling about your weekly order of milk and fruit. Because of the heavy rain, some roads to the city are closed, so our Friday delivery will arrive about three hours late, probably around eleven a.m. If that's a problem for your morning service, you can pick up the order at our city warehouse from seven a.m. Please call me back at five five five, zero one eight two to let me know which option you prefer." }
    ],
    qs: [
      { q: "Who most likely is the speaker?", o: ["A cafe manager", "A supplier's employee", "A delivery driver", "A regular customer"], a: 1, type: "推論", ex: "她來自 Fresh Valley Farms，打來說明對方訂的牛奶水果，是供應商員工。" },
      { q: "Why will the delivery be late?", o: ["A truck broke down", "Some roads are closed", "Staff are on vacation", "The order was wrong"], a: 1, type: "細節", ex: "Because of the heavy rain, some roads ... are closed。" },
      { q: "What does the speaker ask the listener to do?", o: ["Cancel the order", "Pay online", "Return her call", "Visit the farm"], a: 2, type: "下一步", ex: "Please call me back。" }
    ]
  },
  {
    id: "t2", part: 4, title: "混合辦公宣布",
    lines: [
      { sp: "N", t: "Good morning, everyone. Before we start today's meeting, I have an announcement about our office. Starting next month, we're moving to a hybrid schedule. Each team will work in the office on Tuesdays and Thursdays and from home on the other days. To make this work, we're replacing assigned desks with a booking system. You'll reserve a desk through the company app the day before. Human Resources will hold a short training session on the app this Friday at three. Please make sure you attend." }
    ],
    qs: [
      { q: "What is the announcement mainly about?", o: ["A new work schedule", "An office relocation", "A new manager", "A company holiday"], a: 0, type: "主旨", ex: "moving to a hybrid schedule = 改成混合辦公的上班安排。" },
      { q: "What will employees use the app for?", o: ["Booking meeting rooms", "Reporting work hours", "Reserving desks", "Ordering lunch"], a: 2, type: "細節", ex: "reserve a desk through the company app。陷阱是 meeting rooms。" },
      { q: "What will happen on Friday?", o: ["The office will close", "A training session", "The app will launch", "A team party"], a: 1, type: "細節", ex: "a short training session on the app this Friday。" }
    ]
  },
  {
    id: "t3", part: 4, title: "財經新聞：台灣茶飲進軍歐洲",
    lines: [
      { sp: "N", t: "In business news, Taiwanese tea brand LeafLine announced today that it will open its first European store in Barcelona this spring. The company's sales abroad have doubled in the past two years, mainly through online orders from Spain and France. A company spokesperson said the Barcelona location was chosen because of its large number of young tourists. If the store is successful, LeafLine plans to open two more locations in Paris and Lyon next year." }
    ],
    qs: [
      { q: "What is the news report mainly about?", o: ["A new tea product", "A company's expansion into Europe", "Tourism in Spain", "An online sales platform"], a: 1, type: "主旨", ex: "first European store = 第一家歐洲店，報導主軸是拓展歐洲。" },
      { q: "Why was Barcelona chosen?", o: ["Rent is low there", "The company's office is there", "Many young tourists visit it", "Ingredients are cheaper there"], a: 2, type: "細節", ex: "because of its large number of young tourists。" },
      { q: "What does the company plan to do next year?", o: ["Launch a mobile app", "Open stores in France", "Enter the Asian market", "Stop selling online"], a: 1, type: "細節", ex: "Paris and Lyon 都在法國。題目常把城市換成國家來考。" }
    ]
  },
  {
    id: "t4", part: 4, title: "巧克力工廠導覽",
    lines: [
      { sp: "N", t: "Welcome to the Riverside Chocolate Factory tour. My name is Ben, and I'll be your guide for the next hour. We'll begin in the roasting room, where you'll see how cocoa beans are prepared. Please note that photos are not allowed inside the production area, but you're welcome to take pictures in the museum at the end. Also, the tour includes a tasting session, so if you have any food allergies, please let me know before we start. Now, if everyone could put on these hairnets, we'll head inside." }
    ],
    qs: [
      { q: "Where is the talk most likely taking place?", o: ["At a museum", "At a restaurant", "At a factory", "At a farm"], a: 2, type: "推論", ex: "Welcome to the Riverside Chocolate Factory tour。" },
      { q: "What are listeners NOT allowed to do in the production area?", o: ["Take photos", "Eat snacks", "Ask questions", "Touch the machines"], a: 0, type: "細節", ex: "photos are not allowed inside the production area。" },
      { q: "What does the speaker ask listeners to do now?", o: ["Buy tickets", "Sign a form", "Put on hairnets", "Sit down"], a: 2, type: "下一步", ex: "if everyone could put on these hairnets。" }
    ]
  },
  {
    id: "t5", part: 4, title: "季度業績會議",
    lines: [
      { sp: "N", t: "Let's look at last quarter's results. Online sales grew by eighteen percent, but sales in our physical stores dropped by five percent. Now, I know what you're thinking. Should we close some stores? Not yet. Our customer survey shows that many people visit the stores to try products before buying online. So the stores are still important. This quarter, we'll test small pick-up counters in three stores, and we'll compare the results in June." }
    ],
    qs: [
      { q: "What happened last quarter?", o: ["Online sales increased", "Store sales increased", "A survey was canceled", "Some stores closed"], a: 0, type: "細節", ex: "Online sales grew by eighteen percent。" },
      { q: "Why does the speaker say, “I know what you're thinking”?", o: ["To praise the team", "To address a likely concern", "To change the topic", "To ask for a vote"], a: 1, type: "說話者意圖", ex: "她預想大家會擔心要不要關店，接著回應這個疑慮。" },
      { q: "What will the company test this quarter?", o: ["A new website", "Price cuts", "Pick-up counters", "A customer survey"], a: 2, type: "細節", ex: "test small pick-up counters in three stores。" }
    ]
  },
  {
    id: "t6", part: 4, title: "語言中心廣告",
    lines: [
      { sp: "N", t: "Are you planning to study or work abroad? At GlobalSpeak Language Center, our small classes help you speak with confidence in just twelve weeks. We offer English, Spanish, and French courses for all levels, with evening and weekend schedules for busy students. This month only, new students who sign up for two courses receive the second course at half price. Visit our website to take a free level test and find the right class for you." }
    ],
    qs: [
      { q: "What is being advertised?", o: ["A travel agency", "A language school", "A study abroad fair", "A translation service"], a: 1, type: "主旨", ex: "GlobalSpeak Language Center。" },
      { q: "What is offered this month?", o: ["A free textbook", "A free first class", "Half price on a second course", "A travel discount"], a: 2, type: "細節", ex: "receive the second course at half price。" },
      { q: "What can listeners do on the website?", o: ["Book flights", "Take a level test", "Watch classes", "Chat with teachers"], a: 1, type: "細節", ex: "take a free level test。" }
    ]
  }
];
