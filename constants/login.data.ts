export const LOGIN_PAGE_DATA = {
  welcome: { EN: "Welcome back", AR: "مرحباً بعودتك" },
  welcomeP: {
    EN: "Please sign in to continue",
    AR: "الرجاء تسجيل الدخول للمتابعة",
  },
  fieldsErrorMessages: {
    email: { EN: "must be an email", AR: "يجب أن يكون بريدًا إلكترونيًا" },
    emailRequired: {
      EN: "email is required",
      AR: "البريد الإلكتروني مطلوب",
    },
    password: {
      EN: "password must be more than 8 characters",
      AR: "يجب أن تكون كلمة المرور أكثر من 8 أحرف",
    },
    passwordRequired: {
      EN: "password is required",
      AR: "كلمة المرور مطلوبة",
    },
  },
  formFields: {
    placeholders: {
      email: {
        EN: "please enter your email",
        AR: "الرجاء إدخال بريدك الإلكتروني",
      },
      password: {
        EN: "please enter your password",
        AR: "الرجاء إدخال كلمة المرور الخاصة بك",
      },
    },
    labels: {
      email: { EN: "email", AR: "بريد إلكتروني" },
      password: { EN: "password", AR: "كلمة المرور" },
      stayLogged: { EN: "stay logged in", AR: "ابقى متصلًا" },
    },
  },
  response: {
    error: {
      invalidFields: {
        title: { EN: "Invalid Fields", AR: "الحقول غير صالحة" },
        message: {
          EN: "you entered invalid fields, please check it first.",
          AR: "لقد أدخلت حقولًا غير صالحة، يرجى التحقق منها أولاً.",
        },
      },
      unknown: {
        title: { EN: "Unknown Error", AR: "خطأ غير معروف" },
        message: {
          EN: "an unknown error occurred during login to your account, Please try again.",
          AR: "خطأ غير معروف في تسجيل الدخول إلى حسابك، يرجى المحاولة مرة أخرى.",
        },
      },
      userNotFound: {
        title: { EN: "User Not Found", AR: "المستخدم غير موجود" },
        message: {
          EN: "the user you entered does not exist, Please try again.",
          AR: "المستخدم الذي أدخلته غير موجود، يرجى المحاولة مرة أخرى.",
        },
      },
      passwordError: {
        title: { EN: "Password not match", AR: "كلمة المرور غير متطابقة" },
        message: {
          EN: "the password that you entered is not correct, please try again",
          AR: "كلمة المرور التي أدخلتها غير صحيحة، يرجى المحاولة مرة أخرى",
        },
      },
    },
    success: {
      title: { EN: "Logged In Successfully", AR: "تم تسجيل الدخول بنجاح" },
      message: {
        EN: "logged in successfully to your account",
        AR: "تم تسجيل الدخول إلى حسابك بنجاح",
      },
    },
  },
  buttons: {
    loading: { EN: "Submitting Login form", AR: "إرسال نموذج تسجيل الدخول" },
    login: { EN: "Login", AR: "تسجيل الدخول" },
  },
};
