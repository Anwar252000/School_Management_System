import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import React from 'react'

const FeeSummary = () => {
  return (
    <div className='mt-4'>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Fee Summary</CardTitle>
            <CardDescription>Overview of fee collection status</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Total Fees
              </div>
              <div className="text-2xl font-bold">$67,000.00</div>
              <div className="text-xs text-muted-foreground mt-1">
                Academic Year 2023-2024
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Collected
              </div>
              <div className="text-2xl font-bold text-green-600">
                $34,250.00
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                51.1% of total fees
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Outstanding
              </div>
              <div className="text-2xl font-bold text-red-600">$32,750.00</div>
              <div className="text-xs text-muted-foreground mt-1">
                Due by May 15, 2024
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Alerts & Notifications</h3>
            <div className="space-y-3">
              <div className="rounded-md bg-yellow-50 p-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Payment Due Soon
                    </h3>
                    <div className="mt-1 text-sm text-yellow-700">
                      45 students have payments due within the next 7 days.
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Send Reminders
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-md bg-red-50 p-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Overdue Payments
                    </h3>
                    <div className="mt-1 text-sm text-red-700">
                      12 students have overdue payments exceeding 30 days.
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        View Overdue List
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FeeSummary
