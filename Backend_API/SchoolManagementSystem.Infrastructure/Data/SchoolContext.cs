using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.Domain.Entities;
using SchoolManagementSystem.Domain.Entities.Fee;
using SchoolManagementSystem.Domain.Entities.Library;


namespace SchoolManagementSystem.Infrastructure.Data
{
    public class SchoolContext : DbContext
    {
        public SchoolContext(DbContextOptions<SchoolContext> options) : base(options)
        {
        }

        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Applicant> Applicants { get; set; }
        public DbSet<AdmissionApplication> Applications { get; set; }
        public DbSet<AdmissionTest> AdmissionTests { get; set; }
        public DbSet<Admission> Admissions { get; set; }
        public DbSet<Campus> Campuses { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeRole> EmployeeRoles { get; set; }
        public DbSet<ClassSubject> ClassSubjects { get; set; }
        public DbSet<ClassSectionAssignment> ClassSectionAssignments { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<TimeTable> TimeTables { get; set; }
        public DbSet<Period> Periods { get; set; }
        public DbSet<SubjectTeacherAssignment> SubjectTeachers { get; set; }
        public DbSet<Sponsor> Sponsors { get; set; }
        public DbSet<QuestionBank> QuestionsBank { get; set; }
        public DbSet<ExamPaper> ExamPaper { get; set; }
        public DbSet<Exam> Exams { get; set; }

        public DbSet<ExamResult> ExamResults { get; set; }
        public DbSet<Sponsorship> Sponsorships { get; set; }

        public DbSet<Payment> SponsorPayments { get; set; }
        public DbSet<SponsorshipDetail> SponsorshipDetails { get; set; }

        public DbSet<StudentAttendance> StudentAttendance { get; set; }
        public DbSet<EmployeeAttendance> EmployeeAttendance { get; set; }

        public DbSet<StudentAcademic> StudentAcademic { get; set; }
        public DbSet<AcademicYear> AcademicYears { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<StudentParent> StudentParent { get; set; }
        public DbSet<ParentFeedback> ParentFeedback { get; set; }

        public DbSet<InventoryCategory> InventoryCategories { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<InventoryStock> InventoryStocks { get; set; }
        public DbSet<InventoryStatus> InventoryStatus { get; set; }
        public DbSet<ItemDetail> ItemDetail { get; set; }
        public DbSet<InventoryPurchase> InventoryPurchases { get; set; }
        public DbSet<AssetAllocation> AssetAllocation { get; set; }
        //public DbSet<ExamResult> ExamResults { get; set; }
        public DbSet<FeeCategory> FeeCategories { get; set; }

        public DbSet<AccountGroup> AccountGroups { get; set; }
        public DbSet<ParentAccount> ParentAccounts { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<EmployeeLeave> EmployeeLeaves { get; set; }
        public DbSet<FeeVoucher> FeeVouchers { get; set; }
        public DbSet<FeeAdjustment> FeeAdjustments { get; set; }
        public DbSet<FeeVoucherPayment> FeeVoucherPayments { get; set; }

        public DbSet<Training> Trainings { get; set; }
        public DbSet<PerformanceAppraisal> PerformanceAppraisals { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionDetail> TransactionDetail { get; set; }
        public DbSet<VoucherTypes> VoucherTypes { get; set; }

        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<DocumentManager> DocumentManager { get; set; }

        public DbSet<BookIssue> BookIssue { get; set; }
        public DbSet<BookPurchase> BookPurchase { get; set; }
        public DbSet<BookCategory> BookCategory { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<ExpenseCategory> ExpenseCategory { get; set; }
        public DbSet<DailyExpense> DailyExpense { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships and keys here
            modelBuilder.Entity<Student>()
                .HasKey(s => s.StudentId);

            modelBuilder.Entity<Admission>()
                .HasKey(a => a.AdmissionId);

            modelBuilder.Entity<Admission>()
                .HasOne(a => a.Student);

            modelBuilder.Entity<AdmissionApplication>()
            .HasOne(a => a.Class)
            .WithMany()
            .HasForeignKey(a => a.AppliedClassId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AdmissionApplication>()
                .HasOne(a => a.Class)
                .WithMany()
                .HasForeignKey(a => a.LastClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AdmissionApplication>()
                .HasIndex(a => a.ApplicationId);

            modelBuilder.Entity<AdmissionTest>()
                .HasIndex(at => at.ApplicationId);

            modelBuilder.Entity<Admission>()
                .HasIndex(ad => ad.StudentId)
                .IsUnique();

            modelBuilder.Entity<Admission>()
                .HasIndex(ad => new { ad.StudentId, ad.ApplicationId })
                .IsUnique();

            modelBuilder.Entity<EmployeeRole>()
                .HasIndex(er => er.RoleName)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            modelBuilder.Entity<ApplicantApplicationView>()
                .HasNoKey();

            modelBuilder.Entity<TimeTableView>()
                .HasNoKey();

            modelBuilder.Entity<InventoryStockView>()
                .HasNoKey();

            modelBuilder.Entity<DashboardCountView>()
                          .HasNoKey();
            modelBuilder.Entity<User>()
             .HasMany(u => u.Permissions) // Navigation property in User
             .WithOne(up => up.Users) // Navigation property in UserPermission
             .HasForeignKey(up => up.UserId); // Foreign key in UserPermission

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.Property(e => e.AmountPaid).HasPrecision(18, 2); // Specify precision and scale
            });

            modelBuilder.Entity<InventoryItem>(entity =>
            {
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2); // Specify precision and scale
            });

            modelBuilder.Entity<InventoryPurchase>(entity =>
            {
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2); // Specify precision and scale
                entity.Property(e => e.TotalCost).HasPrecision(18, 2); // Specify precision and scale
            });

            modelBuilder.Entity<Sponsorship>(entity =>
            {
                entity.Property(e => e.Amount).HasPrecision(18, 2); // Specify precision and scale
            });

            modelBuilder.Entity<SponsorshipDetail>(entity =>
            {
                entity.Property(e => e.Amount).HasPrecision(18, 2); // Specify precision and scale
            });

            // Map the entity to the SQL Server view
            modelBuilder.Entity<ApplicantApplicationView>().ToView("vw_ApplicantDetails");
            modelBuilder.Entity<TimeTableView>().ToView("TimeTableView");
            modelBuilder.Entity<DashboardCountView>().ToView("DashboardCountView");
            modelBuilder.Entity<InventoryStockView>().ToView("vw_InventoryStockSummary");

            base.OnModelCreating(modelBuilder);
        }
    }
}
