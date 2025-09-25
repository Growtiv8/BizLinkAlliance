export const GHL = {
  // Chat widget loader
  WIDGET_SCRIPT_URL: import.meta.env.VITE_GHL_WIDGET_SCRIPT_URL || '',
  WIDGET_RESOURCES_URL: import.meta.env.VITE_GHL_WIDGET_RESOURCES_URL || '',

  // Public form/calendar URLs that can be safely embedded client-side
  WAITLIST_FORM_URL: import.meta.env.VITE_GHL_WAITLIST_FORM_URL || '',
  CONTACT_FORM_URL: import.meta.env.VITE_GHL_CONTACT_FORM_URL || '',
  CALENDAR_URL: import.meta.env.VITE_GHL_CALENDAR_URL || '',
};

export function hasChatWidgetConfig() {
  return Boolean(GHL.WIDGET_SCRIPT_URL && GHL.WIDGET_RESOURCES_URL);
}