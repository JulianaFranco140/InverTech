/**
 */

/**
 * @returns {string|null}
 */
export function getToken() {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const token = localStorage.getItem('auth-token');
    console.log('🎫 Token obtenido desde localStorage:', !!token);
    return token;
  } catch (error) {
    console.error(' Error obteniendo token:', error);
    return null;
  }
}

/**
 * @param {string} token
 * @returns {boolean} 
 */
export function setToken(token) {
  try {
    if (typeof window === 'undefined') {
      console.warn('No se puede guardar token en servidor side');
      return false;
    }
    
    if (!token) {
      console.warn('Intentando guardar token vacío');
      return false;
    }
    
    localStorage.setItem('auth-token', token);
    console.log('Token guardado exitosamente en localStorage');
    return true;
  } catch (error) {
    console.error('Error guardando token:', error);
    return false;
  }
}

/**
 * @returns {boolean} 
 */
export function removeToken() {
  try {
    if (typeof window === 'undefined') {
      console.warn(' No se puede eliminar token en servidor side');
      return false;
    }
    
    localStorage.removeItem('auth-token');
    console.log('Token eliminado del localStorage');
    return true;
  } catch (error) {
    console.error('Error eliminando token:', error);
    return false;
  }
}

/**

 * @param {string} token 
 * @returns {Object|null} 
 */
export function getTokenPayload(token) {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    console.log('Token payload decodificado:', payload);
    return payload;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

/**
 * @param {string} token 
 * @returns {boolean} 
 */
export function isTokenValid(token) {
  try {
    if (!token) return false;
    
    const payload = getTokenPayload(token);
    if (!payload || !payload.exp) return false;
    
    const isValid = payload.exp > Date.now() / 1000;
    console.log('🔍 Token válido:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error validando token:', error);
    return false;
  }
}

/**
 * @returns {Object} 
 */
export function createAuthHeaders() {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Headers de autorización creados');
  } else {
    console.log('Headers creados sin autorización (no hay token)');
  }
  
  return headers;
}

/**
 * @returns {void}
 */
export function handleTokenError() {
  console.log('Token inválido o expirado - Limpiando localStorage');
  removeToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export function getAuthToken() {
  return getToken();
}