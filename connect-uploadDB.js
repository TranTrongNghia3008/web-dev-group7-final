const mongoose = require('mongoose');

const seedAccounts = require('./seeders/accountSeeder');
const seedUsers = require('./seeders/userSeeder');
const seedProjects = require('./seeders/projectSeeder');
const seedParticipations = require('./seeders/participationSeeder');
const seedReports = require('./seeders/reportSeeder');
const seedModules = require('./seeders/moduleSeeder');
const seedActivities = require('./seeders/activitySeeder');
const seedReleases = require('./seeders/releaseSeeder');
const seedRequirements = require('./seeders/requirementSeeder');
const seedTestPlans = require('./seeders/testPlanSeeder');
const seedTestCases = require('./seeders/testCaseSeeder');
const seedTags = require('./seeders/tagSeeder');
const seedTestRuns = require('./seeders/testRunSeeder');
const seedIssues = require('./seeders/issueSeeder');

const connectionParam = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect('mongodb+srv://admin:3erkkrKTy2EJBjUl@webdev-21tn-group7.dmacvr7.mongodb.net/tms-v01?retryWrites=true&w=majority&appName=WebDev-21TN-Group7')
  .then(() => console.log('Connected!'));


// seedAccounts();
// seedUsers();
// seedProjects();
// seedParticipations();
// seedReports();
// seedModules();
// seedActivities();
// seedReleases();
// seedRequirements();
// seedTestPlans();
// seedTestCases();
// seedTags();
// seedTestRuns();
// seedIssues();

// Cấm chạy lại file này, chạy là ăn shit

// mongoose.connection.close();