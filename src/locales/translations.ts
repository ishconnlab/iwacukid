export type SupportedLanguage = 'rw' | 'en';

export interface Translations {
  // Brand & General
  brandName: string;
  brandTagline: string;
  locationLabel: string;
  loading: string;
  close: string;
  back: string;
  cancel: string;
  save: string;
  confirm: string;
  viewAll: string;
  searchPlaceholder: string;

  // Navigation
  navHome: string;
  navEvents: string;
  navPrograms: string;
  navGallery: string;
  navAbout: string;
  navLocation: string;
  navTickets: string;
  navGateScanner: string;
  navAdmin: string;
  navStaffLogin: string;
  navGetTickets: string;
  navServices: string;
  navIshConnect: string;
  brandRegion: string;

  // Ticker / Marquee
  marqueeTitle: string;
  tickerEvents: string[];

  // Hero
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroDescription: string;
  heroExploreBtn: string;
  heroBuyTicketsBtn: string;
  heroTrustQr: string;
  heroTrustMtn: string;
  heroTrustAirtel: string;
  heroTrustUssd: string;
  heroNextEvent: string;
  heroStartingFrom: string;

  // Categories
  catTraditional: string;
  catTraditionalSub: string;
  catModern: string;
  catModernSub: string;
  catSummer: string;
  catSummerSub: string;
  catVacation: string;
  catVacationSub: string;

  // Cultural Interactive Section
  cultureSectionEyebrow: string;
  cultureSectionTitle: string;
  cultureSectionSubtitle: string;
  interactiveHotspotInstruction: string;
  drumSoundBtn: string;
  drumSoundPlaying: string;
  drumSoundDesc: string;

  // CEO & Philosophy
  leadershipEyebrow: string;
  leadershipQuote: string;
  leadershipDesc: string;
  ceoNameTitle: string;
  ceoBadge: string;
  pillTraditionTitle: string;
  pillTraditionDesc: string;
  pillCommunityTitle: string;
  pillCommunityDesc: string;

  // Events & Discover
  upcomingSectionTitle: string;
  upcomingSectionSubtitle: string;
  filterAll: string;
  noEventsFound: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventTicketsFrom: string;
  eventBuyPass: string;
  eventDetails: string;
  eventWhatsIncluded: string;
  eventAgeRange: string;

  // Checkout
  checkoutTitle: string;
  checkoutSubtitle: string;
  checkoutStep1: string;
  checkoutStep2: string;
  checkoutStep3: string;
  checkoutAttendeeName: string;
  checkoutAttendeeNamePlaceholder: string;
  checkoutPhone: string;
  checkoutPhoneHint: string;
  checkoutEmail: string;
  checkoutEmailHint: string;
  checkoutSelectPayment: string;
  checkoutPayMoMo: string;
  checkoutPayMoMoSub: string;
  checkoutPayAirtel: string;
  checkoutPayAirtelSub: string;
  checkoutPayUssd: string;
  checkoutPayUssdSub: string;
  checkoutTotalAmount: string;
  checkoutProceedBtn: string;
  checkoutAuthorizeBtn: string;
  checkoutUssdTitle: string;
  checkoutUssdCodeLabel: string;
  checkoutUssdCopyBtn: string;
  checkoutUssdCopied: string;
  checkoutUssdDialBtn: string;
  checkoutUssdTxIdLabel: string;
  checkoutUssdTxIdPlaceholder: string;
  checkoutUssdSubmitBtn: string;
  checkoutUssdNotice: string;
  checkoutQuantity: string;
  checkoutTier: string;

  // Gate Scanner & Access Security
  scannerTitle: string;
  scannerSubtitle: string;
  scannerRestrictedTitle: string;
  scannerRestrictedDesc: string;
  scannerLoginBtn: string;
  scannerEnterPinBtn: string;
  scannerPinPlaceholder: string;
  scannerVerifyPinBtn: string;
  scannerStatusAuthorized: string;
  scannerStatusAdmin: string;
  scannerStatusStaff: string;
  scannerStartCamera: string;
  scannerStopCamera: string;
  scannerManualSearchPlaceholder: string;
  scannerCheckCodeBtn: string;
  scannerSuccessValid: string;
  scannerAlreadyUsed: string;
  scannerInvalid: string;
  scannerAdmitAttendee: string;
  scannerRecentScans: string;

  // My Tickets
  myTicketsTitle: string;
  myTicketsSubtitle: string;
  myTicketsEmpty: string;
  myTicketsSearchPlaceholder: string;
  myTicketsSearchBtn: string;
  myTicketsScanNotice: string;
  myTicketsDownloadBtn: string;

  // Admin
  adminTitle: string;
  adminWelcome: string;
  adminRevenue: string;
  adminTicketsSold: string;
  adminCheckInRate: string;
  adminPendingOrders: string;
  adminManageEvents: string;
  adminGateScanners: string;
  adminUssdOrders: string;
  adminClearanceApprove: string;
  adminClearanceRevoke: string;
  adminClearanceApproved: string;
  adminClearanceRevoked: string;
  adminAddScannerHelper: string;

  // Landing extras
  heroSubtitleTag: string;
  landingStatsEvents: string;
  landingStatsMembers: string;
  landingStatsSessions: string;
  landingStatsVenue: string;

  // Login & Register (customer account)
  loginBadge: string;
  loginTitle: string;
  loginSubtitle: string;
  loginTabSignIn: string;
  loginTabRegister: string;
  loginIdentifierLabel: string;
  loginIdentifierPlaceholder: string;
  loginPasswordLabel: string;
  loginPasswordPlaceholder: string;
  loginHint: string;
  loginSignInBtn: string;
  loginSigningIn: string;
  loginBackHome: string;
  registerFullNameLabel: string;
  registerFullNamePlaceholder: string;
  registerPhoneLabel: string;
  registerPhonePlaceholder: string;
  registerEmailLabel: string;
  registerEmailPlaceholder: string;
  registerPasswordLabel: string;
  registerPasswordHint: string;
  registerConfirmLabel: string;
  registerConfirmPlaceholder: string;
  registerBenefitTitle: string;
  registerBenefitQr: string;
  registerBenefitCode: string;
  registerBenefitInstant: string;
  registerBtn: string;
  registerCreating: string;
  registerPasswordMismatch: string;
  registerFieldMissing: string;
  passwordShow: string;
  passwordHide: string;
  staffAccessTitle: string;
  staffAccessDesc: string;
  staffAccessBtn: string;
  staffAccessNote: string;

  // Landing: How It Works
  howItWorksEyebrow: string;
  howItWorksTitle: string;
  howItWorksDesc: string;
  stepPickTitle: string;
  stepPickDesc: string;
  stepPayTitle: string;
  stepPayDesc: string;
  stepJoinTitle: string;
  stepJoinDesc: string;

  // Login split-screen panel
  loginSideTitle: string;
  loginSideDesc: string;
  loginLiveBadge: string;
  loginTestimonial: string;
  loginTestimonialName: string;

  // PWA install
  pwaInstall: string;
  pwaAskTitle: string;
  pwaAskDesc: string;
  pwaNoData: string;
  pwaCancel: string;
  pwaInstallNow: string;
  pwaIosTitle: string;
  pwaIosDesc: string;
  pwaIosStep: string;
  pwaIosDone: string;

  // Welcome video
  videoSectionTitle: string;
  videoSectionDesc: string;
  videoPlayBtn: string;
  videoLoading: string;
  videoNotAvailable: string;

  // Map & location
  mapOpenLabel: string;
  mapDirectionsLabel: string;
  mapScrollHint: string;

  // Offline state
  offlineTitle: string;
  offlineDesc: string;

  // Errors / 404
  notFoundTitle: string;
  notFoundDesc: string;
  error500Title: string;
  error500Desc: string;
  backHomeBtn: string;
  tryAgainBtn: string;

  // Footer & WhatsApp
  footerBrandDesc: string;
  quickLinksTitle: string;
  contactTitle: string;
  paymentsTitle: string;
  legalTitle: string;
  legalPrivacy: string;
  legalTerms: string;
  legalTicketPolicy: string;
  rightsLine: string;
  followTitle: string;
  waFloatLabel: string;
  waHelpTitle: string;
  waHelpDesc: string;
  waChatBtn: string;
  waPrefilled: string;

  // Social follow ad (Google-Ads style)
  adLabel: string;
  adTitle: string;
  adDesc: string;
  adSubscribeBtn: string;
  adFollowBtn: string;
  adListenBtn: string;
  adCloseLabel: string;
  adTrustLine: string;

  // Event availability labels
  eventFeatured: string;
  eventUpcoming: string;
  eventLimitedSeats: string;
  eventSoldOut: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  rw: {
    // Brand & General
    brandName: 'IWACU KIDS',
    brandTagline: 'Umuco, Uguhanga udushya n’Impano by’abana i Nyakaliro',
    locationLabel: 'Nyakaliro, Rwamagana • U Rwanda',
    loading: 'Biratunganywa...',
    close: 'Funga',
    back: 'Gusubira inyuma',
    cancel: 'Kureka',
    save: 'Kubika',
    confirm: 'Kwemeza',
    viewAll: 'Reba byose',
    searchPlaceholder: 'Shakisha ibirori, imbyino, cyangwa itike...',

    // Navigation
    navHome: 'Ahabanza',
    navEvents: 'Ibirori',
    navPrograms: 'Gahunda',
    navGallery: 'Amafoto',
    navAbout: 'Ibyerekeye',
    navLocation: 'Aho dukorera',
    navTickets: 'Amatike yanjye',
    navGateScanner: 'Kugenzura amatike (QR)',
    navAdmin: 'Ibiro bikuru',
    navStaffLogin: 'Kwinjira kw’abakozi',
    navGetTickets: 'GURA ITIKE',
    navServices: 'Serivisi zacu',
    navIshConnect: 'IshConnect',
    brandRegion: 'Rwanda • Nyakaliro',

    // Ticker / Marquee
    marqueeTitle: 'IBIKUNZWE UBU',
    tickerEvents: [
      '🔥 Iserukiramuco ry’Imbyino Gakondo & Ingoma i Nyakaliro — Amatike aragurishwa (Kuva ku 1,000 RWF)',
      '⚡ CEO Coopstar atangije: Amarushanwa y’Imbyino zigezweho z’Urubyiruko',
      '🎉 Kwiyandikisha mu biruhuko by’abana (Vacation Camp) birakomeje',
      '🎫 Kwishyura byoroshye: MTN MoMo (*182*8*1*654321#), Airtel Money & Kode ya USSD',
      '📍 Aho bihurira: IWACU Cultural Center, Nyakaliro — Karibu mwese!',
    ],

    // Hero
    heroEyebrow: 'Nyakaliro, u Rwanda • Urubuga rw’umuco n’ubuhanzi bw’abana',
    heroTitleLine1: 'AHO UMUCO',
    heroTitleHighlight: 'URANGARIRA.',
    heroSubtitle: 'UMUCO • UBUHANZI • IMPANO • IBYISHIMO • UMWARIRO',
    heroDescription:
      'Menya kandi wamamaze imbyino gakondo z’u Rwanda, imbyino zigezweho, ibiruhuko by’abana n’ubuhanzi i Nyakaliro. Bika itike yawe ya digitale ako kanya ukoresheje MTN MoMo, Airtel Money, cyangwa kode ya USSD.',
    heroExploreBtn: 'Reba ibirori byose',
    heroBuyTicketsBtn: 'GURA ITIKE',
    heroTrustQr: 'Kwinjira hakoreshejwe QR Code',
    heroTrustMtn: 'MTN MoMo yemewe',
    heroTrustAirtel: 'Airtel Money yemewe',
    heroTrustUssd: 'Kode ya USSD yemewe',
    heroNextEvent: 'Igitaramo gitaha',
    heroStartingFrom: 'Amatike ahera kuri',

    // Categories
    catTraditional: 'Imbyino Gakondo',
    catTraditionalSub: 'Ingoma, Amaraba n’Umushayayo',
    catModern: 'Imbyino Zigezweho',
    catModernSub: 'Afro-fusion & Imbyino z’abato',
    catSummer: 'Ibirori by’Impeshyi',
    catSummerSub: 'Imikino n’Ibyishimo by’umuryango',
    catVacation: 'Gahunda z’Ibiruhuko',
    catVacationSub: 'Amasomo y’ubuhanzi n’ubutoza',

    // Cultural Interactive Section
    cultureSectionEyebrow: 'UBUSO BW’UMUCO N’AMARABA',
    cultureSectionTitle: 'Menya Ibikoresho n’Imyambaro Gakondo',
    cultureSectionSubtitle: 'Kanda ku dukoresho tw’umuco ubashe kumenya amateka n’imikoreshereze yabyo mu birori by’abana i Nyakaliro.',
    interactiveHotspotInstruction: 'Kanda ku kadomo wige byinshi cyangwa wumve ingoma',
    drumSoundBtn: 'Umva Ijwi ry’Ingoma y’u Rwanda',
    drumSoundPlaying: 'Ingoma iravuga mu kirere cy’i Nyakaliro...',
    drumSoundDesc: 'Iri jwi ry’ingoma ritera imbaraga n’icyerekezo abana bato babyina Amaraba n’Intore.',

    // CEO & Philosophy
    leadershipEyebrow: 'UBUYOBOZI N’INDANGAGACIRO',
    leadershipQuote: '« Buri mwana mu Rwanda akwiriye urubuga rwiyubashye rwo kugaragarizaho impano, umuco n’ibyishimo bye. »',
    leadershipDesc:
      'Kuyobowe na CEO Coopstar, IWACU Kids itanga ahantu hizewe, abarimu b’inzobere mu muco, n’ibirori bihebuje bifasha abana kuzamura impano zabo z’imbyino gakondo, ingoma n’ubuhanzi bwa none.',
    ceoNameTitle: 'Coopstar',
    ceoBadge: 'Umuyobozi Mukuru (CEO), IWACU Kids',
    pillTraditionTitle: 'Umuco Nyamukuru',
    pillTraditionDesc: 'Kwiga ku barimu b’inzobere mu gushayaya no kuvuza ingoma.',
    pillCommunityTitle: 'Umuryango w’i Nyakaliro',
    pillCommunityDesc: 'Dufatanya n’ababyeyi n’urubyiruko guteza imbere ejo hazaza.',

    // Events & Discover
    upcomingSectionTitle: 'Ibirori Byegereje i Nyakaliro',
    upcomingSectionSubtitle: 'Hitamo icyo ushaka kwitabira wowe n’umuryango wawe',
    filterAll: 'Byose hamwe',
    noEventsFound: 'Nta birori bibonetse muri iki cyiciro.',
    eventDate: 'Itariki',
    eventTime: 'Isaha',
    eventLocation: 'Aho bizabera',
    eventTicketsFrom: 'Amatike ahera kuri',
    eventBuyPass: 'GURA ITIKE',
    eventDetails: 'Reba birambuye',
    eventWhatsIncluded: 'Ibirimo ku itike',
    eventAgeRange: 'Imyaka yemewe',

    // Checkout
    checkoutTitle: 'Kugura Itike & Kwishyura',
    checkoutSubtitle: 'Itike yemewe ya digitale yo kwinjira muri IWACU Kids',
    checkoutStep1: '1. Amakuru',
    checkoutStep2: '2. Kwishyura',
    checkoutStep3: '3. Itike yawe',
    checkoutAttendeeName: 'Amazina y’umwana cyangwa umubyeyi',
    checkoutAttendeeNamePlaceholder: 'urugero: Jean-Luc Mugisha',
    checkoutPhone: 'Nimero ya telefone (MoMo / Airtel)',
    checkoutPhoneHint: 'Aha niho hazoherezwa itike na mesaji yo kwishyura.',
    checkoutEmail: 'Imeri (Ntabwo ari itegeko)',
    checkoutEmailHint: 'Tuzakohererezaho kopi y’itike yawe muri PDF.',
    checkoutSelectPayment: 'Hitamo uburyo bwo kwishyura',
    checkoutPayMoMo: 'MTN MoMo (Ako kanya)',
    checkoutPayMoMoSub: 'Ubutumwa bwa PIN buhita buza kuri telefone',
    checkoutPayAirtel: 'Airtel Money',
    checkoutPayAirtelSub: 'Kwishyura ukoresheje Airtel Money',
    checkoutPayUssd: 'Kode ya USSD / MoMoPay',
    checkoutPayUssdSub: 'Kanda kode ya USSD ku giturage niba moteri idakora',
    checkoutTotalAmount: 'Amafaranga yose hamwe',
    checkoutProceedBtn: 'KOMEZA WISHYURE',
    checkoutAuthorizeBtn: 'EMEZA WISHYURE & HITA UBONA ITIKE',
    checkoutUssdTitle: 'Kwishyura ukoresheje Kode ya USSD',
    checkoutUssdCodeLabel: 'Kanda iyi kode kuri telefone yawe:',
    checkoutUssdCopyBtn: 'Koporora kode',
    checkoutUssdCopied: 'Kode yakoporowe!',
    checkoutUssdDialBtn: 'Hamagara kode',
    checkoutUssdTxIdLabel: 'Nimero y’ubutumwa bwo kwishyura (TxId / Reference):',
    checkoutUssdTxIdPlaceholder: 'urugero: 10928374 cyangwa nimero woherejeho',
    checkoutUssdSubmitBtn: 'OHEREZA AMASOKO YA USSD & SABA ITIKE',
    checkoutUssdNotice:
      'Niba moteri yo kwishyura itari gukora, kanda kode ya MoMoPay hejuru maze wandike nimero ya transakisiyo (TxId) wahawe muri SMS kugira ngo itike yawe yemezwe.',
    checkoutQuantity: 'Umubare w’amatike',
    checkoutTier: 'Ubwoko bw’itike',

    // Gate Scanner & Access Security
    scannerTitle: 'Kugenzura Amatike ku Muryango (QR Code)',
    scannerSubtitle: 'Icyuma cyizewe cyo kwinjiza abana n’ababyeyi mu birori',
    scannerRestrictedTitle: 'Uruhushya rwo Gusikana Rurakenewe',
    scannerRestrictedDesc:
      'Amasikana ya QR yemerewe gusa Abayobozi b’ibirori (Admins) n’abakozi bahawe uburenganzira bwihariye n’umuyobozi kugira ngo bafashe.',
    scannerLoginBtn: 'Injira nk’Umuyobozi cyangwa Umukozi wemerewe',
    scannerEnterPinBtn: 'Koresha Kode y’Uburenganzira bw’Umuryango',
    scannerPinPlaceholder: 'Andika kode y’uburenganzira bw’umuryango...',
    scannerVerifyPinBtn: 'Emeza Kode',
    scannerStatusAuthorized: 'UMUKOZI WEMEREWE GUSIKANA',
    scannerStatusAdmin: 'UMUYOBOZI MUKURU (ADMIN)',
    scannerStatusStaff: 'UMUKOZI W’UMURYANGO (STAFF)',
    scannerStartCamera: 'Fungura Kamera yo Gusikana',
    scannerStopCamera: 'Funga Kamera',
    scannerManualSearchPlaceholder: 'Andika kode y’itike (urugero: IWK-8F29A-01)...',
    scannerCheckCodeBtn: 'Genzura Itike',
    scannerSuccessValid: 'ITIKE YEMEJWE - YINJIRE!',
    scannerAlreadyUsed: 'ITIKE YARAKORESHEJWE!',
    scannerInvalid: 'ITIKE NTIYEMEWEYE / NTIYABONETSE',
    scannerAdmitAttendee: 'Injiza uyu muntu',
    scannerRecentScans: 'Abamaze kwinjira vuba',

    // My Tickets
    myTicketsTitle: 'Amatike Yanjye ya Digitale',
    myTicketsSubtitle: 'Amatike yawe yose abitswe neza kuri telefone yawe',
    myTicketsEmpty: 'Nta tike iraboneka. Shaka itike y’ibirori ubu!',
    myTicketsSearchPlaceholder: 'Shakisha itike ukoresheje telefone cyangwa imeri...',
    myTicketsSearchBtn: 'Shaka Amatike',
    myTicketsScanNotice: 'Ereka iyi QR code abakozi ku muryango winjire mu birori.',
    myTicketsDownloadBtn: 'Bika ifoto y’itike',

    // Admin
    adminTitle: 'Ibiro Bikuru by’Ibirori i Nyakaliro',
    adminWelcome: 'Murakaza neza mu buyobozi',
    adminRevenue: 'Amafaranga Yinjiye',
    adminTicketsSold: 'Amatike Yagurishijwe',
    adminCheckInRate: 'Ijanisha ry’Abinjiye',
    adminPendingOrders: 'Ibyishyu bitaruzura',
    adminManageEvents: 'Kurema & Guhindura Ibirori',
    adminGateScanners: 'Abakozi Bemerewe Gusikana QR',
    adminUssdOrders: 'Ibyishyu bya USSD bitegereje kwemezwa',
    adminClearanceApprove: 'Muhe uburenganzira bwo gusikana',
    adminClearanceRevoke: 'Kura uburenganzira',
    adminClearanceApproved: 'Uburenganzira bwemejwe',
    adminClearanceRevoked: 'Uburenganzira bwavanyweho',
    adminAddScannerHelper: 'Ongeraho umufasha ku muryango',

    // Landing extras
    heroSubtitleTag: 'UMUCO • UBUHANZI • IMPANO • IBYISHIMO • UMWARIRO',
    landingStatsEvents: 'Birori byinshi muri uyu mwaka',
    landingStatsMembers: 'Abana n’ababyeyi batavuye kuri platform',
    landingStatsSessions: 'Amasomo y’uburorikanyabahanga',
    landingStatsVenue: 'IWACU Cultural Center, Nyakaliro',

    // Login & Register (customer account)
    loginBadge: 'KONTU YAWE ISHOBOKE',
    loginTitle: 'Kwinjira no Kwiyandikisha',
    loginSubtitle: 'Imitere y’abakiriya: Gura amatike, kubona kode yawe yo kuramutsa abandi, hanyuma ubone itike yawe ya QR ku telefone yawe.',
    loginTabSignIn: 'Kwinjira',
    loginTabRegister: 'Kwiyandikisha',
    loginIdentifierLabel: 'Nimero ya telefone cyangwa imeri',
    loginIdentifierPlaceholder: '+250 788 123 456',
    loginPasswordLabel: 'Ijambobanga',
    loginPasswordPlaceholder: '••••••••',
    loginHint: 'Injira ukoresheje telefone yawe ngo ubone amatike yawe, kode yawe n’amakuru yawe.',
    loginSignInBtn: 'INJIRA',
    loginSigningIn: 'Birakora...',
    loginBackHome: 'Gusubira ku rubuga rw’ibanze',
    registerFullNameLabel: 'Amazina yombi',
    registerFullNamePlaceholder: 'urugero: Alice Uwase',
    registerPhoneLabel: 'Nimero ya telefone (MTN / Airtel)',
    registerPhonePlaceholder: '+250 788 123 456',
    registerEmailLabel: 'Imeri (bishatse)',
    registerEmailPlaceholder: 'parent@example.rw',
    registerPasswordLabel: 'Ijambobanga',
    registerPasswordHint: 'Byibuze inyuguti 6',
    registerConfirmLabel: 'Emeza ijambobanga',
    registerConfirmPlaceholder: 'Songera andika ijambobanga',
    registerBenefitTitle: 'Kuki kwiyandikisha?',
    registerBenefitQr: 'Uhabwa itike ya QR ihujwe n’amazina yawe.',
    registerBenefitCode: 'Uhabwa kode yo kuramutsa abandi bagera ku igabanijwe.',
    registerBenefitInstant: 'Amatike yawe aza ako kanya niba wishyuye.',
    registerBtn: 'Iyandikishe & Ugure Amatike',
    registerCreating: 'Birakora...',
    registerPasswordMismatch: 'Ijambobanga ryanditswe hakurikiraho ntabwo rihuye.',
    registerFieldMissing: 'Uzuza imirimo imwe n’imwe (maze ugaragaze itelefone n’ijambobanga).',
    passwordShow: 'Erekana ijambobanga',
    passwordHide: 'Hisha ijambobanga',
    staffAccessTitle: 'Abakozi n’Abayobozi gusa',
    staffAccessDesc: 'Kwinjira, kugenzura amatike (QR verification) n’ubuyobozi bisabwa ku bipindi bya Admin / Gate pejini.',
    staffAccessBtn: 'Injira ku Irembo rya Gate / Admin',
    staffAccessNote: 'Kode zo kwinjira n’uburenganzira bwo gusikana ntiboneka kuri iyi pejini.',

    // Landing: How It Works
    howItWorksEyebrow: 'UBURYO BIKORA',
    howItWorksTitle: 'Injira wowe n’umuryango wawe mu ntambwe eshatu',
    howItWorksDesc:
      'Kuva guhitamo igitaramo kugeza ku kugenzura kwa QR ku muryango — byose bikorwa kuri telefone yawe.',
    stepPickTitle: 'Hitamo igitaramo',
    stepPickDesc:
      'Sura ibirori biri imbere maze uhitame ubwoko bw’amatike buhuye n’umuryango wawe.',
    stepPayTitle: 'Wishyure MoMo cyangwa Airtel',
    stepPayDesc:
      'MTN MoMo, Airtel Money cyangwa kode ya USSD — kwemeza kuzza ako kanya.',
    stepJoinTitle: 'Erekana itike yawe ya QR',
    stepJoinDesc:
      'Itike yawe idoda ku muryango mu kugenzura kwa QR kw’isegonda rimwe.',

    // Login split-screen panel
    loginSideTitle: 'Amatike yawe yo kwishora, aboneka mu isegonda',
    loginSideDesc:
      'Injira ngo ubone amatike yawe, kode yawe yo kuramutsa abandi n’amatike ya QR — byose ahantu hamwe.',
    loginLiveBadge: 'Irembo rikora ku birori bya Nyakaliro',
    loginTestimonial:
      '« Nagurishije itike y’umwana wanjye mu isegonda rimwe — gusikana QR ku muryango byaroroshye rwose! »',
    loginTestimonialName: 'Nyirahabimana, Umubyeyi — Nyakaliro',

    // PWA install
    pwaInstall: 'SHYIRAHO IWACU KIDS',
    pwaAskTitle: 'Shaka gushyira IWACU KIDS kuri telefoni yawe?',
    pwaAskDesc:
      'Uzabona IWACU KIDS imeze nk’app ihoraho, ihita ikora kandi igakomeza akazi na bya bundi bufatanye.',
    pwaNoData: 'Amakuru y’ubwishyu n’amatike yo abitswa kuri serivisi (server).',
    pwaCancel: 'Kureka',
    pwaInstallNow: 'SHYIRAHO',
    pwaIosTitle: 'Kanda Share → Add to Home Screen',
    pwaIosDesc:
      'Kuri iPhone/iPad, fungura Menu yo gusangira (Share) hanyuma uhitemo “Add to Home Screen” kugira ngo IWACU KIDS ibone nk’app ku cyuma cyawe.',
    pwaIosStep: 'Share → Add to Home Screen',
    pwaIosDone: 'Ibyiza! IWACU KIDS izaboneka nk’app ku cyuma cyawe.',

    // Welcome video
    videoSectionTitle: 'MENYA IWACU KIDS',
    videoSectionDesc:
      'Reba video ngufi y’ibyiza IWACU KIDS ibyihaye abana n’imiryango i Nyakaliro — imbyino gakondo, ibirori n’ubuhanzi.',
    videoPlayBtn: 'Bona iyi video',
    videoLoading: 'Birakoze...',
    videoNotAvailable: 'Video ntibashije gutangiza muri iki gihe. Ongera ugerageze nyuma.',

    // Map & location
    mapOpenLabel: 'FUNGURA KU IKARITA',
    mapDirectionsLabel: 'REBA INZIRA',
    mapScrollHint: 'Kanda “REBA INZIRA” kugira ngo ukore inzira ihereye aho uri.',

    // Offline state
    offlineTitle: 'NTA INTERNET — IBIRIMO BIBANZA KUBONEKA NIBA BYARABIKWEYE',
    offlineDesc:
      'Amatike yawe yabitswe ku gituntu aracyaboneka. Iyo Internet igarutse, ibindi byose bizasubira.',

    // Errors / 404
    notFoundTitle: 'URUPAPURO NTIRUBONETSE',
    notFoundDesc: 'Urupapuro ushaka ntiruboneka cyangwa rwimuwe. Kora ongodera ahantu hakozwe neza.',
    error500Title: 'HARI IKIBAZO KURI SERIVISI',
    error500Desc: 'Hari ikibazo gito cyabaye. Ugaruke inyuma hanyuma ugerageze bundi bushoboro.',
    backHomeBtn: 'SUBIRA KU GIHANDA',
    tryAgainBtn: 'Ongera ugerageze',

    // Footer & WhatsApp
    footerBrandDesc:
      'Urubuga rw’umuco n’ubuhanzi bw’abana i Nyakaliro, u Rwanda. Imbyino gakondo, ibirori n’amatike y’igitanga yemewe.',
    quickLinksTitle: 'INZIRA ZINGENZI',
    contactTitle: 'TWANDIKIRE',
    paymentsTitle: 'UBURYO BW’UKWISHYURA',
    legalTitle: 'AMATEGEKO',
    legalPrivacy: 'Policy y’Umutekano w’Amakuru',
    legalTerms: 'Amasezerano yo gukoresha',
    legalTicketPolicy: 'Policy y’Amatike',
    rightsLine: 'IWACU KIDS. Uburenganzira bwose buragizwa. Nyakaliro, u Rwanda.',
    followTitle: 'DUKURIKIRE',
    waFloatLabel: 'Twandikire kuri WhatsApp',
    waHelpTitle: 'Ukeneye ubufasha?',
    waHelpDesc: 'Ubaza amakuru ku birori cyangwa ku itike? Twandikire kuri WhatsApp.',
    waChatBtn: 'Tangira Kwandika',
    waPrefilled: 'Muraho IWACU KIDS, nkeneye amakuru ku birori.',

    // Social follow ad (Google-Ads style)
    adLabel: 'Urumuri',
    adTitle: 'Dukurikire IWACU KIDS',
    adDesc: 'Ntiwanyaze ibitaramo, amafoto n’umuziki!',
    adSubscribeBtn: 'Kwiyandikisha',
    adFollowBtn: 'Kurikira',
    adListenBtn: 'Kumva & Kurikira',
    adCloseLabel: 'Funga Urumuri',
    adTrustLine: 'Urumuri rw’ubucuruzi: IWACU KIDS — Nyakaliro, u Rwanda.',

    // Event availability labels
    eventFeatured: 'ICYEGEZWE',
    eventUpcoming: 'BIZA VUBA',
    eventLimitedSeats: 'AMATIKE AHASIGAYE MACYE',
    eventSoldOut: 'BITANGIRIJE',
  },
  en: {
    // Brand & General
    brandName: 'IWACU KIDS',
    brandTagline: 'Culture, Creativity & Youth Talent in Nyakaliro',
    locationLabel: 'Nyakaliro, Rwamagana • Rwanda',
    loading: 'Processing...',
    close: 'Close',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    viewAll: 'View All',
    searchPlaceholder: 'Search events, dances, or passes...',

    // Navigation
    navHome: 'Home',
    navEvents: 'Events',
    navPrograms: 'Programs',
    navGallery: 'Gallery',
    navAbout: 'About',
    navLocation: 'Location',
    navTickets: 'My Tickets',
    navGateScanner: 'Gate Scanner',
    navAdmin: 'Admin Portal',
    navStaffLogin: 'Staff Login',
    navGetTickets: 'Get Tickets',
    navServices: 'Our Services',
    navIshConnect: 'IshConnect',
    brandRegion: 'Rwanda • Nyakaliro',

    // Ticker / Marquee
    marqueeTitle: 'TRENDING NOW',
    tickerEvents: [
      '🔥 Nyakaliro Traditional Dance Gala & Drums — Passes Selling Fast (from 1,000 RWF)',
      '⚡ CEO Coopstar Announces: Youth Afro-Fusion Choreography Showcase',
      '🎉 Vacation Cultural Camp Registration Now Open in Nyakaliro',
      '🎫 Easy Payment: MTN MoMo (*182*8*1*654321#), Airtel Money & Manual USSD',
      '📍 Venue: IWACU Cultural Center, Nyakaliro — Karibu Everyone!',
    ],

    // Hero
    heroEyebrow: 'Nyakaliro, Rwanda • Official Youth Cultural Platform',
    heroTitleLine1: 'WHERE CULTURE',
    heroTitleHighlight: 'COMES ALIVE.',
    heroSubtitle: 'CULTURE • CREATIVITY • TALENT • FUN • COMMUNITY',
    heroDescription:
      'Discover authentic Rwandan traditional dance, modern choreography, youth summer camps, and creative arts in Nyakaliro. Get verified digital passes instantly via MTN MoMo, Airtel Money, or Manual USSD.',
    heroExploreBtn: 'Explore Events',
    heroBuyTicketsBtn: 'Buy Tickets Now',
    heroTrustQr: 'Secure QR Code Check-in',
    heroTrustMtn: 'MTN MoMo Accepted',
    heroTrustAirtel: 'Airtel Money Accepted',
    heroTrustUssd: 'Manual USSD Accepted',
    heroNextEvent: 'Next Major Event',
    heroStartingFrom: 'Tickets Start At',

    // Categories
    catTraditional: 'Traditional Dance',
    catTraditionalSub: 'Ingoma Drums & Amaraba',
    catModern: 'Modern Dance',
    catModernSub: 'Afro-fusion & Youth battles',
    catSummer: 'Summer Carnivals',
    catSummerSub: 'Outdoor games & family joy',
    catVacation: 'Vacation Programs',
    catVacationSub: 'Artistic mentorship & skills',

    // Cultural Interactive Section
    cultureSectionEyebrow: 'CULTURAL STAGE & HERITAGE',
    cultureSectionTitle: 'Interactive Rwandan Cultural Showcase',
    cultureSectionSubtitle: 'Click on traditional artifacts and attire to explore their historical significance in Nyakaliro celebrations.',
    interactiveHotspotInstruction: 'Click any hotspot to inspect history or listen to rhythms',
    drumSoundBtn: 'Listen to Sacred Rwandan Ingoma Beats',
    drumSoundPlaying: 'Ingoma drum heartbeat sounding in Nyakaliro air...',
    drumSoundDesc: 'This ancestral polyrhythmic pulse energizes youth dancers during Amaraba and Intore performances.',

    // CEO & Philosophy
    leadershipEyebrow: 'OUR LEADERSHIP & VALUES',
    leadershipQuote: '"Every child in Rwanda deserves a dignified stage to express rhythm, heritage, and joy."',
    leadershipDesc:
      'Led by CEO Coopstar, IWACU Kids provides safe community spaces, certified cultural instructors, and premier celebrations where children discover their gifts through traditional dance, drumming, and creative arts.',
    ceoNameTitle: 'Coopstar',
    ceoBadge: 'CEO, IWACU Kids',
    pillTraditionTitle: 'Authentic Tradition',
    pillTraditionDesc: 'Guidance by master instructors in Umushayayo & Ingoma drumming.',
    pillCommunityTitle: 'Nyakaliro Community',
    pillCommunityDesc: 'Deeply rooted in supporting families and children locally.',

    // Events & Discover
    upcomingSectionTitle: 'Upcoming Cultural Celebrations',
    upcomingSectionSubtitle: 'Select an event to attend with your family in Nyakaliro',
    filterAll: 'All Categories',
    noEventsFound: 'No events found in this category.',
    eventDate: 'Date',
    eventTime: 'Time',
    eventLocation: 'Location',
    eventTicketsFrom: 'Tickets Start At',
    eventBuyPass: 'GET TICKETS',
    eventDetails: 'View Details',
    eventWhatsIncluded: "What's Included",
    eventAgeRange: 'Age Range',

    // Checkout
    checkoutTitle: 'Checkout & Ticketing',
    checkoutSubtitle: 'Official IWACU Kids Digital Entrance Pass',
    checkoutStep1: '1. Details',
    checkoutStep2: '2. Payment',
    checkoutStep3: '3. Your Ticket',
    checkoutAttendeeName: 'Attendee or Parent/Guardian Full Name',
    checkoutAttendeeNamePlaceholder: 'e.g. Jean-Luc Mugisha',
    checkoutPhone: 'Mobile Money Phone Number',
    checkoutPhoneHint: 'The payment prompt and digital ticket SMS will be sent here.',
    checkoutEmail: 'Email Address (Optional)',
    checkoutEmailHint: 'We will send a PDF backup ticket copy.',
    checkoutSelectPayment: 'Select Payment Method',
    checkoutPayMoMo: 'MTN MoMo (Instant Push)',
    checkoutPayMoMoSub: 'USSD PIN Prompt on your phone',
    checkoutPayAirtel: 'Airtel Money',
    checkoutPayAirtelSub: 'Direct carrier debit',
    checkoutPayUssd: 'Manual USSD / MoMoPay',
    checkoutPayUssdSub: 'Dial merchant code manually if gateway is offline',
    checkoutTotalAmount: 'Total Amount Due',
    checkoutProceedBtn: 'PROCEED TO PAYMENT',
    checkoutAuthorizeBtn: 'AUTHORIZE PAYMENT & ISSUE TICKET',
    checkoutUssdTitle: 'Pay with Manual USSD / MoMoPay',
    checkoutUssdCodeLabel: 'Dial this USSD code on your phone:',
    checkoutUssdCopyBtn: 'Copy Code',
    checkoutUssdCopied: 'USSD Code Copied!',
    checkoutUssdDialBtn: 'Dial USSD',
    checkoutUssdTxIdLabel: 'SMS Transaction ID / Reference (TxId):',
    checkoutUssdTxIdPlaceholder: 'e.g. 10928374 or sender phone',
    checkoutUssdSubmitBtn: 'SUBMIT USSD PAYMENT & REQUEST TICKET',
    checkoutUssdNotice:
      'If the payment gateway is unavailable or you prefer direct USSD, dial the MoMoPay merchant code above and paste the transaction reference from your confirmation SMS to validate your ticket.',
    checkoutQuantity: 'Ticket Quantity',
    checkoutTier: 'Ticket Tier',

    // Gate Scanner & Access Security
    scannerTitle: 'Gate Entrance QR Scanner',
    scannerSubtitle: 'Secure ticket validation terminal for Nyakaliro events',
    scannerRestrictedTitle: 'Gate Scanner Clearance Required',
    scannerRestrictedDesc:
      'Entrance QR code scanning is restricted to Administrators and gate staff members explicitly cleared by an Administrator.',
    scannerLoginBtn: 'Sign In with Authorized Gate Credentials',
    scannerEnterPinBtn: 'Use Gate Clearance Key',
    scannerPinPlaceholder: 'Enter gate clearance key...',
    scannerVerifyPinBtn: 'Unlock Scanner',
    scannerStatusAuthorized: 'CLEARED GATE OPERATOR',
    scannerStatusAdmin: 'CHIEF ADMINISTRATOR',
    scannerStatusStaff: 'CLEARED GATE STAFF',
    scannerStartCamera: 'Start Camera Scanner',
    scannerStopCamera: 'Stop Camera',
    scannerManualSearchPlaceholder: 'Enter ticket code (e.g. IWK-8F29A-01)...',
    scannerCheckCodeBtn: 'Verify Ticket',
    scannerSuccessValid: 'TICKET VALID - ADMIT!',
    scannerAlreadyUsed: 'TICKET ALREADY USED!',
    scannerInvalid: 'INVALID TICKET / NOT FOUND',
    scannerAdmitAttendee: 'Check-In Attendee',
    scannerRecentScans: 'Recent Scans at this Gate',

    // My Tickets
    myTicketsTitle: 'My Digital Tickets',
    myTicketsSubtitle: 'All your purchased entrance passes stored securely',
    myTicketsEmpty: 'No tickets saved yet. Explore events to get your passes!',
    myTicketsSearchPlaceholder: 'Search tickets by phone or email...',
    myTicketsSearchBtn: 'Find Tickets',
    myTicketsScanNotice: 'Show this QR code to the entrance staff at the gate.',
    myTicketsDownloadBtn: 'Save Ticket Image',

    // Admin
    adminTitle: 'IWACU Kids Administration Portal',
    adminWelcome: 'Welcome back to Nyakaliro operations',
    adminRevenue: 'Total Revenue',
    adminTicketsSold: 'Tickets Sold',
    adminCheckInRate: 'Gate Check-In Rate',
    adminPendingOrders: 'Pending Orders',
    adminManageEvents: 'Manage Events',
    adminGateScanners: 'Authorized Gate Scanners',
    adminUssdOrders: 'Manual USSD Verification',
    adminClearanceApprove: 'Approve & Clear to Scan',
    adminClearanceRevoke: 'Revoke Clearance',
    adminClearanceApproved: 'Clearance Approved',
    adminClearanceRevoked: 'Clearance Revoked',
    adminAddScannerHelper: 'Add Scanner Helper',

    // Landing extras
    heroSubtitleTag: 'CULTURE • CREATIVITY • TALENT • FUN • COMMUNITY',
    landingStatsEvents: 'Cultural events this year',
    landingStatsMembers: 'Kids & families on the platform',
    landingStatsSessions: 'Creative arts sessions',
    landingStatsVenue: 'IWACU Cultural Center, Nyakaliro',

    // Login & Register (customer account)
    loginBadge: 'YOUR FAMILY PASS PORTAL',
    loginTitle: 'Sign In & Create Account',
    loginSubtitle:
      'Customer portal: buy event tickets, get your personal referral code, and receive your QR entrance pass instantly on your phone.',
    loginTabSignIn: 'Sign In',
    loginTabRegister: 'Create Account',
    loginIdentifierLabel: 'Phone Number or Email',
    loginIdentifierPlaceholder: '+250 788 123 456',
    loginPasswordLabel: 'Password',
    loginPasswordPlaceholder: '••••••••',
    loginHint: 'Sign in with your phone number to view your tickets, referral code, and profile.',
    loginSignInBtn: 'SIGN IN',
    loginSigningIn: 'Authenticating...',
    loginBackHome: 'Back to Home Page',
    registerFullNameLabel: 'Full Name',
    registerFullNamePlaceholder: 'e.g. Alice Uwase',
    registerPhoneLabel: 'Phone Number (MTN / Airtel)',
    registerPhonePlaceholder: '+250 788 123 456',
    registerEmailLabel: 'Email Address (Optional)',
    registerEmailPlaceholder: 'parent@example.rw',
    registerPasswordLabel: 'Password',
    registerPasswordHint: 'Min 6 characters',
    registerConfirmLabel: 'Confirm Password',
    registerConfirmPlaceholder: 'Repeat password',
    registerBenefitTitle: 'Why create an account?',
    registerBenefitQr: 'Your QR ticket is issued with your full name.',
    registerBenefitCode: 'Get a personal referral code to save on every booking.',
    registerBenefitInstant: 'Tickets are delivered instantly after payment.',
    registerBtn: 'Create Account & Get Tickets',
    registerCreating: 'Creating Account...',
    registerPasswordMismatch: 'Passwords do not match.',
    registerFieldMissing: 'Please fill in all the required fields (name, phone, and password).',
    passwordShow: 'Show password',
    passwordHide: 'Hide password',
    staffAccessTitle: 'For Admin & Gate Helper Staff only',
    staffAccessDesc:
      'Login, QR ticket verification, and event management are handled on the secured Admin / Gate pages only.',
    staffAccessBtn: 'Open Gate / Admin Sign-In',
    staffAccessNote: 'Staff verification codes and scanner clearance are never shown on this page.',

    // Landing: How It Works
    howItWorksEyebrow: 'HOW IT WORKS',
    howItWorksTitle: 'Your family gets in, in three easy steps',
    howItWorksDesc:
      'From picking an event to scanning your QR at the gate — it all happens on your phone.',
    stepPickTitle: 'Pick an event',
    stepPickDesc:
      'Browse upcoming celebrations and choose the pass tier that fits your family.',
    stepPayTitle: 'Pay with MoMo or Airtel',
    stepPayDesc: 'MTN MoMo, Airtel Money, or manual USSD. Verified instantly.',
    stepJoinTitle: 'Show your QR pass',
    stepJoinDesc: 'Your digital ticket opens the gate with a one-second QR check-in.',

    // Login split-screen panel
    loginSideTitle: 'Your family passes, ready in seconds',
    loginSideDesc:
      'Sign in to view your tickets, referral code, and QR passes — all in one place.',
    loginLiveBadge: 'Live portal for Nyakaliro celebrations',
    loginTestimonial:
      '"I bought my child\'s pass in seconds — scanned the QR at the gate, so easy!"',
    loginTestimonialName: 'Nyirahabimana, Parent — Nyakaliro',

    // PWA install
    pwaInstall: 'INSTALL IWACU KIDS',
    pwaAskTitle: 'Install IWACU KIDS on your phone?',
    pwaAskDesc:
      'You will get IWACU KIDS as a real app that opens instantly and keeps working even offline.',
    pwaNoData: 'Payment and ticket data always stays on the server.',
    pwaCancel: 'CANCEL',
    pwaInstallNow: 'INSTALL',
    pwaIosTitle: 'Tap Share → Add to Home Screen',
    pwaIosDesc:
      'On iPhone/iPad, open the Share menu and tap “Add to Home Screen” so IWACU KIDS appears like a native app.',
    pwaIosStep: 'Share → Add to Home Screen',
    pwaIosDone: 'Done! IWACU KIDS now opens like a native app.',

    // Welcome video
    videoSectionTitle: 'MEET IWACU KIDS',
    videoSectionDesc:
      'A short video about what IWACU KIDS offers children and families in Nyakaliro — traditional dance, festivals and creative arts.',
    videoPlayBtn: 'Watch Video',
    videoLoading: 'Loading...',
    videoNotAvailable: 'The video could not start right now. Please try again later.',

    // Map & location
    mapOpenLabel: 'OPEN ON MAP',
    mapDirectionsLabel: 'GET DIRECTIONS',
    mapScrollHint: 'Tap “GET DIRECTIONS” to get route from your location.',

    // Offline state
    offlineTitle: 'NO INTERNET — SAVED CONTENT STAYS AVAILABLE',
    offlineDesc:
      'Your saved tickets still work. When the connection returns, everything else resumes automatically.',

    // Errors / 404
    notFoundTitle: 'PAGE NOT FOUND',
    notFoundDesc: 'The page you are looking for does not exist or was moved. Please navigate somewhere else.',
    error500Title: 'SERVER ERROR',
    error500Desc: 'Something went wrong on our side. Please go back and try again in a moment.',
    backHomeBtn: 'BACK TO HOME',
    tryAgainBtn: 'Try Again',

    // Footer & WhatsApp
    footerBrandDesc:
      'The children & youth culture platform of Nyakaliro, Rwanda. Traditional dance, festivals and verified digital ticketing.',
    quickLinksTitle: 'QUICK LINKS',
    contactTitle: 'CONTACT',
    paymentsTitle: 'PAYMENT METHODS',
    legalTitle: 'LEGAL',
    legalPrivacy: 'Privacy Policy',
    legalTerms: 'Terms of Use',
    legalTicketPolicy: 'Ticket Policy',
    rightsLine: 'IWACU KIDS. All rights reserved. Nyakaliro, Rwanda.',
    followTitle: 'FOLLOW US',
    waFloatLabel: 'Chat with us on WhatsApp',
    waHelpTitle: 'Need help?',
    waHelpDesc: 'Questions about events or tickets? Chat with us on WhatsApp.',
    waChatBtn: 'START CHAT',
    waPrefilled: 'Muraho IWACU KIDS, nkeneye amakuru ku birori.',

    // Social follow ad (Google-Ads style)
    adLabel: 'Ad',
    adTitle: 'Follow IWACU KIDS',
    adDesc: 'Never miss a festival, photo, or rhythm!',
    adSubscribeBtn: 'Subscribe',
    adFollowBtn: 'Follow',
    adListenBtn: 'Listen & Follow',
    adCloseLabel: 'Close ad',
    adTrustLine: 'Promotional ad by IWACU KIDS — Nyakaliro, Rwanda.',

    // Event availability labels
    eventFeatured: 'FEATURED',
    eventUpcoming: 'UPCOMING',
    eventLimitedSeats: 'LIMITED SEATS',
    eventSoldOut: 'SOLD OUT',
  },
};
