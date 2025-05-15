export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('mn-MN', options);
};

export const logAdminAction = async (adminId, actionType, target) => {
  try {
    await fetch('/api/admin/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminId,
        actionType,
        target,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Action logging failed:', error);
  }
};