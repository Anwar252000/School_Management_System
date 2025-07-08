'use client'

import React, { useState } from 'react'
import { EmployeeAppraisalData, useDeleteEmployeeAppraisalMutation } from '@/services/apis/employeePerformanceService'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import EditEmployeeAppraisal from './edit-performance-appraisal'
import { toast } from 'sonner'
import ConfirmationDialog from '../../common/confirmation-dialog'

interface Props {
  appraisals: EmployeeAppraisalData[]
  refetch: () => void
}

const ITEMS_PER_PAGE = 5

const EmployeeAppraisalListTable: React.FC<Props> = ({ appraisals, refetch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [appraisalToDelete, setAppraisalToDelete] = useState<number | null>(null)

  const filteredAppraisals = appraisals.filter(appraisal =>
    (appraisal.employeeName ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredAppraisals.length / ITEMS_PER_PAGE)
  const paginatedAppraisals = filteredAppraisals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }
const [deleteAppraisal] = useDeleteEmployeeAppraisalMutation();
  const handleDeleteConfirmation = (id: number) => setAppraisalToDelete(id)
  const handleCancelDelete = () => setAppraisalToDelete(null)

  const handleDelete = async (id: number) => {
    try {
      await deleteAppraisal(id);
      toast.success("Appraisal deleted successfully");
      setAppraisalToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting Appraisal:", error);
      toast.error("Failed to delete Appraisal");
    }
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Appraisals</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Appraisal..."
          className="w-full border border-gray-300 rounded px-4 py-2"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      <table className="min-w-full border border-gray-200 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Employee Name</th>
            <th className="px-4 py-2 text-left">Performance Score</th>
            <th className="px-4 py-2 text-left">Appraisal Date</th>
            <th className="px-4 py-2 text-left">Comments</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAppraisals.map((appraisal) => (
            <tr key={appraisal.appraisalId} className="border-t">
              <td className="px-4 py-2">{appraisal.employeeName ?? '—'}</td>
              <td className="px-4 py-2">{appraisal.performanceScore}</td>
              <td className="px-4 py-2">{appraisal.appraisalDate}</td>
              <td className="px-4 py-2">{appraisal.comments}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <EditEmployeeAppraisal performance={appraisal} refetch={refetch} />
                  <Button
                    size="icon"
                    variant="outline"
                    color="destructive"
                    className="h-7 w-7"
                    onClick={() => {
                      if (appraisal.appraisalId !== undefined) {
                        handleDeleteConfirmation(appraisal.appraisalId);
                      }
                    }}
                                      >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedAppraisals.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                No appraisals found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Confirmation Dialog */}
      {appraisalToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(appraisalToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  )
}

export default EmployeeAppraisalListTable
