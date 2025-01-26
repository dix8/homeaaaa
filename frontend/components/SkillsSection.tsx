import React from 'react';
import { Skill } from '../types';

interface SkillsSectionProps {
  skills?: Skill[];
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  // 临时数据，后续会从API获取
  const tempSkills = [
    { id: 1, name: "React", category: "Frontend", proficiency: 90 },
    { id: 2, name: "Node.js", category: "Backend", proficiency: 85 },
    { id: 3, name: "TypeScript", category: "Language", proficiency: 88 },
    { id: 4, name: "MySQL", category: "Database", proficiency: 82 }
  ];

  const displaySkills = skills || tempSkills;
  const categories = Array.from(new Set(displaySkills.map(skill => skill.category)));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displaySkills
                .filter(skill => skill.category === category)
                .map(skill => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-gray-600">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection; 