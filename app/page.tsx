'use client';

import { useEffect, useState } from 'react';
import { ShapeImage } from './components/ShapeImage';
import { BACKEND_URL } from './lib/config';

type Concept = {
	iri: string;
	code: string | null;
	label: string;
	description?: string | null;
	difficulty?: number | null;
	prerequisites: string[];
	image_key?: string | null;
};

export default function HomePage() {
	const [concepts, setConcepts] = useState<Concept[]>([]);
	const [loading, setLoading] = useState(true);
	const [mastered, setMastered] = useState<string[]>([]);
	const [suggestions, setSuggestions] = useState<Concept[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchConcepts() {
			try {
				const res = await fetch(`${BACKEND_URL}/concepts`);
				if (!res.ok) throw new Error('Failed to fetch concepts');
				const data: Concept[] = await res.json();
				setConcepts(data);
			} catch (e: unknown) {
				setError(e instanceof Error ? e.message : String(e));
			} finally {
				setLoading(false);
			}
		}
		fetchConcepts();
	}, []);

	const toggleMastered = (code: string | null) => {
		if (!code) return;
		setMastered((prev) =>
			prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
		);
	};

	const fetchSuggestions = async () => {
		try {
			setError(null);
			const res = await fetch(`${BACKEND_URL}/next-concepts`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mastered_concepts: mastered }),
			});
			if (!res.ok) throw new Error('Failed to fetch suggestions');
			const data: Concept[] = await res.json();
			setSuggestions(data);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	if (loading) return <div className='p-6'>Loading concepts…</div>;
	if (error) return <div className='p-6 text-red-600'>{error}</div>;

	return (
		<main className='min-h-screen bg-gray-50 p-6 space-y-8 w-2/3 mx-auto'>
			<header className='flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Geometry Intelligent Tutor</h1>
					<p className='text-gray-600'>
						Mark what you already know and get visual, ontology-based
						recommendations for what to study next.
					</p>
				</div>
				<a
					href='/problems'
					className='inline-flex items-center justify-center rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50'
				>
					Go to practice problems →
				</a>
			</header>

			{/* Mastered concepts */}
			<section>
				<h2 className='text-xl font-semibold mb-3'>
					1. Mark concepts you&apos;ve mastered
				</h2>
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{concepts.map((c) => {
						const code = c.code || '';
						const isMastered = mastered.includes(code);
						return (
							<button
								key={c.iri}
								onClick={() => toggleMastered(c.code)}
								className={`flex flex-col rounded-2xl border p-4 text-left shadow-sm transition bg-white
                  ${
										isMastered
											? 'border-green-500 ring-1 ring-green-300'
											: 'border-gray-200 hover:border-blue-300'
									}`}
							>
								<ShapeImage imageKey={c.image_key} label={c.label} />

								<div className='flex items-center justify-between mb-1'>
									<span className='font-semibold'>{c.label}</span>
									{c.difficulty && (
										<span className='text-xs text-gray-500'>
											Difficulty {c.difficulty}
										</span>
									)}
								</div>

								{c.description && (
									<p className='text-sm text-gray-700 line-clamp-3'>
										{c.description}
									</p>
								)}

								{c.prerequisites.length > 0 && (
									<p className='mt-2 text-xs text-gray-500'>
										Prerequisites: {c.prerequisites.join(', ')}
									</p>
								)}

								{isMastered && (
									<p className='mt-2 text-xs font-semibold text-green-700'>
										✓ Marked as mastered
									</p>
								)}
							</button>
						);
					})}
				</div>
			</section>

			{/* Recommendations */}
			<section>
				<h2 className='text-xl font-semibold mb-3'>
					2. Visual recommendations based on your mastery
				</h2>
				<button
					onClick={fetchSuggestions}
					className='rounded-lg border border-blue-600 px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50'
				>
					Suggest next topics
				</button>

				<div className='mt-4'>
					{suggestions.length === 0 ? (
						<p className='text-gray-600'>
							No suggestions yet. Mark a few mastered concepts first, then click
							the button.
						</p>
					) : (
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
							{suggestions.map((c) => (
								<div
									key={c.iri}
									className='flex flex-col rounded-2xl border border-blue-200 bg-white p-4 shadow-sm'
								>
									<ShapeImage imageKey={c.image_key} label={c.label} />

									<div className='flex items-center justify-between mb-1'>
										<span className='font-semibold'>{c.label}</span>
										{c.difficulty && (
											<span className='text-xs text-gray-500'>
												Difficulty {c.difficulty}
											</span>
										)}
									</div>

									{c.description && (
										<p className='text-sm text-gray-700 line-clamp-3'>
											{c.description}
										</p>
									)}

									{c.prerequisites.length > 0 && (
										<p className='mt-2 text-xs text-gray-500'>
											Requires: {c.prerequisites.join(', ')}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
