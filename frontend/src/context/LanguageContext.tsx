import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

export const TRANSLATIONS: Record<string, string> = {
  // Roles
  'Railway Planner / Operations Manager': 'रेलवे योजनाकार / परिचालन प्रबंधक',
  'Engineering': 'इंजीनियरिंग',
  'Traction': 'ट्रैक्शन',
  'S&T': 'सिग्नल और दूरसंचार (S&T)',
  'Maintenance Supervisor': 'रखरखाव पर्यवेक्षक',
  'Administrator': 'प्रशासक',
  'Operations': 'परिचालन',
  'IT': 'आईटी / सूचना प्रौद्योगिकी',
  'Administration': 'प्रशासन',

  // Sidebar & Navigation
  'Dashboard': 'डैशबोर्ड',
  'Maintenance Requests': 'रखरखाव अनुरोध',
  'Assets': 'संपत्तियां',
  'Block Availability': 'ब्लॉक उपलब्धता',
  'Train Schedule': 'ट्रेन समय सारणी',
  'Priority Analysis': 'प्राथमिकता विश्लेषण',
  'Optimization': 'अनुकूलन',
  'Block Plans': 'ब्लॉक योजनाएं',
  'What-If Simulation': 'व्हाट-इफ सिमुलेशन',
  'Approvals': 'स्वीकृतियां',
  'Reports / KPIs': 'रिपोर्ट और केपीआई',
  'Notifications': 'सूचनाएं',
  'Audit Trail': 'ऑडिट ट्रेल',
  'Help': 'सहायता',
  'Settings': 'सेटिंग्स',
  'Assigned Blocks': 'आवंटित ब्लॉक',
  'Assigned Tasks': 'आवंटित कार्य',
  'Work Status': 'कार्य की स्थिति',
  'Resources': 'संसाधन',
  'Users': 'उपयोगकर्ता',
  'Roles': 'भूमिकाएं',
  'Departments': 'विभाग',
  'System Status': 'सिस्टम स्थिति',
  'Navigation': 'नेविगेशन',

  // Page Headers & Titles
  'Ministry of Railways': 'रेल मंत्रालय',
  'Government of India': 'भारत सरकार',
  'RailNexus — Intelligent Block Planning': 'रेलनेक्सस — बुद्धिमान ब्लॉक योजना प्रणाली',
  'Prototype Environment — SIH 2026': 'प्रारूप पर्यावरण — SIH 2026',
  'Operations Dashboard': 'परिचालन डैशबोर्ड',
  'Cross-department overview and coordination': 'अंतर-विभागीय अवलोकन और समन्वय',
  'View and manage maintenance tasks across departments': 'विभिन्न विभागों के रखरखाव कार्यों का अवलोकन और प्रबंधन',
  'Review and approve AI-recommended block plans': 'एआई अनुशंसित ब्लॉक योजनाओं की समीक्षा और स्वीकृति',
  'Actual baseline vs optimized block plan results': 'वास्तविक बेसलाइन बनाम अनुकूलित ब्लॉक योजना परिणाम',
  'Compare impact of scenario changes on the block plan': 'ब्लॉक योजना पर परिदृश्य परिवर्तनों के प्रभाव की तुलना',
  'AI-powered maintenance task prioritization': 'एआई चालित रखरखाव कार्य प्राथमिकताकरण',
  'System user administration & access status': 'सिस्टम उपयोगकर्ता प्रशासन और पहुंच स्थिति',
  'Sectional maintenance task queue for supervisor execution': 'पर्यवेक्षक निष्पादन के लिए अनुभागीय रखरखाव कार्य कतार',
  'Live track possession & site maintenance progress management': 'लाइव ट्रैक अधिकार और साइट रखरखाव प्रगति प्रबंधन',
  'Track machines, tower wagons, equipment & specialized crew availability': 'ट्रैक मशीन, टावर वैगन, उपकरण और विशेष क्रू उपलब्धता',
  'Role': 'भूमिका',
  'Maintenance requests': 'रखरखाव अनुरोध',
  'Priority analysis': 'प्राथमिकता विश्लेषण',
  'Audit trail': 'ऑडिट ट्रेल',
  'System activity log': 'सिस्टम गतिविधि लॉग',
  'System alerts and updates': 'सिस्टम अलर्ट और अपडेट',
  'Supervisor Dashboard': 'पर्यवेक्षक डैशबोर्ड',
  "Today's maintenance execution": 'आज का रखरखाव निष्पादन',
  'System Administration': 'सिस्टम प्रशासन',
  'User and system management': 'उपयोगकर्ता और सिस्टम प्रबंधन',
  'User Governance': 'उपयोगकर्ता शासन',
  'Role Configuration': 'भूमिका कॉन्फ़िगरेशन',
  'Access control matrix and role definitions': 'पहुंच नियंत्रण मैट्रिक्स और भूमिका परिभाषाएं',
  'Department Registry': 'विभाग रजिस्ट्री',
  'Cross-departmental unit configuration': 'अंतर-विभागीय इकाई विन्यास',
  'System Health & Status': 'सिस्टम स्वास्थ्य और स्थिति',
  'Live system component monitoring': 'लाइव सिस्टम घटक निगरानी',
  'Platform Configuration': 'प्लेटफॉर्म कॉन्फ़िगरेशन',
  'Prototype system settings and parameters': 'प्रारूप सिस्टम सेटिंग्स और पैरामीटर',
  'Block planning optimization engine configuration': 'ब्लॉक योजना अनुकूलन इंजन कॉन्फ़िगरेशन',

  // Buttons & Actions
  'Request New Block': 'नया ब्लॉक अनुरोध',
  'Submit Requisition': 'अनुरोध जमा करें',
  'Approve Plan': 'योजना स्वीकृत करें',
  'Reject': 'अस्वीकार करें',
  'Modify': 'संशोधित करें',
  'Start Work': 'कार्य शुरू करें',
  'Pause Work': 'कार्य रोकें',
  'Resume Work': 'कार्य पुनः आरंभ करें',
  'Complete Work': 'कार्य पूरा करें',
  'Report Delay': 'देरी की रिपोर्ट करें',
  'Report Issue': 'समस्या की रिपोर्ट करें',
  'Run Optimization': 'अनुकूलन चलाएं',
  'Run Priority Analysis': 'प्राथमिकता विश्लेषण चलाएं',
  'Run priority analysis': 'प्राथमिकता विश्लेषण चलाएं',
  'Run Simulation': 'सिमुलेशन चलाएं',
  'Sign out': 'साइन आउट',
  'Sign in': 'साइन इन',
  'Cancel': 'रद्द करें',
  'Close': 'बंद करें',
  'Detail': 'विवरण',
  'Approve': 'स्वीकृत करें',
  'Refresh': 'ताज़ा करें',
  'Export CSV': 'CSV निर्यात करें',
  'Export Report': 'रिपोर्ट निर्यात करें',
  'Confirm': 'पुष्टि करें',
  'Search tasks...': 'कार्य खोजें...',
  'Search plans...': 'योजनाएं खोजें...',
  'Search users...': 'उपयोगकर्ता खोजें...',
  'Add notes (optional)': 'नोट्स जोड़ें (वैकल्पिक)',
  'Enable': 'सक्षम करें',
  'Disable': 'अक्षम करें',

  // Table headers
  'ID': 'आईडी',
  'Title': 'शीर्षक',
  'Department': 'विभाग',
  'Corridor / Location': 'गलियारा / स्थान',
  'Priority Score': 'प्राथमिकता स्कोर',
  'Duration': 'अवधि',
  'Status': 'स्थिति',
  'Actions': 'कार्रवाई',
  'Name': 'नाम',
  'Emp ID': 'कर्मचारी आईडी',
  'Last Activity': 'अंतिम गतिविधि',
  'Timestamp': 'समय',
  'User': 'उपयोगकर्ता',
  'Action': 'कार्रवाई',
  'Module': 'मॉड्यूल',
  'Description': 'विवरण',
  'Block ID': 'ब्लॉक आईडी',
  'Corridor': 'गलियारा',
  'Date': 'तारीख',
  'Departments involved': 'विभाग शामिल',
  'Plan ID': 'योजना आईडी',
  'Comment': 'टिप्पणी',
  'Plan Status': 'योजना स्थिति',
  'Approved by': 'द्वारा स्वीकृत',
  'Score': 'स्कोर',
  'Explanation': 'स्पष्टीकरण',
  'Type': 'प्रकार',
  'Permissions': 'अनुमतियां',

  // Filters & Labels
  'All departments': 'सभी विभाग',
  'All priorities': 'सभी प्राथमिकताएं',
  'All statuses': 'सभी स्थितियां',
  'Filter by status': 'स्थिति से फ़िल्टर करें',
  'All': 'सभी',
  'Loading...': 'लोड हो रहा है...',
  'Loading maintenance requests...': 'रखरखाव अनुरोध लोड हो रहे हैं...',
  'Loading plans...': 'योजनाएं लोड हो रही हैं...',
  'No maintenance requests found.': 'कोई रखरखाव अनुरोध नहीं मिला।',
  'No notifications': 'कोई सूचना नहीं',
  'No plans found.': 'कोई योजना नहीं मिली।',
  'No tasks found.': 'कोई कार्य नहीं मिला।',
  'No users found.': 'कोई उपयोगकर्ता नहीं मिला।',
  'No audit logs yet.': 'अभी तक कोई ऑडिट लॉग नहीं।',
  'Prototype Simulation — All data is synthetic': 'प्रारूप सिमुलेशन — सभी डेटा काल्पनिक है',
  'High Contrast': 'उच्च कंट्रास्ट',
  'Skip to main content': 'मुख्य सामग्री पर जाएं',
  'Screen Reader Access': 'स्क्रीन रीडर एक्सेस',

  // KPI & Status labels
  'Asset availability': 'संपत्ति उपलब्धता',
  'Active blocks': 'सक्रिय ब्लॉक',
  'Critical tasks': 'गंभीर कार्य',
  'Pending approvals': 'लंबित स्वीकृतियां',
  'Tasks scheduled': 'अनुसूचित कार्य',
  'Blocks used': 'उपयोग किए गए ब्लॉक',
  'Total block hours': 'कुल ब्लॉक घंटे',
  'Train conflicts': 'ट्रेन टकराव',
  'Multi-dept co-located blocks': 'बहु-विभाग सह-स्थित ब्लॉक',
  'Unscheduled tasks': 'गैर-अनुसूचित कार्य',
  "Today's tasks": 'आज के कार्य',
  'Active work': 'सक्रिय कार्य',
  'Delayed tasks': 'विलंबित कार्य',
  'Completed': 'पूर्ण',
  'Total users': 'कुल उपयोगकर्ता',
  'Active users': 'सक्रिय उपयोगकर्ता',
  'CRITICAL': 'गंभीर',
  'HIGH': 'उच्च',
  'MEDIUM': 'मध्यम',
  'LOW': 'कम',
  'APPROVED': 'स्वीकृत',
  'PENDING_APPROVAL': 'स्वीकृति के लिए लंबित',
  'REJECTED': 'अस्वीकृत',
  'MODIFIED': 'संशोधित',
  'AI_RECOMMENDED': 'एआई अनुशंसित',
  'IN_PROGRESS': 'प्रगति पर',
  'PAUSED': 'रुक गया',
  'DELAYED': 'विलंबित',
  'ISSUE_REPORTED': 'समस्या दर्ज की गई',
  'ACTIVE': 'सक्रिय',
  'DISABLED': 'अक्षम',
  'AVAILABLE': 'उपलब्ध',
  'CONFLICT': 'टकराव',
  'PENDING': 'लंबित',
  'CO_LOCATED': 'सह-स्थित',

  // Form labels - Maintenance Request
  'Work Description / Title *': 'कार्य विवरण / शीर्षक *',
  'Corridor Section': 'गलियारा खंड',
  'Location / Km Marker *': 'स्थान / किमी मार्कर *',
  'Severity': 'गंभीरता',
  'Urgency': 'तात्कालिकता',
  'Duration (Hours)': 'अवधि (घंटे)',
  'Asset ID (Optional)': 'संपत्ति आईडी (वैकल्पिक)',
  'Submitting...': 'जमा हो रहा है...',
  'Analyzing...': 'विश्लेषण हो रहा है...',
  'Running...': 'चल रहा है...',

  // Modal / Confirmation text
  'Block Request Submitted Successfully!': 'ब्लॉक अनुरोध सफलतापूर्वक जमा किया गया!',
  'Request has been routed to the AI Priority Engine and Sectional Controller.': 'अनुरोध एआई प्राथमिकता इंजन और खंड नियंत्रक को भेज दिया गया है।',
  'Explainable AI Priority Score': 'व्याख्यात्मक एआई प्राथमिकता स्कोर',
  'Contributing factors': 'योगदान करने वाले कारक',
  'Priority explanation': 'प्राथमिकता स्पष्टीकरण',
  'Confirm action': 'कार्रवाई की पुष्टि करें',
  'Add a comment (required)': 'एक टिप्पणी जोड़ें (आवश्यक)',
  'Add notes for the supervisor': 'पर्यवेक्षक के लिए नोट्स जोड़ें',
  'Approval History': 'स्वीकृति इतिहास',
  'No approval records yet.': 'अभी तक कोई स्वीकृति रिकॉर्ड नहीं।',

  // Sections & widget titles
  'Priority summary': 'प्राथमिकता सारांश',
  'Department coordination': 'विभाग समन्वय',
  'Upcoming blocks': 'आगामी ब्लॉक',
  'Recent notifications': 'हाल की सूचनाएं',
  'Registered System Personnel': 'पंजीकृत सिस्टम कर्मचारी',
  'Total Users': 'कुल उपयोगकर्ता',
  'Optimization Results': 'अनुकूलन परिणाम',
  'Baseline vs Optimized Plan': 'बेसलाइन बनाम अनुकूलित योजना',
  'Block Schedule': 'ब्लॉक कार्यक्रम',
  'Tasks scheduled in this plan': 'इस योजना में अनुसूचित कार्य',
  'AI Explanation': 'एआई स्पष्टीकरण',
  'Pending Plans': 'लंबित योजनाएं',
  'Active': 'सक्रिय',
  'Inactive': 'निष्क्रिय',
  'Pending requests': 'लंबित अनुरोध',
  'Assigned blocks': 'आवंटित ब्लॉक',

  // Dashboard sub-titles
  'Engineering Dashboard': 'इंजीनियरिंग डैशबोर्ड',
  'Traction Dashboard': 'ट्रैक्शन डैशबोर्ड',
  'S&T Dashboard': 'एस एंड टी डैशबोर्ड',
  'Engineering maintenance overview': 'इंजीनियरिंग रखरखाव अवलोकन',
  'Traction maintenance overview': 'ट्रैक्शन रखरखाव अवलोकन',
  'S&T maintenance overview': 'एस एंड टी रखरखाव अवलोकन',

  // Reports
  'Baseline': 'बेसलाइन',
  'Optimized': 'अनुकूलित',
  'Variance': 'अंतर',
  'Metric': 'मीट्रिक',
  'tasks analyzed': 'कार्य विश्लेषण किए गए',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('railnexus_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('railnexus_lang', lang);
  };

  const t = (key: string): string => {
    if (language === 'en') return key;
    return TRANSLATIONS[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
