//using HtmlAgilityPack;
//using QuestPDF.Fluent;
//using QuestPDF.Helpers;
//using QuestPDF.Infrastructure;
//using SchoolManagementSystem.Application.DTOs;
//using SchoolManagementSystem.Application.Interfaces;
//using SchoolManagementSystem.Application.Mappers;


//public class ExamResultPdfService : IExamResultPDF
//{
//    private readonly IExamResult _examResultService;
//    private readonly ExamResultMapper _examResultMapper;

//    public ExamResultPdfService(IExamResult examResultService, ExamResultMapper examResultMapper)
//    {
//        _examResultService = examResultService;
//        _examResultMapper = examResultMapper;
//    }

//    public async Task<byte[]> GeneratePdf(int studentId)
//    {
//        QuestPDF.Settings.License = LicenseType.Community;

//        var examResults = await _examResultService.GetAllExamResultsAsync();
//        var examResultData = examResults.Where(result => result.ExamDetails.Any(detail => detail.StudentId == studentId))
//            .ToList();

//        if (examResultData.Any())
//        {
//            return GenerateTranscript(examResultData);
//        }
//        else
//        {
//            return Array.Empty<byte>();
//        }
//    }


//    private byte[] GenerateTranscript(List<ExamResultDTO> examResultData)
//    {
//        var document = Document.Create(container =>
//        {
//            container.Page(page =>
//            {
//                page.Size(PageSizes.A4);
//                page.Margin(30);
//                page.DefaultTextStyle(x => x.FontSize(12));

//                // Page Header
//                page.Header().Row(row =>
//                {
//                    row.ConstantItem(100).Image("logo.jpg", ImageScaling.FitArea);
//                    row.RelativeItem().AlignCenter().Column(column =>
//                    {
//                        column.Item().Text("The Beginners Academy").Bold().FontSize(20);
//                        column.Item().PaddingBottom(5).Text("Student Transcript").FontSize(16);
//                    });
//                    row.ConstantItem(100).Text("");
//                });

//                // Divider line
//                //page.Header().PaddingTop(5).LineHorizontal(1).LineColor(Colors.Black);

//                // Student Information
//                var firstExamResult = examResultData.FirstOrDefault();
//                page.Content().Column(column =>
//                {
//                    // Student Details Section
//                    column.Item().Row(row =>
//                    {
//                        row.RelativeItem().PaddingTop(30).Column(studentDetails =>
//                        {
//                            studentDetails.Item().PaddingBottom(7).Text($"GR No: {firstExamResult.GrNo}").Bold();
//                            studentDetails.Item().PaddingBottom(7).Text($"Name: {firstExamResult.FirstName} {firstExamResult.LastName}").Bold();
//                        });

//                        row.RelativeItem().PaddingTop(30).Column(termDetails =>
//                        {
//                            termDetails.Item().PaddingBottom(7).Text($"Term: {firstExamResult.TermName}").Bold();
//                            termDetails.Item().PaddingBottom(7).Text($"Date of Birth: {firstExamResult.DateOfBirth:dd-MM-yyyy}").Bold();
//                        });
//                    });

//                    column.Item().PaddingTop(10).LineHorizontal(1).LineColor(Colors.Black);

//                    // Subject Table Header
//                    column.Item().PaddingBottom(15).PaddingTop(15).Row(row =>
//                    {
//                        row.RelativeItem(1).Text("Subject").Bold();
//                        row.RelativeItem(1).AlignCenter().Text("Marks Obtained").Bold();
//                        row.RelativeItem(1).AlignCenter().Text("Total Marks").Bold();
//                    });



//                    foreach (var result in examResultData)
//                    {
//                        foreach (var detail in result.ExamDetails)
//                        {
//                            column.Item().PaddingBottom(3).Row(row =>
//                            {
//                                row.RelativeItem(1).PaddingBottom(7).Text(result.SubjectName);
//                                row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{detail.MarksObtained}");
//                                row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{result.TotalMarks}");
//                            });
//                        }
//                    }

//                    column.Item().PaddingTop(10).PaddingBottom(20).LineHorizontal(1).LineColor(Colors.Black);


//                    column.Item().Row(row =>
//                    {
//                        row.RelativeItem(1).PaddingBottom(7).Text($"Total Marks Obtained:").Bold();
//                        row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{examResultData.FirstOrDefault()?.ExamDetails.Sum(d => d.MarksObtained)}");
//                    });

//                    column.Item().Row(row =>
//                    {
//                        row.RelativeItem(1).PaddingBottom(7).Text($"Percentage:").Bold();
//                        row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{examResultData.Average(d => d.ExamDetails.Average(e => e.Percentage)):0.00}%");
//                    });

//                    column.Item().Row(row =>
//                    {
//                        row.RelativeItem(1).PaddingBottom(7).Text($"Grade:").Bold();
//                        row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{examResultData.FirstOrDefault()?.ExamDetails.FirstOrDefault()?.Grade}");
//                    });
//                });

//                // Footer Section
//                page.Footer().AlignCenter().Text("This is a system-generated transcript.").FontSize(20).Italic();
//            });


//        });

//        // Generate and return PDF
//        return document.GeneratePdf();
//    }



//}

using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;

public class ExamResultPdfService : IExamResultPDF
{
    private readonly IExamResult _examResultService;

    public ExamResultPdfService(IExamResult examResultService)
    {
        _examResultService = examResultService;
    }

    public async Task<byte[]> GeneratePdf(int studentId)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var examResults = await _examResultService.GetAllExamResultsAsync();
        var examResultData = examResults.Where(result => result.ExamDetails.Any(detail => detail.StudentId == studentId)).ToList();

        if (examResultData.Any())
        {
            return GenerateTranscript(examResultData);
        }
        else
        {
            return Array.Empty<byte>();
        }
    }

    private byte[] GenerateTranscript(List<ExamResultDTO> examResultData)
    {
        var grandTotalMarks = CalculateGrandTotalMarks(examResultData);
        var totalMarksObtained = CalculateTotalMarksObtained(examResultData);
        var percentage = CalculatePercentage(totalMarksObtained, grandTotalMarks);
        var grade = DetermineGrade(percentage);

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header().Row(row =>
                {
                    row.ConstantItem(100).Image("logo.jpg", ImageScaling.FitArea);
                    row.RelativeItem().AlignCenter().Column(column =>
                    {
                        column.Item().Text("The Beginners Academy").Bold().FontSize(20);
                        column.Item().PaddingBottom(5).AlignCenter().Text("Student Transcript").FontSize(16);
                    });
                });

                // Student Information and Results Section
                page.Content().Column(column =>
                {
                    var firstExamResult = examResultData.FirstOrDefault();

                    column.Item().Row(row =>
                    {
                        row.RelativeItem().PaddingTop(30).Column(studentDetails =>
                        {
                            studentDetails.Item().PaddingBottom(7).Text($"GR No: {firstExamResult.GrNo}").Bold();
                            studentDetails.Item().PaddingBottom(7).Text($"Name: {firstExamResult.FirstName} {firstExamResult.LastName}").Bold();
                        });

                        row.RelativeItem().PaddingTop(30).Column(termDetails =>
                        {
                            termDetails.Item().PaddingBottom(7).Text($"Term: {firstExamResult.TermName}").Bold();
                            termDetails.Item().PaddingBottom(7).Text($"Date of Birth: {firstExamResult.DateOfBirth:dd-MM-yyyy}").Bold();
                        });
                    });

                    column.Item().PaddingTop(10).LineHorizontal(1).LineColor(Colors.Black);

                    // Subject Table Header
                    column.Item().PaddingBottom(15).PaddingTop(15).Row(row =>
                    {
                        row.RelativeItem(1).Text("Subject").Bold();
                        row.RelativeItem(1).AlignCenter().Text("Marks Obtained").Bold();
                        row.RelativeItem(1).AlignCenter().Text("Total Marks").Bold();
                    });

                    // Add exam results
                    foreach (var result in examResultData)
                    {
                        foreach (var detail in result.ExamDetails)
                        {
                            column.Item().PaddingBottom(3).Row(row =>
                            {
                                row.RelativeItem(1).PaddingBottom(7).Text(result.SubjectName);
                                row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{detail.MarksObtained}");
                                row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{result.TotalMarks}");
                            });
                        }
                    }

                    column.Item().PaddingTop(10).PaddingBottom(20).LineHorizontal(1).LineColor(Colors.Black);

                    // Total Marks and Results
                    column.Item().Row(row =>
                    {
                        row.RelativeItem(1).PaddingBottom(7).Text($"Grand Total:").Bold();
                        row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{totalMarksObtained}");
                        row.RelativeItem(1).PaddingBottom(7).AlignCenter().Text($"{grandTotalMarks}");
                    });

                    column.Item().Row(row =>
                    {
                        row.RelativeItem(1).PaddingBottom(7).Text($"Percentage:").Bold();
                        row.RelativeItem(1).PaddingBottom(7).AlignLeft().Text($"{percentage:0.00}%");
                    });

                    column.Item().Row(row =>
                    {
                        row.RelativeItem(1).PaddingBottom(7).Text($"Grade:").Bold();
                        row.RelativeItem(1).PaddingBottom(7).AlignLeft().Text(grade);
                    });
                });

                page.Footer().AlignCenter().Text("This is a system-generated transcript.").FontSize(20).Italic();
            });
        });

        return document.GeneratePdf();
    }

    // Static Methods for Calculations
    private static int CalculateGrandTotalMarks(List<ExamResultDTO> examResultData)
    {
        return (int)examResultData.Sum(result => result.TotalMarks);
    }

    private static int CalculateTotalMarksObtained(List<ExamResultDTO> examResultData)
    {
        return examResultData.Sum(result => result.ExamDetails.Sum(detail => detail.MarksObtained ?? 0));
    }

    private static double CalculatePercentage(int totalMarksObtained, int grandTotalMarks)
    {
        return grandTotalMarks > 0 ? (totalMarksObtained / (double)grandTotalMarks) * 100 : 0;
    }

    private static string DetermineGrade(double percentage)
    {
        if (percentage >= 95) return "A++";
        if (percentage >= 90) return "A+";
        if (percentage >= 85) return "A";
        if (percentage >= 80) return "B++";
        if (percentage >= 75) return "B+";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        if (percentage >= 40) return "E";
        return "Fail";
    }
}


