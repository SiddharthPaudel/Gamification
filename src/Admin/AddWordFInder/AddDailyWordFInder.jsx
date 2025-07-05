import React, { useState } from 'react';
import axios from 'axios';

const AddDailyWordFinder = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [gridSize, setGridSize] = useState(10);
  const [words, setWords] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Placeholder: For now, we'll send an empty grid. You'll want to generate this properly.
  const generateEmptyGrid = (size) => Array(size).fill(null).map(() => Array(size).fill(''));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wordList = words
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (wordList.length === 0) {
      setMessage({ type: 'error', text: 'Please enter at least one word.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const grid = generateEmptyGrid(gridSize);

      const response = await axios.post('http://localhost:5000/api/dailywordfinder/create', {
        date,
        words: wordList,
        grid,
      });

      setMessage({ type: 'success', text: 'Daily Word Finder puzzle created!' });
      setWords('');
      setGridSize(10);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create puzzle.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Daily Word Finder Puzzle</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </label>

        <label className="block mb-2 font-semibold">
          Grid Size (NxN):
          <input
            type="number"
            min="5"
            max="30"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </label>

        <label className="block mb-2 font-semibold">
          Words (comma separated):
          <textarea
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="e.g. apple, banana, cherry"
            className="mt-1 p-2 border rounded w-full"
            rows={4}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Daily Puzzle'}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 font-semibold ${
            message.type === 'error' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default AddDailyWordFinder;
