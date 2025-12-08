'use client';

import Image from 'next/image';

type ShapeImageProps = {
	imageKey?: string | null;
	label: string;
	size?: number;
};

export function ShapeImage({ imageKey, label, size = 96 }: ShapeImageProps) {
	const src = imageKey ? `/shapes/${imageKey}.png` : '/shapes/_default.png';

	return (
		<div className='flex items-center justify-center mb-2'>
			<div className='rounded-xl bg-white shadow-sm border border-gray-200 p-2'>
				<Image
					src={src}
					alt={label}
					width={size}
					height={size}
					className='object-contain'
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						if (!target.src.includes('_default.png')) {
							target.src = '/shapes/_default.png';
						}
					}}
				/>
			</div>
		</div>
	);
}
