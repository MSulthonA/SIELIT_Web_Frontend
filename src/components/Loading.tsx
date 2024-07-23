import { AiOutlineLoading } from 'react-icons/ai'

function Loading() {
    return ( 
        <div className='w-screen h-[100svh] z-50 fixed top-0 left-0 bg-zinc-700/70 flex items-center justify-center flex-col'>
            <div className='w-full max-w-sm rounded-lg p-8 flex flex-col items-center animate-grow'>
                <div className='h-full w-full flex items-center justify-center flex-col text-white text-xl'>
                    <AiOutlineLoading className='animate-spin mb-8' fontSize='6rem'/>
                    loading...
                </div>
            </div>
        </div>
    );
}

export default Loading;