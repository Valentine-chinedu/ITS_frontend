'use client';

import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../lib/config';
import Link from 'next/link';

type Problem = {
	iri: string;
	label: string;
	text: string;
	teaches_concepts: string[];
	has_hint_concepts: string[];
};

type AnswerResult = {
	correct: boolean;
	correct_answer: string | null;
	feedback: string;
};

export default function ProblemsPage() {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [results, setResults] = useState<Record<string, AnswerResult>>({});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProblems() {
			try {
				const res = await fetch(`${BACKEND_URL}/problems`);
				if (!res.ok) throw new Error('Failed to fetch problems');
				const data: Problem[] = await res.json();
				setProblems(data);
			} catch (e: unknown) {
				setError(e instanceof Error ? e.message : String(e));
			}
		}
		fetchProblems();
	}, []);

	const handleChange = (iri: string, value: string) => {
		setAnswers((prev) => ({ ...prev, [iri]: value }));
	};

	const submitAnswer = async (iri: string) => {
		const answer = answers[iri] || '';
		try {
			const res = await fetch(`${BACKEND_URL}/check-answer`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ problem_iri: iri, answer }),
			});
			if (!res.ok) throw new Error('Failed to check answer');
			const data: AnswerResult = await res.json();
			setResults((prev) => ({ ...prev, [iri]: data }));
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : String(e));
		}
	};

	if (error) return <div className='p-6 text-red-600'>{error}</div>;

	return (
		<main className='min-h-screen bg-gray-50 p-6 space-y-6 w-2/3 mx-auto'>
			<header className='flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between'>
				<div>
					<h1 className='text-2xl font-bold'>Practice Problems</h1>
					<p className='text-gray-600'>
						Problems are linked to ontology concepts, so the tutor can reason
						about what you&apos;re practising.
					</p>
					<Link
						href='/'
						className='inline-flex items-center justify-center rounded-lg border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100'
					>
						← Back to concepts
					</Link>
				</div>
			</header>

			{problems.length === 0 && (
				<p className='text-gray-600'>No problems found in the ontology.</p>
			)}

			<div className='space-y-4'>
				{problems.map((p) => {
					const result = results[p.iri];
					return (
						<div
							key={p.iri}
							className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'
						>
							<h2 className='font-semibold mb-1'>{p.label}</h2>
							<p className='text-sm text-gray-800 mb-2 whitespace-pre-line'>
								{p.text}
							</p>

							{p.teaches_concepts.length > 0 && (
								<p className='text-xs text-gray-500 mb-1'>
									Target concepts: {p.teaches_concepts.join(', ')}
								</p>
							)}
							{p.has_hint_concepts.length > 0 && (
								<p className='text-xs text-gray-400 mb-2'>
									Hint concepts: {p.has_hint_concepts.join(', ')}
								</p>
							)}

							<div className='flex flex-col gap-2 md:flex-row md:items-center'>
								<input
									type='text'
									value={answers[p.iri] || ''}
									onChange={(e) => handleChange(p.iri, e.target.value)}
									placeholder='Your answer'
									className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm'
								/>
								<button
									onClick={() => submitAnswer(p.iri)}
									className='rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50'
								>
									Check answer
								</button>
							</div>

							{result && (
								<div
									className={`mt-2 text-sm ${
										result.correct ? 'text-green-700' : 'text-red-700'
									}`}
								>
									{result.feedback}
									{result.correct_answer && !result.correct && (
										<span className='block text-xs text-gray-600'>
											Correct answer: {result.correct_answer}
										</span>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</main>
	);
}
