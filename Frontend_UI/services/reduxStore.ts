import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import classroomApi from "./apis/classroomService";
import sectionApi from "./apis/sectionService";
import studentAttendanceApi from "./apis/studentAttendanceService";
import { empRoleApi } from "./apis/employeeRoleService";
import employeeApi from "./apis/employeeService";
import sponsorApi from "./apis/sponsorService";
import dashboardApi from "./apis/dashboardService";
import paymentApi from "./apis/sponsorPaymentService";
import sponsorshipApi from "./apis/sponsorshipService";
import studentApi from "./apis/studentService";
import userApi from "./apis/userService";
import userRoleApi from "./apis/userRoleService";
import userPermissionApi from "./apis/userPermissionService";
import applicantApi from "./apis/applicantService";
import examApi from "./apis/examService";
import classApi from "./apis/classService";
import classAssignApi from "./apis/assignClassService";
import departmentApi from "./apis/departmentService";
import campusApi from "./apis/campusService";
import subjectApi from "./apis/subjectService";
import assignClassSubjectApi from "./apis/assignClassSubjectService";
import assignSubjectTeacherApi from "./apis/assignSubjectTeacherService";
import questionBankApi from "./apis/qBankService";
import examPaperApi from "./apis/examPaperService";
import examPaperPDFApi from "./apis/examPaperPDFService";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authSlice from "./authSlice";
import permissionSlice from "./userPermissionSlice";
import examResultApi from "./apis/examResultService";
import examResultPDFApi from "./apis/examResultPDFService";
import timetableApi from "./apis/timetableService";
import periodApi from "./apis/periodService";
import inventoryCategoryApi from "./apis/inventoryCategoryService";
import inventoryItemApi from "./apis/inventoryItemService";
import employeeAttendanceApi from "./apis/employeeAttendanceService";
import studentAcademicApi from "./apis/studentAcademicService";
import parentApi from "./apis/parentService";
import inventoryStockApi from "./apis/inventoryStockService";
import inventoryStatusApi from "./apis/inventoryStatusService";
import inventoryPurchaseApi from "./apis/inventoryPurchaseService";
import assetsAllocationApi from "./apis/assetsAllocationService";
import parentFeedbackApi from "./apis/parentFeedbackService";
import studentParentApi from "./apis/studentParentService";
import feeCategoryApi from "./apis/feeCategoryService";
import accountGroupApi from "./apis/accountGroupService";
import parentAccountApi from "./apis/parentAccountService";
import accountApi from "./apis/accountService";
import noticeApi from "./apis/noticeService";
import feeApi from "./apis/feeService";
import employeeLeaveApi from "./apis/employeeLeaveService";
import employeeAppraisalApi from "./apis/employeePerformanceService";
import employeeTrainingApi from "./apis/employeeTrainingService";
import classFeeApi from "./apis/manageClassFeeService";
import employeeBenefitsApi from "./apis/employeeBenefitsService";
import  taskApi  from './apis/taskService';
import transactionApi from "./apis/transactionService";
import accountReportsApi from "./apis/accountReportsService";
import documentApi from "./apis/documentService";
import bookCategoryApi from "./apis/bookCategoryService";
import bookPurchaseApi from "./apis/bookPurchaseService";
import bookApi from "./apis/bookService";  
import issueApi from "./apis/issueService";
import dailyExpenseApi from "./apis/dailyExpenseService";
import expenseCategoryApi from "./apis/expenseCategoryService";
import backupApi from "./apis/backupService";







const authPersistConfig = {
  key: "auth", // Key used for localStorage
  storage, // The storage engine to use (localStorage)
};

const permissionPersistConfig = {
  key: "permission", // Key for localStorage
  storage, // Storage engine to use (localStorage)
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  permission: persistReducer(permissionPersistConfig, permissionSlice),
  [sectionApi.reducerPath]: sectionApi.reducer,
  [studentAttendanceApi.reducerPath]: studentAttendanceApi.reducer,
  [studentAcademicApi.reducerPath]: studentAcademicApi.reducer,
  [employeeAttendanceApi.reducerPath]: employeeAttendanceApi.reducer,
  [classroomApi.reducerPath]: classroomApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [empRoleApi.reducerPath]: empRoleApi.reducer,
  [sponsorApi.reducerPath]: sponsorApi.reducer,
  [sponsorshipApi.reducerPath]: sponsorshipApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [studentApi.reducerPath]: studentApi.reducer,
  [parentApi.reducerPath]: parentApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [userRoleApi.reducerPath]: userRoleApi.reducer,
  [userPermissionApi.reducerPath]: userPermissionApi.reducer,
  [applicantApi.reducerPath]: applicantApi.reducer,
  [classApi.reducerPath]: classApi.reducer,
  [classAssignApi.reducerPath]: classAssignApi.reducer,
  [departmentApi.reducerPath]: departmentApi.reducer,
  [campusApi.reducerPath]: campusApi.reducer,
  [subjectApi.reducerPath]: subjectApi.reducer,
  [assignClassSubjectApi.reducerPath]: assignClassSubjectApi.reducer,
  [assignSubjectTeacherApi.reducerPath]: assignSubjectTeacherApi.reducer,
  [questionBankApi.reducerPath]: questionBankApi.reducer,
  [examApi.reducerPath]: examApi.reducer,
  [examPaperApi.reducerPath]: examPaperApi.reducer,
  [examPaperPDFApi.reducerPath]: examPaperPDFApi.reducer,
  [examResultApi.reducerPath]: examResultApi.reducer,
  [examResultPDFApi.reducerPath]: examResultPDFApi.reducer,
  [timetableApi.reducerPath]: timetableApi.reducer,
  [periodApi.reducerPath]: periodApi.reducer,
  [parentFeedbackApi.reducerPath]: parentFeedbackApi.reducer,
  [studentParentApi.reducerPath]: studentParentApi.reducer,
  [inventoryCategoryApi.reducerPath]: inventoryCategoryApi.reducer,
  [inventoryItemApi.reducerPath]: inventoryItemApi.reducer,
  [inventoryStockApi.reducerPath]: inventoryStockApi.reducer,
  [inventoryStatusApi.reducerPath]: inventoryStatusApi.reducer,
  [inventoryPurchaseApi.reducerPath]: inventoryPurchaseApi.reducer,
  [assetsAllocationApi.reducerPath]: assetsAllocationApi.reducer,
  [feeCategoryApi.reducerPath]: feeCategoryApi.reducer,
  [accountGroupApi.reducerPath]: accountGroupApi.reducer,
  [parentAccountApi.reducerPath]: parentAccountApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
  [noticeApi.reducerPath]: noticeApi.reducer,
  [feeApi.reducerPath]: feeApi.reducer,
  [employeeLeaveApi.reducerPath]: employeeLeaveApi.reducer,
  [employeeAppraisalApi.reducerPath]: employeeAppraisalApi.reducer,
  [employeeTrainingApi.reducerPath]: employeeTrainingApi.reducer,
  [classFeeApi.reducerPath]: classFeeApi.reducer,
  [employeeBenefitsApi.reducerPath]: employeeBenefitsApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [documentApi.reducerPath]: documentApi.reducer,
  [accountReportsApi.reducerPath]: accountReportsApi.reducer,
  [bookCategoryApi.reducerPath]: bookCategoryApi.reducer,
  [bookPurchaseApi.reducerPath]: bookPurchaseApi.reducer,
   [bookApi.reducerPath]: bookApi.reducer,
   [issueApi.reducerPath]: issueApi.reducer,
   [dailyExpenseApi.reducerPath]: dailyExpenseApi.reducer,
   [expenseCategoryApi.reducerPath]: expenseCategoryApi.reducer,
  [backupApi.reducerPath]: backupApi.reducer,




  



});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(sectionApi.middleware)
      .concat(classroomApi.middleware)
      .concat(studentAttendanceApi.middleware)
      .concat(employeeAttendanceApi.middleware)
      .concat(employeeApi.middleware)
      .concat(empRoleApi.middleware)
      .concat(sponsorApi.middleware)
      .concat(sponsorshipApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(paymentApi.middleware)
      .concat(studentApi.middleware)
      .concat(parentApi.middleware)
      .concat(userApi.middleware)
      .concat(userRoleApi.middleware)
      .concat(userPermissionApi.middleware)
      .concat(applicantApi.middleware)
      .concat(classroomApi.middleware)
      .concat(classApi.middleware)
      .concat(classAssignApi.middleware)
      .concat(departmentApi.middleware)
      .concat(campusApi.middleware)
      .concat(subjectApi.middleware)
      .concat(assignClassSubjectApi.middleware)
      .concat(assignSubjectTeacherApi.middleware)
      .concat(questionBankApi.middleware)
      .concat(examApi.middleware)
      .concat(examPaperApi.middleware)
      .concat(examPaperPDFApi.middleware)
      .concat(examResultApi.middleware)
      .concat(examResultPDFApi.middleware)
      .concat(timetableApi.middleware)
      .concat(periodApi.middleware)
      .concat(inventoryCategoryApi.middleware)
      .concat(inventoryItemApi.middleware)
      .concat(studentAcademicApi.middleware)
      .concat(inventoryStockApi.middleware)
      .concat(inventoryPurchaseApi.middleware)
      .concat(inventoryStatusApi.middleware)
      .concat(assetsAllocationApi.middleware)
      .concat(studentParentApi.middleware)
      .concat(parentFeedbackApi.middleware)
      .concat(feeCategoryApi.middleware)
      .concat(accountGroupApi.middleware)
      .concat(parentAccountApi.middleware)
      .concat(accountApi.middleware)
      .concat(noticeApi.middleware)
      .concat(classFeeApi.middleware)
      .concat(feeApi.middleware)
      .concat(employeeLeaveApi.middleware)
      .concat(employeeAppraisalApi.middleware)
      .concat(employeeTrainingApi.middleware)
      .concat(employeeBenefitsApi.middleware)
      .concat((taskApi.middleware))
      .concat(accountApi.middleware)
      .concat(transactionApi.middleware)
      .concat(accountReportsApi.middleware)
      .concat(documentApi.middleware)
      .concat(bookCategoryApi.middleware)
      .concat(bookPurchaseApi.middleware)
      .concat(bookApi.middleware)
      .concat(issueApi.middleware)
      .concat(dailyExpenseApi.middleware)
      .concat(expenseCategoryApi.middleware)
      .concat(backupApi.middleware)


});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export default store;
