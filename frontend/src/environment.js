const baseAPI = import.meta.env.PROD
  ? window.location.origin + "/api" // Uses Render URL in production
  : "https://user-management-system-t09c.onrender.com/api"; // Uses localhost in development

export { baseAPI };
