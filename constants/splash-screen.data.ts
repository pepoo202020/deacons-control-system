import { FaFacebook, FaGithub } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
export const SPLASH_SCREEN_DATA = {
  mainSubTitle: {
    EN: "Manage your deacon services efficiently",
    AR: "إدارة خدمات الشمامسة بكفاءة",
  },
  createdBy: {
    EN: "Created by",
    AR: "تم إنشاء بواسطة",
  },
  createdByName: {
    EN: "Abanob Shenoda Tawfik",
    AR: "ابانوب شنودة توفيق",
  },
  socialLinks: [
    {
      icon: FaFacebook,
      Link: "https://www.facebook.com/abanob.shosh/",
      title: "Facebook",
    },
    { icon: FaGithub, Link: "https://github.com/pepoo202020", title: "Github" },
    {
      icon: RiWhatsappFill,
      Link: "https://wa.me/+201126884803",
      title: "Whatsapp",
    },
  ],
  createdByAssistant: {
    EN: "With help of Lord Jesus and St. Abaader and Ereny His Sister",
    AR: "مع مساعدة ربي والهي يسوع المسيح والشهيد العظيم ابادير وايريني اخته",
  },
  version: {
    EN: "Version: 1.0.0",
    AR: "النسخة: 1.0.0",
  },
};
