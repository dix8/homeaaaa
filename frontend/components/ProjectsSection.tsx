import React from 'react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects?: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Projects</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white shadow rounded-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
            <div className="relative h-48 cursor-pointer group">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-contain bg-gray-50 p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 p-2">
                  <div className="text-center">
                    <svg 
                      className="mx-auto h-12 w-12 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">暂无图片</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          暂无项目
        </div>
      )}
    </div>
  );
}

export default ProjectsSection; 