function currentDate() {
  let date = new Date();
  
  // Format date in user's local timezone
  const dateToday = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      // timeZoneName: 'short'
  });

  // Reformat to YYYY-MM-DD
  const [month, day, year] = dateToday.split('/');
  const formattedDate = `${year}-${month}-${day}`;

  console.log('Local date:', formattedDate);
  return { formattedDate };
}





function getTimerRemaining(score_id) {
  if (activeTimers.has(score_id)) {
      return activeTimers.get(score_id).timeRemaining;
  }
  return null;
}

module.exports = { currentDate, getTimerRemaining };