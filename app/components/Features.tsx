import React from 'react';
import { Briefcase, GraduationCap, MessageCircle, Mic } from 'lucide-react';

export const features = [
  {
    id: 'job-portal',
    icon: <Briefcase className="w-8 h-8" />,
    title: "Job Portal",
    description: "Find deaf-friendly jobs with visual communication support",
    color: "from-blue-500 to-blue-600",
    page: 'job-portal'
  },
  {
    id: 'workshop',
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Workshop",
    description: "Learn new skills through visual tutorials and sign language",
    color: "from-green-500 to-green-600",
    page: 'workshop'
  },
  {
    id: 'mental-health',
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Mental Health Chat",
    description: "AI-powered mental health support with visual assistance",
    color: "from-purple-500 to-purple-600",
    page: 'mental-health'
  },
  {
    id: 'speech-to-text',
    icon: <Mic className="w-8 h-8" />,
    title: "Speech to Text",
    description: "Convert speech to text for better communication",
    color: "from-red-500 to-red-600",
    page: 'speech-to-text'
  }
];