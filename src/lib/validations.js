export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: 'La contraseña es requerida'
    };
  }
  
  return {
    isValid: password.length >= 8,
    message: password.length >= 8 ? '' : 'La contraseña debe tener al menos 8 caracteres'
  };
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      message: 'El teléfono es requerido'
    };
  }

  const cleanPhone = phone.replace(/\s/g, '');
  const phoneRegex = /^[+]?[0-9]{10,15}$/;

  return {
    isValid: phoneRegex.test(cleanPhone),
    message: phoneRegex.test(cleanPhone) ? '' : 'El teléfono debe tener entre 10 y 15 números'
  };
}

export function validateRegisterData(data) {
  const errors = [];

  console.log('🔍 Validando datos:', data);

  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (!validateEmail(data.email)) {
    errors.push('Email inválido');
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.message);
  }

  if (!data.confirmPassword || data.password !== data.confirmPassword) {
    errors.push('Las contraseñas no coinciden');
  }

  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid) {
    errors.push(phoneValidation.message);
  }

  if (!data.rol_id || data.rol_id !== 1 && data.rol_id !== 2) {
    errors.push('Rol inválido');
  }

  const result = {
    isValid: errors.length === 0,
    errors
  };

  console.log('🔍 Resultado validación:', result);
  return result; // ⭐ ESTO FALTABA
}