
CREATE TABLE Admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phoneNumber INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME
);

-- جدول Permission
CREATE TABLE Permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    adminId INT NOT NULL,
    FOREIGN KEY (adminId) REFERENCES Admin(id)
);

-- جدول Student
CREATE TABLE Student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(255) NOT NULL,
    academicYear VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    parentId INT NOT NULL,
    image VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    confPassword VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    deletedAt DATETIME,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    cityId INT NOT NULL,
    countryId INT NOT NULL,
    typelan VARCHAR(255),
    FOREIGN KEY (parentId) REFERENCES Parent(id),
    FOREIGN KEY (cityId) REFERENCES City(id),
    FOREIGN KEY (countryId) REFERENCES Country(id)
);

-- جدول SecretKey
CREATE TABLE SecretKey (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (studentId) REFERENCES Student(id)
);

-- جدول Category
CREATE TABLE Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- جدول Country
CREATE TABLE Country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    countryName VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- جدول City
CREATE TABLE City (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cityName VARCHAR(255) NOT NULL,
    countryId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (countryId) REFERENCES Country(id)
);

-- جدول Parent
CREATE TABLE Parent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(255) NOT NULL
);

-- جدول Teacher
CREATE TABLE Teacher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phoneNumber INT NOT NULL,
    confPassword VARCHAR(255) NOT NULL
);

-- جدول Curriculum
CREATE TABLE Curriculum (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    teacherId INT NOT NULL,
    FOREIGN KEY (teacherId) REFERENCES Teacher(id)
);

-- جدول Subject
CREATE TABLE Subject (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    curriculumId INT NOT NULL,
    FOREIGN KEY (curriculumId) REFERENCES Curriculum(id)
);

-- جدول Lesson
CREATE TABLE Lesson (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subjectId INT NOT NULL,
    teacherId INT NOT NULL,
    FOREIGN KEY (subjectId) REFERENCES Subject(id),
    FOREIGN KEY (teacherId) REFERENCES Teacher(id)
);

-- جدول Video
CREATE TABLE Video (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    lessonId INT NOT NULL,
    views INT NOT NULL,
    FOREIGN KEY (lessonId) REFERENCES Lesson(id)
);

-- جدول Assignment
CREATE TABLE Assignment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    lessonId INT NOT NULL,
    answersTrue VARCHAR(255) NOT NULL,
    FOREIGN KEY (lessonId) REFERENCES Lesson(id)
);

-- جدول StudentAssignment
CREATE TABLE StudentAssignment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    assignmentId INT NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (studentId) REFERENCES Student(id),
    FOREIGN KEY (assignmentId) REFERENCES Assignment(id)
);

-- جدول LiveClass
CREATE TABLE LiveClass (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    teacherId INT NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    cost FLOAT NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (teacherId) REFERENCES Teacher(id)
);
