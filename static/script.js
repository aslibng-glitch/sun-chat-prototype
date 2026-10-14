// ============================================================
// sun.chat prototip — sayfa yönetimi, modal'lar, chat mantığı
// ve İngilizce/Türkçe arayüz çevirisi
// ============================================================

const state = {
  page: "landing",
  messages: [], // { role: 'user'|'assistant', text: '...' }
  loading: false,
  skipSafetyModal: false,
  lang: "ENG",
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- TRANSLATIONS ----------
// Add/edit keys here. Every data-i18n="key" element gets its textContent
// replaced; data-i18n-html="key" elements get innerHTML replaced (used
// only where a translated sentence needs to keep an inline <a>/<span>
// inside it); data-i18n-placeholder="key" sets the input/textarea
// placeholder instead of visible text.
const TRANSLATIONS = {
  ENG: {
    "nav.home": "Home",
    "nav.feedback": "Feedback",
    "nav.resetChat": "Reset Chat",
    "nav.communities": "Local Communities",
    "nav.security": "Safety",
    "nav.privacy": "Privacy",
    "nav.quickExit": "QUICK EXIT",

    "landing.avatarName": "Sun",
    "landing.avatarRole": "AI Support Companion",
    "landing.intro1": "I'm a chatbot, not a human being. If something is happening in your relationship that might be domestic abuse, I'm here to help.",
    "landing.intro2": "Anyone can ask me questions about their safety, reporting options and where to find support, including services that understand migrant experiences.",
    "landing.intro3": "I've been designed to help Turkish migrant women who live in the UK, but some of my information may be useful to you even if you live elsewhere.",
    "landing.bubbleMeta": "Sun • AI",
    "landing.startChatting": "Start Chatting",
    "landing.footerEncrypted": 'This conversation is encrypted and private. Click "Quick Exit" at any time to clear screen instantly.',
    "landing.footerAgree": "By chatting, you agree to our Privacy Policy & Terms",
    "landing.activeSession": "Active Session",

    "chat.heading": "How can I help you today?",
    "chat.disclaimerEmpty": "I'm an AI support. If you're in immediate danger, contact emergency services. I can't help in emergencies. I can make mistakes, please double-check important information. If you face any issues, please share your feedback.",
    "chat.placeholderEmpty": "Which language would you like to chat in?",
    "chip.notSure": "Not sure where to start",
    "chip.needSupport": "I need support",
    "chip.signsOfAbuse": "What are signs of abuse?",
    "chat.placeholderConvo": "What would you like to talk about?",
    "chat.disclaimerConvo": "I'm an AI chatbot. If you're in immediate danger, contact emergency services. I can't help in emergencies.",
    "chat.footerAgree": 'By using this chat you agree to Sun\'s <span class="link" data-goto="privacy">Privacy Policy</span>',

    "privacy.title": "Privacy Policy",
    "privacy.s1.h": "1. Introduction",
    "privacy.s1.p": "Your privacy is important to us. At Sun, we are committed to protecting user data and ensuring transparency in how we operate. This Privacy Policy outlines how we handle information when you interact with Sun.chat and its associated services.",
    "privacy.s2.h": "2. No Collection of Personal Information",
    "privacy.s2.p": "Sun does not require an account or any personally identifiable information to use the service. Your conversation is not stored once you close or refresh the page. To generate its responses, Sun sends your messages to Anthropic, the company behind the underlying AI technology. Anthropic keeps this information for a maximum of seven days for security purposes, after which it is automatically deleted, and it is never used to train their AI models.",
    "privacy.s3.h": "3. Data Security and Protection",
    "privacy.s3.p": "While we do not collect personal data, we take appropriate measures to ensure a secure and private user experience. All interactions with Sun are encrypted and protected against unauthorized access or misuse.",
    "privacy.s4.h": "4. Third-Party Services and Messaging Apps",
    "privacy.s4.p": "Our platform may contain links to external sites. We are not responsible for the privacy practices of these third-party platforms.",
    "privacy.s5.h": "5. User Rights and Control",
    "privacy.s5.p": "Because Sun does not keep a lasting record of your conversation, there is nothing to request or delete once this short window closes automatically.",
    "privacy.s6.h": "6. Acceptance of Policy",
    "privacy.s6.p": "By using Sun.chat, you acknowledge and agree to this Privacy Policy.",
    "privacy.s7.h": "7. Contact Us",
    "privacy.s7.p": "If you have any questions about our privacy practices, feel free to reach out.",
    "privacy.footerEncrypted": 'This conversation is encrypted and private. Click "Quick Exit" at any time to clear screen instantly.',
    "privacy.footerReturn": "You are viewing the current Privacy Policy. Return to Chat",

    "communities.title": "LOCAL COMMUNITIES",
    "communities.subtitle": "You're not alone. Connect with local communities for Turkish women",
    "communities.orgsHeading": "Local Community Centres and Organisations",
    "communities.daymer": "Established in London in 1989, Day-Mer is a long-standing community centre that supports women's integration into society, access to social rights, and efforts to reduce social isolation. It has a dedicated women's section and runs programmes specifically for women.",
    "communities.imece": "Provides support to Turkish, Kurdish, Turkish Cypriot and other migrant women experiencing issues such as violence, discrimination and poverty. It offers guidance, counselling and advocacy services.",
    "communities.twpa": "One of the UK's long-established Turkish women's organisations, TWPA focuses on education, philanthropy and strengthening community connections.",
    "communities.ikwro": "Provides vital support and advice to migrant women, including Turkish-language support, particularly around issues such as so-called honour-based abuse, domestic violence and forced marriage.",
    "communities.networksHeading": "Local and Online Networks",
    "communities.socialGroupsName": "Community &amp; Social Groups",
    "communities.socialGroupsDesc": 'Informal women\'s communities, such as <a class="org-link" href="https://www.risehercollective.com/" target="_blank" rel="noopener noreferrer">Rise Her Collective</a>, organise social meet-ups, outings and other activities, helping women build connections and support networks.',
    "communities.socialMediaName": "Social Media Communities",
    "communities.socialMediaDesc": 'Facebook groups such as <a class="org-link" href="https://www.facebook.com/groups/gocmenanneler/" target="_blank" rel="noopener noreferrer">Göçmen Kadınlar</a> provide spaces where migrant women can exchange information, connect with one another, find peer support and navigate life in the UK.',
    "communities.footerPrivacyTitle": "Privacy Policy",
    "communities.footerPrivacyLink": "Read Sun's Privacy Policy",
    "communities.footerEmergencyTitle": "Emergency Contact",
    "communities.footerEmergencyText": "If you're in immediate danger, contact emergency services.",
    "communities.footerContact": "Contact",
    "communities.footerCopyright": "© 2026 sun.chat. All rights reserved.",

    "safety.title": "Your Safety Matters",
    "safety.alertText": "Quick Exit button is located at the top right corner of every page",
    "safety.guidelinesTitle": "For your privacy and safety:",
    "safety.bullet1": "The Quick Exit button will immediately redirect you to Google.",
    "safety.bullet2": "Consider using private/incognito browsing mode.",
    "safety.bullet3": "Clear your browser history after visiting.",
    "safety.dontShow": "Don't show this message again",
    "safety.understand": "I Understand",
    "safety.leaveNow": "Leave Now",

    "feedback.title": "Share Your Feedback",
    "feedback.ratingLabel": "How would you rate your experience?",
    "feedback.textLabel": "Tell us more about your experience",
    "feedback.textPlaceholder": "Your feedback helps us improve...",
    "feedback.submit": "Submit Feedback",
    "feedback.thanks": "Thank you — your feedback helps us improve. 💛",

    "security.title": "Safety Tips",
    "security.subtitle": "Here are some tips for keeping you and your loved ones safe online.",
    "security.note": "One thing worth knowing: changing a setting, for example changing a password, can sometimes let the other person know something has changed, and that can make their reaction worse. So when you make a change can matter as much as what you change. If you are not sure, it can be safer to talk it through with someone you trust, or with the helpline below, before you make a change.",
    "security.emergency": "If you are in immediate danger, call 999. If you have concerns but it is not an emergency, you can call the National Domestic Abuse Helpline any time of day: 0808 2000 247.",
    "security.f1.title": "1. Add a lock to your devices",
    "security.f1.desc": `Making sure your phone, laptop and tablet each have a lock, a PIN, fingerprint, or face ID, is a good first step. When picking a PIN, it helps to avoid anything easy to guess, like your birthday, part of your name, or a simple sequence like "1234", and to avoid reusing the same code across more than one device. You can usually set or change this in a few taps under your device's "Settings" menu.`,
    "security.f2.title": "2. Keep an eye on your browsing history",
    "security.f2.desc": 'The sites you visit and when you visited them are usually saved as a history in your browser. If you\'re worried someone else might see this, you have a few options: use your browser\'s "private" mode (which doesn\'t save history), clear your history by hand after each use, or check the separate records kept by search engines like Google or Bing. Women\'s Aid\'s <a href="https://womensaid.org.uk/information-support/what-is-domestic-abuse/cover-your-tracks-online/" target="_blank" rel="noopener noreferrer" style="color:#6b7fe0;text-decoration:underline;cursor:pointer">Cover Your Tracks Online</a> page walks through this step by step for each browser.',
    "security.f3.title": "3. Set your devices to lock themselves automatically",
    "security.f3.desc": `Having your phone or laptop lock on its own shortly after you put it down makes it harder for anyone to look through it without you knowing. This is usually found under a "Screen" or "Lock" setting.`,
    "security.f4.title": "4. Turn on two factor authentication",
    "security.f4.desc": "Adding a second layer beyond your password, like a code sent to your phone when you log in, means an account stays yours even if the password alone becomes known to someone else. It's worth turning this on separately for email, social media, and banking accounts.",
    "security.f5.title": "5. Review who has access to shared accounts or cloud storage",
    "security.f5.desc": "If you use a shared account, Google Drive, iCloud, OneDrive, and similar, it's a good habit to check every so often who still has access. If there's someone you no longer want to share with, you can remove their access.",
    "security.f6.title": "6. Refresh your social media privacy settings",
    "security.f6.desc": 'Check who can see your profile, your friends or followers list, and what you post. You can block or unfollow people, or hide your friends list from others. Women\'s Aid\'s <a href="https://womensaid.org.uk/information-support/what-is-domestic-abuse/cover-your-tracks-online/" target="_blank" rel="noopener noreferrer" style="color:#6b7fe0;text-decoration:underline;cursor:pointer">Cover Your Tracks Online</a> page has current, platform by platform guides for Facebook, Instagram, WhatsApp, TikTok, and more.',
    "security.f7.title": "7. Check your cloud backup settings",
    "security.f7.desc": "It's worth knowing whether your photos and files are being backed up automatically to a cloud service like iCloud or Google Photos, since that affects where your content is stored. You can turn this on or off at any time in your settings.",
    "security.f8.title": "8. Change your PINs and passwords every so often",
    "security.f8.desc": "Refreshing your passwords from time to time, especially any that someone else may have known at some point, helps you take back control. Aim for a different, hard to guess password for each account.",
    "security.footerPrivacyTitle": "Privacy Policy",
    "security.footerPrivacyLink": "Read Sun's Privacy Policy",
    "security.footerEmergencyTitle": "Emergency Contact",
    "security.footerEmergencyText": "If you're in immediate danger, contact emergency services.",
    "security.footerContact": "Contact",
    "security.footerCopyright": "© 2026 sun.chat. All rights reserved.",
  },

  TR: {
    "nav.home": "Ana Sayfa",
    "nav.feedback": "Geri Bildirim",
    "nav.resetChat": "Sohbeti Sıfırla",
    "nav.communities": "Yerel Topluluklar",
    "nav.security": "Güvenlik",
    "nav.privacy": "Gizlilik",
    "nav.quickExit": "HIZLI ÇIKIŞ",

    "landing.avatarName": "Sun",
    "landing.avatarRole": "Yapay Zeka Destek Asistanı",
    "landing.intro1": "Ben bir sohbet robotuyum, insan değilim. İlişkinizde aile içi şiddet olabilecek bir durum yaşıyorsanız, size yardımcı olmak için buradayım.",
    "landing.intro2": "Güvenliğiniz, ihbar seçenekleriniz ve göçmen deneyimlerini anlayan hizmetler dahil destek bulabileceğiniz yerler hakkında bana sorular sorabilirsiniz.",
    "landing.intro3": "Birleşik Krallık'ta yaşayan Türk göçmen kadınlara yardımcı olmak için tasarlandım, ancak bazı bilgilerim başka bir yerde yaşasanız da işinize yarayabilir.",
    "landing.bubbleMeta": "Sun • Yapay Zeka",
    "landing.startChatting": "Sohbete Başla",
    "landing.footerEncrypted": 'Bu sohbet şifrelenmiş ve gizlidir. Ekranı anında temizlemek için istediğiniz zaman "Hızlı Çıkış"a tıklayın.',
    "landing.footerAgree": "Sohbet ederek Gizlilik Politikamızı ve Şartlarımızı kabul etmiş olursun",
    "landing.activeSession": "Aktif Oturum",

    "chat.heading": "Bugün size nasıl yardımcı olabilirim?",
    "chat.disclaimerEmpty": "Ben bir yapay zeka desteğiyim. Acil tehlike altındaysanız lütfen acil servisleri arayın. Acil durumlarda ne yazık ki size yardımcı olamam. Hata yapabilirim, lütfen önemli bilgileri tekrar kontrol edin. Herhangi bir sorunla karşılaşırsanız geri bildiriminizi paylaşın.",
    "chat.placeholderEmpty": "Hangi dilde sohbet etmek istersin?",
    "chip.notSure": "Nereden başlayacağımı bilmiyorum",
    "chip.needSupport": "Desteğe ihtiyacım var",
    "chip.signsOfAbuse": "İstismar belirtileri nelerdir?",
    "chat.placeholderConvo": "Ne hakkında konuşmak istersin?",
    "chat.disclaimerConvo": "Ben bir yapay zeka sohbet robotuyum. Acil tehlike altındaysanız lütfen acil servisleri arayın. Acil durumlarda yardımcı olamam.",
    "chat.footerAgree": 'Bu sohbeti kullanarak Sun\'ın <span class="link" data-goto="privacy">Gizlilik Politikası</span>\'nı kabul etmiş olursun',

    "privacy.title": "Gizlilik Politikası",
    "privacy.s1.h": "1. Giriş",
    "privacy.s1.p": "Gizliliğiniz bizim için önemlidir. Sun olarak, kullanıcı verilerini korumaya ve işleyiş şeklimizde şeffaflık sağlamaya kararlıyız. Bu Gizlilik Politikası, Sun.chat ve ilgili hizmetleriyle etkileşimde bulunduğunuzda bilgileri nasıl ele aldığımızı açıklamaktadır.",
    "privacy.s2.h": "2. Kişisel Bilgi Toplanmaması",
    "privacy.s2.p": "Sun, hizmeti kullanmak için hesap ya da herhangi bir kişisel kimlik bilgisi gerektirmez. Sayfayı kapattığınızda ya da yenilediğinizde konuşmanız saklanmaz. Yanıt üretebilmek için Sun, mesajlarınızı temeldeki yapay zeka teknolojisinin sahibi olan Anthropic'e gönderir. Anthropic bu bilgiyi güvenlik amacıyla en fazla yedi gün tutar, bu sürenin sonunda otomatik olarak siler ve bu veriyi hiçbir zaman kendi yapay zeka modellerini eğitmek için kullanmaz.",
    "privacy.s3.h": "3. Veri Güvenliği ve Koruması",
    "privacy.s3.p": "Kişisel veri toplamasak da, güvenli ve gizli bir kullanıcı deneyimi sağlamak için gerekli önlemleri alıyoruz. Sun ile tüm etkileşimler şifrelenir ve yetkisiz erişime veya kötüye kullanıma karşı korunur.",
    "privacy.s4.h": "4. Üçüncü Taraf Hizmetleri ve Mesajlaşma Uygulamaları",
    "privacy.s4.p": "Platformumuz harici sitelere bağlantılar içerebilir. Bu üçüncü taraf platformların gizlilik uygulamalarından sorumlu değiliz.",
    "privacy.s5.h": "5. Kullanıcı Hakları ve Kontrolü",
    "privacy.s5.p": "Sun, konuşmanızın kalıcı bir kaydını tutmadığı için, bu kısa süre otomatik olarak kapandığında talep edilecek ya da silinecek bir şey kalmaz.",
    "privacy.s6.h": "6. Politikanın Kabulü",
    "privacy.s6.p": "Sun.chat'i kullanarak bu Gizlilik Politikasını kabul etmiş olursunuz.",
    "privacy.s7.h": "7. Bize Ulaşın",
    "privacy.s7.p": "Gizlilik uygulamalarımız hakkında sorularınız varsa bizimle iletişime geçmekten çekinmeyin.",
    "privacy.footerEncrypted": 'Bu konuşma şifreli ve gizlidir. "Hızlı Çıkış"a tıklayarak ekranı anında temizleyebilirsin.',
    "privacy.footerReturn": "Şu anda güncel Gizlilik Politikasını görüntülüyorsun. Sohbete Dön",

    "communities.title": "YEREL TOPLULUKLAR",
    "communities.subtitle": "Yalnız değilsiniz. Türk kadınları için yerel topluluklarla bağlantı kurun.",
    "communities.orgsHeading": "Yerel Topluluk Merkezleri ve Kuruluşlar",
    "communities.daymer": "1989'da Londra'da kurulan Day-Mer, kadınların topluma entegrasyonunu, sosyal haklara erişimini ve sosyal izolasyonun azaltılmasını destekleyen köklü bir toplum merkezidir. Özel bir kadın bölümü bulunmakta ve kadınlara yönelik programlar yürütmektedir.",
    "communities.imece": "Şiddet, ayrımcılık ve yoksulluk gibi sorunlar yaşayan Türk, Kürt, Kıbrıslı Türk ve diğer göçmen kadınlara destek sağlar. Rehberlik, danışmanlık ve savunuculuk hizmetleri sunar.",
    "communities.twpa": "Birleşik Krallık'ın köklü Türk kadın kuruluşlarından biri olan TWPA, eğitim, hayırseverlik ve topluluk bağlarını güçlendirmeye odaklanmaktadır.",
    "communities.ikwro": "Göçmen kadınlara, özellikle namus cinayetleri, aile içi şiddet ve zorla evlendirme gibi konularda Türkçe dil desteği dahil hayati destek ve danışmanlık sağlar.",
    "communities.networksHeading": "Yerel ve Çevrimiçi Ağlar",
    "communities.socialGroupsName": "Topluluk ve Sosyal Gruplar",
    "communities.socialGroupsDesc": '<a class="org-link" href="https://www.risehercollective.com/" target="_blank" rel="noopener noreferrer">Rise Her Collective</a> gibi kadın toplulukları sosyal buluşmalar, geziler ve diğer etkinlikler düzenleyerek kadınların bağlantı kurmasına ve destek ağları oluşturmasına yardımcı olur.',
    "communities.socialMediaName": "Sosyal Medya Toplulukları",
    "communities.socialMediaDesc": '<a class="org-link" href="https://www.facebook.com/groups/gocmenanneler/" target="_blank" rel="noopener noreferrer">Göçmen Kadınlar</a> gibi Facebook grupları, göçmen kadınların bilgi alışverişinde bulunabileceği, birbirleriyle bağlantı kurabileceği, akran desteği bulabileceği ve Birleşik Krallık\'ta hayatlarını yönlendirebileceği alanlar sunar.',
    "communities.footerPrivacyTitle": "Gizlilik Politikası",
    "communities.footerPrivacyLink": "Sun'ın Gizlilik Politikasını Oku",
    "communities.footerEmergencyTitle": "Acil Durum İletişimi",
    "communities.footerEmergencyText": "Acil bir tehlikedeysen, acil servislerle iletişime geç.",
    "communities.footerContact": "İletişim",
    "communities.footerCopyright": "© 2026 sun.chat. Tüm hakları saklıdır.",

    "safety.title": "Güvenliğiniz Önemli",
    "safety.alertText": "Hızlı Çıkış butonu her sayfanın sağ üst köşesinde yer alır",
    "safety.guidelinesTitle": "Gizliliğiniz ve güvenliğiniz için:",
    "safety.bullet1": "Hızlı Çıkış butonu sizi anında Google'a yönlendirecektir.",
    "safety.bullet2": "Gizli/özel tarama modunu kullanmayı düşünün.",
    "safety.bullet3": "Ziyaret ettikten sonra tarayıcı geçmişinizi temizleyin.",
    "safety.dontShow": "Bu mesajı bir daha gösterme",
    "safety.understand": "Anladım",
    "safety.leaveNow": "Şimdi Ayrıl",

    "feedback.title": "Geri Bildiriminizi Paylaşın",
    "feedback.ratingLabel": "Deneyiminizi nasıl değerlendirirsiniz?",
    "feedback.textLabel": "Deneyiminiz hakkında daha fazla bilgi verin",
    "feedback.textPlaceholder": "Geri bildiriminiz iyileştirmemize yardımcı olur...",
    "feedback.submit": "Geri Bildirimi Gönder",
    "feedback.thanks": "Teşekkürler — geri bildirimin gelişmemize yardımcı oluyor. 💛",

    "security.title": "Güvenlik İpuçları",
    "security.subtitle": "Kendinizi ve sevdiklerinizi çevrimiçi ortamda güvende tutmak için bazı ipuçları.",
    "security.note": "Önemli bir not: bazı ayarları değiştirmek, örneğin bir şifreyi değiştirmek, karşı tarafın bunu fark etmesine ve tepkisinin şiddetlenmesine yol açabilir. Bu yüzden hangi adımı ne zaman atacağın, adımın kendisi kadar önemlidir. Emin değilsen, bir adımı atmadan önce güvenilir biriyle ya da aşağıdaki hatla konuşmak daha güvenli olabilir.",
    "security.emergency": "Acil bir tehlikedeysen 999'u ara. Endişelerin varsa ama acil değilse, National Domestic Abuse Helpline'ı günün her saati arayabilirsin: 0808 2000 247. Bu hat tercüme desteğiyle de erişilebilir.",
    "security.f1.title": "1. Cihazlarına şifre veya kilit koy",
    "security.f1.desc": `Telefonun, bilgisayarın ve tabletin, hepsinde bir kilit (PIN, parmak izi veya yüz tanıma) olması iyi bir başlangıç noktasıdır. PIN seçerken doğum tarihin, isminin bir kısmı ya da "1234" gibi tahmin edilmesi kolay kombinasyonlardan kaçınmak, aynı kodu birden fazla cihazda kullanmamak fark yaratır. Bunu genelde cihazının "Ayarlar" menüsünden birkaç adımda değiştirebilirsin.`,
    "security.f2.title": "2. Tarayıcı geçmişini kontrol altında tut",
    "security.f2.desc": 'Ziyaret ettiğin siteler ve ne zaman baktığın, tarayıcında bir geçmiş olarak kayıt altına alınır. Biri bunu görebiliyor olabileceğini düşünüyorsan, birkaç seçeneğin var: tarayıcının "gizli" modunu kullanmak (bu geçmiş kaydetmez), her kullanımdan sonra geçmişi elle temizlemek, ya da arama motorunun kendi kayıtlarını da (Google, Bing gibi) ayrıca kontrol etmek. Women\'s Aid\'in <a href="https://womensaid.org.uk/information-support/what-is-domestic-abuse/cover-your-tracks-online/" target="_blank" rel="noopener noreferrer" style="color:#4a5eb8;text-decoration:underline;cursor:pointer">Cover Your Tracks Online</a> sayfasında her tarayıcı için adım adım anlatım bulabilirsin.',
    "security.f3.title": "3. Cihazların otomatik kilitlensin",
    "security.f3.desc": `Telefonunu veya bilgisayarını bir kenara bıraktığında kısa sürede otomatik kilitlenmesini sağlamak, birinin cihazına habersizce bakabilme ihtimalini azaltır. Bu ayar genelde "Ekran" veya "Kilit" bölümünde.`,
    "security.f4.title": "4. İki adımlı doğrulamayı aç",
    "security.f4.desc": "Şifrenin yanına ikinci bir güvenlik katmanı eklemek, örneğin girişte telefonuna gelen bir kod istenmesi, hesabına yalnızca senin erişebilmeni sağlar, şifren bir şekilde öğrenilmiş olsa bile. Bunu e posta, sosyal medya ve banka hesaplarında ayrı ayrı açman önerilir.",
    "security.f5.title": "5. Ortak kullanılan hesapları ve bulut depolamayı gözden geçir",
    "security.f5.desc": "Google Drive, iCloud, OneDrive gibi paylaşımlı bir hesabın varsa, kimin hâlâ erişimi olduğuna zaman zaman bakmak iyi bir alışkanlıktır. Artık paylaşmak istemediğin biri varsa, erişimini kaldırabilirsin.",
    "security.f6.title": "6. Sosyal medya gizlilik ayarlarını yenile",
    "security.f6.desc": 'Profilinin, arkadaş ya da takipçi listenin ve paylaşımlarının kimler tarafından görülebildiğini kontrol et. İstemediğin kişileri engelleyebilir, takipten çıkarabilir veya arkadaş listeni gizleyebilirsin. Women\'s Aid\'in <a href="https://womensaid.org.uk/information-support/what-is-domestic-abuse/cover-your-tracks-online/" target="_blank" rel="noopener noreferrer" style="color:#4a5eb8;text-decoration:underline;cursor:pointer">Cover Your Tracks Online</a> sayfasında Facebook, Instagram, WhatsApp, TikTok ve daha birçok platform için ayrı ayrı, güncel adımlar bulunuyor.',
    "security.f7.title": "7. Bulut yedekleme ayarlarını kontrol et",
    "security.f7.desc": "Fotoğraf ve dosyaların otomatik olarak bir buluta (iCloud, Google Photos gibi) yedeklenip yedeklenmediğini kontrol etmek, hangi içeriğin nerede saklandığını bilmeni sağlar. Bu ayarları istediğin zaman açıp kapatabilirsin.",
    "security.f8.title": "8. PIN ve şifreleri düzenli aralıklarla değiştir",
    "security.f8.desc": "Zaman zaman şifrelerini yenilemek, özellikle bir dönem başka birinin bilgisi olduğunu düşündüğün şifreler için, kontrolü yeniden sana verir. Tahmin edilmesi zor, her hesap için farklı bir şifre seçmek en güvenlisi.",
    "security.footerPrivacyTitle": "Gizlilik Politikası",
    "security.footerPrivacyLink": "Sun'un Gizlilik Politikasını Okuyun",
    "security.footerEmergencyTitle": "Acil İletişim",
    "security.footerEmergencyText": "Acil tehlike altındaysanız acil servisleri arayın.",
    "security.footerContact": "İletişim",
    "security.footerCopyright": "© 2026 sun.chat. Tüm hakları saklıdır.",
  },
};

function applyLanguage(lang) {
  state.lang = lang;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ENG;

  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  $$("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  $$("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  document.documentElement.lang = lang === "TR" ? "tr" : "en";
}

const pages = {
  landing: $("#page-landing"),
  chat: $("#page-chat"),
  privacy: $("#page-privacy"),
  communities: $("#page-communities"),
  security: $("#page-security"),
};

function showPage(name) {
  state.page = name;
  Object.entries(pages).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
  // Nav: chat page shows Home/Feedback/Reset Chat on the left,
  // every other page shows Local Communities/Safety/Privacy on the right.
  const isChat = name === "chat";
  $("#navChatLinks").hidden = !isChat;
  $("#navPageLinks").hidden = isChat;
  // Highlight whichever of those three links matches the current page.
  $$("#navPageLinks .nav-link").forEach((el) => {
    el.classList.toggle("active", el.dataset.page === name);
  });
  if (name === "chat") renderChat();
}

// Sends the browser to the REAL Google homepage, and uses replace() instead
// of a normal navigation so this page is not left in browser history —
// pressing "back" afterwards will not return here.
function quickExit() {
  window.location.replace("https://www.google.com");
}

// ---------- NAV ----------
$("#logoHome").addEventListener("click", () => showPage("landing"));

// Event delegation (not per-element listeners) for [data-goto]: some of
// these links live inside elements whose innerHTML gets replaced when the
// language toggles (e.g. the "Privacy Policy" link inside chat.footerAgree),
// which would silently detach a directly-bound listener. Delegation from
// document keeps working no matter how many times that inner HTML changes.
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-goto]");
  if (target) showPage(target.dataset.goto);
});

$("#quickExitBtn").addEventListener("click", quickExit);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") quickExit();
});

$$("#langToggle .lang-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    $$("#langToggle .lang-pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    applyLanguage(pill.dataset.lang);
  });
});

// ---------- SAFETY MODAL ----------
const safetyModal = $("#safetyModal");

$("#startChattingBtn").addEventListener("click", () => {
  if (state.skipSafetyModal) {
    showPage("chat");
  } else {
    safetyModal.hidden = false;
  }
});
$("#safetyUnderstandBtn").addEventListener("click", () => {
  if ($("#dontShowAgain").checked) state.skipSafetyModal = true;
  safetyModal.hidden = true;
  showPage("chat");
});
$("#safetyLeaveBtn").addEventListener("click", quickExit);

// ---------- FEEDBACK MODAL ----------
const feedbackModal = $("#feedbackModal");
const feedbackCard = $("#feedbackCard");
const feedbackThanks = $("#feedbackThanks");
let feedbackRating = 0;

function openFeedback() {
  feedbackRating = 0;
  renderStars();
  $("#feedbackTextarea").value = "";
  feedbackCard.hidden = false;
  feedbackThanks.hidden = true;
  feedbackModal.hidden = false;
}
function closeFeedback() {
  feedbackModal.hidden = true;
}
$("#feedbackCloseBtn").addEventListener("click", closeFeedback);
$("[data-action='feedback']").addEventListener("click", openFeedback);

function renderStars() {
  $$(".star-btn").forEach((btn) => {
    const val = Number(btn.dataset.star);
    btn.classList.toggle("active", val <= feedbackRating);
  });
}
$$(".star-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    feedbackRating = Number(btn.dataset.star);
    renderStars();
  });
});
$("#submitFeedbackBtn").addEventListener("click", () => {
  feedbackCard.hidden = true;
  feedbackThanks.hidden = false;
  setTimeout(closeFeedback, 1300);
});

// ---------- RESET CHAT ----------
$("[data-action='reset-chat']").addEventListener("click", () => {
  state.messages = [];
  renderChat();
});

// ---------- CHAT ----------
function renderChat() {
  const isEmpty = state.messages.length === 0;
  $("#chatEmptyState").hidden = !isEmpty;
  $("#chatConversationState").hidden = isEmpty;
  if (!isEmpty) renderMessages();
}

function renderMessages() {
  const stream = $("#messagesStream");
  stream.innerHTML = "";
  state.messages.forEach((m) => {
    const row = document.createElement("div");
    if (m.role === "user") {
      row.className = "msg-row-user";
      row.innerHTML = `<div class="msg-bubble-user"></div>`;
      row.querySelector(".msg-bubble-user").textContent = m.text;
    } else {
      row.className = "msg-row-bot";
      row.innerHTML = `
        <div class="avatar-circle avatar-circle-sm"><img src="sun-logo.svg" class="avatar-img avatar-img-sm" alt="Sun" /></div>
        <div class="msg-bubble-bot"></div>`;
      row.querySelector(".msg-bubble-bot").innerHTML =
        typeof marked !== "undefined" ? marked.parse(m.text) : m.text;
    }
    stream.appendChild(row);
  });
  if (state.loading) {
    const row = document.createElement("div");
    row.className = "msg-row-bot";
    row.innerHTML = `
      <div class="avatar-circle avatar-circle-sm"><img src="sun-logo.svg" class="avatar-img avatar-img-sm" alt="Sun" /></div>
      <div class="msg-bubble-bot">typing…</div>`;
    stream.appendChild(row);
  }
  // messagesStream is now its own internally-scrolling container (see
  // #page-chat / .messages-stream in style.css), so we scroll its own
  // content to the bottom rather than scrolling it into view within an
  // outer page — that keeps the nav/input/footer fixed in place.
  stream.scrollTo({ top: stream.scrollHeight, behavior: "smooth" });
}

async function sendMessage(text) {
  if (!text || !text.trim()) return;
  state.messages.push({ role: "user", text: text.trim() });
  state.loading = true;
  renderChat();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: state.messages.map((m) => ({ role: m.role, content: m.text })),
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    state.messages.push({ role: "assistant", text: data.reply });
  } catch (err) {
    state.messages.push({
      role: "assistant",
      text: "Something went wrong reaching Sun. Please check the server terminal for the error, and try again.",
    });
    console.error(err);
  } finally {
    state.loading = false;
    renderChat();
  }
}

function wireChatInputs() {
  const emptyInput = $("#chatInputEmpty");
  const convoInput = $("#chatInputConvo");

  // Grows the textarea's height to fit its content (up to the max-height
  // set in CSS, beyond which it scrolls internally) — this is what keeps
  // a longer message growing downward instead of scrolling sideways.
  const autoGrow = (el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };
  [emptyInput, convoInput].forEach((el) => {
    el.addEventListener("input", () => autoGrow(el));
  });

  const resetHeight = (el) => {
    el.style.height = "auto";
  };

  $("#sendBtnEmpty").addEventListener("click", () => {
    sendMessage(emptyInput.value);
    emptyInput.value = "";
    resetHeight(emptyInput);
  });
  emptyInput.addEventListener("keydown", (e) => {
    // Enter sends the message; Shift+Enter inserts a normal line break.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(emptyInput.value);
      emptyInput.value = "";
      resetHeight(emptyInput);
    }
  });

  $("#sendBtnConvo").addEventListener("click", () => {
    sendMessage(convoInput.value);
    convoInput.value = "";
    resetHeight(convoInput);
  });
  convoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(convoInput.value);
      convoInput.value = "";
      resetHeight(convoInput);
    }
  });

  $$("[data-chip]").forEach((chip) => {
    chip.addEventListener("click", () => sendMessage(chip.textContent));
  });
}

// Measures the sticky nav's real rendered height (it wraps to more lines
// on narrow screens) and exposes it as --nav-h, so #page-chat can size
// itself to exactly "the rest of the viewport" in style.css.
function syncNavHeight() {
  const nav = $("#nav");
  if (nav) {
    document.documentElement.style.setProperty("--nav-h", nav.offsetHeight + "px");
  }
}
window.addEventListener("resize", syncNavHeight);

wireChatInputs();
syncNavHeight();
showPage("landing");
