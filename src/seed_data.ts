export interface LawSection {
  act: string;
  section_number: string;
  title: string;
  summary: string;
  keywords: string;
}

export const INDIAN_LAW_CORPUS: LawSection[] = [
  // IPC / BNS Theft
  {
    act: "IPC / BNS",
    section_number: "IPC Section 378 / BNS Section 303",
    title: "Theft",
    summary: "Theft is defined as moving movable property out of the possession of any person without that person's consent, with dishonest intention. Punishment for theft includes imprisonment of up to 3 years, a fine, or both.",
    keywords: "theft, steal, stealing, robbery, pickup, snatch, stolen, property, belong, pocket, burglar, shoplift"
  },
  // IPC / BNS Assault & Criminal Force
  {
    act: "IPC / BNS",
    section_number: "IPC Section 351 / BNS Section 133",
    title: "Assault",
    summary: "Assault occurs when someone makes a gesture or preparation, intending or knowing it will cause others to apprehend that criminal force is about to be used against them. Mere words do not equal assault, but may accompany gestures.",
    keywords: "assault, threat, attack, violence, strike, gesture, threaten, physical abuse, hit, beat, weapon"
  },
  // IPC / BNS Cheating / Fraud
  {
    act: "IPC / BNS",
    section_number: "IPC Section 420 / BNS Section 318",
    title: "Cheating and Dishonestly Inducing Delivery of Property",
    summary: "Cheating constitutes deceiving any person and thereby dishonestly or fraudulently inducing them to deliver any property, or to consent to retain property, or to make, alter or destroy any valuable security. Punishment includes up to 7 years in prison and a fine.",
    keywords: "cheat, fraud, fake, scam, online scam, double cross, deceive, deception, forgery, trick, money scam, impersonate, impostor"
  },
  // IPC / BNS Murder
  {
    act: "IPC / BNS",
    section_number: "IPC Section 302 / BNS Section 103",
    title: "Punishment for Murder",
    summary: "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Murder is causing death with the intention of causing death or bodily injury likely to cause death.",
    keywords: "murder, kill, homicide, death, stab, shoot, poison, homicide, manslaughter"
  },
  // IPC / BNS Defamation
  {
    act: "IPC / BNS",
    section_number: "IPC Section 499 / BNS Section 356",
    title: "Defamation",
    summary: "Defamation is committing an act by words (spoken or intended to be read), signs, or visible representations, making or publishing any imputation concerning any person intending to harm their reputation. Exceptions exist for truth spoken for public good.",
    keywords: "defamation, slander, libel, defame, rumor, reputation, social media post, lie, insult, fake news"
  },
  // IPC / BNS Dowry Harassment
  {
    act: "IPC / BNS",
    section_number: "IPC Section 498A / BNS Section 85",
    title: "Husband or Relative of Husband of a Woman Subjecting Her to Cruelty",
    summary: "Cruelty by husband or his relatives towards a woman is punishable with imprisonment up to 3 years and a fine. Cruelty includes harassment to coerce her or her family to meet unlawful demands for dowry, or conduct likely to drive her to suicide.",
    keywords: "dowry, harassment, cruelty, domestic violence, marital abuse, husband harassment, inlaws, in-laws, beating"
  },
  // IPC / BNS Hurt
  {
    act: "IPC / BNS",
    section_number: "IPC Section 319 & 320 / BNS Section 115 & 116",
    title: "Hurt and Grievous Hurt",
    summary: "Voluntarily causing hurt is causing bodily pain, disease or infirmity. Voluntarily causing grievous hurt includes permanent damage to vision/hearing, privation of joints, permanent disfiguration of head/face, bone fracture, or life-threatening pain for 15+ days.",
    keywords: "hurt, injure, fracture, wound, strike, bleeding, broken bone, physical injury, harm, beat"
  },
  // CrPC / BNSS First Information Report (FIR)
  {
    act: "CrPC / BNSS",
    section_number: "CrPC Section 154 / BNSS Section 173",
    title: "Information in Cognizable Cases (FIR)",
    summary: "Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing. Under BNSS, Zero FIR and e-FIR (electronic format) are officially codified, allowing registration anywhere.",
    keywords: "fir, first information report, report crime, police station, register fir, report police, zero fir, efir, e-fir"
  },
  // CrPC / BNSS Anticipatory Bail
  {
    act: "CrPC / BNSS",
    section_number: "CrPC Section 438 / BNSS Section 482",
    title: "Direction for Grant of Bail to Person Apprehending Arrest (Anticipatory Bail)",
    summary: "Where any person has reason to believe that they may be arrested on accusation of having committed a non-bailable offence, they may apply to the High Court or the Court of Session for a direction that in the event of arrest, they shall be released on bail.",
    keywords: "anticipatory bail, bypass arrest, protect arrest, premium bail, arrest fear, bail before arrest, false case protection"
  },
  // CrPC / BNSS Arrest without warrant
  {
    act: "CrPC / BNSS",
    section_number: "CrPC Section 41 / BNSS Section 35",
    title: "Arrest by Police Without Warrant",
    summary: "Any police officer may without an order from a Magistrate and without a warrant, arrest any person who commits a cognizable offence in their presence, or against whom a reasonable complaint or credible information of a serious offence exists.",
    keywords: "arrest, warrant, arrest without warrant, police power, detain, detention, lockup, arrest rules"
  },
  // Constitution Article 14
  {
    act: "Constitution of India",
    section_number: "Article 14",
    title: "Equality Before Law",
    summary: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India. Discrimination on arbitrary grounds is prohibited, establishing the Rule of Law.",
    keywords: "equality, equal, fair, discrimination, same rights, discrimination, partiality, bias"
  },
  // Constitution Article 19(1)(a)
  {
    act: "Constitution of India",
    section_number: "Article 19(1)(a)",
    title: "Freedom of Speech and Expression",
    summary: "All citizens have the right to freedom of speech and expression. However, reasonable restrictions can be imposed on grounds of sovereignty/integrity of India, security of the State, public order, decency, or defamation.",
    keywords: "speech, express, speak, write, media, journalist, freedom of speech, opinion, post, protest, speech restrictions"
  },
  // Constitution Article 21
  {
    act: "Constitution of India",
    section_number: "Article 21",
    title: "Protection of Life and Personal Liberty",
    summary: "No person shall be deprived of his life or personal liberty except according to procedure established by law. This article covers the right to privacy, right to live with dignity, right to livelihood, right to clean environment, and right to free legal aid.",
    keywords: "life, liberty, privacy, dignity, fundamental rights, right to live, protection from police brutality, free legal aid"
  },
  // Constitution Articles 32 and 226
  {
    act: "Constitution of India",
    section_number: "Article 32 & Article 226",
    title: "Remedies for Enforcement of Rights (Writs)",
    summary: "Article 32 gives citizens the right to move the Supreme Court, and Article 226 gives the right to move the High Courts, for the enforcement of fundamental rights via Writs such as Habeas Corpus, Mandamus, Prohibition, Quo Warranto, and Certiorari.",
    keywords: "writ, supreme court, high court, article 32, article 226, fundamental rights violation, petition, habeas corpus"
  },
  // IT Act Identity Theft
  {
    act: "IT Act (Cyber Law)",
    section_number: "IT Act Section 66C",
    title: "Punishment for Identity Theft",
    summary: "Whoever dishonestly or fraudulently makes use of the electronic signature, password or any other unique identification feature of any other person, shall be punished with imprisonment up to 3 years and fine up to 1 Lakh rupees.",
    keywords: "identity theft, password, hack, e-signature, spoof, profile clone, impersonation online, cyber theft"
  },
  // IT Act Cheating by Personation
  {
    act: "IT Act (Cyber Law)",
    section_number: "IT Act Section 66D",
    title: "Punishment for Cheating by Personation using Computer Resource",
    summary: "Whoever, by means of any communication device or computer resource, cheats by personation, shall be punished with imprisonment of up to 3 years and a fine of up to 1 Lakh rupees. Covers online financial scams and phishing.",
    keywords: "phishing, scam, digital fraud, impersonate online, fake profile scam, chat fraud, email scam, cyber scam, otp scam, bank fraud"
  },
  // IT Act Section 67A
  {
    act: "IT Act (Cyber Law)",
    section_number: "IT Act Section 67A",
    title: "Publishing material containing sexually explicit act in electronic form",
    summary: "Publishing, transmitting, or causing to be published/transmitted in electronic form, any material which contains sexually explicit acts or conduct. Punishment for first conviction is up to 5 years in prison and a fine of up to 10 Lakh rupees.",
    keywords: "explicit content, blackmail, leak video, non-consensual media, sharing images, obscene material, cyber pornography"
  },
  // Consumer Protection Act - Definition of Unfair Trade Practices
  {
    act: "Consumer Protection Act",
    section_number: "Section 2(47)",
    title: "Unfair Trade Practice",
    summary: "An unfair trade practice refers to promoting the sale, use or supply of any goods or services by adopting any unfair method or deceptive practice, such as making false statements about quality, fake discounts, or refuse to issue cash memo.",
    keywords: "unfair trade, fake discount, misleading advertisement, consumer cheat, bad quality, defective item, refund refuse, warranty reject"
  },
  // Consumer Protection Act - Consumer Rights
  {
    act: "Consumer Protection Act",
    section_number: "Section 2(9)",
    title: "Rights of Consumers",
    summary: "Protects six core consumer rights: 1) Right to be protected against hazardous goods/services; 2) Right to be informed about quality, quantity, price; 3) Right to be assured access to competitive products; 4) Right to be heard; 5) Right to seek redressal against unfair exploitation; 6) Right to consumer awareness.",
    keywords: "consumer rights, right to safety, informed, consumer awareness, help desk, consumer court, rights"
  },
  // Consumer Protection Act - Filing Complaint
  {
    act: "Consumer Protection Act",
    section_number: "Section 34 & 35",
    title: "Consumer Dispute Redressal Commissions (District/State/National)",
    summary: "Establishes a three-tier quasi-judicial machinery: District Commission (handling claims up to 50 Lakhs), State Commission (50 Lakhs to 2 Crores), and National Commission (above 2 Crores). Consumers can file complaints online via the E-Daakhil portal without a lawyer.",
    keywords: "consumer court, complain, refund, district commission, state commission, filing fee, e-daakhil, edaakhil"
  },
  // Motor Vehicles Act Drunken Driving
  {
    act: "Motor Vehicles Act",
    section_number: "Section 185",
    title: "Driving by a Drunken Person or under the Influence of Drugs",
    summary: "Driving with alcohol content exceeding 30 mg per 100 ml of blood detected by a breathalyzer is an offence. First offence carries imprisonment up to 6 months and/or fine up to 10,000 INR. Subsequent offence in 3 years carries up to 2 years prison and/or 15,000 INR fine.",
    keywords: "drinking, drunk, drink and drive, drink & drive, breathe analyzer, blood alcohol, alcohol limit, police catch drunk"
  },
  // Motor Vehicles Act Driving without license
  {
    act: "Motor Vehicles Act",
    section_number: "Section 181",
    title: "Driving Vehicle in Contravention of Section 3 or Section 4",
    summary: "Driving a motor vehicle in a public place without an active, valid driving license, or permitting an unauthorized/underage minor to drive, is punishable with imprisonment up to 3 months, or a fine up to 5,000 INR, or both.",
    keywords: "no licence, no license, underage driving, minor driving, driving without license, license fine"
  },
  // Motor Vehicles Act Speeding
  {
    act: "Motor Vehicles Act",
    section_number: "Section 183 & 184",
    title: "Overspeeding and Dangerous Driving",
    summary: "Driving a motor vehicle in violation of speed limits (Section 183) is punishable with a fine ranging from 1,000 to 4,000 INR. Dangerous, reckless driving (Section 184) causing danger to public is punishable with imprisonment up to 1 year and/or fine up to 5,000 INR.",
    keywords: "speeding, overspeeding, race, high speed, reckless driving, dangerous driving, red light jump, stunt"
  }
];
