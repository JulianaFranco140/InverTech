import { useState } from 'react';
import { createAuthHeaders, handleTokenError } from '../lib/tokenUtils';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📡 Fetching oportunidades reales...');

      const response = await fetch('/api/opportunities', {
        method: 'GET',
        headers: createAuthHeaders()
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Oportunidades recibidas:', data);
        
        setOpportunities(data.opportunities || []);
        setFilteredOpportunities(data.opportunities || []);
      } else if (response.status === 401) {
        handleTokenError();
        setError('Sesión expirada');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        setError(errorData.error || 'Error al cargar oportunidades');
      }
    } catch (error) {
      console.error('❌ Error fetching opportunities:', error);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const filterByRisk = (riskLevel) => {
    if (riskLevel === 'Todos') {
      setFilteredOpportunities(opportunities);
    } else {
      const filtered = opportunities.filter(opp => opp.risk === riskLevel);
      setFilteredOpportunities(filtered);
    }
  };

  const searchOpportunities = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredOpportunities(opportunities);
      return;
    }

    const filtered = opportunities.filter(opp => 
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.emprendedor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredOpportunities(filtered);
  };

  return {
    opportunities: filteredOpportunities,
    allOpportunities: opportunities,
    isLoading,
    error,
    fetchOpportunities,
    filterByRisk,
    searchOpportunities
  };
}