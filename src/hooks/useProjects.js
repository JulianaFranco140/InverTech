import { useState } from 'react';
import { createAuthHeaders, handleTokenError } from '../lib/tokenUtils';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      

      const response = await fetch('/api/projects', {
        method: 'GET',
        headers: createAuthHeaders()
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        
        setProjects(data.projects || []);
        setFilteredProjects(data.projects || []);
      } else if (response.status === 401) {
        handleTokenError();
        setError('Sesión expirada');
      } else {
        const errorText = await response.text();
        setError(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      setError(`Error de conexión: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = (filters) => {
    let filtered = [...projects];

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(project => 
        project.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.entrepreneur.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.minRevenue) {
      filtered = filtered.filter(project => 
        project.monthlyRevenue >= filters.minRevenue
      );
    }

    if (filters.minEmployees) {
      filtered = filtered.filter(project => 
        project.employees >= filters.minEmployees
      );
    }

    setFilteredProjects(filtered);
  };

  return {
    projects,
    filteredProjects,
    isLoading,
    error,
    fetchProjects,
    filterProjects
  };
}