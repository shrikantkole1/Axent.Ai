/**
 * Branch-wise engineering syllabus data
 * Students can select their branch, year, and subject to add to their roadmap
 */
export interface BranchSyllabus {
  branch: string;
  years: {
    year: number;
    subjects: string[];
  }[];
}

export const ENGINEERING_SYLLABUS: BranchSyllabus[] = [
  {
    branch: 'Mechanical Engineering',
    years: [
      {
        year: 1,
        subjects: [
          'Engineering Mathematics',
          'Physics',
          'Chemistry',
          'Engineering Mechanics',
          'Workshop Practice',
          'Programming Basics'
        ]
      },
      {
        year: 2,
        subjects: [
          'Engineering Thermodynamics',
          'Fluid Mechanics',
          'Strength of Materials',
          'Manufacturing Technology',
          'Theory of Machines',
          'Electrical & Electronics Engineering'
        ]
      },
      {
        year: 3,
        subjects: [
          'Heat and Mass Transfer',
          'Design of Machine Elements',
          'Metrology',
          'CAD/CAM',
          'Mechatronics',
          'Dynamics of Machinery'
        ]
      },
      {
        year: 4,
        subjects: [
          'Refrigeration & Air Conditioning',
          'Industrial Engineering',
          'Power Plant Engineering',
          'Maintenance Engineering',
          'Project Work'
        ]
      }
    ]
  },
  {
    branch: 'Civil Engineering',
    years: [
      {
        year: 1,
        subjects: [
          'Mathematics',
          'Physics',
          'Chemistry',
          'Engineering Graphics',
          'Basic Mechanical Engineering',
          'Environmental Science'
        ]
      },
      {
        year: 2,
        subjects: [
          'Strength of Materials',
          'Surveying',
          'Fluid Mechanics',
          'Building Materials',
          'Structural Analysis',
          'Construction Technology'
        ]
      },
      {
        year: 3,
        subjects: [
          'Geotechnical Engineering',
          'Transportation Engineering',
          'Environmental Engineering',
          'Irrigation Engineering',
          'Quantity Surveying'
        ]
      },
      {
        year: 4,
        subjects: [
          'Design of RC & Steel Structures',
          'Foundation Engineering',
          'Hydrology',
          'Construction Management',
          'Professional Electives',
          'Project'
        ]
      }
    ]
  },
  {
    branch: 'Electrical Engineering',
    years: [
      {
        year: 1,
        subjects: [
          'Mathematics',
          'Physics',
          'Chemistry',
          'Basic Electrical & Electronics',
          'Engineering Mechanics',
          'Programming'
        ]
      },
      {
        year: 2,
        subjects: [
          'Electrical Circuit Analysis',
          'Electrical Machines I & II',
          'Power Systems I',
          'Control Systems',
          'Measurements',
          'Analog/Digital Electronics'
        ]
      },
      {
        year: 3,
        subjects: [
          'Power Electronics',
          'Microprocessors',
          'Power Systems II',
          'Electrical Drives',
          'High Voltage Engineering',
          'Renewable Energy'
        ]
      },
      {
        year: 4,
        subjects: [
          'Switchgear & Protection',
          'Utilization of Electrical Energy',
          'Advanced Control',
          'Power System Operation',
          'Project Work'
        ]
      }
    ]
  },
  {
    branch: 'Chemical Engineering',
    years: [
      {
        year: 1,
        subjects: [
          'Mathematics',
          'Physics',
          'Chemistry',
          'Engineering Drawing',
          'Workshop',
          'Basic Electrical/Mechanical'
        ]
      },
      {
        year: 2,
        subjects: [
          'Fluid Flow Operations',
          'Chemical Process Calculations',
          'Heat Transfer',
          'Mechanical Operations',
          'Material & Energy Balance'
        ]
      },
      {
        year: 3,
        subjects: [
          'Mass Transfer',
          'Chemical Reaction Engineering',
          'Process Control',
          'Instrumentation',
          'Petroleum Technology',
          'Environmental Engineering'
        ]
      },
      {
        year: 4,
        subjects: [
          'Process Equipment Design',
          'Transport Phenomena',
          'Energy Conservation',
          'Plant Utilities',
          'Project',
          'Electives'
        ]
      }
    ]
  },
  {
    branch: 'Computer Science Engineering',
    years: [
      {
        year: 1,
        subjects: [
          'Mathematics',
          'Physics',
          'Chemistry',
          'Programming (C/Python)',
          'Engineering Graphics',
          'Basic Electrical'
        ]
      },
      {
        year: 2,
        subjects: [
          'Data Structures',
          'Digital Logic',
          'Discrete Mathematics',
          'Computer Organization',
          'Operating Systems',
          'Database Management'
        ]
      },
      {
        year: 3,
        subjects: [
          'Design & Analysis of Algorithms',
          'Computer Networks',
          'Software Engineering',
          'Theory of Computation',
          'Web Technologies',
          'AI/ML'
        ]
      },
      {
        year: 4,
        subjects: [
          'Compiler Design',
          'Cloud Computing',
          'Cybersecurity',
          'Embedded Systems',
          'Electives',
          'Major Project'
        ]
      }
    ]
  },
  {
    branch: 'Electronics Engineering (ECE)',
    years: [
      {
        year: 1,
        subjects: [
          'Mathematics',
          'Physics',
          'Chemistry',
          'Basic Mechanical Engineering',
          'Workshop',
          'Environmental Science'
        ]
      },
      {
        year: 2,
        subjects: [
          'Circuit Theory',
          'Electronic Devices',
          'Digital Logic Design',
          'Power Electronics',
          'Measurements',
          'Electromagnetics'
        ]
      },
      {
        year: 3,
        subjects: [
          'Analog & Digital Communication',
          'Control Systems',
          'Microcontrollers',
          'RF Engineering',
          'PCB Design',
          'Instrumentation'
        ]
      },
      {
        year: 4,
        subjects: [
          'Advanced Electronics',
          'Nanotechnology',
          'Robotics',
          'Renewable Energy Systems',
          'Major Project',
          'Electives'
        ]
      }
    ]
  },
  {
    branch: 'Information Technology (IT)',
    years: [
      {
        year: 1,
        subjects: [
          'Mathematics',
          'Physics',
          'Chemistry',
          'Programming (C/Python)',
          'Engineering Graphics',
          'Basic Electrical'
        ]
      },
      {
        year: 2,
        subjects: [
          'Data Structures',
          'DBMS',
          'Computer Networks',
          'Web Technologies',
          'Operating Systems',
          'Software Engineering'
        ]
      },
      {
        year: 3,
        subjects: [
          'Cloud Computing',
          'Cybersecurity',
          'Mobile Computing',
          'Data Mining',
          'Human-Computer Interaction',
          'IT Project Management'
        ]
      },
      {
        year: 4,
        subjects: [
          'Big Data',
          'Blockchain',
          'AI in IT',
          'Network Security',
          'Major Project',
          'Electives'
        ]
      }
    ]
  },
  {
    branch: 'Artificial Intelligence and Data Science (AI & DS)',
    years: [
      {
        year: 1,
        subjects: [
          'Mathematics',
          'Programming (C/Python)',
          'Physics',
          'Chemistry',
          'Discrete Structures',
          'AI Fundamentals'
        ]
      },
      {
        year: 2,
        subjects: [
          'Data Structures',
          'Machine Learning',
          'Statistics',
          'Database Systems',
          'Computer Networks',
          'Python for AI'
        ]
      },
      {
        year: 3,
        subjects: [
          'Deep Learning',
          'Data Analytics',
          'Natural Language Processing',
          'Computer Vision',
          'Reinforcement Learning',
          'AI Lab'
        ]
      },
      {
        year: 4,
        subjects: [
          'Big Data Technologies',
          'AI Ethics',
          'Advanced ML',
          'Capstone Project',
          'Electives (NLP, Robotics, Quantum Computing)'
        ]
      }
    ]
  }
];

export function getSubjectsForBranchYear(branch: string, year: number): string[] {
  const branchData = ENGINEERING_SYLLABUS.find(b => b.branch === branch);
  if (!branchData) return [];
  const yearData = branchData.years.find(y => y.year === year);
  return yearData?.subjects ?? [];
}
