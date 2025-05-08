import {
  PrismaClient,
  UserRole,
  QualificationStatus,
  TermStatus,
  ReviewStatus,
  NotificationType,
  Level,
  Class,
  Term,
  SubjectType,
  Subject,
  Teacher,
  Controller,
  Student,
} from "@/prisma/generated/prisma";
import * as bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process with fake data...");

  // Clear existing data (optional - be careful in production)
  await clearDatabase();

  // Create subject types
  const subjectTypes = await createSubjectTypes();

  // Create levels
  const levels = await createLevels();

  // Create terms for each level
  const terms = await createTerms(levels);

  // Create classes for each level
  const classes = await createClasses(levels);

  // Create admin user
  const adminUser = await createUser(
    faker.person.fullName(),
    "admin",
    "admin@church.org",
    "admin123",
    UserRole.ADMIN
  );

  // Create teachers (5-10 teachers)
  const teacherCount = faker.number.int({ min: 5, max: 10 });
  const teachers = [];
  for (let i = 0; i < teacherCount; i++) {
    const teacherUser = await createUser(
      faker.person.fullName(),
      `teacher${i + 1}`,
      `teacher${i + 1}@church.org`,
      "teacher123",
      UserRole.TEACHER
    );
    const teacher = await createTeacher(teacherUser.id);
    teachers.push(teacher);
  }

  // Create controllers (3-5 controllers)
  const controllerCount = faker.number.int({ min: 3, max: 5 });
  const controllers = [];
  for (let i = 0; i < controllerCount; i++) {
    const controllerUser = await createUser(
      faker.person.fullName(),
      `controller${i + 1}`,
      `controller${i + 1}@church.org`,
      "controller123",
      UserRole.CONTROLLER
    );
    const controller = await createController(controllerUser.id);
    controllers.push(controller);
  }

  // Create subjects for each class
  const subjects = await createSubjects(levels, classes, terms, subjectTypes);

  // Assign teachers to subjects and classes
  await assignTeachersToSubjectsAndClasses(teachers, subjects, classes);

  // Assign controllers to classes
  await assignControllersToClasses(controllers, classes);

  // Create students (20-50 students per class)
  const students = await createStudents(classes);

  // Create subject parts for hymnology subjects
  const subjectParts = await createSubjectParts(subjects);

  // Create grades for students
  await createGrades(students, subjects, terms, controllers);

  // Create system settings
  await createSystemSettings(terms);

  // Create grade review requests
  await createGradeReviewRequests(students, subjects, terms);

  // Create notifications
  await createNotifications(
    students.map((s) => s.userId),
    adminUser.id
  );

  // Create event logs
  await createEventLogs();

  console.log("Seed completed successfully!");
}

// Helper functions for creating entities
async function clearDatabase() {
  // Delete in reverse order of dependencies
  await prisma.eventLog.deleteMany({});
  await prisma.loginHistory.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.gradeReviewRequest.deleteMany({});
  await prisma.auditTrail.deleteMany({});
  await prisma.gradeHistory.deleteMany({});
  await prisma.grade.deleteMany({});
  await prisma.subjectPart.deleteMany({});
  await prisma.archivedGrade.deleteMany({});
  await prisma.archivedResult.deleteMany({});
  await prisma.teacherSubject.deleteMany({});
  await prisma.systemSettings.deleteMany({});
  await prisma.settingCategory.deleteMany({});
  await prisma.academicTerm.deleteMany({});
  await prisma.controllerClass.deleteMany({});
  await prisma.classTeacher.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.controller.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.term.deleteMany({});
  await prisma.level.deleteMany({});
  await prisma.subjectType.deleteMany({});
  await prisma.user.deleteMany({});
}

async function createSubjectTypes() {
  const types = [
    { name: "ألحان", description: "مواد الألحان المختلفة" },
    { name: "طقس", description: "مواد الطقوس المختلفة" },
    { name: "عقيدة", description: "مواد العقيدة المختلفة" },
    { name: "كتاب مقدس", description: "دراسات الكتاب المقدس" },
  ];

  const createdTypes = [];
  for (const type of types) {
    const createdType = await prisma.subjectType.create({
      data: type,
    });
    createdTypes.push(createdType);
  }
  return createdTypes;
}

async function createLevels() {
  const levelData = [
    {
      name: "المستوى الأول",
      description: "السنة الأولى من مدرسة الشمامسة",
      years: 2,
    },
    {
      name: "المستوى الثاني",
      description: "السنة الثانية من مدرسة الشمامسة",
      years: 2,
    },
    {
      name: "المستوى الثالث",
      description: "السنة الثالثة من مدرسة الشمامسة",
      years: 2,
    },
  ];

  const levels = [];
  for (const data of levelData) {
    const level = await prisma.level.create({
      data: {
        ...data,
        hasTasbhaAbsence: faker.datatype.boolean(),
        hasOccasionAbsence: faker.datatype.boolean(),
        attendanceRules: {
          requiredAttendance: faker.number.int({ min: 70, max: 90 }),
        },
      },
    });
    levels.push(level);
  }
  return levels;
}

async function createTerms(levels: Level[]) {
  const terms = [];
  for (const level of levels) {
    for (let termNumber = 1; termNumber <= 2; termNumber++) {
      const startDate = faker.date.past();
      const endDate = faker.date.future({ refDate: startDate });

      const term = await prisma.term.create({
        data: {
          levelId: level.id,
          termNumber,
          startDate,
          endDate,
          status: faker.helpers.arrayElement(Object.values(TermStatus)),
          allowGradeEntry: faker.datatype.boolean(),
          allowReviewRequests: faker.datatype.boolean(),
        },
      });
      terms.push(term);
    }
  }
  return terms;
}

async function createClasses(levels: Level[]) {
  const classes = [];
  for (const level of levels) {
    const classCount = faker.number.int({ min: 2, max: 4 });
    for (let i = 1; i <= classCount; i++) {
      const classObj = await prisma.class.create({
        data: {
          name: `فصل ${i}`,
          levelId: level.id,
        },
      });
      classes.push(classObj);
    }
  }
  return classes;
}

async function createSubjects(
  levels: Level[],
  classes: Class[],
  terms: Term[],
  subjectTypes: SubjectType[]
) {
  const subjects = [];

  // Map subject types to their IDs for easy access
  const subjectTypeMap: Record<string, string> = {};
  subjectTypes.forEach((type) => {
    subjectTypeMap[type.name] = type.id;
  });

  for (const classObj of classes) {
    // Find the level for this class
    const level = levels.find((l) => l.id === classObj.levelId);

    // Find terms for this level
    const levelTerms = terms.filter((t) => t.levelId === level!.id);

    for (const term of levelTerms) {
      // Create hymnology subject
      if (faker.datatype.boolean()) {
        const hymnologySubject = await prisma.subject.create({
          data: {
            name: "ألحان",
            levelId: level!.id,
            classId: classObj.id,
            termId: term.id,
            maxScore: 100,
            type: subjectTypeMap["ألحان"],
          },
        });
        subjects.push(hymnologySubject);
      }

      // Create rites subject
      if (faker.datatype.boolean()) {
        const ritesSubject = await prisma.subject.create({
          data: {
            name: "طقس",
            levelId: level!.id,
            classId: classObj.id,
            termId: term.id,
            maxScore: 25,
            type: subjectTypeMap["طقس"],
          },
        });
        subjects.push(ritesSubject);
      }

      // Create doctrine subject
      if (faker.datatype.boolean()) {
        const doctrineSubject = await prisma.subject.create({
          data: {
            name: "عقيدة",
            levelId: level!.id,
            classId: classObj.id,
            termId: term.id,
            maxScore: 25,
            type: subjectTypeMap["عقيدة"],
          },
        });
        subjects.push(doctrineSubject);
      }

      // Create bible subject
      if (faker.datatype.boolean()) {
        const bibleSubject = await prisma.subject.create({
          data: {
            name: "كتاب مقدس",
            levelId: level!.id,
            classId: classObj.id,
            termId: term.id,
            maxScore: 50,
            type: subjectTypeMap["كتاب مقدس"],
          },
        });
        subjects.push(bibleSubject);
      }
    }
  }

  return subjects;
}

async function createSubjectParts(subjects: Subject[]) {
  const subjectParts = [];

  // Only create parts for hymnology subjects
  const hymnologySubjects = subjects.filter((s) => s.name === "ألحان");

  for (const subject of hymnologySubjects) {
    const partCount = faker.number.int({ min: 3, max: 8 });
    for (let i = 1; i <= partCount; i++) {
      const maxScore = faker.number.int({ min: 5, max: 15 });
      const part = await prisma.subjectPart.create({
        data: {
          name: `لحن ${i}`,
          maxScore,
          subjectId: subject.id,
        },
      });
      subjectParts.push(part);
    }
  }

  return subjectParts;
}

async function createUser(
  name: string,
  username: string,
  email: string | null,
  password: string,
  role: UserRole
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword,
      role,
      picture: faker.image.avatar(),
    },
  });
}

async function createTeacher(userId: string) {
  return prisma.teacher.create({
    data: {
      userId,
    },
  });
}

async function createController(userId: string) {
  return prisma.controller.create({
    data: {
      userId,
    },
  });
}

async function createStudents(classes: Class[]) {
  const students = [];

  for (const classObj of classes) {
    const studentCount = faker.number.int({ min: 10, max: 30 });
    for (let i = 1; i <= studentCount; i++) {
      const studentName = faker.person.fullName();
      // Add a unique suffix to ensure username uniqueness
      const uniqueSuffix = faker.string.alphanumeric(6);
      const username = `student_${classObj.name.replace(
        " ",
        ""
      )}_${i}_${uniqueSuffix}`;

      const studentUser = await createUser(
        studentName,
        username,
        null,
        "student123",
        UserRole.STUDENT
      );

      const student = await prisma.student.create({
        data: {
          userId: studentUser.id,
          currentLevel: classObj.levelId,
          classId: classObj.id,
          initialQualificationStatus: faker.helpers.arrayElement([
            QualificationStatus.QUALIFIED,
            QualificationStatus.NOT_QUALIFIED,
          ]),
        },
      });

      students.push(student);
    }
  }

  return students;
}

async function assignTeachersToSubjectsAndClasses(
  teachers: Teacher[],
  subjects: Subject[],
  classes: Class[]
) {
  // Assign teachers to subjects
  for (const subject of subjects) {
    // Randomly select a teacher
    const teacher = faker.helpers.arrayElement(teachers);

    await prisma.teacherSubject.create({
      data: {
        teacherId: teacher.id,
        subjectId: subject.id,
      },
    });
  }

  // Assign teachers to classes
  for (const classObj of classes) {
    // Randomly select 1-3 teachers for each class
    const teacherCount = faker.number.int({ min: 1, max: 3 });
    const selectedTeachers = faker.helpers.arrayElements(
      teachers,
      teacherCount
    );

    for (const teacher of selectedTeachers) {
      await prisma.classTeacher.create({
        data: {
          teacherId: teacher.id,
          classId: classObj.id,
        },
      });
    }
  }
}

async function assignControllersToClasses(
  controllers: Controller[],
  classes: Class[]
) {
  for (const classObj of classes) {
    // Randomly select a controller
    const controller = faker.helpers.arrayElement(controllers);

    await prisma.controllerClass.create({
      data: {
        controllerId: controller.id,
        classId: classObj.id,
      },
    });
  }
}

async function createGrades(
  students: Student[],
  subjects: Subject[],
  terms: Term[],
  controllers: Controller[]
) {
  for (const student of students) {
    // Find subjects for this student's class
    const classSubjects = subjects.filter((s) => s.classId === student.classId);

    for (const subject of classSubjects) {
      // Find the term for this subject
      const term = terms.find((t) => t.id === subject.termId);

      // Find a controller for this class
      const controllerClass = await prisma.controllerClass.findFirst({
        where: { classId: student.classId as string },
      });

      if (controllerClass) {
        const score = faker.number.float({
          min: 0,
          max: subject.maxScore,
          fractionDigits: 2,
        });
        const qualified =
          score >= subject.maxScore * 0.5
            ? QualificationStatus.QUALIFIED
            : QualificationStatus.NOT_QUALIFIED;

        await prisma.grade.create({
          data: {
            studentId: student.id,
            subjectId: subject.id,
            termId: term!.id,
            score,
            qualified,
            controllerId: controllerClass.controllerId,
          },
        });
      }
    }
  }
}

async function createSystemSettings(terms: Term[]) {
  const settingCategories = [
    { name: "Academic", description: "Academic settings" },
    { name: "Grading", description: "Grading settings" },
    { name: "System", description: "System settings" },
  ];

  const categories = [];
  for (const category of settingCategories) {
    const createdCategory = await prisma.settingCategory.create({
      data: category,
    });
    categories.push(createdCategory);
  }

  for (const term of terms) {
    await prisma.systemSettings.create({
      data: {
        termId: term.id,
        key: "QUALIFICATION_THRESHOLD",
        value: { value: faker.number.int({ min: 40, max: 60 }) },
        description: "Minimum score to qualify",
        SettingCategory: {
          connect: { id: categories[1].id },
        },
      },
    });

    await prisma.systemSettings.create({
      data: {
        termId: term.id,
        key: "BEHAVIOR_MAX_SCORE",
        value: { value: faker.number.int({ min: 5, max: 15 }) },
        description: "Maximum score for behavior",
        SettingCategory: {
          connect: { id: categories[1].id },
        },
      },
    });

    await prisma.systemSettings.create({
      data: {
        termId: term.id,
        key: "ENABLE_GRADE_ENTRY",
        value: { value: faker.datatype.boolean() },
        description: "Allow teachers to enter grades",
        SettingCategory: {
          connect: { id: categories[0].id },
        },
      },
    });
  }
}

async function createGradeReviewRequests(
  students: Student[],
  subjects: Subject[],
  terms: Term[]
) {
  // Create 5-10 random grade review requests
  const requestCount = faker.number.int({ min: 5, max: 10 });

  for (let i = 0; i < requestCount; i++) {
    const student = faker.helpers.arrayElement(students);

    // Find a grade for this student
    const grade = await prisma.grade.findFirst({
      where: { studentId: student.id },
    });

    if (grade) {
      await prisma.gradeReviewRequest.create({
        data: {
          studentId: student.id,
          gradeId: grade.id,
          message: faker.lorem.paragraph(),
          status: faker.helpers.arrayElement(Object.values(ReviewStatus)),
        },
      });
    }
  }
}

async function createNotifications(userIds: string[], adminId: string) {
  const notificationTypes = Object.values(NotificationType);

  // Create 20-30 random notifications
  const notificationCount = faker.number.int({ min: 20, max: 30 });

  for (let i = 0; i < notificationCount; i++) {
    const receiverId = faker.helpers.arrayElement(userIds);

    await prisma.notification.create({
      data: {
        receiverId,
        senderId: adminId,
        type: faker.helpers.arrayElement(notificationTypes),
        message: faker.lorem.sentence(),
        seen: faker.datatype.boolean(),
      },
    });
  }
}

async function createEventLogs() {
  const categories = ["SYSTEM", "USER", "GRADE", "TERM", "LOGIN"];

  // Create 20-30 random event logs
  const logCount = faker.number.int({ min: 20, max: 30 });

  for (let i = 0; i < logCount; i++) {
    const category = faker.helpers.arrayElement(categories);

    await prisma.eventLog.create({
      data: {
        category,
        message: faker.lorem.sentence(),
        data: { timestamp: faker.date.recent().toISOString() },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
