class ConvertTime {
  static convertTime(data) {
    const updatedAt = new Date(data.updated_at);
    const currentDate = new Date(); // time now
    const seconds = (currentDate.getTime() - updatedAt.getTime()) / 1000;
    const hours = seconds / (60 * 60);
    return hours
  }
}