'use client';

import { useState } from 'react';

export default function EmailSignup() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get('email') || '').toString().trim();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.style.display = 'none';
      } else {
        alert('Oops! There was a problem submitting your form.');
      }
    } catch {
      alert('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        action="https://formspree.io/f/xpwlnyoe"
        method="POST"
        className="flex flex-wrap justify-center gap-3 mb-6"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          disabled={isLoading}
          className="px-4 py-3 text-lg border-2 border-hiko-yellow/30 rounded-lg w-64 max-w-full outline-none focus:ring-4 focus:ring-hiko-yellow/25 focus:border-hiko-yellow focus:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 text-lg font-bold border-2 border-hiko-yellow bg-hiko-yellow text-hiko-green rounded-lg hover:bg-transparent hover:text-hiko-yellow hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Get Early Access'}
        </button>
      </form>
      
      {isSubmitted && (
        <div className="mt-4 font-semibold text-white text-lg animate-fade-in">
          🎉 Thank you! We&apos;ll be in touch soon.
        </div>
      )}
    </>
  );
}

