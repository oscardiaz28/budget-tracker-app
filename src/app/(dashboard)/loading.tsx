import { Loader2 } from 'lucide-react'

function loading() {
    return (
        <div className='flex items-center justify-center mt-4'>
            <Loader2 className='animate-spin size-5' />
        </div>
    )
}
export default loading