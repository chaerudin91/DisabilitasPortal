'use client';

import React, { useState } from 'react';
import Header from 'app/components/Header';
import HomePage from 'app/components/HomePage';
import JobPortalPage from 'app/components/JobPortal';
import WorkshopPage from 'app/components/Workshop';
import MentalHealthPage from 'app/components/MentalHealth';
import SpeechToTextPage from 'app/components/SpeechToText';
import { features } from 'app/components/Features';

export default function Page() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'job-portal':
        return <JobPortalPage />;
      case 'workshop':
        return <WorkshopPage />;
      case 'mental-health':
        return <MentalHealthPage />;
      case 'speech-to-text':
        return <SpeechToTextPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} features={features} />
      {renderPage()}
    </div>
  );
}