import Image from "next/image";

const Loading = () => {
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <Image
                src='/assets/icons/loader.svg'
                width={100}
                height={100}
                alt='loader'
                className='object-contain'
                priority={true}
            />
        </div>
    );
};

export default Loading;