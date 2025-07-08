using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.Application.Interfaces;
using SchoolManagementSystem.Domain.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReports _reportsService;
        private readonly ILogger<ReportsController> _logger;
        public ReportsController(IReports reportsService, ILogger<ReportsController> logger)
        {
            _reportsService = reportsService;
            _logger = logger;
        }


        [HttpGet("[action]")]
        public async Task<ActionResult<GLDTO>> GetGeneralLedgerById(int accountId)
        {
            _logger.LogInformation("Fetching ledgers with ID {accountId}.", accountId);
            try
            {
                var generalLedger = await _reportsService.GetGeneralLedgerByIdAsync(accountId);

                if (generalLedger == null)
                {
                    _logger.LogWarning("Ledgers with AccountID {accountId} not found.", accountId);
                    return NotFound();
                }

                _logger.LogInformation("Successfully retrieved ledgers with ID {AccountId}.", accountId);
                return Ok(generalLedger);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching ledger with ID {AccountId}.", accountId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GLDTO>>> GetGeneralLedger()
        {
            _logger.LogInformation("Fetching all Ledgers.");
            try
            {
                var generalLedger = await _reportsService.GetGeneralLedgerAsync();
                _logger.LogInformation("Successfully retrieved {Count} Ledgers.", generalLedger?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<GLDTO>>.SuccessResponse(generalLedger, "ledgers retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all ledgers.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<TrialBalanceDTO>>> GetTrialBalance()
        {
            _logger.LogInformation("Fetching all Trial Balances.");
            try
            {
                var trialBalance = await _reportsService.GetTrialBalanceAsync();
                _logger.LogInformation("Successfully retrieved {Count} Trial Balance.", trialBalance?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<TrialBalanceDTO>>.SuccessResponse(trialBalance, "Trial Balances retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Trial Balances.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<BalanceSheetDTO>>> GetBalanceSheet()
        {
            _logger.LogInformation("Fetching all Balance Sheet .");
            try
            {
                var balanceSheet = await _reportsService.GetBalanceSheetAsync();
                _logger.LogInformation("Successfully retrieved {Count} Balance Sheet.", balanceSheet?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<BalanceSheetDTO>>.SuccessResponse(balanceSheet, "Balance Sheet retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Balance Sheet.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<IStatementDTO>>> GetIncomeStatement()
        {
            _logger.LogInformation("Fetching all Income Statement Balances.");
            try
            {
                var iStatement = await _reportsService.GetIncomeStatementAsync();
                _logger.LogInformation("Successfully retrieved {Count} Income Statement Balances.", iStatement?.Count() ?? 0);

                return Ok(ApiResponse<IEnumerable<IStatementDTO>>.SuccessResponse(iStatement, "Income Statement Balances retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all Income Statement Balances.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

