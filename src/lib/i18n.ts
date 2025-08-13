import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        print: "Print",
        settings: "Settings",
        languages: "Languages",
        selectLanguage: "Select Language",
        switchTheme: "Switch to {{mode}} mode",
        profile: "Profile",
        changePassword: "Change Password",
        switchRole: "Switch Role",
        activeAs: "Active as: {{role}}",
        logout: "Log out",
        languageChanged: "Language Changed",
        languageSwitched: "Language switched to {{language}}",
        accessDenied: "Access Denied",
        noPermission: "You don't have permission to access settings."
      },
      common: {
        light: "light",
        dark: "dark",
        english: "English",
        arabic: "العربية"
      },
      dashboard: {
        title: "Dashboard",
        welcome: "Welcome back!",
        students: "Students",
        applicants: "Applicants",
        payments: "Payments",
        reports: "Reports",
        leaves: "Leaves",
        requests: "Requests",
        exclusions: "Exclusions",
        semesters: "Semesters",
        users: "Users"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        print: "طباعة",
        settings: "الإعدادات",
        languages: "اللغات",
        selectLanguage: "اختر اللغة",
        switchTheme: "التبديل إلى وضع {{mode}}",
        profile: "الملف الشخصي",
        changePassword: "تغيير كلمة المرور",
        switchRole: "تبديل الدور",
        activeAs: "نشط كـ: {{role}}",
        logout: "تسجيل الخروج",
        languageChanged: "تم تغيير اللغة",
        languageSwitched: "تم التبديل إلى {{language}}",
        accessDenied: "تم رفض الوصول",
        noPermission: "ليس لديك صلاحية للوصول إلى الإعدادات."
      },
      common: {
        light: "فاتح",
        dark: "داكن",
        english: "English",
        arabic: "العربية"
      },
      dashboard: {
        title: "لوحة القيادة",
        welcome: "مرحباً بعودتك!",
        students: "الطلاب",
        applicants: "المتقدمين",
        payments: "المدفوعات",
        reports: "التقارير",
        leaves: "الإجازات",
        requests: "الطلبات",
        exclusions: "الاستثناءات",
        semesters: "الفصول الدراسية",
        users: "المستخدمين"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;