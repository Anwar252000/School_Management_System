using HtmlAgilityPack;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SchoolManagementSystem.Application.DTOs;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Application.Mappers;


public class ExamPaperPdfService : IExamPaperPDF
{
    private readonly IExamPaper _examPaperService;
    private readonly ExamPaperMapper _examPaperMapper;

    public ExamPaperPdfService(IExamPaper examPaperService, ExamPaperMapper examPaperMapper)
    {
        _examPaperService = examPaperService;
        _examPaperMapper = examPaperMapper;
    }

    public async Task<byte[]> GeneratePdf(int classId, int subjectId)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var examPapers = await _examPaperService.GetAllExamPapersAsync();
        var examPaperData = examPapers.Where(a => a.ClassId == classId && a.SubjectId == subjectId).ToList();

        if (examPaperData.Any())
        {
            var examPaper = examPaperData.First();

            // Conditional formatting based on SubjectName
            if (examPaper.SubjectName == "Urdu" || examPaper.SubjectName == "Islamiyat")
            {
                return GenerateUrduExamPaper(examPaper, examPaperData);
            }
            else
            {
                return GenerateEnglishExamPaper(examPaper, examPaperData);
            }
        }
        else
        {
            return Array.Empty<byte>();
        }
    }

    private byte[] GenerateEnglishExamPaper(ExamPaperDTO examPaper, List<ExamPaperDTO> examPaperData)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(20);
                page.DefaultTextStyle(x => x.FontSize(12));

                // English-specific header and content
                page.Header().Column(column =>
                {
                    column.Item().Row(row =>
                    {
                        row.ConstantItem(100).Image("logo.jpg");

                        row.RelativeItem(200).AlignCenter().Column(column =>
                        {
                            column.Item().AlignCenter().PaddingBottom(8).Text("The Beginners Academy").Bold().FontSize(18);

                            column.Item().AlignCenter().Padding(2).Row(innerRow =>
                             {
                                 innerRow.RelativeItem().AlignLeft().PaddingLeft(90).Text("Term:").FontSize(12).Bold();
                                 innerRow.RelativeItem().AlignLeft().Text($"{examPaper.TermName}").FontSize(12).Bold();
                             });
                            column.Item().AlignCenter().Padding(2).Row(innerRow =>
                            {
                                innerRow.RelativeItem().AlignLeft().PaddingLeft(90).PaddingRight(20).Text("Class:").FontSize(12).Bold();
                                innerRow.RelativeItem().AlignLeft().Text($"{examPaper.ClassName}").FontSize(12).Bold();
                            });
                            column.Item().AlignCenter().Padding(2).Row(innerRow =>
                            {
                                innerRow.RelativeItem().AlignLeft().PaddingLeft(90).Text("Subject:").FontSize(12).Bold();
                                innerRow.RelativeItem().AlignLeft().Text($"{examPaper.SubjectName}").FontSize(12).Bold();
                            });

                        });

                        row.RelativeItem(90).AlignRight().Column(column =>
                        {
                            column.Item().Border(1).Padding(2).Row(innerRow =>
                            {
                                innerRow.RelativeItem(60).AlignLeft().Text("Written Marks:").FontSize(12).Bold();
                                innerRow.RelativeItem(30).AlignRight().Text($"{examPaper.WrittenMarks}").FontSize(12).Bold();
                            });
                            column.Item().Border(1).Padding(2).Row(innerRow =>
                            {
                                innerRow.RelativeItem(60).AlignLeft().Text("Oral Marks:").FontSize(12).Bold();
                                innerRow.RelativeItem(30).AlignRight().Text($"{examPaper.OralMarks}").FontSize(12).Bold();
                            });
                            column.Item().Border(1).Padding(2).Row(innerRow =>
                            {
                                innerRow.RelativeItem(60).AlignLeft().Text("Dictation Marks:").FontSize(12).Bold();
                                innerRow.RelativeItem(30).AlignRight().Text($"{examPaper.DictationMarks}").FontSize(12).Bold();
                            });
                            column.Item().Border(1).Padding(2).Row(innerRow =>
                            {
                                innerRow.RelativeItem(60).AlignLeft().Text("Copy Marks:").FontSize(12).Bold();
                                innerRow.RelativeItem(30).AlignRight().Text($"{examPaper.CopyMarks}").FontSize(12).Bold();
                            });
                            column.Item().Border(1).Padding(2).Row(innerRow =>
                            {
                                innerRow.RelativeItem(60).AlignLeft().Text("Written Marks:").FontSize(12).Bold();
                                innerRow.RelativeItem(30).AlignRight().Text($"{examPaper.TotalMarks}").FontSize(12).Bold();
                            });
                        });
                        row.RelativeItem().ExtendHorizontal().PaddingTop(5).LineHorizontal(1).LineColor(Colors.Black);
                    });
                    
                    column.Item().PaddingTop(10).ExtendHorizontal().LineHorizontal(1).LineColor(Colors.Black);
                });

                page.Content().PaddingTop(5).PaddingBottom(60).PaddingLeft(15).Column(column =>
                {
                    column.Item().Row(row =>
                    {
                        row.RelativeItem(50).PaddingTop(15).PaddingBottom(25).AlignLeft().Text("Attempt All Questions").Bold();
                    });

                    if (examPaper.Questions != null)
                    {
                        RenderQuestions(column, examPaperData);
                    }
                });
            });
        });
        //document.ShowInPreviewer();
        return document.GeneratePdf();
    }

    private byte[] GenerateUrduExamPaper(ExamPaperDTO examPaper, List<ExamPaperDTO> examPaperData)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(20);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header().Column(column =>
                {
                    column.Item().Row(row =>
                    {
                        row.ConstantItem(130).Padding(5).Column(column =>
                      {
                        column.Item().Border(1).Padding(2).Row(innerRow =>
                        {
                            innerRow.RelativeItem(40).AlignLeft().Text($"{examPaper.WrittenMarks}").FontSize(12).Bold();
                            innerRow.RelativeItem(90).PaddingRight(0).AlignRight().Text(":تحریری نمبر").FontSize(12).Bold();
                        });

                        column.Item().Border(1).Padding(2).Row(innerRow =>
                        {
                            innerRow.RelativeItem(40).AlignLeft().Text($"{examPaper.OralMarks}").FontSize(12).Bold();
                            innerRow.RelativeItem(90).PaddingRight(0).AlignRight().Text(":زبانی نمبر").FontSize(12).Bold();
                        });

                        column.Item().Border(1).Padding(2).Row(innerRow =>
                        {
                            innerRow.RelativeItem(40).AlignLeft().Text($"{examPaper.DictationMarks}").FontSize(12).Bold();
                            innerRow.RelativeItem(90).PaddingRight(0).AlignRight().Text(":ڈکٹیٹشن نمبر").FontSize(12).Bold();
                        });

                        column.Item().Border(1).Padding(2).Row(innerRow =>
                        {
                            innerRow.RelativeItem(40).AlignLeft().Text($"{examPaper.CopyMarks}").FontSize(12).Bold();
                            innerRow.RelativeItem(90).PaddingRight(0).AlignRight().Text(":کاپی نمبر").FontSize(12).Bold();
                        });

                        column.Item().Border(1).Padding(2).Row(innerRow =>
                        {
                            innerRow.RelativeItem(40).AlignLeft().Text($"{examPaper.TotalMarks}").FontSize(14).Bold();
                            innerRow.RelativeItem(90).PaddingRight(0).AlignRight().Text(":کل نمبر").FontSize(14).Bold();
                        });
                    });

                    row.RelativeItem(200).PaddingLeft(70).PaddingRight(70).AlignCenter().Column(column =>
                    {
                        column.Item().AlignCenter().Text("دی بگنرز اکیڈمی").Bold().FontSize(22);

                        column.Item().PaddingTop(10).Row(innerRow =>
                        {
                            innerRow.RelativeItem().AlignRight().Text($"{examPaper.TermName}").FontSize(12).Bold();
                            innerRow.RelativeItem().AlignRight().PaddingRight(30).Text(":مدت").FontSize(12).Bold();
                        });
                        column.Item().Row(innerRow =>
                        {
                            innerRow.RelativeItem().AlignRight().Text($"{examPaper.ClassName}").FontSize(12).Bold();
                            innerRow.RelativeItem().AlignRight().PaddingRight(30).Text(":کلاس").FontSize(12).Bold();
                        });
                        column.Item().Row(innerRow =>
                        {
                            innerRow.RelativeItem().AlignRight().Text($"{examPaper.SubjectName}").FontSize(12).Bold();
                            innerRow.RelativeItem().AlignRight().PaddingRight(30).Text(":مضمون").FontSize(12).Bold();
                        });
                    });

                    row.ConstantItem(120).AlignRight().Image("logo.jpg");
                    });
                    
                    column.Item().PaddingTop(10).ExtendHorizontal().LineHorizontal(1).LineColor(Colors.Black);
                });

                page.Content().PaddingTop(10).PaddingBottom(60).PaddingLeft(15).Column(column =>
                {
                    column.Item().Row(row =>
                    {
                        row.RelativeItem(50).PaddingTop(10).PaddingBottom(25).AlignRight().Text("تمام سوالات حل کریں").FontSize(13).Bold(); // Urdu content
                    });

                    if (examPaper.Questions != null)
                    {
                        RenderQuestionsUrdu(column, examPaperData);
                    }
                });
            });
        });
        //document.ShowInPreviewer();
        return document.GeneratePdf();
    }

    private void RenderQuestions(ColumnDescriptor column, List<ExamPaperDTO> examPaperData)
    {
        int questionIndex = 1;

        foreach (var question in examPaperData)
        {
            column.Item().Row(row =>
            {
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(question.Questions);

                row.RelativeItem(1).Column(questionColumn =>
                {
                    questionColumn.Item().PaddingBottom(10).Text($"Question No. {questionIndex}.").FontSize(14).Bold();

                    foreach (var node in htmlDoc.DocumentNode.ChildNodes)
                    {
                        switch (node.Name)
                        {
                            case "h1":
                                questionColumn.Item().Text(node.InnerText).FontSize(15).Bold();
                                break;
                            case "h2":
                                questionColumn.Item().Text(node.InnerText).FontSize(13).Bold();
                                break;
                            case "p":
                                var formattedText = ReplaceMathematicalOperatorsAndSymbols(node.InnerText);
                                questionColumn.Item().Text(formattedText).FontSize(12);
                                break;
                            case "ul":
                            case "ol":
                                foreach (var listItem in node.ChildNodes)
                                {
                                    if (listItem.Name == "li")
                                    {
                                        var formattedListItem = ReplaceMathematicalOperatorsAndSymbols(listItem.InnerText);
                                        questionColumn.Item().PaddingTop(6).PaddingLeft(10).Text($"• {formattedListItem}").FontSize(12);
                                    }
                                }
                                break;
                            case "li":
                                var formattedLi = ReplaceMathematicalOperatorsAndSymbols(node.InnerText);
                                questionColumn.Item().Text($"• {formattedLi}").FontSize(12);
                                break;
                            case "strong":
                                questionColumn.Item().Text(node.InnerText).FontSize(12).Bold();
                                break;
                            case "em":
                                questionColumn.Item().Text(node.InnerText).FontSize(12).Italic();
                                break;
                            default:
                                questionColumn.Item().Text(node.InnerText).FontSize(12);
                                break;
                        }
                    }
                });

                row.ConstantItem(100).AlignRight().Text($"Marks: {question.Marks}").FontSize(14).Bold();
            });

                string ReplaceMathematicalOperatorsAndSymbols(string text)
                {
                    return text.Replace("*", "×")
                                .Replace("/", "÷")
                                .Replace("-", "−")
                                .Replace("+", "+")
                                .Replace("=", "=")
                                .Replace("{", "{")
                                .Replace("}", "}")
                                .Replace("[", "[")
                                .Replace("]", "]")
                                .Replace("(", "(")
                                .Replace(")", ")")
                                .Replace("@", "@")
                                .Replace("#", "#")
                                .Replace("$", "$")
                                .Replace("%", "%")
                                .Replace("&", "&")
                                .Replace("_", "_");
                }
            questionIndex++;
            column.Item().PaddingBottom(35);
        }
    }

    private void RenderQuestionsUrdu(ColumnDescriptor column, List<ExamPaperDTO> examPaperData)
    {
        int questionIndex = 1;

        foreach (var question in examPaperData)
        {
            column.Item().Row(row =>
            {
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(question.Questions);

                row.ConstantItem(100).AlignLeft().Text($"{question.Marks} :نمبر").FontSize(14).Bold();

                row.RelativeItem(1).AlignRight().Column(questionColumn =>
                {
                    questionColumn.Item().PaddingBottom(10).AlignRight().Text($"{questionIndex} :سوال نمبر").FontSize(14).Bold();

                    foreach (var node in htmlDoc.DocumentNode.ChildNodes)
                    {
                        switch (node.Name)
                        {
                            case "h1":
                                questionColumn.Item().Text(node.InnerText).FontSize(15).Bold();
                                break;
                            case "h2":
                                questionColumn.Item().Text(node.InnerText).FontSize(13).Bold();
                                break;
                            case "p":
                                var formattedText = ReplaceMathematicalOperatorsAndSymbols(node.InnerText);
                                questionColumn.Item().Text(formattedText).FontSize(12);
                                break;
                            case "ul":
                            case "ol":
                                foreach (var listItem in node.ChildNodes)
                                {
                                    if (listItem.Name == "li")
                                    {
                                        var formattedListItem = ReplaceMathematicalOperatorsAndSymbols(listItem.InnerText);
                                        questionColumn.Item().PaddingTop(6).PaddingLeft(10).Text($"• {formattedListItem}").FontSize(12);
                                    }
                                }
                                break;
                            case "li":
                                var formattedLi = ReplaceMathematicalOperatorsAndSymbols(node.InnerText);
                                questionColumn.Item().Text($"• {formattedLi}").FontSize(12);
                                break;
                            case "strong":
                                questionColumn.Item().Text(node.InnerText).FontSize(12).Bold();
                                break;
                            case "em":
                                questionColumn.Item().Text(node.InnerText).FontSize(12).Italic();
                                break;
                            default:
                                questionColumn.Item().Text(node.InnerText).FontSize(12);
                                break;
                        }
                    }
                });
            });

            string ReplaceMathematicalOperatorsAndSymbols(string text)
            {
                return text .Replace("-", "−")
                            .Replace("=", "=")
                            .Replace("{", "{")
                            .Replace("}", "}")
                            .Replace("[", "[")
                            .Replace("]", "]")
                            .Replace("(", "(")
                            .Replace(")", ")")
                            .Replace("#", "#")
                            .Replace("&", "&")
                            .Replace("_", "_");
            }

            questionIndex++;
            column.Item().PaddingBottom(35);
        }
    }

}
