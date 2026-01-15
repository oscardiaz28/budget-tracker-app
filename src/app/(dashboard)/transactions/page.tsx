"use client";

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { startOfMonth } from '@/lib/helpers';
import { useState } from 'react';
import { TransactionTable } from './_components/TransactionTable';

function page() {

  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: new Date()
  });

  return (
    <div>

      <div className='border-b bg-card'>
        <div className='container mx-auto px-5 md:px-8 py-8 flex items-center justify-between'>
          <div>
            <p className='text-2xl font-bold'>Historial de transacciones</p>
          </div>
          <div>
            <DateRangePicker
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              onUpdate={ values => {
                const { from, to } = values.range
                if(!from || !to) return;
                setDateRange({from, to})
              }}
              showCompare={false}
            />
          </div>
        </div>
      </div>

      <div className='container mx-auto px-5 md:px-8'>
        <TransactionTable from={dateRange.from} to={dateRange.to} />        
      </div>

    </div>
  )

}

export default page