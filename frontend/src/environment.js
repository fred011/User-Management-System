const baseAPI = import.meta.env.PROD
  ? window.location.origin + "/api" // Uses Render URL in production
  : "http://localhost:5000/api"; // Uses localhost in development

export { baseAPI };
